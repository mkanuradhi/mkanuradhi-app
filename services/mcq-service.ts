import { API_BASE_URL, MCQS_PATH, QUIZZES_PATH } from "@/constants/api-paths";
import { CreateMcqDto, UpdateMcqDto } from "@/dtos/mcq-dto";
import DocumentStatus from "@/enums/document-status";
import { handleApiError } from "@/errors/api-error-handler";
import Mcq from "@/interfaces/i-mcq";
import PaginatedResult from "@/interfaces/i-paginated-result";
import { buildHeaders } from "@/utils/common-utils";
import axios from "axios";

export const getMcqs = async (quizId: string, page: number, size: number): Promise<PaginatedResult<Mcq>> => {
  try {
    const response = await axios.get<PaginatedResult<Mcq>>(`${API_BASE_URL}${QUIZZES_PATH}/${quizId}${MCQS_PATH}`, {
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

export const getActiveMcqs = async (quizId: string, page: number, size: number): Promise<PaginatedResult<Mcq>> => {
  try {
    const response = await axios.get<PaginatedResult<Mcq>>(`${API_BASE_URL}${QUIZZES_PATH}/${quizId}${MCQS_PATH}/active`, {
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

export const getMcqById = async (quizId: string, mcqId: string): Promise<Mcq> => {
  try {
    const response = await axios.get<Mcq>(`${API_BASE_URL}${QUIZZES_PATH}/${quizId}${MCQS_PATH}/${mcqId}`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const activateMcq = async (quizId: string, mcqId: string, token: string): Promise<Mcq> => {
  try {
    const response = await axios.patch<Mcq>(
      `${API_BASE_URL}${QUIZZES_PATH}/${quizId}${MCQS_PATH}/${mcqId}/toggle`,
      { status: DocumentStatus.ACTIVE },
      buildHeaders(token)
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const deactivateMcq = async (quizId: string, mcqId: string, token: string): Promise<Mcq> => {
  try {
    const response = await axios.patch<Mcq>(
      `${API_BASE_URL}${QUIZZES_PATH}/${quizId}${MCQS_PATH}/${mcqId}/toggle`,
      { status: DocumentStatus.INACTIVE },
      buildHeaders(token)
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const deleteMcq = async (quizId: string, mcqId: string, token: string) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}${QUIZZES_PATH}/${quizId}${MCQS_PATH}/${mcqId}`,
      buildHeaders(token)
    );
    if (response.status !== 204) {
      throw new Error('Failed to delete mcq');
    }
    return { quizId, message: 'Mcq deleted successfully' };
  } catch (error) {
    throw handleApiError(error);
  }
};

export const createMcq = async (quizId: string, mcqDto: CreateMcqDto, token: string): Promise<Mcq> => {
  try {
    const response = await axios.post<Mcq>(
      `${API_BASE_URL}${QUIZZES_PATH}/${quizId}${MCQS_PATH}`,
      mcqDto,
      buildHeaders(token)
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const updateMcq = async (quizId: string, mcqId: string, mcqDto: UpdateMcqDto, token: string): Promise<Mcq> => {
  try {
    const response = await axios.patch<Mcq>(
      `${API_BASE_URL}${QUIZZES_PATH}/${quizId}${MCQS_PATH}/${mcqId}`,
      mcqDto,
      buildHeaders(token)
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};
