'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  ArrowUpRight,
  Check,
  Eye,
  FileText,
  PenLine,
  Plus,
  Save,
  Trash2,
} from 'lucide-react'
import type { BlogPost } from 'app/blog/utils'

type Filter = 'all' | 'published' | 'drafts'

type DraftForm = {
  originalSlug: string | null
  title: string
  slug: string
  publishedAt: string
  summary: string
  tagsText: string
  draft: boolean
  content: string
}

function slugifyClient(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function todayIso(): string {
  return new Date().toISOString().split('T')[0]
}

function postToForm(post: BlogPost): DraftForm {
  return {
    originalSlug: post.slug,
    title: post.metadata.title,
    slug: post.slug,
    publishedAt: post.metadata.publishedAt,
    summary: post.metadata.summary,
    tagsText: post.metadata.tags.join(', '),
    draft: post.metadata.draft,
    content: post.content,
  }
}

function emptyForm(): DraftForm {
  return {
    originalSlug: null,
    title: '',
    slug: '',
    publishedAt: todayIso(),
    summary: '',
    tagsText: '',
    draft: true,
    content: '',
  }
}

function renderMarkdownPreview(source: string) {
  const lines = source.split(/\r?\n/)
  const elements: React.ReactNode[] = []
  let index = 0

  while (index < lines.length) {
    const line = lines[index]

    if (line.trim().startsWith('```')) {
      const codeLines: string[] = []
      index += 1
      while (index < lines.length && !lines[index].trim().startsWith('```')) {
        codeLines.push(lines[index])
        index += 1
      }
      elements.push(
        <pre key={`code-${index}`}>
          <code>{codeLines.join('\n')}</code>
        </pre>
      )
      index += 1
      continue
    }

    if (line.startsWith('### ')) {
      elements.push(<h3 key={`h3-${index}`}>{line.slice(4)}</h3>)
      index += 1
      continue
    }

    if (line.startsWith('## ')) {
      elements.push(<h2 key={`h2-${index}`}>{line.slice(3)}</h2>)
      index += 1
      continue
    }

    if (line.startsWith('# ')) {
      elements.push(<h1 key={`h1-${index}`}>{line.slice(2)}</h1>)
      index += 1
      continue
    }

    if (line.startsWith('> ')) {
      elements.push(
        <blockquote key={`bq-${index}`}>{line.slice(2)}</blockquote>
      )
      index += 1
      continue
    }

    if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
      const items: string[] = []
      while (
        index < lines.length &&
        (lines[index].trim().startsWith('- ') ||
          lines[index].trim().startsWith('* '))
      ) {
        items.push(lines[index].trim().slice(2))
        index += 1
      }
      elements.push(
        <ul key={`ul-${index}`}>
          {items.map((item, itemIdx) => (
            <li key={itemIdx}>{item}</li>
          ))}
        </ul>
      )
      continue
    }

    if (/^\d+\.\s/.test(line.trim())) {
      const items: string[] = []
      while (index < lines.length && /^\d+\.\s/.test(lines[index].trim())) {
        items.push(lines[index].trim().replace(/^\d+\.\s/, ''))
        index += 1
      }
      elements.push(
        <ol key={`ol-${index}`}>
          {items.map((item, itemIdx) => (
            <li key={itemIdx}>{item}</li>
          ))}
        </ol>
      )
      continue
    }

    if (line.trim() === '') {
      index += 1
      continue
    }

    elements.push(<p key={`p-${index}`}>{line}</p>)
    index += 1
  }

  return elements
}

export function StudioClient({ initialPosts }: { initialPosts: BlogPost[] }) {
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts)
  const [filter, setFilter] = useState<Filter>('all')
  const [mode, setMode] = useState<'write' | 'preview'>('write')
  const [slugTouched, setSlugTouched] = useState(false)
  const [saving, setSaving] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [statusMessage, setStatusMessage] = useState<{
    kind: 'neutral' | 'error'
    text: string
  } | null>(null)

  const [form, setForm] = useState<DraftForm>(() =>
    initialPosts.length > 0 ? postToForm(initialPosts[0]) : emptyForm()
  )

  const counts = useMemo(() => {
    const published = posts.filter((p) => !p.metadata.draft).length
    const drafts = posts.filter((p) => p.metadata.draft).length
    return { all: posts.length, published, drafts }
  }, [posts])

  const filteredPosts = useMemo(() => {
    if (filter === 'published') return posts.filter((p) => !p.metadata.draft)
    if (filter === 'drafts') return posts.filter((p) => p.metadata.draft)
    return posts
  }, [posts, filter])

  const wordCount = useMemo(() => {
    const words = form.content.trim().split(/\s+/).filter(Boolean)
    return words.length
  }, [form.content])

  const readingMinutes = Math.max(1, Math.ceil(wordCount / 220))

  function selectPost(post: BlogPost) {
    setForm(postToForm(post))
    setSlugTouched(true)
    setConfirmDelete(false)
    setStatusMessage(null)
  }

  function startNewPost() {
    setForm(emptyForm())
    setSlugTouched(false)
    setMode('write')
    setConfirmDelete(false)
    setStatusMessage(null)
  }

  const handleSave = useCallback(
    async (overrideDraft?: boolean) => {
      const title = form.title.trim()
      if (!title) {
        setStatusMessage({ kind: 'error', text: 'Title is required' })
        return
      }

      const nextDraft =
        typeof overrideDraft === 'boolean' ? overrideDraft : form.draft
      const slug = slugifyClient(form.slug || title)
      if (!slug) {
        setStatusMessage({
          kind: 'error',
          text: 'Provide a valid title or slug',
        })
        return
      }

      const tags = form.tagsText
        .split(',')
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean)

      setSaving(true)
      setStatusMessage(null)

      try {
        const isCreating = form.originalSlug === null
        const endpoint = isCreating
          ? '/api/studio/posts'
          : `/api/studio/posts/${encodeURIComponent(form.originalSlug!)}`

        const response = await fetch(endpoint, {
          method: isCreating ? 'POST' : 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title,
            slug,
            publishedAt: form.publishedAt || todayIso(),
            summary: form.summary,
            tags,
            draft: nextDraft,
            content: form.content,
          }),
        })

        const data = await response.json()
        if (!response.ok) {
          setStatusMessage({
            kind: 'error',
            text: data.error || 'Could not save post',
          })
          return
        }

        setPosts(data.posts)
        if (data.post) {
          setForm(postToForm(data.post))
          setSlugTouched(true)
        }
        setConfirmDelete(false)
        setStatusMessage({
          kind: 'neutral',
          text: nextDraft ? 'Saved as draft' : 'Published',
        })
      } catch {
        setStatusMessage({ kind: 'error', text: 'Network error while saving' })
      } finally {
        setSaving(false)
      }
    },
    [form]
  )

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 's') {
        event.preventDefault()
        void handleSave()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [handleSave])

  async function handleDelete() {
    if (!form.originalSlug) return
    if (!confirmDelete) {
      setConfirmDelete(true)
      return
    }

    setSaving(true)
    setStatusMessage(null)
    try {
      const response = await fetch(
        `/api/studio/posts/${encodeURIComponent(form.originalSlug)}`,
        { method: 'DELETE' }
      )
      const data = await response.json()
      if (!response.ok) {
        setStatusMessage({
          kind: 'error',
          text: data.error || 'Could not delete post',
        })
        return
      }

      const nextPosts: BlogPost[] = data.posts
      setPosts(nextPosts)
      setConfirmDelete(false)
      if (nextPosts.length > 0) {
        setForm(postToForm(nextPosts[0]))
        setSlugTouched(true)
      } else {
        startNewPost()
      }
      setStatusMessage({ kind: 'neutral', text: 'Post deleted' })
    } catch {
      setStatusMessage({ kind: 'error', text: 'Network error while deleting' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="pb-12">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-[var(--hairline)] pb-5">
        <div>
          <h1 className="text-[24px] leading-[1.2] font-medium tracking-[-0.02em] text-[var(--text-primary)]">
            Writing studio
          </h1>
          <p className="mt-1 text-xs text-[var(--text-muted)]">
            Local MDX manager for <code className="font-mono">app/blog/posts</code> · hidden in production builds
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {statusMessage ? (
            <span
              className={`mr-2 inline-flex items-center gap-1.5 text-xs ${
                statusMessage.kind === 'error'
                  ? 'text-[var(--negative)]'
                  : 'text-[var(--text-secondary)]'
              }`}
            >
              {statusMessage.kind === 'neutral' ? (
                <Check className="h-4 w-4 text-[var(--positive)]" strokeWidth={1.5} />
              ) : null}
              {statusMessage.text}
            </span>
          ) : null}

          {form.originalSlug ? (
            <a
              href={`/blog/${form.originalSlug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-8 items-center gap-1.5 rounded-[8px] border border-[var(--hairline-strong)] bg-[var(--surface)] px-3 text-xs font-medium text-[var(--text-primary)] hover:bg-[var(--surface-raised)] transition-colors duration-150"
            >
              <span>Open post</span>
              <ArrowUpRight className="h-4 w-4 text-[var(--text-muted)]" strokeWidth={1.5} />
            </a>
          ) : null}

          <button
            type="button"
            disabled={saving}
            onClick={() => handleSave()}
            className="inline-flex h-8 items-center gap-1.5 rounded-[8px] border border-[var(--hairline-strong)] bg-[var(--surface)] px-3 text-xs font-medium text-[var(--text-primary)] hover:bg-[var(--surface-raised)] disabled:opacity-50 active:scale-[0.98] transition-[color,background-color,transform] duration-150"
          >
            <Save className="h-4 w-4" strokeWidth={1.5} />
            <span>Save</span>
            <kbd className="ml-1 rounded-[4px] border border-[var(--hairline-strong)] px-1 py-0.5 font-mono text-[10px] text-[var(--text-muted)]">
              Ctrl+S
            </kbd>
          </button>

          <button
            type="button"
            disabled={saving}
            onClick={() => handleSave(!form.draft)}
            className="inline-flex h-8 items-center gap-1.5 rounded-[8px] bg-[var(--text-primary)] px-3.5 text-xs font-medium text-[var(--bg)] hover:opacity-90 disabled:opacity-50 active:scale-[0.98] transition-[opacity,transform] duration-150"
          >
            <span>{form.draft ? 'Publish' : 'Move to drafts'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[264px_minmax(0,1fr)]">
        <aside className="flex flex-col gap-4">
          <button
            type="button"
            onClick={startNewPost}
            className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-[8px] border border-[var(--hairline-strong)] bg-[var(--surface)] px-3 text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--surface-raised)] active:scale-[0.98] transition-[color,background-color,transform] duration-150"
          >
            <Plus className="h-4 w-4" strokeWidth={1.5} />
            <span>New post</span>
          </button>

          <div className="grid grid-cols-3 gap-1 rounded-[10px] border border-[var(--hairline)] bg-[var(--surface)] p-1">
            {(
              [
                { id: 'all', label: 'All', count: counts.all },
                { id: 'published', label: 'Live', count: counts.published },
                { id: 'drafts', label: 'Drafts', count: counts.drafts },
              ] as const
            ).map((tab) => {
              const active = filter === tab.id
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setFilter(tab.id)}
                  className={`flex h-7 items-center justify-center gap-1 rounded-[6px] text-xs transition-colors duration-150 ${
                    active
                      ? 'bg-[var(--surface-raised)] font-medium text-[var(--text-primary)]'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className="font-mono text-[11px] tabular-nums opacity-75">
                    {tab.count}
                  </span>
                </button>
              )
            })}
          </div>

          <div className="divide-y divide-[var(--hairline)] overflow-hidden rounded-[12px] border border-[var(--hairline)] bg-[var(--surface)]">
            {filteredPosts.length === 0 ? (
              <p className="px-4 py-6 text-xs text-[var(--text-muted)]">
                No posts in this view
              </p>
            ) : (
              filteredPosts.map((post) => {
                const selected = form.originalSlug === post.slug
                return (
                  <button
                    key={post.slug}
                    type="button"
                    onClick={() => selectPost(post)}
                    className={`flex w-full flex-col gap-1 px-4 py-3 text-left transition-colors duration-150 ${
                      selected
                        ? 'bg-[var(--surface-raised)]'
                        : 'hover:bg-[var(--surface-raised)]/60'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                          post.metadata.draft
                            ? 'bg-[var(--text-muted)]'
                            : 'bg-[var(--accent)]'
                        }`}
                      />
                      <span className="truncate text-sm font-medium text-[var(--text-primary)]">
                        {post.metadata.title}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2 pl-3.5 font-mono text-[11px] text-[var(--text-muted)] tabular-nums">
                      <span>{post.metadata.publishedAt}</span>
                      <span>{post.metadata.draft ? 'Draft' : 'Published'}</span>
                    </div>
                  </button>
                )
              })
            )}
          </div>
        </aside>

        <section className="flex flex-col gap-4 rounded-[14px] border border-[var(--hairline)] bg-[var(--surface)] p-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5 sm:col-span-2">
              <span className="text-xs font-medium text-[var(--text-muted)]">
                Title
              </span>
              <input
                type="text"
                value={form.title}
                onChange={(e) => {
                  const nextTitle = e.target.value
                  setForm((prev) => ({
                    ...prev,
                    title: nextTitle,
                    slug: slugTouched ? prev.slug : slugifyClient(nextTitle),
                  }))
                }}
                placeholder="Post title"
                className="h-9 rounded-[8px] border border-[var(--hairline-strong)] bg-[var(--bg)] px-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-[var(--text-muted)]">
                Slug
              </span>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => {
                  setSlugTouched(true)
                  setForm((prev) => ({ ...prev, slug: e.target.value }))
                }}
                placeholder="post-slug"
                className="h-9 rounded-[8px] border border-[var(--hairline-strong)] bg-[var(--bg)] px-3 font-mono text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-[var(--text-muted)]">
                Publish date
              </span>
              <input
                type="date"
                value={form.publishedAt}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, publishedAt: e.target.value }))
                }
                className="h-9 rounded-[8px] border border-[var(--hairline-strong)] bg-[var(--bg)] px-3 font-mono text-xs text-[var(--text-primary)] tabular-nums"
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-[var(--text-muted)]">
                Tags (comma separated)
              </span>
              <input
                type="text"
                value={form.tagsText}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, tagsText: e.target.value }))
                }
                placeholder="engineering, ai, notes"
                className="h-9 rounded-[8px] border border-[var(--hairline-strong)] bg-[var(--bg)] px-3 font-mono text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-[var(--text-muted)]">
                Summary
              </span>
              <input
                type="text"
                value={form.summary}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, summary: e.target.value }))
                }
                placeholder="One sentence summary for index and RSS"
                className="h-9 rounded-[8px] border border-[var(--hairline-strong)] bg-[var(--bg)] px-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
              />
            </label>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--hairline)] pt-4">
            <div className="inline-flex items-center gap-1 rounded-[8px] border border-[var(--hairline)] bg-[var(--bg)] p-0.5">
              <button
                type="button"
                onClick={() => setMode('write')}
                className={`inline-flex h-7 items-center gap-1.5 rounded-[6px] px-2.5 text-xs transition-colors duration-150 ${
                  mode === 'write'
                    ? 'bg-[var(--surface-raised)] font-medium text-[var(--text-primary)]'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                <PenLine className="h-4 w-4" strokeWidth={1.5} />
                <span>Write</span>
              </button>
              <button
                type="button"
                onClick={() => setMode('preview')}
                className={`inline-flex h-7 items-center gap-1.5 rounded-[6px] px-2.5 text-xs transition-colors duration-150 ${
                  mode === 'preview'
                    ? 'bg-[var(--surface-raised)] font-medium text-[var(--text-primary)]'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                <Eye className="h-4 w-4" strokeWidth={1.5} />
                <span>Preview</span>
              </button>
            </div>

            <div className="flex items-center gap-4">
              <span className="font-mono text-xs text-[var(--text-muted)] tabular-nums">
                {wordCount} words · {readingMinutes} min read
              </span>

              {form.originalSlug ? (
                <button
                  type="button"
                  disabled={saving}
                  onClick={handleDelete}
                  className={`inline-flex h-7 items-center gap-1.5 rounded-[6px] px-2.5 text-xs transition-colors duration-150 ${
                    confirmDelete
                      ? 'bg-[var(--negative)] font-medium text-white'
                      : 'text-[var(--text-muted)] hover:text-[var(--negative)]'
                  }`}
                >
                  <Trash2 className="h-4 w-4" strokeWidth={1.5} />
                  <span>{confirmDelete ? 'Confirm delete' : 'Delete'}</span>
                </button>
              ) : null}
            </div>
          </div>

          {mode === 'write' ? (
            <textarea
              value={form.content}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, content: e.target.value }))
              }
              placeholder="Write your post in Markdown or MDX"
              rows={20}
              className="min-h-[420px] w-full resize-y rounded-[10px] border border-[var(--hairline-strong)] bg-[var(--bg)] p-4 font-mono text-[13px] leading-6 text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
            />
          ) : (
            <div className="min-h-[420px] rounded-[10px] border border-[var(--hairline)] bg-[var(--bg)] p-6">
              {form.content.trim() ? (
                <article className="prose max-w-none">
                  {renderMarkdownPreview(form.content)}
                </article>
              ) : (
                <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                  <FileText className="h-4 w-4" strokeWidth={1.5} />
                  <span>Nothing to preview yet</span>
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
