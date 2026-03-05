'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useCards } from '@/hooks/useCards';
import { UserNavbar } from '@/components/UserNavbar';
import { Card, CardContent } from '@/components/ui/card';
import { FormButton } from '@/components/FormButton';

export default function CardDetailPage() {
  const router = useRouter();
  const params = useParams();
  const cardId = params.id;

  const { getCardById } = useCards();
  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userRaw = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
    if (!userRaw) {
      router.replace('/auth/login');
      return;
    }

    loadCard();
  }, [router, cardId]);

  const loadCard = async () => {
    try {
      setLoading(true);
      const response = await getCardById(cardId);
      setCard(response.data || null);
    } catch (err) {
      console.error('Failed to load card:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <UserNavbar />
        <div className="mx-auto w-full max-w-3xl px-6 py-10">
          <Card className="animate-pulse">
            <CardContent className="p-8">
              <div className="h-6 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!card) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <UserNavbar />
        <div className="mx-auto w-full max-w-3xl px-6 py-10">
          <Card>
            <CardContent className="p-8 text-center">
              <h2 className="text-lg font-semibold text-gray-900">Card not found</h2>
              <FormButton onClick={() => router.push('/cards')} className="mt-4">
                Back to Cards
              </FormButton>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const cardUrl =
    card?.response?.link ||
    card?.response?.data?.link ||
    card?.response?.data?.card_url ||
    card?.response?.data?.url ||
    card?.response?.card_url ||
    card?.response?.url ||
    '';

  const handleCopy = async () => {
    if (!cardUrl) return;
    try {
      await navigator.clipboard.writeText(cardUrl);
      alert('Card link copied!');
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const encodedUrl = encodeURIComponent(cardUrl);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <UserNavbar />
      <div className="mx-auto w-full max-w-3xl px-6 py-10 space-y-6">
        <Card>
          <CardContent className="p-6">
            <h1 className="text-2xl font-semibold text-gray-900">Card Details</h1>
            <div className="mt-4 space-y-2 text-sm text-gray-600">
              <p><strong>Template ID:</strong> {card.templateId}</p>
              <p><strong>Theme ID:</strong> {card.themeId}</p>
              <p><strong>Status:</strong> {card.status}</p>
              {cardUrl ? (
                <p className="break-all"><strong>Card URL:</strong> {cardUrl}</p>
              ) : (
                <p><strong>Card URL:</strong> Not available</p>
              )}
            </div>
          </CardContent>
        </Card>

        {cardUrl && (
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-gray-900">Share Card</h2>
              <div className="mt-4 flex flex-wrap gap-3">
                <FormButton onClick={() => window.open(cardUrl, '_blank')}>
                  View in New Tab
                </FormButton>
                <FormButton onClick={handleCopy} className="bg-gray-100 text-gray-700 hover:bg-gray-200">
                  Copy Link
                </FormButton>
                <FormButton onClick={() => window.open(`https://wa.me/?text=${encodedUrl}`, '_blank')}>
                  WhatsApp
                </FormButton>
                <FormButton onClick={() => window.open(`mailto:?subject=My%20Card&body=${encodedUrl}`, '_blank')}>
                  Email
                </FormButton>
                <FormButton onClick={() => window.open(`https://t.me/share/url?url=${encodedUrl}`, '_blank')}>
                  Telegram
                </FormButton>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-gray-900">Response</h2>
            <pre className="mt-4 text-xs text-gray-600 whitespace-pre-wrap">
              {JSON.stringify(card.response || {}, null, 2)}
            </pre>
          </CardContent>
        </Card>

        <FormButton onClick={() => router.push(`/cards/edit/${card._id}`)}>
          Edit Card
        </FormButton>
      </div>
    </div>
  );
}
