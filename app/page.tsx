import PortfolioClient from '../components/PortfolioClient';
import { supabase } from '../lib/supabase';
import { fallbackCoaching, fallbackEcosystem, fallbackDevelopers, fallbackCredentials, fallbackAwards } from '../lib/mockData';

export const revalidate = 0;

export default async function Page() {
  const { data: coachingData } = await supabase.from('coaching_cards').select('*');
  const { data: ecosystemData } = await supabase.from('ecosystem_companies').select('*');
  const { data: devsData } = await supabase.from('developers').select('*');
  const { data: credentialsData } = await supabase.from('credentials').select('*');
  const { data: awardsData } = await supabase.from('awards').select('*');

  const activeCoaching = coachingData && coachingData.length > 0 
    ? coachingData 
    : fallbackCoaching;
  const activeEcosystem = ecosystemData && ecosystemData.length > 0 
    ? ecosystemData 
    : fallbackEcosystem;
  const activeDevs = devsData && devsData.length > 0 
    ? devsData 
    : fallbackDevelopers;
  const activeCredentials = credentialsData && credentialsData.length > 0 
    ? [...fallbackCredentials, ...credentialsData] 
    : fallbackCredentials;
  const activeAwards = awardsData && awardsData.length > 0 
    ? [...fallbackAwards, ...awardsData] 
    : fallbackAwards;

  return (
    <main>
      <PortfolioClient 
        initialCoaching={activeCoaching}
        initialEcosystem={activeEcosystem}
        initialDevelopers={activeDevs}
        initialCredentials={activeCredentials}
        initialAwards={activeAwards}
      />
    </main>
  );
}
