"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Briefcase, Loader2, Send } from "lucide-react";
import { todayStr } from "@/lib/format";
import type { TaskWithRelations } from "@/types";
import { actionSubmitReport } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  projects: { id: string; name: string }[];
  tasks: TaskWithRelations[];
}

export function DailyReportForm({ projects, tasks }: Props) {
  const router = useRouter();
  const [projectId, setProjectId] = useState("");
  const [taskId, setTaskId] = useState("");
  const [saving, setSaving] = useState(false);

  const filteredTasks = useMemo(
    () => (projectId ? tasks.filter((t) => t.project_id === projectId) : tasks),
    [tasks, projectId]
  );

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const values = {
      reportDate: String(form.get("reportDate") ?? todayStr()),
      projectId: String(form.get("projectId") ?? "") || null,
      taskId: String(form.get("taskId") ?? "") || null,
      workSummary: String(form.get("workSummary") ?? ""),
      hoursSpent: Number(form.get("hoursSpent") ?? 0),
      status: String(form.get("status") ?? "In Progress") || null,
    };
    setSaving(true);
    const result = await actionSubmitReport(values);
    setSaving(false);
    if (result.success) {
      toast.success("Daily report submitted");
      e.currentTarget.reset();
      setProjectId("");
      setTaskId("");
      router.refresh();
    } else toast.error(result.error ?? "Save failed");
  }

  return (
    <form onSubmit={onSubmit} className="rounded-xl border bg-card p-5 shadow-sm" noValidate>
      <h3 className="mb-4 flex items-center gap-2 font-display text-base font-semibold">
        <Briefcase className="h-4 w-4 text-primary" /> Log Today's Work
      </h3>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="reportDate">Report Date</Label>
          <Input id="reportDate" name="reportDate" type="date" defaultValue={todayStr()} required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="hoursSpent">Hours Spent</Label>
          <Input id="hoursSpent" name="hoursSpent" type="number" step="0.5" min={0.5} max={24} placeholder="e.g. 7.5" required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="projectId">Project</Label>
          <Select id="projectId" name="projectId" value={projectId} onChange={(e) => { setProjectId(e.target.value); setTaskId(""); }}>
            <option value="">No project</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="taskId">Task</Label>
          <Select id="taskId" name="taskId" value={taskId} onChange={(e) => setTaskId(e.target.value)}>
            <option value="">No task</option>
            {filteredTasks.map((t) => (
              <option key={t.id} value={t.id}>{t.title}</option>
            ))}
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="status">Work Status</Label>
          <Select id="status" name="status" defaultValue="In Progress">
            <option value="Not Started">Not Started</option>
            <option value="In Progress">In Progress</option>
            <option value="Under Review">Under Review</option>
            <option value="Completed">Completed</option>
            <option value="Blocked">Blocked</option>
          </Select>
        </div>
      </div>
      <div className="mt-3 space-y-1.5">
        <Label htmlFor="workSummary">Work Summary *</Label>
        <Textarea
          id="workSummary"
          name="workSummary"
          rows={3}
          required
          placeholder="What did you work on today? What's the status of your assigned tasks?"
        />
      </div>
      <Button type="submit" variant="gradient" className="mt-4" disabled={saving}>
        {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
        {saving ? "Submitting..." : "Submit Daily Report"}
      </Button>
    </form>
  );
}