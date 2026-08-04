'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import TeluguLogo from '../../components/brand/TeluguLogo';
import { User, Phone, Lock, Mail, ShieldCheck } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push('/account');
    }, 1000);
  };

  return (
    <div className="py-16 bg-maroon-950 text-gold-100 min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-maroon-900/60 p-8 rounded-3xl border border-amber-500/30 shadow-luxury space-y-6">
        
        <div className="text-center space-y-3">
          <TeluguLogo size="md" variant="gold" />
          <h1 className="text-2xl font-black text-white font-serif">Create Account</h1>
          <p className="text-xs text-amber-200/70">Register for easy checkout and order tracking.</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4 text-xs">
          <div>
            <label className="block text-gold-200 font-semibold mb-1">Full Name:</label>
            <div className="relative">
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-maroon-950 border border-amber-500/30 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none"
              />
              <User className="w-4 h-4 text-amber-400 absolute left-3 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-gold-200 font-semibold mb-1">Mobile Phone:</label>
            <div className="relative">
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-maroon-950 border border-amber-500/30 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none"
              />
              <Phone className="w-4 h-4 text-amber-400 absolute left-3 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-gold-200 font-semibold mb-1">Email Address:</label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-maroon-950 border border-amber-500/30 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none"
              />
              <Mail className="w-4 h-4 text-amber-400 absolute left-3 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-gold-200 font-semibold mb-1">Password:</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-maroon-950 border border-amber-500/30 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none"
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
            <span>{loading ? 'Creating Account...' : 'Register Account'}</span>
          </button>
        </form>

        <div className="text-center pt-2 text-xs text-amber-200/70 border-t border-amber-500/20">
          <p>Already have an account? <Link href="/login" className="text-amber-400 font-bold hover:underline">Sign In</Link></p>
        </div>
      </div>
    </div>
  );
}
