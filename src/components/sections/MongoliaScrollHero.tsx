"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const PANELS = [
  {
    id: "steppe",
    title: "The Endless Steppe",
    subtitle: "Where the earth meets the sky in an ocean of grass",
    gradient: "from-amber-950/40 via-yellow-900/20 to-black",
  },
  {
    id: "mountains",
    title: "Eternal Mountains",
    subtitle: "Ancient peaks carved by wind and time",
    gradient: "from-slate-800/40 via-gray-700/20 to-black",
  },
  {
    id: "sky",
    title: "The Eternal Blue Sky",
    subtitle: "Tenger — the dome above all living things",
    gradient: "from-blue-950/40 via-indigo-900/20 to-black",
  },
  {
    id: "horizon",
    title: "The Horizon",
    subtitle: "Where all journeys converge into stillness",
    gradient: "from-gray-900/40 via-neutral-800/20 to-black",
  },
];

export default function MongoliaScrollHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<HTMLDivElement[]>([]);
  const counterRef = useRef<HTMLDivElement>(null);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);

  const setPanelRef = (index: number) => (el: HTMLDivElement | null) => {
    if (el) panelRefs.current[index] = el;
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const mm = window.matchMedia("(min-width: 768px)");
    const isMobile = !mm.matches;

    const panels = panelRefs.current.filter(Boolean);
    if (panels.length === 0) return;

    const totalPanels = panels.length;
    const endValue = isMobile ? `+=${(totalPanels - 1) * 50}%` : `+=${(totalPanels - 1) * 100}%`;

    gsap.set(panels, { opacity: 0, y: 40 });
    gsap.set(panels[0], { opacity: 1, y: 0 });

    const st = ScrollTrigger.create({
      trigger: container,
      pin: false,
      scrub: true,
      start: "top top",
      end: endValue,
      onUpdate: (self) => {
        if (counterRef.current) {
          counterRef.current.textContent = `${Math.round(self.progress * 100)}%`;
        }
      },
    });
    scrollTriggerRef.current = st;

    const scrollTween = gsap.to(panels, {
      opacity: 1,
      y: 0,
      duration: 1,
      stagger: 1,
      ease: "none",
      scrollTrigger: {
        trigger: container,
        scrub: true,
        start: "top top",
        end: endValue,
      },
    });

    return () => {
      st.kill();
      scrollTween.scrollTrigger?.kill();
      scrollTween.kill();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="sticky top-0 min-h-screen bg-black overflow-hidden"
    >
      <div
        ref={counterRef}
        className="absolute top-6 right-6 md:top-8 md:right-10 z-50 font-mono text-4xl md:text-6xl font-light text-white/60 tabular-nums select-none pointer-events-none"
      >
        0%
      </div>

      <div className="relative w-full h-screen">
        {PANELS.map((panel, i) => (
          <div
            key={panel.id}
            ref={setPanelRef(i)}
            className={`absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b ${panel.gradient} border-b border-white/5`}
          >
            <span className="block text-xs md:text-sm font-mono uppercase tracking-[0.3em] text-white/30 mb-4 md:mb-6">
              0{i + 1}
            </span>
            <h2 className="text-3xl md:text-6xl lg:text-7xl font-light text-white tracking-tight text-center px-6">
              {panel.title}
            </h2>
            <p className="mt-4 md:mt-6 text-sm md:text-base text-white/40 font-mono max-w-md text-center px-6">
              {panel.subtitle}
            </p>
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-px h-12 bg-gradient-to-b from-white/20 to-transparent" />
          </div>
        ))}
      </div>
    </div>
  );
}
