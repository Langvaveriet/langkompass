"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  isNavigationItemActive,
  navigationItems,
} from "@/lib/navigation";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-[260px] shrink-0 self-stretch border-r border-border-subtle bg-surface-raised px-6 py-8 lg:block">
      <nav aria-label="Hauptnavigation">
        <ul className="grid gap-2">
          {navigationItems.map((item) => {
            const isActive = isNavigationItemActive(pathname, item.href);

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={[
                    "flex min-h-12 items-center rounded-full px-5 py-3 text-base transition",
                    isActive
                      ? "bg-forest-strong font-semibold text-white"
                      : "text-text-muted hover:bg-surface-muted hover:text-text-primary",
                  ].join(" ")}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
