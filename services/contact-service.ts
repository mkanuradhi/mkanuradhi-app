import { API_BASE_URL, CONTACT_PATH } from "@/constants/api-paths";
import { CreateContactMessageDto } from "@/dtos/contact-dto";
import { handleApiError } from "@/errors/api-error-handler";
import ContactMessage, { FullContactMessage } from "@/interfaces/i-contact-message";
import PaginatedResult from "@/interfaces/i-paginated-result";
import { buildHeaders } from "@/utils/common-utils";
import axios from "axios";

export const createContactMessage = async (contactMessageDto: CreateContactMessageDto): Promise<ContactMessage> => {
  try {
    const response = await axios.post<ContactMessage>(
      `${API_BASE_URL}${CONTACT_PATH}`,
      contactMessageDto,
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getContactMessages = async (page: number, size: number, token: string): Promise<PaginatedResult<FullContactMessage>> => {
  try {
    const response = await axios.get<PaginatedResult<FullContactMessage>>(
      `${API_BASE_URL}${CONTACT_PATH}`,
      {
        params: { page, size },
        ...buildHeaders(token)
      }
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const deleteContactMessage = async (contactMessageId: string, token: string) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}${CONTACT_PATH}/${contactMessageId}`,
      buildHeaders(token)
    );
    if (response.status !== 204) {
      throw new Error('Failed to delete contact message');
    }
    return { contactMessageId, message: 'Contact message deleted successfully' };
  } catch (error) {
    throw handleApiError(error);
  }
};

export const toggleReadContactMessage = async (contactMessageId: string, token: string): Promise<FullContactMessage> => {
  try {
    const response = await axios.patch<FullContactMessage>(
      `${API_BASE_URL}${CONTACT_PATH}/${contactMessageId}/toggle/read`,
      {},
      buildHeaders(token)
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getUnreadContactMessageCount = async (token: string): Promise<number> => {
  const res = await axios.get<{ count: number }>(
    `${API_BASE_URL}${CONTACT_PATH}/unread/count`,
    buildHeaders(token)
  );
  return res.data.count;
};
