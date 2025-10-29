import Image from 'next/image';
import Link from 'next/link';

export function Hero() {
  return (
    <div className="flex max-w-[980px] flex-col items-center gap-4">
      <div className="flex flex-col items-center gap-2">
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
        <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:leading-[1.1]">
          Ingredient Shield
        </h1>
        <span className="inline-flex items-center rounded-lg bg-muted px-3 py-1 text-sm font-medium">
          Beta
        </span>
        <p className="max-w-[750px] text-lg text-muted-foreground sm:text-xl">
          Scan food products to check ingredients against your dietary restrictions
        </p>
      </div>
      <div className="flex w-full items-center justify-center space-x-4">
        <Link
          href="/scan"
          className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90"
        >
          Start Scanning
        </Link>
      </div>
    </div>
  );
}
