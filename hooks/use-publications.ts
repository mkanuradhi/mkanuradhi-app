import { CreatePublicationDto, UpdatePublicationDto } from "@/dtos/publication-dto";
import DocumentStatus from "@/enums/document-status";
import { ApiError } from "@/errors/api-error";
import PaginatedResult from "@/interfaces/i-paginated-result";
import Publication from "@/interfaces/i-publication";
import { LabelValueStat } from "@/interfaces/i-stat";
import { activatePublication, createPublication, deactivatePublication, deletePublication, getGroupedPublications, getPublicationById, getPublicationKeywordFrequencies, getPublications, getYearlyPublications, updatePublication } from "@/services/publication-service";
import { useAuth } from "@clerk/nextjs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const PUBLICATION_QUERY_KEY = 'publication';
const PUBLICATIONS_QUERY_KEY = 'publications';
const GROUPED_PUBLICATIONS_QUERY_KEY = 'grouped-publications';
const PUBLICATION_KEYWORD_FREQUENCIES_QUERY_KEY = 'publication-keyword-frequencies';
const YEARLY_PUBLICATIONS_QUERY_KEY = 'yearly-publications';

export const usePublicationsQuery = (page: number, size: number, initialPublications?: PaginatedResult<Publication>) => {
  return useQuery<PaginatedResult<Publication>, ApiError>({
    queryKey: [PUBLICATIONS_QUERY_KEY, page, size],
    queryFn: () => getPublications(page, size),
    initialData: initialPublications,
    initialDataUpdatedAt: 0,
    placeholderData: (prevData) => prevData ?? {
      items: [], 
      pagination: { totalCount: 0, totalPages: 1, currentPage: page, currentPageSize: 0 }
    }, // Keeps previous data until new data loads
    refetchOnWindowFocus: false, // Prevents unnecessary API calls when switching tabs
  });
};

export const useGroupedPublicationsQuery = () => {
  return useQuery<Record<string, Publication[]>, ApiError>({
    queryKey: [GROUPED_PUBLICATIONS_QUERY_KEY],
    queryFn: () => getGroupedPublications(),
    placeholderData: (prevData) => prevData ?? {
      items: [],
    }, // Keeps previous data until new data loads
    refetchOnWindowFocus: false, // Prevents unnecessary API calls when switching tabs
  });
};

export const usePublicationByIdQuery = (publicationId: string) => {
  return useQuery<Publication, ApiError>({
    queryKey: [PUBLICATION_QUERY_KEY, publicationId],
    queryFn: () => getPublicationById(publicationId),
    refetchOnWindowFocus: false,
  });
};

export const useActivatePublicationMutation = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async (publicationId: string) => {
      const token = (await getToken()) ?? '';
      return activatePublication(publicationId, token);
    },
    onSuccess: (_, id) => {
      // Update cache instantly instead of re-fetching
      queryClient.setQueryData([PUBLICATION_QUERY_KEY, id], (oldData: Publication | undefined) => {
        if (!oldData) return;
        return { ...oldData, status: DocumentStatus.ACTIVE };
      });

      queryClient.invalidateQueries({ queryKey: [PUBLICATIONS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [PUBLICATION_QUERY_KEY, id] });
    },
  });
};

export const useDeactivatePublicationMutation = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async (publicationId: string) => {
      const token = (await getToken()) ?? '';
      return deactivatePublication(publicationId, token);
    },
    onSuccess: (_, id) => {
      // Update cache instantly
      queryClient.setQueryData([PUBLICATION_QUERY_KEY, id], (oldData: Publication | undefined) => {
        if (!oldData) return;
        return { ...oldData, status: DocumentStatus.INACTIVE };
      });

      queryClient.invalidateQueries({ queryKey: [PUBLICATIONS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [PUBLICATION_QUERY_KEY, id] });
    },
  });
};

export const useDeletePublicationMutation = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async (publicationId: string) => {
      const token = (await getToken()) ?? '';
      return deletePublication(publicationId, token);
    },
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: [PUBLICATION_QUERY_KEY, id] });

      // Update paginated list cache by filtering out the deleted publication
      queryClient.setQueryData([PUBLICATIONS_QUERY_KEY], (oldData: PaginatedResult<Publication> | undefined) => {
        if (!oldData) return;
        return {
          ...oldData,
          items: oldData.items.filter(publication => publication.id !== id), // Remove deleted publication
        };
      });

      queryClient.invalidateQueries({ queryKey: [PUBLICATIONS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [PUBLICATION_QUERY_KEY, id] });
    },
  });
};

export const useCreatePublicationMutation = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation<Publication, ApiError, CreatePublicationDto, { previousPublications?: PaginatedResult<Publication> }>({
    mutationFn: async (publicationDto: CreatePublicationDto) => {
      const token = (await getToken()) ?? '';
      return createPublication(publicationDto, token);
    },

    onMutate: async (newPublicationData) => {
      await queryClient.cancelQueries({ queryKey: [PUBLICATIONS_QUERY_KEY] });

      // Snapshot current publications for rollback
      const previousPublications = queryClient.getQueryData<PaginatedResult<Publication>>([PUBLICATIONS_QUERY_KEY]);

      const defaultPagination = { totalCount: 1, totalPages: 1, currentPage: 1, currentPageSize: 1 };

      // Optimistically add a temp publication
      queryClient.setQueryData([PUBLICATIONS_QUERY_KEY], (oldData?: PaginatedResult<Publication>) => {
        if (!oldData) {
          return {
            items: [{ id: 'temp-id', ...newPublicationData }],
            pagination: defaultPagination,
          };
        }

        return {
          ...oldData,
          items: [{ id: 'temp-id', ...newPublicationData }, ...oldData.items],
          pagination: {
            ...oldData.pagination,
            totalCount: oldData.pagination.totalCount + 1,
          },
        };
      });

      return { previousPublications };
    },

    onSuccess: (createdPublication) => {
      if (!createdPublication || !createdPublication.id) return;

      // Replace the temp publication with the actual one
      queryClient.setQueryData([PUBLICATIONS_QUERY_KEY], (oldData?: PaginatedResult<Publication>) => {
        if (!oldData) {
          return {
            items: [createdPublication],
            pagination: { totalCount: 1, totalPages: 1, currentPage: 1, currentPageSize: 1 },
          };
        }

        return {
          ...oldData,
          items: oldData.items.map((pub) =>
            pub.id === 'temp-id' ? createdPublication : pub
          ),
          pagination: {
            ...oldData.pagination,
            totalCount: Math.max(oldData.pagination.totalCount, oldData.items.length),
          },
        };
      });

      // Also cache the individual publication
      queryClient.setQueryData([PUBLICATION_QUERY_KEY, createdPublication.id], createdPublication);
    },

    onError: (_error, _newPublicationData, context) => {
      if (context?.previousPublications) {
        queryClient.setQueryData([PUBLICATIONS_QUERY_KEY], context.previousPublications);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [PUBLICATIONS_QUERY_KEY], refetchType: 'active' });
    },
  });
};

export const useUpdatePublicationMutation = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async (variables: {publicationId: string, publicationDto: UpdatePublicationDto}) => {
      const token = (await getToken()) ?? '';
      return updatePublication(variables.publicationId, variables.publicationDto, token);
    },
    onSuccess: (updatedPublication) => {
      if (!updatedPublication || !updatedPublication.id) return;

      // Update publication list cache
      queryClient.setQueryData([PUBLICATIONS_QUERY_KEY], (oldData?: PaginatedResult<Publication>) => {
        if (!oldData) return;

        return {
          ...oldData,
          items: oldData.items.map((publication) => 
            publication.id === updatedPublication.id ? updatedPublication : publication
          ),
        };
      });

      // Update individual publication cache
      queryClient.setQueryData([PUBLICATION_QUERY_KEY, updatedPublication.id], updatedPublication);
    },
    onSettled: (_data, _error, variables) => {
      // Refetch only the updated mcq instead of all courses
      queryClient.invalidateQueries({ queryKey: [PUBLICATION_QUERY_KEY, variables.publicationId] });
      queryClient.invalidateQueries({ queryKey: [PUBLICATIONS_QUERY_KEY], refetchType: 'active' });
    },
  });
};

export const usePublicationKeywordFrequenciesQuery = () => {
  return useQuery<LabelValueStat[], ApiError>({
    queryKey: [PUBLICATION_KEYWORD_FREQUENCIES_QUERY_KEY],
    queryFn: () => getPublicationKeywordFrequencies(),
    refetchOnWindowFocus: false, // Prevents unnecessary API calls when switching tabs
  });
};

export const useYearlyPublicationsQuery = () => {
  return useQuery<LabelValueStat[], ApiError>({
    queryKey: [YEARLY_PUBLICATIONS_QUERY_KEY],
    queryFn: () => getYearlyPublications(),
    refetchOnWindowFocus: false, // Prevents unnecessary API calls when switching tabs
  });
};
