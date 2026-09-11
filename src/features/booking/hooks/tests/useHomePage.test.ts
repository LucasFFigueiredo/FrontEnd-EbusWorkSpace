import { describe, it, expect, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useHomePage } from "../useHomePage";
import { saveUser } from "@/core/services/user.service";

describe("useHomePage (Hook Test)", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("deve retornar isLoggedIn como falso para visitante anônimo", () => {
    const { result } = renderHook(() => useHomePage());
    expect(result.current.isLoggedIn).toBe(false);
  });

  it("deve retornar isLoggedIn como verdadeiro para colaborador logado", () => {
    saveUser({
      name: "Bruno Colaborador",
      email: "bruno@empresa.com",
      department: "Engenharia",
      access: "colaborador",
      password: "123",
    });

    const { result } = renderHook(() => useHomePage());
    expect(result.current.isLoggedIn).toBe(true);
    expect(result.current.user.name).toBe("Bruno Colaborador");
  });
});
