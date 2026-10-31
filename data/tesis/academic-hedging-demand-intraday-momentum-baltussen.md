# Hedging Demand & Market Intraday Momentum (rest-of-day → last 30 min)

**Status: CONFIRMED** · Style: intraday · Applies to: NAS100;GER40;XAUUSD;Brent;USDJPY

- **Authors:** Guido Baltussen, Zhi Da, Sten Lammers, Martin Martens
- **Institution:** Erasmus Univ. Rotterdam / Robeco, Univ. of Notre Dame (Da)
- **Paper:** https://doi.org/10.1016/j.jfineco.2021.04.029 — Journal of Financial Economics 142(1), 2021 (DOI verified via Crossref)
- **Verification (2026-10-30 pass):** Read JFE abstract + introduction (author PDF academicweb.nd.edu/~zda/intramom.pdf via search extract). Per-market tables not opened.
- **Period / markets tested:** 1974–2020, 60+ futures on equity indices, bonds, commodities, currencies

## Reported results
VERIFIED: 60+ futures, 1974–2020; rest-of-day return (prev close → close−30m) predicts last 30 min in all asset classes; simple strategy annualized Sharpe 0.87–1.73 at the asset-class level (Introduction). Effect reverts over next days; stronger when option dealers' negative gamma exposure is larger. Per-instrument Sharpe for gold/Brent/JPY: UNVERIFIED.

## Out-of-sample / replication evidence & decay
Robust across sub-periods 1974–2020 per authors (VERIFIED, intro). Independent replication of this specific rROD signal: UNVERIFIED.

General replication context:
- Hou, Xue & Zhang (2020) *Replicating Anomalies*, RFS — https://doi.org/10.1093/rfs/hhy131 : 65% of 452 anomalies fail at 5% with NYSE breakpoints/VW returns; momentum, SUE/PEAD-type and some reversal signals among survivors (abstract-level figure; per-anomaly tables NOT opened → UNVERIFIED per anomaly).
- Jensen, Kelly & Pedersen (2023) *Is There a Replication Crisis in Finance?*, JF — https://doi.org/10.1111/jofi.13249 : most factors replicate in US & 93 countries under a Bayesian model; low-risk (BAB), momentum, value clusters replicate.
- McLean & Pontiff (2016), JF — https://doi.org/10.1111/jofi.12365 : anomaly returns ~26% lower out-of-sample and ~58% lower post-publication (abstract-level; PDF not opened). Apply a 30–60% haircut to all reported numbers.

## Exact rules (paper)
Signal = r(prior close → close−30min). Trade in signal direction during last 30 min of the regular session; flat overnight.

## Backtest spec (defaults)
- Signal: r_ROD = px(close−30m)/prior_close−1
- NAS100: entry 15:30 America/New_York, exit 16:00; GER40: entry 17:00, exit 17:30 Europe/Berlin
- XAUUSD (COMEX GC pit-equivalent): entry 13:00, exit 13:30 America/New_York; Brent (ICE): entry 19:00, exit 19:30 Europe/London; USDJPY: use 16:00 London fix window 15:30–16:00 Europe/London (INFERRED mapping)
- Size: 1 unit vol-scaled to 10% annual; no stop/TP (30-min hold)
- Sweep: window ∈ {15,30,60 min}; threshold |r| ∈ {0,0.1,0.25%}; gamma-proxy filter (VIX>20 or big prior move) on/off

### Pseudocode
```python
r = px(close-30m)/prev_close-1
if abs(r)>thr: pos=sign(r); pnl=pos*(close/px(close-30m)-1)
```

## Labels
- CONFIRMED = documented in paper and replicated by independent work; INFERRED = from paper but magnitude/OOS from memory or mapping to CFD symbols is my adaptation; CONFLICT = independent work disputes.
- Numeric figures marked INFERRED should be checked against the PDF tables before relying on them. Timezone mappings for CFDs are adaptations, not from the paper.
