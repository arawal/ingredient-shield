import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export * from './metadata';

export default async function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  return (
    <div className="container mx-auto max-w-2xl p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Your Profile</h1>
        <Link href="/" className="inline-flex">
          <Button variant="ghost">Back to Home</Button>
        </Link>
      </div>
      <div className="bg-card rounded-lg shadow-lg p-4">
        {children}
      </div>
    </div>
  );
}