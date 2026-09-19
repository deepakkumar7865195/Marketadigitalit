"use client";

import type { SupabaseClient } from "@supabase/supabase-js";

export async function getBrowserClient() {
  const { createClient } = await import("@/lib/supabase/client");
  return createClient();
}

export async function uploadToBucket(
  supabase: SupabaseClient,
  bucket: string,
  path: string,
  file: Blob,
  contentType: string
) {
  const { error, data } = await supabase.storage.from(bucket).upload(path, file, {
    upsert: true,
    contentType,
  });
  if (error) throw new Error(error.message);
  return data.path;
}