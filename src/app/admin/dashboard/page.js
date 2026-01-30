'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5002';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('authToken');

    const fetchAdminData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/subscriptions/admin/all`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setSubscriptions(data?.data || []);
        }
      } catch (err) {
        setSubscriptions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  const stats = useMemo(() => {
    const total = subscriptions.length;
    const active = subscriptions.filter((s) => s.status === 'active').length;
    const pending = subscriptions.filter((s) => s.status === 'pending').length;

    return { total, active, pending };
  }, [subscriptions]);

  return (
    <div className="px-8 py-8 w-full">
      <div className="flex flex-col gap-2">
        <Badge variant="secondary" className="w-fit">Admin Dashboard</Badge>
        <h1 className="text-3xl font-semibold text-gray-900">Overview</h1>
        <p className="text-sm text-gray-500">Manage subscriptions, plans, and customer activity.</p>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Subscriptions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-gray-900">{loading ? '--' : stats.total}</div>
            <p className="text-xs text-gray-500 mt-1">All time records</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Subscriptions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-gray-900">{loading ? '--' : stats.active}</div>
            <p className="text-xs text-gray-500 mt-1">Currently active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pending Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-gray-900">{loading ? '--' : stats.pending}</div>
            <p className="text-xs text-gray-500 mt-1">Awaiting confirmation</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Subscriptions</CardTitle>
              <p className="text-sm text-gray-500 mt-1">Latest user purchases</p>
            </div>
            <Button variant="outline" size="sm">View All</Button>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-sm text-gray-500">Loading...</p>
            ) : subscriptions.length === 0 ? (
              <p className="text-sm text-gray-500">No subscriptions found.</p>
            ) : (
              <div className="space-y-3">
                {subscriptions.slice(0, 5).map((sub) => (
                  <div key={sub._id} className="flex items-center justify-between rounded-lg border border-gray-100 bg-white px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{sub?.userId?.name || 'User'}</p>
                      <p className="text-xs text-gray-500">{sub?.planId?.title || 'Plan'} • {sub?.paymentDetails?.currency || ''}</p>
                    </div>
                    <Badge className={sub.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}>
                      {sub.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
