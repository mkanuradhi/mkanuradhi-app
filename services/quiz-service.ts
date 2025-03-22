import { API_BASE_URL, COURSES_PATH, QUIZZES_PATH } from "@/constants/api-paths";
import DocumentStatus from "@/enums/document-status";
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

export const activateQuiz = async (courseId: string, quizId: string): Promise<Quiz> => {
  try {
    const response = await axios.patch<Quiz>(
      `${API_BASE_URL}${COURSES_PATH}/${courseId}/quizzes/${quizId}/toggle`,
      { status: DocumentStatus.ACTIVE }
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const deactivateQuiz = async (courseId: string, quizId: string): Promise<Quiz> => {
  try {
    const response = await axios.patch<Quiz>(
      `${API_BASE_URL}${COURSES_PATH}/${courseId}/quizzes/${quizId}/toggle`,
      { status: DocumentStatus.INACTIVE }
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const deleteQuiz = async (courseId: string, quizId: string) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}${COURSES_PATH}/${courseId}/quizzes/${quizId}`);
    if (response.status !== 204) {
      throw new Error('Failed to delete quiz');
    }
    return { quizId, message: 'Quiz deleted successfully' };
  } catch (error) {
    throw handleApiError(error);
  }
};
