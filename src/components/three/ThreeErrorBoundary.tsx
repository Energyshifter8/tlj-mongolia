"use client";

import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ThreeErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.warn("[ThreeErrorBoundary] Three.js error caught:", error.message);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="flex h-full w-full items-center justify-center bg-bg-deep">
            <div className="text-center space-y-3">
              <div className="mx-auto h-16 w-16 rounded-full border border-border-subtle bg-bg-elevated" />
              <p className="font-mono text-xs uppercase tracking-widest text-text-tertiary">
                3D unavailable
              </p>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
