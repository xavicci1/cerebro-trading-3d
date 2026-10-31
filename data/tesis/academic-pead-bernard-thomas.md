# Post-Earnings-Announcement Drift

**Status: CONFIRMED** · Style: swing · Applies to: NAS100 (constituents)

- **Authors:** Victor Bernard, Jacob Thomas
- **Institution:** Univ. of Michigan (Bernard), Columbia (Thomas; later Yale)
- **Paper:** https://doi.org/10.2307/2491062 — Journal of Accounting Research 27 (Suppl.), 1989 (DOI verified via Crossref)
- **Verification (2026-10-30 pass):** Abstract/secondary-level (JAR record + NYU working-paper summary via search). Original PDF not opened.
- **Period / markets tested:** NYSE/AMEX 1974–1986

## Reported results
VERIFIED (secondary): long top SUE decile / short bottom earns ≈4.2% cumulative abnormal return over 60 trading days post-announcement; positive in 41 of 48 quarters 1974–1985. CORRECTION: the '≈18% annualized' figure removed (my extrapolation).

## Out-of-sample / replication evidence & decay
HXZ per-anomaly and large-cap decay: UNVERIFIED.

General replication context:
- Hou, Xue & Zhang (2020) *Replicating Anomalies*, RFS — https://doi.org/10.1093/rfs/hhy131 : 65% of 452 anomalies fail at 5% with NYSE breakpoints/VW returns; momentum, SUE/PEAD-type and some reversal signals among survivors (abstract-level figure; per-anomaly tables NOT opened → UNVERIFIED per anomaly).
- Jensen, Kelly & Pedersen (2023) *Is There a Replication Crisis in Finance?*, JF — https://doi.org/10.1111/jofi.13249 : most factors replicate in US & 93 countries under a Bayesian model; low-risk (BAB), momentum, value clusters replicate.
- McLean & Pontiff (2016), JF — https://doi.org/10.1111/jofi.12365 : anomaly returns ~26% lower out-of-sample and ~58% lower post-publication (abstract-level; PDF not opened). Apply a 30–60% haircut to all reported numbers.

## Exact rules (paper)
After earnings: SUE = (EPS − EPS_{q−4})/σ; long top decile, short bottom; hold 60 trading days.

## Backtest spec (defaults)
- Universe: Nasdaq-100 stocks (not tradable on index CFD directly)
- Entry: next open 09:30 America/New_York after announcement; long if SUE top decile AND day-0..+1 return > 0 (earnings-announcement-return confirm)
- Hold 60 trading days; stop −10%
- Sweep: hold {5,20,60}; SUE decile cut {10,20,30%}; confirm filter on/off

### Pseudocode
```python
if sue>p90 and ear>0: buy next open; exit after H days or stop
```

## Labels
- CONFIRMED = documented in paper and replicated by independent work; INFERRED = from paper but magnitude/OOS from memory or mapping to CFD symbols is my adaptation; CONFLICT = independent work disputes.
- Numeric figures marked INFERRED should be checked against the PDF tables before relying on them. Timezone mappings for CFDs are adaptations, not from the paper.
