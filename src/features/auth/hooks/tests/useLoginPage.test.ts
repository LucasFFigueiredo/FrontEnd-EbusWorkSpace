import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useLoginPage } from "../useLoginPage";
import type { UserProfile } from "@/core/models/user.types";

const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("@/core/services/auth.service", () => ({
  authService: {
    loginWithGoogle: vi.fn(),
  },
}));

describe("useLoginPage (Hook Test)", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("deve inicializar com loading false", () => {
    const { result } = renderHook(() => useLoginPage());

    expect(result.current.loading).toBe(false);
  });

  it("deve expor handleGoogleLogin, handleGoogleSuccess e handleGoogleError", () => {
    const { result } = renderHook(() => useLoginPage());

    expect(typeof result.current.handleGoogleLogin).toBe("function");
    expect(typeof result.current.handleGoogleSuccess).toBe("function");
    expect(typeof result.current.handleGoogleError).toBe("function");
  });

  it("deve realizar login via Google e redirecionar para selecionar departamento quando usuário não possui departamento", async () => {
    const { authService } = await import("@/core/services/auth.service");
    const mockGoogleUser: UserProfile = {
      name: "Novo Usuário Google",
      email: "novo.usuario@empresa.com",
      department: "",
      access: "colaborador",
      password: "",
      mustChangePassword: false,
    };

    vi.mocked(authService.loginWithGoogle).mockResolvedValueOnce(mockGoogleUser);

    const { result } = renderHook(() => useLoginPage());

    await act(async () => {
      await result.current.handleGoogleLogin();
    });

    expect(authService.loginWithGoogle).toHaveBeenCalledWith("google_identity_services_token_mock");
    expect(mockPush).toHaveBeenCalledWith("/select-department");
  });

  it("deve redirecionar para home quando usuário já possui departamento", async () => {
    const { authService } = await import("@/core/services/auth.service");
    const mockGoogleUser: UserProfile = {
      name: "Ana Admin",
      email: "admin@empresa.com",
      department: "Administração",
      access: "admin",
      password: "admin123",
      mustChangePassword: false,
    };

    vi.mocked(authService.loginWithGoogle).mockResolvedValueOnce(mockGoogleUser);

    const { result } = renderHook(() => useLoginPage());

    await act(async () => {
      await result.current.handleGoogleLogin();
    });

    expect(mockPush).toHaveBeenCalledWith("/");
  });

  it("deve chamar handleGoogleSuccess e redirecionar conforme o departamento do usuário", () => {
    const mockUser: UserProfile = {
      name: "Gisele Gestora",
      email: "gestor@empresa.com",
      department: "Recursos Humanos",
      access: "gestor",
      password: "",
      mustChangePassword: false,
    };

    const { result } = renderHook(() => useLoginPage());

    act(() => {
      result.current.handleGoogleSuccess(mockUser);
    });

    expect(mockPush).toHaveBeenCalledWith("/");
  });
});
