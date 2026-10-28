import { API_BASE_URL, LOCALIZED_MEDIA_CONTRIBUTIONS_PATH, MEDIA_CONTRIBUTIONS_PATH } from "@/constants/api-paths";
import { ActivationMediaContributionDto, CreateMediaContributionDto, updateMediaContributionDto } from "@/dtos/media-contribution-dto";
import DocumentStatus from "@/enums/document-status";
import { handleApiError } from "@/errors/api-error-handler";
import MediaContribution, { LocalizedMediaContribution, LocalizedSummaryMediaContribution } from "@/interfaces/i-media-contribution";
import PaginatedResult from "@/interfaces/i-paginated-result";
import { buildHeaders } from "@/utils/common-utils";
import axios from "axios";


export const getLocalizedMediaContributions = async (lang: string, page: number, size: number): Promise<PaginatedResult<LocalizedSummaryMediaContribution>> => {
  try {
    const response = await axios.get<PaginatedResult<LocalizedSummaryMediaContribution>>(
      `${API_BASE_URL}${LOCALIZED_MEDIA_CONTRIBUTIONS_PATH}`,
      { params: { lang, page, size } }
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getLocalizedMediaContributionByPath = async (lang: string, path: string): Promise<LocalizedMediaContribution> => {
  try {
    const response = await axios.get<LocalizedMediaContribution>(
      `${API_BASE_URL}${LOCALIZED_MEDIA_CONTRIBUTIONS_PATH}/${path}`,
      { params: { lang } }
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getMediaContributions = async (page: number, size: number, token: string): Promise<PaginatedResult<MediaContribution>> => {
  try {
    const response = await axios.get<PaginatedResult<MediaContribution>>(
      `${API_BASE_URL}${MEDIA_CONTRIBUTIONS_PATH}`,
      {
        ...buildHeaders(token),
        params: { page, size },
      }
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getMediaContributionById = async (mediaContributionId: string, token: string): Promise<MediaContribution> => {
  try {
    const response = await axios.get<MediaContribution>(
      `${API_BASE_URL}${MEDIA_CONTRIBUTIONS_PATH}/${mediaContributionId}`,
      buildHeaders(token)
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const createMediaContribution = async (
  mediaContributionDto: CreateMediaContributionDto,
  token: string
): Promise<MediaContribution> => {
  try {
    const response = await axios.post<MediaContribution>(
      `${API_BASE_URL}${MEDIA_CONTRIBUTIONS_PATH}`,
      mediaContributionDto,
      buildHeaders(token)
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const activateMediaContribution = async (
  mediaContributionId: string,
  token: string
): Promise<MediaContribution> => {
  try {
    const activationDto: ActivationMediaContributionDto = { status: DocumentStatus.ACTIVE };
    const response = await axios.patch<MediaContribution>(
      `${API_BASE_URL}${MEDIA_CONTRIBUTIONS_PATH}/${mediaContributionId}/toggle`,
      activationDto,
      buildHeaders(token)
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const deactivateMediaContribution = async (
  mediaContributionId: string,
  token: string
): Promise<MediaContribution> => {
  try {
    const activationDto: ActivationMediaContributionDto = { status: DocumentStatus.INACTIVE };
    const response = await axios.patch<MediaContribution>(
      `${API_BASE_URL}${MEDIA_CONTRIBUTIONS_PATH}/${mediaContributionId}/toggle`,
      activationDto,
      buildHeaders(token)
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const updateMediaContribution = async (id: string, mediaContributionDto: updateMediaContributionDto, token: string): Promise<MediaContribution> => {
  try {
    const response = await axios.put<MediaContribution>(
      `${API_BASE_URL}${MEDIA_CONTRIBUTIONS_PATH}/${id}`,
      mediaContributionDto,
      buildHeaders(token)
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const deleteMediaContribution = async (
  mediaContributionId: string,
  token: string
): Promise<void> => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}${MEDIA_CONTRIBUTIONS_PATH}/${mediaContributionId}`,
      buildHeaders(token)
    );
    if (response.status !== 204) {
      throw new Error('Failed to delete media contribution');
    }
  } catch (error) {
    throw handleApiError(error);
  }
};

export const uploadCoverImage = async (mediaContributionId: string, formData: FormData, token: string): Promise<MediaContribution> => {
  try {
    const response = await axios.patch<MediaContribution>(
      `${API_BASE_URL}${MEDIA_CONTRIBUTIONS_PATH}/${mediaContributionId}/cover-image`,
      formData,
      buildHeaders(token)
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const deleteCoverImage = async (mediaContributionId: string, token: string): Promise<MediaContribution> => {
  try {
    const response = await axios.delete<MediaContribution>(
      `${API_BASE_URL}${MEDIA_CONTRIBUTIONS_PATH}/${mediaContributionId}/cover-image`,
      buildHeaders(token)
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const uploadAuthorImage = async (mediaContributionId: string, authorId: string, formData: FormData, token: string): Promise<MediaContribution> => {
  try {
    const response = await axios.patch<MediaContribution>(
      `${API_BASE_URL}${MEDIA_CONTRIBUTIONS_PATH}/${mediaContributionId}/author-image/${authorId}`,
      formData,
      buildHeaders(token)
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const deleteAuthorImage = async (mediaContributionId: string, authorId: string, token: string): Promise<MediaContribution> => {
  try {
    const response = await axios.delete<MediaContribution>(
      `${API_BASE_URL}${MEDIA_CONTRIBUTIONS_PATH}/${mediaContributionId}/author-image/${authorId}`,
      buildHeaders(token)
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const uploadInterviewerImage = async (mediaContributionId: string, interviewerId: string, formData: FormData, token: string): Promise<MediaContribution> => {
  try {
    const response = await axios.patch<MediaContribution>(
      `${API_BASE_URL}${MEDIA_CONTRIBUTIONS_PATH}/${mediaContributionId}/interviewer-image/${interviewerId}`,
      formData,
      buildHeaders(token)
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const deleteInterviewerImage = async (mediaContributionId: string, interviewerId: string, token: string): Promise<MediaContribution> => {
  try {
    const response = await axios.delete<MediaContribution>(
      `${API_BASE_URL}${MEDIA_CONTRIBUTIONS_PATH}/${mediaContributionId}/interviewer-image/${interviewerId}`,
      buildHeaders(token)
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const uploadOutletImage = async (mediaContributionId: string, formData: FormData, token: string): Promise<MediaContribution> => {
  try {
    const response = await axios.patch<MediaContribution>(
      `${API_BASE_URL}${MEDIA_CONTRIBUTIONS_PATH}/${mediaContributionId}/outlet-image`,
      formData,
      buildHeaders(token)
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const deleteOutletImage = async (mediaContributionId: string, token: string): Promise<MediaContribution> => {
  try {
    const response = await axios.delete<MediaContribution>(
      `${API_BASE_URL}${MEDIA_CONTRIBUTIONS_PATH}/${mediaContributionId}/outlet-image`,
      buildHeaders(token)
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const uploadPreviewImages = async (mediaContributionId: string, formData: FormData, token: string): Promise<MediaContribution> => {
  try {
    const response = await axios.patch<MediaContribution>(
      `${API_BASE_URL}${MEDIA_CONTRIBUTIONS_PATH}/${mediaContributionId}/preview-images`,
      formData,
      buildHeaders(token)
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const deletePreviewImage = async (mediaContributionId: string, previewImageId: string, token: string): Promise<MediaContribution> => {
  try {
    const response = await axios.delete<MediaContribution>(
      `${API_BASE_URL}${MEDIA_CONTRIBUTIONS_PATH}/${mediaContributionId}/preview-images/${previewImageId}`,
      buildHeaders(token)
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const uploadSampleFile = async (mediaContributionId: string, formData: FormData, token: string): Promise<MediaContribution> => {
  try {
    const response = await axios.patch<MediaContribution>(
      `${API_BASE_URL}${MEDIA_CONTRIBUTIONS_PATH}/${mediaContributionId}/pdf-file`,
      formData,
      buildHeaders(token)
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const deleteSampleFile = async (mediaContributionId: string, token: string): Promise<MediaContribution> => {
  try {
    const response = await axios.delete<MediaContribution>(
      `${API_BASE_URL}${MEDIA_CONTRIBUTIONS_PATH}/${mediaContributionId}/pdf-file`,
      buildHeaders(token)
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};
