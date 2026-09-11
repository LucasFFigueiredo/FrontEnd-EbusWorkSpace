"use client";

import { useUser } from "@/core/services/user.service";
import { useUserMenu } from "../hooks/useUserMenu";
import { Button } from "@/shared/components/ui/button";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import Link from "next/link";
import {
  User,
  LogOut,
  ShieldAlert,
  Armchair,
  DoorOpen,
  ListChecks,
  QrCode,
  Building,
  BarChart3,
} from "lucide-react";

export function UserMenu() {
  const user = useUser();
  const { handleLogout, userInitials, roleLabel } = useUserMenu();

  if (!user.name) return null;

  const isAdmin = user.access === "admin";
  const isGestor = user.access === "gestor" || isAdmin;
  const isFacilities = user.access === "facilities" || isAdmin;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-10 w-10 rounded-full hover:bg-slate-100 transition-colors"
        >
          <Avatar className="h-10 w-10 border-2 border-primary/20 hover:border-primary/50 transition-all">
            <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
              {userInitials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-64" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none truncate">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground truncate">{user.email}</p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <div className="block! md:hidden!">
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link href="/book/desk">
              <Armchair className="mr-2 h-4 w-4 text-muted-foreground" /> Reserva Mesa
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link href="/book/room">
              <DoorOpen className="mr-2 h-4 w-4 text-muted-foreground" /> Reserva Sala
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link href="/bookings">
              <ListChecks className="mr-2 h-4 w-4 text-muted-foreground" /> Agendamentos
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link href="/scan">
              <QrCode className="mr-2 h-4 w-4 text-muted-foreground" />
              Check-in
            </Link>
          </DropdownMenuItem>

          {isFacilities && (
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link href="/spaces">
                <Building className="mr-2 h-4 w-4 text-muted-foreground" /> Espaços
              </Link>
            </DropdownMenuItem>
          )}

          {isGestor && (
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link href="/metrics">
                <BarChart3 className="mr-2 h-4 w-4 text-muted-foreground" /> Métricas{" "}
              </Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
        </div>

        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href="/profile">
            <User className="mr-2 h-4 w-4 text-muted-foreground" />
            Perfil
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogout}
          className="text-red-600 cursor-pointer"
        >
          <LogOut className="mr-2 h-4 w-4" /> Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
