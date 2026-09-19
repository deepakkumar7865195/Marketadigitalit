"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";
import { isManagement } from "@/lib/auth";

/**
 * Returns a short-lived signed URL for a file in a private bucket.
 * Only the file owner or management roles can access files.
 */
export async function getSignedStorageUrl(bucket: string, path: string) {
  if (!path || !bucket) return { url: null, error: "Missing file path" };

  const { user, profile } = await getCurrentUser();
  if (!user) return { url: null, error: "Not authorized" };

  const owner = path.startsWith(`${user.id}/`) || path.includes(`/${user.id}/`) || path === user.id;
  if (!owner && !isManagement(profile?.role)) {
    return { url: null, error: "Not authorized" };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, 3600);
  if (error || !data) return { url: null, error: error?.message ?? "Could not retrieve file" };
  return { url: data.signedUrl, error: null };
}

/** Resolve a storage path to a public URL when the bucket is public, else signed URL. */
export async function resolveFileUrl(bucket: string, path: string) {
  if (!path) return null;
  const supabase = await createClient();
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  if (data?.publicUrl) return data.publicUrl;
  const signed = await getSignedStorageUrl(bucket, path);
  return signed.url;
}