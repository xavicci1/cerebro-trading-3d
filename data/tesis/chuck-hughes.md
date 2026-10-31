# Chuck Hughes – PowerTrend (10-month MA + Keltner pullback, ITM calls)

**Verified result:** CONFIRMED, Robbins historical standings: World Cup 1st in 1999 (+315.6%), 2015 Futures 1st (+309.1%), 2014 Futures 2nd (+339.8%), plus several World Cup Stock and System championship firsts (1994, 1995, 2005, 2009). Style: swing/position (options on stocks).

| Rule | Detail | Status |
|---|---|---|
| Trend | Monthly close above the 10-month SMA = buy signal | CONFIRMED (Barchart PDF https://www.barchart.com/media/education/pdf/Unlock%20the%20Power%20of%20High-Accuracy%20Option%20Trading.pdf ; MetaStock https://cdn.metastock.com/i/sst/chughes.pdf) |
| Entry timing | Buy while the daily price is below the upper Keltner channel ('buy zone'); above it is overbought, so wait | CONFIRMED |
| Rating filter | 'Strong Buy' rating required | CONFIRMED-secondary (search summary) |
| Instrument | Slightly ITM call with time value < 1% of the stock price | CONFIRMED |
| Exit | Exit when the monthly close is below the 10-month SMA | INFERRED (symmetry) |
| Income variant | Covered calls / covered spreads | CONFIRMED-secondary (YouTube) |

## Backtest adaptation
Markets: XAUUSD, NAS100, GER40, USDJPY, Brent, BTC. Data: tick/1-min 2020–2026. Tick volume stands in for volume/delta (relative volume = tick count vs. its same-time-of-day 20-day average).
```
monthly: trend_on = close_M > SMA10_M
daily: if trend_on and close < KeltnerUpper(20, 2*ATR10): long (delta-1 proxy for the ITM call)
exit: trend_on false at month end; optional stop 2*ATR(daily)
```
**Market fit:** Slow trend filter that suits NAS100, XAUUSD and BTC. GER40 is OK. USDJPY/Brent are mixed. The 1-min data is overkill; use daily bars. Options leverage is not replicated.

## Backtest spec (exact defaults, 2026-10-30)
- Daily closes: NAS100 16:00 NY, GER40 17:30 CET, XAUUSD/USDJPY/Brent 17:00 NY, BTC 00:00 UTC. Month-end: long when the monthly close > SMA10 (months). Enter on the next day with close < upper Keltner(20, 2×ATR10) (buy zone CONFIRMED; parameters INFERRED-DEFAULT). Underlying-only proxy, no options. Exit at a month-end close < SMA10. No stop, no TP. Sweep: Keltner mult {1.5,2,2.5}.
