"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ShieldCheck, ShieldOff, Trash2 } from "lucide-react";
import { actionActivateEmployee, actionDeactivateEmployee, actionDeleteEmployee } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import type { Profile } from "@/types";

interface Props {
  employee: Profile;
  canDelete: boolean;
}

export function EmployeeRowActions({ employee, canDelete }: Props) {
  const router = useRouter();

  async function toggleStatus() {
    const active = employee.status === "active";
    const result = active ? await actionDeactivateEmployee(employee.id) : await actionActivateEmployee(employee.id);
    if (result.success) {
      toast.success(active ? "Employee deactivated" : "Employee activated");
      router.refresh();
    } else toast.error(result.error ?? "Update failed");
  }

  async function remove() {
    if (!confirm(`Delete ${employee.full_name}? This also removes their login account.`)) return;
    const result = await actionDeleteEmployee(employee.id);
    if (result.success) {
      toast.success("Employee deleted");
      router.push("/staff/employees");
    } else toast.error(result.error ?? "Delete failed");
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" size="sm" onClick={toggleStatus}>
        {employee.status === "active" ? <ShieldOff className="mr-1.5 h-4 w-4" /> : <ShieldCheck className="mr-1.5 h-4 w-4" />}
        {employee.status === "active" ? "Deactivate" : "Activate"}
      </Button>
      {canDelete ? (
        <Button variant="destructive" size="sm" onClick={remove}>
          <Trash2 className="mr-1.5 h-4 w-4" /> Delete
        </Button>
      ) : null}
    </div>
  );
}