import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarRange, FolderKanban, Users } from "lucide-react";
import { getProjectById } from "@/lib/queries";
import { getCurrentUser, isAdmin, isManagement } from "@/lib/auth";
import { formatDate } from "@/lib/format";
import { StatusBadge } from "@/components/shared/status-badge";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { EmptyState } from "@/components/shared/empty-state";
import { UserAvatar } from "@/components/shared/user-avatar";
import { ProjectProgressEditor } from "@/components/projects/project-progress-editor";

interface Props {
  params: Promise<{ id: string }>;
}

export const metadata = { title: "Project Details" };

export default async function ProjectDetailPage({ params }: Props) {
  const { id } = await params;
  const { profile } = await getCurrentUser();
  const project = await getProjectById(id);
  if (!project) notFound();

  const management = isManagement(profile?.role);
  const isAdminRole = isAdmin(profile?.role);
  if (!management) notFound();

  const members = (project.project_members ?? []) as Array<{
    id: string;
    user_id: string;
    profiles: {
      id: string;
      full_name: string | null;
      profile_photo_url: string | null;
      designation: string | null;
      department: string | null;
    } | null;
  }>;
  const tasks = (project.tasks ?? []) as Array<{
    id: string;
    title: string;
    status: string;
    assigned_to: string;
    due_date: string | null;
  }>;
  const doneTasks = tasks.filter((t) => t.status === "Completed").length;

  return (
    <div className="space-y-6">
      <Link href="/staff/projects" className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
        <ArrowLeft className="h-4 w-4" /> Back to Projects
      </Link>

      <div className="rounded-xl border bg-card p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-display text-2xl font-bold">{project.name}</h1>
              <StatusBadge status={project.status} />
              <Badge variant="outline" className="text-xs">{project.priority}</Badge>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {project.clients?.company_name ?? "Internal project"}
            </p>
          </div>
          {management ? <ProjectProgressEditor projectId={project.id} progress={project.progress} /> : null}
        </div>

        <p className="mt-4 max-w-3xl leading-relaxed text-muted-foreground">
          {project.description ?? "No description provided."}
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-muted/50 p-4">
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <CalendarRange className="h-3.5 w-3.5" /> Timeline
            </p>
            <p className="mt-1 text-sm font-semibold">
              {formatDate(project.start_date)} → {formatDate(project.due_date)}
            </p>
          </div>
          <div className="rounded-xl bg-muted/50 p-4">
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <FolderKanban className="h-3.5 w-3.5" /> Tasks
            </p>
            <p className="mt-1 text-sm font-semibold">{doneTasks} / {tasks.length} completed</p>
          </div>
          <div className="rounded-xl bg-muted/50 p-4">
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Users className="h-3.5 w-3.5" /> Team
            </p>
            <p className="mt-1 text-sm font-semibold">{members.length} member(s)</p>
          </div>
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Overall Progress</span>
            <span className="font-bold">{project.progress}%</span>
          </div>
          <Progress value={project.progress} className="mt-2 h-2.5" />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <h2 className="mb-4 font-display text-base font-semibold">Team Members</h2>
          {members.length === 0 ? (
            <EmptyState title="No members yet" description="Assign employees to this project." className="py-8" />
          ) : (
            <ul className="space-y-3">
              {members.map((m) => (
                <li key={m.id} className="flex items-center gap-3">
                  <UserAvatar name={m.profiles?.full_name} photoPath={m.profiles?.profile_photo_url} className="h-9 w-9" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{m.profiles?.full_name ?? "Employee"}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {m.profiles?.designation ?? m.profiles?.department ?? "—"}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-xl border bg-card p-5 shadow-sm lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-base font-semibold">Project Tasks</h2>
            {(management || isAdminRole) ? (
              <Link href={`/staff/tasks?project=${project.id}`} className="text-xs font-medium text-primary hover:underline">
                Manage in Tasks
              </Link>
            ) : null}
          </div>
          {tasks.length === 0 ? (
            <EmptyState icon={FolderKanban} title="No tasks yet" description="Create tasks for this project from the Tasks page." />
          ) : (
            <ul className="divide-y">
              {tasks.map((t) => {
                const assignee = members.find((m) => m.user_id === t.assigned_to);
                return (
                  <li key={t.id} className="flex items-center justify-between gap-3 py-3">
                    <div className="min-w-0">
                      <p className="truncate font-medium">{t.title}</p>
                      <p className="text-xs text-muted-foreground">
                        Assigned to {assignee?.profiles?.full_name ?? "—"} · due {formatDate(t.due_date)}
                      </p>
                    </div>
                    <StatusBadge status={t.status} />
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}