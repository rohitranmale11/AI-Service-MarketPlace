import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, BriefcaseBusiness, Building2, LockKeyhole, Mail, UserRound, UsersRound } from 'lucide-react';
import Button from '../components/Button';
import Input from '../components/Input';
import Logo from '../components/Logo';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useForm } from '../hooks/useForm';

export default function SignupPage() {
  const navigate = useNavigate();
  const { error, loading, register } = useAuth();
  const { pushToast } = useToast();
  const { values, handleChange, setValues } = useForm({ name: '', email: '', password: '', company: '', role: 'user' });
  const showEmailError = values.email.length > 0 && !values.email.includes('@');
  const showPasswordError = values.password.length > 0 && values.password.length < 6;

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      await register({
        name: values.name,
        email: values.email,
        password: values.password,
        role: values.role,
      });
      pushToast('Account created. Please login to continue.');
      navigate('/login');
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
            <h1 className="font-display text-3xl font-bold text-slate-950">Create your account</h1>
            <p className="mt-2 text-sm text-slate-500">Start posting AI requests or applying as a specialist.</p>
          </div>
          <div className="mt-8 space-y-5">
            <div className="relative">
              <UserRound className="pointer-events-none absolute left-4 top-11 h-4 w-4 text-slate-400" />
              <Input label="Full name" name="name" value={values.name} onChange={handleChange} className="pl-11" placeholder="Aarav Mehta" />
            </div>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-4 top-11 h-4 w-4 text-slate-400" />
              <Input label="Email address" name="email" value={values.email} onChange={handleChange} className="pl-11" placeholder="you@example.com" error={showEmailError ? 'Enter a valid email address.' : ''} />
            </div>
            <div className="relative">
              <LockKeyhole className="pointer-events-none absolute left-4 top-11 h-4 w-4 text-slate-400" />
              <Input label="Password" type="password" name="password" value={values.password} onChange={handleChange} className="pl-11" placeholder="Minimum 6 characters" error={showPasswordError ? 'Use at least 6 characters.' : ''} />
            </div>
            <div className="relative">
              <Building2 className="pointer-events-none absolute left-4 top-11 h-4 w-4 text-slate-400" />
              <Input label="Company" name="company" value={values.company} onChange={handleChange} className="pl-11" placeholder="NeuralForge Studio" />
            </div>
            <div>
              <span className="mb-2 block text-sm font-semibold text-slate-700">Account role</span>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { label: 'User', value: 'user', icon: UsersRound, description: 'Post AI requests' },
                  { label: 'Provider', value: 'provider', icon: BriefcaseBusiness, description: 'Apply to AI work' },
                ].map((role) => {
                  const Icon = role.icon;
                  const isSelected = values.role === role.value;

                  return (
                    <button
                      key={role.value}
                      type="button"
                      onClick={() => setValues((current) => ({ ...current, role: role.value }))}
                      className={`rounded-2xl border p-4 text-left transition ${isSelected ? 'border-indigo-300 bg-indigo-50 text-indigo-700 ring-4 ring-indigo-100' : 'border-slate-200 bg-white/85 text-slate-600 hover:border-indigo-200 hover:bg-indigo-50'}`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="mt-3 block font-bold">{role.label}</span>
                      <span className="mt-1 block text-xs font-medium">{role.description}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            {error && <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-600">{error}</p>}
          </div>
          <Button type="submit" disabled={loading} className="mt-7 w-full disabled:cursor-not-allowed disabled:opacity-70">
            {loading ? 'Creating account...' : 'Signup'} <ArrowRight className="h-4 w-4" />
          </Button>
          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account? <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-700">Login</Link>
          </p>
        </form>
      </div>
    </main>
  );
}
