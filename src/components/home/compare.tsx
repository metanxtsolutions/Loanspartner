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
  const labels = ["No", "Sometimes", "Yes"] as const;
  const styles = ["bg-sand text-mute", "bg-brass-100 text-brass-600", "bg-brass-100 text-brass-600"] as const;
  const Icon = [X, Minus, Check][v];
  return (
    <span className={`inline-flex size-7 items-center justify-center ${styles[v]}`}>
      <Icon className="size-4" strokeWidth={3} aria-hidden />
      <span className="sr-only">{labels[v]}</span>
    </span>
  );
}

export function CompareTable() {
  return (
    <div className="rounded-card border-line shadow-soft overflow-x-auto border bg-white" data-reveal>
      <table className="w-full min-w-[640px] text-sm">
        <caption className="sr-only">What a bank branch, an aggregator portal and LoansPartner each give you</caption>
        <thead>
          <tr className="border-line border-b text-left">
            <th scope="col" className="text-mute px-5 py-4 font-bold">
              What you get
            </th>
            <th scope="col" className="text-ink-800 px-5 py-4 text-center font-bold">
              Your bank branch
            </th>
            <th scope="col" className="text-ink-800 px-5 py-4 text-center font-bold">
              Aggregator portal
            </th>
            <th scope="col" className="bg-ink-900 px-5 py-4 text-center font-bold text-white">
              LoansPartner
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={r.label} className={i < rows.length - 1 ? "border-line border-b" : ""}>
              <th scope="row" className="text-ink-900 px-5 py-3.5 text-left font-semibold">
                {r.label}
              </th>
              <td className="px-5 py-3.5 text-center">
                <Mark v={r.branch} />
              </td>
              <td className="px-5 py-3.5 text-center">
                <Mark v={r.portal} />
              </td>
              <td className="bg-ink-50 px-5 py-3.5 text-center">
                <Mark v={r.us} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-mute px-5 py-3 text-xs">
        Free in every column: a branch and a portal cost nothing either. The difference is what you get for it.
      </p>
    </div>
  );
}
