# Crowdly: market, data and business-model research

Research date: 16 November 2026. Internal working memo for the acceleration project. Findings below distinguish retrieved facts, vendor claims, and proposed hypotheses. No customer interviews, purchases of data, or market validation were performed.

## 1. Product conclusion

The defensible first promise is: **help an operator see how many paid visits a new venue needs, how much rent it can afford, and how its return changes with price, utilisation and costs.** A financial scenario can work immediately with ordinary inputs. An independently validated prediction of local demand cannot be manufactured from an address, a list of nearby venues, and an LLM.

Recommended beachhead to validate: operators of paid leisure venues and small networks with roughly 2–20 locations, preparing a new opening or format change. Examples are indoor family entertainment, activity centres and compact wellness formats. The venue's capacity, ticket, operating costs and repeat visits are more interpretable than an undifferentiated mix of shopping centres, grocery, offices and spas. This is a strategic hypothesis, not a measured market result. Coffee can remain an accessible demo, but a general coffee-location report is already crowded.

Core job: prepare a defensible opening / pricing / lease decision. First buyer: founder, expansion lead or finance lead. First cities for deliberate validation: Moscow and Dubai. Country support is not evidence that a validated demand model works across every city in either country.

If the existing product has adequate domain coverage, retain that engine while narrowing the landing page's initial job and onboarding. Avoid rewriting all historic features simply to fit this hypothesis.

## 2. Useful YC precedents

| Company | Verified YC affiliation and product | Lesson for Crowdly, inferred |
| --- | --- | --- |
| PiinPoint | W14. Its YC page describes location selection in North America using traffic, demographic and available commercial property datasets. | Own a concrete expansion decision and show the underlying location evidence. A geographic scope and data supply matter as much as the interface. |
| PropRise | S23. YC describes Beacon for site selection and Primer for turning deal packages into model-ready financial data. | Start with a costly analyst workflow, connect data to the decision, and produce an exportable result. Treat its profile as product precedent, not a promise that Crowdly has the same customer base. |
| Aura Vision | W19. YC describes in-store analytics that use a retailer's existing security cameras. | Reduce input burden by reusing what customers already have. For Crowdly the initial analogue is a simple history CSV, not a mandatory camera integration. |

Primary sources:

- https://www.ycombinator.com/companies/piinpoint
- https://www.ycombinator.com/companies/proprise
- https://www.ycombinator.com/companies/aura-vision

Do not present Placer.ai as a YC company. These sources verify the three affiliations above. Avoid repeating fluctuating company counts or funding statistics as proof of Crowdly's opportunity. The current PropRise directory page also links to a November 2026 acquisition news item, so it is safer to describe its product approach than to claim it remains an independent active startup.

## 3. Competitive reality

| Product | Relevant territory and verified / advertised capabilities | Implication |
| --- | --- | --- |
| 2ГИС Про | Official Russian service advertises demand, traffic, competitors, location comparison, own-data upload and an AI assistant across 1,400+ Russian/CIS cities. | A map, competitor count and AI-generated narrative are not a differentiation. Its underlying behavioural and directory data are a potential supplier advantage. UAE directory presence does not by itself prove identical UAE Pro analytical coverage. |
| СберАналитика Геоаналитика | Official site describes payment-based data, average ticket across 47 industries, local demand and turnover estimates. Price is individually quoted. | Strong source advantage for Russian transactional analytics. Its advertised accuracy figures should be treated as vendor claims; they do not establish a universal forecast error standard. |
| Bestplace | Official site advertises address-to-report self service in about 3 minutes, revenue, payback, fair rent, comparison and models for 45+ business types using real sales. It also has network calibration and cannibalisation products. | Speed and payback alone are already offered. Crowdly needs transparent assumptions, useful what-if decisions, a chosen vertical, and evidence of superior customer workflow. |
| Esri Business Analyst | Official documentation confirms UAE demographics sourced from Michael Bauer Research and GHSL-based settlement points, with country-specific geographies and data vintages. | Serious UAE data infrastructure already exists. Coverage resolution, licence and update date must be checked before embedding or reselling it. |
| Placer.ai | Official data page describes US location coverage and a mobile panel extrapolated to visits. | Useful product benchmark for foot-traffic evidence, not a verified immediately available UAE/Russia dataset. Do not imply global coverage. |
| Locus UAE | A currently accessible vendor site offers UAE site scores, financial scenarios and a free demo. Its claims of model calibration and live signals are unverified in this review. | Evidence that similar messaging exists locally. Do not rely on its data, confidence scores, pricing or traction as validated industry benchmarks. |

Primary sources:

- 2GIS: https://analytics.2gis.com/ and https://docs.2gis.com/en/pro/overview
- UAE directory presence: https://info.2gis.ae/dubai
- Sber: https://sberanalytics.ru/products/geoanalitica
- Bestplace: https://bestplace.pro/
- Esri UAE: https://doc.esri.com/en/arcgis-data/latest/esri-demographics/united-arab-emirates.html
- Placer data scope: https://www.placer.ai/resources/our-data
- Locus vendor site: https://www.locus-uae.com/Locus.html

## 4. Data that can be used honestly

### Address lookup

Photon's official project supplies a public demonstration geocoder, multilingual search and OSM-based place data. It permits project use within reasonable limits, can throttle excessive usage, and provides no availability guarantee. For a small demonstration it is a better default candidate than silently embedding the public Nominatim API. Use a swappable provider adapter, explicit search submission, caching, rate limiting, abort/timeout handling, and attribution. Use the result's actual coordinate precision; a city match is not an address-level match.

Source: https://github.com/komoot/photon

The current official public Nominatim policy requires a maximum of 1 request per second for the entire application, identifying headers, attribution and caching. It forbids client-side autocomplete and includes restrictions on generic geocoding generated through no-code / low-code / vibe platforms without a deliberate responsible developer decision. A blanket automatic integration would be inappropriate. These restrictions apply to the public OSMF server, not a separately operated commercial or self-hosted service.

Source: https://operations.osmfoundation.org/policies/nominatim/

### Nearby places

OpenStreetMap can provide known mapped competitors and amenities. It does not measure visits, spending, spare capacity, or complete business coverage. A successful empty result means no matching mapped records were returned; it does not prove zero competitors. On provider failure, show “data unavailable” and continue the financial scenario.

The OSM Overpass instance list currently warns about public-server overload, caching and rate limits, and directs commercial applications toward paid/self-hosted service. Main-instance limits distinguish occasional use from regularly operated applications. Some other public operators have different policies. Do not scatter requests across servers to bypass quotas. For pilot reliability, prefer a permitted provider, a small cached dataset or regional extracts, and record the source and extraction date.

Source: https://wiki.openstreetmap.org/wiki/Overpass_API

### Population

The European Commission's GHS-POP R2023A supplies free residential-population raster data at 100 m and 1 km resolutions, with multiple vintages. Its 2025/2030 values are projections, not real-time censuses. It can support catchment context but not a direct claim about local foot traffic, daytime workers, tourists or paying demand. Record vintage, resolution and method. Aggregating a country or city total into a small-radius address without a spatial dataset is not justified.

Sources:

- https://human-settlement.emergency.copernicus.eu/ghs_pop2023.php
- https://human-settlement.emergency.copernicus.eu/downloadWizard.php

Official population context found:

| Territory | Reported figure and reference date | Scope caution |
| --- | --- | --- |
| Moscow | 13,274.3 thousand on 1 Jan 2025, Mosstat / Rosstat | Entire federal city, not the catchment around a business. |
| Dubai | 4.580 million at end-2025, Digital Dubai's new administrative-data methodology | Emirate total. It is not directly comparable to all older Dubai estimates without checking the revision/method. |
| Abu Dhabi | 4,135,985 in 2024, SCAD | Entire emirate. Abu Dhabi Region is separately 2,823,340; neither is automatically “Abu Dhabi city”. |

Sources:

- https://77.rosstat.gov.ru/storage/mediabank/Оценка%20численности%20постоянного%20населения%20(на%2001.01.2025%20г.).htm
- https://www.digitaldubai.ae/newsroom/news/dubai-digital-dubai%27s-population-tops-4.580-million-by-the-end-of-2025-recording-7.5-growth
- https://census.scad.gov.ae/

### Comparable prices

Current operator pages supply examples for a range, not average achieved revenue:

UAE operator price pages were reviewed as market context (https://bounce.ae/offers-and-pricing/ and https://dubai.kidzania.com/en-ae/pages/ticket-prices). Their foreign-currency prices are not imported into the ruble-only Crowdly model.
- Moreon Moscow currently shows a weekday adult aquapark+thermal ticket at RUB 3,590 and a child ticket at RUB 2,150. Source: https://aquapark.more-on.ru/

These formats are not interchangeable. Discounts, family mix, memberships, free children, visit duration and food revenue change the achieved ticket. A listed single-entry tariff must not silently become a venue's measured average ticket. Benchmarks need category and date labels and must remain editable.

## 5. Model boundaries and implementation guidance

### Always-working core

1. Use Russian rubles for every calculation; ask for business format and optionally city/address. Allow a complete demo immediately.
2. Ask only things the operator can ordinarily know: planned ticket/basket, monthly rent, one-time investment, capacity and opening schedule. Supply visible editable planning assumptions when unknown.
3. Calculate contribution per paid visit, operating break-even visits per day, capacity usage needed to break even, rent headroom at a chosen demand scenario, cash burn during ramp, and payback / NPV only with an explicit time horizon and discount assumption.
4. Present conservative/base/upside as **scenarios**, not statistically calibrated confidence intervals. A synthetic default is not measured demand.
5. Separate measured customer inputs, published comparable prices, retrieved location context and planning assumptions. Each major number needs a provenance label.
6. Let external-data failure degrade enrichment only. It must not block business economics, erase inputs or invent missing data.
7. Export assumptions, data dates, model version, monthly cash flows and limitations together with results. A report must be reproducible.

Useful relationships:

- Contribution per visit = average net ticket − variable cost per visit.
- Break-even paid visits / month = fixed operating cost / contribution per visit, only for positive contribution.
- Operating surplus = paid visits × contribution per visit − fixed operating cost.
- Capacity constrains served visits. It is not evidence that demand will fill capacity.
- Payback is first month cumulative operating cash flow covers initial outlay, including startup losses. If the horizon is insufficient, show “not reached within the modelled horizon”.

Finance labels need to match the implemented cash flow. EBITDA, operating cash flow, net profit and investor return are not interchangeable. Tax, debt, replacement capex, working capital and terminal value should be explicit model assumptions or explicit exclusions. Do not seed country tax rates from memory or hide them inside a profit claim.

### Data and calibration route

For an existing operator, accept a simple CSV of its own monthly paid visits and average ticket / revenue. Start with an understandable capacity-and-margin model and a calibrated level multiplier or measured seasonal profile. Do not call fitting on the same rows “validation”. Hold out periods or locations and compare against a simple last-period / same-month baseline.

For a new location without operating history, show the gap: which demand range must be true for the opening to work, which external observations would test it, and how the conclusion changes across that range. A transparent decision threshold can be useful before predictive accuracy exists.

Do not require a customer to know competitors' monthly traffic. Do not infer it from their map ratings or count of reviews without a validated conversion relationship. No complex ML is required for this first product.

### Validation metrics

- Completion and time to first business result on a user's own venue.
- Whether a buyer can explain the calculation and name the dominant decision driver.
- Whether the report changes a real lease / opening / format decision.
- Paid pilot conversion and repeat usage on a second location.
- Forecast MAE/WAPE and bias on held-out actuals, if forecasting is tested, with sample size, period and segment disclosed.
- Data coverage, freshness and provider failure rate.

No universal “95% accuracy”, confidence score or ROI uplift should be claimed before these are measured.

## 6. Commercial model: testable hypotheses

Recommendation: a free self-service scenario builds trust; paid analysis is tied to an expansion decision and its evidence. A subscription becomes appropriate for networks with recurring location decisions, stored portfolios, licensed enrichment and collaboration. Avoid forcing a one-off founder to subscribe forever for one lease.

Suggested **test prices only**, not market facts or established revenue:

| Offer | Ruble hypothesis | Test |
| --- | --- | --- |
| Self-service scenario | Free | Does a qualified operator reach and understand a useful result? |
| Assisted pilot, 4–6 weeks | RUB 150,000 | Will operators pay for checked business data, scenarios and decision feedback? |
| Future network workspace | RUB 25,000 / month | Is there recurring workflow across multiple sites and users? |

This table is aligned with the final STRATEGY.md and BUSINESS_MODEL_RU.md; it supersedes the preliminary report-pricing alternatives considered during research. Every offer is in Russian rubles.

These prices require interviews and paid tests. They must not be represented as already selected customer pricing. The prototype can show an “early pilot” contact path rather than a fake checkout or fictitious paid tier.

Unit economics should be bottom-up:

- Report contribution = price − licensed data − payment fees − compute − analyst/support time.
- Gross margin includes human analysis; an “AI SaaS” label does not remove it.
- Paid acquisition payback uses gross contribution, not revenue.
- Keep free trials isolated from paid data licences until qualified usage / conversion justifies the cost.
- Batch location enrichment and cache reusable facts where provider terms permit. Browser-only arithmetic has negligible marginal compute but that is not the whole service COGS.

Illustrative pilot sensitivity, aligned with the startup workbook: price RUB 150,000 minus RUB 66,000 allocated labour, RUB 19,000 data/cloud and RUB 25,000 acquisition gives RUB 40,000 contribution after acquisition. An extra ten analyst hours at RUB 1,500/hour reduce it to RUB 25,000. These are editable planning assumptions, not actual sales or verified service costs.

## 7. Market sizing and launch sequence

Do not use the entire Russian SME count or the entire UAE GDP as serviceable market. Define a list of qualified operators, their location-opening frequency, purchase frequency and price. Present the arithmetic and labelled assumptions.

Context only: Dubai DET's 2024 gastronomy report says almost 1,200 new restaurant licences were issued in 2024. This demonstrates decisions occurring in one adjacent vertical, not 1,200 confirmed customers and not the TAM of leisure venues. The report source is https://www.dubaidet.gov.ae/en/research-and-insights/-/media/files/faqs/reports/det-gastronomy-report-2024.pdf . Moscow's official competition document reports over 20,000 food-service enterprises at 1 January 2026; again this is a broad adjacent stock, not the number buying software annually: https://www.mos.ru/upload/documents/files/4975/268-RP.pdf .

Proposed first 90 days (plan, not progress):

- Interview 20 qualified operators across the target markets, intentionally recording why they do or do not need this tool. Avoid claiming these interviews have occurred.
- Run 5 design-partner decisions with each partner's own cost structure; collect actual decisions and baselines.
- Seek 3 paid pilots, not letters of praise.
- Validate one format before claiming multi-industry accuracy. Use common infrastructure but keep regional operating assumptions explicit while every calculation remains in RUB.
- Secure lawful, stable data supply only where it changes decisions enough to pay for itself.
- Record a pre-launch forecast and compare with post-opening actuals. Publish anonymised error distribution only with permission and a meaningful sample.

## 8. What the new landing page should say

Hero concept: “Проверьте экономику новой точки до договора аренды.” Supporting line: “Посчитайте нужную загрузку, допустимую аренду и окупаемость. Сравните сценарии на цифрах своего бизнеса.”

The prominent middle CTA should start the working scenario immediately without login or competitor-traffic questions. Include a result preview, how it works, supported formats and the fixed RUB calculation currency, examples of decisions, model/data explanation, and FAQ.

FAQ answers should state: history is optional; neighbouring traffic is not required; defaults are editable assumptions; free scenario works without external API access; generated results are scenarios until calibrated against real data; imported financial data storage is described accurately by the implementation.

The owner clarified that every calculation must use RUB. The Russia/UAE market hypothesis does not imply local-currency product support. “Address recognised” and “location demand validated” are different states.

## 9. Suggested build priorities

P0: separate landing, one-click demo, minimal-own-business wizard, honest provenance, correct financial edge cases, save/compare/export, no secret dependencies or external-data hard blockers.

P1: ruble-only business presets, RU/EN copy, optional CSV history, permitted geocoder and POI enrichment with coverage states, mobile flow, edit/reset safeguards.

P2: licensed spatial demand data, operator pilot cohorts, proper holdout validation, calibrated models, multi-user enterprise workflow. These are subsequent validation work, not capabilities to claim as shipped today.

## 10. Short evidence extracts

All pages below were checked on 16 November 2026. The quotations are deliberately short; current terms and coverage should be checked again before commercial deployment.

| Source | Short original extract | Why retained |
| --- | --- | --- |
| [YC / PiinPoint](https://www.ycombinator.com/companies/piinpoint) | “traffic, demographics, and available commercial real estate” | The location product depends on assembled data, not only modelling. |
| [Bestplace](https://bestplace.pro/) | “45+ видов бизнеса с моделью выручки на реальных продажах” | Direct vendor claim that a broad self-service competitor already exists. |
| [Nominatim policy](https://operations.osmfoundation.org/policies/nominatim/) | “No heavy uses (an absolute maximum of 1 request per second).” | Public service capacity is an application-wide constraint. |
| [Photon](https://github.com/komoot/photon) | “We do not give guarantees for availability” | Graceful failure is required even for a permitted demonstration integration. |
| [EC / GHS-POP](https://human-settlement.emergency.copernicus.eu/ghs_pop2023.php) | “projections to 2025 and 2030” | Future-epoch population is projected, not observed. |

