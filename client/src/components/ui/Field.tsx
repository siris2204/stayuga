import { InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

const fieldBase =
  "w-full rounded-lg border border-line bg-white px-4 py-2.5 text-sm text-ink placeholder:text-ink-soft/50 focus:border-forest focus:outline-none focus:ring-1 focus:ring-forest transition-colors";

function FieldWrapper({
  label,
  error,
  children,
}: {
  label?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      {label && <span className="mb-1.5 block text-sm font-medium text-ink">{label}</span>}
      {children}
      {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
    </label>
  );
}

export function Input({
  label,
  error,
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label?: string; error?: string }) {
  return (
    <FieldWrapper label={label} error={error}>
      <input className={clsx(fieldBase, className)} {...props} />
    </FieldWrapper>
  );
}

export function Textarea({
  label,
  error,
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string; error?: string }) {
  return (
    <FieldWrapper label={label} error={error}>
      <textarea className={clsx(fieldBase, "min-h-32 resize-y", className)} {...props} />
    </FieldWrapper>
  );
}

export function Select({
  label,
  error,
  className,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & { label?: string; error?: string }) {
  return (
    <FieldWrapper label={label} error={error}>
      <select className={clsx(fieldBase, className)} {...props}>
        {children}
      </select>
    </FieldWrapper>
  );
}
