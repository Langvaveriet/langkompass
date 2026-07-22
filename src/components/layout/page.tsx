import type { HTMLAttributes, ReactNode } from "react";

type PageProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
};

export function Page({
  children,
  className = "",
  ...props
}: PageProps) {
  return (
    <section
      className={["w-full", className].join(" ")}
      {...props}
    >
      {children}
    </section>
  );
}
