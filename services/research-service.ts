import { API_BASE_URL, RESEARCH_PATH } from "@/constants/api-paths";
import { ActivationResearchDto, CreateResearchDto, UpdateResearchDto } from "@/dtos/research-dto";
import DocumentStatus from "@/enums/document-status";
import { handleApiError } from "@/errors/api-error-handler";
import PaginatedResult from "@/interfaces/i-paginated-result";
import Research from "@/interfaces/i-research";
import { buildHeaders } from "@/utils/common-utils";
import axios from "axios";

export const getResearches = async (page: number, size: number): Promise<PaginatedResult<Research>> => {
  try {
    const response = await axios.get<PaginatedResult<Research>>(`${API_BASE_URL}${RESEARCH_PATH}`, {
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

export const getResearchById = async (researchId: string): Promise<Research> => {
  try {
    const response = await axios.get<Research>(`${API_BASE_URL}${RESEARCH_PATH}/${researchId}`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const activateResearch = async (researchId: string, token: string): Promise<Research> => {
  try {
    const activationResearchDto: ActivationResearchDto = { status: DocumentStatus.ACTIVE }
    const response = await axios.patch<Research>(
      `${API_BASE_URL}${RESEARCH_PATH}/${researchId}/toggle`,
      activationResearchDto,
      buildHeaders(token)
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const deactivateResearch = async (researchId: string, token: string): Promise<Research> => {
  try {
    const activationResearchDto: ActivationResearchDto = { status: DocumentStatus.INACTIVE }
    const response = await axios.patch<Research>(
      `${API_BASE_URL}${RESEARCH_PATH}/${researchId}/toggle`,
      activationResearchDto,
      buildHeaders(token)
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const deleteResearch = async (researchId: string, token: string) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}${RESEARCH_PATH}/${researchId}`,
      buildHeaders(token)
    );
    if (response.status !== 204) {
      throw new Error('Failed to delete research');
    }
    return { researchId, message: 'Research deleted successfully' };
  } catch (error) {
    throw handleApiError(error);
  }
};

export const createResearch = async (researchDto: CreateResearchDto, token: string): Promise<Research> => {
  try {
    const response = await axios.post<Research>(
      `${API_BASE_URL}${RESEARCH_PATH}`,
      researchDto,
      buildHeaders(token)
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const updateResearch = async (researchId: string, researchDto: UpdateResearchDto, token: string): Promise<Research> => {
  try {
    const response = await axios.put<Research>(
      `${API_BASE_URL}${RESEARCH_PATH}/${researchId}`,
      researchDto,
      buildHeaders(token)
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};
