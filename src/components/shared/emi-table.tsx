import type { LoanProduct } from "@/data/products";
import { calcEMI, formatINR } from "@/lib/utils";

/** Indicative EMI grid for a product, computed from its published rate range. */
export function EmiTable({ product, amounts }: { product: LoanProduct; amounts?: number[] }) {
  const rate = product.rate.from;
  const tenures = pickTenures(product);
  const rows = amounts ?? defaultAmounts(product);
  return (
    <div className="overflow-x-auto rounded-card border border-line bg-white">
      <table className="w-full text-sm">
        <caption className="px-4 py-3 text-left text-xs text-mute">Indicative EMIs at {rate.toFixed(2)}% p.a., the lowest rate in this product&rsquo;s range. Your rate depends on lender and profile.</caption>
        <thead className="bg-cream text-left text-xs uppercase tracking-wide text-mute">
          <tr>
            <th className="px-4 py-3 font-bold">Loan amount</th>
            {tenures.map((t) => (<th key={t} className="px-4 py-3 font-bold">{t >= 12 ? `${t / 12} yr` : `${t} mo`}</th>))}
          </tr>
        </thead>
        <tbody className="tnum">
          {rows.map((a) => (
            <tr key={a} className="border-t border-line">
              <td className="px-4 py-3 font-bold text-ink-900">₹{formatINR(a)}</td>
              {tenures.map((t) => (<td key={t} className="px-4 py-3 text-ink-800">₹{formatINR(Math.round(calcEMI(a, rate, t)))}</td>))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function pickTenures(p: LoanProduct) {
  const max = p.tenure.maxMonths;
  if (max >= 240) return [120, 180, 240, Math.min(max, 300)];
  if (max >= 84) return [24, 36, 60, 84];
  if (max >= 60) return [12, 24, 36, 60];
  return [6, 12, 24, Math.min(max, 36)];
}

function defaultAmounts(p: LoanProduct) {
  const lo = p.amount.min;
  const hi = p.amount.max;
  const mids = [lo * 2, lo * 5, lo * 10, lo * 20, lo * 50].filter((v) => v <= hi);
  const picked = [...new Set([lo, ...mids])].slice(0, 5);
  return picked.length >= 3 ? picked : [lo, Math.round((lo + hi) / 2), hi];
}
