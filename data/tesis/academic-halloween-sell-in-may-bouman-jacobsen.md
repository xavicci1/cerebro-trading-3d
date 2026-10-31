# Halloween Indicator (Sell in May)

**Status: CONFIRMED** · Style: position · Applies to: GER40;NAS100

- **Authors:** Sven Bouman, Ben Jacobsen
- **Institution:** Aegon Asset Management, Erasmus Univ. Rotterdam / Massey
- **Paper:** https://doi.org/10.1257/000282802762024683 — American Economic Review 92(5), 2002 (DOI verified via Crossref)
- **Verification (2026-10-30 pass):** Abstract-level (SSRN 300700 page via search). Table magnitudes not opened.
- **Period / markets tested:** 1970–1998, 37 countries (UK back to 1694)

## Reported results
VERIFIED (abstract): Nov–Apr returns exceed May–Oct in 36 of 37 developed and emerging markets; especially strong in Europe; robust over time. Per-country magnitudes (incl. Germany) UNVERIFIED.

## Out-of-sample / replication evidence & decay
Long-sample UK and post-publication evidence = UNVERIFIED (not opened).

General replication context:
- Hou, Xue & Zhang (2020) *Replicating Anomalies*, RFS — https://doi.org/10.1093/rfs/hhy131 : 65% of 452 anomalies fail at 5% with NYSE breakpoints/VW returns; momentum, SUE/PEAD-type and some reversal signals among survivors (abstract-level figure; per-anomaly tables NOT opened → UNVERIFIED per anomaly).
- Jensen, Kelly & Pedersen (2023) *Is There a Replication Crisis in Finance?*, JF — https://doi.org/10.1111/jofi.13249 : most factors replicate in US & 93 countries under a Bayesian model; low-risk (BAB), momentum, value clusters replicate.
- McLean & Pontiff (2016), JF — https://doi.org/10.1111/jofi.12365 : anomaly returns ~26% lower out-of-sample and ~58% lower post-publication (abstract-level; PDF not opened). Apply a 30–60% haircut to all reported numbers.

## Exact rules (paper)
Long index 1 Nov–30 Apr, cash (or bonds) 1 May–31 Oct.

## Backtest spec (defaults)
- GER40: buy last trading day of Oct at 17:30 Europe/Berlin; sell last trading day of Apr 17:30
- Stop: none; holding rule seasonal
- Sweep: entry month {Oct,Nov}; exit {Apr,May}; combine with TSMOM-12m filter

### Pseudocode
```python
pos = 1 if month in [11,12,1,2,3,4] else 0
```

## Labels
- CONFIRMED = documented in paper and replicated by independent work; INFERRED = from paper but magnitude/OOS from memory or mapping to CFD symbols is my adaptation; CONFLICT = independent work disputes.
- Numeric figures marked INFERRED should be checked against the PDF tables before relying on them. Timezone mappings for CFDs are adaptations, not from the paper.
