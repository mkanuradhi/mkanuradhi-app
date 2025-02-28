import axios from "axios";
import { ApiError } from "./api-error";

export const handleApiError = (error: any) => {
  if (axios.isAxiosError(error)) {
    throw new ApiError(
      error.response?.data?.message || 'An unexpected error occurred',
      error.response?.status,
      error.response?.data
    );
  } else {
    throw new ApiError(error.message || 'An unexpected error occurred');
  }
};