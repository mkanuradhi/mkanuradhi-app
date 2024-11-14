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
          <span className="arrow-icon">&#x2197;</span>
        }
      </Link>
    </>
  )
}

export default GlowLink;