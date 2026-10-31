# Tom Basso – random entry + volatility exit (New Market Wizards / Van Tharp)

**Verified result:** RESEARCH/anecdote: in Van Tharp's *Trade Your Way to Financial Freedom* (ch.8), Basso's coin-flip system across 10 futures markets was reported profitable 80% of the time with fixed size and 100% with 1% risk, at a 38% win rate. Independent replication (Backtrader, 1985–1990 futures) found only ~49% profitable runs (https://www.backtrader.com/blog/2019-08-22-practical-backtesting-replication/practical-replication/) → CONFLICT. Style: position.

| Rule | Detail | Status |
|---|---|---|
| Entry | Coin flip, always in the market long or short; re-enter immediately on exit | CONFIRMED (book via Backtrader) |
| Volatility | 10-day EMA of ATR | CONFIRMED |
| Stop | Trailing at 3× volatility from the close, only moving in the trade direction | CONFIRMED |
| Size | Fixed 1 contract, or 1% risk | CONFIRMED |

## Backtest adaptation
Markets: XAUUSD, NAS100, GER40, USDJPY, Brent, BTC. Data: 1-min 2020–2026, resampled to daily/weekly. Tick volume stands in for volume.

## Backtest spec
- Daily closes: NAS100 16:00 NY, GER40 17:30 CET, XAUUSD/USDJPY/Brent 17:00 NY, BTC 00:00 UTC. Coin flip at each re-entry (seeded, 1,000 runs). Stop = close − 3×EMA10(ATR) for longs (mirror for shorts), ratchets only. Exit on a stop hit at the close; re-enter at the next open. Risk 1%. No TP.
- Sweep: stop {2,3,4}×; ATR EMA {10,20}.
**Market fit:** A null-hypothesis benchmark for all trend files (Turtles, Donchian, Seykota).
