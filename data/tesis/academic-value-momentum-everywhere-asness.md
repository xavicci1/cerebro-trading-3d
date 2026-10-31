# Value and Momentum Everywhere

**Status: CONFIRMED** · Style: position · Applies to: XAUUSD;Brent;USDJPY;NAS100;GER40

- **Authors:** Clifford Asness, Tobias Moskowitz, Lasse Heje Pedersen
- **Institution:** AQR, Chicago Booth, NYU Stern / Copenhagen BS
- **Paper:** https://doi.org/10.1111/jofi.12021 — Journal of Finance 68(3), 2013 (DOI verified via Crossref)
- **Verification (2026-10-30 pass):** Opened published JF PDF (author copy ValMomEverywhere.pdf).
- **Period / markets tested:** 1972–2011, 8 markets: stocks (US, UK, Europe, Japan), country indices, govt bonds, currencies, commodities

## Reported results
VERIFIED: 8 markets/asset classes, 1972–2011; value and momentum premia in every asset class, negatively correlated; global 50/50 value+momentum combination 'annual Sharpe ratio of 1.45' (Section II), ~3× US equity premium Sharpe.

## Out-of-sample / replication evidence & decay
JKP 2023 clusters replicate (abstract-level). Value 2010–2020 drawdown = INFERRED (not from an opened paper).

General replication context:
- Hou, Xue & Zhang (2020) *Replicating Anomalies*, RFS — https://doi.org/10.1093/rfs/hhy131 : 65% of 452 anomalies fail at 5% with NYSE breakpoints/VW returns; momentum, SUE/PEAD-type and some reversal signals among survivors (abstract-level figure; per-anomaly tables NOT opened → UNVERIFIED per anomaly).
- Jensen, Kelly & Pedersen (2023) *Is There a Replication Crisis in Finance?*, JF — https://doi.org/10.1111/jofi.13249 : most factors replicate in US & 93 countries under a Bayesian model; low-risk (BAB), momentum, value clusters replicate.
- McLean & Pontiff (2016), JF — https://doi.org/10.1111/jofi.12365 : anomaly returns ~26% lower out-of-sample and ~58% lower post-publication (abstract-level; PDF not opened). Apply a 30–60% haircut to all reported numbers.

## Exact rules (paper)
Cross-sectional: momentum = return t-12→t-1 (skip month); value for FX = 5-yr PPP-type reversal (−5y return), commodities = −5y return, indices = B/M. Rank, long top/short bottom rank-weighted, monthly.

## Backtest spec (defaults)
- Universe (cross-sectional, needs ≥6 assets): 10 FX vs USD, 8 commodities (gold, Brent, WTI, copper, silver, natgas, corn, soy), 10 equity indices
- Momentum: r(t-252..t-21); Value: −r(t-1260..t-63) (paper's 5-yr reversal proxy)
- Rank weights w_i = c·(rank_i − mean rank), Σ|w|=2; rebalance month-end 16:00 America/New_York
- Combo 50/50 value+momentum; scale to 10% vol
- Sweep: mom lookback {6,9,12m}; skip {0,1m}; value horizon {3,5y}; combo weight {0,.25,.5,.75,1}

### Pseudocode
```python
mom=ret(252,21); val=-ret(1260,63)
w = 0.5*rankw(mom)+0.5*rankw(val); scale_to_vol(w,0.10)
```

## Labels
- CONFIRMED = documented in paper and replicated by independent work; INFERRED = from paper but magnitude/OOS from memory or mapping to CFD symbols is my adaptation; CONFLICT = independent work disputes.
- Numeric figures marked INFERRED should be checked against the PDF tables before relying on them. Timezone mappings for CFDs are adaptations, not from the paper.
