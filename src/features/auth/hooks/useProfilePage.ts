import { useState, useMemo } from "react";
import { toast } from "sonner";
import { updateUserDepartmentAction, requestAccessAction } from "@/core/actions/user.actions";
import type { MappedProfileBooking } from "@/app/profile/page";

export function fmtDateTime(iso: string) {
  if (!iso) return "";
  const d = new Date(iso);
  const date = d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
  const time = d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  return `${date}, ${time}`;
}

export function useProfilePage(user: any, bookings: MappedProfileBooking[]) {
  const [name, setName] = useState(user.name);
  const [department, setDepartment] = useState(user.sector);

  const [requestOpen, setRequestOpen] = useState(false);
  const [requestedRole, setRequestedRole] = useState("gestor");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const now = Date.now();

  const upcoming = useMemo(() => {
    return bookings
      .filter(
        (b) =>
          new Date(b.endTime).getTime() >= now && b.status !== "Canceled" && b.status !== "NoShow",
      )
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  }, [bookings, now]);

  const past = useMemo(() => {
    return bookings
      .filter(
        (b) =>
          new Date(b.endTime).getTime() < now || b.status === "Canceled" || b.status === "NoShow",
      )
      .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
  }, [bookings, now]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!department.trim()) return toast.error("Informe seu departamento");

    setIsSubmitting(true);
    try {
      await updateUserDepartmentAction(department);
      toast.success("Departamento salvo com sucesso!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao salvar perfil.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleRequestAccess() {
    setIsSubmitting(true);
    try {
      await requestAccessAction(requestedRole as any);
      toast.success(`Solicitação de acesso enviada para análise!`);
      setRequestOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao solicitar acesso.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function initials(n: string) {
    return (
      n
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((p) => p[0]?.toUpperCase())
        .join("") || "?"
    );
  }

  function getRoleLabel(role: string) {
    switch (role.toLowerCase()) {
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

  return {
    name,
    setName,
    department,
    setDepartment,
    requestOpen,
    setRequestOpen,
    requestedRole,
    setRequestedRole,
    upcoming,
    past,
    handleSave,
    handleRequestAccess,
    userInitials: initials(user.name),
    roleLabel: getRoleLabel(user.role),
    isAdmin: user.role.toLowerCase() === "admin" || user.role.toLowerCase() === "administrator",
    isSubmitting,
  };
}
