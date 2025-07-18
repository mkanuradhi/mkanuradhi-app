import { API_BASE_URL, PUBLICATIONS_PATH } from "@/constants/api-paths";
import { handleApiError } from "@/errors/api-error-handler";
import PaginatedResult from "@/interfaces/i-paginated-result";
import Publication from "@/interfaces/i-publication";
import axios from "axios";
import { ActivationPublicationDto, CreatePublicationDto, UpdatePublicationDto } from "../dtos/publication-dto";
import DocumentStatus from "@/enums/document-status";
import { buildHeaders } from "@/utils/common-utils";
import { LabelValueStat, SummaryStat, YearlyGroupStat } from "@/interfaces/i-stat";


export const getPublications = async (page: number, size: number): Promise<PaginatedResult<Publication>> => {
  try {
    const response = await axios.get<PaginatedResult<Publication>>(`${API_BASE_URL}${PUBLICATIONS_PATH}`, {
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

export const getGroupedPublications = async (): Promise<Record<string, Publication[]>> => {
  try {
    const response = await axios.get<Record<string, Publication[]>>(`${API_BASE_URL}${PUBLICATIONS_PATH}/grouped`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getPublicationById = async (publicationId: string): Promise<Publication> => {
  try {
    const response = await axios.get<Publication>(`${API_BASE_URL}${PUBLICATIONS_PATH}/${publicationId}`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const activatePublication = async (publicationId: string, token: string): Promise<Publication> => {
  try {
    const activationPublicationDto: ActivationPublicationDto = { status: DocumentStatus.ACTIVE }
    const response = await axios.patch<Publication>(
      `${API_BASE_URL}${PUBLICATIONS_PATH}/${publicationId}/toggle`,
      activationPublicationDto,
      buildHeaders(token)
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const deactivatePublication = async (publicationId: string, token: string): Promise<Publication> => {
  try {
    const activationPublicationDto: ActivationPublicationDto = { status: DocumentStatus.INACTIVE }
    const response = await axios.patch<Publication>(
      `${API_BASE_URL}${PUBLICATIONS_PATH}/${publicationId}/toggle`,
      activationPublicationDto,
      buildHeaders(token)
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const deletePublication = async (publicationId: string, token: string) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}${PUBLICATIONS_PATH}/${publicationId}`,
      buildHeaders(token)
    );
    if (response.status !== 204) {
      throw new Error('Failed to delete publication');
    }
    return { publicationId, message: 'Publication deleted successfully' };
  } catch (error) {
    throw handleApiError(error);
  }
};

export const createPublication = async (publicationDto: CreatePublicationDto, token: string): Promise<Publication> => {
  try {
    const response = await axios.post<Publication>(
      `${API_BASE_URL}${PUBLICATIONS_PATH}`,
      publicationDto,
      buildHeaders(token)
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const updatePublication = async (publicationId: string, publicationDto: UpdatePublicationDto, token: string): Promise<Publication> => {
  try {
    const response = await axios.put<Publication>(
      `${API_BASE_URL}${PUBLICATIONS_PATH}/${publicationId}`,
      publicationDto,
      buildHeaders(token)
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getYearlyPublications = async (): Promise<LabelValueStat[]> => {
  try {
    const response = await axios.get<LabelValueStat[]>(
      `${API_BASE_URL}${PUBLICATIONS_PATH}/stats/yearly`
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getYearlyPublicationsByType = async (): Promise<YearlyGroupStat[]> => {
  try {
    const response = await axios.get<YearlyGroupStat[]>(
      `${API_BASE_URL}${PUBLICATIONS_PATH}/stats/yearly-by-type`
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getPublicationsByType = async (): Promise<LabelValueStat[]> => {
  try {
    const response = await axios.get<LabelValueStat[]>(
      `${API_BASE_URL}${PUBLICATIONS_PATH}/stats/by-type`
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getRecentPublications = async (limit: number): Promise<Publication[]> => {
  try {
    const response = await axios.get<Publication[]>(
      `${API_BASE_URL}${PUBLICATIONS_PATH}/stats/recent`,
      {
        params: {
          limit,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getPublicationKeywordFrequencies = async (): Promise<LabelValueStat[]> => {
  try {
    const response = await axios.get<LabelValueStat[]>(
      `${API_BASE_URL}${PUBLICATIONS_PATH}/stats/keywords`
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getPublicationSummary = async (): Promise<SummaryStat> => {
  try {
    const response = await axios.get<SummaryStat>(
      `${API_BASE_URL}${PUBLICATIONS_PATH}/stats/summary`
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};
