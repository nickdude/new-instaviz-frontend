'use client';

import { useEffect, useMemo, useState } from 'react';
import { 
  TrendingUp, 
  Users, 
  ShoppingCart, 
  DollarSign,
  Eye,
  MoreHorizontal,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAdminPlans } from '@/hooks/useAdminPlans';

// Dummy Data
const DUMMY_STATS = {
  totalUsers: 1234,
  activeSubscriptions: 856,
  totalRevenue: 45230,
  pendingOrders: 23,
  userGrowth: 12.5,
  revenueGrowth: 8.3,
  subscriptionGrowth: -2.1,
  ordersGrowth: 5.2,
};

const DUMMY_RECENT_USERS = [
  { id: 1, name: 'John Doe', email: 'john@example.com', joinDate: '2024-02-20', status: 'active', plan: 'Premium' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', joinDate: '2024-02-19', status: 'active', plan: 'Pro' },
  { id: 3, name: 'Mike Johnson', email: 'mike@example.com', joinDate: '2024-02-18', status: 'inactive', plan: 'Starter' },
  { id: 4, name: 'Sarah Williams', email: 'sarah@example.com', joinDate: '2024-02-17', status: 'active', plan: 'Premium' },
  { id: 5, name: 'Tom Brown', email: 'tom@example.com', joinDate: '2024-02-16', status: 'active', plan: 'Pro' },
];

const DUMMY_RECENT_ORDERS = [
  { id: 'ORD-001', user: 'John Doe', plan: 'Premium Annual', amount: 999, status: 'completed', date: '2024-02-20' },
  { id: 'ORD-002', user: 'Jane Smith', plan: 'Pro Monthly', amount: 49, status: 'pending', date: '2024-02-19' },
  { id: 'ORD-003', user: 'Mike Johnson', plan: 'Starter Monthly', amount: 29, status: 'completed', date: '2024-02-18' },
  { id: 'ORD-004', user: 'Sarah Williams', plan: 'Premium Monthly', amount: 99, status: 'completed', date: '2024-02-17' },
  { id: 'ORD-005', user: 'Tom Brown', plan: 'Pro Annual', amount: 499, status: 'failed', date: '2024-02-16' },
];

const DUMMY_PLANS = [
  { id: 1, name: 'Starter', price: 29, users: 234, revenue: 6786, status: 'active' },
  { id: 2, name: 'Pro', price: 99, users: 456, revenue: 45144, status: 'active' },
  { id: 3, name: 'Premium', price: 199, users: 234, revenue: 46566, status: 'active' },
];

const StatCard = ({ title, value, icon: Icon, trend, trendLabel, bgColor }) => (
  <Card className="hover:shadow-lg transition-shadow">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
      <div className={`p-2 rounded-lg ${bgColor}`}>
        <Icon className="h-5 w-5 text-white" />
      </div>
    </CardHeader>
    <CardContent>
      <div className="flex flex-col gap-2">
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        <div className="flex items-center gap-1">
          {trend > 0 ? (
            <>
              <ArrowUpRight className="h-4 w-4 text-green-600" />
              <span className="text-xs text-green-600 font-medium">{trend}%</span>
            </>
          ) : (
            <>
              <ArrowDownRight className="h-4 w-4 text-red-600" />
              <span className="text-xs text-red-600 font-medium">{Math.abs(trend)}%</span>
            </>
          )}
          <span className="text-xs text-gray-500">{trendLabel}</span>
        </div>
      </div>
    </CardContent>
  </Card>
);

export default function AdminDashboardPage() {
  const [plans, setPlans] = useState([]);
  const { getPlans } = useAdminPlans();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await getPlans();
        const plansList = response.data || response.plans || DUMMY_PLANS;
        setPlans(plansList);
      } catch (error) {
        console.error('Failed to fetch plans:', error);
        setPlans(DUMMY_PLANS);
      }
    };
    fetchPlans();
  }, [getPlans]);

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Welcome back! Here's your business overview.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Total Users"
            value={DUMMY_STATS.totalUsers.toLocaleString()}
            icon={Users}
            trend={DUMMY_STATS.userGrowth}
            trendLabel="vs last month"
            bgColor="bg-blue-600"
          />
          <StatCard
            title="Active Subscriptions"
            value={DUMMY_STATS.activeSubscriptions.toLocaleString()}
            icon={ShoppingCart}
            trend={DUMMY_STATS.subscriptionGrowth}
            trendLabel="vs last month"
            bgColor="bg-green-600"
          />
          <StatCard
            title="Total Revenue"
            value={`$${DUMMY_STATS.totalRevenue.toLocaleString()}`}
            icon={DollarSign}
            trend={DUMMY_STATS.revenueGrowth}
            trendLabel="vs last month"
            bgColor="bg-purple-600"
          />
          <StatCard
            title="Pending Orders"
            value={DUMMY_STATS.pendingOrders}
            icon={TrendingUp}
            trend={DUMMY_STATS.ordersGrowth}
            trendLabel="vs last month"
            bgColor="bg-orange-600"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Orders */}
          <div className="lg:col-span-2">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Recent Orders</CardTitle>
                  <p className="text-xs text-gray-500 mt-1">Latest transactions</p>
                </div>
                <Button variant="outline" size="sm">View All</Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-0 divide-y">
                  {DUMMY_RECENT_ORDERS.map((order) => (
                    <div key={order.id} className="flex items-center justify-between py-4 px-2 hover:bg-gray-50 rounded-lg transition-colors">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                            <ShoppingCart className="h-5 w-5 text-blue-600" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-gray-900 truncate">{order.id}</p>
                            <p className="text-xs text-gray-500">{order.user} • {order.plan}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 ml-4 flex-shrink-0">
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">${order.amount}</p>
                          <p className="text-xs text-gray-500">{order.date}</p>
                        </div>
                        <Badge
                          variant={
                            order.status === 'completed'
                              ? 'default'
                              : order.status === 'pending'
                              ? 'secondary'
                              : 'destructive'
                          }
                          className="flex-shrink-0"
                        >
                          {order.status}
                        </Badge>
                        <Button variant="ghost" size="icon" className="flex-shrink-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Plans Overview */}
          <div>
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>Plans Overview</CardTitle>
                <p className="text-xs text-gray-500 mt-1">Subscription distribution</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {plans.map((plan) => (
                    <div key={plan._id} className="p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{plan.title || 'Untitled'}</p>
                          <p className="text-xs text-gray-500 mt-1">₹{plan.price?.rupees || 0}/month</p>
                        </div>
                        <Badge variant="outline" className="flex-shrink-0">{plan.users || 0} users</Badge>
                      </div>
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-600">Revenue</span>
                          <span className="font-medium text-gray-900">₹{plan.revenue || 0}</span>
                        </div>
                        <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${plans.length > 0 ? (plan.revenue / plans.reduce((a, b) => a + (b.revenue || 0), 0)) * 100 : 0}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Users */}
        <div className="mt-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Users</CardTitle>
                <p className="text-xs text-gray-500 mt-1">New registrations</p>
              </div>
              <Button variant="outline" size="sm">View All</Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-2 font-medium text-xs text-gray-600">User</th>
                      <th className="text-left py-3 px-2 font-medium text-xs text-gray-600">Email</th>
                      <th className="text-left py-3 px-2 font-medium text-xs text-gray-600">Plan</th>
                      <th className="text-left py-3 px-2 font-medium text-xs text-gray-600">Join Date</th>
                      <th className="text-left py-3 px-2 font-medium text-xs text-gray-600">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {DUMMY_RECENT_USERS.map((user) => (
                      <tr
                        key={user.id}
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                      >
                        <td className="py-3 px-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-medium">
                              {user.name.charAt(0)}
                            </div>
                            <span className="text-sm font-medium text-gray-900">{user.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-2 text-sm text-gray-600">{user.email}</td>
                        <td className="py-3 px-2">
                          <Badge variant="outline">{user.plan}</Badge>
                        </td>
                        <td className="py-3 px-2 text-sm text-gray-600">{user.joinDate}</td>
                        <td className="py-3 px-2">
                          <Badge
                            variant={user.status === 'active' ? 'default' : 'secondary'}
                            className={user.status === 'active' ? 'bg-green-100 text-green-700' : ''}
                          >
                            {user.status}
                          </Badge>
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
    </div>
  );
}
