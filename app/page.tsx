import { EnvVarWarning } from "@/components/env-var-warning";
import { AuthButton } from "@/components/auth-button";
import { Hero } from "@/components/hero";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/lib/utils";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto max-w-6xl flex h-14 items-center">
          <div className="mr-4 hidden md:flex">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <span className="font-bold">Ingredient Shield</span>
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-between md:justify-end">
            <nav className="flex items-center gap-6">
              <AuthButton />
              <ThemeSwitcher />
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="space-y-6 pt-6 pb-8 md:pb-12 md:pt-10 lg:py-32">
          <div className="container mx-auto max-w-6xl">
            <div className="flex flex-col items-center gap-4 text-center">
              <Hero />
              {!hasEnvVars && <EnvVarWarning />}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-6 md:py-0">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col items-center justify-between gap-4 md:h-14 md:flex-row">
            <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
              © {new Date().getFullYear()} Ingredient Shield. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
