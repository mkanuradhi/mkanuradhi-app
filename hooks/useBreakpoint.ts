"use client";
import { useEffect, useState } from "react";

// Keep in sync with Bootstrap's default breakpoints
const BREAKPOINTS = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
} as const;

export type Breakpoint = keyof typeof BREAKPOINTS;

const ORDER: Breakpoint[] = ["sm", "md", "lg", "xl"];

function getBreakpoint(width: number): Breakpoint {
  if (width >= BREAKPOINTS.xl) return "xl";
  if (width >= BREAKPOINTS.lg) return "lg";
  if (width >= BREAKPOINTS.md) return "md";
  if (width >= BREAKPOINTS.sm) return "sm";
  return "xs";
}

/**
 * Returns the current Bootstrap-style breakpoint.
 * Defaults to "xl" until mounted, to avoid SSR/hydration mismatches
 */
export function useBreakpoint(): Breakpoint {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>("xl");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    const mqls = ORDER.map((bp) => window.matchMedia(`(min-width: ${BREAKPOINTS[bp]}px)`));
    const update = () => setBreakpoint(getBreakpoint(window.innerWidth));

    update();

    mqls.forEach((mql) => mql.addEventListener("change", update));
    return () => mqls.forEach((mql) => mql.removeEventListener("change", update));
  }, []);

  return isMounted ? breakpoint : "xl";
}

export function isAtLeast(current: Breakpoint, target: Breakpoint): boolean {
  return ORDER.indexOf(current) >= ORDER.indexOf(target);
}

export { ORDER as BREAKPOINT_ORDER };