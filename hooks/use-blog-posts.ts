import BlogPost from '@/interfaces/i-blog-post';
import PaginatedResult from '@/interfaces/i-paginated-result';
import { deleteBlogPost, getBlogPosts, publishBlogPost, unpublishBlogPost } from '@/services/blog-post-service';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

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

export const usePublishBlogPostMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => publishBlogPost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
    },
  });
};

export const useUnpublishBlogPostMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => unpublishBlogPost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
    },
  });
};

export const useDeleteBlogPostMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteBlogPost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
    },
  });
};
