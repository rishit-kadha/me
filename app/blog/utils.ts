import fs from 'fs'
import path from 'path'

export type PostMetadata = {
  title: string
  publishedAt: string
  updatedAt?: string
  summary: string
  tags: string[]
  draft: boolean
  image?: string
}

export type BlogPost = {
  slug: string
  metadata: PostMetadata
  content: string
  readingTimeMinutes: number
}

export const POSTS_DIR = path.join(process.cwd(), 'app', 'blog', 'posts')

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function isValidSlug(slug: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)
}

function unquote(value: string): string {
  const trimmed = value.trim()
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1).replace(/\\"/g, '"')
  }
  return trimmed
}

function parseTags(raw: string | undefined): string[] {
  if (!raw) return []
  const cleaned = raw.trim()
  if (!cleaned) return []

  const inner =
    cleaned.startsWith('[') && cleaned.endsWith(']')
      ? cleaned.slice(1, -1)
      : cleaned

  return inner
    .split(',')
    .map((tag) => unquote(tag).trim().toLowerCase())
    .filter(Boolean)
}

export function estimateReadingTime(content: string): number {
  const words = content
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/[#>*_~\[\]()\-]/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length

  return Math.max(1, Math.ceil(words / 220))
}

export function parseFrontmatter(fileContent: string): {
  metadata: PostMetadata
  content: string
} {
  const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/
  const match = frontmatterRegex.exec(fileContent)

  if (!match) {
    return {
      metadata: {
        title: 'Untitled',
        publishedAt: new Date().toISOString().split('T')[0],
        summary: '',
        tags: [],
        draft: true,
      },
      content: fileContent.trim(),
    }
  }

  const frontMatterBlock = match[1]
  const content = fileContent.slice(match[0].length).trim()
  const rawFields: Record<string, string> = {}

  for (const line of frontMatterBlock.split(/\r?\n/)) {
    const colonIndex = line.indexOf(':')
    if (colonIndex === -1) continue
    const key = line.slice(0, colonIndex).trim()
    const value = line.slice(colonIndex + 1).trim()
    if (key) {
      rawFields[key] = value
    }
  }

  const metadata: PostMetadata = {
    title: unquote(rawFields.title || 'Untitled'),
    publishedAt: unquote(
      rawFields.publishedAt || new Date().toISOString().split('T')[0]
    ),
    updatedAt: rawFields.updatedAt ? unquote(rawFields.updatedAt) : undefined,
    summary: unquote(rawFields.summary || ''),
    tags: parseTags(rawFields.tags),
    draft: unquote(rawFields.draft || 'false').toLowerCase() === 'true',
    image: rawFields.image ? unquote(rawFields.image) : undefined,
  }

  return { metadata, content }
}

function quoteYaml(value: string): string {
  return `"${value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`
}

export function serializePost(
  metadata: PostMetadata,
  content: string
): string {
  const lines = [
    '---',
    `title: ${quoteYaml(metadata.title.trim())}`,
    `publishedAt: ${quoteYaml(metadata.publishedAt.trim())}`,
  ]

  if (metadata.updatedAt?.trim()) {
    lines.push(`updatedAt: ${quoteYaml(metadata.updatedAt.trim())}`)
  }

  lines.push(`summary: ${quoteYaml(metadata.summary.trim())}`)

  const cleanTags = metadata.tags
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean)
  if (cleanTags.length > 0) {
    lines.push(`tags: [${cleanTags.map(quoteYaml).join(', ')}]`)
  } else {
    lines.push('tags: []')
  }

  lines.push(`draft: ${metadata.draft ? 'true' : 'false'}`)

  if (metadata.image?.trim()) {
    lines.push(`image: ${quoteYaml(metadata.image.trim())}`)
  }

  lines.push('---', '', content.trim(), '')
  return lines.join('\n')
}

function getMDXFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return []
  return fs
    .readdirSync(dir)
    .filter((file) => path.extname(file) === '.mdx')
}

function readMDXFile(filePath: string) {
  const rawContent = fs.readFileSync(filePath, 'utf-8')
  return parseFrontmatter(rawContent)
}

export function getBlogPosts(options?: {
  includeDrafts?: boolean
}): BlogPost[] {
  const includeDrafts = options?.includeDrafts ?? false
  const mdxFiles = getMDXFiles(POSTS_DIR)

  return mdxFiles
    .map((file) => {
      const { metadata, content } = readMDXFile(path.join(POSTS_DIR, file))
      const slug = path.basename(file, path.extname(file))

      return {
        slug,
        metadata,
        content,
        readingTimeMinutes: estimateReadingTime(content),
      }
    })
    .filter((post) => includeDrafts || !post.metadata.draft)
    .sort((a, b) => {
      const timeA = new Date(a.metadata.publishedAt).getTime()
      const timeB = new Date(b.metadata.publishedAt).getTime()
      if (timeA !== timeB) return timeB - timeA
      return a.slug.localeCompare(b.slug)
    })
}

export function getBlogPostBySlug(
  slug: string,
  options?: { includeDrafts?: boolean }
): BlogPost | undefined {
  if (!isValidSlug(slug)) return undefined
  return getBlogPosts(options).find((post) => post.slug === slug)
}

export function getAllTags(posts: BlogPost[]): string[] {
  const set = new Set<string>()
  for (const post of posts) {
    for (const tag of post.metadata.tags) {
      set.add(tag)
    }
  }
  return Array.from(set).sort()
}

export function formatDate(date: string, style: 'short' | 'long' = 'long') {
  const normalized = date.includes('T') ? date : `${date}T00:00:00`
  const targetDate = new Date(normalized)

  if (Number.isNaN(targetDate.getTime())) {
    return date
  }

  if (style === 'short') {
    const year = targetDate.getFullYear()
    const month = String(targetDate.getMonth() + 1).padStart(2, '0')
    const day = String(targetDate.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  return targetDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}
