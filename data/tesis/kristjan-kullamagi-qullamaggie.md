# Kristjan Kullamägi (Qullamaggie) – Breakout / Episodic Pivot / Parabolic Short

**Verified result:** Peak ~$105M (Nov 2021), reported in Schwager & Coyle's *Market Wizards: The Next Generation*, where the authors reviewed his statements. Not independently audited. He then had a drawdown of ~$60M by mid-2022 (https://completetradersedge.com/kristjan-kullamagi-qullamaggie/, secondary). Style: swing (3–60 days).

Legend: CONFIRMED = stated in primary/well-documented source (cited); INFERRED = my reasoning to make it mechanical; CONFLICT = sources disagree.

## Rules
| Item | Rule | Status |
|---|---|---|
| Universe | Top 1–2% momentum stocks (1m,3m,6m gains), ADR >~4–5%, liquid | CONFIRMED – https://qullamaggie.com/my-3-timeless-setups-that-have-made-me-tens-of-millions/ |
| Breakout setup | Big prior move (30–100%+), then 2 weeks–2 months tight consolidation surfing 10/20d MA, higher lows | CONFIRMED |
| Entry | Opening range high break (1/5/60-min ORH) on breakout day | CONFIRMED |
| Stop | Low of the day; stop size ≤ ADR | CONFIRMED |
| Exits | Sell 1/3–1/2 after 3–5 days; trail rest with 10d or 20d MA (close below) | CONFIRMED |
| Sizing | Risk 0.25–1% per trade; position up to 10–30% of account | CONFIRMED (blog/streams) |
| Episodic Pivot | Gap up ≥10% on huge volume on news after neglect; buy ORH, stop LOD | CONFIRMED |
| Market filter | Trade size when NASDAQ above rising 10/20d MA | CONFIRMED |


## Backtest adaptation (XAUUSD, NAS100, GER40, USDJPY, Brent, BTC; 1-min/tick 2020–2026)
- Resample 1-min to daily bars using each market's session close (FX/metals/Brent: 17:00 New York; NAS100: 16:00 NY cash close or 17:00 CFD roll; GER40: 17:30 Frankfurt; BTC: 00:00 UTC). Weekly = Friday close (BTC: Sunday 00:00 UTC). INFERRED: consistent session boundaries are required so N-day highs/ATR match published daily-bar rules.
- Use the 1-min data only for intrabar fill sequencing (stop vs. target hit order) and realistic slippage; signals are on daily/weekly closes unless stated.
- Costs: spread + commission per market (e.g. XAU 0.2–0.3$, NAS100 1–2 pts, GER40 1–2 pts, USDJPY 0.5–1 pip, Brent 0.03$, BTC 0.05–0.1%) plus overnight financing for CFDs. Position sizing in risk-% of equity, contract value normalized by point value.
- Warm-up: need ≥ longest lookback (e.g. 200d / 30w) before 2020 → start trades 2020-10 or load 2019 data.
- Validation: walk-forward 2020–2023 in-sample / 2024–2026 OOS; no parameter optimization beyond the published values first (faithful replica), then robustness sweep ±20%.

### Market fit
Best: BTC, NAS100, XAUUSD (high ADR / momentum). Note: designed for single stocks; on indices ADR is small → fewer setups. Uses 1-min data for ORH — very backtest-ready.

## Pseudocode
```python
adr=mean((h/l-1),20); mom=c/c.shift(63)-1
prior_move = c.rolling(60).max()/c.rolling(60).min()-1 >= 0.3
tight = (h.rolling(10).max()-l.rolling(10).min())/c < 1.5*adr and c>sma20
if index_c>sma20_index and prior_move and tight:
   orh = high of first 60 min (from 1-min data)
   if price>orh: buy; stop=day_low (cap 1*adr)
   day3-5: sell 1/2; rest exit on close<sma10 (fast) or sma20
```

## Verification pass (2026-10-30)
- UPDATED: the result now cites Schwager/Coyle and adds the ~$60M 2022 drawdown (a CONFLICT with any 'smooth equity' impression). Setups (breakout, EP, parabolic short) are unchanged.

## Backtest spec (exact defaults, 2026-10-30)
- Daily setup + intraday trigger. Opening range 5 min: NAS100 09:30–09:35 NY, GER40 09:00–09:05 CET, XAU/Brent/USDJPY 08:00–08:05 London (UTC+0/+1), BTC 00:00–00:05 UTC.
- Setup: 63-day gain ≥ 30%; ADR20 ≥ 4% (BTC) / top-quintile ADR for other markets; last 10 bars range ≤ 1.5×ADR20 and lows ≥ SMA20 (INFERRED-DEFAULT).
- Entry: buy stop at ORH(5m) +1 tick, only if price is above the prior 10-day high. Stop: low of day; skip if stop > 1.0×ADR20 (CONFIRMED). Sell 1/3 at the close of day 3 (INFERRED-DEFAULT, 3–5 days); trail the rest with a close < SMA10. Risk 0.5% (midpoint 0.25–1%). No TP.
- Sweep: ORH {1,5,60} min; trail {SMA10,SMA20}; partial day {3,5}.
