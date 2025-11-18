import React from 'react';
import AwardOptionsViewer from '@/components/award-options-viewer';

interface AwardOptionsPageProps {
  params: {
    awardId: string;
  };
}

const AwardOptionsPage: React.FC<AwardOptionsPageProps> = ({ params }) => {
  const { awardId } = params;

  return (
    <>
      <AwardOptionsViewer awardId={awardId} />
    </>
  );
}

export default AwardOptionsPage;