import { ArrowUpRight } from 'lucide-react'
import { profile } from 'app/lib/profile'

const footerLinks = [
  { label: 'LinkedIn', href: profile.links.linkedin, external: true },
  { label: 'GitHub', href: profile.links.github, external: true },
  { label: 'Email', href: `mailto:${profile.links.email}`, external: false },
  { label: 'RSS', href: '/rss', external: false },
]

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-[var(--hairline)] py-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
          {footerLinks.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                target={link.external ? '_blank' : undefined}
                rel={link.external ? 'noopener noreferrer' : undefined}
                className="inline-flex items-center gap-1.5 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors duration-150"
              >
                <span>{link.label}</span>
                <ArrowUpRight className="h-4 w-4" strokeWidth={1.5} />
              </a>
            </li>
          ))}
        </ul>

        <p className="font-mono text-xs text-[var(--text-muted)] tabular-nums">
          © {new Date().getFullYear()} {profile.name}
        </p>
      </div>
    </footer>
  )
}
