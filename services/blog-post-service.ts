import { BLOG_POSTS_PATH } from "@/constants/api-paths";
import { CreateBlogPostTextEnDto, UpdateBlogPostTextSiDto } from "@/dtos/blog-post-dto";
import BlogPost from "@/interfaces/i-blog-post";
import BlogPostView from "@/interfaces/i-blog-post-view";
import PaginatedResult from "@/interfaces/i-paginated-result";
import { SearchResult } from "@/interfaces/i-search-result";
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

export const getBlogPosts = async (page: number, size: number): Promise<PaginatedResult<BlogPost>> => {
  const response = await axios.get<PaginatedResult<BlogPost>>(`${API_BASE_URL}${BLOG_POSTS_PATH}`, {
    params: {
      page,
      size,
     },
  });
  return response.data;
};

export const getBlogPostById = async (id: string): Promise<BlogPost> => {
  const response = await axios.get<BlogPost>(`${API_BASE_URL}${BLOG_POSTS_PATH}/id/${id}`);
  return response.data;
};

export const getBlogPostByPath = async (lang: string, path: string): Promise<BlogPostView> => {
  const response = await axios.get<BlogPostView>(`${API_BASE_URL}${BLOG_POSTS_PATH}/path/${path}`, {
    params: {
      lang,
     },
  });
  return response.data;
};

export const getPublishedBlogPosts = async (lang: string, page: number, size: number): Promise<BlogPostView[]> => {
  const response = await axios.get<SearchResult>(`${API_BASE_URL}${BLOG_POSTS_PATH}/search`, {
    params: {
      q: '',
      page,
      size,
      published: true,
      sort: 'latest',
      lang,
     },
  });
  const searchResult: SearchResult = response.data;
  return searchResult.data;
};

export const publishBlogPost = async (id: string): Promise<BlogPost> => {
  const response = await axios.patch<BlogPost>(
    `${API_BASE_URL}${BLOG_POSTS_PATH}/${id}/publish`,
    { published: true }
  );
  return response.data;
};

export const unpublishBlogPost = async (id: string): Promise<BlogPost> => {
  const response = await axios.patch<BlogPost>(
    `${API_BASE_URL}${BLOG_POSTS_PATH}/${id}/publish`,
    { published: false }
  );
  return response.data;
};

export const deleteBlogPost = async (id: string) => {
  const response = await axios.delete(`${API_BASE_URL}${BLOG_POSTS_PATH}/${id}`);
  if (response.status !== 204) {
    throw new Error('Failed to delete blog post');
  }
  return { id, message: 'Blog post deleted successfully' };
};

export const createBlogPostTextEn = async (blogPostTextEnDto: CreateBlogPostTextEnDto): Promise<BlogPost> => {
  const response = await axios.post<BlogPost>(
    `${API_BASE_URL}${BLOG_POSTS_PATH}`,
    blogPostTextEnDto
  );
  return response.data;
};

export const updateBlogPostTextSi = async (id: string, blogPostTextSiDto: UpdateBlogPostTextSiDto): Promise<BlogPost> => {
  const response = await axios.post<BlogPost>(
    `${API_BASE_URL}${BLOG_POSTS_PATH}/${id}/si`,
    blogPostTextSiDto
  );
  return response.data;
};
