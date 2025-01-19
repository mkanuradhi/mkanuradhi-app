import BlogPostView from "./i-blog-post-view";

export interface SearchResult {
  message: string;
  data: BlogPostView[];
  pagination: {
    page: number;
    size: number;
    pageCount: number;
    totalCount: number;
  }
}