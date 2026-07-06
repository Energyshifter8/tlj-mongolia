import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'TOUS les JOURS Mongolia',
    short_name: 'TLJ Mongolia',
    description: 'Premium Franco-Asian Patisserie — immersive digital experience',
    start_url: '/',
    display: 'standalone',
    orientation: 'portrait',
    theme_color: '#c9a24b',
    background_color: '#0a0908',
    categories: ['food', 'lifestyle'],
    icons: [
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  }
}
