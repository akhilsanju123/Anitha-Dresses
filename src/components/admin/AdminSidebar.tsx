'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import TeluguLogo from '../brand/TeluguLogo';
import { 
  LayoutDashboard, 
  Package, 
  Grid, 
  Tag, 
  ShoppingBag, 
  Image as ImageIcon, 
  Settings, 
  CreditCard, 
  Users, 
  LogOut,
  ExternalLink,
  MapPin,
  AlertTriangle,
  Percent,
  Star,
  FileText,
  Database
} from 'lucide-react';

const MENU = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Products', href: '/admin/products', icon: Package },
  { label: 'Categories', href: '/admin/categories', icon: Grid },
  { label: 'Brands', href: '/admin/brands', icon: Tag },
  { label: 'Orders & Verification', href: '/admin/orders', icon: ShoppingBag },
  { label: 'Banner Management', href: '/admin/banners', icon: ImageIcon },
  { label: 'Website Settings', href: '/admin/settings', icon: Settings },
  { label: 'Payment Settings', href: '/admin/settings', icon: CreditCard },
  { label: 'Users', href: '/admin/users', icon: Users },
  { label: 'Stock Alerts', href: '/admin/inventory', icon: AlertTriangle },
  { label: 'Pincodes', href: '/admin/pincodes', icon: MapPin },
  { label: 'Coupons', href: '/admin/coupons', icon: Percent },
  { label: 'Reviews', href: '/admin/reviews', icon: Star },
  { label: 'CMS Content', href: '/admin/cms', icon: FileText },
  { label: 'Data Backup', href: '/admin/backup', icon: Database },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (err) {
      console.warn("Logout request completed");
    } finally {
      localStorage.removeItem('anitha_admin_token');
      localStorage.removeItem('anitha_user');
      window.location.href = '/login';
    }
  };

  return (
    <aside className="w-64 bg-maroon-950 text-gold-100 border-r border-amber-500/30 flex flex-col justify-between min-h-screen p-4 shrink-0">
      <div>
        <div className="py-4 border-b border-amber-500/20 text-center">
          <TeluguLogo size="sm" variant="gold" />
          <span className="text-[10px] uppercase tracking-widest text-amber-400 font-bold block mt-1">
            Admin Controlsuite
          </span>
        </div>

        <nav className="mt-6 space-y-1">
          {MENU.map((item, idx) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={`${item.href}-${idx}`}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                  isActive
                    ? 'bg-amber-400 text-maroon-950 shadow-md'
                    : 'text-gold-200 hover:bg-amber-500/10 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-maroon-950' : 'text-amber-400'}`} />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="pt-4 border-t border-amber-500/20 space-y-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2 text-xs text-amber-300 hover:text-white transition p-2 font-bold"
        >
          <ExternalLink className="w-4 h-4" />
          <span>View Public Store</span>
        </Link>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 text-xs text-red-400 hover:text-red-300 transition p-2 font-bold rounded-xl hover:bg-red-500/10"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout Admin Session</span>
        </button>
      </div>
    </aside>
  );
}
