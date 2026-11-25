# me

Personal portfolio and MDX blog for Rishit Kadha, built with Next.js, TypeScript, and Tailwind CSS.

## Local development

```bash
pnpm dev
```

Open `http://localhost:3000`.

## Updating profile content

Edit `app/lib/profile.ts` to update your bio, links, education, tech stack, or add work experience entries.

Set `NEXT_PUBLIC_SITE_URL` in your deployment environment (for example `https://rishitkadha.com`) so canonical metadata, RSS, Open Graph images, and the sitemap point to your domain.

## Managing and publishing blog posts

Posts live in `app/blog/posts/*.mdx`. Any post with `draft: true` stays hidden from `/blog`, `/rss`, and `/sitemap.xml` in production builds.

### Option 1: Local Writing Studio

Run `pnpm dev` and open `http://localhost:3000/studio` (or click **Studio** in the navbar).

From the studio you can create posts, edit frontmatter and Markdown, toggle preview, switch between draft and published, and delete posts. The `/studio` route and its API return `404` in production builds.

### Option 2: CLI scripts

```bash
pnpm blog:list
pnpm blog:new "Post title" --tags engineering,ai
pnpm blog:publish post-title
pnpm blog:unpublish post-title
pnpm blog:delete post-title
```

Commit and push changes in `app/blog/posts/` to publish on Vercel.
