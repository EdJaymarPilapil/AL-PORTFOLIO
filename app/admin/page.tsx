"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import '../../admin.css';

export default function AdminDashboard() {
  const [session, setSession] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('tab-coaching');
  const [loading, setLoading] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const router = useRouter();

  useEffect(() => {
    console.log('Checking session...');
    const checkSession = async () => {
        try {
            const { data: { session }, error } = await supabase.auth.getSession();
            if (error) throw error;
            
            if (!session) {
                console.log('No session found, redirecting to login...');
                router.push('/login');
            } else {
                console.log('Session active:', session.user.email);
                setSession(session);
            }
        } catch (err) {
            console.error('Session check error:', err);
            router.push('/login');
        } finally {
            setAuthChecked(true);
        }
    };

    checkSession();

    // Fallback timeout: if still loading after 3 seconds, show fallback
    const timer = setTimeout(() => {
        if (!authChecked) {
            console.log('Auth check taking too long, showing fallback UI');
            setAuthChecked(true);
        }
    }, 3000);

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session?.user?.email);
      if (event === 'SIGNED_IN' && session) {
        setSession(session);
      }
      if (event === 'SIGNED_OUT') {
        router.push('/login');
      }
    });

    return () => {
        subscription.unsubscribe();
        clearTimeout(timer);
    };
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const uploadImage = async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `uploads/${fileName}`;

    const { error: uploadError } = await supabase.storage.from('portfolio_images').upload(filePath, file);
    if (uploadError) {
        console.error('Storage Upload Error:', uploadError);
        throw new Error(`Storage Error: ${uploadError.message}`);
    }

    const { data } = supabase.storage.from('portfolio_images').getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handleCoaching = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
        const file = e.target['c-image'].files[0];
        const publicUrl = await uploadImage(file);
        
        const { data: { user } } = await supabase.auth.getUser();
        console.log('Current user before insert:', user);
        
        const { error } = await supabase.from('coaching_cards').insert([{
            id: crypto.randomUUID(),
            image_url: publicUrl,
            badge_text: e.target['c-badge'].value,
            title: e.target['c-title'].value,
            sort_order: parseInt(e.target['c-sort'].value),
            description: e.target['c-desc'].value
        }]);
        if (error) throw error;
        alert('Published Coaching Card successfully!');
        e.target.reset();
    } catch(err: any) { 
        console.error('RLS/DB Error:', err);
        alert(`Error: ${err.message}\nDetail: ${err.details || 'None'}\nHint: ${err.hint || 'None'}`); 
    }
    setLoading(false);
  };

  const handleEcosystem = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
        const file = e.target['e-image'].files[0];
        const publicUrl = await uploadImage(file);
        
        const { data: { user } } = await supabase.auth.getUser();
        console.log('Current user before insert:', user);

        const { error } = await supabase.from('ecosystem_companies').insert([{
            id: crypto.randomUUID(),
            logo_url: publicUrl,
            name: e.target['e-name'].value,
            website_url: e.target['e-url'].value,
            sort_order: parseInt(e.target['e-sort'].value),
            description: e.target['e-desc'].value
        }]);
        if (error) throw error;
        alert('Published Ecosystem Company successfully!');
        e.target.reset();
    } catch(err: any) { 
        console.error('RLS/DB Error:', err);
        alert(`Error: ${err.message}\nDetail: ${err.details || 'None'}\nHint: ${err.hint || 'None'}`); 
    }
    setLoading(false);
  };

  const handleDevelopers = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
        const file = e.target['d-image'].files[0];
        const publicUrl = await uploadImage(file);
        
        const { data: { user } } = await supabase.auth.getUser();
        console.log('Current user before insert:', user);

        const { error } = await supabase.from('developers').insert([{
            id: crypto.randomUUID(),
            logo_url: publicUrl,
            name: e.target['d-name'].value,
            website_url: e.target['d-url'].value,
            sort_order: parseInt(e.target['d-sort'].value)
        }]);
        if (error) throw error;
        alert('Published Developer successfully!');
        e.target.reset();
    } catch(err: any) { 
        console.error('RLS/DB Error:', err);
        alert(`Error: ${err.message}\nDetail: ${err.details || 'None'}\nHint: ${err.hint || 'None'}`); 
    }
    setLoading(false);
  };

  const handleCredentials = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
        const { data: { user } } = await supabase.auth.getUser();
        console.log('Current user before insert:', user);

        const { error } = await supabase.from('credentials').insert([{
            id: crypto.randomUUID(),
            institution: e.target['cred-institution'].value,
            title: e.target['cred-title'].value,
            organization: e.target['cred-org'].value,
            category: e.target['cred-category'].value
        }]);
        if (error) throw error;
        alert('Published Credential successfully!');
        e.target.reset();
    } catch(err: any) { 
        console.error('RLS/DB Error:', err);
        alert(`Error: ${err.message}\nDetail: ${err.details || 'None'}\nHint: ${err.hint || 'None'}`); 
    }
    setLoading(false);
  };

  const handleAwards = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
        const { data: { user } } = await supabase.auth.getUser();
        console.log('Current user before insert:', user);

        const { error } = await supabase.from('awards').insert([{
            id: crypto.randomUUID(),
            title: e.target['award-title'].value,
            organization: e.target['award-org'].value,
            year: e.target['award-year'].value,
            icon: e.target['award-icon'].value
        }]);
        if (error) throw error;
        alert('Published Award successfully!');
        e.target.reset();
    } catch(err: any) { 
        console.error('RLS/DB Error:', err);
        alert(`Error: ${err.message}\nDetail: ${err.details || 'None'}\nHint: ${err.hint || 'None'}`); 
    }
    setLoading(false);
  };

  if (!session) {
    return (
        <div style={{ background: 'var(--bg)', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
            <div className="overline">Security Check</div>
            <div style={{ fontSize: '18px' }}>{authChecked ? 'Access Denied or Session Expired' : 'Connecting to Server...'}</div>
            {!authChecked && <div className="loading-spinner" style={{ width: '40px', height: '40px', border: '3px solid var(--border)', borderTopColor: 'var(--gold)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>}
            {authChecked && (
                <button onClick={() => router.push('/login')} className="big-btn" style={{ padding: '12px 24px', cursor: 'pointer' }}>
                    Go to Login Page
                </button>
            )}
            <style jsx>{`
                @keyframes spin { to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
  }

  return (
    <div className="admin-container">
        <div className="dash-header">
            <div>
                <span className="overline">Control Panel</span>
                <h2 style={{margin:0}}>Dashboard</h2>
            </div>
            <div style={{display:'flex', alignItems:'center', gap:'24px'}}>
                <span style={{color:'var(--gray)', fontSize:'14px'}}>{session.user.email}</span>
                <button onClick={handleLogout} className="text-link" style={{background:'transparent', borderTop:'none', borderLeft:'none', borderRight:'none', cursor:'pointer'}}>Disconnect →</button>
            </div>
        </div>
        
        <div className="tabs">
            <button className={`tab-btn ${activeTab === 'tab-coaching' ? 'active' : ''}`} onClick={() => setActiveTab('tab-coaching')}>
                <span className="tab-icon">🎯</span>
                Coaching Grid
            </button>
            <button className={`tab-btn ${activeTab === 'tab-ecosystem' ? 'active' : ''}`} onClick={() => setActiveTab('tab-ecosystem')}>
                <span className="tab-icon">🏢</span>
                Ecosystem Panel
            </button>
            <button className={`tab-btn ${activeTab === 'tab-developers' ? 'active' : ''}`} onClick={() => setActiveTab('tab-developers')}>
                <span className="tab-icon">🤝</span>
                Dev Partners
            </button>

            <button className={`tab-btn ${activeTab === 'tab-credentials' ? 'active' : ''}`} onClick={() => setActiveTab('tab-credentials')}>
                <span className="tab-icon">🎓</span>
                Education
            </button>
            <button className={`tab-btn ${activeTab === 'tab-awards' ? 'active' : ''}`} onClick={() => setActiveTab('tab-awards')}>
                <span className="tab-icon">🏆</span>
                Awards
            </button>
        </div>

        {activeTab === 'tab-coaching' && (
        <div className="tab-content">
            <h3>Add Coaching Card</h3>
            <p style={{color:'var(--gray)', fontSize:'13px', marginBottom:'24px'}}>Automatically uploads image and pushes layout to frontend grid.</p>
            <form onSubmit={handleCoaching} className="admin-form connect-form" style={{maxWidth:'100%'}}>
                <div className="form-row">
                    <input type="file" id="c-image" accept="image/*" required style={{paddingTop:'12px'}} />
                    <input type="text" id="c-badge" placeholder="Badge Text (e.g. Pillar 01)" required />
                </div>
                <div className="form-row">
                    <input type="text" id="c-title" placeholder="Title" required />
                    <input type="number" id="c-sort" placeholder="Sort Order" defaultValue="0" required />
                </div>
                <textarea id="c-desc" placeholder="Card Description" required style={{height:'80px'}}></textarea>
                <button type="submit" className="big-btn" disabled={loading} style={{border:'none', cursor:'pointer', opacity: loading ? 0.7 : 1}}>
                    {loading ? 'Uploading...' : 'Publish Coaching Card'}
                </button>
            </form>
        </div>
        )}

        {activeTab === 'tab-ecosystem' && (
        <div className="tab-content">
            <h3>Add Ecosystem Company</h3>
            <p style={{color:'var(--gray)', fontSize:'13px', marginBottom:'24px'}}>Appears in the horizontal snapping scroll section.</p>
            <form onSubmit={handleEcosystem} className="admin-form connect-form" style={{maxWidth:'100%'}}>
                <div className="form-row">
                    <input type="file" id="e-image" accept="image/*" required style={{paddingTop:'12px'}} />
                    <input type="text" id="e-name" placeholder="Company Name" required />
                </div>
                <div className="form-row">
                    <input type="url" id="e-url" placeholder="Website URL (https://...)" required />
                    <input type="number" id="e-sort" placeholder="Sort Order" defaultValue="0" required />
                </div>
                <textarea id="e-desc" placeholder="Company Description" required style={{height:'80px'}}></textarea>
                <button type="submit" className="big-btn" disabled={loading} style={{border:'none', cursor:'pointer', opacity: loading ? 0.7 : 1}}>
                    {loading ? 'Uploading...' : 'Publish Ecosystem'}
                </button>
            </form>
        </div>
        )}

        {activeTab === 'tab-developers' && (
        <div className="tab-content">
            <h3>Add Trusted Developer</h3>
            <p style={{color:'var(--gray)', fontSize:'13px', marginBottom:'24px'}}>Appears in the grid and marquee tracking strip.</p>
            <form onSubmit={handleDevelopers} className="admin-form connect-form" style={{maxWidth:'100%'}}>
                <div className="form-row">
                    <input type="file" id="d-image" accept="image/*" required style={{paddingTop:'12px'}} />
                    <input type="text" id="d-name" placeholder="Developer Name" required />
                </div>
                <div className="form-row">
                    <input type="url" id="d-url" placeholder="Website URL (https://...)" required />
                    <input type="number" id="d-sort" placeholder="Sort Order" defaultValue="0" required />
                </div>
                <button type="submit" className="big-btn" disabled={loading} style={{border:'none', cursor:'pointer', opacity: loading ? 0.7 : 1}}>
                    {loading ? 'Uploading...' : 'Publish Developer'}
                </button>
            </form>
        </div>
        )}



        {activeTab === 'tab-credentials' && (
        <div className="tab-content">
            <h3>Add Education Credential</h3>
            <p style={{color:'var(--gray)', fontSize:'13px', marginBottom:'24px'}}>Appears in the Executive Credentials section.</p>
            <form onSubmit={handleCredentials} className="admin-form connect-form" style={{maxWidth:'100%'}}>
                <div className="form-row">
                    <input type="text" id="cred-institution" placeholder="Institution (e.g. Harvard, MIT, Oxford)" required />
                    <select id="cred-category" required style={{padding:'12px', background:'var(--card)', border:'1px solid var(--border)', color:'white', borderRadius:'8px'}}>
                        <option value="">Select Category</option>
                        <option value="harvard">Harvard</option>
                        <option value="other">Other Institutions</option>
                    </select>
                </div>
                <div className="form-row">
                    <input type="text" id="cred-title" placeholder="Credential Title (e.g. Disruptive Strategy)" required />
                    <input type="text" id="cred-org" placeholder="Organization & Year (e.g. Harvard Business School Online — 2025)" required />
                </div>
                <button type="submit" className="big-btn" disabled={loading} style={{border:'none', cursor:'pointer', opacity: loading ? 0.7 : 1}}>
                    {loading ? 'Saving...' : 'Publish Credential'}
                </button>
            </form>
        </div>
        )}

        {activeTab === 'tab-awards' && (
        <div className="tab-content">
            <h3>Add Award / Recognition</h3>
            <p style={{color:'var(--gray)', fontSize:'13px', marginBottom:'24px'}}>Appears in the Awards & Recognition wall.</p>
            <form onSubmit={handleAwards} className="admin-form connect-form" style={{maxWidth:'100%'}}>
                <div className="form-row">
                    <input type="text" id="award-title" placeholder="Award Title (e.g. Entrepreneur of the Year)" required />
                    <input type="text" id="award-icon" placeholder="Icon (e.g. 🏆, 💎, 🎖️)" required />
                </div>
                <div className="form-row">
                    <input type="text" id="award-org" placeholder="Awarding Organization" required />
                    <input type="text" id="award-year" placeholder="Year (e.g. 2024)" required />
                </div>
                <button type="submit" className="big-btn" disabled={loading} style={{border:'none', cursor:'pointer', opacity: loading ? 0.7 : 1}}>
                    {loading ? 'Saving...' : 'Publish Award'}
                </button>
            </form>
        </div>
        )}

    </div>
  );
}
