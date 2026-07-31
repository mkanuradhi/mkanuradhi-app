import { API_BASE_URL, STATS_PATH } from "@/constants/api-paths";
import { handleApiError } from "@/errors/api-error-handler";
import { SummaryStats } from "@/interfaces/i-stat";
import { handleFetchResponse } from "@/utils/common-utils";

const SUMMARY_REVALIDATE_SECONDS = 60 * 60 * 24; // 1 day

export const getCachedSummaryStats = async (): Promise<SummaryStats> => {
  try {
    const url = `${API_BASE_URL}${STATS_PATH}/summary`;
    
    const response = await fetch(url, {
      next: {
        revalidate: SUMMARY_REVALIDATE_SECONDS,
        tags: ['summary-stats']
      },
    });

    return await handleFetchResponse(response, `Failed to fetch summary stats`);
  } catch (error) {
    throw handleApiError(error);
  }
};