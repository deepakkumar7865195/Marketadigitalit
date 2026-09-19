"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { RefreshCw } from "lucide-react";
import { actionUpdateProjectProgress } from "@/lib/actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function ProjectProgressEditor({ projectId, progress }: { projectId: string; progress: number }) {
  const router = useRouter();
  const [value, setValue] = useState(progress);
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    const result = await actionUpdateProjectProgress(projectId, value);
    setSaving(false);
    if (result.success) {
      toast.success("Progress updated");
      router.refresh();
    } else toast.error(result.error ?? "Update failed");
  }

  return (
    <div className="flex items-center gap-3">
      <Input
        type="number"
        min={0}
        max={100}
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        className="w-24"
      />
      <span className="text-sm font-semibold">%</span>
      <Button variant="outline" size="sm" onClick={save} disabled={saving}>
        <RefreshCw className={`mr-1.5 h-3.5 w-3.5 ${saving ? "animate-spin" : ""}`} />
        {saving ? "Updating..." : "Save"}
      </Button>
    </div>
  );
}