import { createClient } from "./client";

export async function signInAnonymously() {
  const supabase = createClient();
  
  try {
    const { data: { session }, error } = await supabase.auth.signUp({
      email: `${Math.random().toString(36).slice(2)}@anonymous.user`,
      password: Math.random().toString(36).slice(2),
    });

    if (error) throw error;

    return { session, error: null };
  } catch (error) {
    return { session: null, error };
  }
}