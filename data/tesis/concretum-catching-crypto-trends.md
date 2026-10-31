# Zarattini / Pagani / Barbon – Catching Crypto Trends (Donchian ensemble, RESEARCH)

**Verified result:** RESEARCH: BTC 2015–Mar 2025 Combo model CAGR 30%, vol 17%, Sharpe 1.58, MDD 19%, no costs; top-20 coin rotation net Sharpe ≥1.5, alpha 10.8% — PDF https://concretumgroup.com/wp-content/uploads/2026/02/Catching-Crypto-Trends.pdf . Style: swing/position.

| Rule | Detail | Status |
|---|---|---|
| Signals | Donchian trend models with lookbacks 5,10,20,30,60,90,150,250,360 days, equal-weight ensemble | CONFIRMED |
| Sizing | Vol target 25% annualized using 3-month rolling vol | CONFIRMED |
| Rebalance | 20% threshold; 10 bp cost in portfolio tests | CONFIRMED |
| Direction | Long/flat | INFERRED (verify in the paper) |

## Backtest adaptation
Markets: XAUUSD, NAS100, GER40, USDJPY, Brent, BTC. Data: tick/1-min 2020–2026, resampled to daily where noted. Tick volume stands in for volume.

## Backtest spec
- Daily close 00:00 UTC. For each L in {5,10,20,30,60,90,150,250,360}: state_L = 1 when close > highest(close,L)[1]; 0 when close < midpoint/lowest(L) (INFERRED-DEFAULT: exit at the L-day lowest close). Signal = mean(state_L). Weight = signal × 0.25/vol63. Rebalance when |Δw|>20% of current. Cost 10 bp. No stop or TP.
- Sweep: vol target {0.20,0.25,0.35}; threshold {10%,20%}.
**Market fit:** BTC is native. XAUUSD and NAS100 are good trend tests with the same code.
