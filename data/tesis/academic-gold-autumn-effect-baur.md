# Gold Autumn Effect (September & November)

**Status: INFERRED** · Style: position · Applies to: XAUUSD

- **Authors:** Dirk G. Baur
- **Institution:** University of Technology Sydney (later UWA)
- **Paper:** https://doi.org/10.1016/j.ribaf.2012.05.001 — Research in International Business and Finance 27(1), 2013, pp.1–11 (DOI verified via Crossref)
- **Verification (2026-10-30 pass):** Abstract-level; PDF not opened.
- **Period / markets tested:** Daily gold returns 1980–2010

## Reported results
VERIFIED (abstract via ScienceDirect/RePEc): September and November are the only months with significantly positive gold returns, averaging 2.2% (Sep) and 1.8% (Nov); persists after risk controls; associated with higher volatility. Proposed drivers: hedging ahead of equity Halloween season, Indian wedding-season jewelry demand.

## Out-of-sample / replication evidence & decay
Independent post-2010 replication: UNVERIFIED (none opened). Single-author, 2nd-tier journal → treat as weak prior.

General replication context:
- Hou, Xue & Zhang (2020) *Replicating Anomalies*, RFS — https://doi.org/10.1093/rfs/hhy131 : 65% of 452 anomalies fail at 5% with NYSE breakpoints/VW returns; momentum, SUE/PEAD-type and some reversal signals among survivors (abstract-level figure; per-anomaly tables NOT opened → UNVERIFIED per anomaly).
- Jensen, Kelly & Pedersen (2023) *Is There a Replication Crisis in Finance?*, JF — https://doi.org/10.1111/jofi.13249 : most factors replicate in US & 93 countries under a Bayesian model; low-risk (BAB), momentum, value clusters replicate.
- McLean & Pontiff (2016), JF — https://doi.org/10.1111/jofi.12365 : anomaly returns ~26% lower out-of-sample and ~58% lower post-publication (abstract-level; PDF not opened). Apply a 30–60% haircut to all reported numbers.

## Exact rules (paper)
Long gold during September and November; flat otherwise.

## Backtest spec (defaults)
- XAUUSD: buy last trading day of Aug and Oct at 17:00 America/New_York; sell last trading day of Sep and Nov 17:00
- Stop: −5% hard; no TP
- Sweep: months {Sep},{Nov},{Sep,Nov},{Aug–Nov}; combine with 12m TSMOM filter on/off; sample split 1980–2010 vs 2011–present (mandatory OOS check)

### Pseudocode
```python
pos = 1 if month in (9,11) else 0
```

## Labels
- CONFIRMED = documented in paper and replicated by independent work; INFERRED = from paper but magnitude/OOS from memory or mapping to CFD symbols is my adaptation; CONFLICT = independent work disputes.
- Numeric figures marked INFERRED should be checked against the PDF tables before relying on them. Timezone mappings for CFDs are adaptations, not from the paper.
