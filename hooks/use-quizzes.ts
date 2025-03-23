import DocumentStatus from "@/enums/document-status";
import { ApiError } from "@/errors/api-error";
import PaginatedResult from "@/interfaces/i-paginated-result";
import Quiz from "@/interfaces/i-quiz";
import { activateQuiz, deactivateQuiz, deleteQuiz, getQuizById, getQuizzes } from "@/services/quiz-service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useQuizzesQuery = (courseId: string) => {
  return useQuery<PaginatedResult<Quiz>, ApiError>({
    queryKey: ['quizzes', courseId],
    queryFn: () => getQuizzes(courseId, 0, 20),
    placeholderData: (prevData) => prevData ?? { 
      items: [], 
      pagination: { totalCount: 0, totalPages: 1, currentPage: 0, currentPageSize: 0 } 
    }, // Keeps previous data until new data loads
    refetchOnWindowFocus: false, // Prevents unnecessary API calls when switching tabs
  });
};

export const useQuizByIdQuery = (courseId: string, quizId: string) => {
  return useQuery<Quiz, ApiError>({
    queryKey: ['quiz', quizId],
    queryFn: () => getQuizById(courseId, quizId),
    refetchOnWindowFocus: false,
  });
};

export const useActivateQuizMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: {courseId: string, quizId: string}) => activateQuiz(variables.courseId, variables.quizId),
    onSuccess: (_, values) => {
      // Update cache instantly instead of re-fetching
      queryClient.setQueryData(['quiz', values.quizId], (oldData: Quiz | undefined) => {
        if (!oldData) return;
        return { ...oldData, status: DocumentStatus.ACTIVE };
      });

      queryClient.invalidateQueries({ queryKey: ['quizzes', values.courseId] });
      queryClient.invalidateQueries({ queryKey: ['quiz', values.quizId] });
      queryClient.invalidateQueries({ queryKey: ['course', values.courseId] });
    },
  });
};

export const useDeactivateQuizMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: {courseId: string, quizId: string}) => deactivateQuiz(variables.courseId, variables.quizId),
    onSuccess: (_, values) => {
      // Update cache instantly
      queryClient.setQueryData(['quiz', values.quizId], (oldData: Quiz | undefined) => {
        if (!oldData) return;
        return { ...oldData, status: DocumentStatus.INACTIVE };
      });

      queryClient.invalidateQueries({ queryKey: ['quizzes', values.courseId] });
      queryClient.invalidateQueries({ queryKey: ['quiz', values.quizId] });
      queryClient.invalidateQueries({ queryKey: ['course', values.courseId] });
    },
  });
};

export const useDeleteQuizMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: {courseId: string, quizId: string}) => deleteQuiz(variables.courseId, variables.quizId),
    onSuccess: (_, values) => {
      queryClient.removeQueries({ queryKey: ['quiz', values.quizId] });

      // Update paginated list cache by filtering out the deleted course
      queryClient.setQueryData(['quizzes'], (oldData: PaginatedResult<Quiz> | undefined) => {
        if (!oldData) return;
        return {
          ...oldData,
          items: oldData.items.filter(quiz => quiz.id !== values.quizId), // Remove deleted quiz
        };
      });

      queryClient.invalidateQueries({ queryKey: ['quizzes', values.courseId] });
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      queryClient.invalidateQueries({ queryKey: ['course', values.courseId] });
    },
  });
};
