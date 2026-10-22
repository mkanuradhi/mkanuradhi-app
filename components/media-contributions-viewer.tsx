"use client";
import React from 'react';
import { LocalizedSummaryMediaContribution } from '@/interfaces/i-media-contribution';
import FeaturedMediaContributionCard from './media-contribution-featured-card';
import MediaContributionCompactCard from './media-contribution-compact-card';
import './media-contributions-viewer.scss';

interface MediaContributionsViewerProps {
  lsMediaContributions: LocalizedSummaryMediaContribution[];
}

const MediaContributionsViewer: React.FC<MediaContributionsViewerProps> = ({lsMediaContributions}) => {

  const sortedMediaContributions = [...lsMediaContributions].sort(
    (a, b) => (a.displayOrder ?? Infinity) - (b.displayOrder ?? Infinity)
  );
  const featuredMediaContribution = sortedMediaContributions.find((item) => item.featured);
  const regularMediaContributions = sortedMediaContributions.filter((item) => item !== featuredMediaContribution);

  return (
    <div className="media-contributions-viewer">
      {featuredMediaContribution && (
        <section className="mcv-featured">
          <FeaturedMediaContributionCard lsMediaContribution={featuredMediaContribution} />
        </section>
      )}
      {regularMediaContributions.length > 0 && (
        <section>
          <ul className="mcv-rows">
            {regularMediaContributions.map((item) => (
              <li key={item.path}>
                <MediaContributionCompactCard lsMediaContribution={item} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

export default MediaContributionsViewer;