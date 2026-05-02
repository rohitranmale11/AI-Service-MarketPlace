import { Inbox } from 'lucide-react';
import Button from './Button';

export default function EmptyState({ title, description, actionLabel, actionTo }) {
  return (
    <div className="glass grid place-items-center rounded-lg px-6 py-14 text-center">
      <div className="grid h-14 w-14 place-items-center rounded-lg bg-blue-50 text-blue-600">
        <Inbox className="h-7 w-7" />
      </div>
      <h3 className="mt-5 font-display text-xl font-bold text-slate-950">{title}</h3>
      <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">{description}</p>
      {actionLabel && <Button to={actionTo} className="mt-6">{actionLabel}</Button>}
    </div>
  );
}
