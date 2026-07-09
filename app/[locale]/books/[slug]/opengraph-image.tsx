/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from 'next/og';
import { getLocalizedBookByPath } from '@/services/book-service';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const revalidate = 604800; // cache for 1 week

export default async function Image({ params }: { params: { locale: string; slug: string } }) {
  const book = await getLocalizedBookByPath(params.locale, params.slug);
  const coverUrl = book.coverImage;

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          position: 'relative',
          background: '#1a1a1a',
        }}
      >
        {/* Dimmed background fill (no blur) */}
        <img
          src={coverUrl}
          alt=""
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: 0.35,
          }}
        />
        {/* Gradient scrim on top, so text/foreground stay readable */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            background: 'linear-gradient(180deg, rgba(26,26,26,0.75) 0%, rgba(26,26,26,0.95) 100%)',
          }}
        />
        {/* Foreground: sharp cover + text */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 60,
            padding: '0 80px',
            position: 'relative',
            width: '100%',
          }}
        >
          <div
            style={{
              width: 440,
              height: 540,
              display: 'flex',
              borderRadius: 8,
              overflow: 'hidden',
            }}
          >
            <img
              src={coverUrl}
              alt=""
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </div>
          <div
            style={{ 
              display: 'flex',
              flexDirection: 'column',
              color: 'white',
              flex: 1,          // ← take remaining space instead of growing to fit content
              minWidth: 0,       // ← allows the flex item to shrink below its content's natural width
              overflow: 'hidden',
            }}
          >
            <div style={{ fontSize: 48, fontWeight: 700, fontFamily: 'Noto Sans Sinhala' }}>
              {book.titleEn}
            </div>
            <div style={{ fontSize: 28, opacity: 0.8, marginTop: 12, fontFamily: 'Noto Sans Sinhala' }}>
              {book.subtitleEn || ''}
            </div>
          </div>
        </div>
      </div>
    ),
    size
  );
}