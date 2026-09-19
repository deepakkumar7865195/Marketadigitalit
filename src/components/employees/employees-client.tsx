"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  MoreHorizontal,
  Plus,
  Search,
  ShieldCheck,
  ShieldOff,
  Trash2,
  UserPlus,
  Pencil,
} from "lucide-react";
import type { Profile } from "@/types";
import { ROLE_LABELS } from "@/lib/constants";
import { formatDate } from "@/lib/format";
import {
  actionActivateEmployee,
  actionDeactivateEmployee,
  actionDeleteEmployee,
  actionUpsertEmployee,
} from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserAvatar } from "@/components/shared/user-avatar";
import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";

interface EmployeesClientProps {
  employees: Profile[];
  departments: string[];
  currentRole: Profile["role"];
}

const ROLE_OPTIONS = ["super_admin", "admin", "manager", "employee"] as const;
const STATUS_OPTIONS = ["pending", "active", "inactive"] as const;

export function EmployeesClient({ employees, departments, currentRole }: EmployeesClientProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("all");
  const [status, setStatus] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Profile | null>(null);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return employees.filter((e) => {
      if (q && !`${e.full_name} ${e.email} ${e.employee_code ?? ""}`.toLowerCase().includes(q)) return false;
      if (department !== "all" && e.department !== department) return false;
      if (status !== "all" && e.status !== status) return false;
      return true;
    });
  }, [employees, search, department, status]);

  const canDelete = currentRole === "super_admin";

  async function onSave(values: Record<string, string>) {
    setSaving(true);
    const result = await actionUpsertEmployee(values, editing?.id);
    setSaving(false);
    if (result.success) {
      toast.success(editing ? "Employee updated" : "Employee created");
      setDialogOpen(false);
      router.refresh();
    } else {
      toast.error(result.error ?? "Save failed");
    }
  }

  async function onToggleStatus(e: Profile) {
    const action = e.status === "active" ? actionDeactivateEmployee : actionActivateEmployee;
    setBusyId(e.id);
    const result = await action(e.id);
    setBusyId(null);
    if (result.success) {
      toast.success(e.status === "active" ? "Employee deactivated" : "Employee activated");
      router.refresh();
    } else {
      toast.error(result.error ?? "Update failed");
    }
  }

  async function onDelete(e: Profile) {
    if (!confirm(`Delete ${e.full_name}? This also removes their login account.`)) return;
    setBusyId(e.id);
    const result = await actionDeleteEmployee(e.id);
    setBusyId(null);
    if (result.success) {
      toast.success("Employee deleted");
      router.refresh();
    } else {
      toast.error(result.error ?? "Delete failed");
    }
  }

  function openCreate() {
    setEditing(null);
    setDialogOpen(true);
  }

  function openEdit(e: Profile) {
    setEditing(e);
    setDialogOpen(true);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-xl font-bold">Employees</h2>
          <p className="text-sm text-muted-foreground">{employees.length} total · {employees.filter((e) => e.status === "active").length} active</p>
        </div>
        <Button onClick={openCreate} variant="gradient">
          <Plus className="mr-2 h-4 w-4" /> Add Employee
        </Button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, email or employee code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={department} onChange={(e) => setDepartment(e.target.value)} className="sm:w-48">
          <option value="all">All Departments</option>
          {departments.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </Select>
        <Select value={status} onChange={(e) => setStatus(e.target.value)} className="sm:w-40">
          <option value="all">All Statuses</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s} className="capitalize">{s}</option>
          ))}
        </Select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={Search} title="No employees found" description="Try a different search or add a new employee." />
      ) : (
        <div className="overflow-x-auto rounded-xl border bg-card shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-4 py-3 font-semibold">Employee</th>
                <th className="px-4 py-3 font-semibold">Department</th>
                <th className="hidden px-4 py-3 font-semibold md:table-cell">Joined</th>
                <th className="px-4 py-3 font-semibold">Role</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((e) => (
                <tr key={e.id} className="border-b last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <button onClick={() => router.push(`/staff/employees/${e.id}`)} className="flex items-center gap-3 text-left">
                      <UserAvatar name={e.full_name} photoPath={e.profile_photo_url} className="h-9 w-9" />
                      <span className="min-w-0">
                        <span className="block truncate font-semibold hover:text-primary">{e.full_name}</span>
                        <span className="block truncate text-xs text-muted-foreground">
                          {e.designation ?? "—"} {e.employee_code ? ` · ${e.employee_code}` : ""}
                        </span>
                      </span>
                    </button>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{e.department ?? "—"}</td>
                  <td className="hidden px-4 py-3 text-muted-foreground md:table-cell">{formatDate(e.joining_date)}</td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className="text-xs">{ROLE_LABELS[e.role] ?? e.role}</Badge>
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={e.status} /></td>
                  <td className="px-4 py-3 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" disabled={busyId === e.id}>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => router.push(`/staff/employees/${e.id}`)}>
                          View profile
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openEdit(e)}>
                          <Pencil className="mr-2 h-4 w-4" /> Edit details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onToggleStatus(e)}>
                          {e.status === "active" ? <ShieldOff className="mr-2 h-4 w-4" /> : <ShieldCheck className="mr-2 h-4 w-4" />}
                          {e.status === "active" ? "Deactivate" : "Activate"}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {canDelete ? (
                          <DropdownMenuItem onClick={() => onDelete(e)} className="text-destructive focus:text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        ) : null}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <EmployeeDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        employee={editing}
        departments={departments}
        currentRole={currentRole}
        onSave={onSave}
        saving={saving}
      />
    </div>
  );
}

function EmployeeDialog({
  open,
  onOpenChange,
  employee,
  departments,
  currentRole,
  onSave,
  saving,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  employee: Profile | null;
  departments: string[];
  currentRole: Profile["role"];
  onSave: (values: Record<string, string>) => void;
  saving: boolean;
}) {
  const isAdmin = currentRole === "super_admin" || currentRole === "admin";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const values = Object.fromEntries(form as unknown as Iterable<[string, FormDataEntryValue]>) as Record<string, string>;
    if (!values.password) delete values.password;
    onSave(values);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] w-[95vw] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-4.5 w-4.5 text-primary" />
            {employee ? "Edit Employee" : "Add New Employee"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="fullName">Full Name *</Label>
              <Input id="fullName" name="fullName" required defaultValue={employee?.full_name ?? ""} placeholder="Employee full name" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email *</Label>
              <Input id="email" name="email" type="email" required defaultValue={employee?.email ?? ""} placeholder="name@company.com" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" name="phone" defaultValue={employee?.phone ?? ""} placeholder="+91 98765 43210" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="designation">Designation</Label>
              <Input id="designation" name="designation" defaultValue={employee?.designation ?? ""} placeholder="SEO Specialist" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="department">Department</Label>
              <Select id="department" name="department" defaultValue={employee?.department ?? ""}>
                <option value="">Select department</option>
                {departments.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
                <option value="Development">Development</option>
                <option value="SEO">SEO</option>
                <option value="PPC / Google Ads">PPC / Google Ads</option>
                <option value="Social Media">Social Media</option>
                <option value="Design">Design</option>
                <option value="Content">Content</option>
                <option value="Sales">Sales</option>
                <option value="Admin / HR">Admin / HR</option>
                <option value="Management">Management</option>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="joiningDate">Joining Date</Label>
              <Input id="joiningDate" name="joiningDate" type="date" defaultValue={employee?.joining_date?.slice(0, 10) ?? ""} />
            </div>
            {isAdmin && (
              <>
                <div className="space-y-1.5">
                  <Label htmlFor="role">Role</Label>
                  <Select id="role" name="role" defaultValue={employee?.role ?? "employee"}>
                    {ROLE_OPTIONS.map((r) => (
                      <option key={r} value={r}>{ROLE_LABELS[r]}</option>
                    ))}
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="status">Status</Label>
                  <Select id="status" name="status" defaultValue={employee?.status ?? "pending"}>
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s} className="capitalize">{s}</option>
                    ))}
                  </Select>
                </div>
              </>
            )}
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="address">Address</Label>
              <Textarea id="address" name="address" rows={2} defaultValue={employee?.address ?? ""} placeholder="Home address" />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="emergencyContact">Emergency Contact</Label>
              <Input id="emergencyContact" name="emergencyContact" defaultValue={employee?.emergency_contact ?? ""} placeholder="Name & phone of emergency contact" />
            </div>
            {!employee ? (
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="password">Temporary Password *</Label>
                <Input id="password" name="password" type="password" required placeholder="Min 8 characters" />
              </div>
            ) : null}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" variant="gradient" disabled={saving}>
              {saving ? "Saving..." : employee ? "Save Changes" : "Create Employee"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}