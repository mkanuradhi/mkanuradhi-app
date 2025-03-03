import { BLOG_POSTS_PATH } from "@/constants/api-paths";
import { CreateBlogPostTextEnDto, UpdateBlogPostTextEnDto, UpdateBlogPostTextSiDto } from "@/dtos/blog-post-dto";
import { handleApiError } from "@/errors/api-error-handler";
import BlogPost from "@/interfaces/i-blog-post";
import BlogPostView from "@/interfaces/i-blog-post-view";
import PaginatedResult from "@/interfaces/i-paginated-result";
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

export const getBlogPosts = async (page: number, size: number): Promise<PaginatedResult<BlogPost>> => {
  try {
    const response = await axios.get<PaginatedResult<BlogPost>>(`${API_BASE_URL}${BLOG_POSTS_PATH}`, {
      params: {
        page,
        size,
      },
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getBlogPostById = async (id: string): Promise<BlogPost> => {
  try {
    const response = await axios.get<BlogPost>(`${API_BASE_URL}${BLOG_POSTS_PATH}/id/${id}`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getBlogPostByPath = async (lang: string, path: string): Promise<BlogPostView> => {
  try {
    const response = await axios.get<BlogPostView>(`${API_BASE_URL}${BLOG_POSTS_PATH}/path/${path}`, {
      params: {
        lang,
      },
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getPublishedBlogPosts = async (lang: string, page: number, size: number): Promise<PaginatedResult<BlogPostView>> => {
  try {
    const response = await axios.get<PaginatedResult<BlogPostView>>(`${API_BASE_URL}${BLOG_POSTS_PATH}/search`, {
      params: {
        q: '',
        page,
        size,
        published: true,
        sort: 'latest',
        lang,
      },
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const publishBlogPost = async (id: string): Promise<BlogPost> => {
  try {
    const response = await axios.patch<BlogPost>(
      `${API_BASE_URL}${BLOG_POSTS_PATH}/${id}/publish`,
      { published: true }
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const unpublishBlogPost = async (id: string): Promise<BlogPost> => {
  try {
    const response = await axios.patch<BlogPost>(
      `${API_BASE_URL}${BLOG_POSTS_PATH}/${id}/publish`,
      { published: false }
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const deleteBlogPost = async (id: string) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}${BLOG_POSTS_PATH}/${id}`);
    if (response.status !== 204) {
      throw new Error('Failed to delete blog post');
    }
    return { id, message: 'Blog post deleted successfully' };
  } catch (error) {
    throw handleApiError(error);
  }
};

export const createBlogPostTextEn = async (blogPostTextEnDto: CreateBlogPostTextEnDto): Promise<BlogPost> => {
  try {
    const response = await axios.post<BlogPost>(
      `${API_BASE_URL}${BLOG_POSTS_PATH}`,
      blogPostTextEnDto
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const updateBlogPostTextSi = async (id: string, blogPostTextSiDto: UpdateBlogPostTextSiDto): Promise<BlogPost> => {
  try {
    const response = await axios.patch<BlogPost>(
      `${API_BASE_URL}${BLOG_POSTS_PATH}/${id}/si`,
      blogPostTextSiDto
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const uploadBlogPostPrimaryImage = async (id: string, formData: FormData): Promise<BlogPost> => {
  try {
    const response = await axios.patch<BlogPost>(
      `${API_BASE_URL}${BLOG_POSTS_PATH}/${id}/primary-image`,
      formData
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const updateBlogPostTextEn = async (id: string, blogPostTextEnDto: UpdateBlogPostTextEnDto): Promise<BlogPost> => {
  try {
    const response = await axios.patch<BlogPost>(
      `${API_BASE_URL}${BLOG_POSTS_PATH}/${id}/en`,
      blogPostTextEnDto
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};
