"use client";
import { Fragment } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import "./page-trail.scss";

const baseTPath = 'components.PageTrail';

export type TrailItem = { label: string; href: string };

const linkClass = "link-secondary link-underline-opacity-0 link-underline-opacity-100-hover";

const BackArrow = () => (
  <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none"
       stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M13 8H3M7 4L3 8l4 4" />
  </svg>
);

const Separator = () => (
  <svg aria-hidden="true" width="12" height="12" viewBox="0 0 16 16" fill="none"
       stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
       className="text-body-tertiary">
    <path d="M6 3l5 5-5 5" />
  </svg>
);

interface PageTrailProps {
  /** Ancestors only, from the top level down to the immediate parent. */
  items: TrailItem[];
}

const PageTrail: React.FC<PageTrailProps> = ({ items }) => {
  const t = useTranslations(baseTPath);

  const parent = items.at(-1);
  if (!parent) return null;

  const showTrail = items.length >= 2;

  return (
    <>
      <Link
        href={parent.href}
        className={`page-trail-back align-self-start d-inline-flex align-items-center gap-2 small ${linkClass} ${showTrail ? "d-md-none" : ""}`}
      >
        <BackArrow />
        {parent.label}
      </Link>

      {showTrail && (
        <nav aria-label={t("trail")} className="d-none d-md-block">
          <ol className="list-unstyled d-flex flex-wrap align-items-center gap-2 mb-0 small">
            {items.map((item, i) => (
              <Fragment key={item.href}>
                {i > 0 && <li aria-hidden="true" className="d-flex"><Separator /></li>}
                <li><Link href={item.href} className={linkClass}>{item.label}</Link></li>
              </Fragment>
            ))}
          </ol>
        </nav>
      )}
    </>
  );
};

export default PageTrail;