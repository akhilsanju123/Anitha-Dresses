'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import TeluguLogo from '../../components/brand/TeluguLogo';
import { Lock, User, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [error, setError] = useState('');

  // Check if admin is already logged in; if so, automatically redirect to /admin
  useEffect(() => {
    async function checkExistingSession() {
      try {
        const localToken = localStorage.getItem('anitha_admin_token');
        if (localToken) {
          const res = await fetch('/api/auth/me', {
            headers: { 'Authorization': `Bearer ${localToken}` },
          });
          const json = await res.json();
          if (json.success && (json.data?.role === 'super_admin' || json.data?.role === 'store_admin')) {
            window.location.href = '/admin';
            return;
          }
        }
      } catch (err) {
        // Session invalid, stay on login page
      } finally {
        setCheckingSession(false);
      }
    }
    checkExistingSession();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        if (json.data.token) {
          localStorage.setItem('anitha_admin_token', json.data.token);
          localStorage.setItem('anitha_user', JSON.stringify(json.data));
        }

        if (json.data.role === 'super_admin' || json.data.role === 'store_admin') {
          // Full page window navigation ensures HTTP cookies & localStorage sync to /admin
          window.location.href = '/admin';
        } else {
          window.location.href = '/account';
        }
      } else {
        setError(json.message || 'Invalid username or password. Please try again.');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (checkingSession) {
    return (
      <div className="py-24 bg-maroon-950 text-gold-100 min-h-screen flex items-center justify-center font-serif text-sm">
        Authenticating session...
      </div>
    );
  }

  return (
    <div className="py-16 bg-maroon-950 text-gold-100 min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-maroon-900/60 p-8 rounded-3xl border border-amber-500/30 shadow-luxury space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <TeluguLogo size="md" variant="gold" />
          <h1 className="text-2xl font-black text-white font-serif">Sign In</h1>
          <p className="text-xs text-amber-200/70">Access your ANITHA DRESSES portal.</p>
        </div>

        {error && (
          <div className="p-3 bg-red-950/80 border border-red-500/40 text-red-300 rounded-xl text-xs font-semibold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="block text-gold-200 font-semibold mb-1">Username / Phone:</label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="Enter username or mobile number"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-maroon-950 border border-amber-500/30 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-amber-400"
              />
              <User className="w-4 h-4 text-amber-400 absolute left-3 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-gold-200 font-semibold mb-1">Password:</label>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-maroon-950 border border-amber-500/30 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-amber-400"
              />
              <Lock className="w-4 h-4 text-amber-400 absolute left-3 top-3.5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-maroon-950 font-black py-3.5 rounded-xl hover:brightness-110 transition flex items-center justify-center gap-2 shadow-xl text-xs disabled:opacity-50"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
          </button>
        </form>

        <div className="text-center pt-2 text-xs text-amber-200/70 border-t border-amber-500/20">
          <p>Don't have an account? <Link href="/signup" className="text-amber-400 font-bold hover:underline">Create Account</Link></p>
        </div>
      </div>
    </div>
  );
}
