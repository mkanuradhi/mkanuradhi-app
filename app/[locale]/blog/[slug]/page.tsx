import React from 'react';
import { getBlogPostByPath } from '@/services/blog-post-service';
import BlogPostViewer from '@/components/BlogPostViewer';

interface BlogPostPageProps {
  params: {
    locale: string;
    slug: string;
  };
}

export async function generateMetadata ({ params }: BlogPostPageProps) {
  const { locale, slug } = params;
  const blogPostView = await getBlogPostByPath(locale, slug);

  return {
    title: blogPostView.title,
    description: blogPostView.pageDescription,
    keywords: blogPostView.keywords,
    generator: 'React',
    applicationName: 'mkanuradhi',
    referrer: 'origin-when-cross-origin',
    creator: 'Anuradha',
    publisher: 'M K A Ariyaratne',
    openGraph: {
      title: blogPostView.title,
      description: blogPostView.pageDescription,
      siteName: 'mkanuradhi',
      images: blogPostView.primaryImage ? [{ url: blogPostView.primaryImage }] : [],
      type: 'website',
    }
  };
};

const BlogPostPage: React.FC<BlogPostPageProps> = async ({ params }) => {
  const { locale, slug } = params;
  const blogPostView = await getBlogPostByPath(locale, slug);

  return (
    <>
      <div className="blog">
        <BlogPostViewer blogPostView={blogPostView} />
      </div>
    </>
  );
}

export default BlogPostPage;