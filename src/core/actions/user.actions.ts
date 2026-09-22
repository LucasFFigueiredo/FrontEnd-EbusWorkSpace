"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { serverFetch } from "@/core/services/serverApi";
import type { AccessType } from "@/core/models/user.types";

function safeRevalidatePath(path: string) {
  try {
    revalidatePath(path);
  } catch { }
}

export async function updateUserDepartmentAction(
  department: string,
): Promise<{ success: boolean }> {
  try {
    await serverFetch("/api/Users/sector", {
      method: "PATCH",
      body: JSON.stringify({ sector: department }),
    });

    const cookieStore = await cookies();
    cookieStore.set("ebus_sector_updated", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });

    safeRevalidatePath("/profile");
    safeRevalidatePath("/select-department");

    return { success: true };
  } catch (error) {
    console.error("[ServerAction updateUserDepartmentAction] Erro:", error);
    throw new Error(
      error instanceof Error ? error.message : "Não foi possível atualizar o departamento.",
    );
  }
}

export async function requestAccessAction(
  role: AccessType,
): Promise<{ success: boolean }> {
  try {
    let requestedProfileId = 1;
    if (role === "gestor") requestedProfileId = 2;
    else if (role === "facilities") requestedProfileId = 3;
    else if (role === "admin") requestedProfileId = 4;

    await serverFetch("/api/requests", {
      method: "POST",
      body: JSON.stringify({
        RequestedProfile: requestedProfileId,
      }),
    });

    safeRevalidatePath("/profile");
    safeRevalidatePath("/admin");

    return { success: true };
  } catch (error) {
    console.error("[ServerAction requestAccessAction] Erro:", error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "Não foi possível processar a solicitação de acesso.",
    );
  }
}

export async function getPendingAccessRequestsAction() {
  try {
    const data = await serverFetch<any[]>("/api/requests/pending");
    return (data || []).map((r) => ({
      requestId: r.RequestId,
      userId: r.UserId,
      userName: r.UserName,
      userEmail: r.UserEmail,
      currentProfile: r.CurrentProfile,
      requestedProfile: r.RequestedProfile,
      requestedAt: r.RequestedAt,
    }));
  } catch (error) {
    console.error("[ServerAction getPendingAccessRequestsAction] Erro:", error);
    return [];
  }
}

export async function approveAccessRequestAction(requestId: string): Promise<{ success: boolean }> {
  try {
    await serverFetch(`/api/requests/${requestId}/approve`, {
      method: "PATCH",
    });

    safeRevalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("[ServerAction approveAccessRequestAction] Erro:", error);
    throw new Error(
      error instanceof Error ? error.message : "Não foi possível aprovar a solicitação.",
    );
  }
}

export async function rejectAccessRequestAction(requestId: string): Promise<{ success: boolean }> {
  try {
    await serverFetch(`/api/requests/${requestId}/reject`, {
      method: "PATCH",
    });

    safeRevalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("[ServerAction rejectAccessRequestAction] Erro:", error);
    throw new Error(
      error instanceof Error ? error.message : "Não foi possível rejeitar a solicitação.",
    );
  }
}
