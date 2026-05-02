import { Link } from 'react-router-dom';

const variants = {
  primary: 'bg-primary text-white shadow-soft hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-glow',
  secondary: 'border border-blue-200 bg-white text-blue-700 hover:-translate-y-0.5 hover:border-blue-300 hover:bg-blue-50',
  success: 'bg-accent text-white shadow-soft hover:-translate-y-0.5 hover:bg-green-600',
  ghost: 'text-slate-600 hover:bg-slate-100 hover:text-slate-950',
};

export default function Button({ children, className = '', variant = 'primary', to, type = 'button', ...props }) {
  const classes = `inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold transition duration-200 focus:outline-none focus:ring-4 focus:ring-blue-100 ${variants[variant]} ${className}`;

  if (to) {
    return <Link to={to} className={classes} {...props}>{children}</Link>;
  }

  return <button type={type} className={classes} {...props}>{children}</button>;
}
