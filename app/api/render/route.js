import { ImageResponse } from '@vercel/og'

export const runtime = 'edge'

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}))
    
    const now = new Date()
    const defaultTimestamp = now.toLocaleString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).replace(',', ' ·')

    const {
      name = 'Alex Johnson',
      handle = '@userhandle',
      avatar = 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200',
      text = "Just finished reading an amazing book on web development! 📚",
      timestamp = defaultTimestamp,
      width = 1000,
      height = null,
      format = 'png',
      verified = false,
      image = null
    } = body
    if (width > 2000 || (height && height > 2000)) {
      return new Response('Image dimensions too large', { status: 400 })
    }
    
    if (typeof text !== 'string' || text.length > 800) {
      return new Response('Text too long or invalid', { status: 400 })
    }

    const safeText = text.slice(0, 800)
    const safeName = typeof name === 'string' ? name.slice(0, 50) : 'Anonymous'
    const safeHandle = typeof handle === 'string' ? handle.slice(0, 20) : '@user'


    const baseHeight = 180 
    
    // Better text wrapping calculation
    const lines = safeText.split('\n')
    let totalLines = 0
    
    // Calculate wrapped lines for each line separately
    for (const line of lines) {
      if (line.trim() === '') {
        totalLines += 1 // Empty line still takes space
      } else {
        // More accurate character counting - account for font width differences
        const charsPerLine = 72 // Slightly more conservative estimate
        const lineWraps = Math.max(1, Math.ceil(line.length / charsPerLine))
        totalLines += lineWraps
      }
    }
    
    const estimatedLines = totalLines
    
    const lineHeight = 38  
    const baseBuffer = 32 
 
    const extraBuffer = Math.max(0, (estimatedLines - 3) * 8)
    
    // Add extra height for image if present
    const imageHeight = image ? 256 + 16 : 0 // 256px image + 16px margin
    
    const dynamicHeight = baseHeight + (estimatedLines * lineHeight) + baseBuffer + extraBuffer + imageHeight
    const finalHeight = height || dynamicHeight

    return new ImageResponse(
      (
        <div style={{
          width: '100%',
          background: '#ffffff',
          border: '2px solid #e5e7eb',
          borderRadius: 0,
          padding: 24,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          display: 'flex',
          flexDirection: 'column',
          fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial'
        }}>
          {/* Header */}
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            marginBottom: 16
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16
            }}>
              <img 
                src={avatar} 
                width={96} 
                height={96} 
                style={{
                  borderRadius: 9999, 
                  objectFit: 'cover', 
                  border: '2px solid #e5e7eb'
                }} 
              />
              <div style={{
                minWidth: 0,
                display: 'flex',
                flexDirection: 'column'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8
                }}>
                  <div style={{
                    fontWeight: 700, 
                    color: '#111827', 
                    fontSize: 32,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {safeName}
                  </div>
                  {verified && (
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="#3b82f6">
                      <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z" />
                    </svg>
                  )}
                </div>
                <div style={{
                  color: '#6b7280', 
                  fontSize: 28
                }}>
                  {safeHandle}
                </div>
              </div>
            </div>
            <div style={{
              color: '#3b82f6',
              display: 'flex'
            }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </div>
          </div>

          {/* Content */}
          <div style={{
            marginBottom: 16,
            display: 'flex'
          }}>
            <div style={{
              color: '#111827', 
              fontSize: 28, 
              lineHeight: 1.4,
              whiteSpace: 'pre-wrap'
            }}>
              {safeText}
            </div>
          </div>

          {/* Image section */}
          {image && (
            <div style={{
              marginBottom: 16,
              display: 'flex'
            }}>
              <div style={{
                borderRadius: 12,
                overflow: 'hidden',
                border: '2px solid #e5e7eb',
                width: '100%',
                display: 'flex'
              }}>
                <img 
                  src={image} 
                  style={{
                    width: '100%',
                    height: 256,
                    objectFit: 'cover'
                  }} 
                />
              </div>
            </div>
          )}

          {/* Timestamp */}
          <div style={{
            color: '#6b7280', 
            fontSize: 24,
            display: 'flex',
            marginBottom: 0
          }}>
            {timestamp}
          </div>
        </div>
      ),
      {
        width: width || 1000,
        height: finalHeight,
        headers: {
          'Cache-Control': 'public, max-age=3600, s-maxage=86400',
        }
      }
    )
  } catch (error) {
    console.error('Error generating image:', error)
    return new Response('Internal server error', { status: 500 })
  }
}

export async function GET() {
  return new Response(JSON.stringify({
    message: 'Tweet image generator API',
    usage: 'POST to this endpoint with JSON data',
    fields: {
      name: 'string (max 50 chars)',
      handle: 'string (max 20 chars)', 
      avatar: 'string (image URL)',
      text: 'string (max 800 chars)',
      timestamp: 'string',
      width: 'number (max 2000)',
      height: 'number (max 2000)',
      format: 'string (png or svg)',
      verified: 'boolean (show verified badge)',
      image: 'string (image URL, optional)'
    }
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  })
}
