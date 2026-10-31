# Christoph Radecker (IQ Capital / TradingIQ) – rule-based DAX intraday

**Verified result:** CONFIRMED, Robbins official historical standings (https://www.worldcupchampionships.com/world-cup-trading-championship-historical-standings): 2024 Quarterly Futures Day Trading Q2 2nd +97.7%; Q3 4th +60.7%; 2025 Quarterly Forex Q1 3rd +47.7%; Q2 2nd +266.9%. Style: intraday.

| Rule | Detail | Status |
|---|---|---|
| Approach | Systematic and rule-based: defined setups, statistical testing, partial automation | CONFIRMED-secondary (interview https://www.eriks.blog/iq-capital/ ; https://www.erfolgreiche-trader-strategien.de/trading/price-action-trader-christoph-radecker) |
| Market | Futures, especially DAX price action, intraday | CONFIRMED-secondary |
| Horizon | Trend-following over minutes to hours; rejects ultra-short scalping | CONFIRMED-secondary |
| Risk | Size from the stop distance; fixed daily and weekly loss limits; stop trading when the limit is hit or under emotional strain | CONFIRMED-secondary |
| Exact setups | Not public | INFERRED below |

## Backtest adaptation
Markets: XAUUSD, NAS100, GER40, USDJPY, Brent, BTC. Data: tick/1-min 2020–2026. Tick volume stands in for volume/delta (relative volume = tick count vs. its same-time-of-day 20-day average).
```
GER40, 09:00-17:30 CET, 5-min bars:
 trend = EMA20 > EMA50 and price > session VWAP (mirror for shorts)
 entry: pullback to EMA20 then a break of the prior bar's high; stop = swing low; target 2R; trail EMA20
 risk 0.5%/trade; daily stop -1.5%, weekly stop -4% -> halt
```
**Market fit:** GER40 is native. NAS100 is a good secondary. FX (USDJPY) is plausible given his forex podiums. Confidence is low, since the setups are inferred.

## Backtest spec (exact defaults, 2026-10-30)
- GER40 15-min, 09:00–17:30 CET. Trend = EMA20 > EMA50 (15m). Entry: break of the 09:00–10:00 CET range in the trend direction; stop on the opposite side of that range, capped at 0.5×ATR14d; TP 2R; flat 17:30 CET. Daily loss limit −2R, weekly −5R (limits CONFIRMED to exist; numbers INFERRED-DEFAULT). Sweep: TP {1.5,2,3}R.
