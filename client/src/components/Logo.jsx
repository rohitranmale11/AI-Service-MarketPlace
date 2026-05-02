import { BrainCircuit, BriefcaseBusiness } from 'lucide-react';

export default function Logo({ compact = false }) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative grid h-11 w-11 place-items-center rounded-lg bg-primary text-white shadow-soft">
        <BrainCircuit className="h-6 w-6" />
        <span className="absolute -bottom-1 -right-1 grid h-5 w-5 place-items-center rounded-md bg-accent ring-2 ring-white">
          <BriefcaseBusiness className="h-3 w-3 text-white" />
        </span>
      </div>
      {!compact && (
        <div>
          <p className="font-display text-base font-bold leading-tight text-secondary">AI Marketplace</p>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">Services</p>
        </div>
      )}
    </div>
  );
}
