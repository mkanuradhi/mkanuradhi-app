"use client";
import Image from "next/image";
import { LocalizedMediaContribution } from "@/interfaces/i-media-contribution";
import { useLocale, useTranslations } from "next-intl";
import { Button, Container, Stack } from "react-bootstrap";
import { MediaContributionType } from "@/enums/media-contribution-enums";
import SanitizedHtml from "./sanitized-html";
import PageTrail from "./page-trail";
import PreviewImagesGallery from "./preview-images-gallery";
import "./media-contribution-viewer.scss";

const baseTPath = 'components.MediaContributionViewer';

const BROADCAST_TYPES: MediaContributionType[] = ["podcast", "tv_interview", "radio"];
const ICON_SIZE = 32;

const formatDuration = (totalSeconds: number) => {
  const s = Math.max(0, Math.round(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const pad = (n: number) => String(n).padStart(2, '0');
  return h > 0 ? `${h}:${pad(m)}:${pad(sec)}` : `${m}:${pad(sec)}`;   // 42:15 or 1:05:30
};

const getInitials = (name: string) =>
    name.trim().split(/\s+/).slice(0, 2).map((w) => Array.from(w)[0]).join("").toUpperCase();

const MetaItem: React.FC<{ label: string, children: React.ReactNode }> = ({ label, children }) => {
  const isSinhala = useLocale() === "si";
  return (
    <div className={`d-flex gap-1 ${isSinhala ? "flex-column-reverse" : "flex-column"}`}>
      <dt className="small fw-normal text-body-secondary">{label}</dt>
      <dd
        className="mb-0 fw-medium d-flex align-items-center"
        style={{ minHeight: ICON_SIZE }}
      >
        {children}
      </dd>
    </div>
  );
}

type EntityProps = {
  name: string;
  href?: string;
  imageUrl?: string;
  variant: "logo" | "avatar";
};

const Entity: React.FC<EntityProps> = ({ name, href, imageUrl, variant }) => {
  const isAvatar = variant === "avatar";
  const content = (
    <span className="d-inline-flex align-items-center gap-2">
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt=""
          width={ICON_SIZE}
          height={ICON_SIZE}
          className={`object-fit-cover ${isAvatar ? "rounded-circle" : "rounded bg-white"}`}
        />
      ) : (
        isAvatar && (
          <span
            aria-hidden="true"
            style={{ width: ICON_SIZE, height: ICON_SIZE }}
            className="rounded-circle bg-body-secondary d-inline-flex align-items-center justify-content-center small fw-semibold"
          >
            {getInitials(name)}
          </span>
        )
      )}
      <span>{name}</span>
    </span>
  );

  return href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-reset text-decoration-none">
      {content}
    </a>
  ) : (
    content
  );
};

interface MediaContributionViewerProps {
  localizedMediaContribution: LocalizedMediaContribution;
}

const MediaContributionViewer: React.FC<MediaContributionViewerProps> = ({ localizedMediaContribution: lmc }) => {
  const t = useTranslations(baseTPath);
  const locale = useLocale();

  // Show the translated title only when the article's language differs from the site language
  const isTranslated = lmc.language !== locale;
  
  const isBroadcast = BROADCAST_TYPES.includes(lmc.type);
  const showDuration = isBroadcast && !!lmc.durationSeconds && lmc.durationSeconds > 0;

  // Byline: interviewers for broadcast types, authors for written ones, each falling back to the other
  const hasAuthors = !!lmc.authors?.length;
  const hasInterviewers = !!lmc.interviewers?.length;
  const useInterviewers = hasInterviewers && (isBroadcast || !hasAuthors);
  const byline = (useInterviewers ? lmc.interviewers : lmc.authors) ?? [];
  const bylineLabel = useInterviewers ? t("interviewedBy") : t("by");

  return (
    <>
      <Container as="article" fluid="md" className="media-contribution-viewer my-4">
        <Stack gap={4}>
          {/* breadcrumb */}
          <PageTrail items={[{ label: t("allMedia"), href: "/media-contributions" }]} />

          {/* type, title and subtitle */}
          <header>
            <p className="text-uppercase fw-semibold small text-primary-emphasis mb-2">
              {t(`types.${lmc.type}`)}
            </p>
            <h1 className="mb-2" lang={lmc.language}>{lmc.titleOriginal}</h1>
            {isTranslated && <p className="fs-5 fst-italic text-body-secondary mb-2">{lmc.title}</p>}
            {lmc.subtitleOriginal && <p className="lead mb-0" lang={lmc.language}>{lmc.subtitleOriginal}</p>}
          </header>

          {/* cover image */}
          {lmc.coverImage && (
            <figure className="m-0">
              <div className="ratio ratio-21x9 rounded overflow-hidden">
                <Image
                  src={lmc.coverImage}
                  alt={lmc.title}
                  fill
                  priority
                  sizes="(min-width: 1400px) 1320px, (min-width: 1200px) 1140px, (min-width: 992px) 960px, (min-width: 768px) 720px, 100vw"
                  className="object-fit-cover"
                />
              </div>
              <figcaption className="small text-body-secondary mt-2">{t("imageCaption")}</figcaption>
            </figure>
          )}

          {/* metadata */}
          <dl className="d-flex flex-wrap justify-content-between gap-4 py-3 my-0 border-top border-bottom">
            <MetaItem label={t("published")}>
              <time dateTime={new Date(lmc.publishedDate).toISOString()}>{lmc.publishedDateFormatted}</time>
            </MetaItem>

            {lmc.outlet && (
              <MetaItem label={t("publishedIn")}>
                <Entity variant="logo" name={lmc.outlet.name} href={lmc.outlet.webUrl} imageUrl={lmc.outlet.imageUrl} />
              </MetaItem>
            )}

            {showDuration && <MetaItem label={t("duration")}>{formatDuration(lmc.durationSeconds!)}</MetaItem>}

            {byline.length > 0 && (
              <MetaItem label={bylineLabel}>
                <div className="d-flex flex-wrap gap-2 gap-md-3">
                  {byline.map((p) => (
                    <Entity key={p.id} variant="avatar" name={p.name} href={p.profileUrl} imageUrl={p.imageUrl} />
                  ))}
                </div>
              </MetaItem>
            )}
          </dl>

          {/* content or description */}
          {(lmc.content || lmc.description) && (
            <section>
              <h2 className="h6 text-uppercase text-body-secondary mb-2">{t("myContribution")}</h2>
              {lmc.content ? (
                <div className="mc-content"><SanitizedHtml html={lmc.content} /></div>
              ) : (
                <p className="mb-0">{lmc.description}</p>
              )}
            </section>
          )}

          {/* source url button */}
          {lmc.sourceUrl && (
            <div className="d-grid d-md-block">
              <Button
                as="a"
                href={lmc.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                size="lg"
                className="d-inline-flex align-items-center justify-content-center gap-2"
              >
                {t(`cta.${lmc.type}`)}
                <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none"
                    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 11L11 5M6 5h5v5" />
                </svg>
              </Button>
            </div>
          )}

          {/* topics */}
          {lmc.topics.length > 0 && (
            <ul className="list-unstyled d-flex flex-wrap gap-2 mb-0" aria-label={t("topics")}>
              {lmc.topics.map((topic) => (
                <li key={topic}>
                  <span className="badge rounded-pill text-bg-secondary fw-medium">{topic}</span>
                </li>
              ))}
            </ul>
          )}

          {lmc.previewImages && (
            <PreviewImagesGallery previewImages={lmc.previewImages} />
          )}
        </Stack>
      </Container>
    </>
  );
}

export default MediaContributionViewer;
