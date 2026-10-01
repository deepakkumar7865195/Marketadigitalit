import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export function isSupabaseConfigured() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  return Boolean(url && key && url.startsWith("http"));
}

export async function updateSession(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Guest-only staff pages are public (they perform their own auth redirects).
  const GUEST_PAGES = ["/staff/login", "/staff/signup", "/staff/forgot-password", "/staff/reset-password"];

  // Without Supabase credentials there is no session to read. Let the request
  // through and let the page/route guards handle access, rather than crashing
  // every request including the public marketing site.
  if (!isSupabaseConfigured()) {
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({ request });

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
  const {
    data: { user },
  } = await supabase.auth.getUser();

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