import Image from 'next/image';

export function Hero() {
  return (
    <div className="flex flex-col gap-8 items-center">
      <div className="flex flex-col gap-4 items-center">
        <div className="relative w-24 h-24">
          <Image
            src="/icon-192x192.png"
            alt="Ingredient Shield Logo"
            fill
            className="object-contain"
            priority
          />
        </div>
        <h1 className="text-4xl font-bold text-center">Ingredient Shield</h1>
      </div>
      <p className="text-xl lg:text-2xl !leading-tight mx-auto max-w-xl text-center text-muted-foreground">
        Scan food products to check ingredients against your dietary restrictions
      </p>
      <div className="w-full p-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent my-4" />
    </div>
  );
}
