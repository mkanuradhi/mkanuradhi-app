import DocumentStatus from "@/enums/document-status";
import { ApiError } from "@/errors/api-error";
import Mcq from "@/interfaces/i-mcq";
import PaginatedResult from "@/interfaces/i-paginated-result";
import { activateMcq, deactivateMcq, deleteMcq, getMcqById, getMcqs } from "@/services/mcq-service";
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

export const useMcqByIdQuery = (quizId: string, mcqId: string) => {
  return useQuery<Mcq, ApiError>({
    queryKey: ['mcq', mcqId],
    queryFn: () => getMcqById(quizId, mcqId),
    refetchOnWindowFocus: false,
  });
};

export const useActivateMcqMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: {quizId: string, mcqId: string}) => activateMcq(variables.quizId, variables.mcqId),
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

  return useMutation({
    mutationFn: (variables: {quizId: string, mcqId: string}) => deactivateMcq(variables.quizId, variables.mcqId),
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

  return useMutation({
    mutationFn: (variables: {quizId: string, mcqId: string}) => deleteMcq(variables.quizId, variables.mcqId),
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
