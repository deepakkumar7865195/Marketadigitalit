import { createBrowserClient } from "@supabase/ssr";
import { isDemoMode } from "@/lib/demo-mode";
import { createDemoClient } from "@/lib/supabase/demo-client";

export function createClient() {
  if (isDemoMode()) {
    return createDemoClient() as unknown as ReturnType<typeof createBrowserClient>;
  }
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );
}