# Linda Raschke – Holy Grail, Turtle Soup, 80-20, Anti, 3-10 osc

**Verified result:** Featured in Schwager *New Market Wizards* (1992); LBR Group CTA track record (reported positive multi-year). Rules published in *Street Smarts* (Connors & Raschke, 1995). Style: swing (2–10 days).

Legend: CONFIRMED = stated in primary/well-documented source (cited); INFERRED = my reasoning to make it mechanical; CONFLICT = sources disagree.

## Rules
| Setup | Rule | Status |
|---|---|---|
| Holy Grail | ADX(14)>30 and rising; price pulls back to 20 EMA; buy stop above high of the bar that touched EMA; stop at pullback low; target prior swing high | CONFIRMED – *Street Smarts* ch. 'Holy Grail' |
| Turtle Soup | New 20-day low that is ≥4 days after prior 20-day low; buy stop at prior 20d low the same/next day; stop below today's low; exit trail 1–2 bars or 2–6 days | CONFIRMED – *Street Smarts* |
| Turtle Soup +1 | Same but close below prior low, entry next day | CONFIRMED |
| 80-20 | Previous day opened top/bottom 20% and closed opposite 20% of range; fade next day's move beyond | CONFIRMED |
| Anti | 3-10 oscillator (3SMA-10SMA, 16 signal) pullback against trend | CONFIRMED – Raschke materials |
| Sizing | Fixed fractional (not specified in book) | INFERRED 0.5–1% |


## Backtest adaptation (XAUUSD, NAS100, GER40, USDJPY, Brent, BTC; 1-min/tick 2020–2026)
- Resample 1-min to daily bars using each market's session close (FX/metals/Brent: 17:00 New York; NAS100: 16:00 NY cash close or 17:00 CFD roll; GER40: 17:30 Frankfurt; BTC: 00:00 UTC). Weekly = Friday close (BTC: Sunday 00:00 UTC). INFERRED: consistent session boundaries are required so N-day highs/ATR match published daily-bar rules.
- Use the 1-min data only for intrabar fill sequencing (stop vs. target hit order) and realistic slippage; signals are on daily/weekly closes unless stated.
- Costs: spread + commission per market (e.g. XAU 0.2–0.3$, NAS100 1–2 pts, GER40 1–2 pts, USDJPY 0.5–1 pip, Brent 0.03$, BTC 0.05–0.1%) plus overnight financing for CFDs. Position sizing in risk-% of equity, contract value normalized by point value.
- Warm-up: need ≥ longest lookback (e.g. 200d / 30w) before 2020 → start trades 2020-10 or load 2019 data.
- Validation: walk-forward 2020–2023 in-sample / 2024–2026 OOS; no parameter optimization beyond the published values first (faithful replica), then robustness sweep ±20%.

### Market fit
Very backtest-ready. Holy Grail: NAS100, XAUUSD, BTC. Turtle Soup (mean-revert): GER40, USDJPY, Brent.

## Pseudocode
```python
# Holy Grail
adx=ADX(14); e=ema(c,20)
if adx>30 and adx>adx.shift(1) and low<=e: setup_high=high
next bars: if high>setup_high: buy; stop=pullback_low; tp=recent_swing_high(20)
# Turtle Soup
l20=low.rolling(20).min().shift(1); prior_idx=argmin
if low<l20 and bars_since(prior_20d_low)>=4: buy stop at l20; stop=low-tick; exit after 2-6d or trail
```

## Verification pass (2026-10-30)
- Not re-verified against live sources in this pass. The performance claims stay soft (reported/secondary). The rule text comes from published books and is unchanged.
- LIVE CHECK (2026-10-30): Holy Grail rules CONFIRMED verbatim from *Street Smarts* ch.10 (https://pdfcoffee.com/street-smarts-laurence-a-connors-and-linda-bradford-raschke-1995-file-goc-5-pdf-free.html): ADX14 >30 and rising; pullback to EMA20; buy stop above the prior bar high; stop at the new swing low; trail; exit near the recent swing high; re-enter at the original entry if stopped; ADX must re-cross 30 after a winner. Turtle Soup: buy stop 5–10 ticks above the old 20-day low, which must be ≥4 sessions old; stop 1 tick below today's low (https://kagels-trading.com/blog/linda-raschke/). CTA record: registered CTA in 1992, own fund from 2002; the BarclayHedge ranking claim is secondary; no audited return series is public.

## Backtest spec (exact defaults, 2026-10-30)
- Holy Grail (daily): ADX14>30 and rising; low ≤ EMA20 → buy stop at the prior bar high + 1 tick, valid 3 bars (INFERRED-DEFAULT). Stop at the pullback swing low. TP: the most recent 20-bar swing high (CONFIRMED), with a 1-bar-low trail after +1R (INFERRED-DEFAULT).
- Turtle Soup: new 20-day low with the prior 20d low ≥4 sessions old → buy stop 5 ticks above the old low (INFERRED-DEFAULT midpoint 5–10 → use 0.05×ATR20 for CFDs); stop 1 tick below today's low; exit after 3 days or a 2-bar trailing low (INFERRED-DEFAULT).
- Session closes: 16:00 NY NAS100, 17:30 CET GER40, 17:00 NY FX/XAU/Brent, 00:00 UTC BTC.
- Sweep: ADX {25,30,35}; EMA {20}; soup age {3,4,6}.
