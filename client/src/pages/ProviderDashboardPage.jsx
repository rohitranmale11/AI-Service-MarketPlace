import { BadgeCheck, BriefcaseBusiness, Filter, MessageCircle, RotateCcw, Search, Send, Target, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import Button from '../components/Button';
import Card from '../components/Card';
import EmptyState from '../components/EmptyState';
import Input from '../components/Input';
import Loader from '../components/Loader';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import DashboardLayout from '../layouts/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { useToast } from '../context/ToastContext';
import { applicationApi, requestApi } from '../services/marketplaceApi';

export default function ProviderDashboardPage() {
  const { user } = useAuth();
  const { fetchNotifications } = useNotifications();
  const { pushToast } = useToast();
  const [requests, setRequests] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applyingId, setApplyingId] = useState('');
  const [filters, setFilters] = useState({ keyword: '', minBudget: '', maxBudget: '' });
  const [skillInput, setSkillInput] = useState('');
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [debouncedKeyword, setDebouncedKeyword] = useState('');
  const acceptedApplications = applications.filter((application) => application.status === 'accepted');
  const appliedRequestIds = useMemo(() => applications.map((application) => application.requestId?._id), [applications]);
  const hasActiveFilters = Boolean(debouncedKeyword || filters.minBudget || filters.maxBudget || selectedSkills.length);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedKeyword(filters.keyword.trim()), 350);
    return () => clearTimeout(timer);
  }, [filters.keyword]);

  async function loadDashboard(queryFilters = {}) {
    setLoading(true);

    try {
      const requestParams = {
        keyword: queryFilters.keyword || undefined,
        minBudget: queryFilters.minBudget || undefined,
        maxBudget: queryFilters.maxBudget || undefined,
        skills: queryFilters.skills?.length ? queryFilters.skills.join(',') : undefined,
      };

      const [requestResult, applicationResult] = await Promise.all([
        requestApi.getAll(requestParams),
        applicationApi.getProviderApplications(),
      ]);
      setRequests(requestResult.data.requests || []);
      setApplications(applicationResult.data.applications || []);
    } catch (error) {
      pushToast(error.response?.data?.message || 'Unable to load provider dashboard.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard({
      keyword: debouncedKeyword,
      minBudget: filters.minBudget,
      maxBudget: filters.maxBudget,
      skills: selectedSkills,
    });
  }, [debouncedKeyword, filters.minBudget, filters.maxBudget, selectedSkills]);

  function updateFilter(name, value) {
    setFilters((current) => ({ ...current, [name]: value }));
  }

  function addSkill() {
    const nextSkill = skillInput.trim();
    if (!nextSkill || selectedSkills.includes(nextSkill)) return;
    setSelectedSkills((items) => [...items, nextSkill]);
    setSkillInput('');
  }

  function removeSkill(skill) {
    setSelectedSkills((items) => items.filter((item) => item !== skill));
  }

  function resetFilters() {
    setFilters({ keyword: '', minBudget: '', maxBudget: '' });
    setSkillInput('');
    setSelectedSkills([]);
  }

  async function handleApply(requestId) {
    setApplyingId(requestId);

    try {
      await applicationApi.apply(requestId);
      pushToast('Application submitted successfully.');
      await fetchNotifications();
      await loadDashboard();
    } catch (error) {
      pushToast(error.response?.data?.message || 'Unable to apply to request.');
    } finally {
      setApplyingId('');
    }
  }

  return (
    <DashboardLayout title="Provider Dashboard" subtitle="Find matched AI work and track your active applications.">
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card className="bg-gradient-to-br from-slate-950 via-indigo-950 to-blue-900 text-white hover:shadow-glow">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm font-semibold text-indigo-100 ring-1 ring-white/15">
            <BadgeCheck className="h-4 w-4" />
            Provider workspace
          </p>
          <h2 className="mt-5 font-display text-3xl font-bold">Welcome back, {user?.name || 'Provider'}.</h2>
          <p className="mt-3 text-sm leading-6 text-indigo-100">
            Browse premium AI requests, send sharper proposals, and keep your application pipeline moving.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button to="/requests" variant="secondary" className="bg-white text-indigo-700">
              <BriefcaseBusiness className="h-4 w-4" /> Browse Requests
            </Button>
            <Button to="/applications" variant="ghost" className="text-white hover:bg-white/10 hover:text-white">
              <Send className="h-4 w-4" /> Applied Requests
            </Button>
          </div>
        </Card>

        <div className="grid gap-5 sm:grid-cols-2">
          <StatCard label="Applications Sent" value={applications.length} trend="Live" tone="from-violet-500 to-fuchsia-500" />
          <StatCard label="Accepted" value={acceptedApplications.length} trend="High fit" tone="from-emerald-500 to-cyan-500" />
        </div>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[360px_1fr]">
        <Card className="h-fit xl:sticky xl:top-24">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-xl font-bold text-slate-950">Find requests</h2>
              <p className="mt-1 text-sm text-slate-500">Search by scope, budget, and skills.</p>
            </div>
            <Filter className="h-5 w-5 text-indigo-500" />
          </div>

          <div className="space-y-5">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">Keyword</span>
              <div className="relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={filters.keyword}
                  onChange={(event) => updateFilter('keyword', event.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white/85 px-4 py-3 pl-11 text-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                  placeholder="Search React, chatbot, RAG..."
                />
              </div>
            </label>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              <Input label="Min budget" name="minBudget" value={filters.minBudget} onChange={(event) => updateFilter('minBudget', event.target.value)} placeholder="500" />
              <Input label="Max budget" name="maxBudget" value={filters.maxBudget} onChange={(event) => updateFilter('maxBudget', event.target.value)} placeholder="5000" />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Skills</label>
              <div className="flex gap-2">
                <input
                  value={skillInput}
                  onChange={(event) => setSkillInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault();
                      addSkill();
                    }
                  }}
                  className="min-w-0 flex-1 rounded-2xl border border-slate-200 bg-white/85 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                  placeholder="Add skill"
                />
                <Button onClick={addSkill} variant="secondary" className="px-4">Add</Button>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {selectedSkills.map((skill) => (
                  <span key={skill} className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-2 text-xs font-bold text-indigo-700">
                    {skill}
                    <button type="button" onClick={() => removeSkill(skill)} aria-label={`Remove ${skill}`}>
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <Button onClick={resetFilters} variant="ghost" className="w-full">
              <RotateCcw className="h-4 w-4" /> Reset filters
            </Button>
          </div>
        </Card>

        <Card className="hover:shadow-soft">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-xl font-bold text-slate-950">Recommended requests</h2>
              <p className="mt-1 text-sm text-slate-500">{hasActiveFilters ? `${requests.length} filtered result${requests.length === 1 ? '' : 's'}` : 'Matched to your AI automation and copilot skills.'}</p>
            </div>
            <Target className="h-5 w-5 text-indigo-500" />
          </div>
          <div className="space-y-4">
            {loading ? (
              <Loader label="Loading requests" />
            ) : requests.length === 0 ? (
              <EmptyState title="No results found" description={hasActiveFilters ? 'Try adjusting your keyword, budget range, or skill tags.' : 'New service requests will appear here when users create them.'} />
            ) : requests.map((request) => (
              <div key={request._id} className="rounded-2xl border border-slate-100 bg-white/85 p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="font-display text-lg font-bold text-slate-950">{request.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-500">{request.description}</p>
                  </div>
                  <p className="shrink-0 rounded-full bg-indigo-50 px-3 py-1 text-sm font-extrabold text-indigo-700">${request.budget}</p>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {(request.skills || []).map((tag) => (
                    <span key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{tag}</span>
                  ))}
                </div>
                <Button
                  onClick={() => handleApply(request._id)}
                  disabled={appliedRequestIds.includes(request._id) || applyingId === request._id}
                  className="mt-5 px-4 py-2 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {appliedRequestIds.includes(request._id) ? 'Already Applied' : applyingId === request._id ? 'Applying...' : 'Apply'}
                </Button>
              </div>
            ))}
          </div>
        </Card>

        <Card className="hover:shadow-soft">
          <h2 className="font-display text-xl font-bold text-slate-950">Applied requests</h2>
          <div className="mt-5 space-y-4">
            {loading ? (
              <Loader label="Loading applications" />
            ) : applications.length === 0 ? (
              <EmptyState title="No applications yet" description="Apply to a request and it will appear here." actionLabel="Browse Requests" actionTo="/requests" />
            ) : applications.map((application) => (
              <div key={application._id} className="rounded-2xl bg-white/85 p-4 shadow-soft">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-950">{application.requestId?.title}</p>
                    <p className="mt-1 text-sm text-slate-500">{application.requestId?.createdBy?.name || 'Marketplace client'}</p>
                  </div>
                  <StatusBadge status={application.status} />
                </div>
                <div className="mt-4 flex justify-between text-sm">
                  <span className="text-slate-500">{new Date(application.createdAt).toLocaleDateString()}</span>
                  <span className="font-bold text-slate-950">${application.requestId?.budget}</span>
                </div>
                {application.status === 'accepted' && (
                  <Button
                    to={`/chat?requestId=${application.requestId?._id}&providerId=${application.providerId?._id}`}
                    variant="secondary"
                    className="mt-3 px-3 py-2"
                  >
                    <MessageCircle className="h-4 w-4" /> Chat
                  </Button>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
