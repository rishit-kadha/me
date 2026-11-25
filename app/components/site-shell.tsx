'use client'

import { usePathname } from 'next/navigation'
import { Navbar } from './nav'
import Footer from './footer'

type SiteShellProps = {
  isDev: boolean
  children: React.ReactNode
}

export function SiteShell({ isDev, children }: SiteShellProps) {
  const pathname = usePathname()
  const isHome = pathname === '/'
  const isStudio = pathname === '/studio' || pathname?.startsWith('/studio/')

  const widthClass = isStudio
    ? 'max-w-[1440px]'
    : isHome
      ? 'max-w-4xl'
      : 'max-w-2xl'

  return (
    <div className={`min-h-screen w-full ${isHome ? 'hero-field' : ''}`}>
      <div
        className={`mx-auto flex min-h-screen w-full flex-col px-6 ${widthClass}`}
      >
        <Navbar isDev={isDev} />
        <main className={`flex-1 min-w-0 ${isHome ? 'pt-0' : 'pt-12'}`}>
          {children}
        </main>
        {!isStudio ? <Footer /> : null}
      </div>
    </div>
  )
}
