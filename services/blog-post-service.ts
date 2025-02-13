import { BLOG_POSTS_PATH } from "@/constants/api-paths";
import BlogPost from "@/interfaces/i-blog-post";
import BlogPostView from "@/interfaces/i-blog-post-view";
import { SearchResult } from "@/interfaces/i-search-result";
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

export const getBlogPosts = async (): Promise<BlogPost[]> => {
  const response = await axios.get<BlogPost[]>(`${API_BASE_URL}${BLOG_POSTS_PATH}`);
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
