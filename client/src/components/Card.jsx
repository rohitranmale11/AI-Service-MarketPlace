export default function Card({ children, className = '' }) {
  return (
    <div className={`glass rounded-2xl p-6 transition duration-200 hover:-translate-y-1 hover:shadow-glow ${className}`}>
      {children}
    </div>
  );
}
