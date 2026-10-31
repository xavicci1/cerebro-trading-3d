# Mike Bellafiore / SMB Capital – PlayBook setups (Second Day Play, Opening Drive)

**Verified result:** No public audited P&L. SMB is a real prop firm, and the methodology is documented in *The PlayBook* (2013; sample https://ptgmedia.pearsoncmg.com/images/9780132937641/samplepages/0132937646.pdf). Trillium: no public, documented setup methodology was found this pass (skipped). Style: intraday.

| Rule | Detail | Status |
|---|---|---|
| Philosophy | The playbook is a personal archive of repeatable 'A+' trades with defined reasons for the trade, read, context and execution, not a fixed system | CONFIRMED (book sample) |
| Second Day Play | Day 1: a big move on news/volume. Day 2: mark the day-1 high/low, key intraday levels and high-volume zones; trade only after price holds above/below a significant level with supportive market context | CONFIRMED (https://www.smbtraining.com/blog/the-explosive-second-day-play) |
| Opening Drive | Strong volume and fast breaks through prior S/R at the open; then consolidation above (long) / below (short) | CONFIRMED-secondary (search summary of SMB material) |
| Stops/targets | Stop beyond the held level; scale out into strength | INFERRED (no numeric rule published) |

## Backtest adaptation
Markets: XAUUSD, NAS100, GER40, USDJPY, Brent, BTC. Data: tick/1-min 2020–2026. Tick volume stands in for volume/delta (relative volume = tick count vs. its same-time-of-day 20-day average).
```
Second Day: day1 qualifies if |ret|>2*ATR%_20 and tickvol > 2x avg
 day2: long if the first 30 min hold above the day1 high-range midpoint and then break the day1 high; stop under the 30-min low; target 2R, trail at 1R
Opening Drive: first 5-min bar range > 1.5x avg, relvol(ticks) > 2, closes beyond the prior-day high/low -> enter on the first 1-min consolidation break; stop at the consolidation extreme
```
**Market fit:** GER40 and NAS100 (cash opens) are the best fit, followed by Brent (news days). Low fidelity overall, because the original is discretionary and stock-specific.

## Backtest spec (exact defaults, 2026-10-30)
- Second-day play, 5-min bars. Day 1: |close/prev close − 1| ≥ 2× the ATR14d % move and tick volume ≥ 2× avg. Day 2 (NAS100 09:30–11:00 NY; GER40 09:00–10:30 CET): buy stop above the day-1 high if the open is in the top half of the day-1 range (short mirror). Stop: day-2 first-15-min low. TP: 50% at 2R, the rest at the close. Sweep: day-1 threshold {1.5,2,3}×ATR.
