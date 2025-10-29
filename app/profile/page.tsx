import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getRules, addRule, deleteRule, type Rule } from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  // Check authentication
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const rules = await getRules();

  return (
    <div className="flex min-h-screen w-full flex-col items-center p-4">
      <div className="w-full max-w-2xl space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>My Rules</CardTitle>
            <CardDescription>
              Manage your food preferences and restrictions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Add Rule Form */}
            <form action={addRule} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Select name="type" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="allergy">Allergy</SelectItem>
                      <SelectItem value="ethics">Ethics</SelectItem>
                      <SelectItem value="health">Health</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="value">Value</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="value"
                      name="value"
                      placeholder="e.g., peanuts, palm oil"
                      required
                    />
                    <Button type="submit">Add Rule</Button>
                  </div>
                </div>
              </div>
            </form>

            {/* Rules List */}
            <div className="space-y-4">
              {rules.length === 0 ? (
                <p className="text-center text-sm text-muted-foreground">
                  No rules added yet. Add your first rule above.
                </p>
              ) : (
                <div className="divide-y">
                  {rules.map((rule) => (
                    <div
                      key={rule.id}
                      className="flex items-center justify-between py-3"
                    >
                      <div>
                        <span className="font-medium capitalize">{rule.value}</span>
                        <span className="ml-2 text-sm text-muted-foreground">
                          ({rule.type})
                        </span>
                      </div>
                      <form action={deleteRule}>
                        <input type="hidden" name="id" value={rule.id} />
                        <Button variant="destructive" size="sm" type="submit">
                          Delete
                        </Button>
                      </form>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}