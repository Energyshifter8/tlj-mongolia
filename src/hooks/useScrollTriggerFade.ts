"use client";

import { useEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface UseScrollTriggerFadeOptions {
  start?: string;
  end?: string;
  scrub?: boolean | number;
  y?: number;
}

export function useScrollTriggerFade<T extends HTMLElement>(
  ref: RefObject<T | null>,
  {
    start = "top 80%",
    end = "top 20%",
    scrub = 0.5,
    y = 40,
  }: UseScrollTriggerFadeOptions = {},
) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    gsap.set(el, { opacity: 0, y });

    const st = ScrollTrigger.create({
      trigger: el,
      start,
      end,
      scrub,
      onUpdate: (self) => {
        gsap.set(el, {
          opacity: self.progress,
          y: y * (1 - self.progress),
        });
      },
    });

    return () => {
      st.kill();
    };
  }, [ref, start, end, scrub, y]);
}
