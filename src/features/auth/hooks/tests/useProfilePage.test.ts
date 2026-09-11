import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useProfilePage, fmtDateTime } from "../useProfilePage";
import { saveUser } from "@/core/services/user.service";
import type { UserProfile } from "@/core/models/user.types";
import type { MappedProfileBooking } from "@/app/profile/page";

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("@/core/actions/user.actions", () => ({
  updateUserDepartmentAction: vi.fn().mockResolvedValue({ success: true }),
  requestAccessAction: vi.fn().mockResolvedValue({ success: true }),
}));

function createMockUser(overrides: Record<string, any> = {}): any {
  return {
    name: "Bruno Colaborador",
    email: "bruno@empresa.com",
    department: "Engenharia",
    access: "colaborador",

    role: "colaborador",
    password: "colab123",
    mustChangePassword: false,
    ...overrides,
  };
}

const emptyBookings: MappedProfileBooking[] = [];

describe("useProfilePage (Hook Test)", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("deve formatar data ISO corretamente", () => {
    const iso = "2026-08-10T10:00:00.000Z";
    const formatted = fmtDateTime(iso);
    expect(formatted).toBeTruthy();
  });

  it("deve carregar dados do perfil passados como parâmetro", () => {
    const mockUser = createMockUser();

    const { result } = renderHook(() => useProfilePage(mockUser, emptyBookings));

    expect(result.current.name).toBe("Bruno Colaborador");
    expect(result.current.userInitials).toBe("BC");
    expect(result.current.roleLabel).toBe("Colaborador");
  });

  it("deve atualizar o estado 'name' via setName", () => {
    const mockUser = createMockUser();
    const { result } = renderHook(() => useProfilePage(mockUser, emptyBookings));

    act(() => {
      result.current.setName("Bruno Alterado");
    });

    expect(result.current.name).toBe("Bruno Alterado");
  });

  it("deve iniciar solicitação de acesso e fechar o modal ao concluir", async () => {
    const mockUser = createMockUser();
    const { result } = renderHook(() => useProfilePage(mockUser, emptyBookings));

    act(() => {
      result.current.setRequestOpen(true);
      result.current.setRequestedRole("gestor");
    });

    await act(async () => {
      await result.current.handleRequestAccess();
    });

    expect(result.current.requestOpen).toBe(false);
  });
});
