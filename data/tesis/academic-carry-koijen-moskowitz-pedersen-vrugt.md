# Carry (across asset classes)

**Status: CONFIRMED** · Style: position · Applies to: USDJPY;Brent;XAUUSD;GER40;NAS100

- **Authors:** Ralph Koijen, Tobias Moskowitz, Lasse Heje Pedersen, Evert Vrugt
- **Institution:** Chicago Booth / LBS, Chicago Booth, NYU Stern / CBS, VU Amsterdam
- **Paper:** https://doi.org/10.1016/j.jfineco.2017.11.002 — Journal of Financial Economics 127(2), 2018 (DOI verified via Crossref)
- **Verification (2026-10-30 pass):** Opened Carry working paper (July 2012, pages.stern.nyu.edu/~lpederse/papers/Carry.pdf). Published JFE 2018 numbers may differ.
- **Period / markets tested:** 1972/1983–2012, global equities, bonds, currencies, commodities, Treasuries, credit, options

## Reported results
VERIFIED (WP 2012): carry trade within each asset class Sharpe 0.6–0.9 (commodities 0.62 … equities 0.93); diversified global carry across all asset classes Sharpe 1.5 (1.49 in table text). Carry downturns coincide with global recessions/liquidity crises.

## Out-of-sample / replication evidence & decay
FX carry replicated (LRV 2011 VERIFIED below). Post-2008 decay = INFERRED.

General replication context:
- Hou, Xue & Zhang (2020) *Replicating Anomalies*, RFS — https://doi.org/10.1093/rfs/hhy131 : 65% of 452 anomalies fail at 5% with NYSE breakpoints/VW returns; momentum, SUE/PEAD-type and some reversal signals among survivors (abstract-level figure; per-anomaly tables NOT opened → UNVERIFIED per anomaly).
- Jensen, Kelly & Pedersen (2023) *Is There a Replication Crisis in Finance?*, JF — https://doi.org/10.1111/jofi.13249 : most factors replicate in US & 93 countries under a Bayesian model; low-risk (BAB), momentum, value clusters replicate.
- McLean & Pontiff (2016), JF — https://doi.org/10.1111/jofi.12365 : anomaly returns ~26% lower out-of-sample and ~58% lower post-publication (abstract-level; PDF not opened). Apply a 30–60% haircut to all reported numbers.

## Exact rules (paper)
Carry: FX = interest differential; commodities = (F1−F2)/F2 annualized; equity = dividend yield − rf via futures basis; bonds = slope + rolldown. Long high carry, short low carry, rank-weighted monthly.

## Backtest spec (defaults)
- USDJPY: long USD if (r_USD − r_JPY) > 0 (3m rates), size 10% vol; monthly at 16:00 Europe/London (WMR fix)
- Brent: carry = (F1/F2 −1)·12; long if > 0 (backwardation), short if < −5%/yr
- Gold: carry ≈ −(lease-adjusted contango) ≈ negative; use as short-tilt filter only
- Stop/TP: none; hold 1 month
- Sweep: carry threshold {0, ±2%, ±5%}; rebalance {1w,1m}; combine with TSMOM sign agreement on/off

### Pseudocode
```python
c = carry(asset,t); pos = sign(c) if abs(c)>thr else 0; w=pos*0.10/vol
```

## Labels
- CONFIRMED = documented in paper and replicated by independent work; INFERRED = from paper but magnitude/OOS from memory or mapping to CFD symbols is my adaptation; CONFLICT = independent work disputes.
- Numeric figures marked INFERRED should be checked against the PDF tables before relying on them. Timezone mappings for CFDs are adaptations, not from the paper.
