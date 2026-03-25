import PortfolioClient from '../components/PortfolioClient';
import { supabase } from '../lib/supabase';
import { fallbackCoaching, fallbackEcosystem, fallbackDevelopers, fallbackCredentials, fallbackAwards, fallbackNews } from '../lib/mockData';

export const revalidate = 0;

export default async function Page() {
  const { data: coachingData } = await supabase.from('coaching').select('*');
  const { data: ecosystemData } = await supabase.from('companies').select('*');
  const { data: devsData } = await supabase.from('developers').select('*');
  const { data: credentialsData } = await supabase.from('credentials').select('*');
  const { data: awardsData } = await supabase.from('awards').select('*');
  const { data: newsData } = await supabase.from('news_articles').select('*');

  const mergeData = (fallback: any[], supabaseData: any[] | null, key: string) => {
    if (!supabaseData || supabaseData.length === 0) return fallback;
    
    // Create a map of titles/names from supabase data to check for duplicates
    const supabaseKeys = new Set(supabaseData.map(item => item[key]));
    
    // Filter fallback data to only include items NOT in supabase
    const filteredFallback = fallback.filter(item => !supabaseKeys.has(item[key]));
    
    return [...filteredFallback, ...supabaseData];
  };

  const activeCoaching = mergeData(fallbackCoaching, coachingData, 'title');
  const activeEcosystem = mergeData(fallbackEcosystem, ecosystemData, 'name');
  const activeDevs = mergeData(fallbackDevelopers, devsData, 'name');
  const activeCredentials = mergeData(fallbackCredentials, credentialsData, 'title');
  const activeAwards = mergeData(fallbackAwards, awardsData, 'title');
  const activeNews = mergeData(fallbackNews, newsData, 'title');

  return (
    <main>
      <PortfolioClient 
        initialCoaching={activeCoaching}
        initialEcosystem={activeEcosystem}
        initialDevelopers={activeDevs}
        initialCredentials={activeCredentials}
        initialAwards={activeAwards}
        initialNews={activeNews}
      />
    </main>
  );
}
