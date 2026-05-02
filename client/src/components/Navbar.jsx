import { Link, NavLink } from 'react-router-dom';
import { LayoutDashboard, LogIn, LogOut, Menu, UserPlus, X } from 'lucide-react';
import { useState } from 'react';
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
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated, logout, user } = useAuth();
  const navItems = isAuthenticated ? roleNavItems[user.role] || [] : [{ label: 'Requests', to: '/requests' }];
  const dashboardPath = isAuthenticated ? getRoleDashboardPath(user.role) : '/login';
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
      <nav className="page-shell flex h-20 items-center justify-between gap-4">
        <Link to="/" aria-label="AI Marketplace home" onClick={closeMenu}>
          <Logo />
        </Link>
        <div className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => `rounded-lg px-4 py-2 text-sm font-semibold transition ${isActive ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'}`}>
              {item.label}
            </NavLink>
          ))}
        </div>
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <div className="hidden items-center gap-3 rounded-lg bg-white/90 p-2 shadow-soft sm:flex">
                <UserAvatar user={user} className="h-10 w-10" />
                <div className="hidden lg:block">
                  <p className="text-sm font-bold text-slate-950">{user.name}</p>
                  <p className="text-xs font-semibold capitalize text-blue-600">{user.role}</p>
                </div>
              </div>
              <NotificationBell />
              <Button to={dashboardPath} className="hidden px-4 sm:inline-flex">
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
              <Button to="/login" className="hidden px-4 sm:inline-flex">
                <LayoutDashboard className="h-4 w-4" /> Dashboard
              </Button>
            </>
          )}
          <button
            type="button"
            onClick={() => setMenuOpen((current) => !current)}
            className="grid h-11 w-11 place-items-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-soft md:hidden"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>
      {menuOpen && (
        <div className="border-t border-slate-200 bg-white md:hidden">
          <div className="page-shell space-y-2 py-4">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={closeMenu}
                className={({ isActive }) => `block rounded-lg px-4 py-3 text-sm font-semibold transition ${isActive ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'}`}
              >
                {item.label}
              </NavLink>
            ))}
            <NavLink
              to={dashboardPath}
              onClick={closeMenu}
              className="block rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-white"
            >
              Dashboard
            </NavLink>
            {isAuthenticated ? (
              <button
                type="button"
                onClick={() => {
                  logout();
                  closeMenu();
                }}
                className="block w-full rounded-lg px-4 py-3 text-left text-sm font-semibold text-slate-600 hover:bg-slate-100"
              >
                Logout
              </button>
            ) : (
              <div className="grid gap-2 sm:grid-cols-2">
                <NavLink to="/login" onClick={closeMenu} className="rounded-lg px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-100">Login</NavLink>
                <NavLink to="/signup" onClick={closeMenu} className="rounded-lg border border-blue-200 px-4 py-3 text-sm font-semibold text-blue-700 hover:bg-blue-50">Signup</NavLink>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
