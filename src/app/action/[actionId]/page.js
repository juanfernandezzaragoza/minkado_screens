import ActionDetailScreen from '@/components/screens/ActionDetailScreen';
import AppLayout from '@/components/layouts/AppLayout';
import { dataService } from '@/services/dataService';

export default async function ActionPage({ params, searchParams }) {
  const { actionId } = await params;
  const resolvedSearchParams = await searchParams;
  const minkaId = resolvedSearchParams?.minka; //Default to pescadores
  
  // Fetch the complete action details
  const action = await dataService.getAction(actionId);
  
  // Fetch minka context if provided
  let minkaContext = null;
  if (minkaId) {
    try {
      minkaContext = await dataService.getMinka(minkaId);
    } catch (error) {
      console.error('Error fetching minka context:', error);
    }
  }
  
  // Handle not found
  if (!action) {
    return (
      <AppLayout showBackButton={true}>
        <div className="m-4 text-center">
          <h1 className="text-xl font-bold text-gray-800">Acción no encontrada</h1>
          <p className="text-gray-600 mt-2">La acción que buscás no existe.</p>
        </div>
      </AppLayout>
    );
  }
  
  return (
    <AppLayout showBackButton={true}>
      <ActionDetailScreen action={action} minkaContext={minkaContext} />
    </AppLayout>
  );
}