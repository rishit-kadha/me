import { ImageResponse } from 'next/og'

export const size = {
  width: 180,
  height: 180,
}

export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0b0d0c',
          backgroundImage:
            'radial-gradient(circle at 50% 0%, #123025 0%, #0b0d0c 60%, #070908 100%)',
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 32 32"
          width="164"
          height="164"
          fill="none"
        >
          <path
            fill="#eef2f0"
            fillRule="evenodd"
            d="M9.68 10.50Q10.82 10.50 11.70 10.89Q12.57 11.29 13.07 12.04Q13.57 12.79 13.57 13.81Q13.57 14.79 13.03 15.48Q12.50 16.17 11.64 16.42Q12.48 16.54 12.89 16.99Q13.30 17.44 13.38 18.33L13.66 21.50L11.63 21.50L11.40 18.62Q11.33 17.91 10.87 17.63Q10.40 17.35 9.35 17.35L7.09 17.35L7.09 21.50L5.07 21.50L5.07 10.50L9.68 10.50ZM7.09 15.58L9.46 15.58Q10.44 15.58 10.96 15.16Q11.49 14.74 11.49 13.94Q11.49 13.13 10.96 12.69Q10.44 12.25 9.46 12.25L7.09 12.25Z"
          />
          <path
            fill="#eef2f0"
            d="M15.07 10.50L17.08 10.50L17.08 15.52L21.39 10.50L23.78 10.50L19.66 15.33L24.04 21.50L21.73 21.50L18.32 16.71L17.08 18.12L17.08 21.50L15.07 21.50Z"
          />
          <path
            fill="#34d399"
            d="M24.65 19.33L26.93 19.33L26.93 21.50L24.65 21.50Z"
          />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  )
}
