# Tirutrade AG – multi-week market-timing on indices, bonds, metals

**Verified result:** CONFIRMED (Robbins standings, live re-checked 2026-10-31): 2025 World Cup Championship of Futures Trading 1st +324.7%; 2024 World Cup Championship of Futures Trading 2nd +199.5%; **2018** World Cup Trading Championship – Index & Interest Rate Futures 5th +44.8% (https://www.worldcupchampionships.com/world-cup-trading-championship-standings ; https://www.worldcupchampionships.com/world-cup-trading-championship-historical-standings). CONFLICT corrected 2026-10-31: the earlier version dated the +44.8% Index & Interest Rate Futures result to 2024; the official historical table lists it under 2018. Style: swing (1 to several weeks).

| Rule | Detail | Status |
|---|---|---|
| Philosophy | Be in the market when conditions favour it and out when the probability is low | CONFIRMED (https://tirutrade.com/) |
| Holding | Trades of one to multiple weeks | CONFIRMED |
| Instruments | S&P 500, Nasdaq-100, Dow, 30Y T-Bond, gold, silver ('Alpha One') | CONFIRMED |
| Frequency | 40–50 trades per year across low-correlation strategies | CONFIRMED |
| 'TwoTrade' | Avoid-the-downturn S&P timing, claimed to work since 1950 | CONFIRMED-claim; rules undisclosed |
| Signals | Seasonality / trend filters | INFERRED |

## Backtest adaptation
Markets: XAUUSD, NAS100, GER40, USDJPY, Brent, BTC. Data: tick/1-min 2020–2026, resampled to daily where noted. Tick volume stands in for volume.
```
proxy (daily): long NAS100 / XAUUSD when close > SMA100 AND month in seasonal-strong set (Nov-Apr for indices)
exit: close < SMA100 or 15 trading days, whichever is first
```
**Market fit:** NAS100 and XAUUSD match the instrument list. Low fidelity, since the rules are undisclosed.

## Backtest spec (exact defaults, 2026-10-30)
- Daily closes: NAS100 16:00 NY, GER40 17:30 CET, XAUUSD/USDJPY/Brent 17:00 NY, BTC 00:00 UTC. Long NAS100/XAUUSD when close > SMA100 (and, for NAS100, the month is Nov–Apr). Exit at close < SMA100 or after 15 trading days. No stop, no TP. Sweep: SMA {50,100,200}; hold {10,15,20}.
