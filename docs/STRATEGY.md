# Crowdly: product and commercial strategy

Version: 2026-11-16. This document records the acceleration decisions, their evidence, and the hypotheses still requiring customer or data validation. It is not a record of achieved traction.

## 1. The decision Crowdly helps make

**Check the economics of a new venue before signing a lease.**

The core self-service product answers:

- How many paid visits per day cover operating costs?
- How much rent can this operating scenario support?
- How do lower or higher visits change cash flow and investment recovery?
- How much cash is needed during opening and ramp-up?
- Which assumptions change the result most?

This is a reproducible scenario model. The present version does not claim empirically validated prediction of local demand, causal price elasticity, or the probability of a scenario.

## 2. Initial customer and expansion boundaries

The first commercial hypothesis is an operator of paid leisure venues considering a new site or material operating change: family entertainment, thermal or wellness spaces. Buyer: owner, CFO, or development lead. The initial job is a location-level economics decision, not full shopping-mall tenant-mix optimization.

The product also has café and custom-business templates so a visitor can test their own numbers. These templates are usability aids; they are not validated vertical models or evidence of market fit in every category.

Russia and the UAE are target markets. The main flow supports Russian and English interface languages. All inputs, calculations, examples and commercial offers use Russian rubles (RUB) only. There is no currency selector or foreign-exchange conversion; English changes the interface language only. This scope does not imply local tax certification or validated demand estimates. The advanced network lab remains separate and Russian-language. Its existence does not make every feature a supported promise of the main planner.

## 3. A usable first result without blocked inputs

The two-step entry asks for information the owner can normally know: business name, country, format, city, average payment, capacity/day, operating days, rent, other fixed costs, variable-cost share and opening investment. Starter numbers are explicitly editable illustrative assumptions. Known own monthly visits are optional.

The client must never be forced to obtain competitors' monthly visitors, private sales or inaccessible market data before receiving a useful result. City currently provides context in the core planner; it must not silently select an invented demand figure.

A visitor can compare deterministic low/base/high volume scenarios, inspect finance and sensitivity, save locally, export JSON/CSV and print a PDF. Sharing, subscriptions, payments and enterprise integrations must remain roadmap items until actually implemented and reviewed.

## 4. Evidence, assumptions and calculations

Every displayed quantity needs a clear class:

| Class | Examples | Required treatment |
|---|---|---|
| Business observation | User's rent, prices, own historic visits | Identify the source and period. Allow correction. |
| Plan assumption | Starter utilization, opening ramp, cost growth | Mark as an assumption. Explain units. Let the user change it. |
| Computed result | Break-even visits, cash flows, NPV | Make formulas reproducible and preserve input versions. |
| Geographic record | Actually fetched location or neighboring POI | Show provider and freshness. Do not call it observed traffic. |

OpenStreetMap describes physical geography and places. Overture Places contains POIs, taxonomy and confidence that a place exists. These records do not establish observed visits, transaction amounts or a validated revenue forecast for a new venue. A count of nearby places must not become a precise monthly traffic number without a separately justified model.

Source: [OSM about](https://www.openstreetmap.org/about/main), [Overture Places documentation](https://docs.overturemaps.org/guides/places/), reviewed 2026-11-16.

## 5. Financial model contract

The executable implementation is `src/domain/planner.js` with financial utilities in `src/domain/finance.js`.

- Contribution per paid visit = average payment × (1 − variable-cost share).
- Monthly fixed costs = rent + other fixed costs.
- Break-even visits/day = monthly fixed costs / contribution per visit / operating days, when contribution is positive.
- Base visits come from the user's own observation or the explicitly assumed utilization. They are capped by stated capacity.
- Low/base/high scenarios use 0.7/1.0/1.3 times the base volume, subject to capacity. They are stress scenarios, not probabilities or statistical intervals.
- Maximum affordable rent is the rent at zero steady operating profit for the selected base volume; it does not ensure repayment of capex.
- Ramp-up affects monthly cash flows. Capex is a time-zero outflow. The model reports the largest cumulative funding requirement, including initial operating losses.
- Effective monthly discount rate = `(1 + annual rate)^(1/12) - 1`.
- The model must return an explicit unavailable result for undefined IRR and show payback as not reached beyond the horizon.
- Tax is a simplified editable rate on positive operating profit. It is not a full VAT, depreciation, financing or jurisdiction-specific tax model.
- Price sensitivity holds other inputs constant; it does not imply a measured demand response to price.

### Reproducible educational example

This is a teaching case, not customer data or an industry benchmark.

| Input | Value |
|---|---:|
| Price | RUB 1,400 |
| Variable costs | 25% of revenue |
| Capacity | 200 visits/day |
| Operating days | 30/month |
| Assumed utilization | 35% |
| Rent | RUB 600,000/month |
| Other fixed costs | RUB 912,000/month |
| Opening investment | RUB 8,000,000 |
| Ramp | 3 months |
| Horizon | 60 months |
| Discount rate | 20% annually |
| Tax, annual price growth, annual cost growth | 0 in this example |

Results from the actual engine:

| Output | Low | Base | High |
|---|---:|---:|---:|
| Steady paid visits/day | 49 | 70 | 91 |
| Steady monthly revenue, RUB | 2,058,000 | 2,940,000 | 3,822,000 |
| Steady monthly operating profit, RUB | 31,500 | 693,000 | 1,354,500 |
| Payback, months | Not reached within 60 | 14.7258 | 8.0225 |
| NPV, RUB | -8,281,918 | 16,913,833 | 42,109,584 |

Break-even = **48 paid visits/day**. Maximum base-case rent at zero operating profit = **RUB 1,293,000/month**. Base-case maximum funding need = **RUB 8,819,000**. Months one and two have operating cash flows of -777,000 and -42,000 RUB; therefore the opening investment alone does not cover the modeled opening period. No terminal value is included.

## 6. Alternatives and differentiation hypothesis

Crowdly is not the first product to forecast site performance or consider cannibalization.

| Alternative | Verified public capability | What Crowdly should learn |
|---|---|---|
| PiinPoint, YC W14 | Location analytics, comparison, custom sales and network models | Focus on one identifiable decision, clear inputs and exportable evidence. |
| Placer.ai | Foot traffic, trade areas, site comparison and cannibalization-related use cases | Show geographic coverage and the provenance of behavioral data. |
| SberAnalytics | Russian geoanalytics with advertised customer-flow, basket and 12-month revenue forecasts | A local data competitor exists. Generic forecast claims are insufficient differentiation. |
| ArcGIS Business Analyst | Huff model, attractiveness/distance parameters and calibration | Transparent known models can be useful, but default coefficients require calibration. |
| Excel / financial consulting | Flexible custom operating and investment analysis | A simple first result must still preserve model transparency. |

The working differentiation hypothesis is accessible self-service economics in the target markets, explicit assumptions, and an easy path from a free calculation to a real business decision. This needs customer testing.

Primary sources, reviewed 2026-11-16:

- [PiinPoint YC profile](https://www.ycombinator.com/companies/piinpoint)
- [PiinPoint product](https://www.piinpoint.com/product)
- [PiinPoint analytical capabilities](https://www.piinpoint.com/)
- [PiinPoint reports](https://www.piinpoint.com/reports). Its page contains inconsistent price text; do not use it as precise price evidence.
- [Placer site selection](https://www.placer.ai/site-selection-analytics)
- [Placer retail](https://www.placer.ai/solutions/retail)
- [SberAnalytics geoanalytics](https://sberanalytics.ru/products/geoanalitica)
- [Esri Huff model](https://doc.esri.com/en/arcgis-pro/latest/help/analysis/business-analyst/huff-model-overview.html)
- [Artificial Societies, YC W25](https://www.ycombinator.com/companies/artificial-societies), an adjacent simulation reference rather than proof of venue-demand prediction.

## 7. Commercial model hypotheses

1. Free planner: customer gets a useful own-business result without an email or payment gate.
2. Assisted pilot over 4–6 weeks: proposed test price **RUB 150,000**. Deliverable: business-data review, checked calculations, scenario comparison and documented decision feedback. It does not automatically include a validated demand model.
3. Workspace subscription after repeat use: proposed test price **RUB 25,000 per month** for continuing location decisions and history.

Prices are experimental, not proven willingness to pay or published contractual offers. All commercial offers are denominated in Russian rubles only. Billing and the collaborative workspace require further implementation.

Measure analyst hours, purchased data, support and infrastructure per pilot. Do not report SaaS-like margin while most value comes from manual analysis. Measure activation as completion of a real project and at least one meaningful comparison, not a page view.

## 8. Bottom-up market and go-to-market

Addressable revenue should be calculated from an identifiable set of operators, relevant annual decisions and a tested price per decision. An aggregate count of new malls, planned square metres, a general simulation CAGR or another startup's funding does not establish Crowdly's TAM.

The first sales motion is founder-led outreach within one format, supported by partners involved in opening or selecting premises. Build a named target list with geography, decision-maker, trigger, timing and evidence of interest. Start where founder access and operating data are strongest. Validate unit economics before expanding paid acquisition or launching two broad enterprise sales organizations at once.

## 9. Ninety-day validation plan

All figures below are targets, not achievements.

| Period | Commercial target | Product/evidence target |
|---|---|---|
| Days 1–30 | 20 interviews, 5 design partners | 10 independent own-business calculations. Record blockers, time-to-result and usefulness. |
| Days 31–60 | 3 paid pilots with a specific deliverable | Independently reconcile financial calculations and obtain usable historical data where possible. |
| Days 61–90 | 2 repeat decisions or renewals | Evaluate a demand model only if data and holdout gates are satisfied. |

### Gate for a later demand model

Target data availability: at least five comparable venues with twelve months of history. Keep at least two entire sites out of model fitting and reserve a blind time holdout. Fix the target, exclusions, horizons and comparison before opening the holdout results. Use the same data and horizon for a seasonal-naive baseline.

Exploratory target thresholds: **at least 15% relative reduction in WAPE** versus that baseline and **absolute aggregate bias at most 10%**. WAPE requires nonzero actual totals. These are proposed acceptance criteria, not current performance. Two held-out sites do not justify a universal accuracy claim; segment, market and horizon coverage need further evidence. If data are insufficient or the model fails, keep the scenario product and revise the research plan. Price elasticity requires a separate causal evaluation.

Training on synthetic outcomes does not establish accuracy on real customer demand. A visually appealing simulation is not validation evidence.

## 10. Proposed twelve-month budget

This is a reconciled planning scenario retaining the old deck's RUB 20m ambition. It is not approved hiring, vendor quotes, a valuation or a claim of investor returns.

| Line | RUB million |
|---|---:|
| Product, engineering and analysis team | 9.6 |
| Data access, preparation and independent validation | 3.0 |
| Infrastructure, tools and security | 1.4 |
| Founder sales and partner pilots | 2.0 |
| Design, localization and operating setup | 1.2 |
| Reserve | 2.8 |
| **Total** | **20.0** |

The team assumption is RUB 0.8m/month all-in for twelve months, with actual roles and rates to be established. Non-reserve spending is RUB 17.2m or RUB 1.433m/month on average. The reserve corresponds to approximately 1.95 months at that average. No revenue is assumed to finance the plan. Release expenditure in stages linked to usefulness, paid pilots and repeat decisions. Do not derive an investor IRR without ownership, dilution and exit assumptions.

## 11. Original pitch issues and disposition

All ten original slides and notes were inspected and rendered.

| Issue | Why it matters | New disposition |
|---|---|---|
| Unqualified demand-prediction promise | No training or validation evidence supplied | Position the shipped core as a scenario/economics planner. |
| Broad mall/leisure/retail customer | Different economic and data models | First commercial wedge is paid leisure. |
| Unreferenced annual loss aggregates | No comparable source or causal basis | Remove them from the pitch. |
| Model-training claims | No dataset, baseline or holdout described | Replace with transparent current model and explicit validation roadmap. |
| List of potential data sources reads as connected | Misleads on coverage and availability | Distinguish actual inputs, assumptions and future integrations. |
| Mall counts, UAE floor area, simulation funding mixed as TAM | Incompatible denominators | Use bottom-up operator/decision/price research. |
| Broken competitor slide | Table overlaps title; Crowdly column is misplaced | Rebuild as a concise sourced comparison. |
| Overstated uniqueness | Established competitors already cover forecasts/cannibalization | Claim only concrete current workflow and test differentiation. |
| 20m request sums to 19m | Arithmetic error and unclear program | Reconcile to a labeled 20m planning scenario. |
| ROI 305% and IRR 38.3% without model | Cannot support investor return claims | Remove. Use actual engine outputs only for labeled educational customer examples. |

## 12. Open decisions that do not block a useful beta

- Identify actual design partners and any paid or contractual traction.
- Confirm public founder/team information and contact details.
- Confirm which market has strongest access to paid-leisure operators.
- Obtain data rights and appropriate hosting/commercial data terms before integrating real customer datasets.
- Test pilot pricing and the point at which customers need a paid collaborative workspace.
- Decide whether the 20m fundraising scenario is an actual intention once the operating plan and milestones are reviewed.

Never fill these gaps with invented customer names, partner logos, revenue, accuracy numbers or team credentials.
