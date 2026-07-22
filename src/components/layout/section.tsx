import type { HTMLAttributes, ReactNode } from "react";

type SectionProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
};

export function Section({
  children,
  className = "",
  ...props
}: SectionProps) {
  return (
    <section
      className={`mt-10 ${className}`}
      {...props}
    >
      {children}
    </section>
  );
}
