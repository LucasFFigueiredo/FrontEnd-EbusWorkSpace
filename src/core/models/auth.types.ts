import type { AccessType } from "./user.types";

export interface GoogleAuthRequest {
  googleToken: string;
}

export interface ApiUser {
  id: string;
  name: string;
  email?: string;
  profile?: string;
  department?: string;
  sector?: string;
}

export interface AuthResponse {
  token: string;
  user: ApiUser;
}

export function mapApiProfileToAccessType(profile?: string): AccessType {
  if (!profile) return "colaborador";

  const normalized = profile.trim().toLowerCase();

  switch (normalized) {
    case "admin":
    case "administrator":
      return "admin";
    case "gestor":
    case "manager":
      return "gestor";
    case "facilities":
      return "facilities";
    case "employee":
    case "colaborador":
    default:
      return "colaborador";
  }
}
