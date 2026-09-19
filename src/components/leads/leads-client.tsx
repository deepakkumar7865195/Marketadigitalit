"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Building2, Inbox, Search, Trash2 } from "lucide-react";
import type { LeadStatus, WebsiteLead } from "@/types";
import { actionDeleteLead, actionUpdateLeadStatus } from "@/lib/actions";
import { downloadCSV, formatDateTime, timeAgo } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";

interface Props {
  leads: WebsiteLead[];
  isAdmin: boolean;
}

const STATUSES: LeadStatus[] = ["new", "contacted", "qualified", "converted", "closed"];

export function LeadsClient({ leads, isAdmin }: Props) {
  const router = useRouter();
  const [filter, setFilter] = useState<"all" | LeadStatus>("all");
  const [search, setSearch] = useState("");
  const [busy, setBusy] = useState<string | null>(null);

  const filtered = leads.filter((l) => {
    const matchesStatus = filter === "all" || l.status === filter;
    const q = search.trim().toLowerCase();
    const matchesSearch =
      q === "" ||
      `${l.name} ${l.email} ${l.company ?? ""} ${l.service ?? ""}`.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  const counts = {
    total: leads.length,
    new: leads.filter((l) => l.status === "new").length,
  };

  async function changeStatus(l: WebsiteLead, status: LeadStatus) {
    if (status === l.status) return;
    setBusy(l.id);
    const result = await actionUpdateLeadStatus(l.id, status);
    setBusy(null);
    if (result.success) toast.success(`Lead marked ${status}`);
    else toast.error(result.error ?? "Update failed");
    router.refresh();
  }

  async function remove(l: WebsiteLead) {
    if (!confirm(`Delete lead from ${l.name} (${l.email})?`)) return;
    setBusy(l.id);
    const result = await actionDeleteLead(l.id);
    setBusy(null);
    if (result.success) toast.success("Lead deleted");
    else toast.error(result.error ?? "Delete failed");
    router.refresh();
  }

  function exportCSV() {
    const rows = filtered.map((l) => ({
      Name: l.name,
      Email: l.email,
      Phone: l.phone ?? "",
      Company: l.company ?? "",
      Service: l.service ?? "",
      Budget: l.budget ?? "",
      Status: l.status,
      Message: l.message ?? "",
      Received: formatDateTime(l.created_at),
    }));
    downloadCSV("leads.csv", rows);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-xl font-bold">Website Leads</h2>
          <p className="text-sm text-muted-foreground">
            {counts.total} enquiries · {counts.new} new
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={exportCSV} disabled={filtered.length === 0}>
          Export CSV
        </Button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email, company or service..."
            className="pl-9"
          />
        </div>
        <Select
          value={filter}
          onChange={(e) => setFilter(e.target.value as "all" | LeadStatus)}
          className="sm:w-44"
        >
          <option value="all">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </Select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title="No leads found"
          description="Website enquiries submitted through the contact form will appear here."
        />
      ) : (
        <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-40">Lead</TableHead>
                <TableHead className="min-w-36">Contact</TableHead>
                <TableHead className="min-w-28">Service</TableHead>
                <TableHead className="hidden min-w-40 lg:table-cell">Message</TableHead>
                <TableHead className="hidden md:table-cell">Received</TableHead>
                <TableHead>Status</TableHead>
                {isAdmin ? <TableHead className="w-12" /> : null}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((l) => (
                <TableRow key={l.id}>
                  <TableCell>
                    <p className="font-semibold">{l.name}</p>
                    <p className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Building2 className="h-3 w-3" />
                      {l.company ?? "—"}
                    </p>
                  </TableCell>
                  <TableCell>
                    <a href={`mailto:${l.email}`} className="block text-sm font-medium text-primary hover:underline">
                      {l.email}
                    </a>
                    {l.phone ? <p className="text-xs text-muted-foreground">{l.phone}</p> : null}
                    <p className="text-[10px] text-muted-foreground/70" title={formatDateTime(l.created_at)}>
                      {timeAgo(l.created_at)}
                    </p>
                  </TableCell>
                  <TableCell>
                    {l.service ? <p className="text-sm font-medium">{l.service}</p> : <span className="text-xs text-muted-foreground">General</span>}
                    {l.budget ? <p className="text-xs text-muted-foreground">Budget: {l.budget}</p> : null}
                  </TableCell>
                  <TableCell className="hidden max-w-56 lg:table-cell">
                    <p className="line-clamp-2 text-sm text-muted-foreground">{l.message ?? "—"}</p>
                  </TableCell>
                  <TableCell className="hidden whitespace-nowrap text-xs text-muted-foreground md:table-cell">
                    {formatDateTime(l.created_at)}
                  </TableCell>
                  <TableCell>
                    {busy === l.id ? (
                      <span className="text-xs text-muted-foreground">Saving…</span>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Select
                          value={l.status}
                          onChange={(e) => changeStatus(l, e.target.value as LeadStatus)}
                          className="h-8 w-32 text-xs"
                          title={`Status: ${l.status}`}
                        >
                          {STATUSES.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </Select>
                        <StatusBadge status={l.status} className="hidden lg:inline-flex" />
                      </div>
                    )}
                  </TableCell>
                  {isAdmin ? (
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() => remove(l)}
                        disabled={busy === l.id}
                        title="Delete lead"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  ) : null}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}