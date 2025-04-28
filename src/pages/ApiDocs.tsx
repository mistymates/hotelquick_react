
import { useEffect, useState } from 'react';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';
import Layout from '@/components/layout/Layout';
import swaggerDocument from '@/swagger/swagger.json';
import { Card } from '@/components/ui/card';

export default function ApiDocs() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">API Documentation</h1>
        <p className="text-gray-600 mb-6">
          This is the documentation for the HotelQuick API. Note that in this demo,
          all API calls are simulated and the data is stored in localStorage.
        </p>
        
        <Card className="p-4">
          {isClient ? (
            <SwaggerUI spec={swaggerDocument} />
          ) : (
            <div className="flex items-center justify-center h-96">
              <p>Loading API documentation...</p>
            </div>
          )}
        </Card>
      </div>
    </Layout>
  );
}
