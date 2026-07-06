import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono, Playfair_Display } from 'next/font/google'
import Footer from '@/components/layout/Footer'
import Navbar from '@/components/layout/Navbar'
import ServiceWorkerRegister from '@/components/layout/ServiceWorkerRegister'
import SmoothScrollProvider from '@/components/SmoothScrollProvider'
import { GamesScoreProvider } from '@/contexts/GamesScoreContext'
import './globals.css'

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  display: 'swap',
})

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
})

const jetbrains = JetBrains_Mono({
  variable: '--font-jetbrains',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'TOUS les JOURS Mongolia — Premium Franco-Asian Patisserie',
  description: 'An immersive digital experience for TLJ patisserie',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'TLJ Mongolia',
  },
}

export const viewport: Viewport = {
  themeColor: '#c9a24b',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.png" sizes="192x192" />
      </head>
      <body className="min-h-full flex flex-col bg-bg-deep text-text-primary">
        <GamesScoreProvider>
          <SmoothScrollProvider>
            <ServiceWorkerRegister />
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </SmoothScrollProvider>
        </GamesScoreProvider>
      </body>
    </html>
  )
}
