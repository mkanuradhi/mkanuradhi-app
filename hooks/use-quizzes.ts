import { ApiError } from "@/errors/api-error";
import Quiz from "@/interfaces/i-quiz";
import { getQuizById } from "@/services/quiz-service";
import { useQuery } from "@tanstack/react-query";


export const useQuizByIdQuery = (courseId: string, quizId: string) => {
  return useQuery<Quiz, ApiError>({
    queryKey: ['quiz', quizId],
    queryFn: () => getQuizById(courseId, quizId),
    refetchOnWindowFocus: false,
  });
};