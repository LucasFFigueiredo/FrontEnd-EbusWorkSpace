import { describe, it, expect, beforeEach, vi } from "vitest";
import { authService } from "../auth.service";

describe("AuthService (Google OAuth 2.0 & HttpOnly Cookie BFF)", () => {
  beforeEach(() => {
    localStorage.clear();
    authService.logout();
    vi.clearAllMocks();
  });

  it("deve realizar login via Google efetuando POST para /api/auth/login", async () => {
    const mockUser = {
      name: "Carlos Engenheiro",
      email: "carlos@empresa.com",
      department: "Engenharia",
      access: "colaborador",
      password: "",
      mustChangePassword: false,
    };

    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => ({ user: mockUser }),
    } as Response);

    const userProfile = await authService.loginWithGoogle("token_oficial_google_gsi");

    expect(fetchSpy).toHaveBeenCalledWith(expect.stringContaining("/api/auth/login"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ googleToken: "token_oficial_google_gsi" }),
    });

    expect(userProfile.name).toBe("Carlos Engenheiro");
    expect(userProfile.access).toBe("colaborador");
    expect(userProfile.department).toBe("Engenharia");
    expect(authService.isAuthenticated()).toBe(true);
  });

  it("deve mapear corretamente os perfis de acesso ao realizar login", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        user: {
          name: "Admin Test",
          email: "admin@empresa.com",
          department: "TI",
          access: "admin",
        },
      }),
    } as Response);

    const adminUser = await authService.loginWithGoogle("token_admin");
    expect(adminUser.access).toBe("admin");
    expect(authService.getAccessType()).toBe("admin");
  });

  it("deve expurgar o perfil e chamar a rota /api/auth/logout ao efetuar logout", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    } as Response);

    await authService.logout();

    expect(fetchSpy).toHaveBeenCalledWith(expect.stringContaining("/api/auth/logout"), {
      method: "POST",
    });
    expect(authService.getToken()).toBeNull();
    expect(authService.isAuthenticated()).toBe(false);
  });

  it("deve tratar erros amigáveis quando a chamada para a rota interna falhar", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Token do Google inválido ou expirado." }),
    } as Response);

    await expect(authService.loginWithGoogle("token_invalido")).rejects.toThrow(
      "Token do Google inválido ou expirado.",
    );
    expect(authService.isAuthenticated()).toBe(false);
  });
});
