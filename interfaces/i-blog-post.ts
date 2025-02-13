
interface BlogPost {
  id: string;
  titleEn: string;
  summaryEn: string;
  contentEn: string;
  pageDescriptionEn: string;
  titleSi: string;
  summarySi: string;
  contentSi: string;
  pageDescriptionSi: string;
  primaryImage: string;
  images: string[];
  path: string;
  status: string;
  keywords: string[];
  dateTime: Date;
  published: boolean;
  deleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  v: number;
}

export default BlogPost;