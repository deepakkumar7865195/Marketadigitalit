import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, AtSign, Building2, FolderKanban, Globe, MapPin, Pencil, Phone, StickyNote } from "lucide-react";
import { getClientById } from "@/lib/queries";
import { requireRole } from "@/lib/auth";
import { formatDate } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { UserAvatar } from "@/components/shared/user-avatar";

interface Props {
  params: Promise<{ id: string }>;
}

export const metadata = { title: "Client Details" };

export default async function ClientDetailPage({ params }: Props) {
  const { id } = await params;
  const profile = await requireRole(["super_admin", "admin", "manager"]);
  if (!profile) redirect("/staff/clients");
  const client = await getClientById(id);
  if (!client) notFound();

  const projects = (client.projects ?? []) as Array<{
    id: string;
    name: string;
    description: string | null;
    start_date: string | null;
    due_date: string | null;
    status: string;
    priority: string;
    progress: number;
    project_members?: {
      user_id: string;
      profiles: { full_name: string | null; profile_photo_url: string | null } | null;
    }[];
    tasks?: { id: string; status: string; title: string; assigned_to: string }[];
  }>;

  return (
    <div className="space-y-6">
      <Link href="/staff/clients" className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
        <ArrowLeft className="h-4 w-4" /> Back to Clients
      </Link>

      <div className="rounded-xl border bg-card p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Building2 className="h-5 w-5" />
              </span>
              <h1 className="font-display text-2xl font-bold">{client.company_name}</h1>
              <StatusBadge status={client.status} />
              {client.service ? <Badge variant="outline" className="text-xs">{client.service}</Badge> : null}
            </div>
            <p className="mt-1.5 text-sm text-muted-foreground">{client.contact_person ?? "No contact person"}</p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/staff/clients"><Pencil className="mr-1.5 h-3.5 w-3.5" /> Edit Client</Link>
          </Button>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <InfoTile icon={AtSign} label="Email" value={client.email ?? "—"} />
          <InfoTile icon={Phone} label="Phone" value={client.phone ?? "—"} />
          <InfoTile icon={Globe} label="Website" value={client.website ?? "—"} link={client.website} />
          <InfoTile icon={MapPin} label="Address" value={client.address ?? "—"} />
        </div>

        {client.notes ? (
          <div className="mt-5 flex items-start gap-3 rounded-xl bg-muted/50 p-4">
            <StickyNote className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Notes</p>
              <p className="mt-1 text-sm leading-relaxed">{client.notes}</p>
            </div>
          </div>
        ) : null}
      </div>

      <div className="rounded-xl border bg-card p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center gap-2 font-display text-base font-semibold">
            <FolderKanban className="h-4 w-4 text-primary" /> Projects ({projects.length})
          </h2>
          <span className="text-xs text-muted-foreground">
            {projects.filter((p) => p.status === "Active").length} active
          </span>
        </div>
        {projects.length === 0 ? (
          <EmptyState title="No projects yet" description="Associate this client with a project to get started." />
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {projects.map((p) => {
              const tasks = p.tasks ?? [];
              const done = tasks.filter((t) => t.status === "Completed").length;
              return (
                <Link key={p.id} href={`/staff/projects/${p.id}`} className="rounded-xl border p-4 transition-colors hover:border-primary/40">
                  <div className="flex items-center justify-between gap-3">
                    <p className="truncate font-semibold">{p.name}</p>
                    <StatusBadge status={p.status} />
                  </div>
                  <div className="mt-3 space-y-1.5">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Progress · {done}/{tasks.length} tasks done</span>
                      <span className="font-semibold text-foreground">{p.progress}%</span>
                    </div>
                    <Progress value={p.progress} className="h-2" />
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                    <span>Due {formatDate(p.due_date)}</span>
                    <span className="flex -space-x-1.5">
                      {(p.project_members ?? []).slice(0, 3).map((m) => (
                        <UserAvatar key={m.user_id} name={m.profiles?.full_name} photoPath={m.profiles?.profile_photo_url} className="h-6 w-6 border-2 border-background" />
                      ))}
                      {(p.project_members ?? []).length > 3 ? <span className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-background bg-muted text-[10px]">+{(p.project_members ?? []).length - 3}</span> : null}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function InfoTile({
  icon: Icon,
  label,
  value,
  link,
}: {
  icon: typeof AtSign;
  label: string;
  value: string;
  link?: string | null;
}) {
  const content = (
    <>
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0">
        <p className="truncate text-xs text-muted-foreground">{label}</p>
        <p className="truncate text-sm font-medium break-words">{value}</p>
      </div>
    </>
  );
  return link ? (
    <a href={link} target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 rounded-xl bg-muted/40 p-3.5 hover:bg-muted/60">
      {content}
    </a>
  ) : (
    <div className="flex items-start gap-3 rounded-xl bg-muted/40 p-3.5">{content}</div>
  );
}