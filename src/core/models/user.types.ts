export type AccessType = "colaborador" | "gestor" | "facilities" | "admin";

export interface UserProfile {
  id?: string;
  name: string;
  email: string;
  department: string;
  access: AccessType;
}
