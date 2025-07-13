import { useEffect, useRef, useState } from 'react';

export const useContainerWidth = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new ResizeObserver(([entry]) => {
      setWidth(entry.contentRect.width);
    });

    observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  return { ref, width };
};