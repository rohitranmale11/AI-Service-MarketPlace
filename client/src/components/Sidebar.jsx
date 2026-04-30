import { NavLink } from 'react-router-dom';
import { Bell, BriefcaseBusiness, ClipboardList, LayoutDashboard, MessageCircle, Send, UserRound } from 'lucide-react';
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

export default function Sidebar() {
  const { user } = useAuth();
  const items = roleItems[user?.role] || roleItems.user;

  return (
    <aside className="hidden w-72 shrink-0 border-r border-white/70 bg-white/75 p-5 backdrop-blur-xl lg:block">
      <Logo />
      <nav className="mt-10 space-y-2">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${isActive ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-glow' : 'text-slate-600 hover:bg-white hover:text-slate-950 hover:shadow-soft'}`}>
              <Icon className="h-5 w-5" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
