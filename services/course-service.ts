import { API_BASE_URL, COURSES_PATH } from "@/constants/api-paths";
import { CreateCourseEnDto, UpdateCourseEnDto, UpdateCourseSiDto } from "@/dtos/course-dto";
import DocumentStatus from "@/enums/document-status";
import { handleApiError } from "@/errors/api-error-handler";
import Course from "@/interfaces/i-course";
import CourseView from "@/interfaces/i-course-view";
import PaginatedResult from "@/interfaces/i-paginated-result";
import { SummaryStat, YearlyGroupStat } from "@/interfaces/i-stat";
import { buildHeaders, handleFetchResponse } from "@/utils/common-utils";
import axios from "axios";

export const getCourses = async (page: number, size: number): Promise<PaginatedResult<Course>> => {
  try {
    const response = await axios.get<PaginatedResult<Course>>(`${API_BASE_URL}${COURSES_PATH}`, {
      params: {
        page,
        size,
      },
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getCourseById = async (id: string): Promise<Course> => {
  try {
    const response = await axios.get<Course>(`${API_BASE_URL}${COURSES_PATH}/id/${id}`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getCourseByPath = async (lang: string, path: string): Promise<CourseView> => {
  try {
    const response = await axios.get<CourseView>(`${API_BASE_URL}${COURSES_PATH}/path/${path}`, {
      params: {
        lang,
      },
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getCachedCourseByPath = async (lang: string, path: string): Promise<CourseView> => {
  try {
    const url = `${API_BASE_URL}${COURSES_PATH}/path/${path}?lang=${lang}`;
    
    const response = await fetch(url, {
      next: {
        revalidate: 3600, // cache for 1 hour
        tags: ['course-views', `course-view-${path}`, `course-view-${path}-${lang}`] // For on-demand revalidation
      },
    });

    return await handleFetchResponse(response, `Failed to fetch course: ${path}`);
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getActivatedCourses = async (lang: string, page: number, size: number): Promise<PaginatedResult<CourseView>> => {
  try {
    const response = await axios.get<PaginatedResult<CourseView>>(`${API_BASE_URL}${COURSES_PATH}/search`, {
      params: {
        q: '',
        page,
        size,
        status: DocumentStatus.ACTIVE,
        sort: 'latest',
        lang,
      },
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getCachedActivatedCourses = async (lang: string, page: number, size: number): Promise<PaginatedResult<CourseView>> => {
  try {
    const url = `${API_BASE_URL}${COURSES_PATH}/search?q=&page=${page}&size=${size}&status=${DocumentStatus.ACTIVE}&sort=latest&lang=${lang}`;

    const response = await fetch(url, {
      next: {
        revalidate: 3600, // cache for 1 hour
        tags: ['course-views', `course-views-${lang}`] // For on-demand revalidation
      },
    });

    return await handleFetchResponse(response, `Failed to fetch courses`);
  } catch (error) {
    throw handleApiError(error);
  }
};

export const activateCourse = async (id: string, token: string): Promise<Course> => {
  try {
    const response = await axios.patch<Course>(
      `${API_BASE_URL}${COURSES_PATH}/${id}/toggle`,
      { status: DocumentStatus.ACTIVE },
      buildHeaders(token)
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const deactivateCourse = async (id: string, token: string): Promise<Course> => {
  try {
    const response = await axios.patch<Course>(
      `${API_BASE_URL}${COURSES_PATH}/${id}/toggle`,
      { status: DocumentStatus.INACTIVE },
      buildHeaders(token)
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const deleteCourse = async (id: string, token: string) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}${COURSES_PATH}/${id}`,
      buildHeaders(token)
    );
    if (response.status !== 204) {
      throw new Error('Failed to delete course');
    }
    return { id, message: 'Course deleted successfully' };
  } catch (error) {
    throw handleApiError(error);
  }
};

export const createCourseEn = async (courseEnDto: CreateCourseEnDto, token: string): Promise<Course> => {
  try {
    const response = await axios.post<Course>(
      `${API_BASE_URL}${COURSES_PATH}`,
      courseEnDto,
      buildHeaders(token)
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const updateCourseSi = async (id: string, courseSiDto: UpdateCourseSiDto, token: string): Promise<Course> => {
  try {
    const response = await axios.patch<Course>(
      `${API_BASE_URL}${COURSES_PATH}/${id}/si`,
      courseSiDto,
      buildHeaders(token)
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const updateCourseEn = async (id: string, courseEnDto: UpdateCourseEnDto, token: string): Promise<Course> => {
  try {
    const response = await axios.patch<Course>(
      `${API_BASE_URL}${COURSES_PATH}/${id}/en`,
      courseEnDto,
      buildHeaders(token)
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getCourseSummary = async (): Promise<SummaryStat> => {
  try {
    const response = await axios.get<SummaryStat>(
      `${API_BASE_URL}${COURSES_PATH}/stats/summary`
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getYearlyCoursesByType = async (): Promise<YearlyGroupStat[]> => {
  try {
    const response = await axios.get<YearlyGroupStat[]>(
      `${API_BASE_URL}${COURSES_PATH}/stats/yearly-by-type`
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};
