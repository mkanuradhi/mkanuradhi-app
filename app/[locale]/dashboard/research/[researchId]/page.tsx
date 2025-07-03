import React from 'react';
import ResearchOptionsViewer from '@/components/research-options-viewer';

interface ResearchOptionsPageProps {
  params: {
    researchId: string;
  };
}

const ResearchOptionsPage: React.FC<ResearchOptionsPageProps> = ({ params }) => {
  const { researchId } = params;

  return (
    <>
      <ResearchOptionsViewer researchId={researchId} />
    </>
  );
}

export default ResearchOptionsPage;