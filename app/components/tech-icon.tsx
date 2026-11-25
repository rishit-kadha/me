import { Bot, ChartLine, Database, Globe, KeyRound } from 'lucide-react'
import {
  siCss,
  siDocker,
  siExpress,
  siGit,
  siGnubash,
  siGo,
  siHtml5,
  siJavascript,
  siLinux,
  siMongodb,
  siNextdotjs,
  siNodedotjs,
  siNumpy,
  siPandas,
  siPostgresql,
  siPython,
  siReact,
  siScikitlearn,
  siTypescript,
  type SimpleIcon,
} from 'simple-icons'

type BrandEntry = {
  icon: SimpleIcon
  color: string
}

const brandIcons: Record<string, BrandEntry> = {
  Go: { icon: siGo, color: '#00ADD8' },
  TypeScript: { icon: siTypescript, color: '#3178C6' },
  JavaScript: { icon: siJavascript, color: '#F7DF1E' },
  Python: { icon: siPython, color: '#4B8BBE' },
  Bash: { icon: siGnubash, color: '#4EAA25' },
  HTML: { icon: siHtml5, color: '#E34F26' },
  CSS: { icon: siCss, color: '#38BDF8' },
  'Next.js': { icon: siNextdotjs, color: 'currentColor' },
  React: { icon: siReact, color: '#61DAFB' },
  'Node.js': { icon: siNodedotjs, color: '#5FA04E' },
  'Express.js': { icon: siExpress, color: 'currentColor' },
  PostgreSQL: { icon: siPostgresql, color: '#5B8DEF' },
  MongoDB: { icon: siMongodb, color: '#47A248' },
  Docker: { icon: siDocker, color: '#2496ED' },
  Linux: { icon: siLinux, color: '#FCC624' },
  Git: { icon: siGit, color: '#F05032' },
  'scikit-learn': { icon: siScikitlearn, color: '#F7931E' },
  pandas: { icon: siPandas, color: '#60A5FA' },
  NumPy: { icon: siNumpy, color: '#4DABCF' },
}

export function TechIcon({ name }: { name: string }) {
  const brand = brandIcons[name]

  if (brand) {
    return (
      <svg
        role="img"
        aria-hidden="true"
        viewBox="0 0 24 24"
        width={16}
        height={16}
        className="h-4 w-4 shrink-0"
        style={{ fill: brand.color }}
      >
        <path d={brand.icon.path} />
      </svg>
    )
  }

  switch (name) {
    case 'Matplotlib':
      return (
        <ChartLine
          aria-hidden="true"
          className="h-4 w-4 shrink-0 text-[var(--text-muted)]"
          strokeWidth={1.5}
        />
      )
    case 'REST APIs':
      return (
        <Globe
          aria-hidden="true"
          className="h-4 w-4 shrink-0 text-[var(--text-muted)]"
          strokeWidth={1.5}
        />
      )
    case 'Authentication':
      return (
        <KeyRound
          aria-hidden="true"
          className="h-4 w-4 shrink-0 text-[var(--text-muted)]"
          strokeWidth={1.5}
        />
      )
    case 'sqlc':
      return (
        <Database
          aria-hidden="true"
          className="h-4 w-4 shrink-0 text-[var(--text-muted)]"
          strokeWidth={1.5}
        />
      )
    case 'AI coding agents':
      return (
        <Bot
          aria-hidden="true"
          className="h-4 w-4 shrink-0 text-[var(--text-muted)]"
          strokeWidth={1.5}
        />
      )
    default:
      return null
  }
}
