import React from 'react';
import { getBlogPostByPath } from '@/services/blog-post-service';
import BlogPostViewer from '@/components/BlogPostViewer';
import { ApiError } from '@/errors/api-error';
import { notFound } from 'next/navigation';
import { LANG_EN, LANG_SI } from '@/constants/common-vars';

interface BlogPostPageProps {
  params: {
    locale: string;
    slug: string;
  };
}

export async function generateMetadata ({ params }: BlogPostPageProps) {
  const { locale, slug } = params;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
  let blogPostView;
  try {
    blogPostView = await getBlogPostByPath(locale, slug);
  } catch (error: any) {
    if (error instanceof ApiError && (error.status === 404 || error.status === 400)) {
      notFound();
    }
    throw error;
  }

  return {
    title: blogPostView.title,
    description: blogPostView.pageDescription,
    keywords: blogPostView.keywords,
    creator: 'Anuradha',
    publisher: 'M K A Ariyaratne',
    alternates: {
      canonical: `${baseUrl}/${locale}/blog/${slug}`,
      languages: {
        'en': `${baseUrl}/${LANG_EN}/blog/${slug}`,
        'si': `${baseUrl}/${LANG_SI}/blog/${slug}`
      }
    },
    openGraph: {
      title: blogPostView.title,
      description: blogPostView.pageDescription,
      siteName: 'mkanuradhi',
      locale: locale === LANG_EN ? 'en_US' : 'si_LK',
      alternateLocale: locale === LANG_EN ? 'si_LK' : 'en_US',
      url: `${baseUrl}/${locale}/blog/${slug}`,
      images: blogPostView.primaryImage ? [
        {
          url: blogPostView.primaryImage,
          alt: blogPostView.title
        }
      ] : undefined,
      type: 'article',
    }
  };
};

const BlogPostPage: React.FC<BlogPostPageProps> = async ({ params }) => {
  const { locale, slug } = params;
  let blogPostView;
  try {
    blogPostView = await getBlogPostByPath(locale, slug);
  } catch (error: any) {
    if (error instanceof ApiError && (error.status === 404 || error.status === 400)) {
      notFound();
    }
    throw error;
  }

  return (
    <>
      <div className="blog">
        <BlogPostViewer blogPostView={blogPostView} />
      </div>
    </>
  );
}

export default BlogPostPage;