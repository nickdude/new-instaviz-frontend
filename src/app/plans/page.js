'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PlanCard } from '@/components/PlanCard';
import { usePlans } from '@/hooks/usePlans';
import { useSubscriptions } from '@/hooks/useSubscriptions';

export default function PlansPage() {
  const router = useRouter();
  const { getPlans, loading, error } = usePlans();
  const { purchasePlan, verifyPayment, loading: purchaseLoading } = useSubscriptions();
  const [plans, setPlans] = useState([]);
  const [activeTab, setActiveTab] = useState('individual');
  const [paymentError, setPaymentError] = useState('');
  const [activePurchaseId, setActivePurchaseId] = useState('');

  const loadRazorpay = () => {
    if (typeof window === 'undefined') return Promise.resolve(false);
    if (window.Razorpay) return Promise.resolve(true);

    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  useEffect(() => {
    const loadPlans = async () => {
      try {
        const response = await getPlans(true);
        const data = response?.data || [];
        setPlans(data);
      } catch (err) {
        setPlans([]);
      }
    };

    loadPlans();
  }, [getPlans]);

  const displayPlans = useMemo(() => {
    return plans.map((plan) => ({
      id: plan._id,
      title: plan.title,
      price: plan.price?.rupees ?? plan.price?.dollar ?? '0',
      billingNote: plan.durationDays ? `Billed every ${plan.durationDays} days` : '',
      subNote: plan.description,
      cardTypes: plan.cardTypes || [],
      badgeText: plan.isPopular ? 'POPULAR' : '',
      currencySymbol: '₹',
      currency: 'rupees',
    }));
  }, [plans]);

  const handlePurchase = async (plan) => {
    setPaymentError('');

    const userRaw = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
    if (!userRaw) {
      router.push('/auth/login');
      return;
    }

    const razorpayReady = await loadRazorpay();
    if (!razorpayReady) {
      setPaymentError('Unable to load payment gateway. Please try again.');
      return;
    }

    try {
      setActivePurchaseId(plan.id);
      const response = await purchasePlan(plan.id, plan.currency);
      const { subscription, razorpayOrder, razorpayKeyId } = response.data;

      const user = JSON.parse(userRaw);

      const options = {
        key: razorpayKeyId,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: 'Instaviz',
        description: plan.title,
        order_id: razorpayOrder.id,
        handler: async function (paymentResponse) {
          try {
            await verifyPayment(
              subscription._id,
              paymentResponse.razorpay_order_id,
              paymentResponse.razorpay_payment_id,
              paymentResponse.razorpay_signature
            );
            router.push('/templates');
          } catch (err) {
            setPaymentError(err.message || 'Payment verification failed.');
          }
        },
        prefill: {
          name: user?.name || '',
          email: user?.email || ''
        },
        theme: {
          color: '#2563eb'
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      setPaymentError(err.message || 'Unable to start payment.');
    } finally {
      setActivePurchaseId('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white px-6 py-10">
      <div className="mx-auto w-full max-w-6xl">
        <div className="flex flex-col items-center text-center">
          <span className="rounded-full border border-gray-200 bg-white px-4 py-1 text-xs font-semibold uppercase tracking-wide text-gray-500 shadow-sm">
            Select your plan
          </span>
          <h1 className="mt-6 text-3xl font-semibold text-gray-900">Individual</h1>
          <p className="mt-2 text-sm text-gray-500">
            Complimentary Smart Card included.{' '}
            <span className="text-blue-600 font-medium">See all features</span>
          </p>
        </div>

        <div className="mt-6 flex items-center justify-center">
          <div className="flex items-center rounded-full border border-gray-200 bg-white p-1 shadow-sm">
            <button
              type="button"
              onClick={() => setActiveTab('individual')}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                activeTab === 'individual'
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-500'
              }`}
            >
              Individual
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('team')}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                activeTab === 'team' ? 'bg-gray-100 text-gray-900' : 'text-gray-500'
              }`}
            >
              For Team
            </button>
          </div>
        </div>

        {error && (
          <p className="mt-4 text-center text-sm text-red-500">{error}</p>
        )}
        {paymentError && (
          <p className="mt-4 text-center text-sm text-red-500">{paymentError}</p>
        )}

        {loading ? (
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={`skeleton-${index}`} className="h-[260px] rounded-2xl border border-gray-200 bg-white shadow-sm animate-pulse" />
            ))}
          </div>
        ) : displayPlans.length === 0 ? (
          <p className="mt-10 text-center text-sm text-gray-500">No plans available.</p>
        ) : (
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {(activeTab === 'team' ? displayPlans.slice(0, 2) : displayPlans).map((plan, index) => (
              <PlanCard
                key={`${plan.title}-${index}`}
                title={plan.title}
                price={plan.price}
                billingNote={plan.billingNote}
                subNote={plan.subNote}
                badgeText={plan.badgeText}
                currencySymbol={plan.currencySymbol || '₹'}
                loading={purchaseLoading && activePurchaseId === plan.id}
                onSelect={() => handlePurchase(plan)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
