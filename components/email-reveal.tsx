"use client";
import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import "./email-reveal.scss";

const baseTPath = 'components.EmailReveal';
const ZWJ = "\u2060"; // word-joiner (zero-width, non-breaking)

interface EmailRevealProps {
  user?: string; // before @
  domain?: string; // after @
  asLink?: "copy" | "mailto" | false; // false = just text
};

const EmailReveal: React.FC<EmailRevealProps> = ({ user, domain, asLink = false }) => {
  const t = useTranslations(baseTPath);
  const [ready, setReady] = useState(false);

  // build only on client
  const display = useMemo(() => {
    if (!ready) return "";
    const addr = `${user}@${domain}`;
    const reversed = [...addr].reverse().join("");
    return reversed.split("").join(ZWJ);
  }, [ready, user, domain]);

  useEffect(() => { setReady(true); }, []);

  const act = async () => {
    if (!ready) return;
    const real = `${user}@${domain}`;
    if (asLink === "mailto") {
      window.location.href = `mailto:${real}`;
    } else if (asLink === "copy") {
      try { await navigator.clipboard.writeText(real); } catch {}
    }
  };

  return (
    <span
      suppressHydrationWarning
      className="contact-email-address"
      style={{ unicodeBidi: "bidi-override", direction: "rtl", cursor: asLink ? "pointer" as const : "default" }}
      onClick={asLink ? act : undefined}
      title={asLink === "mailto" ? t('mailto') : asLink === "copy" ? t('copy') : undefined}
    >
      {display || "\u2063" /* invisible placeholder to avoid layout shift */}
    </span>
  );
}

export default EmailReveal;