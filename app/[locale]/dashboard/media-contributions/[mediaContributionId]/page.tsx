import React from 'react';
import MediaContributionOptionsViewer from '@/components/media-contribution-options-viewer';

interface MediaContributionOptionsPageProps {
  params: {
    mediaContributionId: string;
  };
}

const MediaContributionOptionsPage: React.FC<MediaContributionOptionsPageProps> = ({ params }) => {
  const { mediaContributionId } = params;

  return (
    <>
      <MediaContributionOptionsViewer mediaContributionId={mediaContributionId} />
    </>
  );
}

export default MediaContributionOptionsPage;