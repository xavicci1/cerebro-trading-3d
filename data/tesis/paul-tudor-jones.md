# Paul Tudor Jones – 200-day MA filter + macro trend

**Verified result:** CONFIRMED: Tudor BVI Global returned +125.9% net in 1987 (CNBC https://www.cnbc.com/2014/03/06/after-a-dazzling-early-career-a-star-trader-settles-down.html). CONFLICT: some accounts cite ~200% (other vehicles or gross figures). The long-run ~26%/yr figure is reported and unverified. Style: position/swing macro.

Legend: CONFIRMED = stated in primary/well-documented source (cited); INFERRED = my reasoning to make it mechanical; CONFLICT = sources disagree.

## Rules
| Item | Rule | Status |
|---|---|---|
| Trend filter | "My metric for everything I look at is the 200-day moving average of closing prices… if you use the 200-day MA rule, you get out" | CONFIRMED – Tony Robbins *Money: Master the Game* (2014) interview |
| Risk | Never risk more than ~1% per trade; cut position when losing; 'Losers average losers' | CONFIRMED – Market Wizards / 1987 PBS documentary *Trader* |
| Price stop | Uses price-based mental stops & time stops | CONFIRMED qualitative |
| Full rules | Discretionary macro (Elliott wave, sentiment, fundamentals) | CONFIRMED discretionary → not replicable |


## Backtest adaptation (XAUUSD, NAS100, GER40, USDJPY, Brent, BTC; 1-min/tick 2020–2026)
- Resample 1-min to daily bars using each market's session close (FX/metals/Brent: 17:00 New York; NAS100: 16:00 NY cash close or 17:00 CFD roll; GER40: 17:30 Frankfurt; BTC: 00:00 UTC). Weekly = Friday close (BTC: Sunday 00:00 UTC). INFERRED: consistent session boundaries are required so N-day highs/ATR match published daily-bar rules.
- Use the 1-min data only for intrabar fill sequencing (stop vs. target hit order) and realistic slippage; signals are on daily/weekly closes unless stated.
- Costs: spread + commission per market (e.g. XAU 0.2–0.3$, NAS100 1–2 pts, GER40 1–2 pts, USDJPY 0.5–1 pip, Brent 0.03$, BTC 0.05–0.1%) plus overnight financing for CFDs. Position sizing in risk-% of equity, contract value normalized by point value.
- Warm-up: need ≥ longest lookback (e.g. 200d / 30w) before 2020 → start trades 2020-10 or load 2019 data.
- Validation: walk-forward 2020–2023 in-sample / 2024–2026 OOS; no parameter optimization beyond the published values first (faithful replica), then robustness sweep ±20%.

### Market fit
Filter works on NAS100, GER40, XAUUSD, BTC; serves best as regime overlay for other strategies.

## Pseudocode
```python
ma=sma(c,200)
long if c>ma else flat (or short if c<ma and slope<0 - INFERRED)
risk 1%: stop = entry - 2*ATR20 (INFERRED); time stop 20d without progress (INFERRED)
```

## Verification pass (2026-10-30)
- CONFIRMED: the 200-day MA quote via Robbins, also reproduced at https://mebfaber.com/2014/11/06/paul-tudor-jones-on-the-200-day-moving-average/
- FIXED: the 1987 figure is now 125.9% net (replacing the '62–125%' range).

## Backtest spec (exact defaults, 2026-10-30)
- Daily closes: NAS100 16:00 NY, GER40 17:30 CET, XAUUSD/USDJPY/Brent 17:00 NY, BTC 00:00 UTC. Long only when close > SMA200, flat otherwise (200-day rule CONFIRMED); act at the close. Risk overlay: 2×ATR20 stop ≈ 1% loss per position (INFERRED-DEFAULT). No TP. Sweep: MA {100,150,200}.
