# Jason Shapiro – COT contrarian (Unknown Market Wizards, 2020)

**Verified result:** Reported, not audited: ~15%/yr average with a 5% max drawdown over ~20 years, per Shapiro and return data viewed by Business Insider (https://www.businessinsider.com/contrarian-trades-futures-trader-unknown-market-wizard-commodity-trading-advisor-2021-8). Profiled in Schwager's *Unknown Market Wizards*. Style: swing (futures).

| Rule | Detail | Status |
|---|---|---|
| Sentiment | Fade extremes in speculator positioning in the weekly COT, i.e. side with commercials | CONFIRMED (book summary https://www.elearnmarkets.com/school/units/unknown-market-wizards) |
| Timing | Enter only when the market fails to respond to news in the consensus direction (bullish news, no rally → short) | CONFIRMED |
| Stop | A stop on every trade, at the level that negates the top/bottom thesis | CONFIRMED |
| COT extreme definition | e.g. non-commercial net position in the top/bottom 10% of a 3-year range | INFERRED |
| Exit | Not specified | INFERRED |

## Backtest adaptation
Markets: XAUUSD, NAS100, GER40, USDJPY, Brent, BTC. Data: 1-min 2020–2026, resampled to daily/weekly. Tick volume stands in for volume.

## Backtest spec
- Data: CFTC Legacy COT (Tuesday positions, released Friday 15:30 NY); usable from the next Monday. Markets: gold (XAUUSD), Nasdaq-100 mini (NAS100), JPY (USDJPY, inverted), Brent/WTI, CME Bitcoin (BTC). GER40 has no COT, so it is excluded.
- COT index = (net non-commercial − min156w) / (max156w − min156w). Extreme long ≥ 0.90 → short bias; ≤ 0.10 → long bias (INFERRED-DEFAULT).
- 'Fail to rally' proxy: under a short bias, enter short at the daily close when a 10-day high is made and the close is in the bottom 30% of the bar (INFERRED-DEFAULT). Mirror for longs. Daily closes: NAS100 16:00 NY, GER40 17:30 CET, XAUUSD/USDJPY/Brent 17:00 NY, BTC 00:00 UTC.
- Stop: the 10-day extreme ± 0.25×ATR20. Exit: the COT index crosses 0.50, or 40 trading days. No TP.
- Sweep: extreme {0.85,0.90,0.95}; lookback {104,156,260}w.
**Market fit:** XAUUSD, USDJPY and Brent (deep COT history). BTC COT exists only from 2018.
