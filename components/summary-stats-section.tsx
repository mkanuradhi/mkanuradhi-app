"use client";
import { useLocale, useTranslations } from "next-intl";
import { animate, AnimatePresence, motion, useInView, useReducedMotion, Variants } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@/i18n/routing";
import { DisplayStatItem } from "@/interfaces/i-stat";
import "./summary-stats-section.scss";

const baseTPath = 'components.SummaryStatsSection';

const MotionLink = motion(Link);

const Counter = ({ value, showPlus, start }: { value: number; showPlus?: boolean; start: boolean }) => {
  const [display, setDisplay] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!start) return;
    const controls = animate(0, value, {
      duration: 1.4,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(Math.round(v)),
      onComplete: () => setDone(true),
    });
    return () => controls.stop();
  }, [start, value]);

  return (
    <h2 className="value">
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
  const shouldReduceMotion = useReducedMotion();
  const [triggered, setTriggered] = useState<Record<string, boolean>>({});

  const containerVariants: Variants = useMemo(() => ({
      hidden: {},
      visible: {
        transition: {
          staggerChildren: shouldReduceMotion ? 0 : 0.12,
        },
      },
    }), [shouldReduceMotion]);

  const itemVariants: Variants = useMemo(() => ({
      hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4 },
      },
    }), [shouldReduceMotion]);

  return (
    <section className="summary-stats-section">
      <motion.div
        className="grid"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
        variants={containerVariants}
      >
      {items.map((item, i) => (
        <MotionLink
          key={item.label}
          href={`/${item.href}`}
          className={`item`}
          data-locale={locale}
          aria-label={t(item.label)}
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          onViewportEnter={() =>
            setTriggered((prev) => ({ ...prev, [item.label]: true }))
          }
          viewport={{ once: true, amount: 0.6 }}
        >
          {isSinhala ? (
            <>
              <p className="label">{t(item.label)}</p>
              <Counter value={item.value} showPlus={item.showPlus} start={!!triggered[item.label]} />
            </>
          ) : (
            <>
              <Counter value={item.value} showPlus={item.showPlus} start={!!triggered[item.label]} />
              <p className="label">{t(item.label)}</p>
            </>
          )}
        </MotionLink>
      ))}
    </motion.div>
    </section>
  );
};

export default SummaryStatsSection;