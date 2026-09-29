import type { ReactNode } from "react";
import type { DomainRow } from "./data";

export function VercelMark({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 76 65" fill="currentColor" aria-hidden>
      <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" />
    </svg>
  );
}

export function Panel({
  title,
  badge,
  children,
}: {
  title: string;
  badge?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <span className="text-sm font-medium">{title}</span>
        {badge ? (
          <span className="rounded-full border border-border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide text-muted">
            {badge}
          </span>
        ) : null}
      </div>
      <div className="flex-1 p-4">{children}</div>
    </div>
  );
}

export function DomainTable({ rows }: { rows: DomainRow[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full min-w-[480px] text-left text-sm">
        <thead className="border-b border-border bg-black/50 font-mono text-[11px] uppercase tracking-wider text-muted">
          <tr>
            <th className="px-3 py-2 font-medium">Domain</th>
            <th className="px-3 py-2 font-medium">Availability</th>
            <th className="px-3 py-2 font-medium">Purchase</th>
            <th className="px-3 py-2 font-medium">Renewal</th>
          </tr>
        </thead>
        <tbody className="font-mono text-xs sm:text-sm">
          {rows.map((row) => (
            <tr key={row.domain} className="border-b border-border/60 last:border-0">
              <td className="px-3 py-2.5 text-foreground">{row.domain}</td>
              <td className="px-3 py-2.5">
                {row.available ? (
                  <span className="inline-flex items-center gap-1.5 text-success">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-success" />
                    Available
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-muted">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-muted" />
                    Taken
                  </span>
                )}
              </td>
              <td className="px-3 py-2.5 text-foreground/90">{row.purchase ?? "—"}</td>
              <td className="px-3 py-2.5 text-foreground/90">{row.renewal ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
