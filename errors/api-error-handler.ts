import axios from "axios";
import { ApiError } from "./api-error";

export const handleApiError = (error: any) => {
  if (axios.isAxiosError(error)) {
    throw new ApiError(
      error.response?.data?.message || 'An unexpected error occurred',
      error.response?.status,
      error.response?.data
    );
  }
  
  // Handle ApiError (re-throw as-is)
  if (error instanceof ApiError) {
    throw error;
  }

  // Handle standard errors (including custom Error from fetch)
  if (error instanceof Error) {
    throw new ApiError(error.message || 'An unexpected error occurred');
  }
  
  // Handle unknown errors
  throw new ApiError('An unexpected error occurred');
};