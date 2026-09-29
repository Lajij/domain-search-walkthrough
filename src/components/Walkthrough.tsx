"use client";

import { useCallback, useMemo, useState, type ReactNode } from "react";

type StageId = 0 | 1 | 2 | 3;

type DomainRow = {
  domain: string;
  available: boolean;
  purchase: string | null;
  renewal: string | null;
};

const STAGES = [
  {
    id: 0 as StageId,
    label: "Auth wall",
    headline: "Signup just to ask if a name is free",
    issue:
      "Internal AI ops wants a hostname for codename HELIX. The agent stalls on a sign-in / API-key wall before it can even check availability.",
  },
  {
    id: 1 as StageId,
    label: "Public search",
    headline: "Keyword search. No token. Table of prices.",
    issue:
      "vercel domains search — public discovery. Availability plus registration and renewal prices, without signing in.",
  },
  {
    id: 2 as StageId,
    label: "Agent batch",
    headline: "Ten candidates. One POST. Shortlist.",
    issue:
      "The naming loop becomes a tool call: batch up to 200 exact names, get availability and prices back in one request.",
  },
  {
    id: 3 as StageId,
    label: "Ready to buy",
    headline: "Discovery open. Purchase intentional.",
    issue:
      "Shortlist is ready with prices. Buying and managing still require auth — the right gate, at the right time.",
  },
] as const;

const KEYWORD_RESULTS: DomainRow[] = [
  {
    domain: "helixops.com",
    available: true,
    purchase: "$11.20",
    renewal: "$14.00",
  },
  {
    domain: "helixops.dev",
    available: true,
    purchase: "$16.00",
    renewal: "$16.00",
  },
  {
    domain: "helixops.app",
    available: false,
    purchase: null,
    renewal: null,
  },
  {
    domain: "gethelixops.com",
    available: true,
    purchase: "$11.20",
    renewal: "$14.00",
  },
  {
    domain: "helix-ops.io",
    available: true,
    purchase: "$34.00",
    renewal: "$34.00",
  },
];

const BATCH_CANDIDATES = [
  "helixops.com",
  "helixops.dev",
  "helixops.app",
  "helixconsole.com",
  "helixconsole.dev",
  "runhelix.com",
  "runhelix.dev",
  "helixaiops.com",
  "opshelix.com",
  "helixdesk.app",
] as const;

const BATCH_RESULTS: DomainRow[] = [
  {
    domain: "helixops.com",
    available: true,
    purchase: "$11.20",
    renewal: "$14.00",
  },
  {
    domain: "helixops.dev",
    available: true,
    purchase: "$16.00",
    renewal: "$16.00",
  },
  {
    domain: "helixops.app",
    available: false,
    purchase: null,
    renewal: null,
  },
  {
    domain: "helixconsole.com",
    available: true,
    purchase: "$11.20",
    renewal: "$14.00",
  },
  {
    domain: "helixconsole.dev",
    available: true,
    purchase: "$16.00",
    renewal: "$16.00",
  },
  {
    domain: "runhelix.com",
    available: false,
    purchase: null,
    renewal: null,
  },
  {
    domain: "runhelix.dev",
    available: true,
    purchase: "$16.00",
    renewal: "$16.00",
  },
  {
    domain: "helixaiops.com",
    available: true,
    purchase: "$11.20",
    renewal: "$14.00",
  },
  {
    domain: "opshelix.com",
    available: false,
    purchase: null,
    renewal: null,
  },
  {
    domain: "helixdesk.app",
    available: true,
    purchase: "$14.00",
    renewal: "$14.00",
  },
];

const SHORTLIST = BATCH_RESULTS.filter((r) => r.available).slice(0, 4);

function VercelMark({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 76 65"
      fill="currentColor"
      aria-hidden
    >
      <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" />
    </svg>
  );
}

function Panel({
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

function DomainTable({ rows }: { rows: DomainRow[] }) {
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
            <tr
              key={row.domain}
              className="border-b border-border/60 last:border-0"
            >
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
              <td className="px-3 py-2.5 text-foreground/90">
                {row.purchase ?? "—"}
              </td>
              <td className="px-3 py-2.5 text-foreground/90">
                {row.renewal ?? "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StageAuthWall({
  phase,
  onAttempt,
}: {
  phase: "idle" | "blocked";
  onAttempt: () => void;
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Panel title="helix-ops · naming agent" badge="blocked">
        <div className="space-y-4">
          <div className="rounded-lg border border-border bg-black/40 p-4 font-mono text-xs leading-relaxed text-muted">
            <p className="text-foreground/80">
              <span className="text-muted">$</span> agent propose-hostname
              --project helix-ops
            </p>
            <p className="mt-2">→ need domain for internal AI ops console</p>
            <p>→ checking registrar…</p>
            {phase === "blocked" ? (
              <p className="mt-2 text-danger">
                ✗ 401 Unauthorized — sign in or provide an access token
              </p>
            ) : (
              <p className="mt-2 animate-pulse">⋯ waiting for credentials</p>
            )}
          </div>
          <div className="rounded-lg border border-dashed border-border bg-black/20 p-4">
            <p className="text-sm font-medium text-foreground">
              Sign-in / API key wall
            </p>
            <p className="mt-1 text-sm text-muted">
              The agent cannot discover whether{" "}
              <span className="font-mono text-foreground/80">helixops.dev</span>{" "}
              is even possible. Discovery is gated like purchase.
            </p>
            <div className="mt-4 space-y-2">
              <div className="h-9 rounded-md border border-border bg-black/40 px-3 font-mono text-xs leading-9 text-muted">
                email@company.com
              </div>
              <div className="h-9 rounded-md border border-border bg-black/40 px-3 font-mono text-xs leading-9 text-muted">
                ••••••••••••
              </div>
              <button
                type="button"
                disabled
                className="w-full cursor-not-allowed rounded-md border border-border bg-white/5 py-2 text-sm text-muted"
              >
                Continue with API key
              </button>
            </div>
          </div>
        </div>
      </Panel>
      <div className="flex flex-col justify-between gap-4 rounded-xl border border-border bg-card p-5">
        <div className="space-y-3">
          <p className="text-sm text-muted">What just happened</p>
          <ol className="space-y-3 text-sm leading-relaxed">
            <li className="text-foreground">
              1. HELIX ops agent needs a public hostname for the console
            </li>
            <li
              className={
                phase === "blocked" ? "text-foreground" : "text-muted"
              }
            >
              2. First tool call hits a registrar that demands auth
            </li>
            <li
              className={phase === "blocked" ? "text-danger" : "text-muted"}
            >
              3. Naming loop stops — humans must mint a token for a lookup
            </li>
          </ol>
          {phase === "blocked" ? (
            <div className="mt-4 rounded-lg border border-danger/30 bg-danger/5 px-4 py-3 text-sm">
              <p className="font-medium text-danger">The issue</p>
              <p className="mt-1 text-muted">
                Agents should not need a signup wall just to ask if a name is
                available. Discovery is a read. Purchase is a write.
              </p>
            </div>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-2">
          {phase === "idle" ? (
            <button
              type="button"
              onClick={onAttempt}
              className="rounded-full bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-white/90"
            >
              Try domain lookup
            </button>
          ) : (
            <p className="text-sm text-muted">
              Ready for the fix — advance to Public search.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function StagePublicSearch({
  phase,
  onRun,
}: {
  phase: "idle" | "running" | "done";
  onRun: () => void;
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Panel title="Vercel CLI · public" badge="no auth">
        <div className="space-y-4">
          <div className="rounded-lg border border-border bg-black/50 p-4 font-mono text-xs leading-relaxed">
            <p>
              <span className="text-muted">$</span>{" "}
              <span className="text-foreground">
                vercel domains search helixops --limit 5
              </span>
            </p>
            {phase === "idle" ? (
              <p className="mt-3 text-muted">
                Press run — no token, no sign-in.
              </p>
            ) : null}
            {phase === "running" ? (
              <p className="mt-3 animate-pulse text-muted">Searching…</p>
            ) : null}
            {phase === "done" ? (
              <p className="mt-3 text-success">✓ 5 results · prices included</p>
            ) : null}
          </div>
          {phase === "done" ? <DomainTable rows={KEYWORD_RESULTS} /> : null}
        </div>
      </Panel>
      <div className="flex flex-col justify-between gap-4 rounded-xl border border-border bg-card p-5">
        <div className="space-y-3">
          <p className="text-sm text-muted">What just happened</p>
          <ol className="space-y-3 text-sm leading-relaxed">
            <li className="text-foreground">
              1. Keyword / fragment search from the CLI
            </li>
            <li
              className={
                phase !== "idle" ? "text-foreground" : "text-muted"
              }
            >
              2. No access token required for discovery
            </li>
            <li
              className={phase === "done" ? "text-success" : "text-muted"}
            >
              3. Availability + purchase + renewal in one table
            </li>
          </ol>
          {phase === "done" ? (
            <div className="mt-4 rounded-lg border border-success/30 bg-success/5 px-4 py-3 text-sm">
              <p className="font-medium text-success">Public discovery</p>
              <p className="mt-1 text-muted">
                Same path the Domains Registrar API exposes — check names and
                pricing without signing in to Vercel.
              </p>
            </div>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-2">
          {phase === "idle" ? (
            <button
              type="button"
              onClick={onRun}
              className="rounded-full bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-white/90"
            >
              Run public search
            </button>
          ) : phase === "running" ? (
            <p className="text-sm text-muted">Searching publicly…</p>
          ) : (
            <p className="text-sm text-muted">
              Advance for the agent naming loop.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function StageAgentBatch({
  phase,
  onBatch,
}: {
  phase: "idle" | "posting" | "done";
  onBatch: () => void;
}) {
  const jsonPreview = useMemo(() => {
    const sample = [...BATCH_CANDIDATES.slice(0, 4), "/* … up to 200 */"];
    return JSON.stringify({ domains: sample }, null, 2).replace(
      '"/* … up to 200 */"',
      "/* … up to 200 */",
    );
  }, []);

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_1.1fr]">
      <Panel title="Agent naming loop · HELIX" badge="batch API">
        <div className="space-y-4">
          <div className="rounded-lg border border-border bg-black/50 p-4 font-mono text-[11px] leading-relaxed sm:text-xs">
            <p className="text-muted">
              POST https://api.vercel.com/v1/registrar/domains/search
            </p>
            <p className="mt-1 text-muted">Content-Type: application/json</p>
            <pre className="mt-3 overflow-x-auto text-foreground/90">
              {jsonPreview}
            </pre>
            {phase === "posting" ? (
              <p className="mt-3 animate-pulse text-muted">
                Checking {BATCH_CANDIDATES.length} candidates…
              </p>
            ) : null}
            {phase === "done" ? (
              <p className="mt-3 text-success">
                ✓ One request · {BATCH_CANDIDATES.length} names · shortlist
                ready
              </p>
            ) : null}
          </div>
          <div>
            <p className="mb-2 text-xs uppercase tracking-wider text-muted">
              Candidates
            </p>
            <ul className="flex flex-wrap gap-1.5 font-mono text-[11px]">
              {BATCH_CANDIDATES.map((d) => (
                <li
                  key={d}
                  className="rounded border border-border bg-black/40 px-2 py-1 text-foreground/80"
                >
                  {d}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Panel>
      <div className="flex flex-col gap-4">
        {phase === "done" ? (
          <Panel title="Batch response" badge="simulated">
            <DomainTable rows={BATCH_RESULTS} />
          </Panel>
        ) : (
          <div className="flex min-h-[220px] flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card p-6 text-center">
            <p className="font-mono text-sm text-muted">
              {phase === "posting"
                ? "Awaiting batch response…"
                : "Results appear after one public POST"}
            </p>
          </div>
        )}
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-sm text-muted">Value</p>
          <p className="mt-2 text-sm leading-relaxed text-foreground/90">
            Agent-first onboarding: the naming loop is a tool call, not a
            credentials workflow. Propose 8–12 names, check the batch, keep
            the available ones with prices.
          </p>
          <div className="mt-4">
            {phase === "idle" ? (
              <button
                type="button"
                onClick={onBatch}
                className="rounded-full bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-white/90"
              >
                Run batch check
              </button>
            ) : phase === "posting" ? (
              <p className="text-sm text-muted">Posting batch…</p>
            ) : (
              <p className="text-sm text-muted">
                Advance to see the shortlist ready for purchase.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StageReadyToBuy() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Panel title="HELIX shortlist" badge="ready">
        <div className="space-y-4">
          <DomainTable rows={SHORTLIST} />
          <p className="text-sm text-muted">
            Illustrative prices for the walkthrough — discovery path matches
            the public CLI and Registrar API.
          </p>
        </div>
      </Panel>
      <div className="flex flex-col justify-between gap-4 rounded-xl border border-border bg-card p-5">
        <div className="space-y-4">
          <p className="text-sm text-muted">The split that matters</p>
          <div className="space-y-3">
            <div className="rounded-lg border border-success/30 bg-success/5 px-4 py-3">
              <p className="text-sm font-medium text-success">
                Discovery — open
              </p>
              <p className="mt-1 text-sm text-muted">
                Keyword CLI and batch API. No token. Agents and humans can
                ask freely.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-black/30 px-4 py-3">
              <p className="text-sm font-medium text-foreground">
                Purchase — authenticated
              </p>
              <p className="mt-1 text-sm text-muted">
                Buy and manage still require sign-in. Intentional when money
                and ownership move.
              </p>
            </div>
          </div>
          <p className="text-sm leading-relaxed text-foreground/90">
            HELIX ops has a priced shortlist. A human (or an authorized agent)
            completes the buy when ready — discovery never blocked the loop.
          </p>
        </div>
        <p className="font-mono text-xs text-muted">
          Changelog · Search domains without authentication
        </p>
      </div>
    </div>
  );
}

export function Walkthrough() {
  const [stage, setStage] = useState<StageId>(0);
  const [authPhase, setAuthPhase] = useState<"idle" | "blocked">("idle");
  const [searchPhase, setSearchPhase] = useState<"idle" | "running" | "done">(
    "idle",
  );
  const [batchPhase, setBatchPhase] = useState<"idle" | "posting" | "done">(
    "idle",
  );

  const current = STAGES[stage];

  const go = useCallback((id: StageId) => {
    setStage(id);
  }, []);

  const next = useCallback(() => {
    setStage((s) => (s < 3 ? ((s + 1) as StageId) : s));
  }, []);

  const prev = useCallback(() => {
    setStage((s) => (s > 0 ? ((s - 1) as StageId) : s));
  }, []);

  const runSearch = useCallback(() => {
    setSearchPhase("running");
    window.setTimeout(() => setSearchPhase("done"), 900);
  }, []);

  const runBatch = useCallback(() => {
    setBatchPhase("posting");
    window.setTimeout(() => setBatchPhase("done"), 1100);
  }, []);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6 sm:py-12">
      <header className="flex flex-col gap-6 border-b border-border pb-8">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <VercelMark className="h-4 w-4" />
            <span className="text-sm font-medium tracking-tight">Vercel</span>
            <span className="text-muted">/</span>
            <span className="text-sm text-muted">Domain search</span>
          </div>
          <span className="rounded-full border border-border px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-muted">
            Interactive walkthrough
          </span>
        </div>
        <div className="max-w-2xl space-y-3">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Search domains without authentication
          </h1>
          <p className="text-sm leading-relaxed text-muted sm:text-base">
            Scenario: internal AI ops console, codename{" "}
            <span className="font-mono text-foreground/80">HELIX</span>. Agents
            need names — not signup walls. Public discovery first; purchase
            stays intentional.
          </p>
        </div>
      </header>

      <nav aria-label="Stages" className="flex flex-wrap gap-2">
        {STAGES.map((s) => {
          const active = s.id === stage;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => go(s.id)}
              className={`rounded-full border px-3 py-1.5 text-xs transition sm:text-sm ${
                active
                  ? "border-white bg-white text-black"
                  : "border-border text-muted hover:border-foreground/30 hover:text-foreground"
              }`}
            >
              <span className="font-mono text-[10px] opacity-70">
                {s.id + 1}
              </span>{" "}
              {s.label}
            </button>
          );
        })}
      </nav>

      <section className="space-y-2">
        <p className="font-mono text-xs uppercase tracking-wider text-muted">
          Stage {stage + 1}
        </p>
        <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
          {current.headline}
        </h2>
        <p className="max-w-2xl text-sm leading-relaxed text-muted">
          {current.issue}
        </p>
      </section>

      <section>
        {stage === 0 ? (
          <StageAuthWall
            phase={authPhase}
            onAttempt={() => setAuthPhase("blocked")}
          />
        ) : null}
        {stage === 1 ? (
          <StagePublicSearch phase={searchPhase} onRun={runSearch} />
        ) : null}
        {stage === 2 ? (
          <StageAgentBatch phase={batchPhase} onBatch={runBatch} />
        ) : null}
        {stage === 3 ? <StageReadyToBuy /> : null}
      </section>

      <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-6">
        <button
          type="button"
          onClick={prev}
          disabled={stage === 0}
          className="rounded-full border border-border px-4 py-2 text-sm text-muted transition enabled:hover:border-foreground/40 enabled:hover:text-foreground disabled:opacity-30"
        >
          ← Previous
        </button>
        <p className="font-mono text-[11px] text-muted">
          Client-side simulation · CLI & API paths match changelog
        </p>
        <button
          type="button"
          onClick={next}
          disabled={stage === 3}
          className="rounded-full bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-white/90 disabled:opacity-30"
        >
          Next stage →
        </button>
      </footer>
    </div>
  );
}
