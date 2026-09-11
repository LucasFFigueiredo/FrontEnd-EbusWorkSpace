"use server";

import { revalidatePath } from "next/cache";
import { serverFetch } from "@/core/services/serverApi";

function safeRevalidatePath(path: string) {
  try {
    revalidatePath(path);
  } catch {}
}

export async function blockResourceAction(
  id: string,
  reason: string,
  fromISO?: string,
  toISO?: string,
): Promise<{ success: boolean }> {
  try {
    const maintenanceDate = toISO ? toISO.split("T")[0] : undefined;

    await serverFetch(`/api/Spaces/${id}/maintenance`, {
      method: "PATCH",
      body: JSON.stringify({
        isBlocked: true,
        maintenanceReason: reason,
        maintenanceUntil: maintenanceDate,
      }),
    });

    safeRevalidatePath("/spaces");
    safeRevalidatePath("/book/room");
    safeRevalidatePath("/book/desk");

    return { success: true };
  } catch (error) {
    console.error("[ServerAction blockResourceAction] Erro ao bloquear recurso:", error);
    throw new Error(
      error instanceof Error ? error.message : "Não foi possível bloquear o recurso no servidor.",
    );
  }
}

export async function unblockResourceAction(id: string): Promise<{ success: boolean }> {
  try {
    await serverFetch(`/api/Spaces/${id}/maintenance`, {
      method: "PATCH",
      body: JSON.stringify({ isBlocked: false }),
    });

    safeRevalidatePath("/spaces");
    safeRevalidatePath("/book/room");
    safeRevalidatePath("/book/desk");

    return { success: true };
  } catch (error) {
    console.error("[ServerAction unblockResourceAction] Erro ao desbloquear recurso:", error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "Não foi possível desbloquear o recurso no servidor.",
    );
  }
}
