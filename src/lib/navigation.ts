export type NavigationItem = {
  label: string;
  href: string;
};

export const navigationItems: NavigationItem[] = [
  {
    label: "Dashboard",
    href: "/",
  },
  {
    label: "Tageserfassung",
    href: "/tageserfassung",
  },
  {
    label: "Training",
    href: "/training",
  },
  {
    label: "Ernährung",
    href: "/ernaehrung",
  },
  {
    label: "Laborwerte",
    href: "/laborwerte",
  },
  {
    label: "Compass AI",
    href: "/compass-ai",
  },
];

export function isNavigationItemActive(
  pathname: string,
  href: string,
): boolean {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname.startsWith(href);
}
