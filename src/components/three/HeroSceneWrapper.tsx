"use client";

import { useEffect, useState } from "react";
import HeroScene from "@/components/three/HeroScene";
import ThreeErrorBoundary from "@/components/three/ThreeErrorBoundary";

function checkWebGL(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    return !!(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

function HeroFallback({ className }: { className?: string }) {
  return (
    <div
      className={`flex items-center justify-center bg-gradient-to-br from-bg-deep via-bg-base to-bg-elevated ${className ?? ""}`}
    >
      <div className="text-center space-y-4 px-6">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-accent-gold/20 bg-accent-gold/5">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-10 w-10 text-accent-gold/60"
            stroke="currentColor"
            strokeWidth={1}
          >
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        </div>
        <p className="font-mono text-xs uppercase tracking-widest text-text-tertiary">
          TOUS les JOURS &middot; Mongolia
        </p>
      </div>
    </div>
  );
}

export default function HeroSceneWrapper({ className }: { className?: string }) {
  const [status, setStatus] = useState<"unavailable" | "ready">("unavailable");

  useEffect(() => {
    if (checkWebGL()) {
      setStatus("ready");
    }
  }, []);

  if (status === "unavailable") {
    return <HeroFallback className={className} />;
  }

  return (
    <ThreeErrorBoundary fallback={<HeroFallback className={className} />}>
      <HeroScene className={className} />
    </ThreeErrorBoundary>
  );
}
