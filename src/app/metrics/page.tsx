import { MetricsPage } from "@/features/metrics/pages/MetricsPage";
import { serverFetch } from "@/core/services/serverApi";

export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export default async function Page({ searchParams }: Props) {
  const params = await searchParams;

  const tab = params.tab || "gerais";

  const today = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(today.getDate() - 30);

  const startDate = params.start || thirtyDaysAgo.toISOString().slice(0, 10);
  const endDate = params.end || today.toISOString().slice(0, 10);

  const startIso = `${startDate}T00:00:00.000Z`;
  const endIso = `${endDate}T23:59:59.999Z`;

  const [generalMetrics, users] = await Promise.all([
    serverFetch<any>(`/api/Dashboard/general?startDate=${startIso}&endDate=${endIso}`),
    serverFetch<any[]>("/api/Users"),
  ]);

  let userMetrics = null;
  if (tab === "individual" && params.userId) {
    try {
      userMetrics = await serverFetch<any>(
        `/api/Dashboard/user/${params.userId}?startDate=${startIso}&endDate=${endIso}`,
      );
    } catch { }
  }

  return (
    <MetricsPage
      generalMetrics={generalMetrics}
      userMetrics={userMetrics}
      usersList={users}
      initialParams={{
        tab,
        startDate,
        endDate,
        userId: params.userId || "",
        dept: params.dept || "all",
      }}
    />
  );
}
