# Dato' Dr. Nazri Khan (DDNK) — Footprint/order-flow scalping at US open
**Verified result (OFFICIAL):** Won all four 2024 Futures Day Trading quarters: Q1 302.5%, Q2 179.6%, Q3 357.2%, Q4 223.4% (https://www.worldcupchampionships.com/2024-quarterly-finals). Also Darwinex DARWIN SDKK (third-party tracked). Confidence: high (record), low (rules).
| Rule | Value | Status |
|---|---|---|
| Style | Active scalping | CONFIRMED – https://www.darwinexzero.com/blog/active-scalping-nazri-khan |
| Prep | Starts 2h before US open: pre-market conditions, key levels, patterns | CONFIRMED (Darwinex) |
| Tools | Footprint charts → imbalances, aggressive activity, liquidity points; also dark-pool data, ML models, sentiment | CONFIRMED (Darwinex; IFTA 2025 abstract https://www.linkedin.com/posts/ifta-global-organization-ba5947259_ifta2025-conference-iftaconferencegermany-activity-7343654937089724417-GckR) |
| Session | Early hours of US market ("power hour") | CONFIRMED; exact = 09:30–10:30 ET INFERRED |
| Bias | Contrarian to mainstream sentiment | CONFIRMED (Darwinex) |
| Instrument | Likely index futures (NQ/ES) | INFERRED |
| Entry/stop/target | Stacked-imbalance fade at pre-marked level; stop beyond level; 1–2R | INFERRED |
```
levels: PDH, PDL, ONH, ONL, prior POC (from tick-vol profile)
09:30–10:30 ET, 1m bars: proxy delta d=tickvol*sign(close-open)
contrarian: price tags level, d_zscore>2 in breakout direction but close back inside level (absorption) -> fade
stop = level extreme + 0.25*ATR1m*?; TP1 1R, TP2 VWAP; max 4 trades/day
```
**Fit:** NAS100 best; GER40 (08:00–09:00 CET open), XAUUSD (13:30 UTC); BTC weak.

## Backtest spec (exact defaults, 2026-10-30)
- NAS100 1-min, 09:30–10:30 NY. Levels = prior-day high/low and overnight high/low. Fade: price pierces a level by ≤ 10 pts with 1-min tick volume ≥ 3× avg20 and closes back inside (absorption proxy, INFERRED-DEFAULT). Stop 15 pts beyond the extreme. TP 1.5R. Flat 10:30 NY. Sweep: vol {2,3,5}; TP {1,1.5,2}R.
