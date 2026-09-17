import { SpacesPage } from "@/features/spaces/pages/SpacesPage";
import { serverFetch } from "@/core/services/serverApi";

export const dynamic = "force-dynamic";

export default async function Page() {
  const [allSpaces, upcomingBookings, pendingApprovals, extensionRequests] = await Promise.all([
    serverFetch<any[]>("/api/Spaces"),
    serverFetch<any[]>("/api/Reservations/upcoming?onlyRooms=true"),
    serverFetch<any[]>("/api/Reservations?status=AwaitingApproval"),
    serverFetch<any[]>("/api/Reservations/extension/requests")
  ]);

  const roomsOnly = allSpaces.filter(space => space.type === "Room");

  return (
    <SpacesPage
      rooms={roomsOnly}
      upcomingBookings={upcomingBookings}
      pendingApprovals={pendingApprovals}
      extensionRequests={extensionRequests}
    />
  );
}