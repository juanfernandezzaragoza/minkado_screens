// src/app/debug/page.js
import { dataService } from '@/services/dataService';
import { mockActionDetails } from '@/data';

export default async function DebugPage() {
  // Test direct import
  const directImport = mockActionDetails;
  
  // Test dataService
  const actionFromService = await dataService.getAction('emprender-viaje');
  
  // Get all actions
  const allActions = await dataService.getActions();
  
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Debug Page</h1>
      
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Direct Import Test</h2>
        <pre className="bg-gray-100 p-4 rounded overflow-auto">
          mockActionDetails exists: {directImport ? 'YES' : 'NO'}
          {'\n'}
          Keys: {directImport ? Object.keys(directImport).join(', ') : 'N/A'}
        </pre>
      </section>
      
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">DataService Test</h2>
        <pre className="bg-gray-100 p-4 rounded overflow-auto">
          Action from service: {actionFromService ? 'FOUND' : 'NOT FOUND'}
          {'\n'}
          {actionFromService && JSON.stringify(actionFromService, null, 2)}
        </pre>
      </section>
      
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">All Actions</h2>
        <pre className="bg-gray-100 p-4 rounded overflow-auto">
          Total actions: {allActions.length}
          {'\n'}
          Action IDs: {allActions.map(a => a.id).join(', ')}
        </pre>
      </section>
    </div>
  );
}