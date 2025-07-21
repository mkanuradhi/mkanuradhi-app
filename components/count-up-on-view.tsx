'use client';
import { useRef, useState, useEffect } from 'react';
import { useInView } from 'framer-motion';
import dynamic from 'next/dynamic';
import "./count-up-on-view.scss";

const CountUp = dynamic(() => import('react-countup').then(m => m.default), {
  ssr: false,
});

interface CountUpOnViewProps {
  start?: number;
  end: number;
  duration?: number;
  separator?: string;
  reserveSpace?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const CountUpOnView: React.FC<CountUpOnViewProps> = ({
  start = 1,
  end,
  duration = 2,
  separator = '',
  reserveSpace = false,
  className = "",
  style,
}) => {
  const spanRef = useRef<HTMLSpanElement>(null);

  /* Ask Framer Motion to observe that ref.
    `once`  -> run only the first time it enters
    `amount` -> 0.2 ≈ 20 % of the element must be visible  */
  const isInView = useInView(spanRef, { once: true, amount: 0.9 });

  // Flip a flag so the animation never restarts
  const [shouldStart, setShouldStart] = useState(false);

  useEffect(() => {
    if (isInView) setShouldStart(true);
  }, [isInView]);

  const widthStyle = reserveSpace
    ? { minWidth: `${String(end).length}ch` }
    : undefined;

  return (
    <span
      ref={spanRef}
      className={`tabular-digits ${className}`}
      style={{ ...widthStyle, ...style }}>
      {shouldStart ? (
        <CountUp
          start={start}
          end={end}
          duration={duration}
          separator={separator}
        />
      ) : (
        start /* placeholder before it scrolls into view */
      )}
    </span>
  );
}

export default CountUpOnView;