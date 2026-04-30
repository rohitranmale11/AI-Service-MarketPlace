import Navbar from '../components/Navbar';

export default function MarketingLayout({ children }) {
  return (
    <div className="min-h-screen">
      <Navbar />
      {children}
    </div>
  );
}
