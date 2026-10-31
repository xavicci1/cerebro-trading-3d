# Sergio Fernández Borja (KPI Trading) – NQ/ES futures, manual

**Verified result:** CONFIRMED: Robbins 2024 Quarterly Futures Day Trading Q4 4th +94.7% (official historical standings). 2025 Q1 1st **+317.5% CONFIRMED**: the official current standings and the 'Version 2' page both show 317.5% (https://www.worldcupchampionships.com/world-cup-trading-championship-standings). The archive's '31.75' is a moved decimal, also flagged by the CTE research sheet (https://completetradersedge.com/wp-content/uploads/2026/09/CTE-Research-Sheet-World-Cup-Trading-Championships-v2.pdf), and Borja's own post says 317%. His LinkedIn post claims 1st place in his 5th Robbins participation (https://es.linkedin.com/posts/sfborja_hace-un-a%C3%B1o-que-particip%C3%A9-por-1%C2%AA-vez-en-la-activity-7312901334708449280-nREX). Style: intraday.

| Rule | Detail | Status |
|---|---|---|
| Instruments | Nasdaq and S&P 500 futures | CONFIRMED-secondary (KPI Trading LinkedIn) |
| Edge | 'Price and liquidity inefficiencies', manual execution, discipline, risk control | CONFIRMED-secondary |
| Setups | Not public | INFERRED: liquidity-sweep reversal (below) |

## Backtest adaptation
Markets: XAUUSD, NAS100, GER40, USDJPY, Brent, BTC. Data: tick/1-min 2020–2026. Tick volume stands in for volume/delta (relative volume = tick count vs. its same-time-of-day 20-day average).
```
NAS100 1-min: mark the prior-day H/L and overnight H/L
 sweep: price trades beyond a level by >0.1*ATR15 and closes back inside within 3 bars, with a tick-volume spike >2x
 enter in the reversal direction; stop beyond the sweep extreme; target VWAP / opposite level, min 1.5R
```
**Market fit:** NAS100 is native. GER40/XAUUSD sweeps are testable. Low confidence, since the method is undisclosed.

## Backtest spec (exact defaults, 2026-10-30)
- NAS100 1-min, 09:30–11:30 NY. Liquidity sweep: price exceeds the prior-day high/low by ≥ 5 pts, then closes back inside within 3 bars → enter at that close (INFERRED). Stop 5 pts beyond the sweep extreme. TP 2R. Flat 11:30 NY. Sweep: excursion {3,5,10}; TP {1.5,2,3}R.
