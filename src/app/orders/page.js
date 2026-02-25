'use client';

import { useState, useEffect } from 'react';
import {
  Search,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
  ShoppingBag,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UserNavbar } from '@/components/UserNavbar';
import DeliveryAddressModal from '@/components/DeliveryAddressModal';
import { useOrders } from '@/hooks/useOrders';

const STATUS_COLORS = {
  'Order Pending': 'bg-yellow-100 text-yellow-800',
  'Link Created': 'bg-green-100 text-green-800',
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

export default function MyOrdersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addressLoading, setAddressLoading] = useState(false);

  const { getOrders, updateOrder } = useOrders();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await getOrders();
      setOrders(response.data || []);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      alert(`Error fetching orders: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDeliveryAddress = async (addressData) => {
    try {
      setAddressLoading(true);
      await updateOrder(selectedOrder._id, {
        shippingAddress: addressData,
        status: 'Printing Pending'
      });
      
      // Refresh orders
      await fetchOrders();
      setShowAddressModal(false);
      alert('Delivery address saved successfully! Your order is now in printing queue.');
    } catch (error) {
      console.error('Failed to save delivery address:', error);
      alert(`Error saving address: ${error.message}`);
    } finally {
      setAddressLoading(false);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      order._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.planId?.title?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: orders.length,
    delivered: orders.filter(o => o.status === 'Delivered' || o.status === 'Link Created').length,
    pending: orders.filter(o => o.status === 'Order Pending').length,
    inProgress: orders.filter(o => ['Printing', 'Dispatched', 'Printing Pending'].includes(o.status)).length,
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Delivered':
      case 'Link Created':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'Order Pending':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'Cancelled':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-blue-600" />;
    }
  };

  if (loading) {
    return (
      <>
        <UserNavbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <p className="text-gray-500">Loading your orders...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <UserNavbar />
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-6xl px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <ShoppingBag className="w-8 h-8 text-blue-600" />
              <h1 className="text-4xl font-bold text-gray-900">My Orders</h1>
            </div>
            <p className="text-gray-600">Track and manage your card orders</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="border border-gray-200">
              <CardContent className="pt-6">
                <div className="flex flex-col gap-2">
                  <p className="text-sm font-medium text-gray-600">Total Orders</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border border-gray-200">
              <CardContent className="pt-6">
                <div className="flex flex-col gap-2">
                  <p className="text-sm font-medium text-gray-600">Delivered</p>
                  <p className="text-3xl font-bold text-green-600">{stats.delivered}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border border-gray-200">
              <CardContent className="pt-6">
                <div className="flex flex-col gap-2">
                  <p className="text-sm font-medium text-gray-600">In Progress</p>
                  <p className="text-3xl font-bold text-blue-600">{stats.inProgress}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border border-gray-200">
              <CardContent className="pt-6">
                <div className="flex flex-col gap-2">
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Search */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by Order ID or Plan name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border border-gray-300"
              />
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-0"
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
          </div>

          {/* Orders List */}
          {filteredOrders.length === 0 ? (
            <Card className="border border-gray-200">
              <CardContent className="py-12">
                <div className="text-center">
                  <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg font-medium">No orders found</p>
                  <p className="text-gray-400 mt-2">Create your first order to get started!</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <Card key={order._id} className="border border-gray-200 hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4 flex-col sm:flex-row">
                      <div className="flex-1 w-full">
                        <div className="flex items-center gap-3 mb-4">
                          {getStatusIcon(order.status)}
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              Order {order._id?.slice(-6).toUpperCase()}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {new Date(order.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                          <div>
                            <p className="text-xs font-medium text-gray-500 mb-1">Plan</p>
                            <p className="font-semibold text-gray-900 text-sm">{order.planId?.title}</p>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-gray-500 mb-1">Card Type</p>
                            <Badge variant="outline" className={CARD_TYPE_COLORS[order.cardType]}>
                              {order.cardType}
                            </Badge>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-gray-500 mb-1">Quantity</p>
                            <p className="font-semibold text-gray-900 text-sm">{order.orderDetails?.quantity}</p>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-gray-500 mb-1">Amount</p>
                            <p className="font-semibold text-gray-900 text-sm">₹{order.orderDetails?.totalAmount?.toFixed(2)}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-3 w-full sm:w-auto">
                        <Badge className={STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-800'}>
                          {order.status}
                        </Badge>

                        {/* Show address button for pending physical orders */}
                        {order.cardType === 'physical' && order.status === 'Order Pending' && (
                          <Button
                            size="sm"
                            className="bg-orange-600 hover:bg-orange-700 text-white"
                            onClick={() => {
                              setSelectedOrder(order);
                              setShowAddressModal(true);
                            }}
                          >
                            Add Address
                          </Button>
                        )}

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedOrder(order);
                            setShowOrderModal(true);
                          }}
                          className="border border-gray-300"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Order Details Modal with Timeline */}
      {showOrderModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-200">
            <CardHeader className="border-b border-gray-200 flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle>Order Details</CardTitle>
              <button
                onClick={() => setShowOrderModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
              >
                ✕
              </button>
            </CardHeader>

            <CardContent className="pt-6 space-y-6">
              {/* Basic Info */}
              <div>
                <h3 className="font-semibold text-lg mb-4 text-gray-900">Order Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Order ID</p>
                    <p className="font-semibold text-gray-900 mt-1">{selectedOrder._id}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Date</p>
                    <p className="font-semibold text-gray-900 mt-1">
                      {new Date(selectedOrder.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Plan</p>
                    <p className="font-semibold text-gray-900 mt-1">{selectedOrder.planId?.title}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Card Type</p>
                    <Badge variant="outline" className={CARD_TYPE_COLORS[selectedOrder.cardType]}>
                      {selectedOrder.cardType}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Quantity</p>
                    <p className="font-semibold text-gray-900 mt-1">{selectedOrder.orderDetails?.quantity}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Amount</p>
                    <p className="font-semibold text-gray-900 mt-1">₹{selectedOrder.orderDetails?.totalAmount?.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              {/* Current Status */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="font-semibold text-lg mb-3 text-gray-900">Current Status</h3>
                <Badge className={STATUS_COLORS[selectedOrder.status]}>
                  {selectedOrder.status}
                </Badge>
              </div>

              {/* Timeline/History */}
              {selectedOrder.history && selectedOrder.history.length > 0 && (
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="font-semibold text-lg mb-4 text-gray-900">Order Timeline</h3>
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
                          <p className="text-sm text-gray-500 mt-1">
                            {new Date(event.changedAt).toLocaleString()}
                          </p>
                          {event.reason && (
                            <p className="text-sm text-gray-600 mt-2">{event.reason}</p>
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

              {/* Shipping Address */}
              {selectedOrder.shippingAddress && Object.keys(selectedOrder.shippingAddress).length > 0 && (
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="font-semibold text-lg mb-3 text-gray-900">Shipping Address</h3>
                  <div className="text-sm text-gray-700 space-y-1 bg-gray-50 p-4 rounded-md">
                    {selectedOrder.shippingAddress.addressLine1 && (
                      <p>{selectedOrder.shippingAddress.addressLine1}</p>
                    )}
                    {selectedOrder.shippingAddress.addressLine2 && (
                      <p>{selectedOrder.shippingAddress.addressLine2}</p>
                    )}
                    {selectedOrder.shippingAddress.city && (
                      <p>
                        {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}{' '}
                        {selectedOrder.shippingAddress.zipCode}
                      </p>
                    )}
                    {selectedOrder.shippingAddress.country && (
                      <p>{selectedOrder.shippingAddress.country}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Digital Link */}
              {selectedOrder.status === 'Link Created' && selectedOrder.digitalLink && (
                <div className="border-t border-gray-200 pt-6 bg-green-50 p-4 rounded-lg border border-green-200">
                  <h3 className="font-semibold text-lg mb-3 text-gray-900">Your Digital Card</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Your digital card is ready! Click the button below to access it.
                  </p>
                  <a
                    href={selectedOrder.digitalLink.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition font-medium text-sm"
                  >
                    Access Digital Card
                  </a>
                  <p className="text-xs text-gray-500 mt-3">
                    Link expires: {new Date(selectedOrder.digitalLink.expiresAt).toLocaleDateString()}
                  </p>
                </div>
              )}

              {/* Tracking */}
              {selectedOrder.status === 'Dispatched' && selectedOrder.tracking?.trackingNumber && (
                <div className="border-t border-gray-200 pt-6 bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h3 className="font-semibold text-lg mb-3 text-gray-900">Tracking Information</h3>
                  <div className="space-y-2">
                    {selectedOrder.tracking.trackingNumber && (
                      <p className="text-sm text-gray-600">
                        <strong>Tracking Number:</strong> {selectedOrder.tracking.trackingNumber}
                      </p>
                    )}
                    {selectedOrder.tracking.carrier && (
                      <p className="text-sm text-gray-600">
                        <strong>Carrier:</strong> {selectedOrder.tracking.carrier}
                      </p>
                    )}
                    {selectedOrder.tracking.estimatedDelivery && (
                      <p className="text-sm text-gray-600">
                        <strong>Estimated Delivery:</strong>{' '}
                        {new Date(selectedOrder.tracking.estimatedDelivery).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Notes */}
              {selectedOrder.notes && (
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="font-semibold text-lg mb-3 text-gray-900">Your Notes</h3>
                  <p className="text-sm text-gray-700 bg-gray-50 p-4 rounded-md">{selectedOrder.notes}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="border-t border-gray-200 pt-6 flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowOrderModal(false)}
                  className="flex-1"
                >
                  Close
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Delivery Address Modal */}
      {showAddressModal && selectedOrder && (
        <DeliveryAddressModal
          order={selectedOrder}
          onSave={handleSaveDeliveryAddress}
          onCancel={() => setShowAddressModal(false)}
          loading={addressLoading}
        />
      )}
    </>
  );
}
