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
    // Fetch all public articles (the small pool of 10-20 latest news)
    const fetchUrl = `${apiUrl}${apiUrl.includes('?') ? '&' : '?'}per_page=12`;
    
    console.log(`[News API] Fetching from: ${fetchUrl}`);

    const res = await fetch(fetchUrl, {
      headers: {
        'X-Site-Key': apiKey, // Optional for public, but good for identification
        'Accept': 'application/json',
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!res.ok) {
      console.error(`[News API] HTTP ${res.status}: ${res.statusText}`);
      return [];
    }

    const json = await res.json();

    // Public API structure: { data: { data: [articles...] } }
    let rawArticles: any[] = json?.data?.data || json?.data || (Array.isArray(json) ? json : []);

    if (!Array.isArray(rawArticles) || rawArticles.length === 0) {
      console.warn('[News API] No articles returned:', JSON.stringify(json).substring(0, 300));
      return [];
    }

    // Filter for Real Estate, Business, or related news
    const relevantCategories = ['Real Estate', 'Business & Economy', 'Housing', 'Labor & Employment'];
    let filtered = rawArticles.filter((a: any) => {
      const cat = a.category?.name || a.category || '';
      return relevantCategories.includes(cat);
    });

    // If we have nothing after filtering, just use the latest raw articles
    const finalArticles = filtered.length > 0 ? filtered : rawArticles;

    return finalArticles.slice(0, 3).map((article: any, index: number) => {
      const id = String(article.id || article.article_id || index + 1);
      const title = article.title || article.headline || 'Untitled Article';
      
      // Handle Date
      const dateStr = article.published_at || article.created_at || article.date;
      const published_date = formatDate(dateStr);
      
      // Handle Image
      const image_url = article.image_url || article.image || article.thumbnail || '/images/news-placeholder.jpg';
      
      // Handle Tag
      const tag = article.category?.name || article.category || 'News';
      
      // Handle Description
      const description = article.summary || article.description || article.excerpt || '';
      
      // Handle Link/URL
      let link = article.url || article.link || article.original_url || article.slug || '';
      if (link && !link.startsWith('http')) {
        // If it's a slug, construct the full URL
        link = `https://news.homes.ph/article/${link}`;
      }
      
      return { id, title, published_date, image_url, tag, description, link };
    });
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
