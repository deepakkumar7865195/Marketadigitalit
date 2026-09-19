"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  CalendarRange,
  FolderKanban,
  Pencil,
  Plus,
  Trash2,
  Users,
} from "lucide-react";
import { formatDate } from "@/lib/format";
import type { Client, Profile, ProjectWithRelations } from "@/types";
import { ROLE_LABELS } from "@/lib/constants";
import { actionCreateProject, actionDeleteProject, actionUpdateProject } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { UserAvatar } from "@/components/shared/user-avatar";

interface Props {
  projects: ProjectWithRelations[];
  clients: Client[];
  employees: Profile[];
  isManagement: boolean;
  isAdmin: boolean;
  canEdit: boolean;
}

const STATUSES = ["Planning", "Active", "On Hold", "Completed", "Cancelled"] as const;
const PRIORITIES = ["Low", "Medium", "High", "Urgent"] as const;

export function ProjectsClient({ projects, clients, employees, isManagement, canEdit, isAdmin }: Props) {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<ProjectWithRelations | null>(null);
  const [saving, setSaving] = useState(false);

  const filtered = useMemo(
    () => (statusFilter === "all" ? projects : projects.filter((p) => p.status === statusFilter)),
    [projects, statusFilter]
  );

  const activeEmployees = employees.filter((e) => e.status === "active");

  function openCreate() {
    setEditing(null);
    setDialogOpen(true);
  }
  function openEdit(p: ProjectWithRelations) {
    setEditing(p);
    setDialogOpen(true);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const checkedIds = (form.getAll("memberIds") as string[]).map(Number);
    const values = {
      name: String(form.get("name") ?? ""),
      clientId: String(form.get("clientId") ?? "") || null,
      description: String(form.get("description") ?? "") || null,
      startDate: String(form.get("startDate") ?? "") || null,
      dueDate: String(form.get("dueDate") ?? "") || null,
      status: String(form.get("status") ?? "Planning"),
      priority: String(form.get("priority") ?? "Medium"),
      progress: Number(form.get("progress") ?? 0),
      memberIds: activeEmployees.filter((_, i) => checkedIds.includes(i)).map((x) => x.id),
    };
    setSaving(true);
    const result = editing ? await actionUpdateProject(editing.id, values) : await actionCreateProject(values);
    setSaving(false);
    if (result.success) {
      toast.success(editing ? "Project updated" : "Project created");
      setDialogOpen(false);
      router.refresh();
    } else toast.error(result.error ?? "Save failed");
  }

  async function remove(p: ProjectWithRelations) {
    if (!confirm(`Delete project "${p.name}"? This will remove associated team and tasks.`)) return;
    const result = await actionDeleteProject(p.id);
    if (result.success) {
      toast.success("Project deleted");
      router.refresh();
    } else toast.error(result.error ?? "Delete failed");
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-xl font-bold">Projects</h2>
          <p className="text-sm text-muted-foreground">{projects.length} projects · {projects.filter((p) => p.status === "Active").length} active</p>
        </div>
        {canEdit ? (
          <Button onClick={openCreate} variant="gradient">
            <Plus className="mr-2 h-4 w-4" /> New Project
          </Button>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {["all", ...STATUSES].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
              statusFilter === s ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:bg-muted"
            }`}
          >
            {s === "all" ? "All" : s}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={FolderKanban} title="No projects found" description="Create a new project to start organizing your team's work." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((p) => (
            <div key={p.id} className="group rounded-xl border bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
              <div className="flex items-start justify-between gap-3">
                <button onClick={() => router.push(`/staff/projects/${p.id}`)} className="min-w-0 flex-1 text-left">
                  <h3 className="truncate font-display font-semibold group-hover:text-primary">{p.name}</h3>
                  <p className="text-xs text-muted-foreground">{p.clients?.company_name ?? "Internal project"}</p>
                </button>
                <div className="flex items-center gap-1.5">
                  <Badge variant="outline" className="text-[10px]">{p.priority}</Badge>
                  {canEdit ? (
                    <>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(p)}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      {isAdmin ? (
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => remove(p)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      ) : null}
                    </>
                  ) : null}
                </div>
              </div>

              <p className="mt-2 line-clamp-2 min-h-10 text-sm text-muted-foreground">{p.description ?? "No description."}</p>

              <div className="mt-4 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-semibold">{p.progress}%</span>
                </div>
                <Progress value={p.progress} className="h-2" />
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <CalendarRange className="h-3.5 w-3.5" />
                  {p.due_date ? `Due ${formatDate(p.due_date)}` : "No deadline"}
                </div>
                <StatusBadge status={p.status} />
              </div>

              <div className="mt-3 flex items-center justify-between border-t pt-3">
                <div className="flex -space-x-2">
                  {(p.project_members ?? []).slice(0, 4).map((m) => (
                    <UserAvatar key={m.user_id} name={m.profiles?.full_name} photoPath={m.profiles?.profile_photo_url} className="h-7 w-7 border-2 border-background" />
                  ))}
                  {(p.project_members ?? []).length > 4 ? (
                    <span className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-background bg-muted text-[10px] font-semibold">
                      +{(p.project_members ?? []).length - 4}
                    </span>
                  ) : null}
                </div>
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <Users className="h-3.5 w-3.5" /> {(p.project_members ?? []).length} · {(p.tasks ?? []).length} tasks
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <ProjectDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        project={editing}
        clients={clients}
        employees={activeEmployees}
        onSave={handleSubmit}
        saving={saving}
      />
    </div>
  );

  void isManagement;
}

function ProjectDialog({
  open,
  onOpenChange,
  project,
  clients,
  employees,
  onSave,
  saving,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  project: ProjectWithRelations | null;
  clients: Client[];
  employees: Profile[];
  onSave: (e: React.FormEvent<HTMLFormElement>) => void;
  saving: boolean;
}) {
  const memberIds = new Set((project?.project_members ?? []).map((m) => m.user_id));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] w-[95vw] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FolderKanban className="h-4.5 w-4.5 text-primary" />
            {project ? "Edit Project" : "New Project"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={onSave} className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="name">Project Name *</Label>
              <Input id="name" name="name" required defaultValue={project?.name ?? ""} placeholder="e.g. SEO — Bakers Street" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="clientId">Client</Label>
              <Select id="clientId" name="clientId" defaultValue={project?.client_id ?? ""}>
                <option value="">Internal / No client</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>{c.company_name}</option>
                ))}
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="priority">Priority</Label>
              <Select id="priority" name="priority" defaultValue={project?.priority ?? "Medium"}>
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="status">Status</Label>
              <Select id="status" name="status" defaultValue={project?.status ?? "Planning"}>
                {STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="progress">Progress (%)</Label>
              <Input id="progress" name="progress" type="number" min={0} max={100} defaultValue={project?.progress ?? 0} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="startDate">Start Date</Label>
              <Input id="startDate" name="startDate" type="date" defaultValue={project?.start_date?.slice(0, 10) ?? ""} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input id="dueDate" name="dueDate" type="date" defaultValue={project?.due_date?.slice(0, 10) ?? ""} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" rows={3} defaultValue={project?.description ?? ""} placeholder="Project brief, goals, deliverables..." />
          </div>

          <div className="space-y-2">
            <Label>Team Members</Label>
            {employees.length === 0 ? (
              <p className="text-sm text-muted-foreground">No active employees yet. Add employees first.</p>
            ) : (
              <div className="grid max-h-44 gap-1.5 overflow-y-auto rounded-xl border p-3 sm:grid-cols-2">
                {employees.map((emp, i) => (
                  <label key={emp.id} className="flex cursor-pointer items-center gap-2.5 rounded-lg p-1.5 hover:bg-muted">
                    <input
                      type="checkbox"
                      name="memberIds"
                      value={i}
                      defaultChecked={memberIds.has(emp.id)}
                      className="h-4 w-4 rounded border-input accent-primary"
                    />
                    <UserAvatar name={emp.full_name} photoPath={emp.profile_photo_url} className="h-6 w-6" />
                    <span className="min-w-0 flex-1 truncate text-sm">{emp.full_name}</span>
                    <span className="text-xs text-muted-foreground">{ROLE_LABELS[emp.role]}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" variant="gradient" disabled={saving}>
              {saving ? "Saving..." : project ? "Save Changes" : "Create Project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}