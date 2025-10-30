import { CreateAwardEnDto, UpdateAwardEnDto, UpdateAwardSiDto } from "@/dtos/award-dto";
import DocumentStatus from "@/enums/document-status";
import { ApiError } from "@/errors/api-error";
import Award from "@/interfaces/i-award";
import PaginatedResult from "@/interfaces/i-paginated-result";
import { activateAward, createAwardEn, deactivateAward, deleteAward, getAwardById, getAwards, updateAwardEn, updateAwardSi } from "@/services/award-service";
import { useAuth } from "@clerk/nextjs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const AWARD_QUERY_KEY = 'award';
const AWARDS_QUERY_KEY = 'awards';

export const useAwardsQuery = (page: number, size: number, initialAwards?: PaginatedResult<Award>) => {
  return useQuery<PaginatedResult<Award>, ApiError>({
    queryKey: [AWARDS_QUERY_KEY, page, size],
    queryFn: () => getAwards(page, size),
    initialData: initialAwards,
    initialDataUpdatedAt: Date.now(), // mark fresh now
    staleTime: 15_000, // 15 seconds fresh window
    placeholderData: (prevData) => prevData ?? { 
      items: [],
      pagination: { totalCount: 0, totalPages: 1, currentPage: page, currentPageSize: 0 } 
    }, // Keeps previous data until new data loads
    refetchOnWindowFocus: false, // Prevents unnecessary API calls when switching tabs
  });
};

export const useAwardByIdQuery = (awardId: string) => {
  return useQuery<Award, ApiError>({
    queryKey: [AWARD_QUERY_KEY, awardId],
    queryFn: () => getAwardById(awardId),
    refetchOnWindowFocus: false,
  });
};

export const useActivateAwardMutation = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async (awardId: string) => {
      const token = (await getToken()) ?? '';
      return activateAward(awardId, token);
    },
    onSuccess: (_, id) => {
      // Update cache instantly instead of re-fetching
      queryClient.setQueryData([AWARD_QUERY_KEY, id], (oldData: Award | undefined) => {
        if (!oldData) return;
        return { ...oldData, status: DocumentStatus.ACTIVE };
      });

      queryClient.invalidateQueries({ queryKey: [AWARDS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [AWARD_QUERY_KEY, id] });
    },
  });
};

export const useDeactivateAwardMutation = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async (awardId: string) => {
      const token = (await getToken()) ?? '';
      return deactivateAward(awardId, token);
    },
    onSuccess: (_, id) => {
      // Update cache instantly
      queryClient.setQueryData([AWARD_QUERY_KEY, id], (oldData: Award | undefined) => {
        if (!oldData) return;
        return { ...oldData, status: DocumentStatus.INACTIVE };
      });

      queryClient.invalidateQueries({ queryKey: [AWARDS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [AWARD_QUERY_KEY, id] });
    },
  });
};

export const useDeleteAwardMutation = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async (awardId: string) => {
      const token = (await getToken()) ?? '';
      return deleteAward(awardId, token);
    },
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: [AWARD_QUERY_KEY, id] });

      // Update paginated list cache by filtering out the deleted award
      queryClient.setQueryData([AWARDS_QUERY_KEY], (oldData: PaginatedResult<Award> | undefined) => {
        if (!oldData) return;
        return {
          ...oldData,
          items: oldData.items.filter(award => award.id !== id), // Remove deleted award
        };
      });

      queryClient.invalidateQueries({ queryKey: [AWARDS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [AWARD_QUERY_KEY, id] });
    },
  });
};

export const useCreateAwardEnMutation = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation<Award, ApiError, CreateAwardEnDto, { previousAwards?: PaginatedResult<Award> }>({
    mutationFn: async (awardEnDto: CreateAwardEnDto) => {
      const token = (await getToken()) ?? '';
      return createAwardEn(awardEnDto, token);
    },

    onMutate: async (newAwardData) => {
      await queryClient.cancelQueries({ queryKey: [AWARDS_QUERY_KEY] });

      // Snapshot current data for rollback
      const previousAwards = queryClient.getQueryData<PaginatedResult<Award>>([AWARDS_QUERY_KEY]);

      const defaultPagination = { totalCount: 1, totalPages: 1, currentPage: 1, currentPageSize: 1 };

      // Optimistically add a temp award
      queryClient.setQueryData([AWARDS_QUERY_KEY], (oldData?: PaginatedResult<Award>) => {
        if (!oldData) {
          return {
            items: [{ id: 'temp-id', ...newAwardData }],
            pagination: defaultPagination,
          };
        }

        return {
          ...oldData,
          items: [{ id: 'temp-id', ...newAwardData }, ...oldData.items],
          pagination: {
            ...oldData.pagination,
            totalCount: oldData.pagination.totalCount + 1,
          },
        };
      });

      return { previousAwards };
    },

    onSuccess: (createdAward) => {
      if (!createdAward || !createdAward.id) return;

      // Replace the temp award with the actual one
      queryClient.setQueryData([AWARDS_QUERY_KEY], (oldData?: PaginatedResult<Award>) => {
        if (!oldData) {
          return {
            items: [createdAward],
            pagination: { totalCount: 1, totalPages: 1, currentPage: 1, currentPageSize: 1 },
          };
        }

        return {
          ...oldData,
          items: oldData.items.map((award) =>
            award.id === 'temp-id' ? createdAward : award
          ),
          pagination: {
            ...oldData.pagination,
            totalCount: Math.max(oldData.pagination.totalCount, oldData.items.length),
          },
        };
      });

      // Also cache the individual award
      queryClient.setQueryData([AWARD_QUERY_KEY, createdAward.id], createdAward);
    },

    onError: (_error, _newAwardData, context) => {
      if (context?.previousAwards) {
        queryClient.setQueryData([AWARDS_QUERY_KEY], context.previousAwards);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [AWARDS_QUERY_KEY], refetchType: 'active' });
    },
  });
};

export const useUpdateAwardSiMutation = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async (variables: {id: string, awardSiDto: UpdateAwardSiDto}) => {
      const token = (await getToken()) ?? '';
      return updateAwardSi(variables.id, variables.awardSiDto, token);
    },
    onSuccess: (updatedAward) => {
      if (!updatedAward || !updatedAward.id) return;

      // Update award list cache
      queryClient.setQueryData([AWARDS_QUERY_KEY], (oldData?: PaginatedResult<Award>) => {
        if (!oldData) return;

        return {
          ...oldData,
          items: oldData.items.map((award) => 
            award.id === updatedAward.id ? updatedAward : award
          ),
        };
      });

      // Update individual award cache
      queryClient.setQueryData([AWARD_QUERY_KEY, updatedAward.id], updatedAward);
    },
    onSettled: (_data, _error, variables) => {
      // Refetch only the updated award instead of all awards
      queryClient.invalidateQueries({ queryKey: [AWARD_QUERY_KEY, variables.id] });
      queryClient.invalidateQueries({ queryKey: [AWARDS_QUERY_KEY], refetchType: 'active' });
    },
  });
};

export const useUpdateAwardEnMutation = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async (variables: {id: string, awardEnDto: UpdateAwardEnDto}) => {
      const token = (await getToken()) ?? '';
      return updateAwardEn(variables.id, variables.awardEnDto, token);
    },
    onSuccess: (updatedAward) => {
      if (!updatedAward || !updatedAward.id) return;

      // Update award list cache
      queryClient.setQueryData([AWARDS_QUERY_KEY], (oldData?: PaginatedResult<Award>) => {
        if (!oldData) return;

        return {
          ...oldData,
          items: oldData.items.map((award) => 
            award.id === updatedAward.id ? updatedAward : award
          ),
        };
      });

      // Update individual award cache
      queryClient.setQueryData([AWARD_QUERY_KEY, updatedAward.id], updatedAward);
    },
    onSettled: (_data, _error, variables) => {
      // Refetch only the updated award instead of all awards
      queryClient.invalidateQueries({ queryKey: [AWARD_QUERY_KEY, variables.id] });
      queryClient.invalidateQueries({ queryKey: [AWARDS_QUERY_KEY], refetchType: 'active' });
    },
  });
};
