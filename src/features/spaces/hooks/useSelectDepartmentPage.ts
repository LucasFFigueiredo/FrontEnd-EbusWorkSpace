"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { getUser, saveUser } from "@/core/services/user.service";
import { updateUserDepartmentAction } from "@/core/actions/user.actions";

export const DEPARTMENTS = [
  "ODPTech: Build & data",
  "ODPTech: Product studio & ops",
  "ODPTech: Performance studio",
  "ODPTech: VSM",
  "Marketing Corporativo: Facilities",
  "Marketing Corporativo: Marketing",
  "Marketing Corporativo: CX",
  "Marketing Corporativo: CS",
  "Planejamento Estratégico: Projetos",
  "Planejamento Estratégico: Financeiro",
  "Outros departamentos",
];

export function useSelectDepartmentPage() {
  const [userName, setUserName] = useState("");
  const [department, setDepartment] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const user = getUser();
    setUserName(user.name || "Usuário");
    if (user.department) setDepartment(user.department);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    if (!department) {
      toast.error("Selecione seu departamento.");
      setLoading(false);
      return;
    }

    try {
      const response = await updateUserDepartmentAction(department);
      if (response.success) {
        const user = getUser();

        saveUser({ ...user, department });
        toast.success("Perfil atualizado com sucesso!");
        window.location.href = "/";
      }
    } catch (error) {
      toast.error("Erro ao atualizar o departamento.");
    } finally {
      setLoading(false);
    }
  }

  return {
    userName,
    department,
    setDepartment,
    loading,
    departments: DEPARTMENTS,
    handleSubmit,
  };
}
