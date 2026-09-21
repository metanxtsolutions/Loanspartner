"use client";

import { useActionState, useRef } from "react";
import { DOCUMENT_TYPE_LABELS } from "@/lib/dashboard/statuses";

export type UploadState = { ok: boolean; message?: string };

const DOCUMENT_TYPES = Object.keys(DOCUMENT_TYPE_LABELS);

export function FileUploader({
  action,
  applicationId,
  documentTypes = DOCUMENT_TYPES,
}: {
  action: (state: UploadState, formData: FormData) => Promise<UploadState>;
  applicationId?: string;
  documentTypes?: string[];
}) {
  const [state, formAction, pending] = useActionState(action, { ok: true });
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={async (formData) => {
        await formAction(formData);
        formRef.current?.reset();
      }}
      className="border-line-strong/40 bg-cream flex flex-col gap-3 border border-dashed p-4"
    >
      {applicationId ? <input type="hidden" name="applicationId" value={applicationId} /> : null}
      <div className="flex flex-col gap-1.5 sm:flex-row sm:items-end sm:gap-3">
        <div className="flex flex-1 flex-col gap-1.5">
          <label htmlFor="doc-type" className="label">
            Document type
          </label>
          <select id="doc-type" name="type" required className="field" defaultValue="">
            <option value="" disabled>
              Select a document type
            </option>
            {documentTypes.map((t) => (
              <option key={t} value={t}>
                {DOCUMENT_TYPE_LABELS[t] ?? t}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-1 flex-col gap-1.5">
          <label htmlFor="doc-file" className="label">
            File
          </label>
          <input id="doc-file" name="file" type="file" required accept=".pdf,.jpg,.jpeg,.png,.webp" className="field" />
        </div>
        <button type="submit" disabled={pending} className="bg-ink-900 hover:bg-ink-800 h-12 px-5 text-sm font-semibold text-white transition disabled:opacity-60">
          {pending ? "Uploading..." : "Upload"}
        </button>
      </div>
      <p className="hint">PDF, JPG, PNG or WEBP, up to 8 MB.</p>
      {!state.ok && state.message ? <p className="error">{state.message}</p> : null}
      {state.ok && state.message ? <p className="text-verdant-700 text-xs">{state.message}</p> : null}
    </form>
  );
}
