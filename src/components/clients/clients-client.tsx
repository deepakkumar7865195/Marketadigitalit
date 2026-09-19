"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Building2, Globe, Mail, Pencil, Phone, Plus, Trash2 } from "lucide-react";
import type { Client } from "@/types";
import { actionCreateClient, actionDeleteClient, actionUpdateClient } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EmptyState } from "@/components/shared/empty-state";

interface Props {
  clients: Client[];
  isManagement: boolean;
}

const STATUSES = ["Lead", "Active", "Inactive", "Completed"] as const;

export function ClientsClient({ clients, isManagement }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Client | null>(null);
  const [saving, setSaving] = useState(false);

  const counts = {
    total: clients.length,
    active: clients.filter((c) => c.status === "Active").length,
    leads: clients.filter((c) => c.status === "Lead").length,
  };

  function openCreate() {
    setEditing(null);
    setOpen(true);
  }
  function openEdit(c: Client) {
    setEditing(c);
    setOpen(true);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const values = {
      companyName: String(form.get("companyName") ?? ""),
      contactPerson: String(form.get("contactPerson") ?? "") || null,
      email: String(form.get("email") ?? "") || null,
      phone: String(form.get("phone") ?? "") || null,
      website: String(form.get("website") ?? "") || null,
      address: String(form.get("address") ?? "") || null,
      service: String(form.get("service") ?? "") || null,
      status: String(form.get("status") ?? "Lead"),
      notes: String(form.get("notes") ?? "") || null,
    };
    setSaving(true);
    const result = editing ? await actionUpdateClient(editing.id, values) : await actionCreateClient(values);
    setSaving(false);
    if (result.success) {
      toast.success(editing ? "Client updated" : "Client added");
      setOpen(false);
      router.refresh();
    } else toast.error(result.error ?? "Save failed");
  }

  async function remove(c: Client) {
    if (!confirm(`Delete client "${c.company_name}"?`)) return;
    const result = await actionDeleteClient(c.id);
    if (result.success) {
      toast.success("Client deleted");
      router.refresh();
    } else toast.error(result.error ?? "Delete failed");
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-xl font-bold">Clients</h2>
          <p className="text-sm text-muted-foreground">
            {counts.total} clients · {counts.active} active · {counts.leads} leads
          </p>
        </div>
        {isManagement ? (
          <Button onClick={openCreate} variant="gradient">
            <Plus className="mr-2 h-4 w-4" /> Add Client
          </Button>
        ) : null}
      </div>

      {clients.length === 0 ? (
        <EmptyState icon={Building2} title="No clients yet" description="Add your first client to start associating projects." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {clients.map((c) => (
            <div key={c.id} className="group rounded-xl border bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
              <div className="flex items-start justify-between gap-3">
                {isManagement ? (
                  <button onClick={() => router.push(`/staff/clients/${c.id}`)} className="min-w-0 flex-1 text-left">
                    <h3 className="truncate font-display font-semibold group-hover:text-primary">{c.company_name}</h3>
                    <p className="text-xs text-muted-foreground">{c.contact_person ?? "No contact person"}</p>
                  </button>
                ) : (
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-display font-semibold">{c.company_name}</h3>
                    <p className="text-xs text-muted-foreground">{c.contact_person ?? "No contact person"}</p>
                  </div>
                )}
                <div className="flex items-center gap-1.5">
                  <Badge variant="outline" className="text-[10px]">{c.status}</Badge>
                  {isManagement ? (
                    <>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(c)}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => remove(c)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </>
                  ) : null}
                </div>
              </div>

              <div className="mt-3 space-y-1.5 text-sm text-muted-foreground">
                {c.email ? (
                  <p className="flex items-center gap-2"><Mail className="h-3.5 w-3.5" /><span className="truncate">{c.email}</span></p>
                ) : null}
                {c.phone ? (
                  <p className="flex items-center gap-2"><Phone className="h-3.5 w-3.5" />{c.phone}</p>
                ) : null}
                {c.website ? (
                  <p className="flex items-center gap-2"><Globe className="h-3.5 w-3.5" /><span className="truncate">{c.website.replace(/^https?:\/\//, "")}</span></p>
                ) : null}
              </div>

              {c.service ? (
                <p className="mt-3 inline-block rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">{c.service}</p>
              ) : null}
            </div>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] w-[95vw] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building2 className="h-4.5 w-4.5 text-primary" />
              {editing ? "Edit Client" : "Add Client"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="companyName">Company Name *</Label>
                <Input id="companyName" name="companyName" required defaultValue={editing?.company_name ?? ""} placeholder="e.g. Bakers Street" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="contactPerson">Contact Person</Label>
                <Input id="contactPerson" name="contactPerson" defaultValue={editing?.contact_person ?? ""} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="service">Service</Label>
                <Select id="service" name="service" defaultValue={editing?.service ?? ""}>
                  <option value="">Select service</option>
                  <option value="SEO">SEO</option>
                  <option value="Google Ads">Google Ads</option>
                  <option value="Meta Ads">Meta Ads</option>
                  <option value="Web Development">Web Development</option>
                  <option value="Social Media">Social Media</option>
                  <option value="Local SEO / GBP">Local SEO / GBP</option>
                  <option value="Full Funnel">Full Funnel</option>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" defaultValue={editing?.email ?? ""} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" name="phone" defaultValue={editing?.phone ?? ""} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="website">Website</Label>
                <Input id="website" name="website" defaultValue={editing?.website ?? ""} placeholder="https://" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="status">Status</Label>
                <Select id="status" name="status" defaultValue={editing?.status ?? "Lead"}>
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="address">Address</Label>
              <Input id="address" name="address" defaultValue={editing?.address ?? ""} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="notes">Notes</Label>
              <Textarea id="notes" name="notes" rows={3} defaultValue={editing?.notes ?? ""} placeholder="Internal notes about this client..." />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" variant="gradient" disabled={saving}>
                {saving ? "Saving..." : editing ? "Save Changes" : "Add Client"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}