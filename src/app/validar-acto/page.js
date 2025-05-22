import ValidarActoScreen from '@/components/screens/ValidarActoScreen';
import AppLayout from '@/components/layouts/AppLayout';

export default function ValidarActoPage() {
  return (
    <AppLayout showBackButton={true}>
      <ValidarActoScreen />
    </AppLayout>
  );
}