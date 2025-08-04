import { CreateContactMessageDto } from "@/dtos/contact-dto";
import { ApiError } from "@/errors/api-error";
import ContactMessage from "@/interfaces/i-contact-message";
import PaginatedResult from "@/interfaces/i-paginated-result";
import { createContactMessage } from "@/services/contact-service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const CONTACT_MESSAGE_QUERY_KEY = 'contact-message';
const CONTACT_MESSAGES_QUERY_KEY = 'contact-messages';

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