# Turn-of-the-Month Effect

**Status: CONFIRMED** · Style: swing · Applies to: NAS100;GER40;BTC

- **Authors:** Josef Lakonishok, Seymour Smidt
- **Institution:** Univ. of Illinois Urbana-Champaign (Lakonishok), Cornell (Smidt)
- **Paper:** https://doi.org/10.1093/rfs/1.4.403 — Review of Financial Studies 1(4), 1988 (DOI verified via Crossref)
- **Verification (2026-10-30 pass):** Opened McConnell & Xu FAJ 2008 (Purdue author PDF via search extract) which quotes L&S; L&S original PDF not opened. McConnell & Xu DOI 10.2469/faj.v64.n2.11 VERIFIED via Crossref.
- **Period / markets tested:** DJIA 1897–1986

## Reported results
VERIFIED (as quoted by McConnell & Xu): DJIA 1897–1986, average 4-day turn-of-month (last day → day +3) return 0.473% vs 0.349% for the whole month — i.e., negative on the remaining days.

## Out-of-sample / replication evidence & decay
VERIFIED: McConnell & Xu (2008) FAJ https://doi.org/10.2469/faj.v64.n2.11 — CRSP 1926–2005: VW daily return 0.15% at TOM vs −0.001% other days (EW 0.22% vs 0.04%); persists 1987–2005; present in 31 of 35 countries; not explained by volume/fund flows. (Corrects earlier '34 of 35' — wrong.)

General replication context:
- Hou, Xue & Zhang (2020) *Replicating Anomalies*, RFS — https://doi.org/10.1093/rfs/hhy131 : 65% of 452 anomalies fail at 5% with NYSE breakpoints/VW returns; momentum, SUE/PEAD-type and some reversal signals among survivors (abstract-level figure; per-anomaly tables NOT opened → UNVERIFIED per anomaly).
- Jensen, Kelly & Pedersen (2023) *Is There a Replication Crisis in Finance?*, JF — https://doi.org/10.1111/jofi.13249 : most factors replicate in US & 93 countries under a Bayesian model; low-risk (BAB), momentum, value clusters replicate.
- McLean & Pontiff (2016), JF — https://doi.org/10.1111/jofi.12365 : anomaly returns ~26% lower out-of-sample and ~58% lower post-publication (abstract-level; PDF not opened). Apply a 30–60% haircut to all reported numbers.

## Exact rules (paper)
Long index from close of trading day −2 (before last day) to close of day +3 of new month.

## Backtest spec (defaults)
- NAS100: buy 16:00 America/New_York close on 2nd-last trading day of month; sell 16:00 close on 3rd trading day
- GER40: same with 17:30 Europe/Berlin closes
- Stop: −3% hard; no TP
- Sweep: entry {−4..−1}; exit {+1..+5}; trend filter (close>SMA200) on/off

### Pseudocode
```python
if tday_of_month == N-1 (2nd last): buy; if tday_of_month==3: sell
```

## Labels
- CONFIRMED = documented in paper and replicated by independent work; INFERRED = from paper but magnitude/OOS from memory or mapping to CFD symbols is my adaptation; CONFLICT = independent work disputes.
- Numeric figures marked INFERRED should be checked against the PDF tables before relying on them. Timezone mappings for CFDs are adaptations, not from the paper.
