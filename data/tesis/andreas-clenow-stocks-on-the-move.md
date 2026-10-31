# Andreas Clenow – Stocks on the Move momentum (RESEARCH)

**Verified result:** RESEARCH: Clenow, *Stocks on the Move* (2015); ranking logic https://www.followingthetrend.com/mdocs-posts/stocks-on-the-move-ranking-logic/ . Clenow ran a real fund (ACIES), but the book results are backtests. Style: position (weekly rebalance).

| Rule | Detail | Status |
|---|---|---|
| Ranking | 90-day exponential-regression slope (annualized) × R² | CONFIRMED |
| Disqualify | Below SMA100, or any gap >15% in 90 days | CONFIRMED-secondary (QuantConnect forum summary) |
| Regime | New buys only if the S&P 500 > SMA200 | CONFIRMED-secondary |
| Size | Equity × 0.001 / ATR20 | CONFIRMED-secondary |
| Rebalance | Weekly trades; position resize twice a month | CONFIRMED-secondary |

## Backtest adaptation
Markets: XAUUSD, NAS100, GER40, USDJPY, Brent, BTC. Data: tick/1-min 2020–2026, resampled to daily where noted. Tick volume stands in for volume.

## Backtest spec (6-market adaptation)
- Wednesday daily close. Score = annualized slope(ln close, 90d) × R². Hold the top 3 of 6 with score>0 and close>SMA100 and no 15% gap; new entries only if NAS100>SMA200 (INFERRED-DEFAULT for a non-equity basket: apply each market's own SMA200). Size 0.1% equity / ATR20. No stop or TP beyond the exit rules.
- Sweep: lookback {60,90,120}; top-N {2,3}.
**Market fit:** Designed for 500 stocks; a 6-market basket is a weak adaptation.
