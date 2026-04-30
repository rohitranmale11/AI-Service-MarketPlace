import { CheckCheck } from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';
import EmptyState from '../components/EmptyState';
import Loader from '../components/Loader';
import DashboardLayout from '../layouts/DashboardLayout';
import { useNotifications } from '../context/NotificationContext';

const formatTime = (date) => new Intl.DateTimeFormat(undefined, {
  dateStyle: 'medium',
  timeStyle: 'short',
}).format(new Date(date));

export default function NotificationsPage() {
  const { loading, markAllAsRead, markAsRead, notifications, unreadCount } = useNotifications();

  return (
    <DashboardLayout title="Notifications" subtitle="Track applications, decisions, and marketplace updates.">
      <Card className="hover:shadow-soft">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-xl font-bold text-slate-950">Inbox</h2>
            <p className="mt-1 text-sm text-slate-500">{unreadCount} unread notification{unreadCount === 1 ? '' : 's'}</p>
          </div>
          <Button onClick={markAllAsRead} disabled={unreadCount === 0} variant="secondary" className="disabled:cursor-not-allowed disabled:opacity-60">
            <CheckCheck className="h-4 w-4" /> Mark all as read
          </Button>
        </div>

        {loading ? (
          <Loader label="Loading notifications" />
        ) : notifications.length === 0 ? (
          <EmptyState title="No notifications" description="Important marketplace updates will appear here." />
        ) : (
          <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white/85">
            {notifications.map((notification) => (
              <button
                key={notification._id}
                type="button"
                onClick={() => !notification.isRead && markAsRead(notification._id)}
                className={`block w-full border-b border-slate-100 p-5 text-left transition last:border-b-0 hover:bg-indigo-50 ${notification.isRead ? 'bg-white/70' : 'bg-indigo-50/70'}`}
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className={`text-sm ${notification.isRead ? 'font-medium text-slate-600' : 'font-bold text-slate-950'}`}>{notification.message}</p>
                    <p className="mt-2 text-xs font-semibold uppercase text-indigo-500">{notification.type}</p>
                  </div>
                  <p className="text-xs text-slate-400">{formatTime(notification.createdAt)}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </Card>
    </DashboardLayout>
  );
}
