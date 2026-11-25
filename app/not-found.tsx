import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <section className="py-12">
      <p className="font-mono text-xs text-[var(--text-muted)] tabular-nums mb-3">
        404
      </p>
      <h1 className="text-[28px] font-medium tracking-[-0.02em] text-[var(--text-primary)] mb-4">
        Page not found
      </h1>
      <p className="text-[15px] leading-6 text-[var(--text-secondary)] mb-8">
        The page you requested does not exist or may have moved.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm font-medium text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors duration-150"
      >
        <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
        Back home
      </Link>
    </section>
  )
}
