import { Navigate } from 'react-router-dom';
import { ArrowUpRight, CalendarCheck2, CheckCircle2, Clock3 } from 'lucide-react';
import Card from '../components/Card';
import DashboardLayout from '../layouts/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { activities, applications, requests, stats } from '../data/mockData';
import { getRoleDashboardPath } from '../utils/authRoutes';

export default function DashboardPage() {
  const { user } = useAuth();

  if (user?.role) {
    return <Navigate to={getRoleDashboardPath(user.role)} replace />;
  }

  return (
    <DashboardLayout title="Dashboard" subtitle="Monitor marketplace activity, proposals, and active AI work.">
      <div className="grid gap-5 md:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label} className="hover:shadow-soft">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-slate-500">{stat.label}</p>
                <p className="mt-3 text-4xl font-extrabold text-slate-950">{stat.value}</p>
              </div>
              <div className={`rounded-lg bg-gradient-to-br ${stat.tone} px-3 py-2 text-sm font-bold text-white`}>{stat.trend}</div>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Card className="hover:shadow-soft">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="font-display text-xl font-bold text-slate-950">Recent activity</h2>
              <p className="mt-1 text-sm text-slate-500">Fresh movement across requests and proposals.</p>
            </div>
            <Clock3 className="h-5 w-5 text-blue-500" />
          </div>
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.title} className="flex gap-4 rounded-lg bg-white/80 p-4">
                <div className="mt-1 grid h-10 w-10 flex-none place-items-center rounded-xl bg-blue-50 text-blue-600">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-slate-900">{activity.title}</p>
                  <p className="mt-1 text-sm text-slate-500">{activity.meta}</p>
                </div>
                <span className="hidden text-xs font-semibold text-slate-400 sm:block">{activity.time}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="hover:shadow-soft">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="font-display text-xl font-bold text-slate-950">Pipeline</h2>
              <p className="mt-1 text-sm text-slate-500">A compact view of active demand.</p>
            </div>
            <CalendarCheck2 className="h-5 w-5 text-blue-500" />
          </div>
          <div className="space-y-4">
            {requests.slice(0, 3).map((request) => (
              <div key={request.id} className="rounded-lg border border-slate-100 bg-white/85 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-950">{request.title}</p>
                    <p className="mt-1 text-sm text-slate-500">{request.owner}</p>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-slate-400" />
                </div>
                <div className="mt-4 flex items-center justify-between text-sm">
                  <span className="font-bold text-blue-600">{request.budget}</span>
                  <span className="text-slate-400">{request.posted}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="mt-6 hover:shadow-soft">
        <h2 className="font-display text-xl font-bold text-slate-950">Latest applications</h2>
        <div className="mt-5 overflow-hidden rounded-lg border border-slate-100 bg-white/80">
          {applications.slice(0, 3).map((application) => (
            <div key={application.id} className="grid gap-3 border-b border-slate-100 p-4 last:border-b-0 md:grid-cols-[1.4fr_0.8fr_0.6fr] md:items-center">
              <div>
                <p className="font-semibold text-slate-950">{application.request}</p>
                <p className="mt-1 text-sm text-slate-500">{application.client}</p>
              </div>
              <p className="text-sm text-slate-500">{application.date}</p>
              <p className="text-sm font-bold text-slate-950">{application.amount}</p>
            </div>
          ))}
        </div>
      </Card>
    </DashboardLayout>
  );
}
