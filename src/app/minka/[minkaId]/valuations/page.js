import MinkaValuationsScreen from '@/components/screens/MinkaValuationsScreen';
import AppLayout from '@/components/layouts/AppLayout';

export default async function MinkaValuationsPage({ params }) {
  // Await the params as required by Next.js 13+
  const resolvedParams = await params;
  
  // Debug: Let's see exactly what we're getting
  console.log('=== MinkaValuationsPage Debug ===');
  console.log('Resolved params:', resolvedParams);
  console.log('minkaId value:', resolvedParams?.minkaId);
  console.log('================================');

  // Show debug info on screen too
  return (
    <AppLayout showBackButton={true}>
      
      <MinkaValuationsScreen minkaId={resolvedParams?.minkaId} />
    </AppLayout>
  );
}