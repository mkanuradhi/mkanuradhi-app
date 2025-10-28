import { API_BASE_URL, AWARDS_PATH } from "@/constants/api-paths";
import { ActivationAwardDto, CreateAwardEnDto, UpdateAwardEnDto, UpdateAwardSiDto } from "@/dtos/award-dto";
import DocumentStatus from "@/enums/document-status";
import { handleApiError } from "@/errors/api-error-handler";
import Award from "@/interfaces/i-award";
import PaginatedResult from "@/interfaces/i-paginated-result";
import { buildHeaders } from "@/utils/common-utils";
import axios from "axios";


export const getAwards = async (page: number, size: number): Promise<PaginatedResult<Award>> => {
  try {
    const response = await axios.get<PaginatedResult<Award>>(`${API_BASE_URL}${AWARDS_PATH}`, {
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

export const getAwardById = async (awardId: string): Promise<Award> => {
  try {
    const response = await axios.get<Award>(`${API_BASE_URL}${AWARDS_PATH}/${awardId}`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const activateAward = async (awardId: string, token: string): Promise<Award> => {
  try {
    const activationAwardDto: ActivationAwardDto = { status: DocumentStatus.ACTIVE }
    const response = await axios.patch<Award>(
      `${API_BASE_URL}${AWARDS_PATH}/${awardId}/toggle`,
      activationAwardDto,
      buildHeaders(token)
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const deactivateAward = async (awardId: string, token: string): Promise<Award> => {
  try {
    const activationAwardDto: ActivationAwardDto = { status: DocumentStatus.INACTIVE }
    const response = await axios.patch<Award>(
      `${API_BASE_URL}${AWARDS_PATH}/${awardId}/toggle`,
      activationAwardDto,
      buildHeaders(token)
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const deleteAward = async (awardId: string, token: string) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}${AWARDS_PATH}/${awardId}`,
      buildHeaders(token)
    );
    if (response.status !== 204) {
      throw new Error('Failed to delete award');
    }
    return { awardId, message: 'Award deleted successfully' };
  } catch (error) {
    throw handleApiError(error);
  }
};

export const createAwardEn = async (awardEnDto: CreateAwardEnDto, token: string): Promise<Award> => {
  try {
    const response = await axios.post<Award>(
      `${API_BASE_URL}${AWARDS_PATH}`,
      awardEnDto,
      buildHeaders(token)
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const updateAwardSi = async (id: string, awardSiDto: UpdateAwardSiDto, token: string): Promise<Award> => {
  try {
    const response = await axios.patch<Award>(
      `${API_BASE_URL}${AWARDS_PATH}/${id}/si`,
      awardSiDto,
      buildHeaders(token)
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const updateAwardEn = async (id: string, awardEnDto: UpdateAwardEnDto, token: string): Promise<Award> => {
  try {
    const response = await axios.patch<Award>(
      `${API_BASE_URL}${AWARDS_PATH}/${id}/en`,
      awardEnDto,
      buildHeaders(token)
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};
