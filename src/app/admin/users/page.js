'use client';

import { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  MoreHorizontal,
  ChevronDown
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAdminPlans } from '@/hooks/useAdminPlans';
import { useAdminUsers } from '@/hooks/useAdminUsers';

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPlan, setFilterPlan] = useState('all');
  const [plans, setPlans] = useState([]);
  const [users, setUsers] = useState([]);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const { getPlans } = useAdminPlans();
  const { getUsers } = useAdminUsers();

  // Fetch plans on component mount
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoadingPlans(true);
        const response = await getPlans();
        const plansList = response.data || response.plans || [];
        setPlans(plansList);
      } catch (error) {
        console.error('Failed to fetch plans:', error);
        // Fallback to dummy plans if API fails
        setPlans([
          { _id: '1', title: 'Test' },
          { _id: '2', title: 'Monthly' },
        ]);
      } finally {
        setLoadingPlans(false);
      }
    };
    fetchPlans();
  }, [getPlans]);

  // Fetch users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoadingUsers(true);
        const response = await getUsers();
        const usersList = response.data || [];
        setUsers(usersList);
      } catch (error) {
        console.error('Failed to fetch users:', error);
        // Fallback to empty users list if API fails
        setUsers([]);
      } finally {
        setLoadingUsers(false);
      }
    };
    fetchUsers();
  }, [getUsers]);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlan = filterPlan === 'all' || user.plan === filterPlan;
    return matchesSearch && matchesPlan;
  });

  const stats = {
    totalUsers: users.length,
    activeUsers: users.filter(u => u.status === 'active').length,
    totalRevenue: users.reduce((sum, u) => sum + u.revenue, 0),
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Users</h1>
          <p className="text-sm text-gray-500 mt-1">Manage and monitor all users</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col gap-2">
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col gap-2">
                <p className="text-sm text-gray-600">Active Users</p>
                <p className="text-3xl font-bold text-gray-900">{stats.activeUsers}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col gap-2">
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-900">₹{stats.totalRevenue}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Users</CardTitle>
            
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name or email..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select
                value={filterPlan}
                onChange={(e) => setFilterPlan(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loadingPlans}
              >
                <option value="all">All Plans</option>
                {plans.map((plan) => (
                  <option key={plan._id} value={plan.title}>
                    {plan.title}
                  </option>
                ))}
              </select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-xs text-gray-600">User</th>
                    <th className="text-left py-3 px-4 font-medium text-xs text-gray-600">Email</th>
                    <th className="text-left py-3 px-4 font-medium text-xs text-gray-600">Plan</th>
                    <th className="text-left py-3 px-4 font-medium text-xs text-gray-600">Join Date</th>
                    <th className="text-left py-3 px-4 font-medium text-xs text-gray-600">Expires On</th>
                    <th className="text-left py-3 px-4 font-medium text-xs text-gray-600">Revenue</th>
                    <th className="text-left py-3 px-4 font-medium text-xs text-gray-600">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-xs text-gray-600"></th>
                  </tr>
                </thead>
                <tbody>
                  {loadingUsers ? (
                    <tr>
                      <td colSpan="7" className="py-8 px-4 text-center text-gray-500">
                        Loading users...
                      </td>
                    </tr>
                  ) : filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="py-8 px-4 text-center text-gray-500">
                        {users.length === 0 ? 'No users found. Create users to get started.' : 'No users match your search.'}
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <tr key={user._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-medium">
                              {user.name.charAt(0)}
                            </div>
                            <span className="text-sm font-medium text-gray-900">{user.name}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-600">{user.email}</td>
                        <td className="py-4 px-4">
                          <Badge variant="outline">{user.plan}</Badge>
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-600">{user.joinDate}</td>
                        <td className="py-4 px-4 text-sm text-gray-600">
                          {user.planExpiry ? (
                            <span className={new Date(user.planExpiry) < new Date() ? 'text-red-600 font-medium' : ''}>
                              {user.planExpiry}
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="py-4 px-4 text-sm font-medium text-gray-900">₹{user.revenue}</td>
                        <td className="py-4 px-4">
                          <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                            {user.status}
                          </Badge>
                        </td>
                        <td className="py-4 px-4">
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
