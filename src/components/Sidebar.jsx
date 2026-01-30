'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, Package, LogOut } from 'lucide-react';

export function Sidebar() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    router.push('/auth/login');
  };

  const menuItems = [
    {
      label: 'Dashboard',
      href: '/admin/dashboard',
      icon: LayoutDashboard,
    },
    {
      label: 'Plans',
      href: '/admin/plans',
      icon: Package,
    },
  ];

  return (
    <aside className="w-64 bg-gray-900 text-white h-screen flex flex-col sticky top-0">
      {/* Logo */}
      <div className="px-6 py-8 border-b border-gray-800">
        <h1 className="text-xl font-bold">Instaviz</h1>
        <p className="text-xs text-gray-400 mt-1">Admin Panel</p>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-4 py-6">
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Logout */}
      <div className="px-4 py-6 border-t border-gray-800">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium text-red-400 hover:bg-gray-800 transition-colors"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
