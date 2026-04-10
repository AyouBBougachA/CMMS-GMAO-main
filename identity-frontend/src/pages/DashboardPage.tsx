import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui';
import { Users, UserCog, Building2, Activity, Loader2, ShieldCheck, Clock, User, AlertCircle, Trash2, Key } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { userApi, roleApi, departmentApi, auditLogApi } from '@/api';
import { AuditLog } from '@/types';
import { cn } from '@/lib/utils';

export default function DashboardPage() {
  const { user: currentUser } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState({
    users: 0,
    roles: 0,
    departments: 0
  });
  const [recentLogs, setRecentLogs] = useState<AuditLog[]>([]);
  const [securityLogs, setSecurityLogs] = useState<AuditLog[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [users, roles, depts, logs, security] = await Promise.all([
          userApi.getAll(),
          roleApi.getAll(),
          departmentApi.getAll(),
          auditLogApi.getRecentLogs(5),
          auditLogApi.getSecurityLogs(5)
        ]);
        
        setCounts({
          users: users.length,
          roles: roles.length,
          departments: depts.length
        });
        setRecentLogs(logs);
        setSecurityLogs(security);
      } catch (err) {
        console.error("Failed to fetch dashboard metrics", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const stats = [
    { name: 'Total Users', value: counts.users.toString(), icon: Users, color: 'text-blue-600' },
    { name: 'Active Roles', value: counts.roles.toString(), icon: UserCog, color: 'text-indigo-600' },
    { name: 'Departments', value: counts.departments.toString(), icon: Building2, color: 'text-emerald-600' },
    { name: 'System Status', value: 'Healthy', icon: Activity, color: 'text-amber-500' },
  ];

  const getLogIcon = (type: string) => {
    switch (type) {
      case 'LOGIN': return <Key className="w-3.5 h-3.5 text-blue-500" />;
      case 'LOGIN_FAILED': return <AlertCircle className="w-3.5 h-3.5 text-red-500" />;
      case 'DELETE_USER':
      case 'DELETE_ROLE':
      case 'DELETE_DEPT': return <Trash2 className="w-3.5 h-3.5 text-red-600" />;
      case 'CREATE_USER':
      case 'CREATE_ROLE':
      case 'CREATE_DEPT': return <Users className="w-3.5 h-3.5 text-emerald-500" />;
      default: return <Activity className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  const formatLogDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-1">
        <h2 className="text-3xl font-bold tracking-tight text-foreground">
            Welcome back, <span className="text-primary">{currentUser?.fullName?.split(' ')[0] || 'Admin'}</span>
        </h2>
        <p className="text-muted-foreground">Real-time system overview and identity metrics.</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name} className="bg-card shadow-sm border-border/60 hover:shadow-md transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {stat.name}
              </CardTitle>
              <stat.icon className={cn("h-4 w-4", stat.color)} />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
              ) : (
                <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 bg-card border-border/60 shadow-sm flex flex-col overflow-hidden">
          <CardHeader className="border-b border-border/40 pb-4">
            <div className="flex items-center justify-between">
                <div>
                    <CardTitle className="text-lg font-bold">System Activity</CardTitle>
                    <CardDescription>Latest synchronized audit logs.</CardDescription>
                </div>
                <div className="p-2 bg-slate-50 rounded-lg border border-border/40">
                    <Clock className="w-4 h-4 text-slate-400" />
                </div>
            </div>
          </CardHeader>
          <CardContent className="flex-1 p-0">
            {loading ? (
                <div className="h-[300px] flex items-center justify-center">
                    <Loader2 className="w-6 h-6 animate-spin text-primary/30" />
                </div>
            ) : recentLogs.length > 0 ? (
                <div className="divide-y divide-border/30">
                    {recentLogs.map((log) => (
                        <div key={log.id} className="group flex items-center gap-4 px-6 py-4 hover:bg-slate-50/50 transition-colors">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                                {getLogIcon(log.actionType)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-slate-900 group-hover:text-primary transition-colors">
                                    {log.details}
                                </p>
                                <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                                    <span className="uppercase font-bold text-[10px] tracking-wider bg-slate-100 px-1.5 py-0.5 rounded text-slate-500">
                                        {log.actionType.replace('_', ' ')}
                                    </span>
                                    • {formatLogDate(log.createdAt)}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="h-[300px] flex flex-col items-center justify-center text-muted-foreground p-6">
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 mb-4">
                        <User className="w-6 h-6 text-slate-300" />
                    </div>
                    <p className="text-sm font-bold text-slate-900">No recent activity</p>
                    <p className="text-xs text-slate-500 mt-1">Actions will appear here once recorded.</p>
                </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="col-span-3 bg-card border-border/60 shadow-sm flex flex-col overflow-hidden">
          <CardHeader className="border-b border-border/40 pb-4">
            <div className="flex items-center justify-between">
                <div>
                    <CardTitle className="text-lg font-bold">Security Overview</CardTitle>
                    <CardDescription>Critical administrative alerts.</CardDescription>
                </div>
                <div className="p-2 bg-red-50 rounded-lg border border-red-100">
                    <ShieldCheck className="w-4 h-4 text-red-500" />
                </div>
            </div>
          </CardHeader>
          <CardContent className="flex-1 p-0">
             {loading ? (
                <div className="h-[300px] flex items-center justify-center">
                    <Loader2 className="w-6 h-6 animate-spin text-primary/30" />
                </div>
            ) : securityLogs.length > 0 ? (
                <div className="divide-y divide-border/30">
                    {securityLogs.map((log) => (
                        <div key={log.id} className="flex items-start gap-3 px-6 py-4 bg-red-50/10">
                            <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-slate-900 leading-tight">
                                    {log.details}
                                </p>
                                <p className="text-[10px] font-bold text-red-600/70 uppercase tracking-widest mt-1">
                                    {formatLogDate(log.createdAt)} • ACTION: {log.actionType}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="h-[300px] flex flex-col items-center justify-center p-8 text-center">
                    <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center border border-emerald-100 mb-4">
                        <ShieldCheck className="w-7 h-7 text-emerald-500/60" />
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm font-bold text-slate-900">System Secure</p>
                        <p className="text-xs text-slate-500 max-w-[200px] leading-relaxed">
                            System is currently stable with no pending security alerts or risks detected.
                        </p>
                    </div>
                    <div className="mt-6 px-3 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-widest rounded-full border border-emerald-100">
                        Stable
                    </div>
                </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
