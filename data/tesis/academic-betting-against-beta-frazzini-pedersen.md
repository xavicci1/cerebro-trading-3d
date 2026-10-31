# Betting Against Beta

**Status: CONFLICT** · Style: position · Applies to: NAS100 (stock basket)

- **Authors:** Andrea Frazzini, Lasse Heje Pedersen
- **Institution:** AQR / NYU Stern
- **Paper:** https://doi.org/10.1016/j.jfineco.2013.10.005 — Journal of Financial Economics 111(1), 2014 (DOI verified via Crossref)
- **Verification (2026-10-30 pass):** Opened BAB final draft (May 2013, pages.stern.nyu.edu/~lpederse/papers/BettingAgainstBeta.pdf). Novy-Marx & Velikov only title/DOI verified.
- **Period / markets tested:** US stocks 1926–2012, 19 intl equity markets, bonds, credit, FX, commodities

## Reported results
VERIFIED: US BAB factor Sharpe 0.78, 1926–Mar 2012 (≈2× value effect); alphas/Sharpes decline almost monotonically in beta across US, 20 intl equity markets, Treasuries, credit, futures.

## Out-of-sample / replication evidence & decay
Novy-Marx & Velikov (2022) JFE critique — numbers UNVERIFIED. CONFLICT stands.

General replication context:
- Hou, Xue & Zhang (2020) *Replicating Anomalies*, RFS — https://doi.org/10.1093/rfs/hhy131 : 65% of 452 anomalies fail at 5% with NYSE breakpoints/VW returns; momentum, SUE/PEAD-type and some reversal signals among survivors (abstract-level figure; per-anomaly tables NOT opened → UNVERIFIED per anomaly).
- Jensen, Kelly & Pedersen (2023) *Is There a Replication Crisis in Finance?*, JF — https://doi.org/10.1111/jofi.13249 : most factors replicate in US & 93 countries under a Bayesian model; low-risk (BAB), momentum, value clusters replicate.
- McLean & Pontiff (2016), JF — https://doi.org/10.1111/jofi.12365 : anomaly returns ~26% lower out-of-sample and ~58% lower post-publication (abstract-level; PDF not opened). Apply a 30–60% haircut to all reported numbers.

## Exact rules (paper)
Rank by beta (1y vol × 5y corr), long low-beta levered to β=1, short high-beta de-levered to β=1, monthly.

## Backtest spec (defaults)
- Not directly applicable to the 6 target symbols; apply to Nasdaq-100 constituents
- β = corr(5y, 3d overlapping) × σ_i/σ_m (1y daily); rebalance month-end 16:00 America/New_York
- Long bottom-30% β scaled to β=1, short top-30% scaled to β=1; value-weighted (Novy-Marx fix)
- Sweep: weighting {rank, VW}; β window {1,3,5y}

### Pseudocode
```python
beta=est(); L=bottom30; S=top30; w=L/beta_L - S/beta_S
```

## Labels
- CONFIRMED = documented in paper and replicated by independent work; INFERRED = from paper but magnitude/OOS from memory or mapping to CFD symbols is my adaptation; CONFLICT = independent work disputes.
- Numeric figures marked INFERRED should be checked against the PDF tables before relying on them. Timezone mappings for CFDs are adaptations, not from the paper.
