"use client";

import { useUser, initials, getRoleLabel } from "@/core/services/user.service";
import { authService } from "@/core/services/auth.service";

export function useUserMenu() {
  const user = useUser();
  const hasUser = Boolean(user.name?.trim());

  const handleLogout = () => {
    authService.logout();
  };

  return {
    user,
    hasUser,
    handleLogout,
    userInitials: hasUser ? initials(user.name) : "",
    roleLabel: getRoleLabel(user.access),
  };
}
