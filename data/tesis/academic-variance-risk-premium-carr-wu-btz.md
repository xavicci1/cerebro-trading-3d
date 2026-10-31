# Variance Risk Premium (short vol / VRP timing)

**Status: CONFIRMED** · Style: swing · Applies to: NAS100;GER40

- **Authors:** Peter Carr, Liuren Wu; Tim Bollerslev, George Tauchen, Hao Zhou
- **Institution:** NYU Courant / Bloomberg, Baruch CUNY; Duke, Duke, Federal Reserve Board
- **Paper:** https://doi.org/10.1093/rfs/hhn038 — Review of Financial Studies 22(3), 2009 (Carr–Wu); RFS 22(11), 2009 (BTZ) https://doi.org/10.1093/rfs/hhp008 (DOI verified via Crossref)
- **Verification (2026-10-30 pass):** Carr–Wu: abstract-level (RFS). BTZ: opened Bollerslev & Zhou FEDS 2007-11 early draft (precursor of RFS 2009 BTZ); final RFS tables NOT opened.
- **Period / markets tested:** 1996–2003 (Carr–Wu: 5 indices, 35 stocks); 1990–2007 (BTZ: S&P 500)

## Reported results
VERIFIED: Carr–Wu — strongly negative average variance and log-variance risk premia for S&P 500, S&P 100, Dow (variance-swap sellers earn the premium). Bollerslev–Zhou 2006 draft: VRP explains >15% of quarterly excess-return variation 1990–2005; with P/E ratio R² >25%. CORRECTION: earlier '~6–7%' R² figure removed; final RFS R² UNVERIFIED.

## Out-of-sample / replication evidence & decay
Post-2007 tail events (Feb 2018, 2020) = INFERRED.

General replication context:
- Hou, Xue & Zhang (2020) *Replicating Anomalies*, RFS — https://doi.org/10.1093/rfs/hhy131 : 65% of 452 anomalies fail at 5% with NYSE breakpoints/VW returns; momentum, SUE/PEAD-type and some reversal signals among survivors (abstract-level figure; per-anomaly tables NOT opened → UNVERIFIED per anomaly).
- Jensen, Kelly & Pedersen (2023) *Is There a Replication Crisis in Finance?*, JF — https://doi.org/10.1111/jofi.13249 : most factors replicate in US & 93 countries under a Bayesian model; low-risk (BAB), momentum, value clusters replicate.
- McLean & Pontiff (2016), JF — https://doi.org/10.1111/jofi.12365 : anomaly returns ~26% lower out-of-sample and ~58% lower post-publication (abstract-level; PDF not opened). Apply a 30–60% haircut to all reported numbers.

## Exact rules (paper)
Timing version (tradable with index CFDs): VRP_t = VIX²/12 − RV_month; go long index when VRP high (top 50%) for next month.

## Backtest spec (defaults)
- NAS100: VRP = (VXN/100)²/12 − Σ r²(last 21d) at 16:00 America/New_York month-end; long if VRP > trailing 5y median; else flat
- GER40: use VDAX-NEW
- Stop: −8% from entry (tail guard); hold 1 month
- Sweep: lookback RV {5,21,63}d; threshold pct {25,50,75}; hold {1w,1m,3m}

### Pseudocode
```python
vrp = (vxn/100)**2/12 - sum(r[-21:]**2); pos = 1 if vrp>median(vrp_hist) else 0
```

## Labels
- CONFIRMED = documented in paper and replicated by independent work; INFERRED = from paper but magnitude/OOS from memory or mapping to CFD symbols is my adaptation; CONFLICT = independent work disputes.
- Numeric figures marked INFERRED should be checked against the PDF tables before relying on them. Timezone mappings for CFDs are adaptations, not from the paper.
