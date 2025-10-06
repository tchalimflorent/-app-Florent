import { AppLayout } from '@/components/AppLayout';
import { PaymentLinksDashboard } from '@/components/PaymentLinksDashboard';
export function HomePage() {
  return (
    <AppLayout>
      <PaymentLinksDashboard />
    </AppLayout>
  );
}