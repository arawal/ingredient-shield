'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

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
          <h3 className="text-lg font-semibold text-center mb-4">📱 Install as an App</h3>
          {isInstallable ? (
            <div className="text-center space-y-3">
              <Button 
                variant="secondary" 
                className="w-full"
                onClick={handleInstallClick}
              >
                Quick Install
              </Button>
              <p className="text-sm text-muted-foreground">
                Install for offline access and better performance
              </p>
            </div>
          ) : (
            <Tabs defaultValue={isIOS ? "ios" : "android"} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="ios">iPhone / iPad</TabsTrigger>
                <TabsTrigger value="android">Android / Chrome</TabsTrigger>
              </TabsList>
              
              <TabsContent value="ios" className="space-y-4">
                <div className="mt-4">
                  <p className="text-sm font-medium mb-3">Using Safari browser:</p>
                  <ol className="text-sm space-y-2 list-decimal pl-5">
                    <li className="pl-2">
                      Tap the <strong>Share</strong> button (↑) at the bottom of Safari
                    </li>
                    <li className="pl-2">
                      Scroll down in the share menu and tap <strong>Add to Home Screen</strong>
                    </li>
                    <li className="pl-2">
                      Review the app name and tap <strong>Add</strong> in the top right
                    </li>
                  </ol>
                  <p className="mt-3 text-xs text-muted-foreground">
                    Note: Installation only works in Safari browser on iOS
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="android" className="space-y-4">
                <div className="mt-4">
                  <p className="text-sm font-medium mb-3">Using Chrome browser:</p>
                  <ol className="text-sm space-y-2 list-decimal pl-5">
                    <li className="pl-2">
                      When you see the installation banner at the bottom, tap <strong>Install</strong>
                    </li>
                    <li className="pl-2">
                      If no banner appears, tap the menu button <strong>(⋮)</strong> at the top right
                    </li>
                    <li className="pl-2">
                      Select <strong>Install app</strong> from the menu
                    </li>
                    <li className="pl-2">
                      Tap <strong>Install</strong> in the confirmation dialog
                    </li>
                  </ol>
                  <p className="mt-3 text-xs text-muted-foreground">
                    Note: Installation works best in Chrome browser
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </Card>
      </div>
    </div>
  );
}
