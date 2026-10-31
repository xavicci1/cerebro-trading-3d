# Time-Series Momentum

**Status: CONFLICT** · Style: position · Applies to: XAUUSD;NAS100;GER40;USDJPY;Brent;BTC

- **Authors:** Tobias Moskowitz, Yao Hua Ooi, Lasse Heje Pedersen
- **Institution:** Chicago Booth / Yale (Moskowitz), AQR, NYU Stern / CBS (Pedersen)
- **Paper:** https://doi.org/10.1016/j.jfineco.2011.11.003 — Journal of Financial Economics 104(2), 2012 (DOI verified via Crossref)
- **Verification (2026-10-30 pass):** Opened published JFE PDF (author copy, pages.stern.nyu.edu/~lpederse/papers/TimeSeriesMomentum.pdf). Huang et al. 2020 checked at abstract level only.
- **Period / markets tested:** 1965/1985–2009, 58 liquid futures/forwards: equity indices, FX, commodities, bond futures

## Reported results
VERIFIED: Diversified TSMOM portfolio 'delivers a Sharpe ratio greater than one on an annual basis, or roughly 2.5 times the Sharpe ratio for the equity market portfolio' (Introduction, p.229); 12-month TSMOM positive in every one of the 58 contracts (Fig. 2, gross Sharpe by instrument); gold series starts Dec-1969 (Table 1). Returns persist 1–12 months, partially reverse after.

## Out-of-sample / replication evidence & decay
VERIFIED (abstract/search): Huang, Li, Wang & Zhou (2020) JFE https://doi.org/10.1016/j.jfineco.2019.08.004 — asset-by-asset predictability weak; pooled t=4.34 vs bootstrap critical values 4.83 (pairs) / 12.53 (wild) → not reliable; TSMOM profits similar to a strategy using historical sample means. Post-2009 decay statement = INFERRED (my knowledge, not from a paper opened).

General replication context:
- Hou, Xue & Zhang (2020) *Replicating Anomalies*, RFS — https://doi.org/10.1093/rfs/hhy131 : 65% of 452 anomalies fail at 5% with NYSE breakpoints/VW returns; momentum, SUE/PEAD-type and some reversal signals among survivors (abstract-level figure; per-anomaly tables NOT opened → UNVERIFIED per anomaly).
- Jensen, Kelly & Pedersen (2023) *Is There a Replication Crisis in Finance?*, JF — https://doi.org/10.1111/jofi.13249 : most factors replicate in US & 93 countries under a Bayesian model; low-risk (BAB), momentum, value clusters replicate.
- McLean & Pontiff (2016), JF — https://doi.org/10.1111/jofi.12365 : anomaly returns ~26% lower out-of-sample and ~58% lower post-publication (abstract-level; PDF not opened). Apply a 30–60% haircut to all reported numbers.

## Exact rules (paper)
Each month-end for each instrument: signal = sign(r_{t-12m..t}); position = signal × (40%/σ_ann) where σ = EWMA daily vol (center of mass 60d), annualized. Hold 1 month. Equal risk across instruments.

## Backtest spec (defaults)
- Universe: XAUUSD, NAS100, GER40, USDJPY, Brent, BTC (daily closes, 17:00 America/New_York)
- Lookback L = 252 trading days; rebalance last trading day of month at 16:00 America/New_York
- Vol estimate: EWMA, com=60d, annualized; target vol per instrument 10% (paper 40% per-asset; 10% practical)
- Stop/TP: none; holding rule = until next rebalance; max leverage 3x per instrument
- Costs: 1 bp/side indices/FX, 3 bp gold/Brent, 10 bp BTC
- Sweep: L ∈ {21,63,126,189,252}; hold ∈ {1w,1m,3m}; vol target ∈ {10,20,40%}; com ∈ {20,60,120}

### Pseudocode
```python
for t in month_ends:
  for a in assets:
    sig = sign(close[a][t]/close[a][t-L]-1)
    vol = ewm_std(ret[a], com=60)[t]*sqrt(252)
    w[a] = clip(sig*target/vol, -3, 3)
  hold w until next month_end
```

## Labels
- CONFIRMED = documented in paper and replicated by independent work; INFERRED = from paper but magnitude/OOS from memory or mapping to CFD symbols is my adaptation; CONFLICT = independent work disputes.
- Numeric figures marked INFERRED should be checked against the PDF tables before relying on them. Timezone mappings for CFDs are adaptations, not from the paper.
