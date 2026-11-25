import { formatDate, getAllTags, getBlogPosts } from 'app/blog/utils'
import { BlogList, type PostListItem } from './blog-list'

type BlogPostsProps = {
  limit?: number
  showSummary?: boolean
  showTagFilter?: boolean
}

export function BlogPosts({
  limit,
  showSummary = false,
  showTagFilter = false,
}: BlogPostsProps) {
  const allBlogs = getBlogPosts({ includeDrafts: false })
  const visible = limit ? allBlogs.slice(0, limit) : allBlogs
  const tags = getAllTags(allBlogs)
  const isDev = process.env.NODE_ENV === 'development'

  const items: PostListItem[] = visible.map((post) => ({
    slug: post.slug,
    title: post.metadata.title,
    publishedAt: post.metadata.publishedAt,
    formattedDate: formatDate(post.metadata.publishedAt, 'short'),
    summary: post.metadata.summary,
    tags: post.metadata.tags,
    readingTimeMinutes: post.readingTimeMinutes,
  }))

  return (
    <BlogList
      posts={items}
      tags={tags}
      showSummary={showSummary}
      showTagFilter={showTagFilter}
      isDev={isDev}
    />
  )
}
