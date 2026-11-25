import { getBlogPosts } from 'app/blog/utils'
import { siteUrl } from 'app/lib/profile'

export const baseUrl = siteUrl

export default async function sitemap() {
  const blogs = getBlogPosts({ includeDrafts: false }).map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.metadata.updatedAt || post.metadata.publishedAt,
  }))

  const routes = ['', '/blog'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString().split('T')[0],
  }))

  return [...routes, ...blogs]
}
