# Crowdly: independent source-deck audit

Audited source: `upload/Crowdly_06.10_final.pptx`, all 10 slides, all slide notes, all rendered slide images. Source deck is 1440 × 810 pt (16:9). Notes contain only date/slide placeholders, not hidden business substantiation. Rendered PDF and individual slide PNGs are in this scratch directory. This is an intermediate working memo, not a final user deliverable.

## Executive judgment

The deck describes a demand and investment simulator for commercial venues. It mixes three different businesses: a ticket-selling leisure operator, a landlord collecting rents, and a retail chain with basket sales. The promise is attractive but currently unbounded: visits, purchase conversion, repeat visits, elasticity, tenant mix, cannibalization, monthly revenue, NPV, IRR and payback. No actual customer, training dataset, measured forecast performance, pricing, recurring workflow, or source of defensible local demand evidence is shown.

The most credible first product is a self-service decision workspace for a single new location: verify its economics, compare scenarios, and identify the visits per day needed to break even. Use paid leisure operators as the initial commercial wedge because a visit maps directly to a ticket and capacity is visible. Keep retail/service presets technically possible, but do not simultaneously sell full mall tenant-mix optimization as a proven capability.

The MVP must distinguish a calculated scenario from an empirically validated forecast. OSM/Overture locations and generic demographics alone do not establish actual visits or causal price response. A useful customer result is still possible without those data: financial thresholds, capacity feasibility, explicit low/base/high assumptions, sourced surrounding places, and optional calibration on the customer's own observations. Unobserved competitor traffic must never be presented as measured data.

## Findings by slide

| Slide | Finding | Severity | Correction and completion criterion |
|---|---|---|---|
| 1 | "Предсказываем" promises validated predictive power although none is demonstrated. Three headline outcomes require different model/data coverage. | P0 | State the decision and current capability: "Проверьте экономику новой точки до подписания аренды". Forecast claims appear only for a stated validated model, population and horizon. |
| 2 | $16m annual Russian and $13m Dubai losses have no source, definition, date or denominator. Three historic project cases combine traffic shortfall, financing and construction overruns. Causal attribution to forecast error is unsupported. | P0 | Remove the aggregate loss claim. Show the customer's real decision mechanics: committed rent/capex, uncertain visits, contribution margin and break-even threshold. Only retain an external anecdote with primary sourcing and correct attribution. |
| 3 | Developers, mall landlords and leisure operators are presented as one customer. Mall rents are not tenant turnover; a ticketed venue has different demand, capacity and cost models. | P0 | Choose one buying role and first job. Recommended: owner/CFO/development director of a multi-site paid-leisure operator comparing a location, scale or price. Describe other categories as expansion. |
| 4 | A workflow is shown, but it does not tell the client what to enter, how long it takes, what is observed versus assumed, or whether screenshots show real output. | P1 | Use screenshots of the delivered product and a worked example. Show minimal inputs, result, source dates, and adjustable assumptions. A price -10%, visits +14%, revenue +2.6% illustration is arithmetically consistent but is not validation evidence. |
| 5 | Five use cases imply five substantial products and different datasets. No entry point or reason to return is clear. | P0 | Lead with one: compare proposed openings and their break-even economics. Price/cost sensitivity naturally follows. Tenant mix, new concept demand and validated cannibalization require later data gates. |
| 6 | "Обучение модели спроса" asserts a trained model without dataset size, outcomes, holdout, baseline or forecast errors. Repeat visits, budgets and time are mentioned without identifiable parameters. | P0 | Document actual model equations and provenance. Do not train on synthetic labels and claim real-world accuracy. A calibrated gravity model or baseline regression is acceptable only where the required observations exist. |
| 7 | A list of possible sources reads like already integrated data. OSM/Overture supply geography/places, not local transactions. Esri is not synonymous with available free RU/UAE demand data. ROLLER compatibility is not a working integration. | P0 | Use statuses: connected now, user optional upload, planned commercial provider. Show exactly what each source supplies, freshness, coverage, attribution and failure behavior. |
| 8 | New Russian mall count, UAE planned floor area and a funding round are different denominators, not a market size. CAGR 26% has no named market or period. | P0 | Build a bottom-up serviceable market: identified target accounts × relevant decisions per year × tested price. Distinguish observed account inventory from illustrative conversion cases. Remove unrelated simulation-market CAGR. |
| 9 | Actual slide rendering is broken: the table overlaps the heading and a pink Crowdly block protrudes beneath it. Comparison also overclaims differentiation. Placer/PiinPoint discuss cannibalization and revenue forecasts; ArcGIS supports market potential and pricing as attractiveness. | P0 | Rebuild as an honest 4–5-row comparison of workflow, supported geography, required data, scenario economics and calibration. Date and source competitor claims. Compare current functionality with current functionality. |
| 10 | Ask is 20m RUB, allocation totals 19m: 9.6 + 2.8 + 2.3 + 2.1 + 2.2. Investor ROI 305% and IRR 38.3% have no financial model. No runway, milestones, ownership terms, pricing or revenue bridge. | P0 | Correct the budget with a traceable cost model before restoring an ask. Remove unsupported investor returns. If preserving 20m as the founder's draft, call it proposed and separately resolve the missing 1m. Tie staged spending to validation and paid-pilot gates. |

## Missing slides/content

1. Revenue model and who signs the invoice.
2. Real current stage: what exists, what was tested, what is still a hypothesis.
3. Data availability and proof of forecast quality.
4. Team and relevant operating/data experience (do not invent people or biographies).
5. Repeat usage and go-to-market mechanism.
6. A live product link with an immediate usable example.
7. Unit economics and price-testing plan.

## Recommended product boundaries

### First commercial wedge

Paid leisure venues such as family entertainment and thermal/wellness complexes, with one location-level operating model. Economic buyer: owner, CFO or development lead. Trigger: a candidate lease, new opening, capacity choice or a ticket-price decision. This is a recommendation derived from the source deck, not an assertion of customer traction.

### Zero-blocker entry

Ask only for information a business owner normally knows: market/currency, format, address or area, ticket/basket, approximate rent/operating costs and planned opening investment. Everything beyond this can be optional. Allow a prefilled example, a manual location fallback, and a useful financial-only calculation when location-data requests fail.

Classify displayed inputs as:

- Observed: supplied business facts and actually fetched geographic records.
- Estimated: a derived quantity with a stated method and wide scenario range.
- Assumed: a user-editable starting scenario, visibly marked as such.

Do not rename the third category "market data". OSM place counts must not automatically become thousands of alleged monthly passers-by. A confidence score for the existence of an Overture POI is not confidence in revenue prediction.

### Outputs that are valuable before training

- Visits/purchases per day required to cover monthly fixed costs.
- Operating contribution and cash-flow path under explicit demand/price/cost scenarios.
- Capacity utilization needed to break even and warnings for impossible required throughput.
- Maximum affordable rent at a selected scenario and margin target.
- Comparison of saved scenarios with consistent units and assumptions.
- Export including inputs, formulas, sources, retrieval dates and limitations specific to that calculation.

### Guardrails for the financial engine

Visits, people, purchasers and transactions are different quantities. Use a clear unit. Retail conversion may be less than one; a paid-entry venue can use one paid admission per ticketed visit. Track VAT/tax assumptions explicitly without pretending that one regime fits every Russian/UAE business. Keep capex and working capital distinct from recurring operating costs. Convert an annual discount rate to a monthly effective rate using `(1+r)^(1/12)-1`. Annualize a monthly IRR using `(1+irr_month)^12-1`, not simple multiplication. Return "not reached" for payback beyond the horizon and "not defined" where IRR has no valid sign-changing cash-flow sequence. Show whether terminal value or resale assumptions are included.

### Demand model development

Begin with deterministic scenario arithmetic and optional own-business calibration. If later adding a gravity/Huff model, fit travel/attractiveness effects on relevant observations and include an outside option (no visit/other businesses) so model shares do not force every resident into listed competitors. For price response, avoid treating correlation in historic prices as causal elasticity. For network expansion, compute the difference between network totals before and after opening, not just a duplicated turnover sum. Capacity limits must cap served demand without silently discarding the unmet-demand explanation.

## Evidence and YC/product references

| Source | What it actually supports | Product lesson |
|---|---|---|
| YC PiinPoint, https://www.ycombinator.com/companies/piinpoint | YC W14 location analytics for expansion; combines traffic, demographics and commercial real estate. | Closest YC reference: one concrete location decision and centralized evidence. |
| PiinPoint Explore, https://www.piinpoint.com/product | Compare candidate locations, see demographics and nearby brands, track candidates. | Address-first workflow, comparisons and decision progression. |
| PiinPoint reports, https://www.piinpoint.com/reports | Self-service single reports and subscription/export. Page contains inconsistent $150/$250 copy, so do not cite a precise current price. | A single paid report can precede a subscription; export is a product feature, not an afterthought. |
| PiinPoint home, https://www.piinpoint.com/ | Customized sales modeling and cannibalization/network analytics. | Avoid claiming that scenario forecasting/cannibalization is unique to Crowdly. |
| YC Artificial Societies, https://www.ycombinator.com/companies/artificial-societies | YC W25 behavioral simulation grounded in real-world behavior. | Grounding and specific decision workflows matter more than an "AI agents" label. This is adjacent, not a proof of venue-demand accuracy. |
| Placer, https://www.placer.ai/site-selection-analytics | Candidate site comparison, trade-area/customer/competitor analysis and US address workflow. | Clear input-to-output path; geographic coverage must be explicit. |
| Placer retail, https://www.placer.ai/solutions/retail | Retail foot traffic, cannibalization, shared audiences and sales-related use cases. | Competitor comparison needs correction. |
| Esri Huff model, https://doc.esri.com/en/arcgis-pro/latest/help/analysis/business-analyst/huff-model-overview.html | Distance/attractiveness site model, sales potential, optional pricing attractiveness and need to calibrate exponents. | A known transparent model is sufficient, but default coefficients are not local validation. |
| SberAnalytics, https://sberanalytics.ru/products/geoanalitica | Markets 12-month customer-flow, basket and revenue forecasts in Russia. | Strong local competitor exists; "forecasts revenue" alone is not differentiation. |
| Overture places, https://docs.overturemaps.org/guides/places/ | Physical POIs, taxonomy and confidence of existence. | Do not mislabel POI existence as visitor or sales confidence. |
| OSM, https://www.openstreetmap.org/about/main | Community-maintained roads, cafes, stations and other map features. | Useful geographic evidence, not direct transaction/footfall data. |
| Simile Series B, https://www.simile.com/blog/series-b?source=homepage and https://www.indexventures.com/perspectives/simulating-society-at-scale-our-investment-in-similes-200m-series-b/ | >$200m Series B announced July 30, 2026. | The deck's fundraising event is broadly supported, but it is not Crowdly's TAM or validated demand. Omit or put in a short appendix. |

All sources retrieved 2026-11-16. The parent must open relevant URLs itself before citing external source reference IDs in the final answer.

## Proposed 14-slide replacement narrative

The source is strategic input rather than a design template. Prefer a clean editable deck, generous spacing, one claim per slide, restrained green/ink palette consistent with the eventual product, clear screenshot labels, and bottom-of-slide sources. Use actual product captures after implementation. Avoid pseudo-3D stock illustrations as the primary proof.

1. **Crowdly — экономика новой точки до подписания аренды.** One sentence describing the decision. RU/UAE availability only to the extent implemented. Live link and "Попробовать на своём проекте".
2. **Аренда и вложения известны раньше, чем спрос.** Show the decision gap through a simple contribution/break-even diagram. No unsourced loss total.
3. **Первый клиент: оператор платного досуга.** Buyer, trigger and decision. Explain why measured visits and capacity make this a coherent first segment. Label positioning as chosen focus rather than existing adoption.
4. **От адреса к расчёту за несколько шагов.** Actual screenshots of input, collected context, scenario result. State that competitor traffic is not required.
5. **Результат: порог безубыточности и сравнение вариантов.** One reproducible worked case from the delivered engine. Tag the case as illustrative unless real operating data is authorized.
6. **Цена, поток и затраты меняют денежный результат.** Price/traffic/rent sensitivity and capacity; display causal arithmetic, not an unvalidated precision forecast.
7. **Каждое число имеет происхождение.** Three columns: observed, estimated, assumed. Source freshness and optional business calibration.
8. **Прозрачная модель, проверяемый результат.** The implemented equations and output limits. Separate current scenario calculator from future empirical prediction.
9. **Позиция относительно альтернатив.** Compare Excel/consulting, established geoanalytics and Crowdly's actual workflow. No competitor crosses without evidence. RU/UAE self-service and transparent finance are hypotheses of differentiation.
10. **Сначала платное решение, затем повторяемая подписка.** Free screening → paid project/report or assisted calibration → subscription for repeat multi-location decisions. Prices shown as test hypotheses backed by proposed delivery costs, not proven willingness to pay.
11. **Выход на рынок через операторов и партнёров.** Founder-led discovery and 3–5 design partners in a single segment; Russian pilots before scaling UAE acquisition, or UAE first if actual relationships are stronger. Describe targets as targets.
12. **Рынок считается через покупателей и решения.** Bottom-up equation with verifiable account list and scenarios. Use no inflated TAM. A small initial wedge is compatible with expansion to adjacent formats later.
13. **Следующий рубеж — доказать полезность и качество.** Current shipped features; planned pilot gates: independent user completes a real case, decision useful, business-data calibration beats simple baseline on held-out observations, customers pay/repeat. No invented traction.
14. **Ресурсы привязаны к проверяемым этапам.** Either a funded 12–18-month operating model with explicit assumptions and the reconciled ask, or a pilot invitation if investment terms are not yet supportable. Team credentials/contact included only if known. Remove investor ROI/IRR promises.

## Landing-page content direction

Hero: **Проверьте экономику новой точки до подписания аренды.**

Body: "Укажите адрес и параметры бизнеса. Crowdly соберёт доступные сведения об окружении, рассчитает порог безубыточности и покажет, как меняется результат при разных ценах, потоке и затратах."

Primary CTA: **Рассчитать мой проект**. Secondary: **Посмотреть пример**.

Promise immediately below: "Можно начать без выгрузок и трафика конкурентов."

Sections: the decision/benefit; actual interactive-looking product screenshot with example label; how it works; financial results and provenance; a large middle-page CTA; formats/market support; how assumptions and calibration work; FAQ; repeated final CTA.

FAQ should answer: What if I have no historic data? Where do location data come from? Are these measured visits? What if no local data were found? Can I adjust assumptions? What differs between RUB/AED? How are my inputs stored? Can I export and compare? Each answer must match implementation. Do not claim no storage if server logs or persistence contradict it.

## Business model hypotheses and validation

Free entry should prove a useful calculation, not stop at an email gate. Sell an exportable decision package or a repeat workflow after value is clear. A founder-assisted pilot can legitimately collect high-quality outcome data and expose which inputs matter. Keep paid data and human analyst time in cost of delivery. Do not describe gross margin as SaaS-like until manual services are measured.

Track activation as a customer completing their own scenario and comparing at least one meaningful alternative. Track time to first useful result, report export, decision feedback, paid pilot conversion and repeat decisions. Model quality should use a held-out period/site, a transparent naive baseline, error in business units plus weighted relative error, and interval coverage where intervals are statistically justified. Hand-picked demo examples and synthetic training outputs are not evidence of forecast accuracy.

Before committing revenue targets, test willingness to pay by requesting a paid pilot with a specified deliverable and outcome review. The full startup cannot be made validated in an engineering session; the deliverable can be made usable, coherent and ready for that validation without presenting assumptions as traction.

### Reconciled 20m RUB planning scenario

This is a proposed 12-month budget scenario, not actual payroll, vendor quotes, approved spending or a substantiated fundraising valuation. It deliberately replaces a generic "model training" line with data access and validation. No revenue is assumed to fund the runway.

| Budget line | RUB million | Basis/assumption |
|---|---:|---|
| Core product/engineering/analysis team | 9.6 | 0.8m per month all-in × 12; roles/actual rates to be confirmed |
| Data licensing, data preparation and independent pilot validation | 3.0 | Milestone-based envelope; no large dataset purchase until pilots establish value |
| Hosting, developer tools, observability and security work | 1.4 | 12-month operating allowance, including one-off setup |
| Founder-led sales, partner pilots and local travel | 2.0 | Initial segment only; no mass paid acquisition assumption |
| Design, localization, contracts and operating setup | 1.2 | RU/EN and RUB/AED first; Arabic/full local adaptation only after evidence |
| Cash reserve | 2.8 | Held separately, released only after a reviewed need |
| **Total** | **20.0** | **All lines reconcile** |

Planned non-reserve spend is 17.2m RUB over 12 months, or 1.433m RUB/month on average. Reserve is about 1.95 months at that average spend. Actual spending will be uneven. Funding the full 20m gives 12 months at the specified program plus the reserve, not a guaranteed runway under arbitrary hiring or vendor costs. Do not quote investor ROI/IRR without ownership/dilution/exit assumptions and a proper financial model.

Three spending gates: (1) self-service result and documented interviews with the first segment, (2) paid or contractually committed design partners and sufficient data to evaluate model improvement, (3) repeated paid decisions and a validated acquisition/delivery process. A target number is a planning target; an achieved count requires evidence.

## Consolidated questions for later (not implementation blockers)

- Is there an existing paid pilot/customer or an operator willing to provide historic daily/weekly data?
- Which initial format has the strongest founder access, and in which market?
- What team/founder bios and contact should be public?
- Is 20m RUB a fixed fundraising intent or merely the old deck's draft?
- Are there licensed data subscriptions, a hosting/domain preference, or production integration credentials already available?

Useful implementation and honest presentation work can proceed before these answers; mark unknowns and avoid invented commitments.
