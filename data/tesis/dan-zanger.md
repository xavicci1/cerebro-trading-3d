# Dan Zanger – chart-pattern breakouts

**Verified result:** $10,775 → $18M from June 1998 to Dec 1999 (~18 months; ~$42M by about month 23) — https://chartpattern.com/dan-media.cfm . The first 12 months (+29,233%) were audited by **Effron Enterprises**. Fortune (https://chartpattern.com/news/fortune.html) reports seeing his 1999 tax return with capital gains of $14,232,878. Style: swing.

Legend: CONFIRMED = stated in primary/well-documented source (cited); INFERRED = my reasoning to make it mechanical; CONFLICT = sources disagree.

## Rules
| Item | Rule | Status |
|---|---|---|
| Patterns | Flags, cup&handle, ascending triangles, channel breakouts in leading stocks | CONFIRMED – https://www.chartpattern.com/ |
| Volume | Breakout volume ≥ ~2× (he cites "volume must surge") | CONFIRMED qualitative; 2× INFERRED |
| Entry | Buy as price breaks trendline/pattern high early in the day | CONFIRMED |
| Stop | 'Sell if stock falls 8% or back below breakout' (common Zanger rule) | CONFIRMED (Zanger 'rules' page) – exact % varies → CONFLICT (5–8%) |
| Exit | Sell into climax / when moving away from 50d MA far; trail | CONFIRMED qualitative |


## Backtest adaptation (XAUUSD, NAS100, GER40, USDJPY, Brent, BTC; 1-min/tick 2020–2026)
- Resample 1-min to daily bars using each market's session close (FX/metals/Brent: 17:00 New York; NAS100: 16:00 NY cash close or 17:00 CFD roll; GER40: 17:30 Frankfurt; BTC: 00:00 UTC). Weekly = Friday close (BTC: Sunday 00:00 UTC). INFERRED: consistent session boundaries are required so N-day highs/ATR match published daily-bar rules.
- Use the 1-min data only for intrabar fill sequencing (stop vs. target hit order) and realistic slippage; signals are on daily/weekly closes unless stated.
- Costs: spread + commission per market (e.g. XAU 0.2–0.3$, NAS100 1–2 pts, GER40 1–2 pts, USDJPY 0.5–1 pip, Brent 0.03$, BTC 0.05–0.1%) plus overnight financing for CFDs. Position sizing in risk-% of equity, contract value normalized by point value.
- Warm-up: need ≥ longest lookback (e.g. 200d / 30w) before 2020 → start trades 2020-10 or load 2019 data.
- Validation: walk-forward 2020–2023 in-sample / 2024–2026 OOS; no parameter optimization beyond the published values first (faithful replica), then robustness sweep ±20%.

### Market fit
NAS100, BTC, XAUUSD. Index adaptation loses stock-specific edge.

## Pseudocode
```python
flag: pole gain>=0.15 in <=10d, then 3-15d consolidation range< 0.5*pole
if high>flag_high and vol>2*vol50: buy; stop=max(entry*0.92, flag_low)
trail: close<ema10 exit; climax: c>1.25*sma50 -> sell half
```

## Verification pass (2026-10-30)
- FIXED: the time frame is 18 months to $18M (not ~23 months). Corrected the auditor to Effron Enterprises (not Fidelity statements). Added the Fortune tax-return corroboration.
- CONFIRMED-secondary: the EPS/revenue growth ≥40% screen (chartpattern about page, as quoted on an elitetrader thread).
- DOWNGRADED to INFERRED: the specific '8% stop' rule-page citation (no primary page found). Keep the stop as a parameter to sweep (5–10%).

## Backtest spec (exact defaults, 2026-10-30)
- Daily closes: NAS100 16:00 NY, GER40 17:30 CET, XAUUSD/USDJPY/Brent 17:00 NY, BTC 00:00 UTC. Setup: 20-bar range ≤ 15% after a 63-day gain ≥ 30%. Entry: buy stop at the 20-bar high only if that day's tick volume ≥ 2× avg50 (INFERRED-DEFAULT). Stop: 8% below entry (CONFLICT on the exact %) or a close back below the breakout level. Exit at close > 1.25×SMA50 (climax proxy, INFERRED-DEFAULT) or close < SMA50. Sweep: stop {5,8}%.
