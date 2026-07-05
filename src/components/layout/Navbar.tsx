'use client'

import Link from 'next/link'
import { useState } from 'react'

interface NavLink {
  label: string
  href: string
}

interface NavbarProps {
  logo?: string
  links?: NavLink[]
}

const defaultLinks: NavLink[] = [
  { label: 'Home', href: '/' },
  { label: '3D Showcase', href: '/showcase' },
  { label: 'Loyalty', href: '/loyalty' },
  { label: 'Games', href: '/games' },
  { label: 'Leaderboard', href: '/leaderboard' },
]

export default function Navbar({ logo = 'TLJ', links = defaultLinks }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 border-b border-muted/50 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="font-display text-xl font-bold tracking-wide text-accent">
          {logo}
        </Link>

        {/* Desktop nav */}
        <ul className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="rounded-md px-3 py-2 text-sm font-medium text-foreground/70 transition-colors hover:bg-muted/50 hover:text-accent"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md p-2 text-foreground/70 hover:text-accent md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-muted/50 bg-surface md:hidden">
          <ul className="flex flex-col gap-1 px-4 py-3">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-md px-3 py-2 text-sm font-medium text-foreground/70 transition-colors hover:bg-muted/50 hover:text-accent"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  )
}
