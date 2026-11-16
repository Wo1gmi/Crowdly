# Crowdly acceleration log

Baseline: GitHub `Wo1gmi/Crowdly`, commit `ec9cc3f23eab19332cd92fd12538c13253c37a3a`; source deck `Crowdly_06.10_final.pptx`, all 10 slides inspected. Date: 2026-11-16.

## Acceptance criteria

- A first-time visitor understands the purpose on a separate landing page, with a large working CTA in its middle.
- A customer can model their own business without competitor footfall, population cohorts, API keys, accounts, or a sales call.
- Main flows are available in Russian and English; all calculations are in Russian rubles. Currency selection is removed by the owner’s clarification. Original Russia/UAE market hypotheses remain separate from the calculation currency.
- Financial results are reproducible. Planning assumptions, own observations, and calculated results are distinguished.
- Scenarios, local persistence, downloads, and the full customer journey work. No fake integrations, customers, benchmark accuracy or checkout flows.
- An audit, commercial hypotheses, original-deck correction, validation evidence, and unresolved limitations accompany implementation.

## Iteration 1 — Diagnose and choose the decision

Initial implementation builds and passes 21 existing tests. That does not validate demand predictions or prove customer value.

| Priority | Observed weakness | Resolution / acceptance |
|---|---|---|
| P0 | No landing, user immediately enters a complex Russian workspace | Separate RU/EN landing and a prominent middle CTA |
| P0 | First calculation requires numerous unobservable market parameters | Guided planner with explicitly illustrative, editable starting values |
| P0 | Precise revenue/NPV presented before evidence quality | Lead with required visits, affordable rent, and conditional scenarios |
| P0 | Synthetic data could be confused with a customer's measured demand | Provenance at input, result and export level |
| P0 | Opening ramp penalizes own stores before target absorbs visits | Model audit and regression tests |
| P0 | Network tax applied to incremental profit rather than case difference | Recompute baseline vs opening cash flows |
| P0 | Slide 10 budget asks 20m but sums to 19m | Explicit 20m/12-month proposed budget, no ungrounded investment returns |
| P1 | ICP mixes landlords, malls, retailers and paid leisure | Paid leisure expansion as initial commercial hypothesis |
| P1 | Pricing, willingness to pay, sales cycle and pilots unproven | Paid pilot experiment and measurable 90-day validation plan |
| P1 | Default user name and registered-trademark mark have no basis | Neutral local workspace, remove trademark assertion |
| P1 | Geographic source names imply integrations not implemented | No fake data feeds; source/licensing plan in strategy |
| P1 | Russia-only interface despite UAE target | Full RU/EN main flow; ruble-only presets after owner clarification; advanced research workspace explicitly RU |
| P1 | No direct client artifact when GitHub write is unavailable | Hosted preview and portable offline trial, source branch/patch handoff |

## Iteration 2 — Implement the customer journey · completed

Implemented a separate landing, two-step setup, immediate economics, downside/base/upside scenarios, sensitivity, evidence register, optional observed visits, save/compare variants, JSON backup/restore, CSV and printable report. The original advanced workspace remains available as an explicitly assumption-based lab. Current projects are archived before opening an example or another project.

## Iteration 3 — Harden the model and review the business · completed

Corrected calendar capacity, opening ramp allocation, network tax differences, financial edge cases, zero demand and negative margin, scenario assumptions and persistence/import validation. Rebuilt the pitch as 17 slides and a formula-driven five-tab startup financial model. The commercial offer distinguishes a free working calculator, a proposed assisted pilot and a future subscription. See MODEL_AUDIT.md, DECK_AUDIT.md, STRATEGY.md, RESEARCH.md and BUSINESS_MODEL_RU.md.

## Iteration 4 — Customer journey verification · completed with documented limits

Both language paths, changes to business inputs, saved variants, reload persistence, exports and narrow layout were verified in the browser. Integration review also fixed advanced-workspace crashes caused by invalid intermediate values and malformed imported scenarios. Automated coverage grew from 21 to 56 meaningful checks in release 0.2; the ruble-only follow-up passes 62 checks. Browser upload and file-protocol restrictions are documented explicitly in QA.md; those actions were not bypassed or represented as successful tests. Publication uses the tested source and a reproducible portable build.

## Release boundary

The delivered product answers conditional business-economics questions. It does not infer footfall from a city name, claim validated demand accuracy, offer a working paid subscription, or claim customers/revenue that were not supplied. Remaining work is evidence collection, licensing and commercial validation. See the explicit limitations in QA.md and MODEL_AUDIT.md.

## Access

GitHub read/clone succeeded. `git push --dry-run origin HEAD:refs/heads/codex/crowdly-acceleration` failed because no GitHub credentials are available. User declined the GitHub plugin for this request; do not request it again. This is an access limitation, not a repository code failure.

## Follow-up 0.2.1 — rubles only and teammate handoff

Owner clarified that every calculation must use Russian rubles. Removed currency selectors from both workflows, removed foreign-currency presets and pricing, aligned the deck and startup workbook. Foreign-currency local records are preserved verbatim in downloadable originals, never relabelled or converted. Imports validate RUB explicitly. One teammate package includes the current product, code, decks, financial model, audit and run instructions; intermediate releases are excluded.
