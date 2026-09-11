import { useUser } from "@/core/services/user.service";

export function useHomePage() {
  const user = useUser();
  const isLoggedIn = Boolean(user.name?.trim());

  return {
    user,
    isLoggedIn,
  };
}
