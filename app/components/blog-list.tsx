'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'

export type PostListItem = {
  slug: string
  title: string
  publishedAt: string
  formattedDate: string
  summary: string
  tags: string[]
  readingTimeMinutes: number
  draft?: boolean
}

type BlogListProps = {
  posts: PostListItem[]
  tags?: string[]
  showSummary?: boolean
  showTagFilter?: boolean
  isDev?: boolean
}

export function BlogList({
  posts,
  tags = [],
  showSummary = false,
  showTagFilter = false,
  isDev = false,
}: BlogListProps) {
  const [selectedTag, setSelectedTag] = useState<string | null>(null)

  const filteredPosts = useMemo(() => {
    if (!selectedTag) return posts
    return posts.filter((post) => post.tags.includes(selectedTag))
  }, [posts, selectedTag])

  if (posts.length === 0) {
    return (
      <div className="surface-panel rounded-[16px] p-5">
        <p className="text-sm text-[var(--text-secondary)]">
          No posts published yet
        </p>
        {isDev ? (
          <p className="mt-2 text-xs text-[var(--text-muted)]">
            Run{' '}
            <code className="font-mono text-[var(--text-primary)]">
              pnpm blog:new &quot;Post title&quot;
            </code>{' '}
            or open{' '}
            <Link
              href="/studio"
              className="text-[var(--text-primary)] underline decoration-[var(--hairline-strong)] underline-offset-2 hover:text-[var(--accent)] transition-colors duration-150"
            >
              Studio
            </Link>{' '}
            to write and publish a post.
          </p>
        ) : null}
      </div>
    )
  }

  return (
    <div>
      {showTagFilter && tags.length > 0 ? (
        <div
          className="mb-6 flex flex-wrap items-center gap-2"
          role="group"
          aria-label="Filter posts by tag"
        >
          <button
            type="button"
            onClick={() => setSelectedTag(null)}
            className={`h-8 rounded-[8px] px-3 text-xs transition-colors duration-150 ${
              selectedTag === null
                ? 'bg-[var(--surface-raised)] font-medium text-[var(--text-primary)] border border-[var(--hairline-strong)]'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] border border-transparent'
            }`}
          >
            All
          </button>
          {tags.map((tag) => {
            const active = selectedTag === tag
            return (
              <button
                key={tag}
                type="button"
                onClick={() => setSelectedTag(active ? null : tag)}
                className={`h-8 rounded-[8px] px-3 font-mono text-xs transition-colors duration-150 ${
                  active
                    ? 'bg-[var(--surface-raised)] font-medium text-[var(--text-primary)] border border-[var(--hairline-strong)]'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] border border-transparent'
                }`}
              >
                {tag}
              </button>
            )
          })}
        </div>
      ) : null}

      <div className="surface-panel divide-y divide-[var(--hairline)] overflow-hidden rounded-[16px]">
        {filteredPosts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group block p-5 hover:bg-[var(--surface-raised)]/50 transition-colors duration-150"
          >
            <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-6">
              <time
                dateTime={post.publishedAt}
                className="w-28 shrink-0 font-mono text-xs text-[var(--text-muted)] tabular-nums"
              >
                {post.formattedDate}
              </time>

              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-4">
                  <span className="text-[15px] font-normal text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors duration-150">
                    {post.title}
                  </span>
                  <span className="shrink-0 font-mono text-xs text-[var(--text-muted)] tabular-nums">
                    {post.readingTimeMinutes} min
                  </span>
                </div>

                {showSummary && post.summary ? (
                  <p className="mt-1.5 text-sm leading-5 text-[var(--text-secondary)]">
                    {post.summary}
                  </p>
                ) : null}

                {showSummary && post.tags.length > 0 ? (
                  <div className="mt-2 flex flex-wrap items-center gap-3">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="font-mono text-xs text-[var(--text-muted)]"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
