import { CreateResearchDto, UpdateResearchDto } from "@/dtos/research-dto";
import DocumentStatus from "@/enums/document-status";
import { ApiError } from "@/errors/api-error";
import PaginatedResult from "@/interfaces/i-paginated-result";
import Research from "@/interfaces/i-research";
import { activateResearch, createResearch, deactivateResearch, deleteResearch, getResearchById, getResearches, updateResearch } from "@/services/research-service";
import { useAuth } from "@clerk/nextjs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const RESEARCH_QUERY_KEY = 'research';
const RESEARCHES_QUERY_KEY = 'researches';

export const useResearchesQuery = (page: number, size: number, initialResearches?: PaginatedResult<Research>) => {
  return useQuery<PaginatedResult<Research>, ApiError>({
    queryKey: [RESEARCHES_QUERY_KEY, page, size],
    queryFn: () => getResearches(page, size),
    initialData: initialResearches,
    initialDataUpdatedAt: 0,
    placeholderData: (prevData) => prevData ?? {
      items: [], 
      pagination: { totalCount: 0, totalPages: 1, currentPage: page, currentPageSize: 0 }
    }, // Keeps previous data until new data loads
    refetchOnWindowFocus: false, // Prevents unnecessary API calls when switching tabs
  });
}

export const useResearchByIdQuery = (researchId: string) => {
  return useQuery<Research, ApiError>({
    queryKey: [RESEARCH_QUERY_KEY, researchId],
    queryFn: () => getResearchById(researchId),
    refetchOnWindowFocus: false,
  });
};

export const useActivateResearchMutation = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async (researchId: string) => {
      const token = (await getToken()) ?? '';
      return activateResearch(researchId, token);
    },
    onSuccess: (_, id) => {
      // Update cache instantly instead of re-fetching
      queryClient.setQueryData([RESEARCH_QUERY_KEY, id], (oldData: Research | undefined) => {
        if (!oldData) return;
        return { ...oldData, status: DocumentStatus.ACTIVE };
      });

      queryClient.invalidateQueries({ queryKey: [RESEARCHES_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [RESEARCH_QUERY_KEY, id] });
    },
  });
};

export const useDeactivateResearchMutation = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async (researchId: string) => {
      const token = (await getToken()) ?? '';
      return deactivateResearch(researchId, token);
    },
    onSuccess: (_, id) => {
      // Update cache instantly
      queryClient.setQueryData([RESEARCH_QUERY_KEY, id], (oldData: Research | undefined) => {
        if (!oldData) return;
        return { ...oldData, status: DocumentStatus.INACTIVE };
      });

      queryClient.invalidateQueries({ queryKey: [RESEARCHES_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [RESEARCH_QUERY_KEY, id] });
    },
  });
};

export const useDeleteResearchMutation = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async (researchId: string) => {
      const token = (await getToken()) ?? '';
      return deleteResearch(researchId, token);
    },
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: [RESEARCH_QUERY_KEY, id] });

      // Update paginated list cache by filtering out the deleted research
      queryClient.setQueryData([RESEARCHES_QUERY_KEY], (oldData: PaginatedResult<Research> | undefined) => {
        if (!oldData) return;
        return {
          ...oldData,
          items: oldData.items.filter(research => research.id !== id), // Remove deleted research
        };
      });

      queryClient.invalidateQueries({ queryKey: [RESEARCHES_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [RESEARCH_QUERY_KEY, id] });
    },
  });
};

export const useCreateResearchMutation = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation<Research, ApiError, CreateResearchDto, { previousResearches?: PaginatedResult<Research> }>({
    mutationFn: async (researchDto: CreateResearchDto) => {
      const token = (await getToken()) ?? '';
      return createResearch(researchDto, token);
    },

    onMutate: async (newResearchData) => {
      await queryClient.cancelQueries({ queryKey: [RESEARCHES_QUERY_KEY] });

      // Snapshot current research for rollback
      const previousResearches = queryClient.getQueryData<PaginatedResult<Research>>([RESEARCHES_QUERY_KEY]);

      const defaultPagination = { totalCount: 1, totalPages: 1, currentPage: 1, currentPageSize: 1 };

      // Optimistically add a temp research
      queryClient.setQueryData([RESEARCHES_QUERY_KEY], (oldData?: PaginatedResult<Research>) => {
        if (!oldData) {
          return {
            items: [{ id: 'temp-id', ...newResearchData }],
            pagination: defaultPagination,
          };
        }

        return {
          ...oldData,
          items: [{ id: 'temp-id', ...newResearchData }, ...oldData.items],
          pagination: {
            ...oldData.pagination,
            totalCount: oldData.pagination.totalCount + 1,
          },
        };
      });

      return { previousResearches };
    },

    onSuccess: (createdResearch) => {
      if (!createdResearch || !createdResearch.id) return;

      // Replace the temp research with the actual one
      queryClient.setQueryData([RESEARCHES_QUERY_KEY], (oldData?: PaginatedResult<Research>) => {
        if (!oldData) {
          return {
            items: [createdResearch],
            pagination: { totalCount: 1, totalPages: 1, currentPage: 1, currentPageSize: 1 },
          };
        }

        return {
          ...oldData,
          items: oldData.items.map((res) =>
            res.id === 'temp-id' ? createdResearch : res
          ),
          pagination: {
            ...oldData.pagination,
            totalCount: Math.max(oldData.pagination.totalCount, oldData.items.length),
          },
        };
      });

      // Also cache the individual research
      queryClient.setQueryData([RESEARCH_QUERY_KEY, createdResearch.id], createdResearch);
    },

    onError: (_error, _newResearchData, context) => {
      if (context?.previousResearches) {
        queryClient.setQueryData([RESEARCHES_QUERY_KEY], context.previousResearches);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [RESEARCHES_QUERY_KEY], refetchType: 'active' });
    },
  });
};

export const useUpdateResearchMutation = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async (variables: {researchId: string, researchDto: UpdateResearchDto}) => {
      const token = (await getToken()) ?? '';
      return updateResearch(variables.researchId, variables.researchDto, token);
    },
    onSuccess: (updatedResearch) => {
      if (!updatedResearch || !updatedResearch.id) return;

      // Update research list cache
      queryClient.setQueryData([RESEARCHES_QUERY_KEY], (oldData?: PaginatedResult<Research>) => {
        if (!oldData) return;

        return {
          ...oldData,
          items: oldData.items.map((research) => 
            research.id === updatedResearch.id ? updatedResearch : research
          ),
        };
      });

      // Update individual research cache
      queryClient.setQueryData([RESEARCH_QUERY_KEY, updatedResearch.id], updatedResearch);
    },
    onSettled: (_data, _error, variables) => {
      // Refetch only the updated mcq instead of all courses
      queryClient.invalidateQueries({ queryKey: [RESEARCH_QUERY_KEY, variables.researchId] });
      queryClient.invalidateQueries({ queryKey: [RESEARCHES_QUERY_KEY], refetchType: 'active' });
    },
  });
};
