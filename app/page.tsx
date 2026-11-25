import Link from 'next/link'
import {
  ArrowRight,
  ArrowUpRight,
  Cpu,
  Layers,
  Terminal,
  Wrench,
} from 'lucide-react'
import { BlogPosts } from 'app/components/posts'
import { TechIcon } from 'app/components/tech-icon'
import { profile, type StackGroup } from 'app/lib/profile'

function SkillIcon({ icon }: { icon: StackGroup['icon'] }) {
  switch (icon) {
    case 'terminal':
      return <Terminal className="h-4 w-4" strokeWidth={1.5} />
    case 'layers':
      return <Layers className="h-4 w-4" strokeWidth={1.5} />
    case 'cpu':
      return <Cpu className="h-4 w-4" strokeWidth={1.5} />
    case 'wrench':
      return <Wrench className="h-4 w-4" strokeWidth={1.5} />
  }
}

function SectionHeading({
  title,
  id,
  meta,
  right,
}: {
  title: string
  id: string
  meta?: string
  right?: React.ReactNode
}) {
  return (
    <div className="mb-6 flex flex-wrap items-baseline justify-between gap-4">
      <div className="flex items-baseline gap-3">
        <h2
          id={id}
          className="text-lg font-medium text-[var(--text-primary)]"
        >
          {title}
        </h2>
        {meta ? (
          <span className="font-mono text-xs text-[var(--text-muted)] tabular-nums">
            {meta}
          </span>
        ) : null}
      </div>
      {right}
    </div>
  )
}

export default function Page() {
  const isDev = process.env.NODE_ENV === 'development'
  const showProjects = isDev || profile.showProjectsInProd

  return (
    <div className="enter">
      {/* Landing Hero */}
      <section
        aria-labelledby="intro-heading"
        className="pt-16 pb-20 sm:pt-24 sm:pb-24"
      >
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.95fr)] lg:items-center">
          <div>
            <p className="mb-4 inline-flex items-center gap-2 font-mono text-xs text-[var(--text-muted)]">
              <span
                aria-hidden="true"
                className="h-2 w-2 rounded-full bg-[var(--accent)]"
              />
              <span>
                {profile.currentLine} · {profile.location}
              </span>
            </p>

            <h1
              id="intro-heading"
              className="text-[40px] sm:text-[52px] leading-[1.04] font-medium tracking-[-0.03em] text-[var(--text-primary)]"
            >
              {profile.headline}
            </h1>

            <p className="mt-6 max-w-[36rem] text-[15px] sm:text-base leading-7 text-[var(--text-secondary)]">
              {profile.bio[0]}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href={`mailto:${profile.links.email}`}
                className="inline-flex h-11 items-center justify-center rounded-[10px] bg-[var(--text-primary)] px-5 text-sm font-medium text-[var(--bg)] hover:opacity-90 active:scale-[0.98] transition-[opacity,transform] duration-150"
              >
                Email me
              </a>

              <a
                href={profile.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center gap-2 rounded-[10px] border border-[var(--hairline-strong)] bg-[var(--surface-raised)] px-4 text-sm font-medium text-[var(--text-primary)] hover:border-[var(--accent-hairline)] active:scale-[0.98] transition-[border-color,transform] duration-150"
              >
                <span>GitHub</span>
                <ArrowUpRight
                  className="h-4 w-4 text-[var(--text-muted)]"
                  strokeWidth={1.5}
                />
              </a>

              <a
                href={profile.links.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center gap-1.5 px-3 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors duration-150"
              >
                <span>LinkedIn</span>
                <ArrowUpRight
                  className="h-4 w-4 text-[var(--text-muted)]"
                  strokeWidth={1.5}
                />
              </a>
            </div>
          </div>

          {/* Hero visual card: fun dev snippet */}
          <div className="hero-artifact overflow-hidden rounded-[16px]">
            <div className="flex items-center justify-between border-b border-[var(--hairline)] px-4 py-3">
              <div className="flex items-center gap-2 font-mono text-xs text-[var(--text-secondary)]">
                <Terminal
                  className="h-4 w-4 text-[var(--text-muted)]"
                  strokeWidth={1.5}
                />
                <span>ship.ts</span>
              </div>
              <span className="font-mono text-xs text-[var(--accent)]">
                mostly stable
              </span>
            </div>

            <pre className="px-4 py-4 font-mono text-[13px] leading-6 text-[var(--text-secondary)]">
              <code>
                <span className="text-[var(--sh-keyword)]">function</span>{' '}
                <span className="text-[var(--text-primary)]">ship</span>
                {'(day: '}
                <span className="text-[var(--sh-class)]">string</span>
                {') {\n'}
                {'  '}
                <span className="text-[var(--sh-keyword)]">if</span>
                {' (day === '}
                <span className="text-[var(--sh-string)]">&apos;Friday&apos;</span>
                {') {\n'}
                {'    '}
                <span className="text-[var(--sh-keyword)]">return</span>{' '}
                <span className="text-[var(--sh-string)]">&apos;absolutely not&apos;</span>
                {'\n  }\n'}
                {'  '}
                <span className="text-[var(--sh-keyword)]">if</span>
                {' (!coffee) {\n'}
                {'    '}
                <span className="text-[var(--sh-keyword)]">return</span>{' '}
                <span className="text-[var(--sh-string)]">&apos;brb, refilling&apos;</span>
                {'\n  }\n'}
                {'  '}
                <span className="text-[var(--sh-keyword)]">return</span>{' '}
                <span className="text-[var(--sh-string)]">&apos;works on my machine&apos;</span>
                {'\n}'}
              </code>
            </pre>

            <div className="flex items-center justify-between border-t border-[var(--hairline)] bg-[var(--surface)] px-4 py-3 font-mono text-xs tabular-nums">
              <span className="inline-flex items-center gap-2 text-[var(--text-secondary)]">
                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]"
                />
                0 Fridays harmed
              </span>
              <span className="text-[var(--text-muted)]">Go · TS · Python</span>
            </div>
          </div>
        </div>
      </section>

      <div className="space-y-16 border-t border-[var(--hairline)] pt-16">
        {/* Previous Experience (logos & titles only) */}
        <section id="experience" aria-labelledby="experience-heading">
          <SectionHeading
            title="Experience"
            id="experience-heading"
            meta={`${profile.experience.length} organizations`}
          />

          <div className="surface-panel divide-y divide-[var(--hairline)] overflow-hidden rounded-[16px]">
            {profile.experience.map((group) => (
              <article key={group.organization} className="p-5">
                <div className="flex items-start gap-4">
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-[8px] border border-[var(--hairline-strong)]"
                    style={{ backgroundColor: group.logoBg }}
                  >
                    <img
                      src={group.logo}
                      alt={`${group.organization} logo`}
                      width={40}
                      height={40}
                      className={
                        group.logoPadding
                          ? 'h-6 w-6 object-contain'
                          : 'h-full w-full object-cover'
                      }
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                      {group.url ? (
                        <a
                          href={group.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group inline-flex items-center gap-1.5 text-[15px] font-medium text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors duration-150"
                        >
                          <span>{group.organization}</span>
                          <ArrowUpRight
                            className="h-4 w-4 text-[var(--text-muted)] group-hover:text-[var(--accent)] transition-colors duration-150"
                            strokeWidth={1.5}
                          />
                        </a>
                      ) : (
                        <h3 className="text-[15px] font-medium text-[var(--text-primary)]">
                          {group.organization}
                        </h3>
                      )}

                      <span className="font-mono text-xs text-[var(--text-muted)]">
                        {group.location}
                      </span>
                    </div>

                    <div
                      className={
                        group.roles.length > 1
                          ? 'mt-3 space-y-2 border-l border-[var(--hairline-strong)] pl-3'
                          : 'mt-1'
                      }
                    >
                      {group.roles.map((role) => (
                        <div
                          key={`${role.title}-${role.period}`}
                          className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1"
                        >
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="text-sm text-[var(--text-secondary)]">
                              {role.title}
                            </p>
                            {role.current ? (
                              <span
                                title="Current role"
                                className="inline-flex items-center gap-1.5 font-mono text-xs text-[var(--accent)]"
                              >
                                <span
                                  aria-hidden="true"
                                  className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]"
                                />
                                Current
                              </span>
                            ) : null}
                          </div>
                          <span className="font-mono text-xs text-[var(--text-muted)] tabular-nums">
                            {role.period}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Projects (local dev preview only; hidden in production) */}
        {showProjects ? (
          <section id="projects" aria-labelledby="projects-heading">
            <SectionHeading
              title="Projects"
              id="projects-heading"
              meta={
                isDev && !profile.showProjectsInProd
                  ? 'Local preview · hidden in production'
                  : undefined
              }
              right={
                <a
                  href={profile.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors duration-150"
                >
                  <span>GitHub</span>
                  <ArrowUpRight className="h-4 w-4" strokeWidth={1.5} />
                </a>
              }
            />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
              {profile.demoProjects.map((project, index) => {
                const isLead = index === 0
                return (
                  <article
                    key={project.name}
                    className={`surface-panel flex flex-col justify-between rounded-[16px] p-5 hover:border-[var(--hairline-strong)] transition-colors duration-150 ${
                      isLead ? 'md:col-span-12' : 'md:col-span-6'
                    }`}
                  >
                    <div>
                      <div className="flex flex-wrap items-baseline justify-between gap-4">
                        <div>
                          <h3 className="text-[15px] font-medium text-[var(--text-primary)]">
                            {project.name}
                          </h3>
                          <p className="mt-1 text-sm text-[var(--text-muted)]">
                            {project.tagline}
                          </p>
                        </div>

                        <span className="font-mono text-xs text-[var(--text-muted)] tabular-nums">
                          {project.status} · {project.year}
                        </span>
                      </div>

                      <p className="mt-4 max-w-2xl text-sm leading-6 text-[var(--text-secondary)]">
                        {project.summary}
                      </p>
                    </div>

                    <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--hairline)] pt-4">
                      <p className="font-mono text-xs text-[var(--text-muted)]">
                        {project.stack.join(' · ')}
                      </p>

                      <div className="flex items-center gap-4">
                        {project.repoUrl ? (
                          <a
                            href={project.repoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors duration-150"
                          >
                            <span>Code</span>
                            <ArrowUpRight
                              className="h-4 w-4 text-[var(--text-muted)]"
                              strokeWidth={1.5}
                            />
                          </a>
                        ) : null}
                        {project.liveUrl ? (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors duration-150"
                          >
                            <span>Live</span>
                            <ArrowUpRight
                              className="h-4 w-4 text-[var(--text-muted)]"
                              strokeWidth={1.5}
                            />
                          </a>
                        ) : null}
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          </section>
        ) : null}

        {/* Skills Matrix (unified hairline architectural grid) */}
        <section id="skills" aria-labelledby="stack-heading">
          <SectionHeading
            title="Skills"
            id="stack-heading"
            meta={`${profile.stack.reduce((acc, g) => acc + g.items.length, 0)} technologies`}
          />

          <div className="surface-panel overflow-hidden rounded-[16px]">
            <div className="grid grid-cols-1 md:grid-cols-2">
              {profile.stack.map((group, idx) => {
                const borderClasses =
                  idx === 0
                    ? ''
                    : idx === 1
                      ? 'border-t border-[var(--hairline)] md:border-t-0 md:border-l'
                      : idx === 2
                        ? 'border-t border-[var(--hairline)]'
                        : 'border-t border-[var(--hairline)] md:border-l'

                const isCompactFour = group.items.length === 4

                return (
                  <div
                    key={group.category}
                    className={`flex flex-col p-5 ${borderClasses}`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-2.5">
                        <span className="mt-0.5 text-[var(--text-muted)]">
                          <SkillIcon icon={group.icon} />
                        </span>
                        <div>
                          <h3 className="text-sm leading-5 font-medium text-[var(--text-primary)]">
                            {group.category}
                          </h3>
                          <p className="mt-0.5 text-xs leading-4 text-[var(--text-muted)]">
                            {group.subtitle}
                          </p>
                        </div>
                      </div>

                      <span className="font-mono text-xs leading-5 text-[var(--text-muted)] tabular-nums">
                        {group.items.length}
                      </span>
                    </div>

                    <ul
                      className={
                        isCompactFour
                          ? 'mt-5 grid grid-cols-2 gap-2'
                          : 'mt-5 flex flex-wrap gap-2'
                      }
                    >
                      {group.items.map((skill) => (
                        <li
                          key={skill}
                          className="inline-flex h-9 items-center gap-2 rounded-[8px] border border-[var(--hairline)] bg-[var(--surface-raised)] px-3 text-xs font-medium text-[var(--text-secondary)] hover:border-[var(--hairline-strong)] hover:text-[var(--text-primary)] transition-colors duration-150"
                        >
                          <TechIcon name={skill} />
                          <span>{skill}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Writing */}
        <section id="writing" aria-labelledby="writing-heading">
          <SectionHeading
            title="Writing"
            id="writing-heading"
            right={
              <Link
                href="/blog"
                className="inline-flex items-center gap-1.5 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors duration-150"
              >
                <span>All posts</span>
                <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
              </Link>
            }
          />
          <BlogPosts limit={5} />
        </section>
      </div>
    </div>
  )
}
