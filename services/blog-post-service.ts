import { API_BASE_URL, BLOG_POSTS_PATH } from "@/constants/api-paths";
import { CreateBlogPostTextEnDto, UpdateBlogPostTextEnDto, UpdateBlogPostTextSiDto } from "@/dtos/blog-post-dto";
import DocumentStatus from "@/enums/document-status";
import { handleApiError } from "@/errors/api-error-handler";
import BlogPost from "@/interfaces/i-blog-post";
import BlogPostView from "@/interfaces/i-blog-post-view";
import PaginatedResult from "@/interfaces/i-paginated-result";
import { buildHeaders } from "@/utils/common-utils";
import axios from "axios";

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
        status: DocumentStatus.ACTIVE,
        sort: 'latest',
        lang,
      },
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const publishBlogPost = async (id: string, token: string): Promise<BlogPost> => {
  try {
    const response = await axios.patch<BlogPost>(
      `${API_BASE_URL}${BLOG_POSTS_PATH}/${id}/toggle`,
      { status: DocumentStatus.ACTIVE },
      buildHeaders(token)
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const unpublishBlogPost = async (id: string, token: string): Promise<BlogPost> => {
  try {
    const response = await axios.patch<BlogPost>(
      `${API_BASE_URL}${BLOG_POSTS_PATH}/${id}/toggle`,
      { status: DocumentStatus.INACTIVE },
      buildHeaders(token)
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const deleteBlogPost = async (id: string, token: string) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}${BLOG_POSTS_PATH}/${id}`,
      buildHeaders(token)
    );
    if (response.status !== 204) {
      throw new Error('Failed to delete blog post');
    }
    return { id, message: 'Blog post deleted successfully' };
  } catch (error) {
    throw handleApiError(error);
  }
};

export const createBlogPostTextEn = async (blogPostTextEnDto: CreateBlogPostTextEnDto, token: string): Promise<BlogPost> => {
  try {
    const response = await axios.post<BlogPost>(
      `${API_BASE_URL}${BLOG_POSTS_PATH}`,
      blogPostTextEnDto,
      buildHeaders(token)
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const updateBlogPostTextSi = async (id: string, blogPostTextSiDto: UpdateBlogPostTextSiDto, token: string): Promise<BlogPost> => {
  try {
    const response = await axios.patch<BlogPost>(
      `${API_BASE_URL}${BLOG_POSTS_PATH}/${id}/si`,
      blogPostTextSiDto,
      buildHeaders(token)
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const uploadBlogPostPrimaryImage = async (id: string, formData: FormData, token: string): Promise<BlogPost> => {
  try {
    const response = await axios.patch<BlogPost>(
      `${API_BASE_URL}${BLOG_POSTS_PATH}/${id}/primary-image`,
      formData,
      buildHeaders(token)
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const updateBlogPostTextEn = async (id: string, blogPostTextEnDto: UpdateBlogPostTextEnDto, token: string): Promise<BlogPost> => {
  try {
    const response = await axios.patch<BlogPost>(
      `${API_BASE_URL}${BLOG_POSTS_PATH}/${id}/en`,
      blogPostTextEnDto,
      buildHeaders(token)
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};
