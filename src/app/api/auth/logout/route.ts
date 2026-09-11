import { NextResponse } from "next/server";

export async function POST() {
  try {
    const response = NextResponse.json({ success: true });

    response.cookies.set("ebus_token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 0,
    });

    return response;
  } catch (error) {
    console.error("[Auth Logout Handler] Erro ao deletar cookie de sessão:", error);
    return NextResponse.json({ error: "Erro ao encerrar a sessão no servidor." }, { status: 500 });
  }
}
