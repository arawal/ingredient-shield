'use client';

import { BarcodeScanner } from '@/components/barcode-scanner';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function ScanPage() {
  const router = useRouter();

  const handleScan = async (barcode: string) => {
    // Navigate to result page with the scanned barcode
    router.push(`/result?barcode=${encodeURIComponent(barcode)}`);
  };

  return (
    <div className="container mx-auto max-w-2xl p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Scan Product Barcode</h1>
        <Button 
          variant="ghost" 
          onClick={() => window.location.href = '/profile'}
        >
          Back to Profile
        </Button>
      </div>
      
      <div className="bg-card rounded-lg shadow-lg p-4">
        <BarcodeScanner 
          onScan={handleScan}
          onClose={() => window.location.href = '/profile'}
        />
        <p className="text-sm text-muted-foreground mt-4 text-center">
          Position the barcode in the center of the camera view
        </p>
      </div>
    </div>
  );
}