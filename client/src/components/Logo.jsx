import { Sparkles } from 'lucide-react';

export default function Logo({ compact = false }) {
  return (
    <div className="flex items-center gap-3">
      <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-500 text-white shadow-glow">
        <Sparkles className="h-5 w-5" />
      </div>
      {!compact && (
        <div>
          <p className="font-display text-base font-bold leading-tight text-slate-950">AI Service</p>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-500">Marketplace</p>
        </div>
      )}
    </div>
  );
}
