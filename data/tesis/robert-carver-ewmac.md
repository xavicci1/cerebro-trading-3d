# Robert Carver — EWMAC trend (vol-normalised EWMA crossover, scaled & capped forecasts)

**Verified result:** CONFIRMED-self-published (not audited): Carver (ex-AHL; author of *Systematic Trading*) publishes his own futures account each UK tax year. Blog 14 Apr 2025: futures net −16.3% for the year to 5 Apr 2025 ("worst ever"; MTM −17.8%, slippage −0.56%, commissions −0.29%; ~17% drawdown mid-July–end-Sep 2024). Since 2014: mean 12.9%, stdev 16.8%, Sharpe 0.76 vs AHL 0.42 and SG CTA 0.45 (vol-adjusted comparison), CAGR 12.0%. Blog 5 May 2023 raw series: 2014–15 58.2%, 15–16 23.2, 16–17 −14.0, 17–18 −3.7, 18–19 5.2, 19–20 39.7, 20–21 0.4, 21–22 27.0, 22–23 −8.71; mean 14.1%, SR 0.58, geometric 11.9%.
CONFLICT (inconsistency between his own posts): the 2025 vol-adjusted column (59.5, 28.1, 2.4, 2.0, 4.5, 33.8, −1.7, 25.8, −7.6, 20.6, −14.7) differs from the 2023 raw column (e.g. 2016–17 −14.0 raw vs 2.4 vol-adjusted). Explained by vol-adjustment vs raw — use each series only with its own label. Live system is multi-rule (EWMAC + carry + others, dynamic optimisation since late 2021), NOT pure EWMAC. Confidence: medium (record), high (rules — open source).

Sources opened:
- https://github.com/robcarver17/systematictradingexamples/blob/master/ewmac.py and common.py (re-opened 2026-10-31)
- https://github.com/robcarver17/pysystemtrade (futuresconfig.yaml chapter15; sysquant/estimators/vol.py)
- https://qoppac.blogspot.com/2025/06/quickies-1-overfitting-and-ewmac.html (2 Jun 2025)
- https://qoppac.blogspot.com/2025/04/annual-performance-update-returneth.html (14 Apr 2025)
- https://qoppac.blogspot.com/2023/05/trading-and-investing-performance-year.html (5 May 2023)

| Rule | Value | Status |
|---|---|---|
| Raw signal | EWMA(price, span=Lfast) − EWMA(price, span=Lslow), Lslow = 4×Lfast | CONFIRMED (ewmac.py) |
| Vol normalisation | divide by EWM stdev of daily price differences, span 25 (book example); pysystemtrade robust_vol_calc default 35 days | CONFIRMED (ewmac.py; vol.py) |
| Forecast scalars (book) | 2/8 10.6; 4/16 7.5; 8/32 5.3; 16/64 3.75; 32/128 2.65; 64/256 1.87 | CONFIRMED (common.py) |
| Scalars (2025 blog, different normalisation) | ~15 for 2/8, ~10 for 4/16; EWMAC(2,s) ≈ 2.2 + 184/s^1.25 | CONFIRMED — differs from book table because normalisation differs; do not mix |
| Cap | ±20 | CONFIRMED (ewmac.py cap_series) ; average abs(forecast) target 10 = book convention, not re-opened this batch → INFERRED |
| Config example | weights ewmac16_64 0.21, ewmac32_128 0.08, ewmac64_256 0.21, carry 0.50; FDM 1.31; vol target 20%; IDM 1.89 | CONFIRMED (futuresconfig.yaml) |
| Trend-only weights | 0.42/0.16/0.42 (config weights renormalised without carry) | INFERRED (my computation) |
| Fast variants 2/8, 4/16 | Too costly for expensive instruments (blog on overfitting) | CONFIRMED-qualitative |

**Fit:** all six targets on daily bars; carry only meaningfully available for USDJPY (swap differential) and Brent (curve) — omitted in default.

## Backtest spec (exact defaults, 2026-10-31)
- Data: daily closes (XAUUSD/USDJPY/Brent/BTC 00:00 UTC; GER40 17:30 Berlin; NAS100 16:00 NY) from 1-min. Costs: 1 spread + 0.5 spread slippage per position change, swaps.
- Forecast per rule: f = clip(scalar × (EWMA_fast − EWMA_slow)/σ_diff25, −20, 20) for 16/64 (3.75), 32/128 (2.65), 64/256 (1.87).
- Combined: F = clip(FDM_trend × (0.42 f16 + 0.16 f32 + 0.42 f64), −20, 20), FDM_trend = 1.1 (INFERRED).
- Position (units) = F/10 × (vol_target × capital/N_instruments) / (σ_annual_price × point value); vol_target 20% (CONFIRMED config), IDM ignored for single-instrument tests.
- Buffer: trade only if |target − current| > 10% of average position (INFERRED; Carver's buffering concept, value not re-verified this batch).
- Stop: none (continuous forecast); holding = forecast-driven.
- Sweep: Lfast {8,16,32,64}; vol span {25,35}; vol target {10,20,25}%; buffer {0,10,20}%; include 4/16 only for NAS100/XAUUSD/BTC (low cost).

### Pseudocode
```python
sig = price.diff().ewm(span=25).std()
def fc(f, s, scalar):
    raw = price.ewm(span=f).mean() - price.ewm(span=s).mean()
    return (scalar*raw/sig).clip(-20, 20)
F = (1.1*(0.42*fc(16,64,3.75) + 0.16*fc(32,128,2.65) + 0.42*fc(64,256,1.87))).clip(-20, 20)
ann_vol_ccy = price.pct_change().ewm(span=35).std()*16 * price * pv
target_units = (F/10) * (0.20*capital) / ann_vol_ccy
pos = buffer(target_units, width=0.1*abs(target_units).rolling(250).mean())
```

## Labels
style=position (swing for 16/64); confidence=medium (record) / high (rules); instruments=diversified futures; timeframe=daily; best_backtest_markets=XAUUSD;Brent;USDJPY;BTC;NAS100;GER40
