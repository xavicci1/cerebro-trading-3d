# Seasonality in the Cross-Section (same calendar month)

**Status: CONFIRMED** · Style: position · Applies to: XAUUSD;Brent;NAS100;GER40;USDJPY;BTC

- **Authors:** Steven Heston, Ronnie Sadka
- **Institution:** Univ. of Maryland, Boston College
- **Paper:** https://doi.org/10.1016/j.jfineco.2007.02.003 — Journal of Financial Economics 87(2), 2008 (DOI verified via Crossref)
- **Verification (2026-10-30 pass):** Abstract-level (JFE). Keloharju, Linnainmaa & Nyberg (2016) JF DOI 10.1111/jofi.12398 VERIFIED via Crossref; NBER WP 20815 abstract opened.
- **Period / markets tested:** US stocks 1965–2002

## Reported results
VERIFIED (abstract): stocks with high returns in a given calendar month tend to have high returns in the same month at annual lags up to 20 years; independent of size, industry, earnings, dividends, fiscal year. Spread magnitude UNVERIFIED (removed '≈1%/month').

## Out-of-sample / replication evidence & decay
Keloharju, Linnainmaa & Nyberg (2016) JF https://doi.org/10.1111/jofi.12398 — seasonalities extend to anomalies, commodities, country indices (from WP abstract; magnitudes UNVERIFIED).

General replication context:
- Hou, Xue & Zhang (2020) *Replicating Anomalies*, RFS — https://doi.org/10.1093/rfs/hhy131 : 65% of 452 anomalies fail at 5% with NYSE breakpoints/VW returns; momentum, SUE/PEAD-type and some reversal signals among survivors (abstract-level figure; per-anomaly tables NOT opened → UNVERIFIED per anomaly).
- Jensen, Kelly & Pedersen (2023) *Is There a Replication Crisis in Finance?*, JF — https://doi.org/10.1111/jofi.13249 : most factors replicate in US & 93 countries under a Bayesian model; low-risk (BAB), momentum, value clusters replicate.
- McLean & Pontiff (2016), JF — https://doi.org/10.1111/jofi.12365 : anomaly returns ~26% lower out-of-sample and ~58% lower post-publication (abstract-level; PDF not opened). Apply a 30–60% haircut to all reported numbers.

## Exact rules (paper)
For each asset: average return in the same calendar month over past 10–20 years; long assets with highest same-month mean.

## Backtest spec (defaults)
- Signal_i(m) = mean of returns in calendar month m over prior 10 years (BTC: all available)
- Long top-2 / short bottom-2 of the 6 targets; rebalance month-end 16:00 America/New_York; vol-scaled 10%
- Sweep: years {5,10,15,20}; long-only vs L/S; combine with TSMOM

### Pseudocode
```python
s = mean(ret[month==m][-years:]); w = rankw(s)
```

## Labels
- CONFIRMED = documented in paper and replicated by independent work; INFERRED = from paper but magnitude/OOS from memory or mapping to CFD symbols is my adaptation; CONFLICT = independent work disputes.
- Numeric figures marked INFERRED should be checked against the PDF tables before relying on them. Timezone mappings for CFDs are adaptations, not from the paper.
