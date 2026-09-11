"use client";

import { useEffect, useState } from "react";
import type { UserProfile } from "@/core/models/user.types";

const KEY = "ebus.user.profile";

const DEFAULT: UserProfile = {
  name: "",
  email: "",
  department: "",
  access: "colaborador",
};

const isClient = () => typeof window !== "undefined";

export function getRoleLabel(role?: string): string {
  switch (role?.toLowerCase()) {
    case "admin":
    case "administrator":
      return "Administrador";
    case "gestor":
    case "manager":
      return "Gestor";
    case "facilities":
      return "Facilities";
    default:
      return "Colaborador";
  }
}

export function getUser(): UserProfile {
  if (!isClient()) return DEFAULT;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { ...DEFAULT, ...JSON.parse(raw) };
  } catch {}
  return DEFAULT;
}

export function saveUser(u: UserProfile) {
  if (!isClient()) return;
  localStorage.setItem(KEY, JSON.stringify(u));
  window.dispatchEvent(new CustomEvent("rb:user-changed"));
}

export function clearUser() {
  if (!isClient()) return;
  localStorage.removeItem(KEY);
  window.dispatchEvent(new CustomEvent("rb:user-changed"));
}

export function useUser() {
  const [user, setUser] = useState<UserProfile>(DEFAULT);

  useEffect(() => {
    setUser(getUser());
    const refresh = () => setUser(getUser());
    window.addEventListener("rb:user-changed", refresh);
    window.addEventListener("rb:auth-changed", refresh);
    return () => {
      window.removeEventListener("rb:user-changed", refresh);
      window.removeEventListener("rb:auth-changed", refresh);
    };
  }, []);

  return user;
}

export function initials(name: string) {
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase() ?? "")
      .join("") || "?"
  );
}
