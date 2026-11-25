import Link from 'next/link'
import { PenLine } from 'lucide-react'
import { BlogPosts } from 'app/components/posts'
import { getBlogPosts } from 'app/blog/utils'
import { profile } from 'app/lib/profile'

export const metadata = {
  title: 'Writing',
  description: `Notes and articles by ${profile.name} on software engineering and AI/ML.`,
}

export default function Page() {
  const isDev = process.env.NODE_ENV === 'development'
  const publishedCount = getBlogPosts({ includeDrafts: false }).length
  const draftCount = isDev
    ? getBlogPosts({ includeDrafts: true }).filter((p) => p.metadata.draft)
        .length
    : 0

  return (
    <section className="enter">
      <div className="mb-8 flex flex-wrap items-baseline justify-between gap-4">
        <div>
          <h1 className="text-[32px] leading-[1.12] font-medium tracking-[-0.025em] text-[var(--text-primary)]">
            Writing
          </h1>
          <p className="mt-2 font-mono text-xs text-[var(--text-muted)] tabular-nums">
            {publishedCount} {publishedCount === 1 ? 'post' : 'posts'}
            {isDev && draftCount > 0
              ? ` · ${draftCount} ${draftCount === 1 ? 'draft' : 'drafts'} in local studio`
              : ''}
          </p>
        </div>

        {isDev ? (
          <Link
            href="/studio"
            className="inline-flex h-9 items-center gap-2 rounded-[8px] border border-[var(--hairline-strong)] bg-[var(--surface-raised)] px-3 text-xs font-medium text-[var(--text-primary)] hover:border-[var(--accent-hairline)] transition-colors duration-150"
          >
            <PenLine className="h-4 w-4 text-[var(--text-muted)]" strokeWidth={1.5} />
            <span>Manage in Studio</span>
          </Link>
        ) : null}
      </div>

      <BlogPosts showSummary showTagFilter />
    </section>
  )
}
