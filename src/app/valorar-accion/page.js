import ValorarAccionScreen from '@/components/screens/ValorarAccionScreen';
import AppLayout from '@/components/layouts/AppLayout';

export default async function ValorarAccionPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  
  return (
    <AppLayout showBackButton={true}>
      <ValorarAccionScreen searchParams={resolvedSearchParams} />
    </AppLayout>
  );
}