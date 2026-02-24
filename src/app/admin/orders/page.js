'use client';

import { useState } from 'react';
import {
  Search,
  Download,
  MoreHorizontal,
  CheckCircle,
  Clock,
  XCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const DUMMY_ORDERS = [
  { id: 'ORD-001', user: 'John Doe', email: 'john@example.com', plan: 'Premium Annual', amount: 999, status: 'completed', date: '2024-02-20', paymentMethod: 'Card' },
  { id: 'ORD-002', user: 'Jane Smith', email: 'jane@example.com', plan: 'Pro Monthly', amount: 49, status: 'pending', date: '2024-02-19', paymentMethod: 'UPI' },
  { id: 'ORD-003', user: 'Mike Johnson', email: 'mike@example.com', plan: 'Starter Monthly', amount: 29, status: 'completed', date: '2024-02-18', paymentMethod: 'Card' },
  { id: 'ORD-004', user: 'Sarah Williams', email: 'sarah@example.com', plan: 'Premium Monthly', amount: 99, status: 'completed', date: '2024-02-17', paymentMethod: 'Card' },
  { id: 'ORD-005', user: 'Tom Brown', email: 'tom@example.com', plan: 'Pro Annual', amount: 499, status: 'failed', date: '2024-02-16', paymentMethod: 'Card' },
  { id: 'ORD-006', user: 'Emma Davis', email: 'emma@example.com', plan: 'Starter Monthly', amount: 29, status: 'completed', date: '2024-02-15', paymentMethod: 'UPI' },
  { id: 'ORD-007', user: 'Chris Wilson', email: 'chris@example.com', plan: 'Premium Monthly', amount: 99, status: 'pending', date: '2024-02-14', paymentMethod: 'Card' },
  { id: 'ORD-008', user: 'Lisa Anderson', email: 'lisa@example.com', plan: 'Pro Monthly', amount: 49, status: 'completed', date: '2024-02-13', paymentMethod: 'Card' },
];

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredOrders = DUMMY_ORDERS.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.user.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    totalOrders: DUMMY_ORDERS.length,
    completedOrders: DUMMY_ORDERS.filter(o => o.status === 'completed').length,
    totalRevenue: DUMMY_ORDERS.reduce((sum, o) => sum + o.amount, 0),
    pendingRevenue: DUMMY_ORDERS.filter(o => o.status === 'pending').reduce((sum, o) => sum + o.amount, 0),
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
          <p className="text-sm text-gray-500 mt-1">Track and manage all orders</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col gap-2">
                <p className="text-sm text-gray-600">Total Orders</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalOrders}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col gap-2">
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-3xl font-bold text-green-600">{stats.completedOrders}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col gap-2">
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-900">${stats.totalRevenue}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col gap-2">
                <p className="text-sm text-gray-600">Pending Revenue</p>
                <p className="text-3xl font-bold text-yellow-600">${stats.pendingRevenue}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Orders Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>All Orders</CardTitle>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by order ID or user..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-xs text-gray-600">Order ID</th>
                    <th className="text-left py-3 px-4 font-medium text-xs text-gray-600">Customer</th>
                    <th className="text-left py-3 px-4 font-medium text-xs text-gray-600">Plan</th>
                    <th className="text-left py-3 px-4 font-medium text-xs text-gray-600">Amount</th>
                    <th className="text-left py-3 px-4 font-medium text-xs text-gray-600">Payment</th>
                    <th className="text-left py-3 px-4 font-medium text-xs text-gray-600">Date</th>
                    <th className="text-left py-3 px-4 font-medium text-xs text-gray-600">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-xs text-gray-600"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4">
                        <span className="text-sm font-medium text-blue-600">{order.id}</span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex flex-col gap-0">
                          <span className="text-sm font-medium text-gray-900">{order.user}</span>
                          <span className="text-xs text-gray-500">{order.email}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600">{order.plan}</td>
                      <td className="py-4 px-4 text-sm font-medium text-gray-900">${order.amount}</td>
                      <td className="py-4 px-4 text-sm text-gray-600">{order.paymentMethod}</td>
                      <td className="py-4 px-4 text-sm text-gray-600">{order.date}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(order.status)}
                          <Badge
                            variant={
                              order.status === 'completed'
                                ? 'default'
                                : order.status === 'pending'
                                ? 'secondary'
                                : 'destructive'
                            }
                          >
                            {order.status}
                          </Badge>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
