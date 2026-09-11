import RoomBookingPage from "@/features/booking/pages/RoomBookingPage";
import { serverFetch } from "@/core/services/serverApi";
import type { SpaceDto } from "@/core/models/booking.types";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function Page({ searchParams }: Props) {
  const params = await searchParams;

  const today = new Date().toISOString().slice(0, 10);
  const date = (params.date as string) || today;
  const start = (params.start as string) || "09:00";
  const end = (params.end as string) || "10:00";
  const floorFilter = (params.floor as string) || "all";

  const allSpaces = await serverFetch<SpaceDto[]>("/api/Spaces");

  const uniqueFloors = Array.from(new Set(allSpaces.map((s) => s.floor)))
    .sort((a, b) => a - b)
    .map((floorNum) => ({
      id: floorNum.toString(),
      name: `${floorNum}º Andar`,
    }));

  const startTimeIso = `${date}T${start}:00.000Z`;
  const endTimeIso = `${date}T${end}:00.000Z`;

  const availableRooms = await serverFetch<SpaceDto[]>(
    `/api/Spaces/available?startTime=${startTimeIso}&endTime=${endTimeIso}&type=2`,
  );

  return (
    <RoomBookingPage
      initialParams={{ date, start, end, floor: floorFilter }}
      floors={uniqueFloors}
      allSpaces={allSpaces}
      availableRooms={availableRooms}
    />
  );
}
