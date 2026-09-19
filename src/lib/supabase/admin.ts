// Server-only Supabase client with the service role key.
// NEVER import this module from a Client Component.
import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { isDemoMode } from "@/lib/demo-mode";
import { createDemoClient } from "@/lib/supabase/demo-client";

export function createAdminClient() {
  if (isDemoMode()) {
    return createDemoClient() as unknown as ReturnType<typeof createSupabaseClient>;
  }
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}