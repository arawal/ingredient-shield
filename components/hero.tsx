import Image from 'next/image';

export function Hero() {
  return (
    <div className="flex flex-col gap-8 items-center justify-center w-full max-w-4xl mx-auto">
      <div className="flex flex-col gap-6 items-center text-center">
        <div className="relative w-32 h-32 md:w-40 md:h-40">
          <Image
            src="/icon-192x192.png"
            alt="Ingredient Shield Logo"
            fill
            className="object-contain rounded-2xl"
            priority
          />
        </div>
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold">Ingredient Shield</h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl">
            Scan food products to check ingredients against your dietary restrictions
          </p>
        </div>
      </div>
      <div className="w-full max-w-md p-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />
    </div>
  );
}
