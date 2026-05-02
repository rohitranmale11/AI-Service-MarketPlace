import { MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Button from '../components/Button';
import Card from '../components/Card';
import ConfirmModal from '../components/ConfirmModal';
import EmptyState from '../components/EmptyState';
import Loader from '../components/Loader';
import StatusBadge from '../components/StatusBadge';
import DashboardLayout from '../layouts/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { useToast } from '../context/ToastContext';
import { applicationApi, requestApi } from '../services/marketplaceApi';

export default function ApplicationsPage() {
  const { user } = useAuth();
  const { fetchNotifications } = useNotifications();
  const { pushToast } = useToast();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pendingDecision, setPendingDecision] = useState(null);
  const [updatingApplicationId, setUpdatingApplicationId] = useState('');
  const isProvider = user?.role === 'provider';

  async function loadApplications() {
    setLoading(true);

    try {
      if (isProvider) {
        const { data } = await applicationApi.getProviderApplications();
        setApplications(data.applications || []);
      } else {
        const { data } = await requestApi.getMine();
        const results = await Promise.all((data.requests || []).map((request) => applicationApi.getRequestApplications(request._id)));
        setApplications(results.flatMap((result) => result.data.applications || []));
      }
    } catch (error) {
      pushToast(error.response?.data?.message || 'Unable to load applications.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadApplications();
  }, [isProvider]);

  async function updateStatus() {
    if (!pendingDecision) return;

    setUpdatingApplicationId(pendingDecision.applicationId);

    try {
      await applicationApi.updateStatus(pendingDecision.applicationId, pendingDecision.status);
      pushToast(`Application ${pendingDecision.status === 'accepted' ? 'Accepted' : 'Rejected'}.`);
      setPendingDecision(null);
      await fetchNotifications();
      await loadApplications();
    } catch (error) {
      pushToast(error.response?.data?.message || 'Unable to update application.');
    } finally {
      setUpdatingApplicationId('');
    }
  }

  return (
    <DashboardLayout title="Applications" subtitle={isProvider ? 'Track requests you have applied to.' : 'Review providers applying to your requests.'}>
      <Card className="hover:shadow-soft">
        {loading ? (
          <Loader label="Loading applications" />
        ) : applications.length === 0 ? (
          <EmptyState title="No applications yet" description={isProvider ? 'Apply to open requests and track them here.' : 'Provider applications for your requests will appear here.'} actionLabel={isProvider ? 'Browse Requests' : 'Create Request'} actionTo={isProvider ? '/requests' : '/create'} />
        ) : (
          <>
        <div className="hidden overflow-hidden rounded-lg border border-slate-100 bg-white/85 md:block">
          <div className="grid grid-cols-[1.4fr_0.8fr_0.7fr_0.7fr_0.8fr] bg-slate-50 px-5 py-4 text-xs font-bold uppercase text-slate-400">
            <span>Request</span>
            <span>{isProvider ? 'Client' : 'Provider'}</span>
            <span>Date</span>
            <span>Amount</span>
            <span>Status</span>
          </div>
          {applications.map((application) => {
            return (
              <div key={application._id} className="grid grid-cols-[1.4fr_0.8fr_0.7fr_0.7fr_0.8fr] items-center border-t border-slate-100 px-5 py-5 text-sm">
                <span className="font-semibold text-slate-950">{application.requestId?.title}</span>
                <span className="text-slate-500">
                  {isProvider ? application.requestId?.createdBy?.name : (
                    <Link to={`/providers/${application.providerId?._id}`} className="font-semibold text-blue-600 hover:text-blue-700">
                      {application.providerId?.name}
                    </Link>
                  )}
                </span>
                <span className="text-slate-500">{new Date(application.createdAt).toLocaleDateString()}</span>
                <span className="font-bold text-slate-950">${application.requestId?.budget}</span>
                <StatusBadge status={application.status} />
                {!isProvider && (
                  <span className="col-span-5 mt-3 flex gap-2">
                    <button
                      onClick={() => setPendingDecision({ applicationId: application._id, status: 'accepted', providerName: application.providerId?.name })}
                      disabled={application.status !== 'pending' || updatingApplicationId === application._id}
                      className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => setPendingDecision({ applicationId: application._id, status: 'rejected', providerName: application.providerId?.name })}
                      disabled={application.status !== 'pending' || updatingApplicationId === application._id}
                      className="rounded-full bg-rose-50 px-3 py-1 text-xs font-bold text-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Reject
                    </button>
                  </span>
                )}
                {application.status === 'accepted' && (
                  <span className="col-span-5 mt-3">
                    <Button
                      to={`/chat?requestId=${application.requestId?._id}&providerId=${application.providerId?._id}`}
                      variant="secondary"
                      className="px-3 py-2"
                    >
                      <MessageCircle className="h-4 w-4" /> Chat
                    </Button>
                  </span>
                )}
              </div>
            );
          })}
        </div>

        <div className="space-y-4 md:hidden">
          {applications.map((application) => {
            return (
              <div key={application._id} className="rounded-lg bg-white/85 p-4 shadow-soft">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-950">{application.requestId?.title}</p>
                    <p className="mt-1 text-sm text-slate-500">
                      {isProvider ? application.requestId?.createdBy?.name : (
                        <Link to={`/providers/${application.providerId?._id}`} className="font-semibold text-blue-600 hover:text-blue-700">
                          {application.providerId?.name}
                        </Link>
                      )}
                    </p>
                  </div>
                  <StatusBadge status={application.status} />
                </div>
                <div className="mt-4 flex justify-between text-sm">
                  <span className="text-slate-500">{new Date(application.createdAt).toLocaleDateString()}</span>
                  <span className="font-bold text-slate-950">${application.requestId?.budget}</span>
                </div>
                {!isProvider && (
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => setPendingDecision({ applicationId: application._id, status: 'accepted', providerName: application.providerId?.name })}
                      disabled={application.status !== 'pending' || updatingApplicationId === application._id}
                      className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => setPendingDecision({ applicationId: application._id, status: 'rejected', providerName: application.providerId?.name })}
                      disabled={application.status !== 'pending' || updatingApplicationId === application._id}
                      className="rounded-full bg-rose-50 px-3 py-1 text-xs font-bold text-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Reject
                    </button>
                  </div>
                )}
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
            );
          })}
        </div>
          </>
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
