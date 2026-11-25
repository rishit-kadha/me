#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'

const POSTS_DIR = path.join(process.cwd(), 'app', 'blog', 'posts')

function slugify(input) {
  return input
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function isValidSlug(slug) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)
}

function todayIso() {
  return new Date().toISOString().split('T')[0]
}

function quoteYaml(value) {
  return `"${String(value).replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`
}

function unquote(value) {
  const trimmed = String(value).trim()
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1).replace(/\\"/g, '"')
  }
  return trimmed
}

function parseFile(filePath) {
  const raw = fs.readFileSync(filePath, 'utf-8')
  const match = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(raw)
  if (!match) {
    return { fields: {}, content: raw.trim() }
  }
  const fields = {}
  for (const line of match[1].split(/\r?\n/)) {
    const idx = line.indexOf(':')
    if (idx === -1) continue
    const key = line.slice(0, idx).trim()
    const value = line.slice(idx + 1).trim()
    if (key) fields[key] = value
  }
  return { fields, content: raw.slice(match[0].length).trim() }
}

function serializeFile(fields, content) {
  const lines = [
    '---',
    `title: ${quoteYaml(unquote(fields.title || 'Untitled'))}`,
    `publishedAt: ${quoteYaml(unquote(fields.publishedAt || todayIso()))}`,
  ]
  if (fields.updatedAt) {
    lines.push(`updatedAt: ${quoteYaml(unquote(fields.updatedAt))}`)
  }
  lines.push(`summary: ${quoteYaml(unquote(fields.summary || ''))}`)
  lines.push(`tags: ${fields.tags || '[]'}`)
  lines.push(`draft: ${String(fields.draft) === 'true' ? 'true' : 'false'}`)
  if (fields.image) {
    lines.push(`image: ${quoteYaml(unquote(fields.image))}`)
  }
  lines.push('---', '', content.trim(), '')
  return lines.join('\n')
}

function getPostPath(slug) {
  if (!isValidSlug(slug)) {
    console.error(`Invalid slug: "${slug}". Use lowercase letters, numbers, and hyphens.`)
    process.exit(1)
  }
  return path.join(POSTS_DIR, `${slug}.mdx`)
}

function listPosts() {
  if (!fs.existsSync(POSTS_DIR)) {
    console.log('No posts directory found.')
    return
  }

  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith('.mdx'))
  if (files.length === 0) {
    console.log('No blog posts found.')
    return
  }

  const rows = files
    .map((file) => {
      const slug = path.basename(file, '.mdx')
      const { fields } = parseFile(path.join(POSTS_DIR, file))
      const draft = unquote(fields.draft || 'false').toLowerCase() === 'true'
      return {
        status: draft ? 'draft    ' : 'published',
        date: unquote(fields.publishedAt || '----'),
        slug,
        title: unquote(fields.title || 'Untitled'),
      }
    })
    .sort((a, b) => b.date.localeCompare(a.date))

  console.log('STATUS     DATE        SLUG                      TITLE')
  console.log('------------------------------------------------------------------------')
  for (const row of rows) {
    console.log(
      `${row.status}  ${row.date.padEnd(10)}  ${row.slug.padEnd(24)}  ${row.title}`
    )
  }
}

function createPost(args) {
  const flags = { tags: [], publish: false, summary: '' }
  const titleParts = []

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i]
    if (arg === '--publish') {
      flags.publish = true
    } else if (arg === '--tags' && args[i + 1]) {
      flags.tags = args[i + 1]
        .split(/[,\s]+/)
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean)
      i += 1
    } else if (arg === '--summary' && args[i + 1]) {
      flags.summary = args[i + 1]
      i += 1
    } else {
      titleParts.push(arg)
    }
  }

  const title = titleParts.join(' ').trim()
  if (!title) {
    console.error('Usage: pnpm blog:new "Post title" [--tags ai,web] [--publish]')
    process.exit(1)
  }

  const slug = slugify(title)
  const target = getPostPath(slug)

  if (fs.existsSync(target)) {
    console.error(`Post already exists: ${target}`)
    process.exit(1)
  }

  fs.mkdirSync(POSTS_DIR, { recursive: true })
  const tagsLiteral = `[${flags.tags.map(quoteYaml).join(', ')}]`
  const content = serializeFile(
    {
      title,
      publishedAt: todayIso(),
      summary: flags.summary,
      tags: tagsLiteral,
      draft: flags.publish ? 'false' : 'true',
    },
    'Write your post here.'
  )

  fs.writeFileSync(target, content, 'utf-8')
  console.log(`Created ${flags.publish ? 'published post' : 'draft'}: app/blog/posts/${slug}.mdx`)
}

function setDraftState(slug, draft) {
  if (!slug) {
    console.error(`Usage: pnpm blog:${draft ? 'unpublish' : 'publish'} <slug>`)
    process.exit(1)
  }
  const target = getPostPath(slug)
  if (!fs.existsSync(target)) {
    console.error(`Post not found: app/blog/posts/${slug}.mdx`)
    process.exit(1)
  }

  const { fields, content } = parseFile(target)
  fields.draft = draft ? 'true' : 'false'
  if (!draft) {
    fields.publishedAt = todayIso()
  }
  fs.writeFileSync(target, serializeFile(fields, content), 'utf-8')
  console.log(`${draft ? 'Moved to drafts' : 'Published'}: app/blog/posts/${slug}.mdx`)
}

function deletePost(slug) {
  if (!slug) {
    console.error('Usage: pnpm blog:delete <slug>')
    process.exit(1)
  }
  const target = getPostPath(slug)
  if (!fs.existsSync(target)) {
    console.error(`Post not found: app/blog/posts/${slug}.mdx`)
    process.exit(1)
  }
  fs.unlinkSync(target)
  console.log(`Deleted: app/blog/posts/${slug}.mdx`)
}

const [, , command, ...rest] = process.argv

switch (command) {
  case 'list':
    listPosts()
    break
  case 'new':
    createPost(rest)
    break
  case 'publish':
    setDraftState(rest[0], false)
    break
  case 'unpublish':
    setDraftState(rest[0], true)
    break
  case 'delete':
    deletePost(rest[0])
    break
  default:
    console.log('Commands:')
    console.log('  pnpm blog:list')
    console.log('  pnpm blog:new "Post title" [--tags a,b] [--publish]')
    console.log('  pnpm blog:publish <slug>')
    console.log('  pnpm blog:unpublish <slug>')
    console.log('  pnpm blog:delete <slug>')
    break
}
