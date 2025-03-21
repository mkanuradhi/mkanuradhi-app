import { API_BASE_URL, COURSES_PATH, QUIZZES_PATH } from "@/constants/api-paths";
import { handleApiError } from "@/errors/api-error-handler";
import PaginatedResult from "@/interfaces/i-paginated-result";
import Quiz from "@/interfaces/i-quiz";
import axios from "axios";

export const getQuizzes = async (courseId: string, page: number, size: number): Promise<PaginatedResult<Quiz>> => {
  try {
    const response = await axios.get<PaginatedResult<Quiz>>(`${API_BASE_URL}${COURSES_PATH}/${courseId}${QUIZZES_PATH}`, {
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

export const getQuizById = async (courseId: string, quizId: string): Promise<Quiz> => {
  try {
    const response = await axios.get<Quiz>(`${API_BASE_URL}${COURSES_PATH}/${courseId}${QUIZZES_PATH}/${quizId}`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};