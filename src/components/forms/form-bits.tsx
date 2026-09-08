"use client";

import { startTransition, useCallback, useEffect, useRef, type FormEvent } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Dispatches a server action manually from onSubmit. React only resets a
 * form when it is submitted through the native `action` prop, so this keeps
 * user input on validation errors and lets us stamp the time-on-form.
 */
export function useGuardedAction(action: (fd: FormData) => void) {
  const mountedAt = useRef(0);
  useEffect(() => {
    mountedAt.current = Date.now();
  }, []);
  return useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const fd = new FormData(e.currentTarget);
      fd.set("_t", String(mountedAt.current));
      startTransition(() => action(fd));
    },
    [action],
  );
}

/** Honeypot field: hidden from people, filled by bots. */
export function Honeypot() {
  return (
    <div className="absolute -left-[9999px] top-0 h-0 w-0 overflow-hidden" aria-hidden>
      <label>Website <input type="text" name="website" tabIndex={-1} autoComplete="off" /></label>
    </div>
  );
}

export function Field({ label, name, error, hint, children, className }: { label: string; name: string; error?: string; hint?: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <label htmlFor={name} className="label">{label}</label>
      {children}
      {hint && !error && <p className="hint">{hint}</p>}
      {error && <p className="error" role="alert">{error}</p>}
    </div>
  );
}

export function SubmitButton({ children, pending, className, variant = "primary" }: { children: React.ReactNode; pending: boolean; className?: string; variant?: "primary" | "light" }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(
        "inline-flex h-12 w-full items-center justify-center gap-2 rounded-full px-6 text-[15px] font-bold transition-all disabled:opacity-70",
        variant === "primary" ? "bg-verdant-600 text-white hover:bg-verdant-700 hover:shadow-glow" : "bg-white text-ink-900 hover:bg-cream",
        className,
      )}
    >
      {pending && <Loader2 className="size-4 animate-spin" aria-hidden />}
      {children}
    </button>
  );
}

export function SuccessNote({ message }: { message?: string }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-verdant-400/40 bg-verdant-50 p-4 text-sm text-verdant-700" role="status">
      <CheckCircle2 className="mt-0.5 size-5 shrink-0" aria-hidden />
      <p className="font-semibold">{message ?? "Thank you. We will be in touch shortly."}</p>
    </div>
  );
}

export function FormError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="rounded-xl bg-danger-50 px-3 py-2 text-sm font-semibold text-danger" role="alert">{message}</p>;
}

export const amountPresets = [200_000, 500_000, 1_000_000, 2_500_000, 5_000_000, 10_000_000];
