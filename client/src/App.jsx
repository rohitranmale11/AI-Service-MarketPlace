import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import UserDashboardPage from './pages/UserDashboardPage';
import ProviderDashboardPage from './pages/ProviderDashboardPage';
import CreateRequestPage from './pages/CreateRequestPage';
import RequestsPage from './pages/RequestsPage';
import ApplicationsPage from './pages/ApplicationsPage';
import ChatPage from './pages/ChatPage';
import NotificationsPage from './pages/NotificationsPage';
import ProfilePage from './pages/ProfilePage';
import ProviderProfilePage from './pages/ProviderProfilePage';
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { ToastProvider } from './context/ToastContext';

const pageMotion = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.24, ease: 'easeOut' },
};

function AnimatedPage({ children }) {
  return <motion.div {...pageMotion}>{children}</motion.div>;
}

function AppRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<AnimatedPage><LandingPage /></AnimatedPage>} />
        <Route path="/login" element={<AnimatedPage><LoginPage /></AnimatedPage>} />
        <Route path="/signup" element={<AnimatedPage><SignupPage /></AnimatedPage>} />
        <Route path="/dashboard" element={<AnimatedPage><ProtectedRoute><DashboardPage /></ProtectedRoute></AnimatedPage>} />
        <Route path="/user-dashboard" element={<AnimatedPage><ProtectedRoute allowedRoles={['user']}><UserDashboardPage /></ProtectedRoute></AnimatedPage>} />
        <Route path="/provider-dashboard" element={<AnimatedPage><ProtectedRoute allowedRoles={['provider']}><ProviderDashboardPage /></ProtectedRoute></AnimatedPage>} />
        <Route path="/create" element={<AnimatedPage><ProtectedRoute allowedRoles={['user']}><CreateRequestPage /></ProtectedRoute></AnimatedPage>} />
        <Route path="/requests" element={<AnimatedPage><ProtectedRoute><RequestsPage /></ProtectedRoute></AnimatedPage>} />
        <Route path="/applications" element={<AnimatedPage><ProtectedRoute allowedRoles={['user', 'provider']}><ApplicationsPage /></ProtectedRoute></AnimatedPage>} />
        <Route path="/chat" element={<AnimatedPage><ProtectedRoute><ChatPage /></ProtectedRoute></AnimatedPage>} />
        <Route path="/notifications" element={<AnimatedPage><ProtectedRoute><NotificationsPage /></ProtectedRoute></AnimatedPage>} />
        <Route path="/profile" element={<AnimatedPage><ProtectedRoute><ProfilePage /></ProtectedRoute></AnimatedPage>} />
        <Route path="/providers/:id" element={<AnimatedPage><ProtectedRoute><ProviderProfilePage /></ProtectedRoute></AnimatedPage>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <AuthProvider>
          <NotificationProvider>
            <ToastProvider>
              <AppRoutes />
            </ToastProvider>
          </NotificationProvider>
        </AuthProvider>
      </ErrorBoundary>
    </BrowserRouter>
  );
}
