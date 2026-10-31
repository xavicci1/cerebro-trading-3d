# Gold Valuation: Real Price Mean Reversion & Real Yields (Golden Dilemma)

**Status: CONFLICT** · Style: position · Applies to: XAUUSD

- **Authors:** Claude B. Erb, Campbell R. Harvey
- **Institution:** Duke University Fuqua (Harvey) / NBER
- **Paper:** https://doi.org/10.2469/faj.v69.n4.1 — Financial Analysts Journal 69(4), 2013 (NBER WP 18706 opened); update: 'Is There Still a Golden Dilemma?' SSRN 2024 https://doi.org/10.2139/ssrn.4807895 (DOI verified via Crossref)
- **Verification (2026-10-30 pass):** Opened NBER WP 18706; FAJ DOI verified via Crossref; 2024 update DOI found via Crossref, not opened.
- **Period / markets tested:** US data since 1975 (futures) with long historical context

## Reported results
VERIFIED (NBER WP 18706): real price of gold (gold/CPI) mean-reverts over roughly ten years; when above average, subsequent real gold returns below average; at Mar-2012 the real price was 7.3 vs 3.36 average since futures inception; scatter implied ~−10%/yr next-10y real return but authors stress it is not a stable relationship. Correlation of 10y TIPS real yield with real gold price = −0.82, but authors argue causality is debatable. Gold is an unreliable inflation hedge over practical horizons.

## Out-of-sample / replication evidence & decay
CONFLICT/INFERRED: gold fell 2013–2015 (consistent) but reached new record highs 2024–2025 despite high real yields (my knowledge, not from an opened paper); 2024 SSRN update not opened. Not a trading backtest — a slow valuation regime filter.

General replication context:
- Hou, Xue & Zhang (2020) *Replicating Anomalies*, RFS — https://doi.org/10.1093/rfs/hhy131 : 65% of 452 anomalies fail at 5% with NYSE breakpoints/VW returns; momentum, SUE/PEAD-type and some reversal signals among survivors (abstract-level figure; per-anomaly tables NOT opened → UNVERIFIED per anomaly).
- Jensen, Kelly & Pedersen (2023) *Is There a Replication Crisis in Finance?*, JF — https://doi.org/10.1111/jofi.13249 : most factors replicate in US & 93 countries under a Bayesian model; low-risk (BAB), momentum, value clusters replicate.
- McLean & Pontiff (2016), JF — https://doi.org/10.1111/jofi.12365 : anomaly returns ~26% lower out-of-sample and ~58% lower post-publication (abstract-level; PDF not opened). Apply a 30–60% haircut to all reported numbers.

## Exact rules (paper)
Valuation tilt: reduce/underweight gold when real price (gold/CPI) > 1.5× its long-run average; overweight when < average. Optional real-yield overlay: long gold when 10y TIPS yield falling over 6m.

## Backtest spec (defaults)
- Monthly at last trading day 17:00 America/New_York
- RealPx = XAUUSD / CPI-U (rebased); z = RealPx / mean(RealPx since 1975)
- Weight = clip(1.5 − 0.5·z, 0, 1) long-only (default); overlay: +0.25 if Δ6m(10y TIPS) < 0
- Stop: none; holding monthly
- Sweep: anchor {since-1975 mean, 20y rolling}; threshold z {1,1.5,2}; overlay on/off; combine with 12m TSMOM

### Pseudocode
```python
z = (px/cpi)/mean_hist; w = clip(1.5-0.5*z,0,1) + (0.25 if tips.diff(126)<0 else 0)
```

## Labels
- CONFIRMED = documented in paper and replicated by independent work; INFERRED = from paper but magnitude/OOS from memory or mapping to CFD symbols is my adaptation; CONFLICT = independent work disputes.
- Numeric figures marked INFERRED should be checked against the PDF tables before relying on them. Timezone mappings for CFDs are adaptations, not from the paper.
