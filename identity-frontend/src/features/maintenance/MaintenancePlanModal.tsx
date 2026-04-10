import { useState, useEffect } from 'react';
import { Modal, Button, Input, Label } from '@/components/ui';
import { equipmentApi } from '@/api/equipmentApi';
import { Equipment, MaintenancePlan } from '@/types';
import { Loader2 } from 'lucide-react';

interface MaintenancePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  plan?: MaintenancePlan;
}

export default function MaintenancePlanModal({ isOpen, onClose, onSuccess, plan }: MaintenancePlanModalProps) {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<Partial<MaintenancePlan>>({
    name: '',
    equipmentId: 0,
    intervalValue: 30,
    intervalUnit: 'DAY',
    frequency: 'MONTHLY',
    status: 'ACTIVE',
    technicianName: ''
  });

  useEffect(() => {
    if (isOpen) {
      fetchEquipment();
      if (plan) {
        setFormData({
          name: plan.name ?? '',
          equipmentId: plan.equipmentId ?? 0,
          intervalValue: plan.intervalValue ?? 30,
          intervalUnit: plan.intervalUnit ?? 'DAY',
          frequency: plan.frequency ?? 'MONTHLY',
          status: plan.status ?? 'ACTIVE',
          technicianName: plan.technicianName ?? ''
        });
      } else {
        setFormData({ name: '', equipmentId: 0, intervalValue: 30, intervalUnit: 'DAY', frequency: 'MONTHLY', status: 'ACTIVE', technicianName: '' });
      }
    }
  }, [isOpen, plan]);

  const fetchEquipment = async () => {
    try {
      setLoading(true);
      const data = await equipmentApi.getAll();
      setEquipment(data);
      if (data.length > 0 && !formData.equipmentId) {
        setFormData(prev => ({ ...prev, equipmentId: data[0].equipmentId }));
      }
    } catch (err) {
      console.error('Failed to fetch equipment', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      if (plan) {
        await equipmentApi.updateMaintenancePlan(plan.planId, formData);
      } else {
        await equipmentApi.createMaintenancePlan(formData);
      }
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Failed to save plan', err);
      alert('Failed to save maintenance plan');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={plan ? 'Edit Maintenance Plan' : 'Create Maintenance Plan'}>
      <form onSubmit={handleSubmit} className="space-y-4 pt-4">
        <div className="space-y-2">
          <Label htmlFor="name">Plan Name</Label>
          <Input 
            id="name" 
            placeholder="e.g. Quarterly HVAC Cleaning" 
            value={formData.name} 
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            required 
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="equipment">Target Equipment</Label>
          {loading ? (
            <div className="h-10 flex items-center px-3 border rounded-md">
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Loading equipment...
            </div>
          ) : (
            <select 
              id="equipment"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={formData.equipmentId ?? ''}
              onChange={e => setFormData({ ...formData, equipmentId: e.target.value ? parseInt(e.target.value) : 0 })}
              required
            >
              <option value="">Select Equipment</option>
              {equipment.map(eq => (
                <option key={eq.equipmentId} value={eq.equipmentId}>{eq.name} ({eq.serialNumber})</option>
              ))}
            </select>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="interval">Interval Value</Label>
            <Input 
              id="interval" 
              type="number"
              value={formData.intervalValue ?? ''}
              onChange={e => setFormData({ ...formData, intervalValue: e.target.value ? parseInt(e.target.value) : 0 })}
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="unit">Interval Unit</Label>
            <select 
              id="unit"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={formData.intervalUnit ?? 'DAY'}
              onChange={e => setFormData({ ...formData, intervalUnit: e.target.value })}
            >
              <option value="DAY">Days</option>
              <option value="WEEK">Weeks</option>
              <option value="MONTH">Months</option>
              <option value="YEAR">Years</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="frequency">Frequency Label</Label>
            <select 
              id="frequency"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={formData.frequency ?? 'MONTHLY'}
              onChange={e => setFormData({ ...formData, frequency: e.target.value })}
            >
              <option value="DAILY">Daily</option>
              <option value="WEEKLY">Weekly</option>
              <option value="MONTHLY">Monthly</option>
              <option value="QUARTERLY">Quarterly</option>
              <option value="ANNUALLY">Annually</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Plan Status</Label>
            <select 
              id="status"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={formData.status ?? 'ACTIVE'}
              onChange={e => setFormData({ ...formData, status: e.target.value })}
            >
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="DRAFT">Draft</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="technician">Assign Technician</Label>
          <Input 
            id="technician" 
            placeholder="e.g. John Doe or 'Auto-assign'" 
            value={formData.technicianName ?? ''}
            onChange={e => setFormData({ ...formData, technicianName: e.target.value })}
          />
        </div>

        <div className="flex justify-end gap-3 pt-6">
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" disabled={submitting}>
            {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {plan ? 'Save Changes' : 'Create Plan'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
