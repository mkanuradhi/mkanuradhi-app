import React from "react";
import { Link } from "@/i18n/routing";
import "./animated-link.scss";

interface AnimatedLinkProps {
  href: string;
  external?: boolean;
  showArrow?: boolean;
  underline?: boolean;
  newTab?: boolean;
  newTabLabel?: string;
  className?: string;
  children: React.ReactNode;
}

const AnimatedLink: React.FC<AnimatedLinkProps> = ({
  href,
  external = false,
  showArrow = true,
  underline = true,
  newTab,
  newTabLabel,
  className,
  children,
}) => {
  // External links open in a new tab by default; newTab overrides either way
  const opensInNewTab = newTab ?? external;

  const classes = ["animated-link", underline && "with-underline", className]
    .filter(Boolean)
    .join(" ");

  const linkProps = opensInNewTab
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};

  const content = (
    <>
      <span className="link-label">{children}</span>
      {showArrow && (
        <span className={`arrow-icon ${external ? "external" : "internal"}`} aria-hidden="true">
          <svg
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
          >
            {external ? (
              <>
                <path d="M7 17L17 7" />
                <path d="M7 7h10v10" />
              </>
            ) : (
              <>
                <path d="M5 12h14" />
                <path d="M13 6l6 6-6 6" />
              </>
            )}
          </svg>
        </span>
      )}
      {opensInNewTab && newTabLabel && (
        <span className="visually-hidden"> ({newTabLabel})</span>
      )}
    </>
  );

  // External URLs use a plain <a> so the locale-aware Link doesn't prefix them
  if (external) {
    return (
      <a href={href} className={classes} {...linkProps}>
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} {...linkProps}>
      {content}
    </Link>
  );
};

export default AnimatedLink;