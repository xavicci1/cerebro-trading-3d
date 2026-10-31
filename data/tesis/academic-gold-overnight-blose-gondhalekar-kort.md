# Gold Overnight vs Day Returns

**Status: CONFLICT** · Style: intraday · Applies to: XAUUSD

- **Authors:** Laurence E. Blose, Vijay Gondhalekar, Alan Kort
- **Institution:** Grand Valley State University; Fifth Third Bank
- **Paper:** https://doi.org/10.1007/s12197-017-9403-0 — Journal of Economics and Finance 42(3), 2018, pp.526–549 (DOI verified via Crossref)
- **Verification (2026-10-30 pass):** Abstract-level (RePEc); DOI verified via Crossref.
- **Period / markets tested:** COMEX front gold futures, London Fix spot, gold miners, gold CEFs/ETFs (sample years UNVERIFIED)

## Reported results
VERIFIED (abstract, RePEc): overnight returns significantly positive and day returns significantly negative in COMEX front gold futures, London fix, gold miners and gold funds; present in both up and down gold markets; 'economically important even with transaction costs'. Magnitudes UNVERIFIED.

## Out-of-sample / replication evidence & decay
CONFLICT: earlier literature found the opposite (negative overnight / positive daytime) per search summary — period-dependent. Not a top-tier journal.

General replication context:
- Hou, Xue & Zhang (2020) *Replicating Anomalies*, RFS — https://doi.org/10.1093/rfs/hhy131 : 65% of 452 anomalies fail at 5% with NYSE breakpoints/VW returns; momentum, SUE/PEAD-type and some reversal signals among survivors (abstract-level figure; per-anomaly tables NOT opened → UNVERIFIED per anomaly).
- Jensen, Kelly & Pedersen (2023) *Is There a Replication Crisis in Finance?*, JF — https://doi.org/10.1111/jofi.13249 : most factors replicate in US & 93 countries under a Bayesian model; low-risk (BAB), momentum, value clusters replicate.
- McLean & Pontiff (2016), JF — https://doi.org/10.1111/jofi.12365 : anomaly returns ~26% lower out-of-sample and ~58% lower post-publication (abstract-level; PDF not opened). Apply a 30–60% haircut to all reported numbers.

## Exact rules (paper)
Long gold from COMEX pit/day-session close to next open; flat during day (optionally short day session).

## Backtest spec (defaults)
- XAUUSD: buy 13:30 America/New_York (COMEX settlement), sell 08:20 America/New_York next day (COMEX day open)
- Variant: London AM fix 10:30 Europe/London → PM fix 15:00 London = 'day' leg (short), PM→next AM = 'overnight' leg (long)
- Stop: none; cost 3 bp/side + CFD swap
- Sweep: exit {08:20, 09:00, 10:30 London fix}; long-overnight only vs long-overnight+short-day; trend filter on/off; subsample by year

### Pseudocode
```python
pnl += open_next/settle - 1 - cost
```

## Labels
- CONFIRMED = documented in paper and replicated by independent work; INFERRED = from paper but magnitude/OOS from memory or mapping to CFD symbols is my adaptation; CONFLICT = independent work disputes.
- Numeric figures marked INFERRED should be checked against the PDF tables before relying on them. Timezone mappings for CFDs are adaptations, not from the paper.
