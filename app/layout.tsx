import './global.css'
import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { SiteShell } from './components/site-shell'
import { baseUrl } from './sitemap'
import { profile } from './lib/profile'

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: profile.name,
    template: `%s · ${profile.name}`,
  },
  description: `${profile.role} in ${profile.location}.`,
  openGraph: {
    title: profile.name,
    description: `${profile.role} in ${profile.location}.`,
    url: baseUrl,
    siteName: profile.name,
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: `${baseUrl}/og?title=${encodeURIComponent(profile.name)}`,
        width: 1200,
        height: 630,
        alt: profile.name,
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

const themeInitScript = `
(function() {
  try {
    var stored = localStorage.getItem('theme');
    var theme = (stored === 'light' || stored === 'dark') ? stored : 'dark';
    document.documentElement.setAttribute('data-theme', theme);
  } catch (e) {}
})();
`

const cx = (...classes: Array<string | undefined | false>) =>
  classes.filter(Boolean).join(' ')

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const isDev = process.env.NODE_ENV === 'development'

  return (
    <html
      lang="en"
      data-theme="dark"
      suppressHydrationWarning
      className={cx(GeistSans.variable, GeistMono.variable)}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="antialiased">
        <SiteShell isDev={isDev}>{children}</SiteShell>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
