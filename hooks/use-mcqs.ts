import { CreateMcqDto, UpdateMcqDto } from "@/dtos/mcq-dto";
import DocumentStatus from "@/enums/document-status";
import { ApiError } from "@/errors/api-error";
import Mcq from "@/interfaces/i-mcq";
import PaginatedResult from "@/interfaces/i-paginated-result";
import { activateMcq, createMcq, deactivateMcq, deleteMcq, getActiveMcqs, getMcqById, getMcqs, updateMcq } from "@/services/mcq-service";
import { useAuth } from "@clerk/nextjs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";


export const useMcqsQuery = (quizId: string) => {
  return useQuery<PaginatedResult<Mcq>, ApiError>({
    queryKey: ['mcqs', quizId],
    queryFn: () => getMcqs(quizId, 0, 50),
    placeholderData: (prevData) => prevData ?? {
      items: [], 
      pagination: { totalCount: 0, totalPages: 1, currentPage: 0, currentPageSize: 0 } 
    }, // Keeps previous data until new data loads
    refetchOnWindowFocus: false, // Prevents unnecessary API calls when switching tabs
  });
};

export const useActiveMcqsQuery = (quizId: string) => {
  return useQuery<PaginatedResult<Mcq>, ApiError>({
    queryKey: ['mcqs', quizId],
    queryFn: () => getActiveMcqs(quizId, 0, 50),
    placeholderData: (prevData) => prevData ?? {
      items: [], 
      pagination: { totalCount: 0, totalPages: 1, currentPage: 0, currentPageSize: 0 } 
    }, // Keeps previous data until new data loads
    refetchOnWindowFocus: false, // Prevents unnecessary API calls when switching tabs
  });
};

export const useMcqByIdQuery = (quizId: string, mcqId: string) => {
  return useQuery<Mcq, ApiError>({
    queryKey: ['mcq', mcqId],
    queryFn: () => getMcqById(quizId, mcqId),
    refetchOnWindowFocus: false,
  });
};

export const useActivateMcqMutation = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async (variables: {quizId: string, mcqId: string}) => {
      const token = (await getToken()) ?? '';
      return activateMcq(variables.quizId, variables.mcqId, token);
    },
    onSuccess: (_, values) => {
      // Update cache instantly instead of re-fetching
      queryClient.setQueryData(['mcq', values.mcqId], (oldData: Mcq | undefined) => {
        if (!oldData) return;
        return { ...oldData, status: DocumentStatus.ACTIVE };
      });

      queryClient.invalidateQueries({ queryKey: ['mcqs', values.quizId] });
      queryClient.invalidateQueries({ queryKey: ['mcq', values.mcqId] });
      queryClient.invalidateQueries({ queryKey: ['quiz', values.quizId] });
    },
  });
};

export const useDeactivateMcqMutation = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async (variables: {quizId: string, mcqId: string}) => {
      const token = (await getToken()) ?? '';
      return deactivateMcq(variables.quizId, variables.mcqId, token);
    },
    onSuccess: (_, values) => {
      // Update cache instantly
      queryClient.setQueryData(['mcq', values.mcqId], (oldData: Mcq | undefined) => {
        if (!oldData) return;
        return { ...oldData, status: DocumentStatus.INACTIVE };
      });

      queryClient.invalidateQueries({ queryKey: ['mcqs', values.quizId] });
      queryClient.invalidateQueries({ queryKey: ['mcq', values.mcqId] });
      queryClient.invalidateQueries({ queryKey: ['quiz', values.quizId] });
    },
  });
};

export const useDeleteMcqMutation = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async (variables: {quizId: string, mcqId: string}) => {
      const token = (await getToken()) ?? '';
      return deleteMcq(variables.quizId, variables.mcqId, token);
    },
    onSuccess: (_, values) => {
      queryClient.removeQueries({ queryKey: ['mcq', values.mcqId] });

      // Update paginated list cache by filtering out the deleted course
      queryClient.setQueryData(['mcqs'], (oldData: PaginatedResult<Mcq> | undefined) => {
        if (!oldData) return;
        return {
          ...oldData,
          items: oldData.items.filter(mcq => mcq.id !== values.mcqId), // Remove deleted mcq
        };
      });

      queryClient.invalidateQueries({ queryKey: ['mcqs', values.quizId] });
      queryClient.invalidateQueries({ queryKey: ['quizzes'] });
      queryClient.invalidateQueries({ queryKey: ['quiz', values.quizId] });
    },
  });
};

export const useCreateMcqMutation = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation<Mcq, ApiError, { quizId: string; mcqDto: CreateMcqDto }>({
    mutationFn: async ({ quizId, mcqDto }) => {
      const token = (await getToken()) ?? '';
      return createMcq(quizId, mcqDto, token);
    },

    onSuccess: (createdMcq, { quizId }) => {
      if (!createdMcq || !createdMcq.id) return;

      const defaultPagination = { totalCount: 1, totalPages: 1, currentPage: 0, currentPageSize: 1 };

      // Update mcq list
      queryClient.setQueryData(["mcqs", quizId], (oldData?: PaginatedResult<Mcq>) => {
        if (!oldData) {
          return {
            items: [createdMcq],
            pagination: defaultPagination,
          };
        }

        return {
          ...oldData,
          items: [createdMcq, ...oldData.items],
          pagination: {
            ...oldData.pagination,
            totalCount: oldData.pagination.totalCount + 1,
          },
        };
      });

      queryClient.setQueryData(["mcq", createdMcq.id], createdMcq);
    },

    // Optional: handle errors
    onError: (error) => {
      console.error("Create MCQ failed:", error);
    },
  });
};

export const useUpdateMcqMutation = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async (variables: {quizId: string, mcqId: string, mcqDto: UpdateMcqDto}) => {
      const token = (await getToken()) ?? '';
      return updateMcq(variables.quizId, variables.mcqId, variables.mcqDto, token);
    },
    onSuccess: (updatedMcq) => {
      if (!updatedMcq || !updatedMcq.id) return;

      // Update mcq list cache
      queryClient.setQueryData(['mcqs', updatedMcq.quizId], (oldData?: PaginatedResult<Mcq>) => {
        if (!oldData) return;

        return {
          ...oldData,
          items: oldData.items.map((mcq) => 
            mcq.id === updatedMcq.id ? updatedMcq : mcq
          ),
        };
      });

      // Update individual mcq cache
      queryClient.setQueryData(['mcq', updatedMcq.id], updatedMcq);
    },
    onSettled: (_data, _error, variables) => {
      // Refetch only the updated mcq instead of all courses
      queryClient.invalidateQueries({ queryKey: ['mcq', variables.mcqId] });
      queryClient.invalidateQueries({ queryKey: ['mcqs', variables.quizId], refetchType: 'active' });
    },
  });
};
