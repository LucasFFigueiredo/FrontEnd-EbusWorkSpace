import { AdminPage } from "@/features/spaces/pages/AdminPage";
import { serverFetch } from "@/core/services/serverApi";

export const dynamic = "force-dynamic";

interface AccessRequestDto {
  userId: string;
  userName: string;
  userEmail: string;
  currentProfile: string;
  requestedProfile: string;
  requestedAt: string;
}

export default async function Page() {
  let requests: AccessRequestDto[] = [];

  try {
    requests = await serverFetch<AccessRequestDto[]>("/api/Users/requests");
  } catch (error) {
    console.error("Erro ao carregar solicitações de acesso:", error);
  }

  return <AdminPage requests={requests} />;
}
