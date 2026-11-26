"use client";
import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import "./copy-button.scss";

const baseTPath = 'components.CopyButton';

interface CopyButtonProps {
  text: string;
  className?: string;
}

const CopyButton: React.FC<CopyButtonProps> = ({ text, className = "" }) => {
  const t = useTranslations(baseTPath);
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`copy-button btn btn-sm d-flex align-items-center ${className}`}
      title={copied ? t("copied") : t("copy")}
      aria-label={copied ? t("copied") : t("copyToClipboard")}
    >
      {copied ? <i className="bi bi-check2 text-success"></i> : <i className="bi bi-copy"></i>}
    </button>
  );
}

export default CopyButton;