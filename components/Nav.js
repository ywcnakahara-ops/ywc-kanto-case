"use client";

import Link from "next/link";
import { ChevronLeft, LayoutGrid, Plus, Search, UserCircle2 } from "lucide-react";

export function Header({ title, backHref, right }) {
  return (
    <div className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-inkline bg-white px-3">
      <div className="flex min-w-0 items-center gap-1">
        {backHref && (
          <Link
            href={backHref}
            className="flex h-9 w-9 items-center justify-center rounded-full active:bg-gray-100"
          >
            <ChevronLeft size={22} color="#1F2328" />
          </Link>
        )}
        <h1 className="truncate text-[15px] font-bold text-ink">{title}</h1>
      </div>
      <div className="flex items-center gap-1">{right}</div>
    </div>
  );
}

export function BottomNav({ active, role }) {
  const items = [
    { key: "list", label: "一覧", icon: LayoutGrid, href: "/cases/" },
    ...(role === "admin"
      ? [{ key: "new", label: "新規", icon: Plus, href: "/cases/new/" }]
      : []),
    { key: "me", label: "マイページ", icon: UserCircle2, href: "/me/" },
  ];

  return (
    <div className="sticky bottom-0 z-20 flex h-16 border-t border-inkline bg-white">
      {items.map((it) => {
        const isActive = active === it.key;
        return (
          <Link
            key={it.key}
            href={it.href}
            className="flex flex-1 flex-col items-center justify-center gap-0.5"
          >
            <it.icon size={20} color={isActive ? "#D62839" : "#767B85"} />
            <span
              className="text-[10px] font-bold"
              style={{ color: isActive ? "#D62839" : "#767B85" }}
            >
              {it.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
