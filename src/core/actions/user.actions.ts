"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { serverFetch } from "@/core/services/serverApi";
import type { AccessType } from "@/core/models/user.types";

function safeRevalidatePath(path: string) {
  try {
    revalidatePath(path);
  } catch {}
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
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
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
  email?: string,
  name?: string,
): Promise<{ success: boolean }> {
  try {
    let requestedProfileId = 1;
    if (role === "gestor") requestedProfileId = 2;
    else if (role === "facilities") requestedProfileId = 3;
    else if (role === "admin") requestedProfileId = 4;

    await serverFetch("/api/Users/request-access", {
      method: "POST",
      body: JSON.stringify({
        requestedProfile: requestedProfileId,
        justification: `Solicitação feita pelo frontend. E-mail de contato: ${email}`,
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

export async function updateUserRoleAction(
  targetUserId: string,
  requestedProfileName: string,
): Promise<{ success: boolean }> {
  try {
    let newProfileId = 1;
    const normalized = requestedProfileName.toLowerCase();

    if (normalized.includes("gestor") || normalized.includes("manager")) newProfileId = 2;
    else if (normalized.includes("facilities")) newProfileId = 3;
    else if (normalized.includes("admin")) newProfileId = 4;

    await serverFetch(`/api/Users/${targetUserId}/role`, {
      method: "PUT",
      body: JSON.stringify({ newProfile: newProfileId }),
    });

    safeRevalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("[ServerAction updateUserRoleAction] Erro:", error);
    throw new Error(
      error instanceof Error ? error.message : "Não foi possível atualizar o perfil do usuário.",
    );
  }
}

export async function approveAccessRequestAction(userId: string, approve: boolean) {
  try {
    await serverFetch(`/api/Users/${userId}/approve`, { method: "PATCH" });

    revalidatePath("/admin");

    return { success: true };
  } catch (error) {
    console.error("[ServerAction approveAccessRequestAction] Erro:", error);
    throw new Error(
      error instanceof Error ? error.message : "Não foi possível processar a solicitação.",
    );
  }
}
