import { CreateContactMessageDto } from "@/dtos/contact-dto";
import { ApiError } from "@/errors/api-error";
import ContactMessage, { FullContactMessage } from "@/interfaces/i-contact-message";
import PaginatedResult from "@/interfaces/i-paginated-result";
import { createContactMessage, deleteContactMessage, getContactMessages, getUnreadContactMessageCount, toggleReadContactMessage } from "@/services/contact-service";
import { useAuth } from "@clerk/nextjs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const CONTACT_MESSAGE_QUERY_KEY = 'contact-message';
const CONTACT_MESSAGES_QUERY_KEY = 'contact-messages';
const CONTACT_MESSAGES_UNREAD_COUNT = 'contact-messages-unread-count';

export const useCreateContactMessageMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<ContactMessage, ApiError, CreateContactMessageDto, { previousContactMessages?: PaginatedResult<ContactMessage> }>({
    mutationFn: async (contactMessageDto: CreateContactMessageDto) => {
      return createContactMessage(contactMessageDto);
    },

    onMutate: async (newContactMessageData) => {
      await queryClient.cancelQueries({ queryKey: [CONTACT_MESSAGES_QUERY_KEY] });

      // Snapshot current contact messages for rollback
      const previousContactMessages = queryClient.getQueryData<PaginatedResult<ContactMessage>>([CONTACT_MESSAGES_QUERY_KEY]);

      const defaultPagination = { totalCount: 1, totalPages: 1, currentPage: 1, currentPageSize: 1 };

      // Optimistically add a temp contact message
      queryClient.setQueryData([CONTACT_MESSAGES_QUERY_KEY], (oldData?: PaginatedResult<ContactMessage>) => {
        if (!oldData) {
          return {
            items: [{ id: 'temp-id', ...newContactMessageData }],
            pagination: defaultPagination,
          };
        }

        return {
          ...oldData,
          items: [{ id: 'temp-id', ...newContactMessageData }, ...oldData.items],
          pagination: {
            ...oldData.pagination,
            totalCount: oldData.pagination.totalCount + 1,
          },
        };
      });

      return { previousContactMessages };
    },

    onSuccess: (createdContactMessage) => {
      if (!createdContactMessage || !createdContactMessage.id) return;

      // Replace the temp contact message with the actual one
      queryClient.setQueryData([CONTACT_MESSAGES_QUERY_KEY], (oldData?: PaginatedResult<ContactMessage>) => {
        if (!oldData) {
          return {
            items: [createdContactMessage],
            pagination: { totalCount: 1, totalPages: 1, currentPage: 1, currentPageSize: 1 },
          };
        }

        return {
          ...oldData,
          items: oldData.items.map((cm) =>
            cm.id === 'temp-id' ? createdContactMessage : cm
          ),
          pagination: {
            ...oldData.pagination,
            totalCount: Math.max(oldData.pagination.totalCount, oldData.items.length),
          },
        };
      });

      // Also cache the individual contact message
      queryClient.setQueryData([CONTACT_MESSAGE_QUERY_KEY, createdContactMessage.id], createdContactMessage);
    },

    onError: (_error, _newContactMessageData, context) => {
      if (context?.previousContactMessages) {
        queryClient.setQueryData([CONTACT_MESSAGES_QUERY_KEY], context.previousContactMessages);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [CONTACT_MESSAGES_QUERY_KEY], refetchType: 'active' });
    },
  });
};

export const useContactMessagesQuery = (page: number, size: number, initialContactMessages?: PaginatedResult<FullContactMessage>) => {
  const { getToken } = useAuth();
  
  return useQuery<PaginatedResult<FullContactMessage>, ApiError>({
    queryKey: [CONTACT_MESSAGES_QUERY_KEY, page, size],
    queryFn: async () => {
      const token = (await getToken()) ?? '';
      return getContactMessages(page, size, token);
    },
    initialData: initialContactMessages,
    initialDataUpdatedAt: 0,
    placeholderData: (prevData) => prevData ?? {
      items: [], 
      pagination: { totalCount: 0, totalPages: 1, currentPage: page, currentPageSize: 0 }
    }, // Keeps previous data until new data loads
    refetchOnWindowFocus: false, // Prevents unnecessary API calls when switching tabs
  });
};

export const useDeleteContactMessageMutation = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async (contactMessageId: string) => {
      const token = (await getToken()) ?? '';
      return deleteContactMessage(contactMessageId, token);
    },
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: [CONTACT_MESSAGE_QUERY_KEY, id] });

      // Update paginated list cache by filtering out the deleted contact message
      queryClient.setQueryData([CONTACT_MESSAGES_QUERY_KEY], (oldData: PaginatedResult<FullContactMessage> | undefined) => {
        if (!oldData) return;
        return {
          ...oldData,
          items: oldData.items.filter(contactMessage => contactMessage.id !== id), // Remove deleted contact message
        };
      });

      queryClient.invalidateQueries({ queryKey: [CONTACT_MESSAGES_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [CONTACT_MESSAGE_QUERY_KEY, id] });
      queryClient.invalidateQueries({ queryKey: [CONTACT_MESSAGES_UNREAD_COUNT] });
    },
  });
};

export const useToggleReadContactMessageMutation = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async (contactMessageId: string) => {
      const token = (await getToken()) ?? '';
      return toggleReadContactMessage(contactMessageId, token);
    },
    onSuccess: (updated, id) => {
      queryClient.setQueryData([CONTACT_MESSAGE_QUERY_KEY, id], updated);
      queryClient.invalidateQueries({ queryKey: [CONTACT_MESSAGES_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [CONTACT_MESSAGE_QUERY_KEY, id] });
      queryClient.invalidateQueries({ queryKey: [CONTACT_MESSAGES_UNREAD_COUNT] });
    },
  });
};

export const useUnreadContactMessageCount = () => {
  const { getToken } = useAuth();
  return useQuery<number>({
    queryKey: [CONTACT_MESSAGES_UNREAD_COUNT],
    queryFn: async () => {
      const token = (await getToken()) ?? '';
      return getUnreadContactMessageCount(token);
    },
    staleTime: 5 * 60_000,      // 5 minutes “fresh”
    refetchInterval: false,     // no polling
    refetchOnWindowFocus: true, // refresh when the user returns
    enabled: true               // let caller turn it on/off
  });
};
