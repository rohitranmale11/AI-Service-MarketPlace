import { Link, NavLink } from 'react-router-dom';
import { LayoutDashboard, LogIn, LogOut, UserPlus } from 'lucide-react';
import Logo from './Logo';
import Button from './Button';
import NotificationBell from './NotificationBell';
import UserAvatar from './UserAvatar';
import { useAuth } from '../context/AuthContext';
import { getRoleDashboardPath } from '../utils/authRoutes';

const roleNavItems = {
  user: [
    { label: 'Create', to: '/create' },
    { label: 'Requests', to: '/requests' },
    { label: 'Applications', to: '/applications' },
    { label: 'Chat', to: '/chat' },
  ],
  provider: [
    { label: 'Requests', to: '/requests' },
    { label: 'Applications', to: '/applications' },
    { label: 'Chat', to: '/chat' },
  ],
};

export default function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();
  const navItems = isAuthenticated ? roleNavItems[user.role] || [] : [{ label: 'Requests', to: '/requests' }];
  const dashboardPath = isAuthenticated ? getRoleDashboardPath(user.role) : '/login';

  return (
    <header className="sticky top-0 z-40 border-b border-white/70 bg-white/75 backdrop-blur-xl">
      <nav className="page-shell flex h-20 items-center justify-between gap-4">
        <Link to="/" aria-label="AI Service Marketplace home">
          <Logo />
        </Link>
        <div className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => `rounded-2xl px-4 py-2 text-sm font-semibold transition ${isActive ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'}`}>
              {item.label}
            </NavLink>
          ))}
        </div>
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <div className="hidden items-center gap-3 rounded-2xl bg-white/90 p-2 shadow-soft sm:flex">
                <UserAvatar user={user} className="h-10 w-10" />
                <div className="hidden lg:block">
                  <p className="text-sm font-bold text-slate-950">{user.name}</p>
                  <p className="text-xs font-semibold capitalize text-indigo-600">{user.role}</p>
                </div>
              </div>
              <NotificationBell />
              <Button to={dashboardPath} className="px-4">
                <LayoutDashboard className="h-4 w-4" /> Dashboard
              </Button>
              <Button onClick={logout} variant="ghost" className="hidden px-3 sm:inline-flex" aria-label="Logout">
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Button to="/login" variant="ghost" className="hidden px-4 sm:inline-flex">
                <LogIn className="h-4 w-4" /> Login
              </Button>
              <Button to="/signup" variant="secondary" className="hidden px-4 sm:inline-flex">
                <UserPlus className="h-4 w-4" /> Signup
              </Button>
              <Button to="/login" className="px-4">
                <LayoutDashboard className="h-4 w-4" /> Dashboard
              </Button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
