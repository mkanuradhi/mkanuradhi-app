import BlogPost from '@/interfaces/i-blog-post';
import PaginatedResult from '@/interfaces/i-paginated-result';
import { getBlogPosts } from '@/services/blog-post-service';
import { useQuery } from '@tanstack/react-query';

export const useBlogPostsQuery = (page: number, size: number, initialBlogPosts?: PaginatedResult<BlogPost>) => {
  return useQuery<PaginatedResult<BlogPost>, Error>({
    queryKey: ['blog-posts', page, size],
    queryFn: () => getBlogPosts(page, size),
    initialData: initialBlogPosts,
    initialDataUpdatedAt: 0, // Marks initial data as stale, so React Query refetches when `page` changes
    placeholderData: (prevData) => prevData ?? { 
      items: [], 
      pagination: { totalCount: 0, totalPages: 1, currentPage: page, currentPageSize: 0 } 
    }, // Keeps previous data until new data loads
    refetchOnWindowFocus: false, // Prevents unnecessary API calls when switching tabs
  });
};