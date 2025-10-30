'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';

// Define the BeforeInstallPromptEvent type
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function Hero() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if it's iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(isIOSDevice);

    // Listen for the beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    });
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setIsInstallable(false);
    }
  };

  return (
    <div className="flex max-w-[980px] flex-col items-center gap-6 px-4">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="overflow-hidden rounded-lg">
          <Image
            src="/icon-192x192.png"
            alt="Ingredient Shield Logo"
            width={120}
            height={120}
            className="aspect-square"
            priority
          />
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-bold leading-tight tracking-tighter md:text-6xl lg:leading-[1.1]">
            Ingredient Shield
          </h1>
          <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            Free & Private
          </span>
        </div>
        <p className="max-w-[750px] text-lg text-muted-foreground sm:text-xl">
          Your personal food safety assistant. Instantly scan products to check 
          for allergens, dietary restrictions, and ingredient concerns.
        </p>
      </div>

      <div className="flex w-full flex-col items-center gap-4">
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link href="/profile">
            <Button size="lg" className="font-semibold">
              Set Up Your Rules
            </Button>
          </Link>
          <Link href="/scan">
            <Button size="lg" variant="outline" className="font-semibold">
              Start Scanning
            </Button>
          </Link>
        </div>

        {/* Installation Card */}
        <Card className="mt-4 w-full max-w-md p-4">
          <h3 className="text-lg font-semibold text-center">📱 Install as an App</h3>
          <div className="mt-3 space-y-4">
            {isInstallable ? (
              <div className="text-center">
                <Button 
                  variant="secondary" 
                  className="w-full"
                  onClick={handleInstallClick}
                >
                  Install Now
                </Button>
                <p className="mt-2 text-sm text-muted-foreground">
                  Install for faster access and offline capabilities
                </p>
              </div>
            ) : isIOS ? (
              <div className="space-y-2">
                <p className="text-sm font-medium">To install on iOS:</p>
                <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                  <li>Tap the <span className="font-semibold">Share</span> button ↗️</li>
                  <li>Scroll and select <span className="font-semibold">Add to Home Screen</span></li>
                  <li>Tap <span className="font-semibold">Add</span> in the top right</li>
                </ol>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-sm font-medium">To install on Android/Desktop:</p>
                <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                  <li>Open in Chrome browser</li>
                  <li>Tap the menu (⋮) in the top right</li>
                  <li>Select <span className="font-semibold">Install app</span></li>
                </ol>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
