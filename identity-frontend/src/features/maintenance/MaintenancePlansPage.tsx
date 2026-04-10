import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui';
import { Settings, Plus, Search, Calendar, ShieldCheck, Clock, User, AlertCircle, Loader2, ChevronRight } from 'lucide-react';
import { equipmentApi } from '@/api/equipmentApi';
import { MaintenancePlan } from '@/types';
import { Button } from '@/components/ui';
import MaintenancePlanModal from './MaintenancePlanModal';

export default function MaintenancePlansPage() {
  const [plans, setPlans] = useState<MaintenancePlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<MaintenancePlan | null>(null);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const data = await equipmentApi.getMaintenancePlans();
      setPlans(data);
    } catch (err) {
      console.error('Failed to fetch plans', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleCreateNew = () => {
    setSelectedPlan(null);
    setIsModalOpen(true);
  };

  const handleEditPlan = (plan: MaintenancePlan) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  const filteredPlans = plans.filter(plan => 
    plan.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    plan.equipmentId?.toString().includes(searchQuery)
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE': return <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest rounded-full border border-emerald-200">Active</span>;
      case 'INACTIVE': return <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-black uppercase tracking-widest rounded-full border border-slate-200">Inactive</span>;
      case 'EXPIRED': return <span className="px-2 py-0.5 bg-red-100 text-red-700 text-[10px] font-black uppercase tracking-widest rounded-full border border-red-200">Expired</span>;
      default: return <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-black uppercase tracking-widest rounded-full border border-slate-200">{status}</span>;
    }
  };

  return (
    <>
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <h2 className="text-3xl font-black tracking-tighter text-foreground decoration-primary decoration-4 flex items-center gap-2">
           Preventative Maintenance
          </h2>
          <p className="text-muted-foreground font-medium">Standardized maintenance plans and scheduling.</p>
        </div>
        <Button className="flex items-center gap-2 font-bold shadow-lg shadow-primary/20" onClick={handleCreateNew}>
          <Plus className="w-4 h-4" />
          Create Plan
        </Button>
      </div>

      <div className="flex items-center gap-3 bg-card/50 backdrop-blur-sm p-4 rounded-2xl border border-border/80 shadow-md ring-1 ring-white/10">
        <Search className="w-5 h-5 text-muted-foreground/60 ml-2" />
        <input 
          type="text" 
          placeholder="Search by plan name or target identifier..." 
          className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-semibold placeholder:text-muted-foreground/40"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="flex gap-2 mr-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 px-2 py-1 bg-muted/30 rounded border border-border/50">Filter</span>
        </div>
      </div>

      {loading ? (
        <div className="h-64 flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary/30" />
          <p className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/50 animate-pulse">Synchronizing Plans</p>
        </div>
      ) : filteredPlans.length > 0 ? (
        <div className="grid gap-6">
          {filteredPlans.map((plan) => (
            <Card key={plan.planId} className="group bg-card hover:bg-slate-50/50 transition-all border-border/80 shadow-sm overflow-hidden border-l-4 border-l-primary/10 hover:border-l-primary/60">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row md:items-center">
                    <div className="p-6 flex-1 space-y-4">
                        <div className="flex items-start justify-between">
                            <div className="space-y-1">
                                <div className="flex items-center gap-3 mb-1">
                                    <h3 className="text-xl font-bold tracking-tight text-slate-800">{plan.name}</h3>
                                    {getStatusBadge(plan.status || 'ACTIVE')}
                                </div>
                                <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                    <ShieldCheck className="w-4 h-4 text-primary/50" />
                                    Interval: Every {plan.intervalValue} {plan.intervalUnit?.toLowerCase()}s
                                </p>
                            </div>
                            <Button variant="ghost" size="icon" className="group-hover:translate-x-1 transition-transform" onClick={() => handleEditPlan(plan)}>
                                <ChevronRight className="w-5 h-5 text-muted-foreground" />
                            </Button>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-2">
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Last Performed</p>
                                <p className="text-xs font-bold text-slate-600 flex items-center gap-1.5 leading-none">
                                    <Clock className="w-3.5 h-3.5 opacity-50" />
                                    {plan.lastPerformedAt ? new Date(plan.lastPerformedAt).toLocaleDateString() : 'N/A'}
                                </p>
                            </div>
                             <div className="space-y-1">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Next Due</p>
                                <p className="text-xs font-bold text-emerald-600 flex items-center gap-1.5 leading-none">
                                    <Calendar className="w-3.5 h-3.5 opacity-50" />
                                    {plan.nextDueAt ? new Date(plan.nextDueAt).toLocaleDateString() : 'Not scheduled'}
                                </p>
                            </div>
                             <div className="space-y-1">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Responsible</p>
                                <p className="text-xs font-bold text-slate-600 flex items-center gap-1.5 leading-none">
                                    <User className="w-3.5 h-3.5 opacity-50" />
                                    {plan.technicianName || 'Auto-Assign'}
                                </p>
                            </div>
                             <div className="space-y-1 text-right">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Target ID</p>
                                <p className="text-xs font-black text-slate-900 border-b-2 border-slate-900 leading-none inline-block">
                                   #EQ-{plan.equipmentId || '0000'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-dashed border-2 bg-transparent/20 rounded-3xl group">
          <CardContent className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform shadow-inner">
              <Settings className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tighter">No Maintenance Plans</h3>
            <p className="text-sm font-medium text-slate-500 max-w-xs mt-2">
              Optimize equipment longevity by setting up standardized maintenance schedules.
            </p>
            <div className="flex gap-3 mt-8">
                <Button variant="outline" className="px-8 font-bold border-2" onClick={() => setSearchQuery('')}>Reset</Button>
                <Button className="px-8 font-bold" onClick={handleCreateNew}>New Plan</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>

    <MaintenancePlanModal 
      isOpen={isModalOpen} 
      onClose={() => setIsModalOpen(false)} 
      onSuccess={fetchPlans} 
      plan={selectedPlan || undefined}
    />
  </>
);
}
