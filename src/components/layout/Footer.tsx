import Link from 'next/link'

interface FooterLink {
  label: string
  href: string
}

interface FooterProps {
  brand?: string
  tagline?: string
  links?: FooterLink[]
}

const defaultLinks: FooterLink[] = [
  { label: 'Home', href: '/' },
  { label: '3D Showcase', href: '/showcase' },
  { label: 'Loyalty', href: '/loyalty' },
  { label: 'Games', href: '/games' },
  { label: 'Leaderboard', href: '/leaderboard' },
]

export default function Footer({
  brand = 'TLJ',
  tagline = 'Premium Franco-Asian Pâtisserie',
  links = defaultLinks,
}: FooterProps) {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-muted/50 bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-8 md:flex-row md:justify-between">
          {/* Brand */}
          <div className="text-center md:text-left">
            <h3 className="font-display text-2xl font-bold tracking-wide text-accent">{brand}</h3>
            <p className="mt-1 font-mono text-xs uppercase tracking-widest text-foreground/40">
              {tagline}
            </p>
          </div>

          {/* Links */}
          <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-foreground/50 transition-colors hover:text-accent"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 border-t border-muted/30 pt-6 text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/30">
            &copy; {year} {brand}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
