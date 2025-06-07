import { CreateCourseEnDto, UpdateCourseEnDto, UpdateCourseSiDto } from "@/dtos/course-dto";
import DocumentStatus from "@/enums/document-status";
import { ApiError } from "@/errors/api-error";
import Course from "@/interfaces/i-course";
import CourseView from "@/interfaces/i-course-view";
import PaginatedResult from "@/interfaces/i-paginated-result";
import {
  activateCourse,
  createCourseEn,
  deactivateCourse,
  deleteCourse,
  getActivatedCourses,
  getCourseById,
  getCourseByPath,
  getCourses,
  updateCourseEn,
  updateCourseSi
} from "@/services/course-service";
import { useAuth } from "@clerk/nextjs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useCoursesQuery = (page: number, size: number, initialCourses?: PaginatedResult<Course>) => {
  return useQuery<PaginatedResult<Course>, ApiError>({
    queryKey: ['courses', page, size],
    queryFn: () => getCourses(page, size),
    initialData: initialCourses,
    initialDataUpdatedAt: 0, // Marks initial data as stale, so React Query refetches when `page` changes
    placeholderData: (prevData) => prevData ?? { 
      items: [], 
      pagination: { totalCount: 0, totalPages: 1, currentPage: page, currentPageSize: 0 } 
    }, // Keeps previous data until new data loads
    refetchOnWindowFocus: false, // Prevents unnecessary API calls when switching tabs
  });
};

export const useCourseViewsQuery = (lang: string, page: number, size: number) => {
  return useQuery<PaginatedResult<CourseView>, ApiError>({
    queryKey: ['course-views', lang, page, size],
    queryFn: () => getActivatedCourses(lang, page, size),
    placeholderData: (prevData) => prevData ?? { 
      items: [], 
      pagination: { totalCount: 0, totalPages: 1, currentPage: page, currentPageSize: 0 } 
    },
    refetchOnWindowFocus: false,
  });
};

export const useCourseByIdQuery = (id: string) => {
  return useQuery<Course, ApiError>({
    queryKey: ['course', id],
    queryFn: () => getCourseById(id),
    refetchOnWindowFocus: false, // Prevents unnecessary API calls when switching tabs
  });
};

export const useCourseViewByPathQuery = (lang: string, path: string) => {
  return useQuery<CourseView, ApiError>({
    queryKey: ['course', lang, path],
    queryFn: () => getCourseByPath(lang, path),
    refetchOnWindowFocus: false,
  });
};

export const useActivateCourseMutation = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async (id: string) => {
      const token = (await getToken()) ?? '';
      return activateCourse(id, token);
    },
    onSuccess: (_, id) => {
      // Update cache instantly instead of re-fetching
      queryClient.setQueryData(['course', id], (oldData: Course | undefined) => {
        if (!oldData) return;
        return { ...oldData, status: DocumentStatus.ACTIVE };
      });

      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
  });
};

export const useDeactivateCourseMutation = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async (id: string) => {
      const token = (await getToken()) ?? '';
      return deactivateCourse(id, token);
    },
    onSuccess: (_, id) => {
      // Update cache instantly
      queryClient.setQueryData(['course', id], (oldData: Course | undefined) => {
        if (!oldData) return;
        return { ...oldData, status: DocumentStatus.INACTIVE };
      });

      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
  });
};

export const useDeleteCourseMutation = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async (id: string) => {
      const token = (await getToken()) ?? '';
      return deleteCourse(id, token);
    },
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: ['course', id] });

      // Update paginated list cache by filtering out the deleted course
      queryClient.setQueryData(['courses'], (oldData: PaginatedResult<Course> | undefined) => {
        if (!oldData) return;
        return {
          ...oldData,
          items: oldData.items.filter(course => course.id !== id), // Remove deleted course
        };
      });

      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
  });
};

export const useCreateCourseEnMutation = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation<Course, ApiError, CreateCourseEnDto, { previousCourses?: PaginatedResult<Course> }>({
    mutationFn: async (courseEnDto: CreateCourseEnDto) => {
      const token = (await getToken()) ?? '';
      return createCourseEn(courseEnDto, token);
    },
    onMutate: async (newCourseData) => {
      await queryClient.cancelQueries({ queryKey: ['courses'] });

      // Snapshot previous data for rollback
      const previousCourses = queryClient.getQueryData<PaginatedResult<Course>>(['courses']);

      // Define a fallback pagination structure
      const defaultPagination = { totalCount: 1, totalPages: 1, currentPage: 1, currentPageSize: 1 };

      // Optimistically add a new temporary course
      queryClient.setQueryData(['courses'], (oldData?: PaginatedResult<Course>) => {
        if (!oldData) return { 
          items: [{ id: 'temp-id', ...newCourseData }], 
          pagination: defaultPagination,
        };

        return {
          ...oldData,
          items: [{ id: 'temp-id', ...newCourseData }, ...oldData.items],
          pagination: { 
            ...oldData.pagination, 
            totalCount: oldData.pagination.totalCount + 1, // Optimistically increment total count
          },
        };
      });

      return { previousCourses };
    },
    onSuccess: (createdCourse) => {
      if (!createdCourse || !createdCourse.id) return;

      // Replace temporary course with actual data
      queryClient.setQueryData(['courses'], (oldData?: PaginatedResult<Course>) => {
        if (!oldData) return { 
          items: [createdCourse], 
          pagination: { totalCount: 1, totalPages: 1, currentPage: 1, currentPageSize: 1 } 
        };

        return {
          ...oldData,
          items: oldData.items.map((course) =>
            course.id === 'temp-id' ? createdCourse : course
          ),
          pagination: {
            ...oldData.pagination,
            totalCount: Math.max(oldData.pagination.totalCount, oldData.items.length), // Ensure totalCount remains correct
          },
        };
      });

      // Cache the individual course
      queryClient.setQueryData(['course', createdCourse.id], createdCourse);
    },
    onError: (error, _newCourseData, context) => {
      // Rollback to the previous state in case of failure
      if (context?.previousCourses) {
        queryClient.setQueryData(['courses'], context.previousCourses);
      }
    },
    onSettled: () => {
      // Refetch in background to sync with backend
      queryClient.invalidateQueries({ queryKey: ['courses'], refetchType: 'active' });
    },
  });
};

export const useUpdateCourseSiMutation = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async (variables: {id: string, courseSiDto: UpdateCourseSiDto}) => {
      const token = (await getToken()) ?? '';
      return updateCourseSi(variables.id, variables.courseSiDto, token);
    },
    onSuccess: (updatedCourse) => {
      if (!updatedCourse || !updatedCourse.id) return;

      // Update course list cache
      queryClient.setQueryData(['courses'], (oldData?: PaginatedResult<Course>) => {
        if (!oldData) return;

        return {
          ...oldData,
          items: oldData.items.map((course) => 
            course.id === updatedCourse.id ? updatedCourse : course
          ),
        };
      });

      // Update individual course cache
      queryClient.setQueryData(['course', updatedCourse.id], updatedCourse);
    },
    onSettled: (_data, _error, variables) => {
      // Refetch only the updated course instead of all courses
      queryClient.invalidateQueries({ queryKey: ['course', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['courses'], refetchType: 'active' });
    },
  });
};

export const useUpdateCourseEnMutation = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async (variables: {id: string, courseEnDto: UpdateCourseEnDto}) => {
      const token = (await getToken()) ?? '';
      return updateCourseEn(variables.id, variables.courseEnDto, token);
    },
    onSuccess: (updatedCourse) => {
      if (!updatedCourse || !updatedCourse.id) return;

      // Update course list cache
      queryClient.setQueryData(['courses'], (oldData?: PaginatedResult<Course>) => {
        if (!oldData) return;

        return {
          ...oldData,
          items: oldData.items.map((course) => 
            course.id === updatedCourse.id ? updatedCourse : course
          ),
        };
      });

      // Update individual course cache
      queryClient.setQueryData(['course', updatedCourse.id], updatedCourse);
    },
    onSettled: (_data, _error, variables) => {
      // Refetch only the updated course instead of all courses
      queryClient.invalidateQueries({ queryKey: ['course', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['courses'], refetchType: 'active' });
    },
  });
};

