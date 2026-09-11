import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useSpacesPage, fmt } from "../useSpacesPage";
import { saveUser } from "@/core/services/user.service";

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
}));

vi.mock("@/core/actions/booking.actions", () => ({
  cancelBookingAction: vi.fn().mockResolvedValue({ success: true }),
  approveReservationAction: vi.fn().mockResolvedValue({ success: true }),
}));

vi.mock("@/core/actions/space.actions", () => ({
  blockResourceAction: vi.fn().mockResolvedValue({ success: true }),
  unblockResourceAction: vi.fn().mockResolvedValue({ success: true }),
}));

const mockRooms = [
  { id: "room-1", name: "Sala A", active: true, type: "room" },
  { id: "room-2", name: "Sala B", active: true, type: "room" },
];

const mockUpcomingBookings = [
  {
    id: "booking-1",
    spaceId: "room-1",
    userName: "Bruno Colaborador",
    startTime: new Date(Date.now() + 3600000).toISOString(),
    endTime: new Date(Date.now() + 7200000).toISOString(),
  },
];

describe("useSpacesPage (Hook Test)", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("deve formatar datas ISO corretamente", () => {
    expect(fmt("2026-08-10T10:00:00.000Z")).toBeTruthy();
  });

  it("deve proibir acesso se o usuário não for facilities ou admin", () => {
    saveUser({
      name: "Bruno Colaborador",
      email: "bruno@empresa.com",
      department: "Engenharia",
      access: "colaborador",
      password: "123",
    });

    const { result } = renderHook(() => useSpacesPage(mockRooms, mockUpcomingBookings, [], []));

    expect(result.current.isAllowed).toBe(false);
  });

  it("deve permitir acesso para a equipe de Facilities", () => {
    saveUser({
      name: "Fabio Facilities",
      email: "facilities@empresa.com",
      department: "Operações",
      access: "facilities",
      password: "123",
    });

    const { result } = renderHook(() => useSpacesPage(mockRooms, mockUpcomingBookings, [], []));

    expect(result.current.isAllowed).toBe(true);
  });

  it("deve validar erros ao tentar inativar sem motivo ou com período inválido", async () => {
    saveUser({
      name: "Fabio Facilities",
      email: "facilities@empresa.com",
      department: "Operações",
      access: "facilities",
      password: "123",
    });

    const { result } = renderHook(() => useSpacesPage(mockRooms, mockUpcomingBookings, [], []));
    const roomId = mockRooms[0].id;

    await act(async () => {
      result.current.setBlockingId(roomId);
      await result.current.confirmBlock();
    });

    await act(async () => {
      result.current.setReason("Motivo");
      result.current.setBlockTo("2020-01-01");
      await result.current.confirmBlock();
    });

    expect(result.current.blockingId).toBe(roomId);
  });

  it("deve chamar blockResourceAction com dados válidos", async () => {
    saveUser({
      name: "Fabio Facilities",
      email: "facilities@empresa.com",
      department: "Operações",
      access: "facilities",
      password: "123",
    });

    const { blockResourceAction } = await import("@/core/actions/space.actions");
    const { result } = renderHook(() => useSpacesPage(mockRooms, mockUpcomingBookings, [], []));

    act(() => {
      result.current.setBlockingId(mockRooms[0].id);
      result.current.setReason("Manutenção de Ar-condicionado");
      result.current.setBlockTo("2030-12-31");
    });

    await act(async () => {
      await result.current.confirmBlock();
    });

    expect(blockResourceAction).toHaveBeenCalled();
    expect(result.current.blockingId).toBeNull();
  });

  it("deve cancelar agendamento emergencialmente (confirmForceCancel)", async () => {
    saveUser({
      name: "Fabio Facilities",
      email: "facilities@empresa.com",
      department: "Operações",
      access: "facilities",
      password: "123",
    });

    const { result } = renderHook(() => useSpacesPage(mockRooms, mockUpcomingBookings, [], []));
    const targetBookingId = mockUpcomingBookings[0].id;

    act(() => {
      result.current.setCancelBookingId(targetBookingId);
      result.current.setCancelReason("Vazamento emergencial");
    });

    expect(result.current.cancelBookingId).toBe(targetBookingId);

    await act(async () => {
      await result.current.confirmForceCancel();
    });

    expect(result.current.cancelBookingId).toBeNull();
  });
});
