import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { CustomMDX } from 'app/components/mdx'
import { formatDate, getBlogPostBySlug, getBlogPosts } from 'app/blog/utils'
import { baseUrl } from 'app/sitemap'
import { profile } from 'app/lib/profile'

type PageProps = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const posts = getBlogPosts({ includeDrafts: false })

  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const isDev = process.env.NODE_ENV === 'development'
  const post = getBlogPostBySlug(slug, { includeDrafts: isDev })

  if (!post) {
    return {}
  }

  const {
    title,
    publishedAt: publishedTime,
    summary: description,
    image,
  } = post.metadata
  const ogImage = image
    ? image
    : `${baseUrl}/og?title=${encodeURIComponent(title)}`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime,
      url: `${baseUrl}/blog/${post.slug}`,
      images: [
        {
          url: ogImage,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  }
}

export default async function Blog({ params }: PageProps) {
  const { slug } = await params
  const isDev = process.env.NODE_ENV === 'development'
  const post = getBlogPostBySlug(slug, { includeDrafts: isDev })

  if (!post) {
    notFound()
  }

  return (
    <section className="enter">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: post.metadata.title,
            datePublished: post.metadata.publishedAt,
            dateModified:
              post.metadata.updatedAt || post.metadata.publishedAt,
            description: post.metadata.summary,
            image: post.metadata.image
              ? `${baseUrl}${post.metadata.image}`
              : `${baseUrl}/og?title=${encodeURIComponent(post.metadata.title)}`,
            url: `${baseUrl}/blog/${post.slug}`,
            author: {
              '@type': 'Person',
              name: profile.name,
            },
          }),
        }}
      />

      <Link
        href="/blog"
        className="mb-8 inline-flex items-center gap-1.5 text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors duration-150"
      >
        <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
        <span>Writing</span>
      </Link>

      <header className="mb-10 border-b border-[var(--hairline)] pb-8">
        {post.metadata.draft ? (
          <p className="mb-3 inline-flex items-center gap-2 font-mono text-xs text-[var(--text-muted)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--text-muted)]" />
            Draft preview (visible only in local development)
          </p>
        ) : null}

        <h1 className="title text-[32px] leading-[1.15] font-medium tracking-[-0.025em] text-[var(--text-primary)]">
          {post.metadata.title}
        </h1>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-xs text-[var(--text-muted)] tabular-nums">
          <time dateTime={post.metadata.publishedAt}>
            {formatDate(post.metadata.publishedAt, 'long')}
          </time>
          <span>{post.readingTimeMinutes} min read</span>
          {post.metadata.updatedAt ? (
            <span>Updated {formatDate(post.metadata.updatedAt, 'long')}</span>
          ) : null}
        </div>

        {post.metadata.tags.length > 0 ? (
          <div className="mt-4 flex flex-wrap items-center gap-3">
            {post.metadata.tags.map((tag) => (
              <span
                key={tag}
                className="font-mono text-xs text-[var(--text-muted)]"
              >
                #{tag}
              </span>
            ))}
          </div>
        ) : null}
      </header>

      <article className="prose">
        <CustomMDX source={post.content} />
      </article>
    </section>
  )
}
