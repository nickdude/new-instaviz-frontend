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
  ArrowDownRight,
  Download
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAdminPlans } from '@/hooks/useAdminPlans';
import { useOrders } from '@/hooks/useOrders';
import { exportOrdersToExcel } from '@/utils/exportExcel';
import { useAdminUsers } from '@/hooks/useAdminUsers';
import { useSubscriptions } from '@/hooks/useSubscriptions';

// Dummy Data
const DUMMY_STATS = {
  totalUsers: 0,
  activeSubscriptions: 0,
  totalRevenue: 0,
  pendingOrders: 0,
  userGrowth: 0,
  revenueGrowth: 0,
  subscriptionGrowth: 0,
  ordersGrowth: 0,
};



// const DUMMY_RECENT_USERS = [];

const DUMMY_RECENT_ORDERS = [
];

const DUMMY_PLANS = [
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
        {/* <div className="flex items-center gap-1">
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
        </div> */}
      </div>
    </CardContent>
  </Card>
);

export default function AdminDashboardPage() {
  const [plans, setPlans] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [totalUsers, setTotalUsers] = useState(DUMMY_STATS.totalUsers);
  const [usersLoading, setUsersLoading] = useState(true);
  const [activeSubscriptions, setActiveSubscriptions] = useState(DUMMY_STATS.activeSubscriptions);
  const [totalRevenue, setTotalRevenue] = useState(DUMMY_STATS.totalRevenue);
  const [pendingOrders, setPendingOrders] = useState(DUMMY_STATS.pendingOrders);
  const [recentUsers, setRecentUsers] = useState([]);
  // For dashboard download button
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const { getPlans } = useAdminPlans();
  const { getOrders, getOrderStats } = useOrders();
  const { getUsers } = useAdminUsers();

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

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setOrdersLoading(true);
        const [ordersRes, statsRes] = await Promise.all([
          getOrders(),
          getOrderStats()
        ]);
        
        const orders = ordersRes.data || ordersRes.orders || DUMMY_RECENT_ORDERS;
        const ordersArray = Array.isArray(orders) ? orders : [];
        
        // Take only the first 5 orders (most recent)
        setRecentOrders(ordersArray.slice(0, 5));
        
        // Get revenue and pending orders from stats API (matches admin/orders page)
        const stats = statsRes.data || {};
        setTotalRevenue(stats.totalRevenue || DUMMY_STATS.totalRevenue);
        
        // Extract pending orders count from byStatus array
        const pendingCount = stats.byStatus?.find(status => status._id === 'Order Pending')?.count || 0;
        setPendingOrders(pendingCount);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
        setRecentOrders(DUMMY_RECENT_ORDERS);
        setTotalRevenue(DUMMY_STATS.totalRevenue);
        setPendingOrders(DUMMY_STATS.pendingOrders);
      } finally {
        setOrdersLoading(false);
      }
    };
    fetchOrders();
  }, [getOrders, getOrderStats]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setUsersLoading(true);
        const response = await getUsers();
        const usersArray = response.data || response.users || [];
        setTotalUsers(Array.isArray(usersArray) ? usersArray.length : DUMMY_STATS.totalUsers);
        // Count active users (users with active status)
        const activeCount = usersArray.filter(u => u.status === 'active').length;
        setActiveSubscriptions(activeCount || DUMMY_STATS.activeSubscriptions);
        // Calculate total revenue from all users
        const revenue = usersArray.reduce((sum, u) => sum + (u.revenue || 0), 0);
        setTotalRevenue(revenue || DUMMY_STATS.totalRevenue);

        // Sort users by join date (createdAt descending) and take 5 most recent
        const sortedUsers = [...usersArray].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setRecentUsers(sortedUsers.slice(0, 5));
      } catch (error) {
        console.error('Failed to fetch users:', error);
        setTotalUsers(DUMMY_STATS.totalUsers);
        setActiveSubscriptions(DUMMY_STATS.activeSubscriptions);
        setTotalRevenue(DUMMY_STATS.totalRevenue);
        setRecentUsers([]);
      } finally {
        setUsersLoading(false);
      }
    };
    fetchUsers();
  }, [getUsers]);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        // Already fetched in users effect above, no need for separate fetch
        // Active subscriptions are counted from user.status === 'active'
      } catch (error) {
        console.error('Failed to fetch subscriptions:', error);
      }
    };
    fetchSubscriptions();
  }, [getUsers]);

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-8">
        {/* Header with Download Excel button and date filters */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">Welcome back! Here's your business overview.</p>
          </div>
          <div className="flex flex-col md:flex-row gap-2 items-end md:items-center">
            {/* <div>
              <label className="block text-xs text-gray-500 mb-1">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="px-2 py-1 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                className="px-2 py-1 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white"
              />
            </div> */}
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2 mt-2 md:mt-0"
              onClick={async () => {
                if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
                  alert('End date should be greater than or equal to start date.');
                  return;
                }
                try {
                  const res = await getOrders({ startDate, endDate });
                  const ordersData = res.data || res.orders || [];
                  exportOrdersToExcel(ordersData, 'orders-report.xlsx');
                } catch (err) {
                  alert('Failed to download orders report.');
                }
              }}
            >
              <Download className="w-4 h-4 mr-1" /> Download Excel
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Total Users"
            value={totalUsers.toLocaleString()}
            icon={Users}
            trend={DUMMY_STATS.userGrowth}
            trendLabel="vs last month"
            bgColor="bg-blue-600"
          />
          <StatCard
            title="Active Subscriptions"
            value={activeSubscriptions.toLocaleString()}
            icon={ShoppingCart}
            trend={DUMMY_STATS.subscriptionGrowth}
            trendLabel="vs last month"
            bgColor="bg-green-600"
          />
          <StatCard
            title="Total Revenue"
            value={`₹${totalRevenue.toLocaleString()}`}
            icon={DollarSign}
            trend={DUMMY_STATS.revenueGrowth}
            trendLabel="vs last month"
            bgColor="bg-purple-600"
          />
          <StatCard
            title="Pending Orders"
            value={pendingOrders}
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
                <Button variant="outline" size="sm" onClick={() => window.location.href = '/admin/orders'}>View All</Button>
              </CardHeader>
              <CardContent>
                {ordersLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <p className="text-gray-500">Loading orders...</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left px-4 py-3 font-semibold text-gray-700">Order ID</th>
                          <th className="text-left px-4 py-3 font-semibold text-gray-700">User</th>
                          {/* <th className="text-left px-4 py-3 font-semibold text-gray-700">Plan</th> */}
                          <th className="text-left px-4 py-3 font-semibold text-gray-700">Card Type</th>
                          <th className="text-left px-4 py-3 font-semibold text-gray-700">Qty</th>
                          <th className="text-left px-4 py-3 font-semibold text-gray-700">Amount</th>
                          <th className="text-left px-4 py-3 font-semibold text-gray-700">Status</th>
                          <th className="text-left px-4 py-3 font-semibold text-gray-700">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentOrders.map((order) => (
                          <tr key={order._id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="px-4 py-3 text-gray-900 font-medium">{order._id?.slice(-6).toUpperCase()}</td>
                            <td className="px-4 py-3">
                              <div>
                                <p className="text-gray-900">{order.userId?.name}</p>
                                <p className="text-xs text-gray-500">{order.userId?.email}</p>
                              </div>
                            </td>
                            {/* <td className="px-4 py-3 text-gray-700">{order.planId?.title}</td> */}
                            <td className="px-4 py-3">
                              <Badge className="bg-blue-100 text-blue-800">
                                {order.cardType}
                              </Badge>
                            </td>
                            <td className="px-4 py-3 text-gray-700">{order.orderDetails?.quantity}</td>
                            <td className="px-4 py-3 text-gray-900 font-semibold">₹{order.orderDetails?.totalAmount?.toFixed(2) || 0}</td>
                            <td className="px-4 py-3">
                              <Badge className="bg-green-100 text-center text-green-800">
                                {order.status}
                              </Badge>
                            </td>
                            <td className="px-4 py-3 text-gray-600 text-xs">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
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
              <Button variant="outline" size="sm" onClick={() => window.location.href = '/admin/users'}>View All</Button>
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
                    {recentUsers.map((user) => (
                      <tr
                        key={user.id}
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                      >
                        <td className="py-3 px-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-medium">
                              {user.name?.charAt(0) || '?'}
                            </div>
                            <span className="text-sm font-medium text-gray-900">{user.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-2 text-sm text-gray-600">{user.email}</td>
                        <td className="py-3 px-2">
                          <Badge variant="outline">{user.plan || user.planId?.title || '-'}</Badge>
                        </td>
                        <td className="py-3 px-2 text-sm text-gray-600">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}</td>
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
