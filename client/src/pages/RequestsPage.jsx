import { ArrowUpRight, BriefcaseBusiness, Filter, Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import Button from '../components/Button';
import Card from '../components/Card';
import EmptyState from '../components/EmptyState';
import Loader from '../components/Loader';
import DashboardLayout from '../layouts/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { useToast } from '../context/ToastContext';
import { applicationApi, requestApi } from '../services/marketplaceApi';

export default function RequestsPage() {
  const [query, setQuery] = useState('');
  const [requests, setRequests] = useState([]);
  const [appliedRequestIds, setAppliedRequestIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applyingId, setApplyingId] = useState('');
  const { user } = useAuth();
  const { fetchNotifications } = useNotifications();
  const { pushToast } = useToast();
  const isProvider = user?.role === 'provider';
  const filtered = useMemo(() => requests.filter((request) => `${request.title} ${request.description} ${(request.skills || []).join(' ')}`.toLowerCase().includes(query.toLowerCase())), [query, requests]);

  useEffect(() => {
    async function loadRequests() {
      setLoading(true);

      try {
        const [{ data: requestData }, applicationResult] = await Promise.all([
          requestApi.getAll(),
          isProvider ? applicationApi.getProviderApplications() : Promise.resolve({ data: { applications: [] } }),
        ]);

        setRequests(requestData.requests || []);
        setAppliedRequestIds((applicationResult.data.applications || []).map((application) => application.requestId?._id));
      } catch (error) {
        pushToast(error.response?.data?.message || 'Unable to load requests.');
      } finally {
        setLoading(false);
      }
    }

    loadRequests();
  }, [isProvider, pushToast]);

  async function handleApply(requestId) {
    setApplyingId(requestId);

    try {
      await applicationApi.apply(requestId);
      setAppliedRequestIds((items) => [...items, requestId]);
      await fetchNotifications();
      pushToast('Application submitted successfully.');
    } catch (error) {
      pushToast(error.response?.data?.message || 'Unable to apply to request.');
    } finally {
      setApplyingId('');
    }
  }

  return (
    <DashboardLayout title="Requests" subtitle="Browse AI service opportunities from teams ready to build.">
      <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-white/70 bg-white/75 p-4 shadow-soft backdrop-blur-xl md:flex-row md:items-center">
        <label className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 pl-11 text-sm outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100" placeholder="Search requests, skills, or clients" />
        </label>
        <Button variant="secondary"><Filter className="h-4 w-4" /> Filters</Button>
        {user?.role === 'user' && <Button to="/create">Create Request</Button>}
      </div>

      {loading ? (
        <Card className="hover:shadow-soft"><Loader label="Loading requests" /></Card>
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No matching requests"
          description={isProvider ? 'Try a different keyword or check back when users post new requests.' : 'Try a different keyword or create a new marketplace request.'}
          actionLabel={user?.role === 'user' ? 'Create Request' : undefined}
          actionTo="/create"
        />
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((request) => (
            <Card key={request._id} className="flex flex-col">
              <div className="flex items-start justify-between gap-4">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-indigo-50 text-indigo-600">
                  <BriefcaseBusiness className="h-6 w-6" />
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">Open</span>
              </div>
              <h2 className="mt-5 font-display text-xl font-bold text-slate-950">{request.title}</h2>
              <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-500">{request.description}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {(request.skills || []).map((tag) => (
                  <span key={tag} className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">{tag}</span>
                ))}
              </div>
              <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5">
                <div>
                  <p className="text-xs font-semibold text-slate-400">{request.createdBy?.name || 'Marketplace client'}</p>
                  <p className="text-lg font-extrabold text-slate-950">${request.budget}</p>
                </div>
                {isProvider ? (
                  <Button
                    onClick={() => handleApply(request._id)}
                    disabled={appliedRequestIds.includes(request._id) || applyingId === request._id}
                    className="px-4 py-2 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {appliedRequestIds.includes(request._id) ? 'Applied' : applyingId === request._id ? 'Applying...' : 'Apply'} <ArrowUpRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button to="/create" variant="secondary" className="px-4 py-2">Post Similar</Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
