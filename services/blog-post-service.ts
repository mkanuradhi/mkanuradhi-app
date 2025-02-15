import { BLOG_POSTS_PATH } from "@/constants/api-paths";
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
