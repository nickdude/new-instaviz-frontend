'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  ShoppingCart, 
  Settings, 
  LogOut, 
  ChevronDown,
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const ADMIN_NAVIGATION = [
  {
    name: 'Dashboard',
    href: '/admin/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Users',
    href: '/admin/users',
    icon: Users,
  },
  {
    name: 'Plans',
    href: '/admin/plans',
    icon: FileText,
  },
  {
    name: 'Orders',
    href: '/admin/orders',
    icon: ShoppingCart,
  },
  {
    name: 'Settings',
    href: '/admin/settings',
    icon: Settings,
  },
];

export function AdminSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    router.push('/auth/login');
  };

  const isActive = (href) => pathname === href;

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="fixed top-4 left-4 z-50 lg:hidden">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="bg-white"
        >
          {isMobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-slate-900 text-white transition-all duration-300 z-40 lg:relative lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="border-b border-slate-800 px-6 py-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
                <LayoutDashboard className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold">Admin Panel</h2>
                <p className="text-xs text-slate-400">v1.0</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {ADMIN_NAVIGATION.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <button
                  key={item.href}
                  onClick={() => {
                    router.push(item.href);
                    setIsMobileOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    active
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  <span>{item.name}</span>
                  {active && (
                    <div className="ml-auto w-2 h-2 rounded-full bg-blue-300" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Footer Section */}
          <div className="border-t border-slate-800 px-4 py-4 space-y-3">
            {/* User Info */}
            <div className="px-4 py-3 rounded-lg bg-slate-800">
              <p className="text-xs text-slate-400">Logged in as</p>
              <p className="text-sm font-medium text-white truncate">
                {typeof window !== 'undefined'
                  ? JSON.parse(localStorage.getItem('user') || '{}')?.name || 'Admin'
                  : 'Admin'}
              </p>
              <Badge variant="secondary" className="mt-2 text-xs">
                Administrator
              </Badge>
            </div>

            {/* Logout Button */}
            <Button
              onClick={handleLogout}
              variant="destructive"
              className="w-full flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  );
}
