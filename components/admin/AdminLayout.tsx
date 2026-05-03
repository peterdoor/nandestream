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
    <div className="min-h-screen bg-gris-claro flex flex-col">
      <div className="bg-azul text-white px-6 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-6">
          <Link href="/admin" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-7 h-7 bg-rojo rounded-full flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M4 4l16 8-16 8V4z"/></svg>
            </div>
            <span className="font-display font-bold">Ñande Stream</span>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {ADMIN_NAV.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded transition-colors ${
                  pathname === item.href
                    ? 'bg-white/20 text-white font-semibold'
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                }`}
              >
                <span>{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <a href="/" target="_blank" className="text-white/50 hover:text-white text-sm transition-colors hidden md:block">
            Ver sitio →
          </a>
          <button
            onClick={handleLogout}
            className="text-white/60 hover:text-white text-sm border border-white/20 hover:border-white/50 px-3 py-1.5 rounded transition-colors"
          >
            Salir
          </button>
        </div>
      </div>

      <div className="md:hidden bg-azul/90 border-t border-white/10 flex overflow-x-auto">
        {ADMIN_NAV.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex-shrink-0 flex flex-col items-center gap-0.5 px-4 py-2 text-[0.65rem] font-medium transition-colors ${
              pathname === item.href ? 'text-white' : 'text-white/50'
            }`}
          >
            <span className="text-base">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </div>

      <div className="flex-1">{children}</div>
    </div>
  );
}
