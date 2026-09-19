"use client";

import { useEffect, useState } from "react";

export function useFileUrl(bucket: string, path: string | null | undefined) {
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!path) {
      setUrl(null);
      return;
    }
    let active = true;
    setLoading(true);
    async function load() {
      const { getSignedStorageUrl } = await import("@/lib/files");
      const res = await getSignedStorageUrl(bucket, path as string);
      if (active) {
        setUrl(res.url);
        setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [bucket, path]);

  return { url, loading };
}