import React from 'react';
import BlogPostOptionsViewer from '@/components/blog-post-options-viewer';

interface BlogPostOptionsPageProps {
  params: {
    id: string;
  };
}

const BlogPostOptionsPage: React.FC<BlogPostOptionsPageProps> = ({ params }) => {
  const { id } = params;

  return (
    <>
      <div className="blog">
        <BlogPostOptionsViewer blogPostId={id} />
      </div>
    </>
  );
}

export default BlogPostOptionsPage;