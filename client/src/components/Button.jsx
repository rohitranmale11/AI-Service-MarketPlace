import { Link } from 'react-router-dom';

const variants = {
  primary: 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-glow hover:-translate-y-0.5 hover:shadow-indigo-200',
  secondary: 'border border-indigo-100 bg-white/80 text-indigo-700 hover:-translate-y-0.5 hover:border-indigo-200 hover:bg-indigo-50',
  ghost: 'text-slate-600 hover:bg-slate-100 hover:text-slate-950',
};

export default function Button({ children, className = '', variant = 'primary', to, type = 'button', ...props }) {
  const classes = `inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold transition duration-200 ${variants[variant]} ${className}`;

  if (to) {
    return <Link to={to} className={classes} {...props}>{children}</Link>;
  }

  return <button type={type} className={classes} {...props}>{children}</button>;
}
