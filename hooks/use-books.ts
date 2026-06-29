import { CreateBookDto, UpdateBookDto } from "@/dtos/book-dto";
import DocumentStatus from "@/enums/document-status";
import { ApiError } from "@/errors/api-error";
import Book, { LocalizedBook, LocalizedSummaryBook } from "@/interfaces/i-book";
import PaginatedResult from "@/interfaces/i-paginated-result";
import {
  activateBook,
  createBook,
  deactivateBook,
  deleteBook,
  deleteCoverImage,
  deletePreviewImage,
  getBookById,
  getBooks,
  getLocalizedBookByPath,
  getLocalizedBooks,
  updateBook,
  uploadCoverImage,
  uploadPreviewImages,
} from "@/services/book-service";
import { useAuth } from "@clerk/nextjs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const BOOK_QUERY_KEY  = 'book';
const BOOKS_QUERY_KEY = 'books';
const LOCALIZED_BOOK_QUERY_KEY  = 'localized_book';
const LOCALIZED_BOOKS_QUERY_KEY = 'localized_books';

// ── Queries ───────────────────────────────────────────────────────────────────

export const useLocalizedBooksQuery = (
  lang: string,
  page: number,
  size: number,
  initialBooks?: PaginatedResult<LocalizedSummaryBook>
) => {
  return useQuery<PaginatedResult<LocalizedSummaryBook>, ApiError>({
    queryKey:             [LOCALIZED_BOOKS_QUERY_KEY, lang, page, size],
    queryFn:              () => getLocalizedBooks(lang, page, size),
    initialData:          initialBooks,
    initialDataUpdatedAt: Date.now(),
    staleTime:            15_000,
    placeholderData:      (prevData) => prevData ?? {
      items: [],
      pagination: { totalCount: 0, totalPages: 1, currentPage: page, currentPageSize: 0 },
    },
    refetchOnWindowFocus: false,
  });
};

export const useLocalizedBookByPathQuery = (lang: string, path: string) => {

  return useQuery<LocalizedBook, ApiError>({
    queryKey:             [LOCALIZED_BOOK_QUERY_KEY, lang, path],
    queryFn:              () => getLocalizedBookByPath(lang, path),
    refetchOnWindowFocus: false,
  });
};

export const useBooksQuery = (
  page: number,
  size: number,
  initialBooks?: PaginatedResult<Book>
) => {
  const { getToken } = useAuth();

  return useQuery<PaginatedResult<Book>, ApiError>({
    queryKey:             [BOOKS_QUERY_KEY, page, size],
    queryFn:   async () => {
      const token = (await getToken()) ?? '';
      return getBooks(page, size, token);
    },
    initialData:          initialBooks,
    initialDataUpdatedAt: Date.now(),
    staleTime:            15_000,
    placeholderData:      (prevData) => prevData ?? {
      items: [],
      pagination: { totalCount: 0, totalPages: 1, currentPage: page, currentPageSize: 0 },
    },
    refetchOnWindowFocus: false,
  });
};

export const useBookByIdQuery = (bookId: string) => {
  const { getToken } = useAuth();

  return useQuery<Book, ApiError>({
    queryKey:             [BOOK_QUERY_KEY, bookId],
    queryFn:   async () => {
      const token = (await getToken()) ?? '';
      return getBookById(bookId, token);
    },
    refetchOnWindowFocus: false,
  });
};

// ── Mutations ─────────────────────────────────────────────────────────────────

export const useCreateBookMutation = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation<Book, ApiError, CreateBookDto, { previousBooks?: PaginatedResult<Book> }>({
    mutationFn: async (bookDto: CreateBookDto) => {
      const token = (await getToken()) ?? '';
      return createBook(bookDto, token);
    },

    onMutate: async (newBookData) => {
      await queryClient.cancelQueries({ queryKey: [BOOKS_QUERY_KEY] });

      const previousBooks = queryClient.getQueryData<PaginatedResult<Book>>([BOOKS_QUERY_KEY]);

      const defaultPagination = { totalCount: 1, totalPages: 1, currentPage: 1, currentPageSize: 1 };

      queryClient.setQueryData([BOOKS_QUERY_KEY], (oldData?: PaginatedResult<Book>) => {
        if (!oldData) {
          return {
            items:      [{ id: 'temp-id', ...newBookData }],
            pagination: defaultPagination,
          };
        }
        return {
          ...oldData,
          items: [{ id: 'temp-id', ...newBookData }, ...oldData.items],
          pagination: {
            ...oldData.pagination,
            totalCount: oldData.pagination.totalCount + 1,
          },
        };
      });

      return { previousBooks };
    },

    onSuccess: (createdBook) => {
      if (!createdBook || !createdBook.id) return;

      queryClient.setQueryData([BOOKS_QUERY_KEY], (oldData?: PaginatedResult<Book>) => {
        if (!oldData) {
          return {
            items:      [createdBook],
            pagination: { totalCount: 1, totalPages: 1, currentPage: 1, currentPageSize: 1 },
          };
        }
        return {
          ...oldData,
          items: oldData.items.map(book =>
            book.id === 'temp-id' ? createdBook : book
          ),
          pagination: {
            ...oldData.pagination,
            totalCount: Math.max(oldData.pagination.totalCount, oldData.items.length),
          },
        };
      });

      queryClient.setQueryData([BOOK_QUERY_KEY, createdBook.id], createdBook);
    },

    onError: (_error, _newBookData, context) => {
      if (context?.previousBooks) {
        queryClient.setQueryData([BOOKS_QUERY_KEY], context.previousBooks);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [BOOKS_QUERY_KEY], refetchType: 'active' });
    },
  });
};

export const useActivateBookMutation = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async (bookId: string) => {
      const token = (await getToken()) ?? '';
      return activateBook(bookId, token);
    },
    onSuccess: (_, id) => {
      queryClient.setQueryData([BOOK_QUERY_KEY, id], (oldData: Book | undefined) => {
        if (!oldData) return;
        return { ...oldData, status: DocumentStatus.ACTIVE };
      });
      queryClient.invalidateQueries({ queryKey: [BOOKS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [BOOK_QUERY_KEY, id] });
    },
  });
};

export const useDeactivateBookMutation = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async (bookId: string) => {
      const token = (await getToken()) ?? '';
      return deactivateBook(bookId, token);
    },
    onSuccess: (_, id) => {
      queryClient.setQueryData([BOOK_QUERY_KEY, id], (oldData: Book | undefined) => {
        if (!oldData) return;
        return { ...oldData, status: DocumentStatus.INACTIVE };
      });
      queryClient.invalidateQueries({ queryKey: [BOOKS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [BOOK_QUERY_KEY, id] });
    },
  });
};

export const useDeleteBookMutation = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async (bookId: string) => {
      const token = (await getToken()) ?? '';
      return deleteBook(bookId, token);
    },
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: [BOOK_QUERY_KEY, id] });
      queryClient.setQueryData([BOOKS_QUERY_KEY], (oldData: PaginatedResult<Book> | undefined) => {
        if (!oldData) return;
        return {
          ...oldData,
          items: oldData.items.filter(book => book.id !== id),
        };
      });
      queryClient.invalidateQueries({ queryKey: [BOOKS_QUERY_KEY] });
    },
  });
};

export const useUpdateBookMutation = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async (variables: {id: string, bookDto: UpdateBookDto}) => {
      const token = (await getToken()) ?? '';
      return updateBook(variables.id, variables.bookDto, token);
    },
    onSuccess: (updatedBook) => {
      if (!updatedBook || !updatedBook.id) return;

      // Update individual book cache
      queryClient.setQueryData([BOOK_QUERY_KEY, updatedBook.id], updatedBook);

      // Update book list cache
      queryClient.setQueryData([BOOKS_QUERY_KEY], (oldData?: PaginatedResult<Book>) => {
        if (!oldData) return;

        return {
          ...oldData,
          items: oldData.items.map((book) => 
            book.id === updatedBook.id ? updatedBook : book
          ),
        };
      });
    },
    onSettled: (_data, _error, variables) => {
      // Refetch only the updated award instead of all awards
      queryClient.invalidateQueries({ queryKey: [BOOK_QUERY_KEY, variables.id] });
      queryClient.invalidateQueries({ queryKey: [BOOKS_QUERY_KEY], refetchType: 'active' });
    },
  });
};

export const useUploadCoverImageMutation = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async ({ id, formData }: { id: string; formData: FormData }) => {
      const token = (await getToken()) ?? '';
      return uploadCoverImage(id, formData, token);
    },

    onSuccess: (updatedBook) => {
      if (!updatedBook || !updatedBook.id) return;

      // Update individual book cache
      queryClient.setQueryData([BOOK_QUERY_KEY, updatedBook.id], updatedBook);

      // Update paginated list cache
      queryClient.setQueryData([BOOKS_QUERY_KEY], (oldData?: PaginatedResult<Book>) => {
        if (!oldData) return;
        return {
          ...oldData,
          items: oldData.items.map(book =>
            book.id === updatedBook.id ? updatedBook : book
          ),
        };
      });

      queryClient.invalidateQueries({ queryKey: [BOOK_QUERY_KEY, updatedBook.id] });
    },
  });
};

export const useDeleteCoverImageMutation = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async (bookId: string) => {
      const token = (await getToken()) ?? '';
      return deleteCoverImage(bookId, token);
    },

    onSuccess: (updatedBook) => {
      if (!updatedBook || !updatedBook.id) return;

      // Update individual book cache
      queryClient.setQueryData([BOOK_QUERY_KEY, updatedBook.id], updatedBook);

      // Update paginated list cache
      queryClient.setQueryData([BOOKS_QUERY_KEY], (oldData?: PaginatedResult<Book>) => {
        if (!oldData) return;
        return {
          ...oldData,
          items: oldData.items.map(book =>
            book.id === updatedBook.id ? updatedBook : book
          ),
        };
      });

      queryClient.invalidateQueries({ queryKey: [BOOK_QUERY_KEY, updatedBook.id] });
    },
  });
};

export const useUploadPreviewImagesMutation = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async ({ id, formData }: { id: string; formData: FormData }) => {
      const token = (await getToken()) ?? "";
      return uploadPreviewImages(id, formData, token);
    },

    onSuccess: updatedBook => {
      if (!updatedBook || !updatedBook.id) return;

      queryClient.setQueryData(
        [BOOK_QUERY_KEY, updatedBook.id],
        updatedBook
      );

      queryClient.setQueryData(
        [BOOKS_QUERY_KEY],
        (oldData?: PaginatedResult<Book>) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            items: oldData.items.map(book =>
              book.id === updatedBook.id ? updatedBook : book
            ),
          };
        }
      );

      queryClient.invalidateQueries({
        queryKey: [BOOK_QUERY_KEY, updatedBook.id],
      });
    },
  });
};

export const useDeletePreviewImageMutation = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async ({ bookId, previewImageId }: { bookId: string; previewImageId: string }) => {
      const token = (await getToken()) ?? '';
      return deletePreviewImage(bookId, previewImageId, token);
    },

    onSuccess: (updatedBook) => {
      if (!updatedBook || !updatedBook.id) return;

      // Update individual book cache
      queryClient.setQueryData([BOOK_QUERY_KEY, updatedBook.id], updatedBook);

      // Update paginated list cache
      queryClient.setQueryData([BOOKS_QUERY_KEY], (oldData?: PaginatedResult<Book>) => {
        if (!oldData) return;
        return {
          ...oldData,
          items: oldData.items.map(book =>
            book.id === updatedBook.id ? updatedBook : book
          ),
        };
      });

      queryClient.invalidateQueries({ queryKey: [BOOK_QUERY_KEY, updatedBook.id] });
    },
  });
};
