import { CheckCircle2, Clock3, XCircle } from 'lucide-react';

const statusStyles = {
  pending: 'bg-amber-50 text-amber-700 ring-amber-100',
  accepted: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
  rejected: 'bg-rose-50 text-rose-700 ring-rose-100',
};

const statusIcons = {
  pending: Clock3,
  accepted: CheckCircle2,
  rejected: XCircle,
};

export default function StatusBadge({ status = 'pending' }) {
  const Icon = statusIcons[status] || Clock3;

  return (
    <span className={`inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold capitalize ring-1 ${statusStyles[status] || statusStyles.pending}`}>
      <Icon className="h-3.5 w-3.5" />
      {status}
    </span>
  );
}
