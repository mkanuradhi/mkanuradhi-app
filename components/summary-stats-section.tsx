"use client";
import { useLocale, useTranslations } from "next-intl";
import { animate, AnimatePresence, motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Link } from "@/i18n/routing";
import "./summary-stats-section.scss";
import { DisplayStatItem } from "@/interfaces/i-stat";

const baseTPath = 'components.SummaryStatsSection';

const MotionLink = motion(Link);

const Counter = ({ value, showPlus }: { value: number; showPlus?: boolean }) => {
  const ref = useRef<HTMLHeadingElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });
  const [display, setDisplay] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!isInView) return;
    const controls = animate(0, value, {
      duration: 1.4,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(Math.round(v)),
      onComplete: () => setDone(true),
    });
    return () => controls.stop();
  }, [isInView, value]);

  return (
    <h2 className="value" ref={ref}>
      {display}
      <AnimatePresence>
        {showPlus && done && (
          <motion.span
            className="plus"
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            +
          </motion.span>
        )}
      </AnimatePresence>
    </h2>
  );
};

interface SummaryStatsSectionProps {
  items: DisplayStatItem[];
}

const SummaryStatsSection = ({ items }: SummaryStatsSectionProps) => {
  const t = useTranslations(baseTPath);
  const locale = useLocale();
  const isSinhala = locale === "si";

  return (
    <section className="summary-stats-section">
      <div className="grid">
      {items.map((item, i) => (
        <MotionLink
          key={item.label}
          href={`/${item.href}`}
          className={`item`}
          data-locale={locale}
          aria-label={t(item.label)}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: i * 0.12 }}
          whileHover={{ scale: 1.02 }}
        >
          {isSinhala ? (
            <>
              <p className="label">{t(item.label)}</p>
              <Counter value={item.value} showPlus={item.showPlus} />
            </>
          ) : (
            <>
              <Counter value={item.value} showPlus={item.showPlus} />
              <p className="label">{t(item.label)}</p>
            </>
          )}
        </MotionLink>
      ))}
    </div>
    </section>
  );
};

export default SummaryStatsSection;