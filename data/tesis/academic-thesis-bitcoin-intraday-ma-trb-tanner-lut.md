# Academic thesis — Intraday bitcoin moving-average and trading-range-breakout rules (Tanner, LUT 2019)
**Status:** Opened and read (text; result tables are images, so only numbers stated in the text are used). **Genuine OOS: yes (train 2017–2018 / test 2019) → result does NOT hold OOS.**

- **Author:** Visa Tanner. Master's thesis ("Pro gradu"), LUT University (Lappeenranta), 2019. Title: *Effectiveness of technical trading strategies on intraday bitcoin markets*.
- **Repository (opened):** https://lutpub.lut.fi/handle/10024/160440 — PDF: https://lutpub.lut.fi/bitstream/handle/10024/160440/Pro_Gradu_Tanner.pdf
- **Data:** Gemini BTC/USD 1-minute bars, 2017-01-01 → 2019-11-20 (1,443,374 quotes after cleaning). Train 2017–2018, test 2019-01-01 → 2019-11-20. CONFIRMED.
- **Rules tested:** MA crossover (every SMA/LMA pair with LMA ≥ 2×SMA, LMA up to 1500 min) and trading-range breakout (support/resistance = min/max over lag windows, e.g. 60…1200 min); bands 0 / 0.1% / 0.5% (0.05% also used in an event plot); stop-loss 0 / 1% / 2%; fee 0% or 0.1% per transaction (round trip ≈ 0.2%). CONFIRMED. Long-only vs long/short handling is not explicit in the text → INFERRED long/flat default.

## Reported results (CONFIRMED, text of thesis)
| Item | Value |
|---|---|
| Train, 0.1% fee, best MA (by SKASR) | MA 20-1500: **83% annual profit, 55% annual vol**, 699 trades; buy-and-hold SKASR 1.75 |
| Train, 0.1% fee, MA breadth | only **185 of 1,494** MA strategies profitable; 23 best used the 0.5% band; 11 best had SKASR significantly above buy-and-hold |
| Train, 0.1% fee, best TRB | 1200-min lag, 0.1% band, 2% stop: **187 trades, avg +1.04%/trade, $1,941 total, 49% vol**; 44 of 118 TRB strategies profitable; worst = 60-lag no band (>5,000 trades; 1% stop version −$7,260) |
| Train profit vs buy-and-hold | with fees **none** beat buy-and-hold on raw profit; some beat it on risk-adjusted terms |
| **Test 2019, with fee** | "none of the strategies could perform better than buy-and-hold in test-set, no matter which performance measurement was used" |
| Test 2019, no fee | many beat buy-and-hold risk-adjusted, but train/test ranks were inconsistent (best train rules mostly below average in test) |
| vs CCi30 index | none beat CCi30 when fees included |
| Author's own caveat | the edge came from bullish 2017 conditions; "validity of the results very questionable" |

**Takeaway:** Negative control for BTC 1-min trend rules. Fees (0.1%) wipe out fast MA rules; only very slow (LMA ≥ 1000 min, i.e. ~17 h+) rules with bands survived in-sample, and even those failed OOS.

## Exact rules
| Rule | Value | Status |
|---|---|---|
| Signal (MA) | buy when SMA crosses above LMA by more than band b; sell/exit when it crosses below by more than b | CONFIRMED (band definition); exact band application INFERRED (percent of LMA) |
| Signal (TRB) | buy when close > max(close, lag) × (1+b); sell when close < min(close, lag) × (1−b) | CONFIRMED (concept); price field INFERRED close |
| Execution | at next 1-min close after the signal | CONFIRMED (methodology in thesis, read last session) |
| Stop-loss | fixed % from entry (1% or 2%) | CONFIRMED |
| Fee | 0.1% per side | CONFIRMED |

## Backtest spec (defaults)
- Market: BTCUSD 1-min, 2020-01-01 → 2026-09-30 (24/7, timezone UTC). Secondary check: XAUUSD, NAS100 1-min in their main sessions.
- Default A (best in-sample MA): SMA 20 min / LMA 1500 min, band 0.5%, stop-loss 2%, long/flat, fee 0.1%/side + 0.02% slippage. Entry at next 1-min close after the cross; exit on opposite cross or stop.
- Default B (best in-sample TRB): lag 1200 min, band 0.1%, stop 2%, same costs.
- Benchmark: buy-and-hold BTC over the same window; report Sharpe and SKASR-like (Sharpe adjusted for skew/kurtosis; use Cornish-Fisher modified Sharpe).
- Walk-forward: train 2 years → test 1 year, rolling yearly, to replicate the train/test instability check.
- Sweep: SMA {1,5,20,60,120}; LMA {250,500,750,1000,1500,3000}; band {0,0.1,0.5}%; stop {0,1,2,3}%; TRB lag {60,240,720,1200,2880}; fee {0.02,0.05,0.1}%.

### Pseudocode
```python
sma = close.rolling(20).mean(); lma = close.rolling(1500).mean(); b = 0.005
pos = 0
for t in range(len(close)):
    if pos == 0 and sma[t] > lma[t]*(1+b): enter_long(close[t+1]); stop = entry*0.98; pos = 1
    elif pos == 1 and (sma[t] < lma[t]*(1-b) or low[t] <= stop): exit(close[t+1]); pos = 0
# charge 0.1% per side; compare to buy-and-hold
```

## Labels
style=intraday→multi-hour trend; timeframe=1m; confidence=low (OOS failed); best_backtest_markets=BTC (as negative control).
