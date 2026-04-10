import { useState, useEffect } from 'react';
import { equipmentApi } from '@/api/equipmentApi';
import { departmentApi } from '@/api';
import { Equipment, Department } from '@/types';
import { Button, Input, Modal } from '@/components/ui';
import { Loader2 } from 'lucide-react';

interface EquipmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  equipment: Equipment | null;
}

export default function EquipmentModal({ isOpen, onClose, onSuccess, equipment }: EquipmentModalProps) {
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    serialNumber: '',
    status: 'OPERATIONAL',
    location: '',
    departmentId: 0,
  });

  // Load departments on mount
  useEffect(() => {
    departmentApi.getAll().then(setDepartments).catch(() => setDepartments([]));
  }, []);

  useEffect(() => {
    if (equipment) {
      setFormData({
        name: equipment.name,
        serialNumber: equipment.serialNumber,
        status: equipment.status,
        location: equipment.location,
        departmentId: equipment.departmentId,
      });
    } else {
      setFormData({
        name: '',
        serialNumber: '',
        status: 'OPERATIONAL',
        location: '',
        departmentId: departments.length > 0 ? departments[0].departmentId : 0,
      });
    }
  }, [equipment, isOpen, departments]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.departmentId || formData.departmentId === 0) {
      alert('Please select a department.');
      return;
    }
    try {
      setLoading(true);
      // Ensure departmentId is always sent as a number
      const payload = {
        ...formData,
        departmentId: Number(formData.departmentId),
      };
      if (equipment) {
        await equipmentApi.update(equipment.equipmentId, payload);
      } else {
        await equipmentApi.create(payload);
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      if (err.response?.data?.message) {
          alert(`Error: ${err.response.data.message}`);
      } else {
          alert('Failed to save equipment. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={equipment ? "Edit Equipment" : "Add Equipment"}
      className="p-8 max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Equipment Name</label>
            <Input 
                required 
                value={formData.name} 
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, name: e.target.value})}
                placeholder="e.g., Philips Ventilator G500"
                className="h-11"
            />
        </div>

        <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Serial Number</label>
                <Input 
                    required 
                    value={formData.serialNumber} 
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, serialNumber: e.target.value})}
                    placeholder="SN-12345"
                    className="h-11 font-mono text-sm"
                />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Status</label>
                <select 
                    className="flex h-11 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 ring-offset-background"
                    value={formData.status}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({...formData, status: e.target.value})}
                >
                    <option value="OPERATIONAL">Operational</option>
                    <option value="UNDER_REPAIR">Under Repair</option>
                    <option value="ARCHIVED">Archived</option>
                </select>
            </div>
        </div>

        <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Department</label>
            <select
                required
                className="flex h-11 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 ring-offset-background"
                value={formData.departmentId}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setFormData({ ...formData, departmentId: Number(e.target.value) })
                }
            >
                <option value={0} disabled>Select a department</option>
                {departments.map((d) => (
                    <option key={d.departmentId} value={d.departmentId}>
                        {d.departmentName}
                    </option>
                ))}
            </select>
        </div>

        <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Location / Ward</label>
            <Input 
                required 
                value={formData.location} 
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, location: e.target.value})}
                placeholder="e.g., ICU Ward 3, Floor 2"
                className="h-11"
            />
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t border-border/50">
          <Button type="button" variant="ghost" onClick={onClose} className="font-bold">Cancel</Button>
          <Button type="submit" disabled={loading} className="font-bold min-w-[120px]">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Equipment"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
