import type { HTMLAttributes, ReactNode } from "react";

type Props = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

export function Card({
  children,
  className = "",
  ...props
}: Props) {
  return (
    <div
      className={[
        "rounded-[var(--radius-lg)]",
        "border border-border-subtle",
        "bg-surface-raised",
        "shadow-sm",
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  children,
  className = "",
  ...props
}: Props) {
  return (
    <div
      className={["border-b border-border-subtle p-6", className].join(" ")}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardTitle({
  children,
  className = "",
  ...props
}: Props) {
  return (
    <h3
      className={["text-lg font-semibold text-text-primary", className].join(" ")}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardContent({
  children,
  className = "",
  ...props
}: Props) {
  return (
    <div
      className={["p-6", className].join(" ")}
      {...props}
    >
      {children}
    </div>
  );
}
