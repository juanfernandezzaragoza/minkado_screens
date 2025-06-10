import MinkaDetailScreen from '@/components/screens/MinkaDetailScreen';
import AppLayout from '@/components/layouts/AppLayout';
import { dataService } from '@/services/dataService';

export default async function MinkaPage({ params }) {
  const { minkaId } = params;
  
  // Fetch minka data
  const minka = await dataService.getMinka(minkaId);
  const actions = await dataService.getMinkaActions(minkaId);
  const subMinkas = await dataService.getSubMinkas(minkaId);
  
  // Handle not found
  if (!minka) {
    return (
      <AppLayout showBackButton={true}>
        <div className="m-4 text-center">
          <h1 className="text-xl font-bold text-gray-800">Minka no encontrada</h1>
          <p className="text-gray-600 mt-2">La minka que buscás no existe.</p>
        </div>
      </AppLayout>
    );
  }
  
  return (
    <AppLayout showBackButton={true}>
      <MinkaDetailScreen 
        minka={minka}
        actions={actions}
        subMinkas={subMinkas}
      />
    </AppLayout>
  );
}

