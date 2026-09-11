import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useScanPage } from "../useScanPage";

const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

let mockStartFn = vi.fn().mockImplementation((_c, _o, success) => {
  if (success) success("booking-123");
  return Promise.resolve();
});

vi.mock("html5-qrcode", () => {
  return {
    Html5Qrcode: function () {
      return {
        start: (...args: any[]) => mockStartFn(...args),
        stop: vi.fn().mockResolvedValue(undefined),
        clear: vi.fn().mockResolvedValue(undefined),
      };
    },
  };
});

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("useScanPage (Hook Test)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve inicializar com estado de scanner inativo e id manual vazio", () => {
    const { result } = renderHook(() => useScanPage("qr-region"));

    expect(result.current.scanning).toBe(false);
    expect(result.current.manualId).toBe("");
  });

  it("deve navegar para a tela de checkin ao chamar goToCheckin", () => {
    const { result } = renderHook(() => useScanPage("qr-region"));

    act(() => {
      result.current.goToCheckin("booking-123");
    });

    expect(mockPush).toHaveBeenCalledWith("/checkin?id=booking-123");
  });

  it("deve iniciar e parar o scanner sem acionar callback automático", async () => {
    mockStartFn.mockImplementationOnce(() => Promise.resolve());
    const { result } = renderHook(() => useScanPage("qr-region"));

    await act(async () => {
      await result.current.start();
    });

    expect(result.current.scanning).toBe(true);

    await act(async () => {
      await result.current.stop();
    });

    expect(result.current.scanning).toBe(false);
  });

  it("deve acionar callback de leitura de QR Code e navegar para checkin", async () => {
    mockStartFn.mockImplementationOnce((_c, _o, success) => {
      if (success) success("decoded-booking-id");
      return Promise.resolve();
    });

    const { result } = renderHook(() => useScanPage("qr-region"));

    await act(async () => {
      await result.current.start();
    });

    expect(mockPush).toHaveBeenCalledWith("/checkin?id=decoded-booking-id");
  });

  it("deve tratar erro ao falhar inicialização da câmera", async () => {
    mockStartFn.mockImplementationOnce(() => Promise.reject(new Error("No camera")));

    const { result } = renderHook(() => useScanPage("qr-region"));

    await act(async () => {
      await result.current.start();
    });

    expect(result.current.scanning).toBe(false);
  });
});
