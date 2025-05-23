import PactarScreen from '@/components/screens/PactarScreen';
import AppLayout from '@/components/layouts/AppLayout';

export default function PactarPage() {
  return (
    <AppLayout showBackButton={true}>
      <PactarScreen />
    </AppLayout>
  );
}