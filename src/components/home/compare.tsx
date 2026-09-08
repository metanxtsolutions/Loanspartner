import { Check, Minus, X } from "lucide-react";

const rows: { label: string; branch: 0 | 1 | 2; portal: 0 | 1 | 2; us: 0 | 1 | 2 }[] = [
  { label: "Lenders you can reach with one application", branch: 0, portal: 2, us: 2 },
  { label: "A person who reads your profile before submitting", branch: 1, portal: 0, us: 2 },
  { label: "No hard credit enquiry until you choose a lender", branch: 0, portal: 0, us: 2 },
  { label: "Documentation, legal and valuation handled for you", branch: 1, portal: 0, us: 2 },
  { label: "Honest advice when a cheaper product exists", branch: 0, portal: 0, us: 2 },
  { label: "Someone to call after disbursal", branch: 1, portal: 0, us: 2 },
  { label: "Cost to you", branch: 2, portal: 2, us: 2 },
];

function Mark({ v }: { v: 0 | 1 | 2 }) {
  if (v === 2) return <span className="inline-flex size-7 items-center justify-center rounded-full bg-verdant-100 text-verdant-700"><Check className="size-4" strokeWidth={3} /></span>;
  if (v === 1) return <span className="inline-flex size-7 items-center justify-center rounded-full bg-brass-100 text-brass-600"><Minus className="size-4" strokeWidth={3} /></span>;
  return <span className="inline-flex size-7 items-center justify-center rounded-full bg-sand text-mute"><X className="size-4" strokeWidth={3} /></span>;
}

export function CompareTable() {
  return (
    <div className="overflow-x-auto rounded-card border border-line bg-white shadow-soft" data-reveal>
      <table className="w-full min-w-[640px] text-sm">
        <thead>
          <tr className="border-b border-line text-left">
            <th className="px-5 py-4 font-bold text-mute">What you get</th>
            <th className="px-5 py-4 text-center font-bold text-ink-800">Your bank branch</th>
            <th className="px-5 py-4 text-center font-bold text-ink-800">Aggregator portal</th>
            <th className="rounded-t-xl bg-ink-900 px-5 py-4 text-center font-bold text-white">LoansPartner</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={r.label} className={i < rows.length - 1 ? "border-b border-line" : ""}>
              <td className="px-5 py-3.5 font-semibold text-ink-900">{r.label}</td>
              <td className="px-5 py-3.5 text-center"><Mark v={r.branch} /></td>
              <td className="px-5 py-3.5 text-center"><Mark v={r.portal} /></td>
              <td className="bg-ink-50 px-5 py-3.5 text-center"><Mark v={r.us} /></td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="px-5 py-3 text-xs text-mute">Free in every column: a branch and a portal cost nothing either. The difference is what you get for it.</p>
    </div>
  );
}
