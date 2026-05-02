export default function Card({ children, className = '' }) {
  return (
    <div className={`glass rounded-lg p-5 transition duration-200 hover:-translate-y-0.5 hover:shadow-glow sm:p-6 ${className}`}>
      {children}
    </div>
  );
}
