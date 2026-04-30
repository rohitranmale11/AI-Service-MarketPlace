import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

export default function DashboardLayout({ title, subtitle, children }) {
  return (
    <div className="flex min-h-screen bg-mesh">
      <Sidebar />
      <main className="min-w-0 flex-1">
        <Topbar title={title} subtitle={subtitle} />
        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
