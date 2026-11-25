export type RoleEntry = {
  title: string
  period: string
  current?: boolean
}

export type ExperienceGroup = {
  organization: string
  location: string
  logo: string
  logoBg: string
  logoPadding?: boolean
  url?: string
  roles: RoleEntry[]
}

export type DemoProject = {
  name: string
  tagline: string
  year: string
  status: string
  stack: string[]
  summary: string
  repoUrl?: string
  liveUrl?: string
}

export type StackGroup = {
  category: string
  subtitle: string
  icon: 'terminal' | 'layers' | 'cpu' | 'wrench'
  items: string[]
}

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ||
  'https://rishitkadha.com'

export const profile = {
  name: 'Rishit Kadha',
  role: 'Backend AI and full-stack developer',
  headline: 'Backend AI systems and web software',
  currentLine: 'Open to software and AI/ML roles',
  location: 'New Delhi, India',
  bio: [
    'I build backend services, PostgreSQL data models, and AI coding workflows in Go, TypeScript, and Python. Previously a Backend AI Engineer intern at FlyRank AI, and currently leading web releases at the GameDev Guild Students Club in New Delhi.',
  ],
  links: {
    linkedin: 'https://www.linkedin.com/in/rishit-kadha-18958126a/',
    github: 'https://github.com/rishit-kadha',
    email: 'rishitkadha@gmail.com',
  },
  experience: [
    {
      organization: 'FlyRank AI',
      location: 'Remote',
      logo: '/logos/flyrank.png',
      logoBg: '#051f21',
      logoPadding: false,
      url: 'https://flyrank.ai',
      roles: [
        {
          title: 'Backend AI Engineer, Intern',
          period: 'Jul 2026 - Aug 2026',
        },
      ],
    },
    {
      organization: 'BharatCares & IBM SkillsBuild',
      location: 'Remote',
      logo: '/logos/ibm.svg',
      logoBg: '#ffffff',
      logoPadding: true,
      url: 'https://skillsbuild.org',
      roles: [
        {
          title: 'Gen AI & Cloud Computing Intern',
          period: 'Jun 2026 - Jul 2026',
        },
      ],
    },
    {
      organization: 'GameDev Guild Students Club, GGSIPU',
      location: 'New Delhi, India',
      logo: '/logos/gdgsc.png',
      logoBg: '#ffffff',
      logoPadding: false,
      url: 'https://gdgsc.tech',
      roles: [
        {
          title: 'Team Scratch Lead',
          period: 'Sep 2025 - Present',
          current: true,
        },
        {
          title: 'Team Scratch Member',
          period: 'Feb 2025 - Oct 2025',
        },
      ],
    },
    {
      organization: 'Intel oneAPI Students Club GGSIPU-EDC',
      location: 'New Delhi, India',
      logo: '/logos/intel.svg',
      logoBg: '#ffffff',
      logoPadding: true,
      roles: [
        {
          title: 'Core Team, Software Developer',
          period: 'Feb 2025 - Nov 2025',
        },
      ],
    },
  ] as ExperienceGroup[],
  // Shown only during local development (NODE_ENV === 'development').
  // Set showProjectsInProd to true when you are ready to publish projects live.
  showProjectsInProd: false,
  demoProjects: [
    {
      name: 'Peak',
      tagline: 'Telegram fitness and nutrition tracking bot',
      year: '2026',
      status: 'In progress',
      stack: ['Go', 'PostgreSQL', 'sqlc', 'Docker'],
      summary:
        'Go backend with a nine-table PostgreSQL schema, type-safe sqlc queries, isolated concurrent conversation state, and Docker Compose builds.',
      repoUrl: 'https://github.com/rishit-kadha',
    },
    {
      name: 'Relay',
      tagline: 'Idempotent lead-capture forms and dashboard',
      year: '2026',
      status: 'Shipped',
      stack: ['Node.js', 'Express', 'PostgreSQL', 'TypeScript'],
      summary:
        'Embeddable form capture pipeline with backend idempotency keys and regression-tested configuration workflows.',
    },
    {
      name: 'GDGSC Game Store',
      tagline: 'Publishing pipeline for student game releases',
      year: '2025',
      status: 'Live',
      stack: ['React', 'Node.js', 'MongoDB', 'Cloudflare R2'],
      summary:
        'Release portal where club admins upload builds to Cloudflare R2 and publish downloadable listings for campus game jams.',
      liveUrl: 'https://gdgsc.tech',
    },
  ] as DemoProject[],
  stack: [
    {
      category: 'Languages',
      subtitle: 'Systems, backend, and web',
      icon: 'terminal',
      items: ['Go', 'TypeScript', 'JavaScript', 'Python', 'Bash', 'HTML', 'CSS'],
    },
    {
      category: 'Web & Databases',
      subtitle: 'Full-stack apps and data stores',
      icon: 'layers',
      items: [
        'Next.js',
        'React',
        'Node.js',
        'Express.js',
        'PostgreSQL',
        'MongoDB',
      ],
    },
    {
      category: 'Tools & Systems',
      subtitle: 'Infrastructure, APIs, and agents',
      icon: 'wrench',
      items: [
        'Docker',
        'Linux',
        'Git',
        'REST APIs',
        'Authentication',
        'sqlc',
        'AI coding agents',
      ],
    },
    {
      category: 'ML & Data',
      subtitle: 'Modeling and analysis',
      icon: 'cpu',
      items: ['scikit-learn', 'pandas', 'NumPy', 'Matplotlib'],
    },
  ] as StackGroup[],
}
