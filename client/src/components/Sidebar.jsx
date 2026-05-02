import { NavLink } from 'react-router-dom';
import { Bell, BriefcaseBusiness, ClipboardList, LayoutDashboard, MessageCircle, Send, UserRound, X } from 'lucide-react';
import Logo from './Logo';
import { useAuth } from '../context/AuthContext';

const roleItems = {
  user: [
    { label: 'Dashboard', to: '/user-dashboard', icon: LayoutDashboard },
    { label: 'Create Request', to: '/create', icon: ClipboardList },
    { label: 'Requests', to: '/requests', icon: BriefcaseBusiness },
    { label: 'Applications', to: '/applications', icon: Send },
    { label: 'Chat', to: '/chat', icon: MessageCircle },
    { label: 'Notifications', to: '/notifications', icon: Bell },
    { label: 'Profile', to: '/profile', icon: UserRound },
  ],
  provider: [
    { label: 'Dashboard', to: '/provider-dashboard', icon: LayoutDashboard },
    { label: 'Browse Requests', to: '/requests', icon: BriefcaseBusiness },
    { label: 'Applications', to: '/applications', icon: Send },
    { label: 'Chat', to: '/chat', icon: MessageCircle },
    { label: 'Notifications', to: '/notifications', icon: Bell },
    { label: 'Profile', to: '/profile', icon: UserRound },
  ],
};

export default function Sidebar({ open = false, onClose = () => {} }) {
  const { user } = useAuth();
  const items = roleItems[user?.role] || roleItems.user;

  const sidebarContent = (
    <>
      <div className="flex items-center justify-between">
        <Logo />
        <button type="button" onClick={onClose} className="grid h-10 w-10 place-items-center rounded-lg text-slate-500 hover:bg-slate-100 lg:hidden" aria-label="Close menu">
          <X className="h-5 w-5" />
        </button>
      </div>
      <nav className="mt-10 space-y-2">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) => `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold transition ${isActive ? 'bg-primary text-white shadow-soft' : 'text-slate-600 hover:bg-blue-50 hover:text-blue-700'}`}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>
    </>
  );

  return (
    <>
      <aside className="hidden w-72 shrink-0 border-r border-slate-200/80 bg-white/90 p-5 backdrop-blur-xl lg:block">
        {sidebarContent}
      </aside>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button type="button" className="absolute inset-0 bg-slate-950/40" onClick={onClose} aria-label="Close menu overlay" />
          <aside className="relative h-full w-[min(20rem,86vw)] border-r border-slate-200 bg-white p-5 shadow-2xl">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
