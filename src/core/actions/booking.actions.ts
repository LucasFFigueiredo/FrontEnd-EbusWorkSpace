"use server";

import { revalidatePath } from "next/cache";
import { serverFetch } from "@/core/services/serverApi";

function safeRevalidatePath(path: string) {
  try {
    revalidatePath(path);
  } catch { }
}

interface CreateReservationPayload {
  spaceId: string;
  startTime: string;
  endTime: string;
}

export async function createReservationAction(
  data: CreateReservationPayload,
): Promise<{ success: boolean; id?: string }> {
  try {
    const response = await serverFetch<{ id: string }>("/api/Reservations", {
      method: "POST",
      body: JSON.stringify(data),
    });

    safeRevalidatePath("/bookings");
    safeRevalidatePath("/book/room");
    safeRevalidatePath("/spaces");
    safeRevalidatePath("/");

    return { success: true, id: response.id };
  } catch (error) {
    console.error("[ServerAction createReservationAction] Erro:", error);
    throw new Error(error instanceof Error ? error.message : "Não foi possível criar a reserva.");
  }
}

interface BatchReservationItem {
  spaceId: string;
  startTime: string;
  endTime: string;
}

export async function createBatchReservationAction(
  reservations: BatchReservationItem[],
): Promise<{ success: boolean; isPartial: boolean; successfulCount: number; errors: string[] }> {
  try {
    const response = await serverFetch<any>("/api/Reservations/batch", {
      method: "POST",
      body: JSON.stringify({ reservations }),
    });

    safeRevalidatePath("/bookings");
    safeRevalidatePath("/book/desk");
    safeRevalidatePath("/");

    const resultData = response.data || response;

    return {
      success: true,
      isPartial: resultData.isPartial || false,
      successfulCount: resultData.successfulCount || 0,
      errors: resultData.errors || [],
    };
  } catch (error) {
    console.error("[ServerAction createBatchReservationAction] Erro:", error);
    throw new Error(
      error instanceof Error ? error.message : "Falha ao processar lote de reservas.",
    );
  }
}

export async function cancelBookingAction(reservationId: string): Promise<{ success: boolean }> {
  try {
    await serverFetch(`/api/Reservations/${reservationId}/cancel`, {
      method: "PATCH",
      body: JSON.stringify({ reservationId }),
    });

    safeRevalidatePath("/bookings");
    safeRevalidatePath("/spaces");
    safeRevalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("[ServerAction cancelBookingAction] Erro:", error);
    throw new Error(
      error instanceof Error ? error.message : "Não foi possível cancelar a reserva.",
    );
  }
}

interface CheckInPayload {
  spaceId: string;
  userLatitude: number;
  userLongitude: number;
}

interface CheckInPayload {
  spaceId: string;
  userLatitude: number;
  userLongitude: number;
}

export async function checkInAction(data: CheckInPayload): Promise<{ success: boolean }> {
  try {
    await serverFetch("/api/Reservations/scan-checkin", {
      method: "POST",
      body: JSON.stringify(data),
    });

    safeRevalidatePath("/bookings");
    safeRevalidatePath("/scan");
    safeRevalidatePath("/checkin");
    safeRevalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("[ServerAction checkInAction] Erro:", error);
    throw new Error(error instanceof Error ? error.message : "Falha ao realizar check-in.");
  }
}

interface RequestExtensionPayload {
  reservationId: string;
  additionalMinutes: number;
  justification: string;
}

export async function requestExtensionAction(
  payload: RequestExtensionPayload,
): Promise<{ success: boolean }> {
  try {
    await serverFetch("/api/Reservations/extension/request", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    safeRevalidatePath("/bookings");

    return { success: true };
  } catch (error) {
    console.error("[ServerAction requestExtensionAction] Erro:", error);
    throw new Error(
      error instanceof Error ? error.message : "Erro ao solicitar extensão de tempo.",
    );
  }
}

export async function getFloorOccupancyAction(floor: number, startTime: string, endTime: string) {
  try {
    const occupancy = await serverFetch<any[]>(
      `/api/Spaces/floor/${floor}/occupancy?startTime=${startTime}&endTime=${endTime}`,
    );
    return occupancy;
  } catch (error) {
    console.error("[ServerAction getFloorOccupancyAction] Erro:", error);
    return [];
  }
}

export async function approveReservationAction(
  reservationId: string,
  isApproved: boolean,
  justification?: string,
): Promise<{ success: boolean }> {
  try {
    await serverFetch(`/api/Reservations/${reservationId}/approval`, {
      method: "PATCH",
      body: JSON.stringify({ isApproved, justification: justification || "" }),
    });

    safeRevalidatePath("/spaces");
    safeRevalidatePath("/bookings");
    safeRevalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("[ServerAction approveReservationAction] Erro:", error);
    throw new Error(error instanceof Error ? error.message : "Erro ao aprovar/rejeitar reserva.");
  }
}

export async function getDailyRoomReservationsAction(dateStr: string) {
  try {
    const reservations = await serverFetch<any[]>("/api/Reservations");

    return reservations.filter(
      (r) =>
        r.startTime &&
        r.startTime.startsWith(dateStr) &&
        r.status !== "Canceled" &&
        r.status !== "NoShow",
    );
  } catch (error) {
    console.error("[ServerAction getDailyRoomReservationsAction] Erro:", error);
    return [];
  }
}

export async function getWeekOccupancyAction(floorId: number, weekStartISO: string) {
  const newOcc: Record<number, any[]> = {};
  const weekStart = new Date(weekStartISO);

  await Promise.all(
    [1, 2, 3, 4, 5].map(async (idx) => {
      const targetDate = new Date(weekStart);
      targetDate.setDate(targetDate.getDate() + (idx - 1));


      const startDate = new Date(targetDate);
      startDate.setUTCHours(11, 0, 0, 0);

      const endDate = new Date(targetDate);
      endDate.setUTCHours(21, 0, 0, 0);

      try {
        const data = await getFloorOccupancyAction(floorId, startDate.toISOString(), endDate.toISOString());
        newOcc[idx] = data;
      } catch (e) {
        newOcc[idx] = [];
      }
    })
  );

  return newOcc;
}