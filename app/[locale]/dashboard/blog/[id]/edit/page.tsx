import React from 'react';

interface EditBlogPostPageProps {
  params: {
    id: string;
  };
}

const EditBlogPostPage: React.FC<EditBlogPostPageProps> = ({ params }) => {
  const { id } = params;

  return (
    <>
      <h1>Edit Blog Post</h1>
      <p>Editing post: {id}</p>
    </>
  )
}

export default EditBlogPostPage;