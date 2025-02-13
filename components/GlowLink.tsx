import React from "react";
import { Link } from "@/i18n/routing";
import "./GlowLink.scss";

interface GlowLinkProps {
  href: string;
  withArrow?: boolean;
  newTab?: boolean;
  children: React.ReactNode;
}

const GlowLink: React.FC<GlowLinkProps> = ({ href, withArrow = false, newTab = false, children }) => {
  return (
    <>
      <Link
        href={href}
        target={newTab ? "_blank" : "_self"}
        rel={newTab ? "noopener noreferrer" : ""}
        className="glow-link"
      >
        {children}
        { withArrow && 
          <span className="arrow-icon">
            <svg
              fill="none"
              shapeRendering="geometricPrecision"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
            >
              <path d="M7 17L17 7"></path>
              <path d="M7 7h10v10"></path>
            </svg>
          </span>
        }
      </Link>
    </>
  )
}

export default GlowLink;