"use client";

import { useActionState } from "react";
import { submitKycAction, type ProfileActionState } from "@/actions/partner/profile";

const initial: ProfileActionState = { ok: true };

export type KycFormDefaults = {
  firmName: string;
  panNumber: string;
  gstNumber: string;
  city: string;
  bankAccountName: string;
  bankAccountNumber: string;
  bankIfsc: string;
};

export function KycForm({ defaultValues }: { defaultValues: KycFormDefaults }) {
  const [state, action, pending] = useActionState(submitKycAction, initial);

  return (
    <form action={action} className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="firmName" className="label">
            Firm / business name (optional)
          </label>
          <input id="firmName" name="firmName" type="text" defaultValue={defaultValues.firmName} className="field" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="city" className="label">
            City
          </label>
          <input id="city" name="city" type="text" required defaultValue={defaultValues.city} className="field" />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="panNumber" className="label">
            PAN (optional)
          </label>
          <input id="panNumber" name="panNumber" type="text" defaultValue={defaultValues.panNumber} placeholder="ABCDE1234F" className="field" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="gstNumber" className="label">
            GST number (optional)
          </label>
          <input id="gstNumber" name="gstNumber" type="text" defaultValue={defaultValues.gstNumber} className="field" />
        </div>
      </div>

      <div className="border-line border-t pt-4">
        <p className="text-ink-900 text-sm font-semibold">Bank details for payouts</p>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="bankAccountName" className="label">
              Account holder name
            </label>
            <input id="bankAccountName" name="bankAccountName" type="text" defaultValue={defaultValues.bankAccountName} className="field" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="bankAccountNumber" className="label">
              Account number
            </label>
            <input id="bankAccountNumber" name="bankAccountNumber" type="text" defaultValue={defaultValues.bankAccountNumber} className="field" />
          </div>
        </div>
        <div className="mt-4 flex flex-col gap-1.5 sm:w-1/2 sm:pr-2">
          <label htmlFor="bankIfsc" className="label">
            IFSC code
          </label>
          <input id="bankIfsc" name="bankIfsc" type="text" defaultValue={defaultValues.bankIfsc} placeholder="HDFC0001234" className="field" />
        </div>
      </div>

      {!state.ok && state.message ? <p className="error">{state.message}</p> : null}
      {state.ok && state.message ? <p className="text-verdant-700 text-sm">{state.message}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="bg-ink-900 hover:bg-ink-800 mt-1 h-12 px-5 text-sm font-semibold text-white transition disabled:opacity-60 sm:w-fit"
      >
        {pending ? "Submitting..." : "Submit for review"}
      </button>
    </form>
  );
}
