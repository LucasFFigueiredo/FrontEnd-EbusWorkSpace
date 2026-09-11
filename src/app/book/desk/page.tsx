import DeskBookingPage from "@/features/booking/pages/DeskBookingPage";
import { serverFetch } from "@/core/services/serverApi";
import type { SpaceDto } from "@/core/models/booking.types";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function Page({ searchParams }: Props) {
  const params = await searchParams;
  const floorParam = params.floor as string;

  const allSpaces = await serverFetch<SpaceDto[]>("/api/Spaces");

  const uniqueFloors = Array.from(new Set(allSpaces.map(s => s.floor)))
    .sort((a, b) => a - b)
    .map(floorNum => ({
      id: floorNum.toString(),
      name: `${floorNum}º Andar`
    }));

  const selectedFloorId = floorParam || (uniqueFloors.length > 0 ? uniqueFloors[0].id : "");

  const allDesks = allSpaces.filter(s => s.type === "Desk");

  return (
    <DeskBookingPage
      initialFloor={selectedFloorId}
      floors={uniqueFloors}
      desks={allDesks}
    />
  );
}