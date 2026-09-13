"use client";

import { startTransition, useCallback, useEffect, useId, useRef, type FormEvent } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Dispatches the server action from onSubmit rather than the `action` prop.
 * React resets an uncontrolled form when it is submitted through `action`,
 * which would wipe a borrower's input on a validation error. Forms also carry
 * method="post" so that a submit before hydration cannot put a phone number
 * into the URL as a query string.
 *
 * `_elapsed` is milliseconds since the form mounted, measured entirely on the
 * client, so the server never compares two different clocks.
 */
export function useGuardedAction(action: (fd: FormData) => void) {
  const mountedAt = useRef(0);
  useEffect(() => {
    mountedAt.current = performance.now();
  }, []);
  return useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const fd = new FormData(e.currentTarget);
      fd.set("_elapsed", String(mountedAt.current ? Math.round(performance.now() - mountedAt.current) : 0));
      startTransition(() => action(fd));
    },
    [action],
  );
}

/** Hidden from people, filled by bots. */
export function Honeypot() {
  return (
    <div className="absolute top-0 -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden>
      <label>
        Website <input type="text" name="website" tabIndex={-1} autoComplete="off" />
      </label>
    </div>
  );
}

/**
 * Wires label, hint and error to the control. Children receive the id and the
 * aria attributes so screen readers announce the error with the field.
 */
export function Field({
  label,
  name,
  error,
  hint,
  children,
  className,
}: {
  label: string;
  name: string;
  error?: string;
  hint?: string;
  children: (props: {
    id: string;
    "aria-invalid": boolean | undefined;
    "aria-describedby": string | undefined;
  }) => React.ReactNode;
  className?: string;
}) {
  const uid = useId();
  const id = `${name}-${uid}`;
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const describedBy = error ? errorId : hint ? hintId : undefined;
  return (
    <div className={className}>
      <label htmlFor={id} className="label">
        {label}
      </label>
      {children({ id, "aria-invalid": error ? true : undefined, "aria-describedby": describedBy })}
      {hint && !error && (
        <p id={hintId} className="hint">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export function SubmitButton({
  children,
  pending,
  className,
  variant = "primary",
}: {
  children: React.ReactNode;
  pending: boolean;
  className?: string;
  variant?: "primary" | "light";
}) {
  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(
        "inline-flex h-12 w-full items-center justify-center gap-2 px-6 text-[15px] font-bold transition-all disabled:opacity-70",
        variant === "primary" ? "bg-brass-500 hover:bg-brass-400 text-ink-950" : "text-ink-900 hover:bg-cream bg-white",
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
    <div
      className="border-brass-400/40 bg-brass-50 text-brass-600 flex items-start gap-3 border p-4 text-sm"
      role="status"
    >
      <CheckCircle2 className="mt-0.5 size-5 shrink-0" aria-hidden />
      <p className="font-semibold">{message ?? "Thank you. We will be in touch shortly."}</p>
    </div>
  );
}

export function FormError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="bg-danger-50 text-danger px-3 py-2 text-sm font-semibold" role="alert">
      {message}
    </p>
  );
}

export const amountPresets = [200_000, 500_000, 1_000_000, 2_500_000, 5_000_000, 10_000_000];
