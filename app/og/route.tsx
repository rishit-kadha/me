import { ImageResponse } from 'next/og'
import { profile } from 'app/lib/profile'

export function GET(request: Request) {
  const url = new URL(request.url)
  const title = url.searchParams.get('title') || profile.name
  const subtitle =
    url.searchParams.get('subtitle') ||
    `${profile.role} · ${profile.location}`

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: '100%',
          height: '100%',
          backgroundColor: '#070a09',
          backgroundImage:
            'radial-gradient(circle at 80% 10%, rgba(16, 185, 129, 0.34), rgba(6, 78, 59, 0.12) 45%, rgba(7, 10, 9, 0) 75%)',
          color: '#eef4f1',
          padding: '72px 80px',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontSize: '20px',
            color: '#9fb0a7',
          }}
        >
          <div
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '999px',
              backgroundColor: '#34d399',
            }}
          />
          <span>{profile.name}</span>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            maxWidth: '960px',
          }}
        >
          <div
            style={{
              fontSize: '58px',
              fontWeight: 500,
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
              color: '#eef4f1',
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: '24px',
              color: '#9fb0a7',
            }}
          >
            {subtitle}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            borderTop: '1px solid rgba(226, 242, 234, 0.1)',
            paddingTop: '24px',
            fontSize: '18px',
            color: '#6f8077',
          }}
        >
          <span>{profile.role}</span>
          <span>{profile.location}</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
