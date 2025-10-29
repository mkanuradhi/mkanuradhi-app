import { ApiError } from "@/errors/api-error";
import Award from "@/interfaces/i-award";
import PaginatedResult from "@/interfaces/i-paginated-result";
import { getAwardById, getAwards } from "@/services/award-service";
import { useQuery } from "@tanstack/react-query";

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
