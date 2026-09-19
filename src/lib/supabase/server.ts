import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { isDemoMode } from "@/lib/demo-mode";
import { createDemoClient } from "@/lib/supabase/demo-client";

async function createRealClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Called from a Server Component — safe to ignore when middleware refreshes sessions
          }
        },
      },
    }
  );
}

type RealClient = ReturnType<typeof createRealClient>;

export async function createClient(): Promise<RealClient> {
  const cookieStore = await cookies();

  if (isDemoMode()) {
    return createDemoClient({
      get: (name) => cookieStore.get(name)?.value ?? null,
      set: (name, value, options) => {
        try {
          cookieStore.set(name, value, options);
        } catch {
          // Called from a Server Component — safe to ignore
        }
      },
      delete: (name) => {
        try {
          cookieStore.delete(name);
        } catch {
          // Called from a Server Component — safe to ignore
        }
      },
    }) as unknown as RealClient;
  }

  return createRealClient();
}