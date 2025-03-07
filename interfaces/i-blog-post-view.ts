
interface BlogPostView {
  id: string;
  title: string;
  summary: string;
  content: string;
  pageDescription: string;
  primaryImage: string;
  images: string[];
  path: string;
  status: string;
  keywords: string[];
  dateTime: Date;
  formattedDate: string;
  formattedTime: string;
  deleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  v: number;
}

export default BlogPostView;