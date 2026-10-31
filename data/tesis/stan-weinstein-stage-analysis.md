# Stan Weinstein – Stage Analysis

**Verified result:** Mixed. *Professional Tape Reader* ranked No.1 in 1982 (+56.4%, CS Monitor https://www.csmonitor.com/1983/0124/012435.html). In Hulbert's 1994 rankings it was 2nd-worst, +66% since 1980 (Deseret News https://www.deseret.com/1994/7/24/19121471/value-line-newsletter-ranked-as-top-performer/). Book: *Secrets for Profiting in Bull and Bear Markets* (1988).

Legend: CONFIRMED = stated in primary/well-documented source (cited); INFERRED = my reasoning to make it mechanical; CONFLICT = sources disagree.

## Rules
| Item | Rule | Status |
|---|---|---|
| Timeframe | Weekly charts, 30-week MA (10-week for traders) | CONFIRMED – Weinstein book ch.2 |
| Stages | 1 base (MA flat), 2 advance (price>rising MA), 3 top, 4 decline | CONFIRMED |
| Long entry | Breakout above Stage-1 resistance with price above 30w MA, MA flat→rising, volume ≥2× avg weekly volume, RS (Mansfield) turning positive | CONFIRMED |
| Short entry | Breakdown below Stage-3 support, below 30w MA (volume not required) | CONFIRMED |
| Stop | Initial below base low / prior swing low; trail under correction lows; exit if weekly close < 30w MA in later stage | CONFIRMED |
| Market filter | Trade with market & sector stage ("forest-to-trees") | CONFIRMED |
| TP | None | CONFIRMED |


## Backtest adaptation (XAUUSD, NAS100, GER40, USDJPY, Brent, BTC; 1-min/tick 2020–2026)
- Resample 1-min to daily bars using each market's session close (FX/metals/Brent: 17:00 New York; NAS100: 16:00 NY cash close or 17:00 CFD roll; GER40: 17:30 Frankfurt; BTC: 00:00 UTC). Weekly = Friday close (BTC: Sunday 00:00 UTC). INFERRED: consistent session boundaries are required so N-day highs/ATR match published daily-bar rules.
- Use the 1-min data only for intrabar fill sequencing (stop vs. target hit order) and realistic slippage; signals are on daily/weekly closes unless stated.
- Costs: spread + commission per market (e.g. XAU 0.2–0.3$, NAS100 1–2 pts, GER40 1–2 pts, USDJPY 0.5–1 pip, Brent 0.03$, BTC 0.05–0.1%) plus overnight financing for CFDs. Position sizing in risk-% of equity, contract value normalized by point value.
- Warm-up: need ≥ longest lookback (e.g. 200d / 30w) before 2020 → start trades 2020-10 or load 2019 data.
- Validation: walk-forward 2020–2023 in-sample / 2024–2026 OOS; no parameter optimization beyond the published values first (faithful replica), then robustness sweep ±20%.

### Market fit
Good: XAUUSD, BTC, NAS100 (weekly 2020–26 has clean stage 2). Volume unreliable for FX/CFD → drop or use tick volume (INFERRED). Few trades (~2–6/market/6y) → evaluate as portfolio.

## Pseudocode
```python
w = resample_weekly; ma=sma(w.c,30); slope=ma-ma.shift(4)
resist = max(w.h over base window where abs(slope)/ma<0.01)  # INFERRED base def
if w.c>resist and w.c>ma and slope>=0 and w.vol>2*avg_vol and mansfield_rs>0: buy next open
stop=base_low; trail: max(stop, last weekly swing low); exit if w.c<ma and slope<0
```

## Verification pass (2026-10-30)
- CHANGED: the long-run Hulbert record is *weak* (CONFIRMED). Confidence for the trading edge is downgraded; the method is documented but its verified results are poor.

## Backtest spec (exact defaults, 2026-10-30)
- Weekly bars on the Friday close (Daily closes: NAS100 16:00 NY, GER40 17:30 CET, XAUUSD/USDJPY/Brent 17:00 NY, BTC 00:00 UTC.) Long: weekly close above the 26-week high with SMA30w rising and tick volume ≥ 2× avg10w (2× CONFIRMED); Mansfield RS is skipped for single markets (INFERRED). Stop: 26-week low (base low). Exit: weekly close < SMA30w. Short mirror without the volume rule. No TP. Sweep: MA {10,30,40}w.
