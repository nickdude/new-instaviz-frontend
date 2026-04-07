'use client';

import { useState, useEffect } from 'react';
import { exportOrdersToExcel } from '@/utils/exportExcel';
import {
  Search,
  Filter,
  MoreHorizontal,
  ChevronDown,
  Eye,
  Trash2,
  Edit,
  Download,
  RotateCw
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useOrders } from '@/hooks/useOrders';

const STATUS_COLORS = {
  'Order Pending': 'bg-yellow-100 text-yellow-800',
  'Link Created': 'bg-blue-100 text-blue-800',
  'Printing Pending': 'bg-purple-100 text-purple-800',
  'Printing': 'bg-indigo-100 text-indigo-800',
  'Dispatched': 'bg-orange-100 text-orange-800',
  'Delivered': 'bg-green-100 text-green-800',
  'Cancelled': 'bg-red-100 text-red-800',
};

const CARD_TYPE_COLORS = {
  digital: 'bg-cyan-100 text-cyan-800',
  physical: 'bg-slate-100 text-slate-800',
  NFC: 'bg-lime-100 text-lime-800',
};

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCardType, setFilterCardType] = useState('all');
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusInput, setStatusInput] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const { getOrders, getOrderStats, updateOrderStatus, deleteOrder } = useOrders();

  // Fetch orders and stats on mount
  useEffect(() => {
    fetchOrdersAndStats();
  }, []);

  const fetchOrdersAndStats = async () => {
    try {
      setLoading(true);
      const [ordersRes, statsRes] = await Promise.all([
        getOrders(),
        getOrderStats(),
      ]);
      console.log('Orders Response:', ordersRes);
      console.log('Stats Response:', statsRes);
      setOrders(ordersRes.data || []);
      setStats(statsRes.data || null);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      alert(`Error fetching orders: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      order._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    const matchesCardType = filterCardType === 'all' || order.cardType === filterCardType;

    // Date filter
    let matchesDate = true;
    if (startDate) {
      matchesDate = matchesDate && new Date(order.createdAt) >= new Date(startDate);
    }
    if (endDate) {
      // Add 1 day to endDate to include the end date fully
      const end = new Date(endDate);
      end.setDate(end.getDate() + 1);
      matchesDate = matchesDate && new Date(order.createdAt) < end;
    }

    return matchesSearch && matchesStatus && matchesCardType && matchesDate;
  });

  const handleStatusUpdate = async () => {
    if (!statusInput || !selectedOrder) return;

    try {
      await updateOrderStatus(selectedOrder._id, statusInput, adminNotes);
      setShowStatusModal(false);
      setStatusInput('');
      setAdminNotes('');
      setSelectedOrder(null);
      await fetchOrdersAndStats();
    } catch (error) {
      console.error('Failed to update status:', error);
      alert(`Error: ${error.message}`);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!confirm('Are you sure you want to delete this order?')) return;

    try {
      await deleteOrder(orderId);
      await fetchOrdersAndStats();
    } catch (error) {
      console.error('Failed to delete order:', error);
      alert(`Error: ${error.message}`);
    }
  };

  const getValidStatusTransitions = (order) => {
    const transitions = {
      digital: {
        'Order Pending': ['Link Created', 'Cancelled'],
        'Link Created': ['Cancelled'],
        'Cancelled': [],
      },
      'physical-nfc': {
        'Order Pending': ['Printing Pending', 'Cancelled'],
        'Printing Pending': ['Printing', 'Cancelled'],
        'Printing': ['Dispatched', 'Cancelled'],
        'Dispatched': ['Delivered', 'Cancelled'],
        'Delivered': [],
        'Cancelled': [],
      },
    };

    const cardTypeGroup = order.cardType === 'digital' ? 'digital' : 'physical-nfc';
    return transitions[cardTypeGroup]?.[order.status] || [];
  };

  if (loading) {
    return (
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500">Loading orders...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
          <p className="text-sm text-gray-500 mt-1">Manage and monitor all orders</p>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col gap-2">
                  <p className="text-sm text-gray-600">Total Orders</p>
                  <p className="text-3xl font-bold text-gray-900">{stats?.totalOrders || 0}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col gap-2">
                  <p className="text-sm text-gray-600">Total Revenue</p>
                  <p className="text-3xl font-bold text-gray-900">₹{typeof stats?.totalRevenue === 'number' ? stats.totalRevenue.toFixed(2) : 0}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col gap-2">
                  <p className="text-sm text-gray-600">Digital Orders</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {Array.isArray(stats?.cardTypeBreakdown) ? (stats.cardTypeBreakdown?.find(c => c._id === 'digital')?.count || 0) : 0}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col gap-2">
                  <p className="text-sm text-gray-600">Physical/NFC Orders</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {Array.isArray(stats?.cardTypeBreakdown) ? (stats.cardTypeBreakdown?.filter(c => c._id !== 'digital').reduce((sum, c) => sum + c.count, 0) || 0) : 0}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters and Search */}
        <div className="mb-6 flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search by Order ID, User name, or Email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white hover:bg-gray-50"
            >
              <option value="all">All Status</option>
              <option value="Order Pending">Order Pending</option>
              <option value="Link Created">Link Created</option>
              <option value="Printing Pending">Printing Pending</option>
              <option value="Printing">Printing</option>
              <option value="Dispatched">Dispatched</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>

            <select
              value={filterCardType}
              onChange={(e) => setFilterCardType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white hover:bg-gray-50"
            >
              <option value="all">All Card Types</option>
              <option value="digital">Digital</option>
              <option value="physical">Physical</option>
              <option value="NFC">NFC</option>
            </select>
          </div>

          {/* Date Range Filter */}
          <div className="flex gap-2">
            <div>
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
            </div>
            <Button
              variant="outline"
              size="sm"
              className="self-end"
              onClick={() => {
                if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
                  alert('End date should be greater than or equal to start date.');
                  return;
                }
                exportOrdersToExcel(filteredOrders);
              }}
            >
              <Download className="w-4 h-4 mr-1 inline" /> Download Excel
            </Button>
          </div>
        </div>

        {/* Orders Table */}
        <Card>
          <CardHeader>
            <CardTitle>Orders List</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredOrders.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No orders found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left px-4 py-3 font-semibold text-gray-700">Order ID</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-700">User</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-700">Plan</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-700">Card Type</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-700">Qty</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-700">Amount</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-700">Status</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-700">Date</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order) => (
                      <tr key={order._id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-4 py-3 text-gray-900 font-medium">{order._id?.slice(-6).toUpperCase()}</td>
                        <td className="px-4 py-3">
                          <div>
                            <p className="text-gray-900">{order.userId?.name}</p>
                            <p className="text-xs text-gray-500">{order.userId?.email}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-700">{order.planId?.title}</td>
                        <td className="px-4 py-3">
                          <Badge className={CARD_TYPE_COLORS[order.cardType] || 'bg-gray-100 text-gray-800'}>
                            {order.cardType}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-gray-700">{order.orderDetails?.quantity}</td>
                        <td className="px-4 py-3 text-gray-900 font-semibold">₹{order.orderDetails?.totalAmount?.toFixed(2) || 0}</td>
                        <td className="px-4 py-3">
                          <Badge className={STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-800'}>
                            {order.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-gray-600 text-xs">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setSelectedOrder(order);
                                setShowOrderModal(true);
                              }}
                              className="h-8 w-8 p-0"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            {getValidStatusTransitions(order).length > 0 && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  setSelectedOrder(order);
                                  setStatusInput('');
                                  setAdminNotes('');
                                  setShowStatusModal(true);
                                }}
                                className="h-8 w-8 p-0"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                            )}
                            {order.status === 'Order Pending' && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDeleteOrder(order._id)}
                                className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
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

      {/* Order Details Modal */}
      {showOrderModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Order Details</h2>
                <button
                  onClick={() => setShowOrderModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Order ID</p>
                    <p className="font-semibold">{selectedOrder._id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Date</p>
                    <p className="font-semibold">{new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">User</p>
                    <p className="font-semibold">{selectedOrder.userId?.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-semibold">{selectedOrder.userId?.email}</p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-3">Order Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Plan</p>
                      <p className="font-semibold">{selectedOrder.planId?.title}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Card Type</p>
                      <p className="font-semibold">{selectedOrder.cardType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Quantity</p>
                      <p className="font-semibold">{selectedOrder.orderDetails?.quantity}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Amount</p>
                      <p className="font-semibold">₹{selectedOrder.orderDetails?.totalAmount?.toFixed(2)}</p>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-3">Status</h3>
                  <Badge className={STATUS_COLORS[selectedOrder.status] || 'bg-gray-100 text-gray-800'}>
                    {selectedOrder.status}
                  </Badge>
                </div>

                {/* Timeline/History */}
                {selectedOrder.history && selectedOrder.history.length > 0 && (
                  <div className="border-t pt-4">
                    <h3 className="font-semibold mb-4">Order Timeline</h3>
                    <div className="space-y-4">
                      {selectedOrder.history.map((event, index) => (
                        <div key={index} className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                            {index < selectedOrder.history.length - 1 && (
                              <div className="w-0.5 h-16 bg-gray-300 mt-2"></div>
                            )}
                          </div>
                          <div className="pb-4">
                            <p className="font-semibold text-gray-900">{event.status}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(event.changedAt).toLocaleString()}
                            </p>
                            <p className="text-xs text-gray-600 mt-1">
                              Changed by: <span className="font-semibold">{event.changedBy}</span>
                            </p>
                            {event.reason && (
                              <p className="text-sm text-gray-600 mt-1">{event.reason}</p>
                            )}
                            {event.notes && (
                              <p className="text-sm text-gray-600 mt-1 italic">"{event.notes}"</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedOrder.digitalLink?.url && (
                  <div className="border-t pt-4">
                    <h3 className="font-semibold mb-3">Digital Link</h3>
                    <a 
                      href={selectedOrder.digitalLink.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline text-sm break-all"
                    >
                      {selectedOrder.digitalLink.url}
                    </a>
                    {selectedOrder.digitalLink.expiresAt && (
                      <p className="text-xs text-gray-600 mt-2">
                        Expires: {new Date(selectedOrder.digitalLink.expiresAt).toLocaleDateString()}
                      </p>
                    )}
                    {selectedOrder.digitalLink.accessCount !== undefined && (
                      <p className="text-xs text-gray-600 mt-1">
                        Access Count: {selectedOrder.digitalLink.accessCount}
                      </p>
                    )}
                  </div>
                )}

                {selectedOrder.shippingAddress && Object.keys(selectedOrder.shippingAddress).length > 0 && (
                  <div className="border-t pt-4">
                    <h3 className="font-semibold mb-3">Shipping Address</h3>
                    {selectedOrder.shippingAddress.fullName && (
                      <p className="text-sm text-gray-700 font-medium">{selectedOrder.shippingAddress.fullName}</p>
                    )}
                    {selectedOrder.shippingAddress.email && (
                      <p className="text-sm text-gray-700">{selectedOrder.shippingAddress.email}</p>
                    )}
                    {selectedOrder.shippingAddress.phone && (
                      <p className="text-sm text-gray-700">{selectedOrder.shippingAddress.phone}</p>
                    )}
                    {selectedOrder.shippingAddress.addressLine1 && (
                      <p className="text-sm text-gray-700">{selectedOrder.shippingAddress.addressLine1}</p>
                    )}
                    {selectedOrder.shippingAddress.addressLine2 && (
                      <p className="text-sm text-gray-700">{selectedOrder.shippingAddress.addressLine2}</p>
                    )}
                    {(selectedOrder.shippingAddress.city || selectedOrder.shippingAddress.state || selectedOrder.shippingAddress.zipCode) && (
                      <p className="text-sm text-gray-700">
                        {selectedOrder.shippingAddress.city && selectedOrder.shippingAddress.city}{selectedOrder.shippingAddress.state && `, ${selectedOrder.shippingAddress.state}`}{selectedOrder.shippingAddress.zipCode && ` ${selectedOrder.shippingAddress.zipCode}`}
                      </p>
                    )}
                    {selectedOrder.shippingAddress.country && (
                      <p className="text-sm text-gray-700">{selectedOrder.shippingAddress.country}</p>
                    )}
                  </div>
                )}

                {selectedOrder.trackingDetails && typeof selectedOrder.trackingDetails === 'object' && (selectedOrder.trackingDetails.trackingNumber || selectedOrder.trackingDetails.carrier || selectedOrder.trackingDetails.estimatedDelivery) && (
                  <div className="border-t pt-4">
                    <h3 className="font-semibold mb-3">Tracking Details</h3>
                    {selectedOrder.trackingDetails.trackingNumber && (
                      <div className="mb-2">
                        <p className="text-xs text-gray-600">Tracking Number</p>
                        <p className="font-semibold text-sm">{selectedOrder.trackingDetails.trackingNumber}</p>
                      </div>
                    )}
                    {selectedOrder.trackingDetails.carrier && (
                      <div className="mb-2">
                        <p className="text-xs text-gray-600">Carrier</p>
                        <p className="font-semibold text-sm">{selectedOrder.trackingDetails.carrier}</p>
                      </div>
                    )}
                    {selectedOrder.trackingDetails.estimatedDelivery && (
                      <div>
                        <p className="text-xs text-gray-600">Estimated Delivery</p>
                        <p className="font-semibold text-sm">{new Date(selectedOrder.trackingDetails.estimatedDelivery).toLocaleDateString()}</p>
                      </div>
                    )}
                  </div>
                )}

                {selectedOrder.notes && (
                  <div className="border-t pt-4">
                    <h3 className="font-semibold mb-2">Notes</h3>
                    <p className="text-sm text-gray-700">{selectedOrder.notes}</p>
                  </div>
                )}
              </div>

              <div className="mt-6 flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowOrderModal(false)}
                  className="flex-1"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Status Update Modal */}
      {showStatusModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Update Order Status</h2>
                <button
                  onClick={() => setShowStatusModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Current Status</p>
                  <Badge className={STATUS_COLORS[selectedOrder.status] || 'bg-gray-100 text-gray-800'}>
                    {selectedOrder.status}
                  </Badge>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Status
                  </label>
                  <select
                    value={statusInput}
                    onChange={(e) => setStatusInput(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white"
                  >
                    <option value="">-- Select Status --</option>
                    {getValidStatusTransitions(selectedOrder).map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Admin Notes (Optional)
                  </label>
                  <textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Add any notes about this status update..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 resize-none"
                    rows="3"
                  />
                </div>
              </div>

              <div className="mt-6 flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowStatusModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleStatusUpdate}
                  disabled={!statusInput}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Update Status
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
