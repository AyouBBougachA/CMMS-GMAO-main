import { useState } from 'react';
import { Modal, Button, Input, Label } from '@/components/ui';
import { equipmentApi } from '@/api/equipmentApi';
import { Meter } from '@/types';
import { Loader2, TrendingUp } from 'lucide-react';

interface MeterReadingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  meter: Meter;
}

export default function MeterReadingModal({ isOpen, onClose, onSuccess, meter }: MeterReadingModalProps) {
  const [value, setValue] = useState<number>(meter.value || 0);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await equipmentApi.recordMeterLog(meter.meterId, value);
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Failed to record reading', err);
      alert('Failed to record new reading');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Update ${meter.name}`} className="max-w-md">
      <div className="p-6 pt-2 space-y-6">
        <div className="flex items-center gap-4 p-4 rounded-xl bg-primary/5 border border-primary/10">
          <TrendingUp className="w-8 h-8 text-primary" />
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-primary/60 mb-1">Previous Value</p>
            <p className="text-xl font-black text-slate-900">{meter.value} <span className="text-sm font-bold text-slate-400">{meter.unit}</span></p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="new-value">New Reading ({meter.unit})</Label>
            <Input 
              id="new-value" 
              type="number" 
              step="any"
              autoFocus
              className="text-2xl h-14 font-black text-center"
              value={value} 
              onChange={e => setValue(parseFloat(e.target.value))}
              required 
            />
            {meter.meterType === 'ODOMETER' && value < (meter.value || 0) && (
              <p className="text-xs font-bold text-amber-600">Note: New reading is lower than previous. Odometer should only increase.</p>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
            <Button type="submit" className="flex-1 font-bold" disabled={submitting}>
              {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Update Value
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
