import { Star } from 'lucide-react';

export default function StarRating({ value = 0, onChange, size = 'h-5 w-5' }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= Math.round(value);
        const IconWrapper = onChange ? 'button' : 'span';

        return (
          <IconWrapper
            key={star}
            type={onChange ? 'button' : undefined}
            onClick={onChange ? () => onChange(star) : undefined}
            className={onChange ? 'rounded-full p-0.5 transition hover:scale-110' : ''}
            aria-label={onChange ? `${star} star rating` : undefined}
          >
            <Star className={`${size} ${filled ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
          </IconWrapper>
        );
      })}
    </div>
  );
}
