# Currency Momentum

**Status: INFERRED** · Style: swing · Applies to: USDJPY

- **Authors:** Lukas Menkhoff, Lucio Sarno, Maik Schmeling, Andreas Schrimpf
- **Institution:** Leibniz Univ. Hannover, Cass Business School (City Univ. London), BIS
- **Paper:** https://doi.org/10.1016/j.jfineco.2012.06.009 — Journal of Financial Economics 106(3), 2012 (DOI verified via Crossref)
- **Verification (2026-10-30 pass):** Abstract-level (BIS WP 366 / Bayes-City PDF via search). Tables not opened.
- **Period / markets tested:** 1976–2010, 48 currencies

## Reported results
VERIFIED (abstract): cross-sectional FX momentum excess returns up to 10% p.a.; transaction costs cut best strategy from ~10% to ~4% p.a.; returns concentrated in volatile, high-risk currencies (limits to arbitrage).

## Out-of-sample / replication evidence & decay
G10/USDJPY applicability = INFERRED (weak).

General replication context:
- Hou, Xue & Zhang (2020) *Replicating Anomalies*, RFS — https://doi.org/10.1093/rfs/hhy131 : 65% of 452 anomalies fail at 5% with NYSE breakpoints/VW returns; momentum, SUE/PEAD-type and some reversal signals among survivors (abstract-level figure; per-anomaly tables NOT opened → UNVERIFIED per anomaly).
- Jensen, Kelly & Pedersen (2023) *Is There a Replication Crisis in Finance?*, JF — https://doi.org/10.1111/jofi.13249 : most factors replicate in US & 93 countries under a Bayesian model; low-risk (BAB), momentum, value clusters replicate.
- McLean & Pontiff (2016), JF — https://doi.org/10.1111/jofi.12365 : anomaly returns ~26% lower out-of-sample and ~58% lower post-publication (abstract-level; PDF not opened). Apply a 30–60% haircut to all reported numbers.

## Exact rules (paper)
Rank currencies by past f-month return (f=1..12), hold h=1 month; long winners, short losers.

## Backtest spec (defaults)
- Apply as TSMOM on USDJPY: signal sign(r_21d), hold 21d; rebalance Fridays 17:00 America/New_York
- Stop: none; vol target 8%
- Sweep: formation {5,21,63,126,252}d; hold {5,21,63}d

### Pseudocode
```python
pos=sign(ret(f)); hold h
```

## Labels
- CONFIRMED = documented in paper and replicated by independent work; INFERRED = from paper but magnitude/OOS from memory or mapping to CFD symbols is my adaptation; CONFLICT = independent work disputes.
- Numeric figures marked INFERRED should be checked against the PDF tables before relying on them. Timezone mappings for CFDs are adaptations, not from the paper.
