'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { profile } from 'app/lib/profile'
import { ThemeToggle } from './theme-toggle'

type NavbarProps = {
  isDev: boolean
}

export function Navbar({ isDev }: NavbarProps) {
  const pathname = usePathname()

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/blog', label: 'Writing' },
    ...(isDev ? [{ href: '/studio', label: 'Studio' }] : []),
  ]

  function isActive(href: string) {
    if (href === '/') return pathname === '/'
    return pathname === href || pathname?.startsWith(`${href}/`)
  }

  return (
    <header className="border-b border-[var(--hairline)]">
      <div className="flex h-16 items-center justify-between gap-4">
        <Link
          href="/"
          className="text-base font-medium text-[var(--text-primary)] hover:text-[var(--text-secondary)] transition-colors duration-150"
        >
          {profile.name}
        </Link>

        <nav
          aria-label="Main navigation"
          className="flex h-full items-center gap-1"
        >
          {navItems.map((item) => {
            const active = isActive(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={`relative inline-flex h-full items-center px-3 text-sm transition-colors duration-150 ${
                  active
                    ? 'font-medium text-[var(--text-primary)]'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                {item.label}
                {active ? (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-3 bottom-0 h-[2px] bg-[var(--accent)]"
                  />
                ) : null}
              </Link>
            )
          })}
          <div className="ml-2 pl-2 border-l border-[var(--hairline)]">
            <ThemeToggle />
          </div>
        </nav>
      </div>
    </header>
  )
}
