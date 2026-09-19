import { getCurrentUser } from "@/lib/auth";
import { isManagement } from "@/lib/auth";
import { getClients } from "@/lib/queries";
import { ClientsClient } from "@/components/clients/clients-client";

export const metadata = { title: "Clients" };

export default async function ClientsPage() {
  const { profile } = await getCurrentUser();
  const clients = await getClients();

  return <ClientsClient clients={clients} isManagement={isManagement(profile?.role)} />;
}