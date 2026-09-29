"use client";

import { useCallback, useState } from "react";
import { STAGES } from "./data";
import {
  StageAgentBatch,
  StageAuthWall,
  StagePublicSearch,
  StageReadyToBuy,
} from "./stages";
import { VercelMark } from "./ui";

type StageId = 0 | 1 | 2 | 3;

export function Walkthrough() {
  const [stage, setStage] = useState<StageId>(0);
  const [authPhase, setAuthPhase] = useState<"idle" | "blocked">("idle");
  const [searchPhase, setSearchPhase] = useState<"idle" | "running" | "done">("idle");
  const [batchPhase, setBatchPhase] = useState<"idle" | "posting" | "done">("idle");

  const current = STAGES[stage];

  const go = useCallback((id: StageId) => setStage(id), []);
  const next = useCallback(
    () => setStage((s) => (s < 3 ? ((s + 1) as StageId) : s)),
    [],
  );
  const prev = useCallback(
    () => setStage((s) => (s > 0 ? ((s - 1) as StageId) : s)),
    [],
  );
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
            <span className="font-mono text-foreground/80">HELIX</span>. Agents need
            names — not signup walls. Public discovery first; purchase stays intentional.
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
              onClick={() => go(s.id as StageId)}
              className={`rounded-full border px-3 py-1.5 text-xs transition sm:text-sm ${
                active
                  ? "border-white bg-white text-black"
                  : "border-border text-muted hover:border-foreground/30 hover:text-foreground"
              }`}
            >
              <span className="font-mono text-[10px] opacity-70">{s.id + 1}</span>{" "}
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
        <p className="max-w-2xl text-sm leading-relaxed text-muted">{current.issue}</p>
      </section>

      <section>
        {stage === 0 ? (
          <StageAuthWall phase={authPhase} onAttempt={() => setAuthPhase("blocked")} />
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
