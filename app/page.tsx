import { EnvVarWarning } from "@/components/env-var-warning";
import { AuthButton } from "@/components/auth-button";
import { Hero } from "@/components/hero";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/lib/utils";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <nav className="w-full border-b border-b-foreground/10">
        <div className="container mx-auto flex justify-between items-center h-16 px-4">
          <div className="flex gap-5 items-center">
            <Link href={"/"} className="text-lg font-semibold hover:opacity-80 transition-opacity">
              Ingredient Shield
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <AuthButton />
            <ThemeSwitcher />
          </div>
        </div>
      </nav>

      <div className="flex-1 container mx-auto px-4 py-12 md:py-24">
        <Hero />
        {!hasEnvVars && <EnvVarWarning />}
      </div>

      <footer className="w-full border-t">
        <div className="container mx-auto py-6 px-4 text-center text-sm text-muted-foreground">
          <p>Ingredient Shield © {new Date().getFullYear()}</p>
        </div>
      </footer>
    </main>
  );
}
