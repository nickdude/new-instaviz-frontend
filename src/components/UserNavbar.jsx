'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { CreditCard, Edit3, LogOut, LayoutTemplate, ShoppingBag } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useProfiles } from '@/hooks/useProfiles';
import { useCards } from '@/hooks/useCards';

const staticNavItems = [
  { label: 'Templates', href: '/templates', icon: LayoutTemplate },
  { label: 'My Cards', href: '/my-card', icon: CreditCard },
  { label: 'My Orders', href: '/orders', icon: ShoppingBag },
];

export function UserNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { getProfiles } = useProfiles();
  const { getCards } = useCards();
  const [profileId, setProfileId] = useState(null);
  const [cardId, setCardId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch profile
        try {
          const profileResponse = await getProfiles();
          const profiles = profileResponse?.data || [];
          if (profiles.length > 0) {
            setProfileId(profiles[0]._id);
          }
        } catch (err) {
          // Silently fail for profile fetch
        }

        // Fetch card
        try {
          const cardResponse = await getCards();
          const cards = cardResponse?.data || [];
          if (cards.length > 0) {
            setCardId(cards[0]._id);
          }
        } catch (err) {
          // Silently fail for card fetch
        }
      } catch (err) {
        // Silently handle any other errors
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    router.push('/auth/login');
  };

  const handleEditProfile = () => {
    if (profileId) {
      router.push(`/profile/edit/${profileId}`);
    }
  };

  const handleUpdateCard = () => {
    if (cardId) {
      router.push(`/my-card/edit/${cardId}`);
    }
  };

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-20 w-full border-b border-gray-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/my-card">
          <Image
            src="/logo.jpeg"
            alt="Instaviz"
            width={120}
            height={40}
            className="h-10 w-auto"
          />
        </Link>

        <button
          type="button"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className="md:hidden inline-flex items-center justify-center rounded-md border border-gray-200 bg-white p-2 text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Toggle menu"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        <nav className="hidden md:flex items-center gap-2">
          {staticNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname?.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon size={16} />
                {item.label}
              </Link>
            );
          })}
          <button
            onClick={handleUpdateCard}
            disabled={!cardId}
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
              cardId
                ? 'text-gray-600 hover:bg-gray-100 cursor-pointer'
                : 'text-gray-400 cursor-not-allowed'
            }`}
          >
            <CreditCard size={16} />
            Update Card
          </button>
          <button
            onClick={handleEditProfile}
            disabled={!profileId}
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
              profileId
                ? 'text-gray-600 hover:bg-gray-100 cursor-pointer'
                : 'text-gray-400 cursor-not-allowed'
            }`}
          >
            <Edit3 size={16} />
            Edit Profile
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition"
          >
            <LogOut size={16} />
            Logout
          </button>
        </nav>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white px-4 py-3">
          <nav className="flex flex-col gap-2">
            {staticNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname?.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Icon size={16} />
                  {item.label}
                </Link>
              );
            })}

            <button
              onClick={() => { handleUpdateCard(); setIsMenuOpen(false); }}
              disabled={!cardId}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
                cardId
                  ? 'text-gray-600 hover:bg-gray-100 cursor-pointer'
                  : 'text-gray-400 cursor-not-allowed'
              }`}
            >
              <CreditCard size={16} />
              Update Card
            </button>

            <button
              onClick={() => { handleEditProfile(); setIsMenuOpen(false); }}
              disabled={!profileId}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
                profileId
                  ? 'text-gray-600 hover:bg-gray-100 cursor-pointer'
                  : 'text-gray-400 cursor-not-allowed'
              }`}
            >
              <Edit3 size={16} />
              Edit Profile
            </button>

            <button
              onClick={() => { handleLogout(); setIsMenuOpen(false); }}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition"
            >
              <LogOut size={16} />
              Logout
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
