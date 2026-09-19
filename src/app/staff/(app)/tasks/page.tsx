import { requireRole } from "@/lib/auth";
import { isManagement } from "@/lib/auth";
import { getEmployees, getMyProjects, getMyTasks, getProjects, getTasks } from "@/lib/queries";
import { TasksClient } from "@/components/tasks/tasks-client";
import { DailyReportForm } from "@/components/tasks/daily-report-form";

export const metadata = { title: "Tasks & Daily Work" };

export default async function TasksPage({ searchParams }: { searchParams: Promise<{ project?: string }> }) {
  const { project } = await searchParams;
  const profile = await requireRole(["super_admin", "admin", "manager", "employee"]);
  const management = isManagement(profile.role);
  const isAdminRole = profile.role === "super_admin" || profile.role === "admin";

  const [tasks, projects, employees, myTasks, myProjects] = management
    ? await Promise.all([getTasks(), getProjects(), getEmployees(), Promise.resolve([]), Promise.resolve([])])
    : await Promise.all([
        Promise.resolve([]),
        Promise.resolve([]),
        Promise.resolve([]),
        getMyTasks(),
        getMyProjects(),
      ]);

  const taskRows = management ? tasks : myTasks;
  const projectRows = management ? projects.map((p) => ({ id: p.id, name: p.name })) : myProjects.map((p) => ({ id: p.id, name: p.name }));
  const reportProjects = management
    ? projects.map((p) => ({ id: p.id, name: p.name }))
    : myProjects.map((p) => ({ id: p.id, name: p.name }));
  const reportTasks = management ? tasks : myTasks;

  void project;
  return (
    <div className="space-y-6">
      {isAdminRole ? null : <DailyReportForm projects={reportProjects} tasks={reportTasks} />}
      <TasksClient
        tasks={taskRows}
        projects={projectRows}
        employees={employees}
        currentProfile={profile}
        canManage={management}
      />
    </div>
  );
}