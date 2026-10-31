# Short-Term (1-month / weekly) Reversal

**Status: INFERRED** · Style: swing · Applies to: NAS100;GER40;XAUUSD;BTC

- **Authors:** Narasimhan Jegadeesh
- **Institution:** UCLA Anderson (at time; later Emory)
- **Paper:** https://doi.org/10.1111/j.1540-6261.1990.tb05110.x — Journal of Finance 45(3), 1990 (DOI verified via Crossref)
- **Verification (2026-10-30 pass):** Abstract-level (JF; repec.udesa copy via search).
- **Period / markets tested:** US stocks 1934–1987

## Reported results
VERIFIED (abstract): 1934–1987, extreme decile portfolios formed on predicted returns differ by 2.49%/month (2.20% ex-January, 4.37% in January); significant negative 1-month and positive 12-month serial correlation.

## Out-of-sample / replication evidence & decay
Index-level analogue = INFERRED.

General replication context:
- Hou, Xue & Zhang (2020) *Replicating Anomalies*, RFS — https://doi.org/10.1093/rfs/hhy131 : 65% of 452 anomalies fail at 5% with NYSE breakpoints/VW returns; momentum, SUE/PEAD-type and some reversal signals among survivors (abstract-level figure; per-anomaly tables NOT opened → UNVERIFIED per anomaly).
- Jensen, Kelly & Pedersen (2023) *Is There a Replication Crisis in Finance?*, JF — https://doi.org/10.1111/jofi.13249 : most factors replicate in US & 93 countries under a Bayesian model; low-risk (BAB), momentum, value clusters replicate.
- McLean & Pontiff (2016), JF — https://doi.org/10.1111/jofi.12365 : anomaly returns ~26% lower out-of-sample and ~58% lower post-publication (abstract-level; PDF not opened). Apply a 30–60% haircut to all reported numbers.

## Exact rules (paper)
Cross-section: long bottom decile prior-month return, short top; monthly. Index time-series analogue: buy after N-day drop.

## Backtest spec (defaults)
- Time-series analogue: if 5-day return < −1.5σ_5d and close > SMA200 → long at 16:00 America/New_York close; exit after 5 days or close > SMA5
- Stop: −2×ATR(14)
- Sweep: lookback {1,3,5,21}d; z threshold {1,1.5,2}; hold {1,3,5,10}; trend filter on/off

### Pseudocode
```python
z=ret5/sd5; if z<-thr and c>sma200: long; exit if c>sma5 or days>=H
```

## Labels
- CONFIRMED = documented in paper and replicated by independent work; INFERRED = from paper but magnitude/OOS from memory or mapping to CFD symbols is my adaptation; CONFLICT = independent work disputes.
- Numeric figures marked INFERRED should be checked against the PDF tables before relying on them. Timezone mappings for CFDs are adaptations, not from the paper.
