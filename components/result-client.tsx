'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface ProductResult {
  productName: string;
  status: 'green' | 'red';
  violations: string[];
  ingredients?: string[] | string | null;
}

function formatIngredients(ingredients: string[] | string | null | undefined): string {
  if (!ingredients) return 'No ingredients information available';
  if (Array.isArray(ingredients)) return ingredients.join(', ');
  if (typeof ingredients === 'string') return ingredients;
  return 'Invalid ingredients format';
}

export function ResultClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const barcode = searchParams.get('barcode');
  const [result, setResult] = useState<ProductResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkProduct() {
      if (!barcode) {
        setError('No barcode provided');
        setIsLoading(false);
        return;
      }

      try {
        const supabase = createClient();
        
        // Get the session before making the function call
        const { data: { session }, error: authError } = await supabase.auth.getSession();
        
        if (authError || !session) {
          throw new Error(authError?.message || 'Please sign in to scan products');
        }

        // Include session token in the function call
        const { data, error } = await supabase.functions.invoke('check-product', {
          body: { barcode },
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });

        if (error) throw error;

        setResult(data as ProductResult);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to check product');
      } finally {
        setIsLoading(false);
      }
    }

    checkProduct();
  }, [barcode]);

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-2xl p-4">
        <Card>
          <CardContent className="py-8">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p>Checking product...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="container mx-auto max-w-2xl p-4">
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error || 'Failed to load result'}</p>
            <div className="mt-4 flex space-x-4">
              <Button onClick={() => router.push('/scan')}>
                Scan Again
              </Button>
              <Button variant="outline" onClick={() => router.push('/profile')}>
                Back to Profile
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isGreen = result.status === 'green';

  return (
    <div className="container mx-auto max-w-2xl p-4">
      <Card className={isGreen ? 'border-green-500' : 'border-destructive'}>
        <CardHeader>
          <CardTitle className={isGreen ? 'text-green-700' : 'text-destructive'}>
            {isGreen ? '✓ Safe to Consume' : '⚠ Warning'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">{result.productName}</h2>
            <p className="text-sm text-muted-foreground">
              Ingredients: {formatIngredients(result.ingredients)}
            </p>
          </div>

          {!isGreen && result.violations.length > 0 && (
            <div className="bg-destructive/10 p-4 rounded-lg space-y-2">
              <h3 className="font-semibold">
                Found {result.violations.length} issue{result.violations.length === 1 ? '' : 's'}:
              </h3>
              <ul className="list-disc list-inside space-y-1">
                {result.violations.map((violation) => (
                  <li key={violation} className="text-sm">
                    {violation}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex space-x-4 pt-4">
            <Button onClick={() => router.push('/scan')}>
              Scan Another
            </Button>
            <Button variant="outline" onClick={() => router.push('/profile')}>
              Back to Profile
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}