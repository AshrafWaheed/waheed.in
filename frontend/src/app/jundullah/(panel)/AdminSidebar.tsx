'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Newspaper,
  Sparkles,
  Inbox,
  CalendarCheck,
  Mail,
  Users,
  UserCircle,
  Power,
  Palette,
  BarChart3,
  ExternalLink,
  Menu,
  X,
  LogOut,
} from 'lucide-react';

type NavItem = {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  /** Lives outside the panel — its own app, its own login. Opens in a new tab. */
  external?: true;
};

const NAV: NavItem[] = [
  { href: '/jundullah/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  // Umami is a separate application on this box (pm2 waheed-umami, :3003),
  // not a page in this panel. It has its own session, so this is a doorway
  // rather than a route — hence external, hence a new tab.
  { href: '/stats', label: 'Site analytics', icon: BarChart3, external: true },
  { href: '/jundullah/blogs', label: 'Blog posts', icon: Newspaper },
  { href: '/jundullah/content', label: 'Content engine', icon: Sparkles },
  { href: '/jundullah/contacts', label: 'Contact submissions', icon: Inbox },
  { href: '/jundullah/bookings', label: 'Bookings', icon: CalendarCheck },
  { href: '/jundullah/subscribers', label: 'Subscribers', icon: Mail },
  { href: '/jundullah/settings', label: 'Site mode', icon: Power },
  { href: '/jundullah/users', label: 'Users', icon: Users },
  { href: '/jundullah/profile', label: 'My profile', icon: UserCircle },
  // Not a settings screen — a preview bench for redesign components, so they
  // can be clicked and judged before anything is mounted on the public site.
  { href: '/jundullah/lab', label: 'Design lab', icon: Palette },
];

export default function AdminSidebar({ name, email }: { name: string; email: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const [busy, setBusy] = useState(false);
  async function logout() {
    if (busy) return;
    setBusy(true);
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
    } catch {
      // clear client state regardless
    }
    window.location.assign('/jundullah');
  }

  const initials = (name || email).slice(0, 2).toUpperCase();

  return (
    <>
      {/* Mobile top bar */}
      <div className="adm-mobilebar">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.png" alt="Waheed" className="adm-sb-logo" />
        <button
          type="button"
          className="adm-sb-toggle"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <aside className={`adm-sidebar${open ? ' is-open' : ''}`}>
        <div className="adm-sb-head">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Waheed" className="adm-sb-logo" />
          <span className="adm-sb-brand">Admin</span>
        </div>

        <nav className="adm-sb-nav">
          {NAV.map(({ href, label, icon: Icon, external }) => {
            if (external) {
              return (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="adm-sb-link adm-sb-link--out"
                  onClick={() => setOpen(false)}
                >
                  <Icon size={18} className="adm-sb-icon" />
                  <span>{label}</span>
                  <ExternalLink size={13} className="adm-sb-out" aria-hidden="true" />
                </a>
              );
            }

            const active = pathname === href || pathname.startsWith(href + '/');
            return (
              <Link
                key={href}
                href={href}
                className={`adm-sb-link${active ? ' is-active' : ''}`}
                onClick={() => setOpen(false)}
              >
                <Icon size={18} className="adm-sb-icon" />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="adm-sb-foot">
          <div className="adm-sb-user">
            <span className="adm-sb-avatar">{initials}</span>
            <span className="adm-sb-userinfo">
              <strong>{name}</strong>
              <small>{email}</small>
            </span>
          </div>
          <button type="button" className="adm-sb-logout" onClick={logout} disabled={busy}>
            <LogOut size={16} />
            {busy ? 'Signing out…' : 'Log out'}
          </button>
        </div>
      </aside>

      {/* Backdrop for mobile drawer */}
      {open && <div className="adm-sb-backdrop" onClick={() => setOpen(false)} aria-hidden="true" />}
    </>
  );
}
