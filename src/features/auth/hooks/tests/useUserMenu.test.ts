import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useUserMenu } from "../useUserMenu";
import { saveUser } from "@/core/services/user.service";
import type { UserProfile } from "@/core/models/user.types";

vi.mock("@/core/services/auth.service", () => ({
  authService: {
    logout: vi.fn(),
  },
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

function createMockUser(overrides: Partial<UserProfile> = {}): UserProfile {
  return {
    name: "Ana Admin",
    email: "admin@empresa.com",
    department: "Administração",
    access: "admin",
    password: "admin123",
    mustChangePassword: false,
    ...overrides,
  };
}

describe("useUserMenu (Hook Test)", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("deve reconhecer quando não há usuário logado", () => {
    const { result } = renderHook(() => useUserMenu());

    expect(result.current.hasUser).toBe(false);
    expect(result.current.userInitials).toBe("");
  });

  it("deve carregar iniciais e perfil do usuário logado", () => {
    saveUser(createMockUser({ name: "Fabio Facilities" }));

    const { result } = renderHook(() => useUserMenu());

    expect(result.current.hasUser).toBe(true);
    expect(result.current.userInitials).toBe("FF");
    expect(result.current.roleLabel).toBe("Administrador");
  });

  it("deve chamar authService.logout ao invocar handleLogout", async () => {
    const { authService } = await import("@/core/services/auth.service");
    saveUser(createMockUser());

    const { result } = renderHook(() => useUserMenu());

    act(() => {
      result.current.handleLogout();
    });

    expect(authService.logout).toHaveBeenCalledTimes(1);
  });
});
