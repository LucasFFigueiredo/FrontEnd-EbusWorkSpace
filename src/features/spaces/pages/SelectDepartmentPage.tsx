"use client";

import { useSelectDepartmentPage } from "../hooks/useSelectDepartmentPage";
import { Button } from "@/shared/components/ui/button";
import { Label } from "@/shared/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/shared/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Building2, Save, User } from "lucide-react";

export function SelectDepartmentPage() {
  const { userName, department, setDepartment, loading, departments, handleSubmit } =
    useSelectDepartmentPage();

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-10">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg text-primary-foreground bg-primary">
            <Building2 className="h-5 w-5" />
          </div>
          <CardTitle className="text-2xl font-bold">Completar Perfil</CardTitle>
          <CardDescription className="text-sm text-muted-foreground mt-1">
            Selecione seu departamento para finalizar o primeiro acesso.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label className="text-xs font-semibold text-muted-foreground uppercase">
                Nome do Usuário
              </Label>
              <div className="flex items-center gap-2 p-2.5 rounded-md bg-muted text-foreground border text-sm font-medium">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>{userName}</span>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="department">Departamento</Label>
              <Select value={department} onValueChange={setDepartment}>
                <SelectTrigger id="department">
                  <SelectValue placeholder="Selecione seu departamento" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" disabled={loading} className="w-full mt-2">
              <Save className="h-4 w-4 mr-2" /> {loading ? "Salvando..." : "Salvar e Continuar"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
