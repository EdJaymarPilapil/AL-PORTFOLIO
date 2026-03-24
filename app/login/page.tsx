"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

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

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('admin_setup_complete');
    setSetupComplete(stored === 'true');
    
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        localStorage.setItem('admin_setup_complete', 'true');
        setSetupComplete(true);
        window.location.href = '/admin';
      }
    });
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
        setError(error.message);
    } else {
        localStorage.setItem('admin_setup_complete', 'true');
        window.location.href = '/admin';
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
        setError(error.message);
    } else {
        localStorage.setItem('admin_setup_complete', 'true');
        setSetupComplete(true);
        if (data.session) {
          window.location.href = '/admin';
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
      <form onSubmit={isSignUp ? handleSignUp : handleLogin} style={{ background: 'var(--card)', padding: '40px', borderRadius: '16px', border: '1px solid var(--border)', width: '100%', maxWidth: '400px' }}>
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
      </form>
    </div>
  );
}
