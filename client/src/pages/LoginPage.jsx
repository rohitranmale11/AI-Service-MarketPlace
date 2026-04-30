import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, LockKeyhole, Mail } from 'lucide-react';
import Button from '../components/Button';
import Input from '../components/Input';
import Logo from '../components/Logo';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useForm } from '../hooks/useForm';
import { getRoleDashboardPath } from '../utils/authRoutes';

export default function LoginPage() {
  const navigate = useNavigate();
  const { error, loading, login } = useAuth();
  const { pushToast } = useToast();
  const { values, handleChange } = useForm({ email: '', password: '' });
  const showPasswordError = values.password.length > 0 && values.password.length < 6;

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      const nextUser = await login(values);
      pushToast('Welcome back to your AI marketplace dashboard.');
      navigate(getRoleDashboardPath(nextUser.role));
    } catch (requestError) {
      pushToast(requestError.message);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Link to="/"><Logo /></Link>
        </div>
        <form onSubmit={handleSubmit} className="glass rounded-2xl p-6 sm:p-8">
          <div className="text-center">
            <h1 className="font-display text-3xl font-bold text-slate-950">Welcome back</h1>
            <p className="mt-2 text-sm text-slate-500">Sign in to manage requests, proposals, and profile details.</p>
          </div>
          <div className="mt-8 space-y-5">
            <div className="relative">
              <Mail className="pointer-events-none absolute left-4 top-11 h-4 w-4 text-slate-400" />
              <Input label="Email address" name="email" value={values.email} onChange={handleChange} className="pl-11" placeholder="you@example.com" />
            </div>
            <div className="relative">
              <LockKeyhole className="pointer-events-none absolute left-4 top-11 h-4 w-4 text-slate-400" />
              <Input label="Password" type="password" name="password" value={values.password} onChange={handleChange} className="pl-11" placeholder="Minimum 6 characters" error={showPasswordError ? 'Use at least 6 characters.' : ''} />
            </div>
            {error && <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-600">{error}</p>}
          </div>
          <Button type="submit" disabled={loading} className="mt-7 w-full disabled:cursor-not-allowed disabled:opacity-70">
            {loading ? 'Logging in...' : 'Login'} <ArrowRight className="h-4 w-4" />
          </Button>
          <p className="mt-6 text-center text-sm text-slate-500">
            New here? <Link to="/signup" className="font-semibold text-indigo-600 hover:text-indigo-700">Create an account</Link>
          </p>
        </form>
      </div>
    </main>
  );
}
