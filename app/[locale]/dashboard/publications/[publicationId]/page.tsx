import React from 'react';
import PublicationOptionsViewer from '@/components/publication-options-viewer';

interface CourseOptionsPageProps {
  params: {
    publicationId: string;
  };
}

const CourseOptionsPage: React.FC<CourseOptionsPageProps> = ({ params }) => {
  const { publicationId } = params;

  return (
    <>
      <PublicationOptionsViewer publicationId={publicationId} />
    </>
  );
}

export default CourseOptionsPage;