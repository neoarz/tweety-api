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
      image = null,
      dark = false
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
    
    const isGif = image && typeof image === 'string' && image.toLowerCase().endsWith('.gif')
    
    // Get image dimensions to calculate proper height
    let imageDisplayHeight = 400 // increased default height for more space
    let imageAspectRatio = null
    
    if (image) {
      try {
        // Fetch image to get dimensions
        const imageResponse = await fetch(image)
        if (imageResponse.ok) {
          const imageBuffer = await imageResponse.arrayBuffer()
          const uint8Array = new Uint8Array(imageBuffer)
          
          // Simple dimension detection for common formats
          if (uint8Array[0] === 0xFF && uint8Array[1] === 0xD8) { // JPEG
            let i = 2
            while (i < uint8Array.length) {
              if (uint8Array[i] === 0xFF && (uint8Array[i + 1] === 0xC0 || uint8Array[i + 1] === 0xC2)) {
                const height = (uint8Array[i + 5] << 8) | uint8Array[i + 6]
                const width = (uint8Array[i + 7] << 8) | uint8Array[i + 8]
                imageAspectRatio = width / height
                break
              }
              i++
            }
          } else if (uint8Array[0] === 0x89 && uint8Array[1] === 0x50 && uint8Array[2] === 0x4E && uint8Array[3] === 0x47) { // PNG
            const width = (uint8Array[16] << 24) | (uint8Array[17] << 16) | (uint8Array[18] << 8) | uint8Array[19]
            const height = (uint8Array[20] << 24) | (uint8Array[21] << 16) | (uint8Array[22] << 8) | uint8Array[23]
            imageAspectRatio = width / height
          } else if (uint8Array[0] === 0x47 && uint8Array[1] === 0x49 && uint8Array[2] === 0x46) { // GIF
            const width = uint8Array[6] | (uint8Array[7] << 8)
            const height = uint8Array[8] | (uint8Array[9] << 8)
            imageAspectRatio = width / height
          }
          
          // Calculate display height based on aspect ratio
          if (imageAspectRatio) {
            const maxDisplayWidth = 952 // Available width in the tweet (1000 - 48px padding)
            imageDisplayHeight = Math.round(maxDisplayWidth / imageAspectRatio)

            imageDisplayHeight = Math.min(imageDisplayHeight, 800) // increased max height
            imageDisplayHeight = Math.max(imageDisplayHeight, 200) // increased min height
          }
        }
      } catch (error) {
        console.log('Could not fetch image dimensions, using default height')
      }
    }


    const baseHeight = 180 
    
    // Better text wrapping calculation
    let totalLines = 0
    
    if (safeText.trim() === '') {
    
      totalLines = 0
    } else {
      const lines = safeText.split('\n')
      
      
      for (const line of lines) {
        if (line.trim() === '') {
          totalLines += 1 
        } else {
          
          const charsPerLine = 72 
          const lineWraps = Math.max(1, Math.ceil(line.length / charsPerLine))
          totalLines += lineWraps
        }
      }
    }
    
    const estimatedLines = totalLines
    
    const lineHeight = 40  
    const baseBuffer = 32 
 
    const extraBuffer = Math.max(0, (estimatedLines - 3) * 8)
    
    const imageHeight = image ? imageDisplayHeight + 24 : 0 // increased padding for images
    
    const dynamicHeight = baseHeight + (estimatedLines * lineHeight) + baseBuffer + extraBuffer + imageHeight
    const finalHeight = height || dynamicHeight

    // Theme colors - Updated to new Twitter dark theme
    const bgColor = dark ? '#000000' : '#ffffff'
    const textColor = dark ? '#e7e9ea' : '#0f1419'
    const subTextColor = dark ? '#71767b' : '#536471'
    const avatarBorder = dark ? '#2f3336' : '#cfd9de'
    const twitterBlue = '#1d9bf0'

    return new ImageResponse(
      (
        <div style={{
          width: '100%',
          background: bgColor,
          padding: 24,
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
                  border: `3px solid ${avatarBorder}`
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
                      color: textColor, 
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
                    color: subTextColor, 
                    fontSize: 28
                  }}>
                    {safeHandle}
                  </div>
              </div>
            </div>
            <div style={{
              color: twitterBlue,
              display: 'flex'
            }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </div>
          </div>

          {/* Content */}
          {safeText.trim() && (
            <div style={{
              marginBottom: 16,
              display: 'flex'
            }}>
              <div style={{
                color: textColor, 
                fontSize: 28, 
                lineHeight: 1.4,
                whiteSpace: 'pre-wrap'
              }}>
                {safeText}
              </div>
            </div>
          )}

          {/* Image section */}
          {image && (
            <div style={{
              marginBottom: 16,
              display: 'flex'
            }}>
              <div style={{
                borderRadius: 12,
                overflow: 'hidden',
                width: '100%',
                display: 'flex',
                position: 'relative'
              }}>
                  <img 
                    src={image} 
                    style={{
                      width: '100%',
                      height: imageDisplayHeight,
                      objectFit: 'contain'
                    }} 
                  />
              </div>
            </div>
          )}


          {/* Timestamp */}
          <div style={{
            color: subTextColor, 
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
      image: 'string (image URL, optional - GIFs will show preview + link)',
      dark: 'boolean (enable dark theme)'
    }
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  })
}
