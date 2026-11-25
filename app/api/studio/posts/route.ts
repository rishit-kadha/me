import fs from 'fs'
import path from 'path'
import { NextResponse } from 'next/server'
import {
  getBlogPosts,
  isValidSlug,
  POSTS_DIR,
  serializePost,
  slugify,
  type PostMetadata,
} from 'app/blog/utils'

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

export async function GET() {
  const blocked = devOnlyGuard()
  if (blocked) return blocked

  const posts = getBlogPosts({ includeDrafts: true })
  return NextResponse.json({ posts })
}

export async function POST(request: Request) {
  const blocked = devOnlyGuard()
  if (blocked) return blocked

  try {
    const body = await request.json()
    const title = String(body.title ?? '').trim()
    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      )
    }

    const rawSlug = body.slug ? String(body.slug) : slugify(title)
    const slug = slugify(rawSlug)
    const filePath = safePostPath(slug)

    if (!filePath) {
      return NextResponse.json(
        { error: 'Slug must use lowercase letters, numbers, and hyphens' },
        { status: 400 }
      )
    }

    if (fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: `A post with slug "${slug}" already exists` },
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
      draft: body.draft !== false,
      image: body.image ? String(body.image).trim() : undefined,
    }

    const content = String(body.content ?? '')
    fs.mkdirSync(POSTS_DIR, { recursive: true })
    fs.writeFileSync(filePath, serializePost(metadata, content), 'utf-8')

    const posts = getBlogPosts({ includeDrafts: true })
    const created = posts.find((p) => p.slug === slug)
    return NextResponse.json({ post: created, posts }, { status: 201 })
  } catch {
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    )
  }
}
