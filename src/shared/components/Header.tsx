"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarCheck,
  Armchair,
  DoorOpen,
  ListChecks,
  QrCode,
  Building,
  BarChart3,
  LogIn,
} from "lucide-react";
import { useUser } from "@/core/services/user.service";
import { UserMenu } from "@/features/auth/components/UserMenu";
import "./header-components.css";

export function Header() {
  const pathname = usePathname();
  const user = useUser();
  const isAdmin = user.access === "admin";
  const isGestor = user.access === "gestor" || isAdmin;
  const isFacilities = user.access === "facilities" || isAdmin;
  const isLoggedIn = Boolean(user.name?.trim());

  return (
    <header className="header-root">
      <div className="header-inner">
        <Link href="/" className="flex items-center gap-2">
          <img src="/logo-ebus.svg" alt="E-bus WorkSpace" className="h-9 w-auto" />
        </Link>

        { }
        <nav className="header-nav hidden! md:flex!">
          {isLoggedIn ? (
            <>
              <Link
                href="/book/desk"
                className={`header-nav-link ${pathname === "/book/desk" ? "header-nav-link--active" : "header-nav-link--inactive"}`}
              >
                <Armchair className="header-nav-icon" />{" "}
                <span className="header-nav-label">Mesas</span>
              </Link>
              <Link
                href="/book/room"
                className={`header-nav-link ${pathname === "/book/room" ? "header-nav-link--active" : "header-nav-link--inactive"}`}
              >
                <DoorOpen className="header-nav-icon" />{" "}
                <span className="header-nav-label">Salas</span>
              </Link>
              <Link
                href="/bookings"
                className={`header-nav-link ${pathname === "/bookings" ? "header-nav-link--active" : "header-nav-link--inactive"}`}
              >
                <ListChecks className="header-nav-icon" />{" "}
                <span className="header-nav-label">Meus</span>
              </Link>
              <Link
                href="/scan"
                className={`header-nav-link ${pathname === "/scan" ? "header-nav-link--active" : "header-nav-link--inactive"}`}
              >
                <QrCode className="header-nav-icon" />{" "}
                <span className="header-nav-label">Validar</span>
              </Link>
              {isFacilities && (
                <Link
                  href="/spaces"
                  className={`header-nav-link ${pathname === "/spaces" ? "header-nav-link--active" : "header-nav-link--inactive"}`}
                >
                  <Building className="header-nav-icon" />{" "}
                  <span className="header-nav-label">Espaços</span>
                </Link>
              )}
              {isGestor && (
                <Link
                  href="/metrics"
                  className={`header-nav-link ${pathname === "/metrics" ? "header-nav-link--active" : "header-nav-link--inactive"}`}
                >
                  <BarChart3 className="header-nav-icon" />{" "}
                  <span className="header-nav-label">Métricas</span>
                </Link>
              )}
            </>
          ) : null}
        </nav>

        <div className="flex items-center">
          {isLoggedIn ? (
            <div className="header-user-menu">
              <UserMenu />
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
