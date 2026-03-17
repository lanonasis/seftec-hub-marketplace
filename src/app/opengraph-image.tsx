import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'SEFTEC Hub — Lagos Marketplace & VibeFind'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #1a0533 0%, #0f172a 40%, #0a1628 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background glow blobs */}
        <div
          style={{
            position: 'absolute',
            top: -80,
            left: -80,
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(168,85,247,0.35) 0%, transparent 70%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -100,
            right: -60,
            width: 500,
            height: 500,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(236,72,153,0.3) 0%, transparent 70%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '40%',
            right: '10%',
            width: 300,
            height: 300,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(59,130,246,0.2) 0%, transparent 70%)',
          }}
        />

        {/* Logo badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            marginBottom: 32,
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: 'linear-gradient(135deg, #a855f7, #ec4899)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 28,
              fontWeight: 800,
              color: 'white',
            }}
          >
            S
          </div>
          <span
            style={{
              fontSize: 36,
              fontWeight: 800,
              color: 'white',
              letterSpacing: '-1px',
            }}
          >
            SEFTEC Hub
          </span>
        </div>

        {/* Main headline */}
        <div
          style={{
            fontSize: 72,
            fontWeight: 900,
            textAlign: 'center',
            lineHeight: 1.05,
            letterSpacing: '-2px',
            maxWidth: 960,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 0,
          }}
        >
          <span style={{ color: 'white' }}>Lagos, Where You</span>
          <span
            style={{
              background: 'linear-gradient(90deg, #a855f7 0%, #ec4899 50%, #f97316 100%)',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
            }}
          >
            Dey Tonight? 🔥
          </span>
        </div>

        {/* Subline */}
        <div
          style={{
            marginTop: 24,
            fontSize: 26,
            color: 'rgba(255,255,255,0.65)',
            textAlign: 'center',
            maxWidth: 700,
          }}
        >
          Parties · Owambe · Rooftop Vibes · Handyman Pros
        </div>

        {/* Pill badges */}
        <div
          style={{
            display: 'flex',
            gap: 16,
            marginTop: 40,
          }}
        >
          {['🎉 VibeFind', '🔧 Handyman Hub', '🤖 Leo AI'].map((label) => (
            <div
              key={label}
              style={{
                padding: '10px 22px',
                borderRadius: 999,
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.15)',
                color: 'rgba(255,255,255,0.85)',
                fontSize: 20,
                fontWeight: 600,
              }}
            >
              {label}
            </div>
          ))}
        </div>

        {/* Bottom domain */}
        <div
          style={{
            position: 'absolute',
            bottom: 32,
            color: 'rgba(255,255,255,0.35)',
            fontSize: 18,
          }}
        >
          seftec-hub.replit.app
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
