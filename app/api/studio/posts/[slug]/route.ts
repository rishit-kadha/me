import fs from 'fs'
import path from 'path'
import { NextResponse } from 'next/server'
import {
  getBlogPostBySlug,
  getBlogPosts,
  isValidSlug,
  POSTS_DIR,
  serializePost,
  slugify,
  type PostMetadata,
} from 'app/blog/utils'

type RouteContext = {
  params: Promise<{ slug: string }>
}

function devOnlyGuard() {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  return null
}

function safePostPath(slug: string): string | null {
  if (!isValidSlug(slug)) return null
  const target = path.resolve(POSTS_DIR, `${slug}.mdx`)
  const base = path.resolve(POSTS_DIR)
  if (!target.startsWith(`${base}${path.sep}`)) return null
  return target
}

export async function PUT(request: Request, context: RouteContext) {
  const blocked = devOnlyGuard()
  if (blocked) return blocked

  try {
    const { slug: currentSlug } = await context.params
    const currentPath = safePostPath(currentSlug)
    if (!currentPath || !fs.existsSync(currentPath)) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    const body = await request.json()
    const title = String(body.title ?? '').trim()
    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      )
    }

    const nextSlug = body.slug ? slugify(String(body.slug)) : currentSlug
    const nextPath = safePostPath(nextSlug)
    if (!nextPath) {
      return NextResponse.json(
        { error: 'Slug must use lowercase letters, numbers, and hyphens' },
        { status: 400 }
      )
    }

    if (nextSlug !== currentSlug && fs.existsSync(nextPath)) {
      return NextResponse.json(
        { error: `A post with slug "${nextSlug}" already exists` },
        { status: 409 }
      )
    }

    const metadata: PostMetadata = {
      title,
      publishedAt:
        String(body.publishedAt ?? '').trim() ||
        new Date().toISOString().split('T')[0],
      updatedAt: body.updatedAt ? String(body.updatedAt).trim() : undefined,
      summary: String(body.summary ?? '').trim(),
      tags: Array.isArray(body.tags)
        ? body.tags.map((t: unknown) => String(t).trim()).filter(Boolean)
        : [],
      draft: Boolean(body.draft),
      image: body.image ? String(body.image).trim() : undefined,
    }

    const content = String(body.content ?? '')
    fs.writeFileSync(nextPath, serializePost(metadata, content), 'utf-8')
    if (nextSlug !== currentSlug) {
      fs.unlinkSync(currentPath)
    }

    const posts = getBlogPosts({ includeDrafts: true })
    const updated = posts.find((p) => p.slug === nextSlug)
    return NextResponse.json({ post: updated, posts })
  } catch {
    return NextResponse.json(
      { error: 'Failed to update post' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  const blocked = devOnlyGuard()
  if (blocked) return blocked

  try {
    const { slug } = await context.params
    const post = getBlogPostBySlug(slug, { includeDrafts: true })
    const filePath = safePostPath(slug)

    if (!post || !filePath) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    const body = await request.json()
    const nextDraft = Boolean(body.draft)

    const metadata: PostMetadata = {
      ...post.metadata,
      draft: nextDraft,
      publishedAt:
        !nextDraft && !post.metadata.publishedAt
          ? new Date().toISOString().split('T')[0]
          : post.metadata.publishedAt,
    }

    fs.writeFileSync(filePath, serializePost(metadata, post.content), 'utf-8')

    const posts = getBlogPosts({ includeDrafts: true })
    const updated = posts.find((p) => p.slug === slug)
    return NextResponse.json({ post: updated, posts })
  } catch {
    return NextResponse.json(
      { error: 'Failed to update post status' },
      { status: 500 }
    )
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const blocked = devOnlyGuard()
  if (blocked) return blocked

  try {
    const { slug } = await context.params
    const filePath = safePostPath(slug)
    if (!filePath || !fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    fs.unlinkSync(filePath)
    const posts = getBlogPosts({ includeDrafts: true })
    return NextResponse.json({ posts })
  } catch {
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    )
  }
}
