import { notFound } from 'next/navigation'
import { getBlogPosts } from 'app/blog/utils'
import { StudioClient } from './studio-client'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Studio',
  robots: {
    index: false,
    follow: false,
  },
}

export default function StudioPage() {
  if (process.env.NODE_ENV !== 'development') {
    notFound()
  }

  const posts = getBlogPosts({ includeDrafts: true })
  return <StudioClient initialPosts={posts} />
}
