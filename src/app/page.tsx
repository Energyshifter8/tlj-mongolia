import ClientShowcase from '@/components/three/ClientShowcase'

export default function Home() {
  return (
    <div className="flex flex-col items-center px-4 py-24">
      <h1 className="text-center font-display text-4xl font-bold tracking-wide text-accent sm:text-5xl lg:text-6xl">
        TLJ
      </h1>
      <p className="mt-2 text-center font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/40">
        Pâtisserie · Est. 2024
      </p>
      <p className="mt-6 max-w-lg text-center text-lg leading-relaxed text-foreground/70">
        A premium Franco-Asian pâtisserie experience — crafted with precision,
        presented in 3D.
      </p>
      <div className="mt-10 flex flex-col gap-4 sm:flex-row">
        <a
          href="/showcase"
          className="rounded-md bg-accent px-6 py-3 font-mono text-xs font-semibold uppercase tracking-widest text-background transition-colors hover:bg-accent/80"
        >
          Explore 3D Showcase
        </a>
        <a
          href="/loyalty"
          className="rounded-md border border-muted px-6 py-3 font-mono text-xs font-semibold uppercase tracking-widest text-foreground/60 transition-colors hover:border-accent hover:text-accent"
        >
          Join Loyalty
        </a>
      </div>
      <ClientShowcase />
    </div>
  )
}
