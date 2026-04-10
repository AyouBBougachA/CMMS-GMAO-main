import { useState, useEffect } from 'react';
import { Modal, Button, Input, Label } from '@/components/ui';
import { equipmentApi } from '@/api/equipmentApi';
import { Equipment, Meter } from '@/types';
import { Loader2 } from 'lucide-react';

interface MeterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  meter?: Meter;
}

export default function MeterModal({ isOpen, onClose, onSuccess, meter }: MeterModalProps) {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<Partial<Meter>>({
    name: '',
    unit: '',
    meterType: 'ODOMETER',
    equipmentId: 0,
    value: 0
  });

  useEffect(() => {
    if (isOpen) {
      fetchEquipment();
      if (meter) {
        setFormData({
          name: meter.name,
          unit: meter.unit,
          meterType: meter.meterType,
          equipmentId: meter.equipmentId,
          value: meter.value
        });
      } else {
        setFormData({ name: '', unit: '', meterType: 'ODOMETER', equipmentId: 0, value: 0 });
      }
    }
  }, [isOpen, meter]);

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
      if (meter) {
        await equipmentApi.updateMeter(meter.meterId, formData);
      } else {
        await equipmentApi.createMeter(formData);
      }
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Failed to save meter', err);
      alert('Failed to save meter');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={meter ? 'Edit Meter' : 'Add New Meter'}>
      <form onSubmit={handleSubmit} className="space-y-4 pt-4">
        <div className="space-y-2">
          <Label htmlFor="name">Meter Name</Label>
          <Input 
            id="name" 
            placeholder="e.g. Total Run Hours" 
            value={formData.name} 
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            required 
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="unit">Unit</Label>
            <Input 
              id="unit" 
              placeholder="e.g. Hours, km, °C" 
              value={formData.unit} 
              onChange={e => setFormData({ ...formData, unit: e.target.value })}
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Meter Type</Label>
            <select 
              id="type"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={formData.meterType}
              onChange={e => setFormData({ ...formData, meterType: e.target.value })}
            >
              <option value="ODOMETER">Odometer (Cumulative)</option>
              <option value="GAUGE">Gauge (Instantaneous)</option>
              <option value="TEMPERATURE">Temperature</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="equipment">Associated Equipment</Label>
          {loading ? (
            <div className="h-10 flex items-center px-3 border rounded-md">
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Loading equipment...
            </div>
          ) : (
            <select 
              id="equipment"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={formData.equipmentId}
              onChange={e => setFormData({ ...formData, equipmentId: parseInt(e.target.value) })}
              required
            >
              <option value="">Select Equipment</option>
              {equipment.map(eq => (
                <option key={eq.equipmentId} value={eq.equipmentId}>{eq.name} ({eq.serialNumber})</option>
              ))}
            </select>
          )}
        </div>

        {!meter && (
          <div className="space-y-2">
            <Label htmlFor="initial-value">Initial Reading</Label>
            <Input 
              id="initial-value" 
              type="number" 
              step="any"
              value={formData.value} 
              onChange={e => setFormData({ ...formData, value: parseFloat(e.target.value) })}
              required 
            />
          </div>
        )}

        <div className="flex justify-end gap-3 pt-6">
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" disabled={submitting}>
            {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {meter ? 'Save Changes' : 'Register Meter'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
