"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import gsap from 'gsap';

export default function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [setupComplete, setSetupComplete] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('admin_setup_complete');
    setSetupComplete(stored === 'true');
    
    // GSAP Pop-up Animation
    if (formRef.current) {
      gsap.fromTo(formRef.current, 
        { 
          opacity: 0, 
          scale: 0.8,
          y: 20
        }, 
        { 
          opacity: 1, 
          scale: 1, 
          y: 0,
          duration: 0.8, 
          ease: 'power4.out',
          delay: 0.2
        }
      );
    }
    
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        console.log('Session detected, redirecting to admin...');
        localStorage.setItem('admin_setup_complete', 'true');
        setSetupComplete(true);
        router.push('/admin');
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN' && session) {
            console.log('User signed in:', session.user.email);
            router.push('/admin');
        }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
        console.error('Login error:', error.message);
        setError(error.message);
    } else {
        console.log('Login successful');
        localStorage.setItem('admin_setup_complete', 'true');
        router.push('/admin');
    }
    setLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    const { data, error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        data: { role: 'admin' }
      }
    });
    
    if (error) {
        console.error('Signup error:', error.message);
        setError(error.message);
    } else {
        console.log('Signup initiated');
        localStorage.setItem('admin_setup_complete', 'true');
        setSetupComplete(true);
        if (data.session) {
          router.push('/admin');
        } else {
          setSuccess('Account created! Check your email to confirm, then sign in.');
          setIsSignUp(false);
        }
        setPassword('');
        setConfirmPassword('');
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg2)' }}>
      <form ref={formRef} onSubmit={isSignUp ? handleSignUp : handleLogin} style={{ background: 'var(--card)', padding: '40px', borderRadius: '16px', border: '1px solid var(--border)', width: '100%', maxWidth: '400px' }}>
        <h2 style={{ fontSize: '28px', marginBottom: '24px', fontFamily: 'var(--serif)', color: 'var(--gold)' }}>Admin <em>{isSignUp ? 'Sign Up' : 'Login'}</em></h2>
        {error && <div style={{ color: '#ff6b6b', marginBottom: '16px', fontSize: '14px', padding: '10px', background: 'rgba(255,0,0,0.1)', borderRadius: '8px' }}>{error}</div>}
        {success && <div style={{ color: '#4ade80', marginBottom: '16px', fontSize: '14px', padding: '10px', background: 'rgba(0,255,0,0.1)', borderRadius: '8px' }}>{success}</div>}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '12px', color: 'var(--gray)', marginBottom: '8px', textTransform:'uppercase', letterSpacing:'1px' }}>Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', color: 'white', borderRadius: '8px', outline: 'none' }} />
        </div>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '12px', color: 'var(--gray)', marginBottom: '8px', textTransform:'uppercase', letterSpacing:'1px' }}>Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', color: 'white', borderRadius: '8px', outline: 'none' }} />
        </div>
        {isSignUp && (
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--gray)', marginBottom: '8px', textTransform:'uppercase', letterSpacing:'1px' }}>Confirm Password</label>
            <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', color: 'white', borderRadius: '8px', outline: 'none' }} />
          </div>
        )}
        <button type="submit" disabled={loading} style={{ width: '100%', padding: '14px', background: 'var(--gold)', color: '#000', fontWeight: 'bold', border: 'none', borderRadius: '8px', cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
          {loading ? 'Processing...' : (isSignUp ? 'Create Account' : 'Sign In To Dashboard')}
        </button>

        {mounted && !setupComplete && (
          <button type="button" onClick={() => { setIsSignUp(!isSignUp); setError(''); setSuccess(''); }} style={{ width: '100%', padding: '14px', marginTop: '12px', background: 'transparent', color: 'var(--gold)', fontWeight: 'bold', border: '1px solid var(--gold)', borderRadius: '8px', cursor: 'pointer' }}>
            {isSignUp ? 'Already have an account? Sign In' : 'Create Admin Account'}
          </button>
        )}
        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <button type="button" onClick={() => window.location.href = '/'} style={{ background: 'transparent', border: 'none', color: 'var(--gray)', cursor: 'pointer', fontSize: '13px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '8px', transition: 'color 0.3s' }}>
            ← Back to Homepage
          </button>
        </div>
      </form>
    </div>
  );
}
