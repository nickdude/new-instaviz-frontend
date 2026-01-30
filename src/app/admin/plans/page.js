'use client';

import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAdminPlans } from '@/hooks/useAdminPlans';
import { PlanModal } from '@/components/PlanModal';
import { Edit2, Trash2, ToggleLeft } from 'lucide-react';

export default function AdminPlansPage() {
  const { getPlans, createPlan, updatePlan, togglePlanStatus, deletePlan, loading } = useAdminPlans();
  const [plans, setPlans] = useState([]);
  const [actionLoading, setActionLoading] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);

  const loadPlansData = async () => {
    try {
      const response = await getPlans();
      setPlans(response?.data || []);
    } catch (err) {
      setPlans([]);
    }
  };

  useEffect(() => {
    loadPlansData();
  }, [getPlans]);

  const handleOpenModal = (plan = null) => {
    setEditingPlan(plan);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingPlan(null);
  };

  const handleSavePlan = async (planData) => {
    setActionLoading('save');
    try {
      if (editingPlan?._id) {
        await updatePlan(editingPlan._id, planData);
      } else {
        await createPlan(planData);
      }
      await loadPlansData();
      handleCloseModal();
    } catch (err) {
      console.error('Error saving plan:', err.message);
    } finally {
      setActionLoading('');
    }
  };

  const handleToggleStatus = async (planId, currentStatus) => {
    setActionLoading(`toggle-${planId}`);
    try {
      const response = await togglePlanStatus(planId);
      setPlans((prev) =>
        prev.map((plan) =>
          plan._id === planId ? { ...plan, isActive: response.data.isActive } : plan
        )
      );
    } catch (err) {
      console.error('Error toggling plan status:', err.message);
    } finally {
      setActionLoading('');
    }
  };

  const handleDelete = async (planId) => {
    if (!confirm('Are you sure you want to delete this plan?')) return;

    setActionLoading(`delete-${planId}`);
    try {
      await deletePlan(planId);
      setPlans((prev) => prev.filter((plan) => plan._id !== planId));
    } catch (err) {
      console.error('Error deleting plan:', err.message);
    } finally {
      setActionLoading('');
    }
  };

  return (
    <>
      <div className="px-8 py-8 w-full">
        <div className="flex flex-col gap-2 mb-6">
          <Badge variant="secondary" className="w-fit">Plans Management</Badge>
          <h1 className="text-3xl font-semibold text-gray-900">All Plans</h1>
          <p className="text-sm text-gray-500">Manage subscription plans and pricing.</p>
        </div>

        <div className="flex justify-end mb-6">
          <Button onClick={() => handleOpenModal()} className="bg-blue-600 hover:bg-blue-700">
            + Add New Plan
          </Button>
        </div>

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-64 rounded-xl bg-white border border-gray-200 animate-pulse" />
            ))}
          </div>
        ) : plans.length === 0 ? (
          <Card>
            <CardContent className="py-8">
              <p className="text-center text-gray-500">No plans found. Create one to get started.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {plans.map((plan) => (
              <Card key={plan._id} className={!plan.isActive ? 'opacity-60' : ''}>
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{plan.title}</CardTitle>
                      <p className="text-xs text-gray-500 mt-1">{plan.durationDays} days</p>
                    </div>
                    <Badge className={plan.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
                      {plan.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase">Pricing</p>
                    <div className="flex gap-4 mt-2">
                      <div>
                        <p className="text-sm text-gray-600">₹{plan.price?.rupees}</p>
                        <p className="text-xs text-gray-400">INR</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">${plan.price?.dollar}</p>
                        <p className="text-xs text-gray-400">USD</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase">Features</p>
                    <ul className="mt-2 space-y-1">
                      {plan.features?.slice(0, 2).map((feature, i) => (
                        <li key={i} className="text-xs text-gray-600">• {feature}</li>
                      ))}
                      {plan.features?.length > 2 && (
                        <li className="text-xs text-gray-500">+ {plan.features.length - 2} more</li>
                      )}
                    </ul>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleStatus(plan._id, plan.isActive)}
                      disabled={actionLoading === `toggle-${plan._id}`}
                      className="flex-1"
                    >
                      <ToggleLeft size={14} className="mr-1" />
                      {actionLoading === `toggle-${plan._id}` ? '...' : (plan.isActive ? 'Disable' : 'Enable')}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenModal(plan)}
                      className="flex-1"
                    >
                      <Edit2 size={14} className="mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(plan._id)}
                      disabled={actionLoading === `delete-${plan._id}`}
                      className="flex-1 text-red-600 hover:text-red-700"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <PlanModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSavePlan}
        plan={editingPlan}
        loading={actionLoading === 'save'}
      />
    </>
  );
}
