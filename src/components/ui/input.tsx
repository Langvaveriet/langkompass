import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  hint?: string;
  error?: string;
};

export function Input({
  id,
  label,
  hint,
  error,
  className = "",
  ...props
}: InputProps) {
  const hintId = id && hint ? `${id}-hint` : undefined;
  const errorId = id && error ? `${id}-error` : undefined;

  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className="grid gap-2">
      {label ? (
        <label
          htmlFor={id}
          className="text-sm font-semibold text-text-primary"
        >
          {label}
        </label>
      ) : null}

      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={[
          "min-h-12 w-full rounded-[var(--radius-md)] border bg-surface-raised px-4 py-3 text-base text-text-primary outline-none transition",
          "placeholder:text-text-muted",
          "focus:border-forest-strong focus:ring-2 focus:ring-forest-soft",
          error
            ? "border-red-500 focus:border-red-500 focus:ring-red-100"
            : "border-border-strong",
          className,
        ].join(" ")}
        {...props}
      />

      {hint ? (
        <p id={hintId} className="text-sm text-text-muted">
          {hint}
        </p>
      ) : null}

      {error ? (
        <p id={errorId} className="text-sm font-medium text-red-700">
          {error}
        </p>
      ) : null}
    </div>
  );
}
