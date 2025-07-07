import React from 'react';
import PublicationOptionsViewer from '@/components/publication-options-viewer';

interface PublicationOptionsPageProps {
  params: {
    publicationId: string;
  };
}

const PublicationOptionsPage: React.FC<PublicationOptionsPageProps> = ({ params }) => {
  const { publicationId } = params;

  return (
    <>
      <PublicationOptionsViewer publicationId={publicationId} />
    </>
  );
}

export default PublicationOptionsPage;