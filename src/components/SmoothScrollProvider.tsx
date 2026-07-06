"use client";

import { useLenis } from "@/lib/lenis";

export default function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useLenis();

  if (process.env.NODE_ENV === "development") {
    console.log("[SmoothScrollProvider] Lenis initialized");
  }

  return <>{children}</>;
}
