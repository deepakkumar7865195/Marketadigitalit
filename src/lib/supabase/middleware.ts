import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { DEMO_SESSION_COOKIE, isDemoMode } from "@/lib/demo-mode";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  let user: { id: string; email?: string } | null = null;

  const hasSupabaseEnv =
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);

  if (isDemoMode() || !hasSupabaseEnv) {
    // Demo mode or unconfigured backend: no network call — auth state lives in a plain cookie.
    const uid = request.cookies.get(DEMO_SESSION_COOKIE)?.value;
    if (uid) user = { id: uid };
  } else {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
            supabaseResponse = NextResponse.next({ request });
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    // IMPORTANT: do not run code between createServerClient and auth.getUser()
    try {
      const {
        data: { user: u },
      } = await supabase.auth.getUser();
      user = u;
    } catch {
      // A failed/network-erroring auth lookup must not take the whole site down.
      user = null;
    }
  }

  const { pathname } = request.nextUrl;

  // Guest-only staff pages are public (they perform their own auth redirects).
  const GUEST_PAGES = ["/staff/login", "/staff/signup", "/staff/forgot-password", "/staff/reset-password"];

  // Protected staff area
  if (pathname.startsWith("/staff") && !user && !GUEST_PAGES.includes(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = "/staff/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  // Redirect logged-in users away from guest-only pages
  if (user && ["/staff/login", "/staff/signup"].includes(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = "/staff/dashboard";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}