# Zarattini / Barbon / Aziz – 5-min ORB on 'Stocks in Play' (RESEARCH)

**Verified result:** RESEARCH backtest: US stocks 2016–2023, top-20 relative-volume portfolio >1,600% net, Sharpe 2.81, 36% annual alpha — SSRN 4729284 (https://concretumgroup.com/a-profitable-day-trading-strategy-for-the-u-s-equity-market/). Style: intraday.

| Rule | Detail | Status |
|---|---|---|
| Universe | 'Stocks in Play': top 20 by relative volume (first 5 min vs 14-day avg), with liquidity filters | CONFIRMED (summary) |
| Entry | Direction of the first 5-min candle; stop-entry at the OR high/low | CONFIRMED-secondary |
| Stop | 10% of ATR14 | CONFIRMED (summary) |
| Exit | Market close | CONFIRMED |

## Backtest adaptation
Markets: XAUUSD, NAS100, GER40, USDJPY, Brent, BTC. Data: tick/1-min 2020–2026, resampled to daily where noted. Tick volume stands in for volume.

## Backtest spec
- NAS100 09:30–09:35 NY OR; GER40 09:00–09:05 CET; XAUUSD/USDJPY/Brent 08:30–08:35 NY (INFERRED-DEFAULT); BTC 00:00–00:05 UTC.
- Trade only if first-5-min tick volume ≥ 2.0× its 14-day same-window average (relvol proxy, INFERRED-DEFAULT). Bullish OR → buy stop at OR high; bearish → sell stop at OR low. Stop = 0.10×ATR14(daily). Exit at session close (16:00 NY / 17:30 CET / 17:00 NY / 23:59 UTC). No TP. Risk 1%, max 4x.
- Sweep: relvol {1.5,2,3}; stop ATR {0.05,0.10,0.20}.

## Rotation re-check 2026-10-31 (CONFLICT: independent replications fail)
**Sources (opened 2026-10-31):**
- Concretum page (claims re-confirmed: >7,000 US stocks 2016–2023, top-20 Stocks in Play, >1,600% net, Sharpe 2.81, alpha 36%; S&P 500 ~198% over the same period): https://concretumgroup.com/a-profitable-day-trading-strategy-for-the-u-s-equity-market/
- Clock Out Capital, "We tested the opening range breakout on 4,924 stocks" (2026-10-23; pre-registered; survivorship-free universe incl. 1,080 delisted names; Alpaca SIP 5-min; 2016–2019 test, 2020–2022 held back): https://clockoutcapital.com/learn/opening-range-breakout-tested
- Quant for Free, "Does Stocks-in-Play Relative-Volume ORB survive validation?" (2026-09-20; PROXY universe of 20 liquid names; 2016-01-04 → 2026-09-18): https://quant4free.com/analysis/stocks-in-play-relvol-orb/

| Item | Paper claim | Independent result | Status |
|---|---|---|---|
| Top-20 relvol, 5-min, 10% ATR stop, exit at close | 1,637%, Sharpe 2.81 | 19,610 trades, win 5.8%, **gross −0.34R/trade**, net −0.80R at 2c (Clock Out, 2016–2019) | **CONFLICT** |
| Relvol >30× | +0.38R/trade | 5-min −0.43R gross (n 624); 1-min −0.18R gross (n 600); net −0.68R | **CONFLICT** |
| All eligible stocks | base version +29% over 8 years | 858,698 trades, −0.22R gross, −0.68R net | CONFLICT |
| Proxy (20 mega-caps) | n/a | best of 24 trials OOS 2023-06-30 → 2026-09-18: −72.95%, MDD −76.45%, 388 trades, win 12.11%, DSR 0 | CONFLICT (proxy universe, weaker evidence) |
| QQQ 5-min ORB, 5% ATR stop (companion paper) | strong | passed the first gate (+0.36R at 1c) but failed validation (p 0.064 in 2020–22); median stop 8.7c; 87% of profit from the 10 best days; negative at 3c slippage | CONFLICT |
| Why the papers differ | stop fills at the level, no slippage | fill-at-level convention alone worth ~+0.25R/trade on random walks; stops of 9–11c sit inside opening noise | CONFIRMED (Clock Out) |

Notes:
- **Caveats:** Clock Out never opened 2020–2023 for the stock rules, and the published profits "cluster in 2020 to 2022". Quant for Free used a proxy universe. So the paper's 2020–2023 window is not refuted, but 2016–2019 fails gross.
- **Spec change (2026-10-31):**
  - fill stop entries at the next tick beyond the level + 1 tick slippage, never at the level;
  - add slippage sweep {0, 0.5, 1, 2} × spread;
  - report R/trade gross and net plus the share of profit from the top-10 days;
  - add a random-sign first-candle control.
  - For CFD indices the 0.10×ATR stop (about 20–30 pts NAS100) is ~10× the 2.5 pt cost, so the cost issue is smaller than on stocks, but the information content of the first candle is unproven.
- **Status after re-check:** confidence downgraded high → **low**. Backup: /workspace/tmp0230/bak-concretum-stocks-in-play-orb.md

## Labels
style=intraday; confidence=low (paper backtest only; independent pre-registered replication negative gross 2016–2019; re-checked 2026-10-31); instruments=US stocks in play (original), NAS100/GER40/XAUUSD (adaptation); timeframe=5m/1m; best_backtest_markets=NAS100;GER40;XAUUSD
