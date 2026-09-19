import { getDepartments, getEmployees } from "@/lib/queries";
import { requireRole } from "@/lib/auth";
import { EmployeesClient } from "@/components/employees/employees-client";

export const metadata = { title: "Employees" };

export default async function EmployeesPage() {
  const profile = await requireRole(["super_admin", "admin", "manager"]);
  const [employees, departments] = await Promise.all([getEmployees(), getDepartments()]);

  return (
    <EmployeesClient
      employees={employees}
      departments={departments}
      currentRole={profile.role}
    />
  );
}