import BlogPost from '@/interfaces/i-blog-post';
import PaginatedResult from '@/interfaces/i-paginated-result';
import { createBlogPostTextEn, deleteBlogPost, getBlogPostById, getBlogPosts, publishBlogPost, unpublishBlogPost, updateBlogPostTextSi } from '@/services/blog-post-service';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CreateBlogPostTextEnDto, UpdateBlogPostTextSiDto } from '@/dtos/blog-post-dto';

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

export const useBlogPostByIdQuery = (id: string) => {
  return useQuery<BlogPost>({
    queryKey: ['blog-post', id],
    queryFn: () => getBlogPostById(id),
    refetchOnWindowFocus: false, // Prevents unnecessary API calls when switching tabs
  });
};

export const usePublishBlogPostMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => publishBlogPost(id),
    onSuccess: (_, id) => {
      // Update cache instantly instead of re-fetching
      queryClient.setQueryData(['blog-post', id], (oldData: BlogPost | undefined) => {
        if (!oldData) return;
        return { ...oldData, published: true };
      });

      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
    },
  });
};

export const useUnpublishBlogPostMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => unpublishBlogPost(id),
    onSuccess: (_, id) => {
      // Update cache instantly
      queryClient.setQueryData(['blog-post', id], (oldData: BlogPost | undefined) => {
        if (!oldData) return;
        return { ...oldData, published: false };
      });

      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
    },
  });
};

export const useDeleteBlogPostMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteBlogPost(id),
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: ['blog-post', id] });

      // Update paginated list cache by filtering out the deleted post
      queryClient.setQueryData(['blog-posts'], (oldData: PaginatedResult<BlogPost> | undefined) => {
        if (!oldData) return;
        return {
          ...oldData,
          items: oldData.items.filter(post => post.id !== id), // Remove deleted post
        };
      });

      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
    },
  });
};

export const useCreateBlogPostEnMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (blogPostTextEnDto: CreateBlogPostTextEnDto) => createBlogPostTextEn(blogPostTextEnDto),
    onMutate: async (newPostData) => {
      await queryClient.cancelQueries({ queryKey: ['blog-posts'] });

      // Snapshot previous data for rollback
      const previousBlogPosts = queryClient.getQueryData<PaginatedResult<BlogPost>>(['blog-posts']);

      // Define a fallback pagination structure
      const defaultPagination = { totalCount: 1, totalPages: 1, currentPage: 1, currentPageSize: 1 };

      // Optimistically add a new temporary post
      queryClient.setQueryData(['blog-posts'], (oldData?: PaginatedResult<BlogPost>) => {
        if (!oldData) return { 
          items: [{ id: 'temp-id', ...newPostData }], 
          pagination: defaultPagination,
        };

        return {
          ...oldData,
          items: [{ id: 'temp-id', ...newPostData }, ...oldData.items],
          pagination: { 
            ...oldData.pagination, 
            totalCount: oldData.pagination.totalCount + 1, // Optimistically increment total count
          },
        };
      });

      return { previousBlogPosts };
    },
    onSuccess: (createdBlogPost) => {
      if (!createdBlogPost || !createdBlogPost.id) return;

      // Replace temporary post with actual data
      queryClient.setQueryData(['blog-posts'], (oldData?: PaginatedResult<BlogPost>) => {
        if (!oldData) return { 
          items: [createdBlogPost], 
          pagination: { totalCount: 1, totalPages: 1, currentPage: 1, currentPageSize: 1 } 
        };

        return {
          ...oldData,
          items: oldData.items.map((post) =>
            post.id === 'temp-id' ? createdBlogPost : post
          ),
          pagination: {
            ...oldData.pagination,
            totalCount: Math.max(oldData.pagination.totalCount, oldData.items.length), // Ensure totalCount remains correct
          },
        };
      });

      // Cache the individual blog post
      queryClient.setQueryData(['blog-post', createdBlogPost.id], createdBlogPost);
    },
    onError: (_error, _newPostData, context) => {
      // Rollback to the previous state in case of failure
      if (context?.previousBlogPosts) {
        queryClient.setQueryData(['blog-posts'], context.previousBlogPosts);
      }
    },
    onSettled: () => {
      // Refetch in background to sync with backend
      queryClient.invalidateQueries({ queryKey: ['blog-posts'], refetchType: 'active' });
    },
  });
};

export const useUpdateBlogPostSiMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: {id: string, blogPostTextSiDto: UpdateBlogPostTextSiDto}) => updateBlogPostTextSi(variables.id, variables.blogPostTextSiDto),
    onSuccess: (updatedBlogPost) => {
      if (!updatedBlogPost || !updatedBlogPost.id) return;

      // Update blog post list cache
      queryClient.setQueryData(['blog-posts'], (oldData?: PaginatedResult<BlogPost>) => {
        if (!oldData) return;

        return {
          ...oldData,
          items: oldData.items.map((post) => 
            post.id === updatedBlogPost.id ? updatedBlogPost : post
          ),
        };
      });

      // Update individual blog post cache
      queryClient.setQueryData(['blog-post', updatedBlogPost.id], updatedBlogPost);
    },
    onSettled: (_data, _error, variables) => {
      // Refetch only the updated blog post instead of all posts
      queryClient.invalidateQueries({ queryKey: ['blog-post', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['blog-posts'], refetchType: 'active' });
    },
  });
};
