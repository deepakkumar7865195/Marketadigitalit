"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  ListTodo,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { formatDate } from "@/lib/format";
import type { Profile, TaskWithRelations } from "@/types";
import { ROLE_LABELS } from "@/lib/constants";
import { actionCreateTask, actionDeleteTask, actionUpdateMyTask, actionUpdateTask } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { UserAvatar } from "@/components/shared/user-avatar";

interface Props {
  tasks: TaskWithRelations[];
  projects: { id: string; name: string }[];
  employees: Profile[];
  currentProfile: Profile;
  canManage: boolean;
}

const STATUSES = ["Not Started", "In Progress", "Under Review", "Completed", "Blocked"] as const;
const PRIORITIES = ["Low", "Medium", "High", "Urgent"] as const;

export function TasksClient({ tasks, projects, employees, currentProfile, canManage }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectFilterParam = searchParams.get("project") ?? "all";

  const [statusFilter, setStatusFilter] = useState<"all" | "open" | "done">("open");
  const [projectFilter, setProjectFilter] = useState(projectFilterParam);
  const [createOpen, setCreateOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState<TaskWithRelations | null>(null);
  const [saving, setSaving] = useState(false);

  const filtered = useMemo(() => {
    return tasks.filter((t) => {
      if (statusFilter === "open" && t.status === "Completed") return false;
      if (statusFilter === "done" && t.status !== "Completed") return false;
      if (projectFilter !== "all" && t.project_id !== projectFilter) return false;
      return true;
    });
  }, [tasks, statusFilter, projectFilter]);

  const activeEmployees = employees.filter((e) => e.status === "active");

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const values = {
      title: String(form.get("title") ?? ""),
      projectId: String(form.get("projectId") ?? "") || null,
      assignedTo: String(form.get("assignedTo") ?? "") || null,
      description: String(form.get("description") ?? "") || null,
      priority: String(form.get("priority") ?? "Medium"),
      status: String(form.get("status") ?? "Not Started"),
      dueDate: String(form.get("dueDate") ?? "") || null,
    };
    setSaving(true);
    const result = await actionCreateTask(values);
    setSaving(false);
    if (result.success) {
      toast.success("Task created");
      setCreateOpen(false);
      router.refresh();
    } else toast.error(result.error ?? "Save failed");
  }

  async function changeStatus(t: TaskWithRelations, status: string) {
    const result = await actionUpdateTask(t.id, { status, projectId: null, assignedTo: null, title: t.title, priority: t.priority, dueDate: t.due_date });
    if (result.success) {
      toast.success("Task updated");
      router.refresh();
    } else toast.error(result.error ?? "Update failed");
  }

  async function submitMyUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!updateOpen) return;
    const form = new FormData(e.currentTarget);
    setSaving(true);
    const result = await actionUpdateMyTask(updateOpen.id, {
      status: String(form.get("status") ?? "In Progress"),
      workUpdate: String(form.get("workUpdate") ?? "") || null,
    });
    setSaving(false);
    if (result.success) {
      toast.success("Task updated");
      setUpdateOpen(null);
      router.refresh();
    } else toast.error(result.error ?? "Update failed");
  }

  async function remove(t: TaskWithRelations) {
    if (!confirm(`Delete task "${t.title}"?`)) return;
    const result = await actionDeleteTask(t.id);
    if (result.success) {
      toast.success("Task deleted");
      router.refresh();
    } else toast.error(result.error ?? "Delete failed");
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-xl font-bold">{canManage ? "All Tasks" : "My Tasks"}</h2>
          <p className="text-sm text-muted-foreground">{tasks.length} tasks · report daily work below</p>
        </div>
        {canManage ? (
          <Button onClick={() => setCreateOpen(true)} variant="gradient">
            <Plus className="mr-2 h-4 w-4" /> New Task
          </Button>
        ) : null}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex flex-wrap gap-2">
          {(["open", "done", "all"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={`rounded-full border px-3 py-1 text-xs font-medium capitalize transition-colors ${
                statusFilter === f ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:bg-muted"
              }`}
            >
              {f === "open" ? "Open" : f === "done" ? "Completed" : "All"}
            </button>
          ))}
        </div>
        <Select value={projectFilter} onChange={(e) => { setProjectFilter(e.target.value); router.replace(`/staff/tasks${e.target.value !== "all" ? `?project=${e.target.value}` : ""}`); }} className="sm:w-56">
          <option value="all">All Projects</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </Select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={ListTodo} title="No tasks found" description="Tasks matching your filters will appear here." />
      ) : (
        <div className="grid gap-3 lg:grid-cols-2">
          {filtered.map((t) => (
            <div key={t.id} className="rounded-xl border bg-card p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-semibold">{t.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {t.projects?.name ?? "No project"} · due {formatDate(t.due_date)}
                  </p>
                </div>
                <Badge variant="outline" className="shrink-0 text-[10px]">{t.priority}</Badge>
              </div>

              {t.description ? (
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{t.description}</p>
              ) : null}

              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <UserAvatar name={t.profiles?.full_name} photoPath={t.profiles?.profile_photo_url} className="h-7 w-7" />
                  <span className="text-xs text-muted-foreground">
                    {t.profiles?.full_name ?? "Unassigned"} · {ROLE_LABELS[currentProfile.role]}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {canManage ? (
                    <Select
                      value={t.status}
                      onChange={(e) => changeStatus(t, e.target.value)}
                      className="h-8 w-36 text-xs"
                      aria-label="Status"
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </Select>
                  ) : (
                    <StatusBadge status={t.status} />
                  )}
                  {canManage ? (
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => remove(t)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm" onClick={() => setUpdateOpen(t)}>
                      <Pencil className="mr-1.5 h-3.5 w-3.5" /> Update
                    </Button>
                  )}
                </div>
              </div>

              {!canManage && t.work_update ? (
                <p className="mt-3 rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
                  <span className="font-semibold text-foreground">Last update:</span> {t.work_update}
                </p>
              ) : null}
            </div>
          ))}
        </div>
      )}

      {canManage ? (
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <ListTodo className="h-4.5 w-4.5 text-primary" /> Create Task
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="title">Task Title *</Label>
                <Input id="title" name="title" required placeholder="e.g. On-page SEO audit for homepage" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="projectId">Project</Label>
                  <Select id="projectId" name="projectId" defaultValue={projectFilter !== "all" ? projectFilter : ""}>
                    <option value="">No project</option>
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="assignedTo">Assign To</Label>
                  <Select id="assignedTo" name="assignedTo" defaultValue="">
                    <option value="">Unassigned</option>
                    {activeEmployees.map((e) => (
                      <option key={e.id} value={e.id}>{e.full_name}</option>
                    ))}
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="priority">Priority</Label>
                  <Select id="priority" name="priority" defaultValue="Medium">
                    {PRIORITIES.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="status">Status</Label>
                  <Select id="status" name="status" defaultValue="Not Started">
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </Select>
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input id="dueDate" name="dueDate" type="date" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" rows={3} placeholder="Task details, acceptance criteria..." />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
                <Button type="submit" variant="gradient" disabled={saving}>
                  {saving ? "Saving..." : "Create Task"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      ) : null}

      {updateOpen ? (
        <Dialog open={!!updateOpen} onOpenChange={(v) => !v && setUpdateOpen(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update My Task</DialogTitle>
            </DialogHeader>
            <form onSubmit={submitMyUpdate} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="status">Status</Label>
                <Select id="status" name="status" defaultValue={updateOpen.status}>
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="workUpdate">Work Update</Label>
                <Textarea id="workUpdate" name="workUpdate" rows={3} placeholder="What have you completed / what's blocking you?" />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setUpdateOpen(null)}>Cancel</Button>
                <Button type="submit" variant="gradient" disabled={saving}>
                  {saving ? "Saving..." : "Save Update"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      ) : null}
    </div>
  );
}