
import CrearMinkaScreen from '@/components/screens/CrearMinkaScreen';
import AppLayout from '@/components/layouts/AppLayout';

export default function CrearMinkaPage() {
  return (
    <AppLayout showBackButton={true}>
      <CrearMinkaScreen />
    </AppLayout>
  );
}