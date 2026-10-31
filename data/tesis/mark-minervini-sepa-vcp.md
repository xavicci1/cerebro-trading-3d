# Mark Minervini – SEPA / VCP (Trend Template)

**Verified result:** US Investing Championship 1997 winner, 155% (real money); claimed 220% annualized 1994–99 (*Trade Like a Stock Market Wizard*, 2013; Schwager *Stock Market Wizards*, 2001). 2021 USIC 334.8% (minervini.com, reported). Style: swing/position on US growth stocks.

Legend: CONFIRMED = stated in primary/well-documented source (cited); INFERRED = my reasoning to make it mechanical; CONFLICT = sources disagree.

## Rules
| Item | Rule | Status |
|---|---|---|
| Trend Template | Price > 150d & 200d SMA; 150 > 200; 200d SMA rising ≥1 month (pref 4–5 m); 50d > 150 & 200; price > 50d; price ≥30% above 52w low; within 25% of 52w high; RS rank ≥70 (pref 80–90) | CONFIRMED – Minervini *Trade Like a Stock Market Wizard* ch.5; https://www.minervini.com/blog/index.php/blog/mark_minervinis_trend_template |
| Setup VCP | Base with 2–6 successively smaller pullbacks (e.g. 25%→15%→8%→3%), volume dry-up in last contraction | CONFIRMED – book ch.10 |
| Entry | Buy stop at pivot (high of final tight contraction) on volume expansion | CONFIRMED |
| Stop | Max loss ~10%, typical 5–8%; avg loss should be well below avg gain | CONFIRMED (book, "never let loss exceed 10%") |
| Sizing | Risk ~1.25–2.5% of equity per trade; position size up to 25% of portfolio, 4–8 positions | CONFIRMED (book *Think & Trade Like a Champion*, 2017) |
| Exits | Sell into strength at ~2–3× risk partial; trail with 50d SMA or "climax" signs; break-even stop after ~3× risk gain | CONFIRMED in general; specific trigger choice INFERRED |
| Market filter | Trade aggressively only when indexes in uptrend | CONFIRMED (qualitative) |
| Non-equity application | Trend Template is designed for individual stocks with RS rank; on indices/FX the RS rule must be replaced (e.g. relative strength vs. own 12m return or vs. basket) | INFERRED |


## Backtest adaptation (XAUUSD, NAS100, GER40, USDJPY, Brent, BTC; 1-min/tick 2020–2026)
- Resample 1-min to daily bars using each market's session close (FX/metals/Brent: 17:00 New York; NAS100: 16:00 NY cash close or 17:00 CFD roll; GER40: 17:30 Frankfurt; BTC: 00:00 UTC). Weekly = Friday close (BTC: Sunday 00:00 UTC). INFERRED: consistent session boundaries are required so N-day highs/ATR match published daily-bar rules.
- Use the 1-min data only for intrabar fill sequencing (stop vs. target hit order) and realistic slippage; signals are on daily/weekly closes unless stated.
- Costs: spread + commission per market (e.g. XAU 0.2–0.3$, NAS100 1–2 pts, GER40 1–2 pts, USDJPY 0.5–1 pip, Brent 0.03$, BTC 0.05–0.1%) plus overnight financing for CFDs. Position sizing in risk-% of equity, contract value normalized by point value.
- Warm-up: need ≥ longest lookback (e.g. 200d / 30w) before 2020 → start trades 2020-10 or load 2019 data.
- Validation: walk-forward 2020–2023 in-sample / 2024–2026 OOS; no parameter optimization beyond the published values first (faithful replica), then robustness sweep ±20%.

### Market fit
Best: NAS100 (and individual growth stocks), BTC. Works on XAUUSD in 2023–26 bull. Weak fit for USDJPY/GER40 (low volatility contractions everywhere). Ideally backtest on stock universe, not indices.

## Pseudocode
```python
t = (c>sma150 and c>sma200 and sma150>sma200 and sma200>sma200.shift(22) and sma50>sma150
     and c>sma50 and c>=1.3*low252 and c>=0.75*high252 and rs_rank>=70)
# VCP detection (INFERRED algorithm): find swing highs/lows in last 65d;
# require >=2 contractions with depth_i < depth_{i-1}, last depth <=10%, vol20 < vol50
pivot = high of last contraction
if t and vcp and high>pivot: buy at pivot; stop=max(pivot*(1-0.08), contraction_low)
risk_pct=0.0125; size=risk_pct*eq/(pivot-stop)
exit: stop; move to BE when +3R; sell 1/2 at +3R..; exit rest on close<sma50
```

## Verification pass (2026-10-30)
- CONFIRMED: 1997 USIC winner, +155% on a $250k account, long-only — https://minerviniselect.com/about.php
- CONFIRMED (official, not merely 'reported'): 2021 USIC $1M+ division +334.8%, beating the prior record of 119.1% — https://www.businesswire.com/news/home/20220124005241/en/2021-United-States-Investing-Championship-Winners-Minervini-Smashes-Record
- CONFIRMED-secondary: Schwager quote 'His average annual return has been a towering 220 percent… worst year—a 128 percent gain… only one down quarter' (as reproduced on Minervini's sites). Self-reported five-year figures, so not audited.
- Rule-level items (VCP contraction counts, trend template) are from his books. They are unchanged and still marked as before.

## Backtest spec (exact defaults, 2026-10-30)
- Daily closes: NAS100 16:00 NY, GER40 17:30 CET, XAUUSD/USDJPY/Brent 17:00 NY, BTC 00:00 UTC.
- Trend template: close>SMA50>SMA150>SMA200, SMA200 > its value 22 days ago, close ≥ 1.30×52w low and ≥ 0.75×52w high (CONFIRMED).
- VCP proxy: 3 contractions in the last 60 bars with each pullback depth ≤ 0.6× the previous; last contraction depth ≤ 8%; tick volume of the last 10 bars < 0.7× avg50 (INFERRED-DEFAULT).
- Entry: buy stop at the 10-bar high +1 tick. Stop: 7% below entry (INFERRED-DEFAULT, midpoint of 5–8%), max 10%. Move to breakeven at +3R; sell 50% at +3R (INFERRED-DEFAULT from 2–3×); trail the rest with a close < SMA50. Risk 1.25%.
- Sweep: stop {5,7,10}%; partial {2R,3R}; contraction ratio {0.5,0.6,0.75}.
