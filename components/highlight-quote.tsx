import type { ReactNode } from "react";
import "./highlight-quote.scss";

export type HighlightQuoteVariant = "bar" | "card" | "editorial" | "marker";

type HighlightQuoteProps = {
  children: ReactNode;
  variant?: HighlightQuoteVariant;
  /** Optional source URL, added to the blockquote's cite attribute (not displayed) */
  cite?: string;
  className?: string;
};

export default function HighlightQuote({
  children,
  variant = "bar",
  cite,
  className = "",
}: HighlightQuoteProps) {
  return (
    <blockquote
      cite={cite}
      className={`highlight-quote highlight-quote--${variant} ${className}`.trim()}
    >
      <p className="highlight-quote__text">{children}</p>
    </blockquote>
  );
}