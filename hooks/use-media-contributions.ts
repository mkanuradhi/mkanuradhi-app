import { getHomeRoutes, getMediaContributionRoutes } from "@/constants/revalidation-routes";
import { CreateMediaContributionDto, updateMediaContributionDto } from "@/dtos/media-contribution-dto";
import DocumentStatus from "@/enums/document-status";
import { ApiError } from "@/errors/api-error";
import MediaContribution, { LocalizedMediaContribution, LocalizedSummaryMediaContribution } from "@/interfaces/i-media-contribution";
import PaginatedResult from "@/interfaces/i-paginated-result";
import { triggerRevalidation } from "@/services/common-service";
import { activateMediaContribution, createMediaContribution, deactivateMediaContribution, deleteAuthorImage, deleteCoverImage, deleteInterviewerImage, deleteMediaContribution, deleteOutletImage, deletePreviewImage, deleteSampleFile, getLocalizedMediaContributionByPath, getLocalizedMediaContributions, getMediaContributionById, getMediaContributions, updateMediaContribution, uploadAuthorImage, uploadCoverImage, uploadInterviewerImage, uploadOutletImage, uploadPreviewImages, uploadSampleFile } from "@/services/media-contribution-service";
import { useAuth } from "@clerk/nextjs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const MEDIA_CONTRIBUTION_QUERY_KEY  = 'media-contribution';
const MEDIA_CONTRIBUTIONS_QUERY_KEY = 'media-contributions';
const LOCALIZED_MEDIA_CONTRIBUTION_QUERY_KEY  = 'localized_media_contribution';
const LOCALIZED_MEDIA_CONTRIBUTIONS_QUERY_KEY = 'localized_media_contributions';

// ── Queries ───────────────────────────────────────────────────────────────────

export const useLocalizedMediaContributionsQuery = (
  lang: string,
  page: number,
  size: number,
  initialMediaContributions?: PaginatedResult<LocalizedSummaryMediaContribution>
) => {
  return useQuery<PaginatedResult<LocalizedSummaryMediaContribution>, ApiError>({
    queryKey:             [LOCALIZED_MEDIA_CONTRIBUTIONS_QUERY_KEY, lang, page, size],
    queryFn:              () => getLocalizedMediaContributions(lang, page, size),
    initialData:          initialMediaContributions,
    initialDataUpdatedAt: Date.now(),
    staleTime:            15_000,
    placeholderData:      (prevData) => prevData ?? {
      items: [],
      pagination: { totalCount: 0, totalPages: 1, currentPage: page, currentPageSize: 0 },
    },
    refetchOnWindowFocus: false,
  });
};

export const useLocalizedMediaContributionByPathQuery = (lang: string, path: string) => {

  return useQuery<LocalizedMediaContribution, ApiError>({
    queryKey:             [LOCALIZED_MEDIA_CONTRIBUTION_QUERY_KEY, lang, path],
    queryFn:              () => getLocalizedMediaContributionByPath(lang, path),
    refetchOnWindowFocus: false,
  });
};

export const useMediaContributionsQuery = (
  page: number,
  size: number,
  initialMediaContributions?: PaginatedResult<MediaContribution>
) => {
  const { getToken } = useAuth();

  return useQuery<PaginatedResult<MediaContribution>, ApiError>({
    queryKey:             [MEDIA_CONTRIBUTIONS_QUERY_KEY, page, size],
    queryFn:   async () => {
      const token = (await getToken()) ?? '';
      return getMediaContributions(page, size, token);
    },
    initialData:          initialMediaContributions,
    initialDataUpdatedAt: Date.now(),
    staleTime:            15_000,
    placeholderData:      (prevData) => prevData ?? {
      items: [],
      pagination: { totalCount: 0, totalPages: 1, currentPage: page, currentPageSize: 0 },
    },
    refetchOnWindowFocus: false,
  });
};

export const useMediaContributionByIdQuery = (mediaContributionId: string) => {
  const { getToken } = useAuth();

  return useQuery<MediaContribution, ApiError>({
    queryKey:             [MEDIA_CONTRIBUTION_QUERY_KEY, mediaContributionId],
    queryFn:   async () => {
      const token = (await getToken()) ?? '';
      return getMediaContributionById(mediaContributionId, token);
    },
    refetchOnWindowFocus: false,
  });
};

// ── Mutations ─────────────────────────────────────────────────────────────────

export const useCreateMediaContributionMutation = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation<MediaContribution, ApiError, CreateMediaContributionDto, { previousMediaContributions?: PaginatedResult<MediaContribution> }>({
    mutationFn: async (mediaContributionDto: CreateMediaContributionDto) => {
      const token = (await getToken()) ?? '';
      return createMediaContribution(mediaContributionDto, token);
    },

    onMutate: async (newMediaContributionData) => {
      await queryClient.cancelQueries({ queryKey: [MEDIA_CONTRIBUTIONS_QUERY_KEY] });

      const previousMediaContributions = queryClient.getQueryData<PaginatedResult<MediaContribution>>([MEDIA_CONTRIBUTIONS_QUERY_KEY]);

      const defaultPagination = { totalCount: 1, totalPages: 1, currentPage: 1, currentPageSize: 1 };

      queryClient.setQueryData([MEDIA_CONTRIBUTIONS_QUERY_KEY], (oldData?: PaginatedResult<MediaContribution>) => {
        if (!oldData) {
          return {
            items:      [{ id: 'temp-id', ...newMediaContributionData }],
            pagination: defaultPagination,
          };
        }
        return {
          ...oldData,
          items: [{ id: 'temp-id', ...newMediaContributionData }, ...oldData.items],
          pagination: {
            ...oldData.pagination,
            totalCount: oldData.pagination.totalCount + 1,
          },
        };
      });

      return { previousMediaContributions };
    },

    onSuccess: async (createdMediaContribution) => {
      if (!createdMediaContribution || !createdMediaContribution.id) return;

      queryClient.setQueryData([MEDIA_CONTRIBUTIONS_QUERY_KEY], (oldData?: PaginatedResult<MediaContribution>) => {
        if (!oldData) {
          return {
            items:      [createdMediaContribution],
            pagination: { totalCount: 1, totalPages: 1, currentPage: 1, currentPageSize: 1 },
          };
        }
        return {
          ...oldData,
          items: oldData.items.map(mediaContribution =>
            mediaContribution.id === 'temp-id' ? createdMediaContribution : mediaContribution
          ),
          pagination: {
            ...oldData.pagination,
            totalCount: Math.max(oldData.pagination.totalCount, oldData.items.length),
          },
        };
      });

      queryClient.setQueryData([MEDIA_CONTRIBUTION_QUERY_KEY, createdMediaContribution.id], createdMediaContribution);

      const paths = [
        ...getMediaContributionRoutes(),
        ...(createdMediaContribution.path ? getMediaContributionRoutes(createdMediaContribution.path) : []),
        ...getHomeRoutes(),
      ];
      const token = (await getToken()) ?? '';
      await triggerRevalidation(paths, token);
    },

    onError: (_error, _newMediaContributionData, context) => {
      if (context?.previousMediaContributions) {
        queryClient.setQueryData([MEDIA_CONTRIBUTIONS_QUERY_KEY], context.previousMediaContributions);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [MEDIA_CONTRIBUTIONS_QUERY_KEY], refetchType: 'active' });
    },
  });
};

export const useActivateMediaContributionMutation = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async (mediaContributionId: string) => {
      const token = (await getToken()) ?? '';
      return activateMediaContribution(mediaContributionId, token);
    },
    onSuccess: async (_, id) => {
      const paths = [
        ...getMediaContributionRoutes(),
        ...getHomeRoutes(),
      ];
      const token = (await getToken()) ?? '';
      await triggerRevalidation(paths, token);

      queryClient.setQueryData([MEDIA_CONTRIBUTION_QUERY_KEY, id], (oldData: MediaContribution | undefined) => {
        if (!oldData) return;
        return { ...oldData, status: DocumentStatus.ACTIVE };
      });
      queryClient.invalidateQueries({ queryKey: [MEDIA_CONTRIBUTIONS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [MEDIA_CONTRIBUTION_QUERY_KEY, id] });
    },
  });
};

export const useDeactivateMediaContributionMutation = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async (mediaContributionId: string) => {
      const token = (await getToken()) ?? '';
      return deactivateMediaContribution(mediaContributionId, token);
    },
    onSuccess: async (_, id) => {
      const paths = [
        ...getMediaContributionRoutes(),
        ...getHomeRoutes(),
      ];
      const token = (await getToken()) ?? '';
      await triggerRevalidation(paths, token);

      queryClient.setQueryData([MEDIA_CONTRIBUTION_QUERY_KEY, id], (oldData: MediaContribution | undefined) => {
        if (!oldData) return;
        return { ...oldData, status: DocumentStatus.INACTIVE };
      });
      queryClient.invalidateQueries({ queryKey: [MEDIA_CONTRIBUTIONS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [MEDIA_CONTRIBUTION_QUERY_KEY, id] });
    },
  });
};

export const useDeleteMediaContributionMutation = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async (mediaContributionId: string) => {
      const token = (await getToken()) ?? '';
      return deleteMediaContribution(mediaContributionId, token);
    },
    onSuccess: async (_, id) => {
      // Grab the path before we drop the cached media contribution entry
      const cachedMediaContribution = queryClient.getQueryData<MediaContribution>([MEDIA_CONTRIBUTION_QUERY_KEY, id]);

      queryClient.removeQueries({ queryKey: [MEDIA_CONTRIBUTION_QUERY_KEY, id] });
      queryClient.setQueryData([MEDIA_CONTRIBUTIONS_QUERY_KEY], (oldData: PaginatedResult<MediaContribution> | undefined) => {
        if (!oldData) return;
        return {
          ...oldData,
          items: oldData.items.filter(mediaContribution => mediaContribution.id !== id),
        };
      });
      queryClient.invalidateQueries({ queryKey: [MEDIA_CONTRIBUTIONS_QUERY_KEY] });

      const paths = [
        ...getMediaContributionRoutes(),
        ...(cachedMediaContribution?.path ? getMediaContributionRoutes(cachedMediaContribution.path) : []),
        ...getHomeRoutes(),
      ];
      const token = (await getToken()) ?? '';
      await triggerRevalidation(paths, token);
    },
  });
};

export const useUpdateMediaContributionMutation = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async (variables: {id: string, mediaContributionDto: updateMediaContributionDto}) => {
      const token = (await getToken()) ?? '';
      return updateMediaContribution(variables.id, variables.mediaContributionDto, token);
    },
    onSuccess: async (updatedMediaContribution) => {
      if (!updatedMediaContribution || !updatedMediaContribution.id) return;

      // Update individual media contribution cache
      queryClient.setQueryData([MEDIA_CONTRIBUTION_QUERY_KEY, updatedMediaContribution.id], updatedMediaContribution);

      // Update media contribution list cache
      queryClient.setQueryData([MEDIA_CONTRIBUTIONS_QUERY_KEY], (oldData?: PaginatedResult<MediaContribution>) => {
        if (!oldData) return;

        return {
          ...oldData,
          items: oldData.items.map((mediaContribution) => 
            mediaContribution.id === updatedMediaContribution.id ? updatedMediaContribution : mediaContribution
          ),
        };
      });

      const paths = [
        ...getMediaContributionRoutes(),
        ...(updatedMediaContribution.path ? getMediaContributionRoutes(updatedMediaContribution.path) : []),
        ...getHomeRoutes(),
      ];
      const token = (await getToken()) ?? '';
      await triggerRevalidation(paths, token);
    },
    onSettled: (_data, _error, variables) => {
      // Refetch only the updated media contribution instead of all media contributions
      queryClient.invalidateQueries({ queryKey: [MEDIA_CONTRIBUTION_QUERY_KEY, variables.id] });
      queryClient.invalidateQueries({ queryKey: [MEDIA_CONTRIBUTIONS_QUERY_KEY], refetchType: 'active' });
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

    onSuccess: (updatedMediaContribution) => {
      if (!updatedMediaContribution || !updatedMediaContribution.id) return;

      // Update individual media contribution cache
      queryClient.setQueryData([MEDIA_CONTRIBUTION_QUERY_KEY, updatedMediaContribution.id], updatedMediaContribution);

      // Update paginated list cache
      queryClient.setQueryData([MEDIA_CONTRIBUTIONS_QUERY_KEY], (oldData?: PaginatedResult<MediaContribution>) => {
        if (!oldData) return;
        return {
          ...oldData,
          items: oldData.items.map(mediaContribution =>
            mediaContribution.id === updatedMediaContribution.id ? updatedMediaContribution : mediaContribution
          ),
        };
      });

      queryClient.invalidateQueries({ queryKey: [MEDIA_CONTRIBUTION_QUERY_KEY, updatedMediaContribution.id] });
    },
  });
};

export const useDeleteCoverImageMutation = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async (mediaContributionId: string) => {
      const token = (await getToken()) ?? '';
      return deleteCoverImage(mediaContributionId, token);
    },

    onSuccess: (updatedMediaContribution) => {
      if (!updatedMediaContribution || !updatedMediaContribution.id) return;

      // Update individual media contribution cache
      queryClient.setQueryData([MEDIA_CONTRIBUTION_QUERY_KEY, updatedMediaContribution.id], updatedMediaContribution);

      // Update paginated list cache
      queryClient.setQueryData([MEDIA_CONTRIBUTIONS_QUERY_KEY], (oldData?: PaginatedResult<MediaContribution>) => {
        if (!oldData) return;
        return {
          ...oldData,
          items: oldData.items.map(mediaContribution =>
            mediaContribution.id === updatedMediaContribution.id ? updatedMediaContribution : mediaContribution
          ),
        };
      });

      queryClient.invalidateQueries({ queryKey: [MEDIA_CONTRIBUTION_QUERY_KEY, updatedMediaContribution.id] });
    },
  });
};

export const useUploadAuthorImageMutation = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async ({ mediaContributionId, authorId, formData }: { mediaContributionId: string; authorId: string; formData: FormData }) => {
      const token = (await getToken()) ?? '';
      return uploadAuthorImage(mediaContributionId, authorId, formData, token);
    },

    onSuccess: (updatedMediaContribution) => {
      if (!updatedMediaContribution || !updatedMediaContribution.id) return;

      // Update individual media contribution cache
      queryClient.setQueryData([MEDIA_CONTRIBUTION_QUERY_KEY, updatedMediaContribution.id], updatedMediaContribution);

      // Update paginated list cache
      queryClient.setQueryData([MEDIA_CONTRIBUTIONS_QUERY_KEY], (oldData?: PaginatedResult<MediaContribution>) => {
        if (!oldData) return;
        return {
          ...oldData,
          items: oldData.items.map(mediaContribution =>
            mediaContribution.id === updatedMediaContribution.id ? updatedMediaContribution : mediaContribution
          ),
        };
      });

      queryClient.invalidateQueries({ queryKey: [MEDIA_CONTRIBUTION_QUERY_KEY, updatedMediaContribution.id] });
    },
  });
};

export const useDeleteAuthorImageMutation = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async ({mediaContributionId, authorId}: {mediaContributionId: string, authorId: string}) => {
      const token = (await getToken()) ?? '';
      return deleteAuthorImage(mediaContributionId, authorId, token);
    },

    onSuccess: (updatedMediaContribution) => {
      if (!updatedMediaContribution || !updatedMediaContribution.id) return;

      // Update individual media contribution cache
      queryClient.setQueryData([MEDIA_CONTRIBUTION_QUERY_KEY, updatedMediaContribution.id], updatedMediaContribution);

      // Update paginated list cache
      queryClient.setQueryData([MEDIA_CONTRIBUTIONS_QUERY_KEY], (oldData?: PaginatedResult<MediaContribution>) => {
        if (!oldData) return;
        return {
          ...oldData,
          items: oldData.items.map(mediaContribution =>
            mediaContribution.id === updatedMediaContribution.id ? updatedMediaContribution : mediaContribution
          ),
        };
      });

      queryClient.invalidateQueries({ queryKey: [MEDIA_CONTRIBUTION_QUERY_KEY, updatedMediaContribution.id] });
    },
  });
};

export const useUploadInterviewerImageMutation = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async ({ mediaContributionId, interviewerId, formData }: { mediaContributionId: string; interviewerId: string; formData: FormData }) => {
      const token = (await getToken()) ?? '';
      return uploadInterviewerImage(mediaContributionId, interviewerId, formData, token);
    },

    onSuccess: (updatedMediaContribution) => {
      if (!updatedMediaContribution || !updatedMediaContribution.id) return;

      // Update individual media contribution cache
      queryClient.setQueryData([MEDIA_CONTRIBUTION_QUERY_KEY, updatedMediaContribution.id], updatedMediaContribution);

      // Update paginated list cache
      queryClient.setQueryData([MEDIA_CONTRIBUTIONS_QUERY_KEY], (oldData?: PaginatedResult<MediaContribution>) => {
        if (!oldData) return;
        return {
          ...oldData,
          items: oldData.items.map(mediaContribution =>
            mediaContribution.id === updatedMediaContribution.id ? updatedMediaContribution : mediaContribution
          ),
        };
      });

      queryClient.invalidateQueries({ queryKey: [MEDIA_CONTRIBUTION_QUERY_KEY, updatedMediaContribution.id] });
    },
  });
};

export const useDeleteInterviewerImageMutation = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async ({mediaContributionId, interviewerId}: {mediaContributionId: string, interviewerId: string}) => {
      const token = (await getToken()) ?? '';
      return deleteInterviewerImage(mediaContributionId, interviewerId, token);
    },

    onSuccess: (updatedMediaContribution) => {
      if (!updatedMediaContribution || !updatedMediaContribution.id) return;

      // Update individual media contribution cache
      queryClient.setQueryData([MEDIA_CONTRIBUTION_QUERY_KEY, updatedMediaContribution.id], updatedMediaContribution);

      // Update paginated list cache
      queryClient.setQueryData([MEDIA_CONTRIBUTIONS_QUERY_KEY], (oldData?: PaginatedResult<MediaContribution>) => {
        if (!oldData) return;
        return {
          ...oldData,
          items: oldData.items.map(mediaContribution =>
            mediaContribution.id === updatedMediaContribution.id ? updatedMediaContribution : mediaContribution
          ),
        };
      });

      queryClient.invalidateQueries({ queryKey: [MEDIA_CONTRIBUTION_QUERY_KEY, updatedMediaContribution.id] });
    },
  });
};

export const useUploadOutletImageMutation = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async ({ id, formData }: { id: string; formData: FormData }) => {
      const token = (await getToken()) ?? '';
      return uploadOutletImage(id, formData, token);
    },

    onSuccess: (updatedMediaContribution) => {
      if (!updatedMediaContribution || !updatedMediaContribution.id) return;

      // Update individual media contribution cache
      queryClient.setQueryData([MEDIA_CONTRIBUTION_QUERY_KEY, updatedMediaContribution.id], updatedMediaContribution);

      // Update paginated list cache
      queryClient.setQueryData([MEDIA_CONTRIBUTIONS_QUERY_KEY], (oldData?: PaginatedResult<MediaContribution>) => {
        if (!oldData) return;
        return {
          ...oldData,
          items: oldData.items.map(mediaContribution =>
            mediaContribution.id === updatedMediaContribution.id ? updatedMediaContribution : mediaContribution
          ),
        };
      });

      queryClient.invalidateQueries({ queryKey: [MEDIA_CONTRIBUTION_QUERY_KEY, updatedMediaContribution.id] });
    },
  });
};

export const useDeleteOutletImageMutation = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async (mediaContributionId: string) => {
      const token = (await getToken()) ?? '';
      return deleteOutletImage(mediaContributionId, token);
    },

    onSuccess: (updatedMediaContribution) => {
      if (!updatedMediaContribution || !updatedMediaContribution.id) return;

      // Update individual media contribution cache
      queryClient.setQueryData([MEDIA_CONTRIBUTION_QUERY_KEY, updatedMediaContribution.id], updatedMediaContribution);

      // Update paginated list cache
      queryClient.setQueryData([MEDIA_CONTRIBUTIONS_QUERY_KEY], (oldData?: PaginatedResult<MediaContribution>) => {
        if (!oldData) return;
        return {
          ...oldData,
          items: oldData.items.map(mediaContribution =>
            mediaContribution.id === updatedMediaContribution.id ? updatedMediaContribution : mediaContribution
          ),
        };
      });

      queryClient.invalidateQueries({ queryKey: [MEDIA_CONTRIBUTION_QUERY_KEY, updatedMediaContribution.id] });
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

    onSuccess: updatedMediaContribution => {
      if (!updatedMediaContribution || !updatedMediaContribution.id) return;

      queryClient.setQueryData(
        [MEDIA_CONTRIBUTION_QUERY_KEY, updatedMediaContribution.id],
        updatedMediaContribution
      );

      queryClient.setQueryData(
        [MEDIA_CONTRIBUTIONS_QUERY_KEY],
        (oldData?: PaginatedResult<MediaContribution>) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            items: oldData.items.map(mediaContribution =>
              mediaContribution.id === updatedMediaContribution.id ? updatedMediaContribution : mediaContribution
            ),
          };
        }
      );

      queryClient.invalidateQueries({
        queryKey: [MEDIA_CONTRIBUTION_QUERY_KEY, updatedMediaContribution.id],
      });
    },
  });
};

export const useDeletePreviewImageMutation = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async ({ mediaContributionId, previewImageId }: { mediaContributionId: string; previewImageId: string }) => {
      const token = (await getToken()) ?? '';
      return deletePreviewImage(mediaContributionId, previewImageId, token);
    },

    onSuccess: (updatedMediaContribution) => {
      if (!updatedMediaContribution || !updatedMediaContribution.id) return;

      // Update individual media contribution cache
      queryClient.setQueryData([MEDIA_CONTRIBUTION_QUERY_KEY, updatedMediaContribution.id], updatedMediaContribution);

      // Update paginated list cache
      queryClient.setQueryData([MEDIA_CONTRIBUTIONS_QUERY_KEY], (oldData?: PaginatedResult<MediaContribution>) => {
        if (!oldData) return;
        return {
          ...oldData,
          items: oldData.items.map(mediaContribution =>
            mediaContribution.id === updatedMediaContribution.id ? updatedMediaContribution : mediaContribution
          ),
        };
      });

      queryClient.invalidateQueries({ queryKey: [MEDIA_CONTRIBUTION_QUERY_KEY, updatedMediaContribution.id] });
    },
  });
};

export const useUploadSampleFileMutation = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async ({ id, formData }: { id: string; formData: FormData }) => {
      const token = (await getToken()) ?? '';
      return uploadSampleFile(id, formData, token);
    },

    onSuccess: (updatedMediaContribution) => {
      if (!updatedMediaContribution || !updatedMediaContribution.id) return;

      // Update individual media contribution cache
      queryClient.setQueryData([MEDIA_CONTRIBUTION_QUERY_KEY, updatedMediaContribution.id], updatedMediaContribution);

      // Update paginated list cache
      queryClient.setQueryData([MEDIA_CONTRIBUTIONS_QUERY_KEY], (oldData?: PaginatedResult<MediaContribution>) => {
        if (!oldData) return;
        return {
          ...oldData,
          items: oldData.items.map(mediaContribution =>
            mediaContribution.id === updatedMediaContribution.id ? updatedMediaContribution : mediaContribution
          ),
        };
      });

      queryClient.invalidateQueries({ queryKey: [MEDIA_CONTRIBUTION_QUERY_KEY, updatedMediaContribution.id] });
    },
  });
};

export const useDeleteSampleFileMutation = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async (mediaContributionId: string) => {
      const token = (await getToken()) ?? '';
      return deleteSampleFile(mediaContributionId, token);
    },

    onSuccess: (updatedMediaContribution) => {
      if (!updatedMediaContribution || !updatedMediaContribution.id) return;

      // Update individual book cache
      queryClient.setQueryData([MEDIA_CONTRIBUTION_QUERY_KEY, updatedMediaContribution.id], updatedMediaContribution);

      // Update paginated list cache
      queryClient.setQueryData([MEDIA_CONTRIBUTIONS_QUERY_KEY], (oldData?: PaginatedResult<MediaContribution>) => {
        if (!oldData) return;
        return {
          ...oldData,
          items: oldData.items.map(mediaContribution =>
            mediaContribution.id === updatedMediaContribution.id ? updatedMediaContribution : mediaContribution
          ),
        };
      });

      queryClient.invalidateQueries({ queryKey: [MEDIA_CONTRIBUTION_QUERY_KEY, updatedMediaContribution.id] });
    },
  });
};
