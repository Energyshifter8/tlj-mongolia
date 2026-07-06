import type { NextConfig } from 'next'
import { resolve } from 'path'

const nextConfig: NextConfig = {
  turbopack: {
    root: resolve(__dirname, '..'),
  },
  async headers() {
    const isDev = process.env.NODE_ENV === 'development'
    if (isDev) return []

    return [
      {
        source: '/sw.js',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
          {
            key: 'Service-Worker-Allowed',
            value: '/',
          },
        ],
      },
    ]
  },
}

export default nextConfig
