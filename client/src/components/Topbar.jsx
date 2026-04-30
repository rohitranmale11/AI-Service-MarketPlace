import { LogOut, Menu, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from './Button';
import NotificationBell from './NotificationBell';
import UserAvatar from './UserAvatar';

export default function Topbar({ title, subtitle }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const activeUser = user || { name: 'Guest User', email: 'guest@example.com' };

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div className="flex flex-col gap-4 border-b border-white/70 bg-white/70 px-4 py-5 backdrop-blur-xl sm:px-6 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-center gap-4">
        <button className="grid h-11 w-11 place-items-center rounded-2xl bg-white text-slate-600 shadow-soft lg:hidden" aria-label="Open menu">
          <Menu className="h-5 w-5" />
        </button>
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-950">{title}</h1>
          <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
        </div>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="relative hidden md:block">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input className="w-72 rounded-2xl border border-slate-200 bg-white/90 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100" placeholder="Search workspace" />
        </label>
        <NotificationBell />
        <div className="flex items-center gap-3 rounded-2xl bg-white/90 p-2 shadow-soft">
          <UserAvatar user={activeUser} />
          <div className="hidden min-w-0 sm:block">
            <p className="truncate text-sm font-bold text-slate-900">{activeUser.name}</p>
            <p className="truncate text-xs text-slate-500">{activeUser.email}</p>
          </div>
          <Button onClick={handleLogout} variant="ghost" className="px-3 py-2" aria-label="Logout">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
