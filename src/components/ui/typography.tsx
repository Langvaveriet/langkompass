import type { HTMLAttributes, ReactNode } from "react";

type TextProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
};

export function Eyebrow({ children, className = "", ...props }: TextProps) {
  return (
    <p
      className={`text-sm font-semibold uppercase tracking-[0.18em] text-copper ${className}`}
      {...props}
    >
      {children}
    </p>
  );
}

export function PageTitle({ children, className = "", ...props }: TextProps) {
  return (
    <h1
      className={`text-4xl font-semibold tracking-[-0.03em] text-forest-strong sm:text-5xl lg:text-6xl ${className}`}
      {...props}
    >
      {children}
    </h1>
  );
}

export function PageSubtitle({
  children,
  className = "",
  ...props
}: TextProps) {
  return (
    <p
      className={`text-lg leading-8 text-text-secondary ${className}`}
      {...props}
    >
      {children}
    </p>
  );
}

export function CardTitle({ children, className = "", ...props }: TextProps) {
  return (
    <h2
      className={`text-xl font-semibold text-text-primary ${className}`}
      {...props}
    >
      {children}
    </h2>
  );
}

export function BodyText({ children, className = "", ...props }: TextProps) {
  return (
    <p
      className={`text-base leading-7 text-text-secondary ${className}`}
      {...props}
    >
      {children}
    </p>
  );
}

export function Caption({ children, className = "", ...props }: TextProps) {
  return (
    <p
      className={`text-sm leading-6 text-text-muted ${className}`}
      {...props}
    >
      {children}
    </p>
  );
}
