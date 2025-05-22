import MisMovimientosScreen from '@/components/screens/MisMovimientosScreen';
import AppLayout from '@/components/layouts/AppLayout';

export default function MisMovimientosPage() {
  return (
    <AppLayout showBackButton={true}>
      <MisMovimientosScreen />
    </AppLayout>
  );
}