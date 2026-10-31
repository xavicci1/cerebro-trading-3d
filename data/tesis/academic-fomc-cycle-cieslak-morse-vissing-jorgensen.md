# Stock Returns over the FOMC Cycle (even weeks)

**Status: CONFIRMED** · Style: swing · Applies to: NAS100;GER40

- **Authors:** Anna Cieslak, Adair Morse, Annette Vissing-Jorgensen
- **Institution:** Duke Fuqua, UC Berkeley Haas, UC Berkeley Haas / Fed Board
- **Paper:** https://doi.org/10.1111/jofi.12818 — Journal of Finance 74(5), 2019 (DOI verified via Crossref)
- **Verification (2026-10-30 pass):** Read JF abstract + author PDF introduction (faculty.haas.berkeley.edu/morse/…cycle_paper…pdf via search extract).
- **Period / markets tested:** 1994–2016, US stocks (and international)

## Reported results
VERIFIED: 1994–2016, US and global equity premium earned entirely in weeks 0,2,4,6 of FOMC cycle; week 0 starts the day before a scheduled FOMC announcement. Even-minus-odd difference significant and holds in the 2014–2016 sample after the first draft (in-paper OOS). About half of even-week returns = mean reversion after stock declines ('Fed put'). Exact bp per week: UNVERIFIED (Fig. 1/Table 1 not opened).

## Out-of-sample / replication evidence & decay
Post-2016 independent evidence: UNVERIFIED.

General replication context:
- Hou, Xue & Zhang (2020) *Replicating Anomalies*, RFS — https://doi.org/10.1093/rfs/hhy131 : 65% of 452 anomalies fail at 5% with NYSE breakpoints/VW returns; momentum, SUE/PEAD-type and some reversal signals among survivors (abstract-level figure; per-anomaly tables NOT opened → UNVERIFIED per anomaly).
- Jensen, Kelly & Pedersen (2023) *Is There a Replication Crisis in Finance?*, JF — https://doi.org/10.1111/jofi.13249 : most factors replicate in US & 93 countries under a Bayesian model; low-risk (BAB), momentum, value clusters replicate.
- McLean & Pontiff (2016), JF — https://doi.org/10.1111/jofi.12365 : anomaly returns ~26% lower out-of-sample and ~58% lower post-publication (abstract-level; PDF not opened). Apply a 30–60% haircut to all reported numbers.

## Exact rules (paper)
Week 0 = days −1 to +3 around FOMC meeting; long index in even weeks, flat odd weeks.

## Backtest spec (defaults)
- Define day 0 = FOMC announcement; week k = days [5k−1, 5k+3] trading days
- Long NAS100 at 16:00 America/New_York close entering even weeks, flat at close entering odd weeks
- Stop: none; hold per week
- Sweep: offset {−2..+1}; even-only vs week-0-only vs even+trend filter

### Pseudocode
```python
k = (tdays_since_fomc+1)//5; pos = 1 if k%2==0 else 0
```

## Labels
- CONFIRMED = documented in paper and replicated by independent work; INFERRED = from paper but magnitude/OOS from memory or mapping to CFD symbols is my adaptation; CONFLICT = independent work disputes.
- Numeric figures marked INFERRED should be checked against the PDF tables before relying on them. Timezone mappings for CFDs are adaptations, not from the paper.
