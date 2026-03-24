import PortfolioClient from '../components/PortfolioClient';
import { supabase } from '../lib/supabase';
import { fallbackCoaching, fallbackEcosystem, fallbackDevelopers, fallbackNews } from '../lib/mockData';

export const revalidate = 0; // Dynamic server rendering to always get fresh data

export default async function Page() {
  // SSR Backend Fetching
  const { data: coachingData } = await supabase.from('coaching_cards').select('*').order('sort_order', { ascending: true });
  const { data: ecosystemData } = await supabase.from('ecosystem_companies').select('*').order('sort_order', { ascending: true });
  const { data: devsData } = await supabase.from('developers').select('*').order('sort_order', { ascending: true });
  const { data: newsData } = await supabase.from('news_articles').select('*').order('published_date', { ascending: false });

  // Use fallback data if tables are empty
  const activeCoaching = coachingData && coachingData.length > 0 ? coachingData : fallbackCoaching;
  const activeEcosystem = ecosystemData && ecosystemData.length > 0 ? ecosystemData : fallbackEcosystem;
  const activeDevs = devsData && devsData.length > 0 ? devsData : fallbackDevelopers;
  const activeNews = newsData && newsData.length > 0 ? newsData : fallbackNews;

  return (
    <main>
      <PortfolioClient 
        initialCoaching={activeCoaching}
        initialEcosystem={activeEcosystem}
        initialDevelopers={activeDevs}
        initialNews={activeNews}
      />
    </main>
  );
}
