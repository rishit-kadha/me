import { baseUrl } from 'app/sitemap'
import { getBlogPosts } from 'app/blog/utils'
import { profile } from 'app/lib/profile'

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export async function GET() {
  const allBlogs = getBlogPosts({ includeDrafts: false })

  const itemsXml = allBlogs
    .map(
      (post) =>
        `<item>
          <title>${escapeXml(post.metadata.title)}</title>
          <link>${baseUrl}/blog/${post.slug}</link>
          <guid>${baseUrl}/blog/${post.slug}</guid>
          <description>${escapeXml(post.metadata.summary || '')}</description>
          <pubDate>${new Date(
            post.metadata.publishedAt.includes('T')
              ? post.metadata.publishedAt
              : `${post.metadata.publishedAt}T00:00:00Z`
          ).toUTCString()}</pubDate>
        </item>`
    )
    .join('\n')

  const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
  <rss version="2.0">
    <channel>
        <title>${escapeXml(profile.name)}</title>
        <link>${baseUrl}</link>
        <description>${escapeXml(
          `Writing by ${profile.name} on software engineering and AI/ML.`
        )}</description>
        ${itemsXml}
    </channel>
  </rss>`

  return new Response(rssFeed, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
    },
  })
}
