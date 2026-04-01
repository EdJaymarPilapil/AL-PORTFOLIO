import { supabase } from '../../../lib/supabase';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export const revalidate = 0;

export default async function EventDetailPage({ params }: { params: { id: string } }) {
  const { data: event, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', params.id)
    .single();

  if (error || !event) {
    return notFound();
  }

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg, #0a0a0a)', color: '#fff', padding: '0' }}>
      {/* Navigation Bar */}
      <nav style={{ padding: '2rem 5%', position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/#events" style={{ color: '#fff', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500, fontSize: '1.1rem', background: 'rgba(255,255,255,0.05)', padding: '12px 24px', borderRadius: '50px', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }}>
          ← Back to Portfolio
        </Link>
      </nav>

      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        
        {/* Dynamic Hero Section */}
        <section style={{ position: 'relative', width: '100%', minHeight: '40vh', background: '#111', display: 'flex', alignItems: 'flex-end', padding: '8rem 5% 4rem 5%', overflow: 'hidden' }}>
          {event.image_url && (
            <>
              {/* Blurred Background Image */}
              <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${event.image_url})`, backgroundSize: 'cover', backgroundPosition: 'center', filter: 'blur(40px)', opacity: 0.25, transform: 'scale(1.1)' }}></div>
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, var(--bg, #0a0a0a) 0%, transparent 100%)' }}></div>
            </>
          )}
          
          <div style={{ position: 'relative', zIndex: 2, maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
            <span style={{ color: 'var(--gold, #c9a84c)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '3px', fontSize: '1rem', display: 'block', marginBottom: '1rem' }}>{event.event_date}</span>
            <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', fontWeight: '300', margin: '0 0 1rem 0', fontFamily: 'var(--serif, "DM Serif Display", serif)', lineHeight: '1.1' }}>{event.title}</h1>
          </div>
        </section>

        {/* Content Section */}
        <section style={{ padding: '4rem 5%', flex: 1, position: 'relative', zIndex: 2 }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            
            <div style={{ display: 'flex', gap: '4rem', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-start' }}>
              
              {/* Large Poster View */}
              {event.image_url ? (
                <div style={{ flex: '1 1 400px', maxWidth: '500px', width: '100%' }}>
                  <img src={event.image_url} alt={event.title} style={{ width: '100%', borderRadius: '24px', boxShadow: '0 20px 60px rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)' }} />
                </div>
              ) : (
                <div style={{ flex: '1 1 400px', maxWidth: '500px', width: '100%', height: '600px', background: 'linear-gradient(135deg, rgba(201,168,76,0.1) 0%, rgba(0,0,0,0.6) 100%)', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ opacity: 0.3, textTransform: 'uppercase', letterSpacing: '2px', fontSize: '14px' }}>Event Poster Pending</span>
                </div>
              )}
              
              {/* Event Details Text */}
              <div style={{ flex: '2 1 500px' }}>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem', color: 'rgba(255,255,255,0.9)' }}>About the Event</h3>
                <p style={{ fontSize: '1.2rem', lineHeight: '1.8', color: 'rgba(255,255,255,0.7)', whiteSpace: 'pre-wrap' }}>
                  {event.description}
                </p>
                
                <div style={{ marginTop: '3rem', paddingTop: '3rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                  <h4 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', color: 'rgba(255,255,255,0.9)' }}>Event Details</h4>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1.2rem', color: 'rgba(255,255,255,0.6)' }}>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span style={{ color: 'var(--gold, #c9a84c)', fontSize: '1.2rem' }}>📅</span>
                      <span style={{ fontSize: '1.1rem' }}>Scheduled for: {event.event_date}</span>
                    </li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span style={{ color: 'var(--gold, #c9a84c)', fontSize: '1.2rem' }}>📍</span>
                      <span style={{ fontSize: '1.1rem' }}>Location details provided upon registration.</span>
                    </li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span style={{ color: 'var(--gold, #c9a84c)', fontSize: '1.2rem' }}>👥</span>
                      <span style={{ fontSize: '1.1rem' }}>Featuring: Anthony Leuterio</span>
                    </li>
                  </ul>
                  
                  <div style={{ marginTop: '3rem' }}>
                    <a href="mailto:contact@filipinohomes.com?subject=Enquiry:%20Event%20Registration" style={{ display: 'inline-block', background: 'linear-gradient(135deg, var(--gold, #c9a84c) 0%, #b8922e 100%)', color: '#0a0a0a', textDecoration: 'none', padding: '16px 36px', borderRadius: '50px', fontSize: '1.1rem', fontWeight: 'bold' }}>
                      Request Invitation
                    </a>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

      </div>
    </main>
  );
}
