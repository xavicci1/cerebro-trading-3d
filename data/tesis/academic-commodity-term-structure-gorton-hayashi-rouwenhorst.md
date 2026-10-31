# Commodity Term Structure / Basis (Backwardation)

**Status: CONFIRMED** · Style: position · Applies to: Brent;XAUUSD

- **Authors:** Gary Gorton, Fumio Hayashi, K. Geert Rouwenhorst
- **Institution:** Yale SOM, Univ. of Tokyo / NBER, Yale SOM
- **Paper:** https://doi.org/10.1093/rof/rfs019 — Review of Finance 17(1), 2013 (NBER WP 13249) (DOI verified via Crossref)
- **Verification (2026-10-30 pass):** Opened NBER WP 13249 (2007). Table refs from WP.
- **Period / markets tested:** 1969–2006, 31 commodity futures

## Reported results
VERIFIED: 31 commodities 1969–2006. High-Basis portfolio beat EW index by 5.42% p.a.; High-minus-Low basis 10.23% p.a. (t=3.73), positive 58% of months (Table 6 Panel A). Momentum High-minus-Low 13.36% p.a. (t=4.93). EW index excess return 5.48% p.a.

## Out-of-sample / replication evidence & decay
Koijen et al. carry (commodities Sharpe 0.62, VERIFIED above) confirms basis signal. Post-2008 decay = INFERRED.

General replication context:
- Hou, Xue & Zhang (2020) *Replicating Anomalies*, RFS — https://doi.org/10.1093/rfs/hhy131 : 65% of 452 anomalies fail at 5% with NYSE breakpoints/VW returns; momentum, SUE/PEAD-type and some reversal signals among survivors (abstract-level figure; per-anomaly tables NOT opened → UNVERIFIED per anomaly).
- Jensen, Kelly & Pedersen (2023) *Is There a Replication Crisis in Finance?*, JF — https://doi.org/10.1111/jofi.13249 : most factors replicate in US & 93 countries under a Bayesian model; low-risk (BAB), momentum, value clusters replicate.
- McLean & Pontiff (2016), JF — https://doi.org/10.1111/jofi.12365 : anomaly returns ~26% lower out-of-sample and ~58% lower post-publication (abstract-level; PDF not opened). Apply a 30–60% haircut to all reported numbers.

## Exact rules (paper)
Basis = (F1/F2−1) annualized; go long commodities in backwardation, short contango; monthly.

## Backtest spec (defaults)
- Brent: basis = (F_front/F_second −1)×12; long if basis > +2%, short if < −2%, else flat
- Rebalance 5 business days before front expiry at 19:30 Europe/London (ICE settle)
- Combine with 12m TSMOM agreement (default ON)
- Stop: 3×ATR(20) trailing (not in paper)
- Sweep: threshold {0,2,5,10%}; TSMOM filter on/off; stop {none,2,3,4 ATR}

### Pseudocode
```python
b=(F1/F2-1)*12; pos=sign(b) if abs(b)>thr else 0; if filt and sign(ret252)!=pos: pos=0
```

## Labels
- CONFIRMED = documented in paper and replicated by independent work; INFERRED = from paper but magnitude/OOS from memory or mapping to CFD symbols is my adaptation; CONFLICT = independent work disputes.
- Numeric figures marked INFERRED should be checked against the PDF tables before relying on them. Timezone mappings for CFDs are adaptations, not from the paper.
