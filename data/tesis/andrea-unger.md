# Andrea Unger — Intraday breakout after volatility compression (+ portfolio of systems)

**Verified result:** CONFIRMED (re-verified live 2026-10-31 on the official historical standings https://www.worldcupchampionships.com/world-cup-trading-championship-historical-standings):
- 2008 World Cup Trading Championship 1st +671.9%
- 2009 World Cup Championship of Futures Trading 1st +115.4%
- 2010 World Cup Trading Championship 1st +239.6%
- **2012 World Cup Trading Championship Q4 1st +82.8%** (newly added)

Also archived at https://web.archive.org/web/20100106090542/www.robbinstrading.com/worldcup/standings.asp.

**CONFLICT (corrected):** the earlier note "also 2016 per Unger Academy (not checked)". The official list shows no Unger entry for 2016; the 2016 Futures 1st place is Artur Teregulov +914.8%. Unger's four official 1st places are 2008, 2009, 2010 and Q4-2012. Any 2016 title is UNVERIFIED.

Confidence: **high** (record), **medium** (rules).

## Rules
| Rule | Value | Status |
|---|---|---|
| Instruments | Index futures (DAX, S&P), EuroFX, Bund, currency futures | CONFIRMED – https://bettersystemtrader.com/016-andrea-unger/ ("intraday breakout systems on futures like the DAX and S&P"); https://ungeracademy.com/blog/in-union-there-is-strength (EuroFX 2005) |
| Timeframe | Intraday data, 5-min charts for definition | CONFIRMED – https://newcitytrader.com/conversation-with-andrea-unger/ |
| Session / time window | Let market develop "for some hours", then place orders inside a time window; avoid first 1–2 h and lunch | CONFIRMED – Unger Academy blog + New City Trader ("Maybe not in the first hour or two. Maybe not during the lunch pause.") |
| Entry | Stop orders at high/low of the day so far (first 2–3 h range) | CONFIRMED – BST016: "using that session's high and low as breakout levels" |
| Setup filter | Volatility compression / quiet period; "limiting the expansion over the last 5 trading days" | CONFIRMED – Unger Academy quote. Exact metric INFERRED (e.g. range(5d) < X·ATR(20)) |
| Extra filters | ADX, volume; day-of-week/time bias | CONFIRMED – https://jaysonchan.com/wp-content/uploads/2013/05/trading-insights.pdf |
| Stop | Stop loss (value not disclosed) | CONFIRMED existence; size INFERRED (opposite side of range or fixed $) |
| Exit | No take profit; exit at end of day (some currency/Bund systems held 3–5 days) | CONFIRMED (BST016, New City Trader) |
| Sizing | Multiple uncorrelated systems; fixed contracts | INFERRED |

## Backtest pseudocode
```
OR = high/low from session open to open+2.5h (GER40 09:00–11:30 CET; NAS100 09:30–12:00 ET)
filter: (max(H,5d)-min(L,5d)) / ATR20_daily < c   # compression, c ~ 2.5-3.5 (optimize, walk-forward)
        and yesterday's range < ATR20_daily (quiet day)
window: OR_end -> 1.5h before close (skip 12:00–13:30 ET lunch on US)
buy stop OR_high+1tick, sell stop OR_low-1tick, one trade per day (OCO)
stop = opposite OR side or min(OR width, 1*ATR14_1h); exit at session close
```
**Fit:** GER40 & NAS100 (original markets), Brent & XAUUSD (good trending intraday), USDJPY (hold multi-day variant), BTC (24h — define session 13:30–20:00 UTC). No order flow needed → highest fidelity of all strategies here.

## Backtest spec (exact defaults, 2026-10-30)
- Market/times: GER40 range window 09:00–12:00 CET; order window 12:00–16:00 CET; flat 22:00 CET. NAS100 range 09:30–11:30 NY, orders 11:30–14:30 NY, flat 15:55 NY (INFERRED-DEFAULT 'first 2–3 h').
- Compression filter: (max high − min low over the last 5 days) < 1.5 × ATR20(daily) (INFERRED-DEFAULT 1.5).
- Entry: buy stop at range high + 1 tick, sell stop at range low − 1 tick; first fill only; one trade/day.
- Stop: opposite side of the range, capped at 1.0×ATR20 (INFERRED-DEFAULT). TP: none, exit at the flat time.
- Sweep: compression {1.2,1.5,2.0}; range end {11:00,12:00,13:00 CET}.


## Re-verification log (2026-10-31, batch 20261031-0018)
- Official historical standings re-read. 2008/2009/2010 figures re-confirmed. Q4-2012 1st +82.8% added. The 2016 claim is CONFLICT/UNVERIFIED (2016 Futures 1st = Artur Teregulov).
- https://bettersystemtrader.com/016-andrea-unger/ re-opened live. The quote "intraday breakout systems on futures like the DAX and S&P, identifying the first two to three hours of trading, then using that session's high and low as breakout levels with no take profit and a stop loss" was re-confirmed.
- https://newcitytrader.com/conversation-with-andrea-unger/ and https://jaysonchan.com/wp-content/uploads/2013/05/trading-insights.pdf are live (HTTP 200).
- https://ungeracademy.com/blog/in-union-there-is-strength returned HTTP 520 today. The quote stays as previously recorded, but it could not be re-checked live.
