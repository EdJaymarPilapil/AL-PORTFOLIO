import PortfolioClient from '../components/PortfolioClient';
import { supabase } from '../lib/supabase';
import { fallbackCoaching, fallbackEcosystem, fallbackDevelopers, fallbackCredentials, fallbackAwards, fallbackNews } from '../lib/mockData';
import { fetchNewsArticles } from '../lib/newsApi';

export const revalidate = 0;

export default async function Page() {
  const { data: coachingData } = await supabase.from('coaching').select('*').order('id', { ascending: true });
  const { data: credentialsData } = await supabase.from('credentials').select('*').order('id', { ascending: true });
  const { data: awardsData } = await supabase.from('awards').select('*').order('id', { ascending: true });
  
  const { data: eventsData } = await supabase.from('events').select('*').order('id', { ascending: false });
  const { data: testimonialsData } = await supabase.from('testimonials').select('*').order('id', { ascending: false });
  const { data: mediaData } = await supabase.from('media').select('*').order('id', { ascending: false });

  // Fetch news from HomeSPH News API instead of Supabase
  const newsData = await fetchNewsArticles();

  return (
    <main>
      <PortfolioClient 
        initialCoaching={coachingData || []}
        initialEvents={eventsData || []}
        initialTestimonials={testimonialsData || []}
        initialMedia={mediaData || []}
        initialCredentials={credentialsData || []}
        initialAwards={awardsData || []}
        initialNews={newsData || []}
      />
    </main>
  );
}
