'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ADMIN_NAV } from '@/lib/admin';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
  }

  return (
    <div className="min-h-screen bg-[#F0EDE8] flex flex-col">
      {/* Header newsroom */}
      <header className="bg-tinta text-white flex-shrink-0">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="flex items-center gap-2.5">
              <div className="w-7 h-7 bg-rojo rounded-sm flex items-center justify-center flex-shrink-0">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M4 4l16 8-16 8V4z"/></svg>
              </div>
              <span className="font-display font-bold text-base">Ñande Stream</span>
              <span className="text-white/30 text-xs hidden md:block">/ Redacción</span>
            </Link>
            {/* Nav desktop */}
            <nav className="hidden md:flex items-center gap-0.5 ml-4">
              {ADMIN_NAV.map(item => (
                <Link key={item.href} href={item.href}
                  className={`flex items-center gap-1.5 text-[0.75rem] px-3 py-1.5 rounded transition-colors ${
                    pathname === item.href
                      ? 'bg-white/15 text-white font-semibold'
                      : 'text-white/55 hover:text-white hover:bg-white/8'
                  }`}>
                  <span className="text-[0.7rem] opacity-70">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <a href="/" target="_blank"
              className="hidden md:flex items-center gap-1 text-white/40 hover:text-white text-xs transition-colors">
              Ver sitio
              <span className="text-[0.6rem]">↗</span>
            </a>
            <button onClick={handleLogout}
              className="text-white/50 hover:text-white text-xs border border-white/15 hover:border-white/30 px-3 py-1.5 rounded transition-colors">
              Salir
            </button>
          </div>
        </div>
        {/* Nav mobile */}
        <nav className="md:hidden flex overflow-x-auto border-t border-white/10">
          {ADMIN_NAV.map(item => (
            <Link key={item.href} href={item.href}
              className={`flex-shrink-0 flex flex-col items-center gap-0.5 px-4 py-2.5 text-[0.6rem] font-medium transition-colors ${
                pathname === item.href ? 'text-white bg-white/10' : 'text-white/45'
              }`}>
              <span className="text-sm">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
      </header>

      <div className="flex-1">{children}</div>
    </div>
  );
}
