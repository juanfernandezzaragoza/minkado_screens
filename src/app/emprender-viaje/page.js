import EmprenderViajeScreen from '@/components/screens/EmprenderViajeScreen';
import AppLayout from '@/components/layouts/AppLayout';

export default function EmprenderViajePage() {
  return (
    <AppLayout showBackButton={true}>
      <EmprenderViajeScreen />
    </AppLayout>
  );
}