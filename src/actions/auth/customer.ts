"use server";

import { redirect } from "next/navigation";
import { customerRegisterSchema, loginSchema } from "@/lib/dashboard/schemas";
import { dashboardPathFor } from "@/server/dashboard/access";
import {
  registerCustomer,
  login,
  logout,
  EmailInUseError,
  InvalidCredentialsError,
  AccountSuspendedError,
} from "@/server/dashboard/auth";

export type CustomerAuthState = { ok: boolean; message?: string; signedIn?: boolean; redirectTo?: string };

const GENERIC_FORM_ERROR = "Please check the form and try again.";

export async function registerCustomerAction(_prev: CustomerAuthState, formData: FormData): Promise<CustomerAuthState> {
  const parsed = customerRegisterSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    city: formData.get("city"),
    password: formData.get("password"),
    consent: formData.get("consent"),
  });
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? GENERIC_FORM_ERROR };

  try {
    await registerCustomer({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      city: parsed.data.city || undefined,
      password: parsed.data.password,
    });
  } catch (error) {
    if (error instanceof EmailInUseError) return { ok: false, message: error.message };
    throw error;
  }

  return { ok: true, signedIn: true, redirectTo: dashboardPathFor("CUSTOMER") };
}

export async function loginCustomerAction(_prev: CustomerAuthState, formData: FormData): Promise<CustomerAuthState> {
  const parsed = loginSchema.safeParse({ email: formData.get("email"), password: formData.get("password") });
  if (!parsed.success) return { ok: false, message: "Enter a valid email and password." };

  try {
    await login({ email: parsed.data.email, password: parsed.data.password, expectedRole: "CUSTOMER" });
  } catch (error) {
    if (error instanceof InvalidCredentialsError || error instanceof AccountSuspendedError) {
      return { ok: false, message: error.message };
    }
    throw error;
  }

  return { ok: true, signedIn: true, redirectTo: dashboardPathFor("CUSTOMER") };
}

/** Used as a <form action> directly, so it doesn't take React-Server-Action's usual (state, formData) shape. */
export async function logoutCustomerAction(): Promise<void> {
  await logout();
  redirect("/login");
}
