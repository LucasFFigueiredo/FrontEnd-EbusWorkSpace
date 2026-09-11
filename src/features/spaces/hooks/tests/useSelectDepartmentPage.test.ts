import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useSelectDepartmentPage, DEPARTMENTS } from "../useSelectDepartmentPage";
import { saveUser } from "@/core/services/user.service";

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

vi.mock("@/core/actions/user.actions", () => ({
  updateUserDepartmentAction: vi.fn().mockResolvedValue({ success: true }),
}));

describe("useSelectDepartmentPage (Hook Test)", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("deve exportar a lista de departamentos disponíveis", () => {
    expect(DEPARTMENTS.length).toBeGreaterThan(0);
    expect(DEPARTMENTS).toContain("Engenharia");
  });

  it("deve exibir erro se tentar enviar formulário sem selecionar departamento", () => {
    saveUser({
      name: "Novo Usuário",
      email: "novo@empresa.com",
      department: "",
      access: "colaborador",
      password: "123",
    });

    const { result } = renderHook(() => useSelectDepartmentPage());
    const mockEvent = { preventDefault: vi.fn() } as unknown as React.FormEvent;

    act(() => {
      result.current.handleSubmit(mockEvent);
    });

    expect(mockPush).not.toHaveBeenCalled();
  });

  it("deve salvar departamento selecionado e redirecionar para a home após atualização", async () => {
    saveUser({
      name: "Novo Usuário",
      email: "novo@empresa.com",
      department: "",
      access: "colaborador",
      password: "123",
    });

    const { result } = renderHook(() => useSelectDepartmentPage());

    act(() => {
      result.current.setDepartment("Engenharia");
    });

    const mockEvent = { preventDefault: vi.fn() } as unknown as React.FormEvent;

    await act(async () => {
      await result.current.handleSubmit(mockEvent);
    });

    expect(mockPush).toHaveBeenCalledWith("/");
  });
});
