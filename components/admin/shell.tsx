"use client";

import {
  FolderKanban,
  Inbox,
  LayoutDashboard,
  LogOut,
  Menu,
  Sparkles,
  UserRound,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { signOutAction } from "@/lib/actions/auth";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Genel bakış", icon: LayoutDashboard },
  { href: "/admin/profile", label: "Profil", icon: UserRound },
  { href: "/admin/projects", label: "Projeler", icon: FolderKanban },
  { href: "/admin/skills", label: "Yetenekler", icon: Sparkles },
  { href: "/admin/messages", label: "Mesajlar", icon: Inbox },
  { href: "/admin/account", label: "Hesap", icon: UserRound },
];

function active(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminShell({
  email,
  unread,
  children,
}: {
  email: string;
  unread: number;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const links = (
    <nav className="flex flex-col gap-1">
      {NAV.map((item) => {
        const on = active(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium",
              on ? "bg-ink text-paper" : "text-muted hover:bg-paper hover:text-ink"
            )}
          >
            <item.icon className="size-4 shrink-0" />
            <span className="flex-1">{item.label}</span>
            {item.href === "/admin/messages" && unread > 0 ? (
              <span className={cn("rounded-full px-2 text-xs", on ? "bg-paper text-ink" : "bg-accent text-white")}>
                {unread}
              </span>
            ) : null}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-paper md:grid md:grid-cols-[250px_1fr]">
      <aside className="hidden border-r border-line bg-card md:flex md:flex-col md:px-4 md:py-5">
        <Link href="/admin" className="px-2 text-sm font-semibold tracking-tight">
          Doğuhan Erol
          <span className="mt-0.5 block text-xs font-normal text-muted">Yönetim</span>
        </Link>
        <div className="mt-6 flex-1">{links}</div>
        <div className="mt-6 border-t border-line pt-4">
          <p className="truncate px-2 text-sm">{email}</p>
          <div className="mt-3 flex items-center justify-between px-2">
            <Link href="/" className="text-xs text-muted hover:text-ink">
              Siteyi aç
            </Link>
            <form action={signOutAction}>
              <button type="submit" aria-label="Çıkış" className="text-muted hover:text-ink">
                <LogOut className="size-4" />
              </button>
            </form>
          </div>
        </div>
      </aside>

      <div className="flex items-center justify-between border-b border-line px-4 py-3 md:hidden">
        <p className="text-sm font-semibold">Yönetim</p>
        <button
          type="button"
          aria-label={open ? "Kapat" : "Menü"}
          onClick={() => setOpen((value) => !value)}
          className="inline-flex size-10 items-center justify-center rounded-full border border-line"
        >
          {open ? <X className="size-4" /> : <Menu className="size-4" />}
        </button>
      </div>
      {open ? (
        <div className="border-b border-line px-4 py-4 md:hidden">
          {links}
          <form action={signOutAction} className="mt-4">
            <button type="submit" className="text-sm text-muted">
              Çıkış
            </button>
          </form>
        </div>
      ) : null}

      <div className="px-4 py-6 md:px-8 md:py-8">{children}</div>
    </div>
  );
}
