import { Suspense } from 'react';
import { ResultClient } from '@/components/result-client';
import { Card, CardContent } from '@/components/ui/card';

export default function ResultPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto max-w-2xl p-4">
          <Card>
            <CardContent className="py-8">
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p>Loading...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      }
    >
      <ResultClient />
    </Suspense>
  );
}