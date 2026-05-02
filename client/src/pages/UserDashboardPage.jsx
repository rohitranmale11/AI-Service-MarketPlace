import { ClipboardList, MessageCircle, Plus, Sparkles, Trash2, UsersRound } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import Card from '../components/Card';
import ConfirmModal from '../components/ConfirmModal';
import EmptyState from '../components/EmptyState';
import Input from '../components/Input';
import Loader from '../components/Loader';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import Textarea from '../components/Textarea';
import DashboardLayout from '../layouts/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { useToast } from '../context/ToastContext';
import { useForm } from '../hooks/useForm';
import { applicationApi, requestApi } from '../services/marketplaceApi';

export default function UserDashboardPage() {
  const { user } = useAuth();
  const { fetchNotifications } = useNotifications();
  const { pushToast } = useToast();
  const { values, handleChange, reset } = useForm({ title: '', description: '', budget: '', skills: '' });
  const [postedRequests, setPostedRequests] = useState([]);
  const [applicationsByRequest, setApplicationsByRequest] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [pendingDecision, setPendingDecision] = useState(null);
  const [updatingApplicationId, setUpdatingApplicationId] = useState('');

  async function loadDashboard() {
    setLoading(true);

    try {
      const { data } = await requestApi.getMine();
      const requests = data.requests || [];
      const applicationPairs = await Promise.all(requests.map(async (request) => {
        const result = await applicationApi.getRequestApplications(request._id);
        return [request._id, result.data.applications || []];
      }));

      setPostedRequests(requests);
      setApplicationsByRequest(Object.fromEntries(applicationPairs));
    } catch (error) {
      pushToast(error.response?.data?.message || 'Unable to load your dashboard.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  async function handleCreate(event) {
    event.preventDefault();
    setSubmitting(true);

    try {
      await requestApi.create({
        title: values.title,
        description: values.description,
        budget: values.budget,
        skills: values.skills.split(',').map((skill) => skill.trim()).filter(Boolean),
      });
      reset();
      pushToast('Request created successfully.');
      await loadDashboard();
    } catch (error) {
      pushToast(error.response?.data?.message || 'Unable to create request.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(requestId) {
    try {
      await requestApi.remove(requestId);
      pushToast('Request deleted successfully.');
      await loadDashboard();
    } catch (error) {
      pushToast(error.response?.data?.message || 'Unable to delete request.');
    }
  }

  async function updateStatus() {
    if (!pendingDecision) return;

    setUpdatingApplicationId(pendingDecision.applicationId);

    try {
      await applicationApi.updateStatus(pendingDecision.applicationId, pendingDecision.status);
      pushToast(`Application ${pendingDecision.status === 'accepted' ? 'Accepted' : 'Rejected'}.`);
      setPendingDecision(null);
      await fetchNotifications();
      await loadDashboard();
    } catch (error) {
      pushToast(error.response?.data?.message || 'Unable to update application.');
    } finally {
      setUpdatingApplicationId('');
    }
  }

  return (
    <DashboardLayout title="User Dashboard" subtitle="Create AI service requests and track provider interest.">
      <div className="mb-6 rounded-lg bg-gradient-to-r from-primary to-accent p-6 text-white shadow-soft">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-sm font-semibold ring-1 ring-white/20">
              <Sparkles className="h-4 w-4" />
              Welcome, {user?.name || 'User'}
            </p>
            <h2 className="mt-4 font-display text-3xl font-bold">Turn your next AI idea into a clear request.</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-blue-50">
              Post scoped work, compare providers, and manage your marketplace activity from one focused workspace.
            </p>
          </div>
          <Button to="/create" variant="secondary" className="bg-white text-blue-700">
            <Plus className="h-4 w-4" /> Create Request
          </Button>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <StatCard label="Total Requests" value={postedRequests.length} trend="+2" tone="from-blue-500 to-blue-500" />
        <StatCard label="Active Requests" value="3" trend="Live" tone="from-cyan-500 to-blue-500" />
      </div>

      <Card className="mt-6 hover:shadow-soft">
        <h2 className="font-display text-xl font-bold text-slate-950">Create request</h2>
        <form onSubmit={handleCreate} className="mt-5 grid gap-4 lg:grid-cols-2">
          <Input label="Title" name="title" value={values.title} onChange={handleChange} placeholder="AI customer support chatbot" />
          <Input label="Budget" name="budget" value={values.budget} onChange={handleChange} placeholder="2500" />
          <div className="lg:col-span-2">
            <Textarea label="Description" name="description" value={values.description} onChange={handleChange} placeholder="Describe the workflow, integrations, and expected outcome." />
          </div>
          <div className="lg:col-span-2">
            <Input label="Skills" name="skills" value={values.skills} onChange={handleChange} placeholder="OpenAI, React, Automation" />
          </div>
          <Button type="submit" disabled={submitting} className="w-full disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto">
            {submitting ? 'Creating...' : 'Create Request'}
          </Button>
        </form>
      </Card>

      <Card className="mt-6 hover:shadow-soft">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-xl font-bold text-slate-950">Posted requests</h2>
            <p className="mt-1 text-sm text-slate-500">Requests saved in MongoDB and visible to providers.</p>
          </div>
          <Button to="/requests" variant="secondary">View Marketplace</Button>
        </div>
        {loading ? (
          <Loader label="Loading your requests" />
        ) : postedRequests.length === 0 ? (
          <EmptyState title="No requests yet" description="Create your first request and providers will be able to apply." actionLabel="Create Request" actionTo="/create" />
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
          {postedRequests.map((request) => {
            const applications = applicationsByRequest[request._id] || [];

            return (
            <div key={request._id} className="rounded-lg border border-slate-100 bg-white/85 p-5 shadow-soft">
              <div className="flex items-start justify-between gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-lg bg-blue-50 text-blue-600">
                  <ClipboardList className="h-5 w-5" />
                </div>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">Active</span>
              </div>
              <h3 className="mt-5 font-display text-lg font-bold text-slate-950">{request.title}</h3>
              <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-500">{request.description}</p>
              <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                <p className="font-extrabold text-slate-950">${request.budget}</p>
                <Button onClick={() => handleDelete(request._id)} variant="secondary" className="px-3 py-2">
                  <Trash2 className="h-4 w-4" /> Delete
                </Button>
              </div>
              <div className="mt-5 rounded-lg bg-slate-50 p-4">
                <p className="flex items-center gap-2 text-sm font-bold text-slate-950">
                  <UsersRound className="h-4 w-4 text-blue-500" />
                  Applications ({applications.length})
                </p>
                <div className="mt-3 space-y-3">
                  {applications.length === 0 ? (
                    <p className="text-sm text-slate-500">No providers have applied yet.</p>
                  ) : applications.map((application) => (
                    <div key={application._id} className="rounded-xl bg-white p-3 text-sm">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <Link to={`/providers/${application.providerId?._id}`} className="font-bold text-blue-600 hover:text-blue-700">{application.providerId?.name}</Link>
                          <p className="text-slate-500">{application.providerId?.email}</p>
                        </div>
                        <StatusBadge status={application.status} />
                      </div>
                      {(application.requestId?.skills || request.skills || []).length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {(application.requestId?.skills || request.skills || []).map((skill) => (
                            <span key={skill} className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">{skill}</span>
                          ))}
                        </div>
                      )}
                      <div className="mt-3 flex gap-2">
                        <Button
                          onClick={() => setPendingDecision({ applicationId: application._id, status: 'accepted', providerName: application.providerId?.name })}
                          disabled={application.status !== 'pending' || updatingApplicationId === application._id}
                          variant="secondary"
                          className="px-3 py-2 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          Accept
                        </Button>
                        <Button
                          onClick={() => setPendingDecision({ applicationId: application._id, status: 'rejected', providerName: application.providerId?.name })}
                          disabled={application.status !== 'pending' || updatingApplicationId === application._id}
                          variant="ghost"
                          className="px-3 py-2 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          Reject
                        </Button>
                      </div>
                      {application.status === 'accepted' && (
                        <Button
                          to={`/chat?requestId=${request._id}&providerId=${application.providerId?._id}`}
                          variant="secondary"
                          className="mt-3 px-3 py-2"
                        >
                          <MessageCircle className="h-4 w-4" /> Chat
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );})}
          </div>
        )}
      </Card>
      <ConfirmModal
        open={Boolean(pendingDecision)}
        title={`${pendingDecision?.status === 'accepted' ? 'Accept' : 'Reject'} application?`}
        description={
          pendingDecision?.status === 'accepted'
            ? `Accept ${pendingDecision?.providerName || 'this provider'} for this request. Other pending applications for the same request will be rejected.`
            : `Reject ${pendingDecision?.providerName || 'this provider'} for this request.`
        }
        confirmLabel={pendingDecision?.status === 'accepted' ? 'Accept Application' : 'Reject Application'}
        loading={Boolean(updatingApplicationId)}
        onCancel={() => setPendingDecision(null)}
        onConfirm={updateStatus}
      />
    </DashboardLayout>
  );
}
