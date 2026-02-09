'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCards } from '@/hooks/useCards';
import { UserNavbar } from '@/components/UserNavbar';
import { useProfiles } from '@/hooks/useProfiles';
import { FormButton } from '@/components/FormButton';
import { Card, CardContent } from '@/components/ui/card';
import { CreditCard, Plus, Pencil, Eye, Share2, Copy, Mail, MessageCircle, X } from 'lucide-react';

export default function CardsPage() {
  const router = useRouter();
  const { getCards } = useCards();
  const { getProfiles } = useProfiles();
  const [cards, setCards] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewModal, setPreviewModal] = useState(null);

  useEffect(() => {
    const userRaw = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
    if (!userRaw) {
      router.replace('/auth/login');
      return;
    }

    loadData();
  }, [router]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [cardsResponse, profilesResponse] = await Promise.all([
        getCards(),
        getProfiles()
      ]);
      setCards(cardsResponse.data || []);
      setProfiles(profilesResponse.data || []);
    } catch (err) {
      console.error('Failed to load cards:', err);
    } finally {
      setLoading(false);
    }
  };

  const profileNameById = (profileId) => {
    const profile = profiles.find((item) => item._id === profileId);
    return profile?.contactInfo?.name || 'Profile';
  };

  const getCardUrl = (card) => {
    // The API returns the card URL in the 'link' field
    return card.response?.link || 
           card.response?.data?.link ||
           card.response?.data?.card_url || 
           card.response?.data?.url || 
           card.response?.card_url || 
           card.response?.url || 
           null;
  };

  const handleCopyUrl = (cardUrl) => {
    if (cardUrl) {
      navigator.clipboard.writeText(cardUrl);
      alert('Card URL copied to clipboard!');
    }
  };

  const handleWhatsAppShare = (cardUrl) => {
    if (cardUrl) {
      window.open(`https://wa.me/?text=${encodeURIComponent(cardUrl)}`, '_blank');
    }
  };

  const handleEmailShare = (cardUrl) => {
    if (cardUrl) {
      window.location.href = `mailto:?subject=Check out my card&body=${encodeURIComponent(cardUrl)}`;
    }
  };

  const handleTelegramShare = (cardUrl) => {
    if (cardUrl) {
      window.open(`https://t.me/share/url?url=${encodeURIComponent(cardUrl)}`, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white px-6 py-10">
        <div className="mx-auto w-full max-w-5xl">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <UserNavbar />
      <div className="mx-auto w-full max-w-5xl px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Cards</h1>
            <p className="mt-2 text-sm text-gray-500">Manage and share your digital cards.</p>
          </div>
          <FormButton onClick={() => router.push('/templates')} className="w-auto px-5">
            <Plus size={16} className="mr-2" />
            Create New Card
          </FormButton>
        </div>

        {cards.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard size={40} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Cards Yet</h3>
              <p className="text-sm text-gray-500 mb-6">
                Create your first digital card by selecting a template.
              </p>
              <FormButton onClick={() => router.push('/templates')}>Create Card</FormButton>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {cards.map((card) => {
              const cardUrl = getCardUrl(card);
              const cardName = `${profileNameById(card.profileId)} - ${card.templateId}`;
              
              return (
                <Card key={card._id} className="hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-base font-semibold text-gray-900">
                          {profileNameById(card.profileId)}
                        </h3>
                        <p className="text-xs text-gray-500">Template: {card.templateId}</p>
                        <p className="text-xs text-gray-500">Theme: {card.themeId}</p>
                        {cardUrl && (
                          <div 
                            className="mt-2 p-2 bg-gray-50 rounded text-xs text-gray-600 break-all cursor-pointer hover:bg-gray-100 transition"
                            onClick={() => setPreviewModal({ url: cardUrl, name: cardName })}
                            title="Click to preview card"
                          >
                            {cardUrl}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {cardUrl && (
                      <div className="mb-3 pb-3 border-b border-gray-100">
                        <p className="text-xs font-medium text-gray-700 mb-2 flex items-center gap-1">
                          <Share2 size={12} />
                          Share Card
                        </p>
                        <div className="grid grid-cols-4 gap-2">
                          <button
                            onClick={() => handleCopyUrl(cardUrl)}
                            className="flex flex-col items-center justify-center gap-1 px-2 py-2 text-xs font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                            title="Copy URL"
                          >
                            <Copy size={16} />
                            <span className="text-[10px]">Copy</span>
                          </button>
                          <button
                            onClick={() => handleWhatsAppShare(cardUrl)}
                            className="flex flex-col items-center justify-center gap-1 px-2 py-2 text-xs font-medium text-green-700 bg-green-50 rounded-lg hover:bg-green-100 transition"
                            title="Share on WhatsApp"
                          >
                            <MessageCircle size={16} />
                            <span className="text-[10px]">WhatsApp</span>
                          </button>
                          <button
                            onClick={() => handleEmailShare(cardUrl)}
                            className="flex flex-col items-center justify-center gap-1 px-2 py-2 text-xs font-medium text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 transition"
                            title="Share via Email"
                          >
                            <Mail size={16} />
                            <span className="text-[10px]">Email</span>
                          </button>
                          <button
                            onClick={() => handleTelegramShare(cardUrl)}
                            className="flex flex-col items-center justify-center gap-1 px-2 py-2 text-xs font-medium text-sky-700 bg-sky-50 rounded-lg hover:bg-sky-100 transition"
                            title="Share on Telegram"
                          >
                            <MessageCircle size={16} />
                            <span className="text-[10px]">Telegram</span>
                          </button>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => router.push(`/cards/${card._id}`)}
                        className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-xs font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                      >
                        <Eye size={14} />
                        View
                      </button>
                      <button
                        onClick={() => router.push(`/cards/edit/${card._id}`)}
                        className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-xs font-medium text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 transition"
                      >
                        <Pencil size={14} />
                        Edit
                      </button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Full Screen Card URL Preview Modal */}
      {previewModal && (
        <div 
          className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4"
          onClick={() => setPreviewModal(null)}
        >
          <button
            onClick={() => setPreviewModal(null)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
          >
            <X size={32} />
          </button>
          <div className="max-w-4xl w-full flex flex-col items-center">
            <h3 className="text-white text-xl font-semibold mb-4">
              {previewModal.name}
            </h3>
            <div className="w-full bg-white rounded-lg p-4 shadow-2xl">
              <p className="text-gray-700 text-sm font-medium mb-2">Card URL:</p>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={previewModal.url}
                  readOnly
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 bg-gray-50"
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(previewModal.url);
                    alert('URL copied to clipboard!');
                  }}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm font-medium flex items-center gap-2"
                >
                  <Copy size={16} />
                  Copy
                </button>
              </div>
              <a
                href={previewModal.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 block w-full px-4 py-3 bg-green-500 text-white text-center rounded-lg hover:bg-green-600 transition font-medium"
              >
                Open Card in New Tab
              </a>
            </div>
            <p className="text-gray-400 text-sm mt-4">
              Click X or outside to close
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
