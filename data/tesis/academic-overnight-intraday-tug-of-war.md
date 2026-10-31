# Overnight vs Intraday Returns (Tug of War)

**Status: INFERRED** · Style: intraday · Applies to: NAS100;GER40

- **Authors:** Dong Lou, Christopher Polk, Spyros Skouras
- **Institution:** London School of Economics
- **Paper:** https://doi.org/10.1016/j.jfineco.2019.03.011 — Journal of Financial Economics 134(1), 2019 (DOI verified via Crossref)
- **Verification (2026-10-30 pass):** Opened LSE accepted-manuscript PDF (eprints.lse.ac.uk/87481). NOTE correction: this paper is cross-sectional; the index-level 'premium earned overnight' claim is NOT its headline.
- **Period / markets tested:** US stocks 1993–2013 (CRSP/TAQ); index overnight vs intraday

## Reported results
VERIFIED (cross-section): long-short decile on past overnight returns earns overnight excess return three-factor alpha 3.47%/month (t=16.83) and −1.77%/month intraday (t=−7.89); momentum profits accrue overnight, most other anomalies intraday (Introduction / Table 2). Index-level 'nearly all equity premium overnight' = Cliff, Cooper & Gulen (SSRN 1004081) — NOT opened → UNVERIFIED.

## Out-of-sample / replication evidence & decay
Tug-of-war pattern persistent across the 1993–2013 sample and in 'clientele' tests (VERIFIED from paper). Index close→open strategy viability for NAS100/GER40 after CFD financing: UNVERIFIED.

General replication context:
- Hou, Xue & Zhang (2020) *Replicating Anomalies*, RFS — https://doi.org/10.1093/rfs/hhy131 : 65% of 452 anomalies fail at 5% with NYSE breakpoints/VW returns; momentum, SUE/PEAD-type and some reversal signals among survivors (abstract-level figure; per-anomaly tables NOT opened → UNVERIFIED per anomaly).
- Jensen, Kelly & Pedersen (2023) *Is There a Replication Crisis in Finance?*, JF — https://doi.org/10.1111/jofi.13249 : most factors replicate in US & 93 countries under a Bayesian model; low-risk (BAB), momentum, value clusters replicate.
- McLean & Pontiff (2016), JF — https://doi.org/10.1111/jofi.12365 : anomaly returns ~26% lower out-of-sample and ~58% lower post-publication (abstract-level; PDF not opened). Apply a 30–60% haircut to all reported numbers.

## Exact rules (paper)
Hold index long from regular close to next open; flat during day.

## Backtest spec (defaults)
- NAS100: buy 16:00 America/New_York close, sell 09:30 next open; GER40: buy 17:30 Europe/Berlin, sell 09:00
- Stop: none; holding = one overnight; skip Fridays (weekend) as sweep option
- Costs: 1 bp/side (CFD swap/financing must be added!)
- Sweep: skip-weekend on/off; only if prior day intraday r<0 on/off; trend filter close>SMA200 on/off

### Pseudocode
```python
for d in days: pnl += open(d+1)/close(d)-1 - 2*cost
```

## Labels
- CONFIRMED = documented in paper and replicated by independent work; INFERRED = from paper but magnitude/OOS from memory or mapping to CFD symbols is my adaptation; CONFLICT = independent work disputes.
- Numeric figures marked INFERRED should be checked against the PDF tables before relying on them. Timezone mappings for CFDs are adaptations, not from the paper.
