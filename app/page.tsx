import PortfolioClient from '../components/PortfolioClient';
import { supabase } from '../lib/supabase';
import { fallbackCoaching, fallbackEcosystem, fallbackDevelopers, fallbackNews, fallbackCredentials, fallbackAwards } from '../lib/mockData';

export const revalidate = 0;

export default async function Page() {
  const { data: coachingData } = await supabase.from('coaching_cards').select('*').order('sort_order', { ascending: true });
  const { data: ecosystemData } = await supabase.from('ecosystem_companies').select('*').order('sort_order', { ascending: true });
  const { data: devsData } = await supabase.from('developers').select('*').order('sort_order', { ascending: true });
  const { data: newsData } = await supabase.from('news_articles').select('*').order('published_date', { ascending: false });
  const { data: credentialsData } = await supabase.from('credentials').select('*').order('year', { ascending: false });
  const { data: awardsData } = await supabase.from('awards').select('*').order('year', { ascending: false });

  const activeCoaching = coachingData && coachingData.length > 0 ? coachingData : fallbackCoaching;
  const activeEcosystem = ecosystemData && ecosystemData.length > 0 ? ecosystemData : fallbackEcosystem;
  const activeDevs = devsData && devsData.length > 0 ? devsData : fallbackDevelopers;
  const activeNews = newsData && newsData.length > 0 ? newsData : fallbackNews;
  const activeCredentials = credentialsData && credentialsData.length > 0 ? credentialsData : fallbackCredentials;
  const activeAwards = awardsData && awardsData.length > 0 ? awardsData : fallbackAwards;

  return (
    <main>
      <PortfolioClient 
        initialCoaching={activeCoaching}
        initialEcosystem={activeEcosystem}
        initialDevelopers={activeDevs}
        initialNews={activeNews}
        initialCredentials={activeCredentials}
        initialAwards={activeAwards}
      />
    </main>
  );
}
