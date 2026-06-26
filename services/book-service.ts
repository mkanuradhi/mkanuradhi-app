import axios from "axios";
import { API_BASE_URL, BOOKS_PATH, LOCALIZED_BOOKS_PATH } from "@/constants/api-paths";
import { ActivationBookDto, CreateBookDto, UpdateBookDto } from "@/dtos/book-dto";
import { handleApiError } from "@/errors/api-error-handler";
import Book, { LocalizedBook, LocalizedSummaryBook } from "@/interfaces/i-book";
import PaginatedResult from "@/interfaces/i-paginated-result";
import { buildHeaders } from "@/utils/common-utils";
import DocumentStatus from "@/enums/document-status";

export const getLocalizedBooks = async (lang: string, page: number, size: number): Promise<PaginatedResult<LocalizedSummaryBook>> => {
  try {
    const response = await axios.get<PaginatedResult<LocalizedSummaryBook>>(
      `${API_BASE_URL}${LOCALIZED_BOOKS_PATH}`,
      { params: { lang, page, size } }
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getLocalizedBookByPath = async (lang: string, path: string): Promise<LocalizedBook> => {
  try {
    const response = await axios.get<LocalizedBook>(
      `${API_BASE_URL}${LOCALIZED_BOOKS_PATH}/${path}`,
      { params: { lang } }
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getBooks = async (page: number, size: number, token: string): Promise<PaginatedResult<Book>> => {
  try {
    const response = await axios.get<PaginatedResult<Book>>(
      `${API_BASE_URL}${BOOKS_PATH}`,
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

export const getBookById = async (bookId: string, token: string): Promise<Book> => {
  try {
    const response = await axios.get<Book>(
      `${API_BASE_URL}${BOOKS_PATH}/${bookId}`,
      buildHeaders(token)
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const createBook = async (
  bookDto: CreateBookDto,
  token: string
): Promise<Book> => {
  try {
    const response = await axios.post<Book>(
      `${API_BASE_URL}${BOOKS_PATH}`,
      bookDto,
      buildHeaders(token)
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const activateBook = async (
  bookId: string,
  token: string
): Promise<Book> => {
  try {
    const activationDto: ActivationBookDto = { status: DocumentStatus.ACTIVE };
    const response = await axios.patch<Book>(
      `${API_BASE_URL}${BOOKS_PATH}/${bookId}/toggle`,
      activationDto,
      buildHeaders(token)
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const deactivateBook = async (
  bookId: string,
  token: string
): Promise<Book> => {
  try {
    const activationDto: ActivationBookDto = { status: DocumentStatus.INACTIVE };
    const response = await axios.patch<Book>(
      `${API_BASE_URL}${BOOKS_PATH}/${bookId}/toggle`,
      activationDto,
      buildHeaders(token)
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const updateBook = async (id: string, bookDto: UpdateBookDto, token: string): Promise<Book> => {
  try {
    const response = await axios.put<Book>(
      `${API_BASE_URL}${BOOKS_PATH}/${id}`,
      bookDto,
      buildHeaders(token)
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const deleteBook = async (
  bookId: string,
  token: string
): Promise<void> => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}${BOOKS_PATH}/${bookId}`,
      buildHeaders(token)
    );
    if (response.status !== 204) {
      throw new Error('Failed to delete book');
    }
  } catch (error) {
    throw handleApiError(error);
  }
};