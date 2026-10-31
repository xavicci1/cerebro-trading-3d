# Richard Donchian – 4-week rule / 5-20 MA

**Verified result:** Pioneer of managed futures (Futures Inc., 1949); documented, though P&L sparse. 4-week rule tested by Dunn & Hargitt. Style: position.

Legend: CONFIRMED = stated in primary/well-documented source (cited); INFERRED = my reasoning to make it mechanical; CONFLICT = sources disagree.

## Rules
| Item | Rule | Status |
|---|---|---|
| 4-week rule | Buy when price exceeds 4-week (20-day) high; sell/reverse when price falls below 4-week low; always in market | CONFIRMED – Donchian 1960s rule, e.g. Kaufman *Trading Systems and Methods* |
| 5/20 MA | Long when 5d MA > 20d MA (with 1-day penetration rules) | CONFIRMED – Kaufman |
| Sizing | Not specified | INFERRED 1% risk vol-scaled |


## Backtest adaptation (XAUUSD, NAS100, GER40, USDJPY, Brent, BTC; 1-min/tick 2020–2026)
- Resample 1-min to daily bars using each market's session close (FX/metals/Brent: 17:00 New York; NAS100: 16:00 NY cash close or 17:00 CFD roll; GER40: 17:30 Frankfurt; BTC: 00:00 UTC). Weekly = Friday close (BTC: Sunday 00:00 UTC). INFERRED: consistent session boundaries are required so N-day highs/ATR match published daily-bar rules.
- Use the 1-min data only for intrabar fill sequencing (stop vs. target hit order) and realistic slippage; signals are on daily/weekly closes unless stated.
- Costs: spread + commission per market (e.g. XAU 0.2–0.3$, NAS100 1–2 pts, GER40 1–2 pts, USDJPY 0.5–1 pip, Brent 0.03$, BTC 0.05–0.1%) plus overnight financing for CFDs. Position sizing in risk-% of equity, contract value normalized by point value.
- Warm-up: need ≥ longest lookback (e.g. 200d / 30w) before 2020 → start trades 2020-10 or load 2019 data.
- Validation: walk-forward 2020–2023 in-sample / 2024–2026 OOS; no parameter optimization beyond the published values first (faithful replica), then robustness sweep ±20%.

### Market fit
Brent, XAUUSD, USDJPY, BTC. Simplest baseline.

## Pseudocode
```python
h20=high.rolling(20).max().shift(1); l20=low.rolling(20).min().shift(1)
if high>h20: long (reverse from short) ; if low<l20: short
```

## Verification pass (2026-10-30)
- Not re-verified against live sources in this pass. The performance claims stay soft (reported/secondary). The rule text comes from published books and is unchanged.
- LIVE CHECK (2026-10-30): CONFIRMED Futures Inc. 1948/49, the first public futures fund (CME https://www.cmegroup.com/education/articles-and-reports/the-miraculous-growth-of-managed-futures). Forbes c.1982: Futures Inc. launched at $10/share, fell as low as 4 cents and was dissolved (https://www.trendfollowing.com/2009/12/17/donchian-forbes-circa-1982/). The 5/20-day MA method has a 13.5-year *hypothetical* signal record from 1961 (Hayden Stone letter; https://fliphtml5.com/cdhig/ajnb/DONCHIAN/3/). The 4-week rule ranking top in Dunn & Hargitt's 1970 *Trader's Notebook* is CONFIRMED-secondary. Net verdict: the method is documented, the live P&L is poor/sparse, and confidence in the *rules* stays high.

## Backtest spec (exact defaults, 2026-10-30)
- Daily bars, same closes as the Turtles spec. 4-week rule: long on a trade above the highest high of the previous 20 sessions (28 for BTC, 7-day week); reverse short below the 20-session low. Always in the market. No stop beyond the reverse, no TP.
- Sizing INFERRED-DEFAULT: 1% equity / (2×ATR20).
- Sweep: channel {20,40,55}; long-only vs long/short.
