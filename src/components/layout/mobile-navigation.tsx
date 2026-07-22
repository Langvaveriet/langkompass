"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  isNavigationItemActive,
  navigationItems,
} from "@/lib/navigation";

export function MobileNavigation() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Mobile Hauptnavigation"
      className="border-b border-border-subtle bg-surface-raised lg:hidden"
    >
      <div className="overflow-x-auto px-4 py-3">
        <ul className="flex min-w-max gap-2">
          {navigationItems.map((item) => {
            const isActive = isNavigationItemActive(pathname, item.href);

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={[
                    "flex min-h-10 items-center whitespace-nowrap rounded-full px-4 py-2 text-sm transition",
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
      </div>
    </nav>
  );
}
