export type DomainRow = {
  domain: string;
  available: boolean;
  purchase: string | null;
  renewal: string | null;
};

export const STAGES = [
  {
    id: 0 as 0,
    label: "Auth wall",
    headline: "Signup just to ask if a name is free",
    issue:
      "Internal AI ops wants a hostname for codename HELIX. The agent stalls on a sign-in / API-key wall before it can even check availability.",
  },
  {
    id: 1 as 1,
    label: "Public search",
    headline: "Keyword search. No token. Table of prices.",
    issue:
      "vercel domains search — public discovery. Availability plus registration and renewal prices, without signing in.",
  },
  {
    id: 2 as 2,
    label: "Agent batch",
    headline: "Ten candidates. One POST. Shortlist.",
    issue:
      "The naming loop becomes a tool call: batch up to 200 exact names, get availability and prices back in one request.",
  },
  {
    id: 3 as 3,
    label: "Ready to buy",
    headline: "Discovery open. Purchase intentional.",
    issue:
      "Shortlist is ready with prices. Buying and managing still require auth — the right gate, at the right time.",
  },
] as const;

export const KEYWORD_RESULTS: DomainRow[] = [
  { domain: "helixops.com", available: true, purchase: "$11.20", renewal: "$14.00" },
  { domain: "helixops.dev", available: true, purchase: "$16.00", renewal: "$16.00" },
  { domain: "helixops.app", available: false, purchase: null, renewal: null },
  { domain: "gethelixops.com", available: true, purchase: "$11.20", renewal: "$14.00" },
  { domain: "helix-ops.io", available: true, purchase: "$34.00", renewal: "$34.00" },
];

export const BATCH_CANDIDATES = [
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

export const BATCH_RESULTS: DomainRow[] = [
  { domain: "helixops.com", available: true, purchase: "$11.20", renewal: "$14.00" },
  { domain: "helixops.dev", available: true, purchase: "$16.00", renewal: "$16.00" },
  { domain: "helixops.app", available: false, purchase: null, renewal: null },
  { domain: "helixconsole.com", available: true, purchase: "$11.20", renewal: "$14.00" },
  { domain: "helixconsole.dev", available: true, purchase: "$16.00", renewal: "$16.00" },
  { domain: "runhelix.com", available: false, purchase: null, renewal: null },
  { domain: "runhelix.dev", available: true, purchase: "$16.00", renewal: "$16.00" },
  { domain: "helixaiops.com", available: true, purchase: "$11.20", renewal: "$14.00" },
  { domain: "opshelix.com", available: false, purchase: null, renewal: null },
  { domain: "helixdesk.app", available: true, purchase: "$14.00", renewal: "$14.00" },
];

export const SHORTLIST = BATCH_RESULTS.filter((r) => r.available).slice(0, 4);
