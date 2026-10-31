# Cryptocurrency Time-Series & Cross-Sectional Momentum

**Status: INFERRED** · Style: swing · Applies to: BTC

- **Authors:** Yukun Liu, Aleh Tsyvinski, Xi Wu
- **Institution:** Univ. of Rochester, Yale, UC Berkeley
- **Paper:** https://doi.org/10.1093/rfs/hhaa113 — Review of Financial Studies 34(6), 2021 (Liu & Tsyvinski); Journal of Finance 77(2), 2022 https://doi.org/10.1111/jofi.13119 (Liu, Tsyvinski & Wu) (DOI verified via Crossref)
- **Verification (2026-10-30 pass):** Opened NBER WP 24877 (Aug 2018) of Liu & Tsyvinski. Liu-Tsyvinski-Wu JF 2022 only title/DOI verified.
- **Period / markets tested:** 2011–2018 BTC/ETH/XRP; 2014–2018 1,700+ coins

## Reported results
VERIFIED (WP): one-SD increase in today's BTC return predicts +0.33% next-day return; weekly quintiles: top quintile 11.22%/week (Sharpe 0.45) vs bottom 2.60%/week (Sharpe 0.19) at 1-week horizon; momentum significant 1–4 weeks for BTC and XRP, weaker for ETH.

## Out-of-sample / replication evidence & decay
Post-2018 = INFERRED. Published RFS 2021 figures may differ from WP.

General replication context:
- Hou, Xue & Zhang (2020) *Replicating Anomalies*, RFS — https://doi.org/10.1093/rfs/hhy131 : 65% of 452 anomalies fail at 5% with NYSE breakpoints/VW returns; momentum, SUE/PEAD-type and some reversal signals among survivors (abstract-level figure; per-anomaly tables NOT opened → UNVERIFIED per anomaly).
- Jensen, Kelly & Pedersen (2023) *Is There a Replication Crisis in Finance?*, JF — https://doi.org/10.1111/jofi.13249 : most factors replicate in US & 93 countries under a Bayesian model; low-risk (BAB), momentum, value clusters replicate.
- McLean & Pontiff (2016), JF — https://doi.org/10.1111/jofi.12365 : anomaly returns ~26% lower out-of-sample and ~58% lower post-publication (abstract-level; PDF not opened). Apply a 30–60% haircut to all reported numbers.

## Exact rules (paper)
Long BTC when past 1-week (or 4-week) return > 0, else flat; weekly.

## Backtest spec (defaults)
- BTC: signal r_7d at 00:00 UTC Monday (= 20:00 America/Santo_Domingo Sunday); long if > 0, flat else (shorting optional)
- Hold 7 days; vol-target 40% annual; stop none
- Costs 10 bp/side
- Sweep: lookback {7,14,28,56}d; hold {1,7,14,28}d; long-only vs L/S

### Pseudocode
```python
if close/close.shift(7)-1>0: pos=1 else 0; rebalance weekly
```

## Labels
- CONFIRMED = documented in paper and replicated by independent work; INFERRED = from paper but magnitude/OOS from memory or mapping to CFD symbols is my adaptation; CONFLICT = independent work disputes.
- Numeric figures marked INFERRED should be checked against the PDF tables before relying on them. Timezone mappings for CFDs are adaptations, not from the paper.
