import { AdminPageLayout } from '@/components/admin';
import { SectionCard } from '@/components/admin';

export const metadata = {
  title: 'Dashboard | Admin',
};

export default function DashboardPage() {
  return (
    <AdminPageLayout
      title="Dashboard"
      description="Welcome to the admin dashboard"
    >
      <SectionCard
        title="Coming Soon"
        description="Dashboard widgets and analytics will be implemented in future phases."
      >
        <div className="py-8 text-center text-muted-foreground">
          <p>The admin foundation is ready for future dashboard features.</p>
        </div>
      </SectionCard>
    </AdminPageLayout>
  );
}
