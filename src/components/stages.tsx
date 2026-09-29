import { useMemo } from "react";
import {
  BATCH_CANDIDATES,
  BATCH_RESULTS,
  KEYWORD_RESULTS,
  SHORTLIST,
} from "./data";
import { DomainTable, Panel } from "./ui";

export function StageAuthWall({
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
              <span className="text-muted">$</span> agent propose-hostname --project helix-ops
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
            <p className="text-sm font-medium text-foreground">Sign-in / API key wall</p>
            <p className="mt-1 text-sm text-muted">
              The agent cannot discover whether{" "}
              <span className="font-mono text-foreground/80">helixops.dev</span> is even
              possible. Discovery is gated like purchase.
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
            <li className={phase === "blocked" ? "text-foreground" : "text-muted"}>
              2. First tool call hits a registrar that demands auth
            </li>
            <li className={phase === "blocked" ? "text-danger" : "text-muted"}>
              3. Naming loop stops — humans must mint a token for a lookup
            </li>
          </ol>
          {phase === "blocked" ? (
            <div className="mt-4 rounded-lg border border-danger/30 bg-danger/5 px-4 py-3 text-sm">
              <p className="font-medium text-danger">The issue</p>
              <p className="mt-1 text-muted">
                Agents should not need a signup wall just to ask if a name is available.
                Discovery is a read. Purchase is a write.
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
            <p className="text-sm text-muted">Ready for the fix — advance to Public search.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export function StagePublicSearch({
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
              <span className="text-foreground">vercel domains search helixops --limit 5</span>
            </p>
            {phase === "idle" ? (
              <p className="mt-3 text-muted">Press run — no token, no sign-in.</p>
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
            <li className="text-foreground">1. Keyword / fragment search from the CLI</li>
            <li className={phase !== "idle" ? "text-foreground" : "text-muted"}>
              2. No access token required for discovery
            </li>
            <li className={phase === "done" ? "text-success" : "text-muted"}>
              3. Availability + purchase + renewal in one table
            </li>
          </ol>
          {phase === "done" ? (
            <div className="mt-4 rounded-lg border border-success/30 bg-success/5 px-4 py-3 text-sm">
              <p className="font-medium text-success">Public discovery</p>
              <p className="mt-1 text-muted">
                Same path the Domains Registrar API exposes — check names and pricing
                without signing in to Vercel.
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
            <p className="text-sm text-muted">Advance for the agent naming loop.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export function StageAgentBatch({
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
            <pre className="mt-3 overflow-x-auto text-foreground/90">{jsonPreview}</pre>
            {phase === "posting" ? (
              <p className="mt-3 animate-pulse text-muted">
                Checking {BATCH_CANDIDATES.length} candidates…
              </p>
            ) : null}
            {phase === "done" ? (
              <p className="mt-3 text-success">
                ✓ One request · {BATCH_CANDIDATES.length} names · shortlist ready
              </p>
            ) : null}
          </div>
          <div>
            <p className="mb-2 text-xs uppercase tracking-wider text-muted">Candidates</p>
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
            Agent-first onboarding: the naming loop is a tool call, not a credentials
            workflow. Propose 8–12 names, check the batch, keep the available ones with
            prices.
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

export function StageReadyToBuy() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Panel title="HELIX shortlist" badge="ready">
        <div className="space-y-4">
          <DomainTable rows={SHORTLIST} />
          <p className="text-sm text-muted">
            Illustrative prices for the walkthrough — discovery path matches the public
            CLI and Registrar API.
          </p>
        </div>
      </Panel>
      <div className="flex flex-col justify-between gap-4 rounded-xl border border-border bg-card p-5">
        <div className="space-y-4">
          <p className="text-sm text-muted">The split that matters</p>
          <div className="space-y-3">
            <div className="rounded-lg border border-success/30 bg-success/5 px-4 py-3">
              <p className="text-sm font-medium text-success">Discovery — open</p>
              <p className="mt-1 text-sm text-muted">
                Keyword CLI and batch API. No token. Agents and humans can ask freely.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-black/30 px-4 py-3">
              <p className="text-sm font-medium text-foreground">Purchase — authenticated</p>
              <p className="mt-1 text-sm text-muted">
                Buy and manage still require sign-in. Intentional when money and ownership
                move.
              </p>
            </div>
          </div>
          <p className="text-sm leading-relaxed text-foreground/90">
            HELIX ops has a priced shortlist. A human (or an authorized agent) completes
            the buy when ready — discovery never blocked the loop.
          </p>
        </div>
        <p className="font-mono text-xs text-muted">
          Changelog · Search domains without authentication
        </p>
      </div>
    </div>
  );
}
