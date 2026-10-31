# Market Intraday Momentum (first half-hour predicts last half-hour)

**Status: CONFIRMED** · Style: intraday · Applies to: NAS100;GER40

- **Authors:** Lei Gao, Yufeng Han, Sophia Zhengzi Li, Guofu Zhou
- **Institution:** Iowa State, UNC Charlotte, Rutgers, Washington Univ. in St. Louis (Olin)
- **Paper:** https://doi.org/10.1016/j.jfineco.2018.05.009 — Journal of Financial Economics 129(2), 2018 (DOI verified via Crossref)
- **Verification (2026-10-30 pass):** Opened published JFE PDF (court-filed copy: storage.courtlistener.com …161.2.pdf). Figures from Table 1 & Table 6.
- **Period / markets tested:** SPY 1993–2013 (plus other ETFs); 30-min intraday returns

## Reported results
VERIFIED: SPY 1993–2013. r1 (prev close→10:00 ET) predicts r13 (15:30→16:00): slope 6.94 (×100), R² 1.6% (Table 1 Panel A); adding r12 → R² 2.6%; out-of-sample R² 1.4% / 2.0%. Timing strategy η(r1): 6.67% p.a., st.dev 6.19%, Sharpe 1.08, skew 0.90 (Table 6 Panel A) vs Always-long last half-hour −1.11% p.a. (Sharpe −0.18) and Buy-and-hold 6.04% p.a. (Sharpe 0.29). Stronger on high-vol, high-volume, recession and news days; also in 10 other ETFs.

## Out-of-sample / replication evidence & decay
Li, Sakkas & Urquhart (2022) JFM https://doi.org/10.1016/j.finmar.2021.100619 (16 markets; title/DOI verified, numbers UNVERIFIED). Baltussen et al. (2021) find r1 weaker than rest-of-day return across asset classes and r12 does not extend to commodities/FX (VERIFIED from their intro). Post-2013 decay: UNVERIFIED.

General replication context:
- Hou, Xue & Zhang (2020) *Replicating Anomalies*, RFS — https://doi.org/10.1093/rfs/hhy131 : 65% of 452 anomalies fail at 5% with NYSE breakpoints/VW returns; momentum, SUE/PEAD-type and some reversal signals among survivors (abstract-level figure; per-anomaly tables NOT opened → UNVERIFIED per anomaly).
- Jensen, Kelly & Pedersen (2023) *Is There a Replication Crisis in Finance?*, JF — https://doi.org/10.1111/jofi.13249 : most factors replicate in US & 93 countries under a Bayesian model; low-risk (BAB), momentum, value clusters replicate.
- McLean & Pontiff (2016), JF — https://doi.org/10.1111/jofi.12365 : anomaly returns ~26% lower out-of-sample and ~58% lower post-publication (abstract-level; PDF not opened). Apply a 30–60% haircut to all reported numbers.

## Exact rules (paper)
If r(prev close→10:00 ET) > 0 go long at 15:30 ET, else short; exit at 16:00 ET close. Optionally add r(15:00→15:30) as second predictor.

## Backtest spec (defaults)
- NAS100: signal r1 = close(10:00 America/New_York)/prior close(16:00)-1; entry 15:30 ET, exit 16:00 ET (market-on-close)
- GER40 analogue: r1 = prior Xetra close 17:30 Europe/Berlin → 09:30 Berlin; entry 17:00, exit 17:30 Berlin
- Filter: trade only if |r1| > 0.10% (default) — paper trades all days
- Stop: none (30-min hold); TP: none
- Costs: 1 bp/side
- Sweep: threshold ∈ {0,0.05,0.10,0.25,0.5%}; entry ∈ {15:00,15:30,15:45}; add r12 (15:00–15:30) agreement filter on/off; high-vol day filter (VIX>20) on/off

### Pseudocode
```python
for d in days:
  r1 = px(d,'10:00')/close(d-1)-1
  if abs(r1) < thr: continue
  pos = sign(r1)
  pnl += pos*(close(d)/px(d,'15:30')-1) - cost
```

## Rotation re-check 2026-10-31 (CONFLICT: decay since 2021 in ES)
**Sources (opened 2026-10-31):**
- Perfiltrade, independent data site (CC BY 4.0). ES/ZN front-month 1-min data, 2010-06-07 → 2026-10-09; costs 1 tick per side + USD 4.50 round trip:
  - https://www.perfiltrade.com/en/learn/rth-vs-globex-futures
  - https://www.perfiltrade.com/datos/en/efectos-famosos-antes-despues.csv
- Boyarchenko, Larsen & Whelan, "The Disappearing Overnight Drift" (NY Fed Liberty Street, 1 Jul 2026), showing the same post-2021 collapse in end-of-day imbalance dispersion: https://libertystreeteconomics.newyorkfed.org/2026/07/the-disappearing-overnight-drift/

| Item | Paper (SPY 1993–2013) | Independent ES 1-min | Status |
|---|---|---|---|
| Last half hour 15:30–16:00 ET, traded in the direction of the move since the previous close | η(r1) 6.67% p.a., Sharpe 1.08 (signal = prev close→10:00 only) | 2010–May 2020 **+1.68 bp** [0.55, 3.00], n 2,483. Jun 2021–Oct 2026 **−0.42 bp** [−1.82, 0.92], n 1,337 | **CONFLICT (decayed post-2021)** |
| Net of costs (ES) | paper: 1 bp/side assumption in our spec | **−1.50 bp** (2010–2020), **−1.52 bp** (full history) | **CONFLICT** |
| ZN last half hour | n/a | +0.39 → +0.79 bp gross; net −2.33 from Jun 2021 | CONFIRMED weak, net negative |

Notes:
- **Signal difference:** Perfiltrade's signal is the return from the previous close to 15:30, which is closer to the Baltussen et al. "rest of day" signal than to the paper's r1 (prev close→10:00). Treat it as a near replication, not an exact one (INFERRED).
- **Our 1 bp/side default** (2 bp round trip) is above the ES gross effect in every period. For NAS100 CFD at 2.5 pts (about 1.2 bp at 20,000), the post-2021 gross is negative before costs.
- **Spec change (2026-10-31):**
  - split results 2020-01-01 → 2021-05-31 vs 2021-06-01 → 2026-10-30;
  - add a variant signal r = close(15:30)/prev close − 1;
  - report gross/cost coverage;
  - add the regime filter "trade only when the 250-day std of the end-of-day tick-volume imbalance is in its top tercile" (INFERRED from the Boyarchenko et al. mechanism).
- **Status after re-check:** the in-sample paper result stays CONFIRMED; 2021–2026 tradability is **CONFLICT (decayed; net negative in ES)**. Backups: /workspace/tmp0230/bak-academic-intraday-momentum-gao-han-li-zhou.md

## Labels
- CONFIRMED = documented in paper and replicated by independent work; INFERRED = from paper but magnitude/OOS from memory or mapping to CFD symbols is my adaptation; CONFLICT = independent work disputes.
- Numeric figures marked INFERRED should be checked against the PDF tables before relying on them. Timezone mappings for CFDs are adaptations, not from the paper.
