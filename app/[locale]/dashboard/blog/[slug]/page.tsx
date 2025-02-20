import React from 'react';
import BlogPostOptionsViewer from '@/components/blog-post-options-viewer';

interface BlogPostOptionsPageProps {
  params: {
    slug: string;
  };
}

const BlogPostOptionsPage: React.FC<BlogPostOptionsPageProps> = async ({ params }) => {
  const { slug } = params;

  return (
    <>
      <div className="blog">
        <BlogPostOptionsViewer blogPostId={slug} />
      </div>
    </>
  );
}

export default BlogPostOptionsPage;