import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useMetricsPage, DAY_LABELS, PALETTE } from "../useMetricsPage";
import { saveUser } from "@/core/services/user.service";

const mockReplace = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: mockReplace }),
}));

const defaultParams = {
  tab: "gerais",
  startDate: "",
  endDate: "",
  userId: "",
  dept: "all",
};

const mockUsersList = [
  { id: "u1", name: "Gisele Gestora", sector: "Recursos Humanos" },
  { id: "u2", name: "Bruno Colaborador", sector: "Engenharia" },
];

describe("useMetricsPage (Hook Test)", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    saveUser({
      name: "Gisele Gestora",
      email: "gestor@empresa.com",
      department: "Recursos Humanos",
      access: "gestor",
      password: "123",
    });
  });

  it("deve exportar rótulos de dias e paleta de cores", () => {
    expect(DAY_LABELS.length).toBe(7);
    expect(PALETTE.length).toBeGreaterThan(0);
  });

  it("deve permitir acesso para perfis de gestor e admin", () => {
    const { result } = renderHook(() => useMetricsPage(defaultParams, mockUsersList));

    expect(result.current.isAllowed).toBe(true);
    expect(result.current.mainTab).toBe("gerais");
  });

  it("deve alternar abas principais entre gerais e individual", () => {
    const { result } = renderHook(() => useMetricsPage(defaultParams, mockUsersList));

    act(() => {
      result.current.setMainTab("individual");
    });

    expect(result.current.mainTab).toBe("individual");
  });

  it("deve abrir e aplicar filtro de intervalo de datas", () => {
    const { result } = renderHook(() => useMetricsPage(defaultParams, mockUsersList));

    act(() => {
      result.current.handleOpenDateDialog();
    });

    act(() => {
      result.current.setTempStart("2026-08-01");
      result.current.setTempEnd("2026-08-31");
    });

    act(() => {
      result.current.handleApplyDateRange();
    });

    expect(result.current.startDate).toBe("2026-08-01");
    expect(result.current.endDate).toBe("2026-08-31");
    expect(result.current.isDateDialogOpen).toBe(false);
  });

  it("deve limpar filtro de intervalo de datas ao chamar handleClearDateRange", () => {
    const { result } = renderHook(() => useMetricsPage(defaultParams, mockUsersList));

    act(() => {
      result.current.handleOpenDateDialog();
    });

    act(() => {
      result.current.setTempStart("2026-08-01");
      result.current.setTempEnd("2026-08-31");
    });

    act(() => {
      result.current.handleApplyDateRange();
    });

    expect(result.current.startDate).toBe("2026-08-01");

    act(() => {
      result.current.handleClearDateRange();
    });

    expect(result.current.startDate).toBe("");
    expect(result.current.endDate).toBe("");
  });
});
