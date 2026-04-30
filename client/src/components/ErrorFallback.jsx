import { AlertTriangle } from 'lucide-react';
import Button from './Button';

export default function ErrorFallback({ error }) {
  return (
    <main className="grid min-h-screen place-items-center bg-mesh px-4">
      <div className="glass max-w-xl rounded-2xl p-8 text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-rose-50 text-rose-600">
          <AlertTriangle className="h-7 w-7" />
        </div>
        <h1 className="mt-6 font-display text-2xl font-bold text-slate-950">Something interrupted the UI</h1>
        <p className="mt-3 text-sm leading-6 text-slate-500">
          The app shell rendered successfully, but one route reported an error.
        </p>
        {error?.message && (
          <pre className="mt-5 overflow-auto rounded-2xl bg-slate-950 p-4 text-left text-xs text-slate-100">
            {error.message}
          </pre>
        )}
        <Button to="/" className="mt-6">Back to Home</Button>
      </div>
    </main>
  );
}
