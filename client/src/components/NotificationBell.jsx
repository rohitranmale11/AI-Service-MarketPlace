import { Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useNotifications } from '../context/NotificationContext';

const formatTime = (date) => new Intl.DateTimeFormat(undefined, {
  month: 'short',
  day: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
}).format(new Date(date));

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const { loading, markAsRead, notifications, unreadCount } = useNotifications();
  const latestNotifications = notifications.slice(0, 5);

  async function handleNotificationClick(notification) {
    if (!notification.isRead) {
      await markAsRead(notification._id);
    }
    setOpen(false);
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="relative grid h-11 w-11 place-items-center rounded-2xl bg-white text-slate-600 shadow-soft transition hover:bg-indigo-50 hover:text-indigo-700"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-14 z-50 w-80 overflow-hidden rounded-2xl border border-white/70 bg-white/95 shadow-glow backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <p className="font-display text-sm font-bold text-slate-950">Notifications</p>
            <Link to="/notifications" onClick={() => setOpen(false)} className="text-xs font-bold text-indigo-600">View all</Link>
          </div>
          {loading ? (
            <p className="p-4 text-sm text-slate-500">Loading notifications...</p>
          ) : latestNotifications.length === 0 ? (
            <p className="p-4 text-sm text-slate-500">No notifications yet.</p>
          ) : (
            <div className="max-h-96 overflow-auto">
              {latestNotifications.map((notification) => (
                <button
                  key={notification._id}
                  type="button"
                  onClick={() => handleNotificationClick(notification)}
                  className={`block w-full border-b border-slate-100 px-4 py-3 text-left transition last:border-b-0 hover:bg-indigo-50 ${notification.isRead ? 'bg-white text-slate-500' : 'bg-indigo-50/60 text-slate-950'}`}
                >
                  <p className={`text-sm ${notification.isRead ? 'font-medium' : 'font-bold'}`}>{notification.message}</p>
                  <p className="mt-1 text-xs text-slate-400">{formatTime(notification.createdAt)}</p>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
