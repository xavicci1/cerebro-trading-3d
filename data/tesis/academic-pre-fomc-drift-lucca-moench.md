# Pre-FOMC Announcement Drift

**Status: CONFLICT** · Style: intraday · Applies to: NAS100;GER40

- **Authors:** David Lucca, Emanuel Moench
- **Institution:** Federal Reserve Bank of New York
- **Paper:** https://doi.org/10.1111/jofi.12196 — Journal of Finance 70(1), 2015 (DOI verified via Crossref)
- **Verification (2026-10-30 pass):** Opened NY Fed Staff Report 512 (rev. Aug 2013, ≈ published JF version) and Kurov et al. 2021 abstract (PMC).
- **Period / markets tested:** 1994–2011, S&P 500 futures, international indices

## Reported results
VERIFIED: Sept 1994–Mar 2011, S&P 500 rose 49 bp on average in the 24h before scheduled FOMC announcements; ~80% of annual realized excess stock returns since 1994; 24h-holding strategy annualized Sharpe above 1.1; similar in major foreign indices; pre-1994 ~20 bp (1980–1993).

## Out-of-sample / replication evidence & decay
VERIFIED: Kurov, Wolfe & Gilbert (2021) — sample extended to Dec 2019: drift 'essentially disappeared after 2015' with and without press conferences. CONFLICT stands.

General replication context:
- Hou, Xue & Zhang (2020) *Replicating Anomalies*, RFS — https://doi.org/10.1093/rfs/hhy131 : 65% of 452 anomalies fail at 5% with NYSE breakpoints/VW returns; momentum, SUE/PEAD-type and some reversal signals among survivors (abstract-level figure; per-anomaly tables NOT opened → UNVERIFIED per anomaly).
- Jensen, Kelly & Pedersen (2023) *Is There a Replication Crisis in Finance?*, JF — https://doi.org/10.1111/jofi.13249 : most factors replicate in US & 93 countries under a Bayesian model; low-risk (BAB), momentum, value clusters replicate.
- McLean & Pontiff (2016), JF — https://doi.org/10.1111/jofi.12365 : anomaly returns ~26% lower out-of-sample and ~58% lower post-publication (abstract-level; PDF not opened). Apply a 30–60% haircut to all reported numbers.

## Exact rules (paper)
Buy index 14:00 ET day before FOMC announcement, sell 14:00 ET announcement day (just before release).

## Backtest spec (defaults)
- NAS100: entry 14:00 America/New_York on T−1; exit 13:55 America/New_York on announcement day T (statement 14:00 ET)
- GER40: entry 17:00 Europe/Berlin T−1, exit 17:30 Berlin T (cash close)
- Stop: −1.5% from entry; no TP
- Sweep: entry {T−1 09:30, T−1 14:00, T 09:30}; exit {13:55, 14:30, 16:00}; sample split pre/post-2016 (mandatory)

### Pseudocode
```python
for T in fomc_dates: pnl += px(T,'13:55')/px(T-1,'14:00')-1
```

## Rotation re-check 2026-10-31 (batch 20261031-0200) — independent CFD tests 2015–2022
**Sources opened 2026-10-31:**
- KruegerAlgorithms, "Seven Published Anomalies Replicated…": https://kruegeralgorithms.com/en/research/published-anomalies-net-of-costs
- KruegerAlgorithms, macro events FOMC/NFP/CPI intraday (2026-09-29): https://kruegeralgorithms.com/en/research/macro-events-fomc-nfp-cpi-intraday

| Test (Dukascopy CFD minutes, 2015–2022, 63 FOMC dates) | Result | Status |
|---|---|---|
| Paper rule, 24 h before FOMC | gross +19.8 bps (t 2.3), without the 5 best days t 0.5; **net +16.9 bps (t 1.8)** | CONFIRMED — smaller than paper's +49 bps and driven by a few days |
| Intraday version (cash open → 13:55 NY) | gross +0.6 (t 0.15); **net −2.2 bps (t −0.4)** | CONFIRMED |
| Macro-event study: pre-FOMC cash open → 13:55 | n 63, net −2.2 to −0.4 bps (t −0.53 to −0.11); range before the statement 0.67–0.86× normal | CONFIRMED |
| Announcement premium / FOMC cycle (Cieslak et al.) | n 337, −2.6 bps (t −0.52) / n 1,035, −2.0 bps (t −0.75) | CONFIRMED |
| Whole macro study | 29 of 580 tests p < 0.05 ≈ chance | CONFIRMED |

**Verdict:** CONFLICT confirmed and strengthened. The only residual is the 24 h hold (net t 1.8, fragile to 5 days, 2015–2022, no holdout). The intraday NAS100 version in the spec above is expected ≈ 0 or negative net. Keep the post-2016 split mandatory; use the 24 h variant (entry 14:00 NY T−1, exit 13:55 NY T) as the only cell worth one pre-registered run on 2023–2026 data, costs NAS100 2.5 pts / US500 0.8 pts + one night of swap.

## Labels
- CONFIRMED = documented in paper and replicated by independent work; INFERRED = from paper but magnitude/OOS from memory or mapping to CFD symbols is my adaptation; CONFLICT = independent work disputes.
- Numeric figures marked INFERRED should be checked against the PDF tables before relying on them. Timezone mappings for CFDs are adaptations, not from the paper.
