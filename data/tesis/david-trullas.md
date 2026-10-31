# David Trullàs Vila — Nasdaq intraday pullbacks + Fibonacci (HLIT method)
**Verified result (OFFICIAL, live re-checked 2026-10-31):** Futures Day Trading quarterly: Q1-2025 2nd 291%, Q2-2025 1st 712.1%, Q3-2025 1st 800.6%, Q4-2025 1st 930.7%, Q1-2026 1st 585.4%, Q2-2026 1st 2222.6% (Final), Q3-2026 1st 1350.8% ("Final Pending Audit"), Q4-2026 1st 48.2% (in progress, Oct 1–Oct 29 2026); Global Cup of Futures 2024-2025 2nd 114.5% (https://www.worldcupchampionships.com/world-cup-trading-championship-standings ; https://www.worldcupchampionships.com/world-cup-trading-championship-historical-standings). Correction 2026-10-31: earlier version stopped at Q1-2026 (Q2/Q3-2026 and Global Cup missing) — no figure conflict, record was incomplete. He states contest management is far more aggressive than his personal account ("es un campeonato… gas a fondo", https://www.youtube.com/watch?v=JunRcXPZBDs). Confidence: high (record), low (rules).
| Rule | Value | Status |
|---|---|---|
| Instrument | Nasdaq futures | CONFIRMED-secondary (regio7 article via search synthesis) |
| Method | Market reading, trend, pullbacks to S/R with and against trend, Fibonacci/psychological levels, volume, strict risk | CONFIRMED-secondary – https://liveintrading.com/ , https://toulh.com/david-trullas-live-in-trading-metodo-trullas/ |
| Reversal method (Cyborg) | Reward:risk > 1:3 | CONFIRMED-secondary (search synthesis of liveintrading.com) |
| Fib levels 50/61.8, 1m–5m TF | INFERRED |
| Sizing | Contest = maximal leverage | CONFIRMED (video quote) |
```
trend: 15m EMA50 slope; impulse leg = last swing (ZigZag 0.3% NAS)
long: pullback into 50–61.8% retrace coinciding with round number (x00/x50) ; trigger 1m close back above prior 1m high with tickvol > 1.5*median
stop below 78.6%; TP = 1.27/1.618 extension (>=3R); session 09:30–12:00 ET
```
**Fit:** NAS100 best, GER40, XAUUSD, BTC ok.

## Backtest spec (exact defaults, 2026-10-30)
- NAS100 1-min, 09:30–11:30 NY. Trend = slope of the 15-min EMA20. Entry: limit at the 61.8% retracement of the last 5-min impulse (impulse ≥ 0.3×ATR14d), in the trend direction (INFERRED-DEFAULT). Stop beyond the 100% retracement. TP 3R (CONFIRMED >1:3 for reversals). Flat 11:30 NY. Sweep: fib {50,61.8}; TP {2,3}R.
