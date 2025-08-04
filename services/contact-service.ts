import { API_BASE_URL, CONTACT_PATH } from "@/constants/api-paths";
import { CreateContactMessageDto } from "@/dtos/contact-dto";
import { handleApiError } from "@/errors/api-error-handler";
import ContactMessage from "@/interfaces/i-contact-message";
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