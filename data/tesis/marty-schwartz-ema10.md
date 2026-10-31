# Marty Schwartz – 10-day EMA 'red light/green light' (Market Wizards)

**Verified result:** Reported (Market Wizards, *Pit Bull*): many US Investing Championship wins; exact figures not re-verified here. Style: swing/day trading on index futures.

| Rule | Detail | Status |
|---|---|---|
| Trend filter | Above the 10-day EMA think buy; below, think sell | CONFIRMED quote (https://www.newtraderu.com/2022/03/21/10-trading-principles-that-made-marty-schwartz-a-market-wizard/) |
| Never fight MAs | 'I try not to go against the moving averages; it is self-destructive' | CONFIRMED |
| Independent test | Traded as a plain intraday direction: −2.83 bp net, 0 of 8 years positive (2015–2022, 10 CFD markets) | RESEARCH (Krueger Algorithms https://kruegeralgorithms.com/en/research/market-wizards-intraday-rules-tested) |

## Backtest adaptation
Markets: XAUUSD, NAS100, GER40, USDJPY, Brent, BTC. Data: 1-min 2020–2026, resampled to daily/weekly. Tick volume stands in for volume.

## Backtest spec
- Daily closes: NAS100 16:00 NY, GER40 17:30 CET, XAUUSD/USDJPY/Brent 17:00 NY, BTC 00:00 UTC. Use as a filter only (CONFIRMED that it is a filter, not a system): allow longs only if the prior close > EMA10, shorts only if < EMA10. Stand-alone test: hold long/short at the close by the EMA10 side, flip on cross; no stop, no TP.
- Sweep: EMA {10,20}; daily vs intraday hold.
**Market fit:** As a filter only; the independent test shows no stand-alone intraday edge.
