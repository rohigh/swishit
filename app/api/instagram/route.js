import { NextResponse } from 'next/server';

const FALLBACK_INSTAGRAM_POSTS = [
  {
    id: 'post-1',
    image: '/img/ocean garden edited.png',
    text: 'Ocean Garden Dew',
    permalink: 'https://instagram.com',
  },
  {
    id: 'post-2',
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
    text: 'Aesthetic Kitchen Counter',
    permalink: 'https://instagram.com',
  },
  {
    id: 'post-3',
    image: '/img/lime lush edited.png',
    text: 'Lime Lush Dew',
    permalink: 'https://instagram.com',
  },
  {
    id: 'post-4',
    image: 'https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?auto=format&fit=crop&w=800&q=80',
    text: 'Plant-Powered Chemistry',
    permalink: 'https://instagram.com',
  },
  {
    id: 'post-5',
    image: '/img/lemon edited.png',
    text: 'Lemon Loop Dew',
    permalink: 'https://instagram.com',
  },
  {
    id: 'post-6',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80',
    text: 'Glass Pump Bottle',
    permalink: 'https://instagram.com',
  },
];

export async function GET() {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;

  if (!token) {
    return NextResponse.json({
      success: true,
      source: 'fallback',
      items: FALLBACK_INSTAGRAM_POSTS,
    });
  }

  try {
    let fetchUrl = token;
    if (!token.startsWith('http://') && !token.startsWith('https://')) {
      if (token.length < 30 && !token.startsWith('IGQJ')) {
        fetchUrl = `https://feeder.behold.so/v1/get/${token}`;
      } else {
        fetchUrl = `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url&access_token=${token}&limit=12`;
      }
    }

    const res = await fetch(fetchUrl, { next: { revalidate: 300 } });

    if (!res.ok) {
      throw new Error(`Instagram API responded with status ${res.status}`);
    }

    const data = await res.json();
    const rawItems = data.posts || data.data || (Array.isArray(data) ? data : []);

    if (!rawItems || rawItems.length === 0) {
      throw new Error('No Instagram posts found in feed response');
    }

    const formattedPosts = rawItems.map((item, idx) => {
      // Prioritize behold.pictures CDN URLs to bypass CORS restrictions in WebGL
      const imageUrl =
        item.sizes?.medium?.mediaUrl ||
        item.sizes?.large?.mediaUrl ||
        item.sizes?.small?.mediaUrl ||
        item.thumbnailUrl ||
        item.thumbnail_url ||
        item.mediaUrl ||
        item.media_url;

      const captionText = item.prunedCaption
        ? item.prunedCaption.split('\n')[0].substring(0, 30)
        : item.caption
        ? item.caption.split('\n')[0].substring(0, 30)
        : `Swish It Post ${idx + 1}`;

      return {
        id: item.id || `post-${idx}`,
        image: imageUrl || FALLBACK_INSTAGRAM_POSTS[idx % FALLBACK_INSTAGRAM_POSTS.length].image,
        text: captionText,
        permalink: item.permalink || item.prerenderedUrl || 'https://instagram.com',
      };
    });

    return NextResponse.json({
      success: true,
      source: 'live',
      items: formattedPosts,
    });
  } catch (error) {
    console.error('Failed to fetch live Instagram posts:', error);
    return NextResponse.json({
      success: true,
      source: 'fallback_error',
      items: FALLBACK_INSTAGRAM_POSTS,
    });
  }
}
