import { describe, it, expect, beforeEach } from "vitest";
import { getUser, saveUser, clearUser, initials, getRoleLabel } from "../user.service";
import type { UserProfile } from "@/core/models/user.types";

function createMockUser(overrides: Partial<UserProfile> = {}): UserProfile {
  return {
    name: "Ana Admin",
    email: "admin@empresa.com",
    department: "Administração",
    access: "admin",
    ...overrides,
  };
}

describe("user.service (Utilitários)", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("deve retornar o perfil padrão quando nenhum usuário está salvo", () => {
    const user = getUser();
    expect(user.name).toBe("");
    expect(user.access).toBe("colaborador");
  });

  it("deve salvar e recuperar o perfil do usuário via localStorage", () => {
    const mockUser = createMockUser();
    saveUser(mockUser);

    const user = getUser();
    expect(user.name).toBe("Ana Admin");
    expect(user.email).toBe("admin@empresa.com");
    expect(user.access).toBe("admin");
  });

  it("deve limpar o perfil do usuário ao chamar clearUser", () => {
    saveUser(createMockUser());
    clearUser();

    const user = getUser();
    expect(user.name).toBe("");
  });

  it("deve gerar iniciais corretamente", () => {
    expect(initials("Ana Admin")).toBe("AA");
    expect(initials("Fabio Facilities")).toBe("FF");
    expect(initials("Bruno")).toBe("B");
    expect(initials("")).toBe("?");
  });

  it("deve retornar o rótulo correto para cada perfil de acesso", () => {
    expect(getRoleLabel("admin")).toBe("Administrador");
    expect(getRoleLabel("administrator")).toBe("Administrador");
    expect(getRoleLabel("gestor")).toBe("Gestor");
    expect(getRoleLabel("manager")).toBe("Gestor");
    expect(getRoleLabel("facilities")).toBe("Facilities");
    expect(getRoleLabel("colaborador")).toBe("Colaborador");
    expect(getRoleLabel(undefined)).toBe("Colaborador");
  });
});
