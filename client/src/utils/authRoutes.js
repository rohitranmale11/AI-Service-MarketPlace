export const getRoleDashboardPath = (role) => (
  role === 'provider' ? '/provider-dashboard' : '/user-dashboard'
);
