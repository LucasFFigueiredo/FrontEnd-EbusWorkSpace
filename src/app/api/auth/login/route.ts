import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import type { GoogleAuthRequest, AuthResponse, ApiUser } from "@/core/models/auth.types";
import { mapApiProfileToAccessType } from "@/core/models/auth.types";
import type { UserProfile, AccessType } from "@/core/models/user.types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5281";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as GoogleAuthRequest;
    const { googleToken } = body;

    if (!googleToken?.trim()) {
      return NextResponse.json(
        { error: "Token de credencial do Google não fornecido." },
        { status: 400 },
      );
    }

    const backendRes = await fetch(`${API_BASE_URL}/api/auth/google`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ googleToken }),
    });

    if (!backendRes.ok) {
      const errData = await backendRes.json().catch(() => ({}));
      return NextResponse.json(
        { error: errData.message || "Falha na autenticação com o backend C#." },
        { status: backendRes.status },
      );
    }

    const authData = (await backendRes.json()) as AuthResponse;

    if (!authData?.token || !authData?.user) {
      return NextResponse.json(
        { error: "Resposta da API de autenticação em formato inválido." },
        { status: 500 },
      );
    }

    const cookieStore = await cookies();
    cookieStore.set("ebus_token", authData.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    const apiUser: ApiUser = authData.user;
    const mappedAccess: AccessType = mapApiProfileToAccessType(apiUser.profile);

    const userProfile: UserProfile = {
      name: apiUser.name || "Usuário Google",
      email: apiUser.email || "",
      department: apiUser.department || apiUser.sector || "",
      access: mappedAccess,
    };

    return NextResponse.json({ user: userProfile });
  } catch (error) {
    console.error("[Auth Route Handler] Erro no processamento de login:", error);
    return NextResponse.json(
      { error: "Erro interno no servidor de autenticação." },
      { status: 500 },
    );
  }
}
