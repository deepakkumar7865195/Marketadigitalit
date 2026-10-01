import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Only the staff portal and the auth callback need a Supabase session.
     * Leaving the public marketing site out of the matcher keeps it
     * independent of Supabase configuration.
     */
    "/staff/:path*",
    "/auth/:path*",
  ],
};