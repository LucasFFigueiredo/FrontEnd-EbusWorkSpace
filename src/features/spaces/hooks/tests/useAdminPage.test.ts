import { describe, it, expect, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useAdminPage } from "../useAdminPage";
import { saveUser } from "@/core/services/user.service";

describe("useAdminPage (Hook Test)", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("deve validar isAdmin como falso para colaborador comum", () => {
    saveUser({
      name: "Bruno Colaborador",
      email: "bruno@empresa.com",
      department: "Engenharia",
      access: "colaborador",
      password: "123",
    });

    const { result } = renderHook(() => useAdminPage());

    expect(result.current.isAdmin).toBe(false);
  });

  it("deve validar isAdmin como verdadeiro para administrador", () => {
    saveUser({
      name: "Ana Admin",
      email: "admin@empresa.com",
      department: "Administração",
      access: "admin",
      password: "123",
    });

    const { result } = renderHook(() => useAdminPage());

    expect(result.current.isAdmin).toBe(true);
  });
});
