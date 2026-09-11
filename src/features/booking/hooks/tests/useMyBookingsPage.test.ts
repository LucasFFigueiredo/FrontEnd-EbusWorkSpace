import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useMyBookingsPage, fmtDateOnly, fmtRoomPeriod } from "../useMyBookingsPage";

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("@/core/actions/booking.actions", () => ({
  cancelBookingAction: vi.fn().mockResolvedValue({ success: true }),
  requestExtensionAction: vi.fn().mockResolvedValue({ success: true }),
}));

describe("useMyBookingsPage (Hook Test)", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("deve formatar período da sala e datas", () => {
    const start = "2026-08-10T10:00:00.000Z";
    const end = "2026-08-10T11:00:00.000Z";

    expect(fmtDateOnly(start)).toBeTruthy();
    expect(fmtRoomPeriod(start, end)).toContain("10");
  });

  it("deve inicializar com bookingToCancel como null", () => {
    const { result } = renderHook(() => useMyBookingsPage());

    expect(result.current.bookingToCancel).toBeNull();
  });

  it("deve definir bookingToCancel ao chamar setBookingToCancel", () => {
    const { result } = renderHook(() => useMyBookingsPage());

    act(() => {
      result.current.setBookingToCancel("booking-123");
    });

    expect(result.current.bookingToCancel).toBe("booking-123");
  });

  it("deve cancelar agendamento e resetar bookingToCancel", async () => {
    const { result } = renderHook(() => useMyBookingsPage());

    act(() => {
      result.current.setBookingToCancel("booking-abc");
    });

    expect(result.current.bookingToCancel).toBe("booking-abc");

    await act(async () => {
      await result.current.handleConfirmCancel();
    });

    expect(result.current.bookingToCancel).toBeNull();
  });

  it("deve expor estados do modal de extensão", () => {
    const { result } = renderHook(() => useMyBookingsPage());

    expect(result.current.extensionBookingId).toBeNull();
    expect(result.current.extensionMinutes).toBe("30");
    expect(result.current.extensionJustification).toBe("");
  });

  it("não deve solicitar extensão sem justificativa", async () => {
    const { authService: _ } = await import("@/core/services/auth.service").catch(() => ({
      authService: null,
    }));
    const { requestExtensionAction } = await import("@/core/actions/booking.actions");

    const { result } = renderHook(() => useMyBookingsPage());

    act(() => {
      result.current.setExtensionBookingId("booking-ext-1");
    });

    await act(async () => {
      await result.current.handleRequestExtension();
    });

    expect(requestExtensionAction).not.toHaveBeenCalled();
  });
});
