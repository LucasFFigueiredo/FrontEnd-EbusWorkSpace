import { describe, it, expect } from "vitest";
import { validateBookingRange, ONE_WEEK_MS } from "../booking.service";

describe("booking.service (Utilitários)", () => {
  it("deve retornar null para um intervalo válido", () => {
    const start = new Date().toISOString();
    const end = new Date(Date.now() + 3600000).toISOString();

    expect(validateBookingRange(start, end)).toBeNull();
  });

  it("deve retornar erro quando o horário final é anterior ao inicial", () => {
    const start = new Date().toISOString();
    const end = new Date(Date.now() - 3600000).toISOString();

    expect(validateBookingRange(start, end)).toBeTruthy();
  });

  it("deve retornar erro quando o intervalo ultrapassa 1 semana", () => {
    const start = new Date().toISOString();
    const end = new Date(Date.now() + ONE_WEEK_MS + 1000).toISOString();

    expect(validateBookingRange(start, end)).toBeTruthy();
  });

  it("deve retornar erro para datas inválidas", () => {
    expect(validateBookingRange("data-invalida", "2026-01-01")).toBeTruthy();
  });
});
