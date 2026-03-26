/**
 * HomeSPH News API integration
 * Fetches real news articles using the X-Site-Api-Key header
 * Guide: https://github.com/HomesPh/HomesPhNews/blob/main/docs/EXTERNAL_API_GUIDE.md
 */

interface NewsArticle {
  id: string;
  image_url: string;
  tag: string;
  title: string;
  published_date: string;
  description: string;
  link?: string;
}

export async function fetchNewsArticles(): Promise<NewsArticle[]> {
  const apiUrl = process.env.HOMESPH_NEWS_API_URL;
  const apiKey = process.env.HOMESPH_NEWS_API_KEY;

  if (!apiUrl || !apiKey) {
    console.warn('[News API] Missing HOMESPH_NEWS_API_URL or HOMESPH_NEWS_API_KEY env vars');
    return [];
  }

  try {
    const res = await fetch(apiUrl, {
      headers: {
        'X-Site-Api-Key': apiKey,
        'Accept': 'application/json',
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!res.ok) {
      console.error(`[News API] HTTP ${res.status}: ${res.statusText}`);
      return [];
    }

    const json = await res.json();

    // Response structure per API guide: { site: {...}, data: { data: [...articles] } }
    const articles: any[] = json?.data?.data || json?.data || (Array.isArray(json) ? json : []);

    if (!Array.isArray(articles) || articles.length === 0) {
      console.warn('[News API] No articles returned:', JSON.stringify(json).substring(0, 300));
      return [];
    }

    console.log('[News API] Fetched', articles.length, 'articles');
    console.log('[News API] Sample keys:', Object.keys(articles[0]));

    return articles.map((article: any, index: number) => ({
      id: String(article.id || article._id || index + 1),
      image_url: article.image_url || article.imageUrl || article.image || article.thumbnail || article.cover_image || '',
      tag: article.tag || article.category || article.type || 'News',
      title: article.title || article.headline || 'Untitled',
      published_date: formatDate(article.published_date || article.publishedDate || article.date || article.created_at || article.createdAt || ''),
      description: article.description || article.excerpt || article.summary || article.content?.substring(0, 150) || '',
      link: article.link || article.url || article.slug || '',
    }));
  } catch (error) {
    console.error('[News API] Fetch failed:', error);
    return [];
  }
}

function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}
