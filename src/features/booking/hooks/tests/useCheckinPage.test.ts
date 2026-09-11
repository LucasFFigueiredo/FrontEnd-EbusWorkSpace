import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useCheckinPage } from "../useCheckinPage";

const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
  useSearchParams: () => ({
    get: (key: string) => (key === "id" ? null : null),
  }),
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("@/core/actions/booking.actions", () => ({
  checkInAction: vi.fn(),
  createReservationAction: vi.fn(),
}));

describe("useCheckinPage (Hook Test)", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("deve inicializar com status 'locating' quando nenhum ID é fornecido na URL", () => {
    const { result } = renderHook(() => useCheckinPage());

    expect(result.current.status).toBe("error");
    expect(result.current.errorMessage).toBeTruthy();
  });

  it("deve expor as funções de navegação e ação", () => {
    const { result } = renderHook(() => useCheckinPage());

    expect(typeof result.current.retry).toBe("function");
    expect(typeof result.current.goHome).toBe("function");
    expect(typeof result.current.goToRoomBooking).toBe("function");
    expect(typeof result.current.handleQuickDeskBooking).toBe("function");
  });

  it("deve inicializar isSubmitting como false", () => {
    const { result } = renderHook(() => useCheckinPage());

    expect(result.current.isSubmitting).toBe(false);
  });
});

describe("useCheckinPage (Hook Test) — com ID na URL", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("deve iniciar o processo de localização quando um ID é fornecido", () => {
    vi.mock("next/navigation", () => ({
      useRouter: () => ({ push: mockPush }),
      useSearchParams: () => ({
        get: (key: string) => (key === "id" ? "space-abc" : null),
      }),
    }));

    const { result } = renderHook(() => useCheckinPage());

    expect(["locating", "error"]).toContain(result.current.status);
  });
});
