"use client";

import dynamic from "next/dynamic";

const HeroScene = dynamic(() => import("@/components/three/HeroScene"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center">
      <div className="h-16 w-16 animate-pulse rounded-full bg-bg-deep/50" />
    </div>
  ),
});

export default function HeroSceneWrapper({ className }: { className?: string }) {
  return <HeroScene className={className} />;
}
