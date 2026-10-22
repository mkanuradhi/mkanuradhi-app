"use client";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { LocalizedSummaryMediaContribution } from "@/interfaces/i-media-contribution";
import './media-contribution-compact-card.scss';

interface MediaContributionCompactCardProps {
  lsMediaContribution: LocalizedSummaryMediaContribution;
}

const MediaContributionCompactCard: React.FC<MediaContributionCompactCardProps> = ({lsMediaContribution}) => {

  return (
    <Link href={`/media-contributions/${lsMediaContribution.path}`} className="media-contribution-compact-card">
      <div className="mcc-thumb">
        {lsMediaContribution.coverImage ? (
          <Image
            src={lsMediaContribution.coverImage}
            alt=""
            fill
            sizes="(max-width: 575.98px) 100vw, 120px"
            className="mcc-thumb-img"
          />
        ) : (
          <span className="mcc-thumb-fallback">{lsMediaContribution.outlet?.name}</span>
        )}
      </div>

      <div className="mcc-body">
        <span className="mcc-meta">{lsMediaContribution.outlet?.name} · {lsMediaContribution.publishedDateFormatted}</span>
        <h3 className="mcc-title">{lsMediaContribution.titleOriginal}</h3>
        <p className="mcc-description">{lsMediaContribution.description}</p>
      </div>

      <span className="mcc-arrow" aria-hidden="true">→</span>
    </Link>
  );
}

export default MediaContributionCompactCard;
