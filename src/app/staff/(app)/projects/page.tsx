import { requireRole } from "@/lib/auth";
import { getClients, getEmployees, getMyProjects, getProjects } from "@/lib/queries";
import { isAdmin, isManagement } from "@/lib/auth";
import { ProjectsClient } from "@/components/projects/projects-client";

export const metadata = { title: "Projects" };

export default async function ProjectsPage() {
  const profile = await requireRole(["super_admin", "admin", "manager"]);
  const management = isManagement(profile.role);
  const [projects, clients, employees] = management
    ? await Promise.all([getProjects(), getClients(), getEmployees()])
    : await Promise.all([getMyProjects(), Promise.resolve([]), Promise.resolve([])]);

  return (
    <ProjectsClient
      projects={projects}
      clients={clients}
      employees={employees}
      isManagement={management}
      isAdmin={isAdmin(profile.role)}
      canEdit={management}
    />
  );
}