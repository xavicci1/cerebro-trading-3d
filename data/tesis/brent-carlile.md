# Brent Carlile (The Trading Café) – discretionary macro (Fed funds, crude)

**Verified result:** CONFIRMED, Robbins historical standings: 2024 World Cup Futures 1st +532.3%; 2020 2nd +287.9%; 2021–22 Global Cup 3rd/4th +66.3% (listed twice). Business Insider reviewed his brokerage statements (https://www.businessinsider.com/how-trader-made-high-gains-using-fed-policy-interest-rates-2025-2). Style: position (macro, multi-week).

| Rule | Detail | Status |
|---|---|---|
| Thesis | Trade the gap between market-implied Fed policy and expected macro data | CONFIRMED (BI) |
| 2024 trade | Long 30-day fed funds futures 17–30 Jul 2024, exit 8 Aug, on sticky-to-weak data plus a yen carry unwind | CONFIRMED (BI) |
| 2020 trades | DIA calls bought in Mar 2020 on expected policy rescue; crude puts from 16 Apr, then long WTI futures on the rebound | CONFIRMED (BI) |
| Sizing/risk | Patient sizing, scale only after the market validates the idea, strict drawdown control, contrarian at extremes | CONFIRMED-secondary (Medium interview https://medium.com/authority-magazine/investing-during-volatile-times-brent-carlile-of-the-trading-cafe-on-what-we-should-do-with-our-f899063587a2, via summary) |

## Backtest adaptation
Markets: XAUUSD, NAS100, GER40, USDJPY, Brent, BTC. Data: tick/1-min 2020–2026. Tick volume stands in for volume/delta (relative volume = tick count vs. its same-time-of-day 20-day average).
```
regime proxy (daily): USDJPY 10d return < -3% (yen squeeze) OR a crash in NAS100 (>15% below the 52w high)
 -> risk-off/dovish trade: long XAUUSD; long NAS100 only after a 20d high reclaim ('validation'); add 1 unit per +1 ATR
exit: time stop of 15 trading days or -2 ATR; account DD > 10% -> halve size
```
**Market fit:** USDJPY, XAUUSD and NAS100 (macro-sensitive). Brent suits the event-driven 2020 analogue. This is very discretionary and macro-event-driven, so a backtest only tests a crude proxy. Low fidelity.

## Backtest spec (exact defaults, 2026-10-30)
- Discretionary macro, not mechanically replicable. Proxy: long XAUUSD when the US 2-year yield falls ≥ 0.30 pp over 20 days (INFERRED-DEFAULT); exit after 15 trading days or a 2×ATR20 stop; close 17:00 NY. Sweep: threshold {0.2,0.3,0.5}.
