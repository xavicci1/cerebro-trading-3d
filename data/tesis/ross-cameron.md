# Ross Cameron — Small-cap momentum day trading (micro-pullbacks)
**Verified result:** $583.15 → $18.81M total gains 1/1/2017–12/31/2025, independent accountant (SingerLewak) review of broker statements (https://www.warriortrading.com/ross-camerons-verified-day-trading-earnings/). Note: seller of courses (conflict of interest). Confidence: med-high (record), high (rules).
| Rule | Value | Status |
|---|---|---|
| Universe | Stocks $1–20 ($5–10 small-account), float <20M hot / <10M cold, RVOL ≥5, up ≥10%, catalyst, top gainers | CONFIRMED – https://cdn.warriortrading.com/warriortrading.com/assets/2025-Small-Account-Tool-Kit-1013.pdf , https://cdn.warriortrading.com/warriortrading.com/assets/Warrior%20Trading%20-%20Stock%20Selection.pdf |
| Session | 07:00–11:00 ET | CONFIRMED (Tool Kit) |
| Entry | Micro pullbacks on front side of momentum | CONFIRMED |
| Exit/invalidation | MACD crosses signal, declining volume, jackknife rejection | CONFIRMED |
| Risk | ~5% acct risk, ~10% target (small acct), daily max loss 10%, 2:1 P/L | CONFIRMED |
```
(not directly on the six markets — native = US small caps)
adaptation on BTC/NAS100 1m: only on days with day-change >+2*ATR% and RVOL(tickvol)>3
micro-pullback: 1-3 red 1m bars not breaking 9EMA; buy first 1m bar making new high; stop = pullback low
exit: MACD(12,26,9) cross down or 2R; daily max loss 3R
```
**Fit:** BTC best proxy (momentum bursts); NAS100/XAUUSD on news days; poor elsewhere. Edge depends on low-float stock microstructure → low transferability.

## Backtest spec (exact defaults, 2026-10-30)
- 1-min bars. BTC 07:00–11:00 NY; NAS100 09:30–11:00 NY. Filter: day gain ≥ 3% (BTC) / 1.5% (NAS100) and tick volume ≥ 5× avg (RVOL 5 CONFIRMED). Micro pullback: 1–3 red bars, then a buy stop at the first green bar's high. Stop: pullback low. TP 2R (CONFIRMED 2:1); exit early if MACD(12,26,9) crosses below its signal. Daily loss limit −3R. Sweep: TP {1.5,2,3}R.
