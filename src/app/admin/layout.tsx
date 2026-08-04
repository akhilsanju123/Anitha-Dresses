'use client';

import React, { useEffect, useState } from 'react';
import LuxuryLoader from '../../components/common/LuxuryLoader';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [checkingAuth, setCheckingAuth] = useState<boolean>(true);

  useEffect(() => {
    async function checkAdminSession() {
      try {
        const localToken = typeof window !== 'undefined' ? localStorage.getItem('anitha_admin_token') : null;
        
        const res = await fetch('/api/auth/me', {
          headers: localToken ? { 'Authorization': `Bearer ${localToken}` } : {},
        });
        const json = await res.json();

        if (json.success && (json.data?.role === 'super_admin' || json.data?.role === 'store_admin')) {
          setIsAuthorized(true);
        } else {
          setIsAuthorized(false);
          window.location.href = '/login';
        }
      } catch (err) {
        setIsAuthorized(false);
        window.location.href = '/login';
      } finally {
        setCheckingAuth(false);
      }
    }

    checkAdminSession();
  }, []);

  if (checkingAuth) {
    return <LuxuryLoader />;
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}
