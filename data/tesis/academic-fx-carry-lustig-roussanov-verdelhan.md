# FX Carry Trade & Volatility Risk

**Status: CONFIRMED** · Style: position · Applies to: USDJPY

- **Authors:** Hanno Lustig, Nikolai Roussanov, Adrien Verdelhan; Lukas Menkhoff, Lucio Sarno, Maik Schmeling, Andreas Schrimpf
- **Institution:** UCLA/Stanford, Wharton (UPenn), MIT Sloan; Hannover/Cass/BIS
- **Paper:** https://doi.org/10.1093/rfs/hhr068 — Review of Financial Studies 24(11), 2011; also Journal of Finance 67(2), 2012 https://doi.org/10.1111/j.1540-6261.2012.01728.x (DOI verified via Crossref)
- **Verification (2026-10-30 pass):** Opened NBER WP 14082 (2008) of LRV. Menkhoff et al. 2012 numbers NOT opened (UNVERIFIED).
- **Period / markets tested:** 1983–2009, up to 48 currencies (monthly forward discounts)

## Reported results
VERIFIED (NBER WP): average excess returns on low-interest-rate currencies are 4.8% p.a. smaller than on high-rate currencies; the corresponding high-minus-low strategy annualized Sharpe 0.54; HML_FX explains ~70% of variation in currency portfolio returns. Menkhoff et al.: carry returns compensate global FX volatility innovations (abstract) — magnitudes UNVERIFIED.

## Out-of-sample / replication evidence & decay
Crashes 2008/2020 = INFERRED. Published RFS numbers may differ slightly from WP.

General replication context:
- Hou, Xue & Zhang (2020) *Replicating Anomalies*, RFS — https://doi.org/10.1093/rfs/hhy131 : 65% of 452 anomalies fail at 5% with NYSE breakpoints/VW returns; momentum, SUE/PEAD-type and some reversal signals among survivors (abstract-level figure; per-anomaly tables NOT opened → UNVERIFIED per anomaly).
- Jensen, Kelly & Pedersen (2023) *Is There a Replication Crisis in Finance?*, JF — https://doi.org/10.1111/jofi.13249 : most factors replicate in US & 93 countries under a Bayesian model; low-risk (BAB), momentum, value clusters replicate.
- McLean & Pontiff (2016), JF — https://doi.org/10.1111/jofi.12365 : anomaly returns ~26% lower out-of-sample and ~58% lower post-publication (abstract-level; PDF not opened). Apply a 30–60% haircut to all reported numbers.

## Exact rules (paper)
Sort currencies by forward discount (interest differential) monthly; long top tercile, short bottom. Timing: cut exposure when global FX vol innovation high.

## Backtest spec (defaults)
- USDJPY: long USD/short JPY when US 3m − JP 3m > 1.0% (default); flat otherwise
- Vol filter: flat if 1m realized vol of USDJPY > 90th percentile of trailing 3y (Menkhoff timing)
- Rebalance: month-end 16:00 Europe/London; stop: −2.5×monthly ATR hard stop (risk control, not in paper)
- Sweep: diff threshold {0,0.5,1,2%}; vol pct {75,90,none}; stop {none,2,3 ATR}

### Pseudocode
```python
if diff>thr and vol_pct<90: pos=+1 else pos=0
```

## Labels
- CONFIRMED = documented in paper and replicated by independent work; INFERRED = from paper but magnitude/OOS from memory or mapping to CFD symbols is my adaptation; CONFLICT = independent work disputes.
- Numeric figures marked INFERRED should be checked against the PDF tables before relying on them. Timezone mappings for CFDs are adaptations, not from the paper.
