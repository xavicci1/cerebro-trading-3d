# Lance Breitstein — Intraday capitulation reversal ("right side of the V")
**Verified result:** Former Trillium prop trader; reported $1M+ day; no public audit. Confidence: low-med (record), medium (rules).
| Rule | Value | Status |
|---|---|---|
| Setup | Unusually fast, deep, high-volume flush (capitulation); skip steady declines/ranges | CONFIRMED-secondary – https://traderlion.com/investing-champions/lance-breitsteins-simple-setup-that-made-millions/ , https://chatwithtraders.com/episode/236-lance-breitstein-the-ultimate-day-trader-pt-3 |
| Entry | Don't catch the knife; buy break of prior bar's high after the low | CONFIRMED-secondary (same) |
| Stop | Below capitulation low; trail under prior-bar lows | CONFIRMED-secondary |
| Sizing | ~25% larger when intraday & daily trends align | CONFIRMED-secondary |
| Thresholds | drop ≥3×ATR in ≤N bars, vol ≥3× | INFERRED |
```
1m/5m: capit = (high(20)-low)/ATR14_5m > 4 within 12 bars AND tickvol last 3 bars > 3*median AND drop % > 2*daily ATR%
entry: buy stop above high of first bar after the low; stop = capit low - 1 tick; trail = prior 5m bar low; TP partial at VWAP
```
**Fit:** BTC, XAUUSD, NAS100, Brent (news flushes) good; GER40 ok; USDJPY intervention days.

## Backtest spec (exact defaults, 2026-10-30)
- 5-min bars. NAS100 09:30–16:00 NY; BTC 24h (UTC); XAU/Brent 08:00–17:00 NY.
- Capitulation: price falls ≥ 1.5×ATR14(daily) within 6 bars with tick volume ≥ 3× avg20 (INFERRED-DEFAULT).
- Entry: buy stop above the high of the first bar after the low (CONFIRMED form). Stop: capitulation low −1 tick. Trail under prior-bar lows after +1R. TP: VWAP or 3R, whichever comes first. Flat at the session close.
- Sweep: drop {1.0,1.5,2.0}×ATR14d; volume {2,3,5}×.
