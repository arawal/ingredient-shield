'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from './ui/button';

export function Hero() {

  return (
    <div className="flex max-w-[980px] flex-col items-center gap-6 px-4">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="overflow-hidden rounded-lg">
          <Image
            src="/icon-512x512.png"
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
      </div>
    </div>
  );
}
