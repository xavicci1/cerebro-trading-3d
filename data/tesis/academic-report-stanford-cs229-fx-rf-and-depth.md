# Stanford CS229 FX reports — Random-Forest daily FX (2019) and EUR/USD next-second depth imbalance (2011)

**Status:** Course project reports (not peer-reviewed). Both have genuine held-out tests; both are weak/inapplicable as tradeable strategies → filed as negative/limited controls.

## A) Zhang, Sun, Zhang — "CS229: Foreign Currency Exchange Rate Forecast" (13 Jun 2019)
- Report: https://cs229.stanford.edu/proj2019spr/report/34.pdf (opened 2026-10-31)
- Data: daily closes GBP/USD, USD/EUR, USD/JPY Jan 2001–Dec 2018 (Bloomberg) + macro/market features (S&P 500, S&P 100, Nasdaq, DJIA, CPI change, fed funds, NBER recession, federal debt); split 0.8/0.1/0.1 train/val/test.

## Reported results (CONFIRMED)
| Item | Value |
|---|---|
| Sign accuracy (avg of 3 pairs) | Lasso 0.52, Ridge 0.55, Logistic 0.51, SVM-rbf 0.51, RF 0.53, MLP 0.52 |
| Model selected | Random Forest (R² 0.74 avg; per-pair GBP 0.70, JPY 0.74, EUR 0.78) |
| Test period | 3/7 Mar 2017 – 30 Nov 2018 |
| Final cash from $100 (no costs) | GBP 104.40; JPY 104.44; EUR 110.5; GBP+JPY 100.33; JPY+EUR 109.46; GBP+EUR 104.88; all three 101.30 |
| Path | All-three portfolio peaked ~$112 around Mar 2018 then fell to 101.30 (authors blame trade-war regime change) |

Caveats (my assessment): no transaction costs; sign accuracy ≈ coin flip while R² 0.74 on returns is implausible for daily FX → likely target/feature leakage (log-price-level features); single ~21-month test. Strategy is long-foreign-currency-only "switching".

## B) Brown, Mundkowsky, Shiu — "Predicting Intraday Price Movements in the Foreign Exchange Market" (CS229 2011)
- Report: https://cs229.stanford.edu/proj2011/BrownMundkowskyShiu%20-PredictingIntradayPriceMovementsInTheForeignExchangeMarket.pdf (opened 2026-10-31)
- Data: EUR/USD 1-second mid-quotes + best bid/ask depth (millions EUR), 1 Feb–13 Mar 2008 (~2.5M obs); first 70% train, last 30% test (751,680 obs).

| Item | Value (CONFIRMED) |
|---|---|
| Perceptron, depth only | 69% next-second direction accuracy (on seconds with a move) |
| With depth imbalance > 10M EUR | 81% accuracy on 25% of moving observations |
| Horizon decay | 2 s 64%, 3 s 57%, no power by 7 s |
| Markov/value-iteration model | gross $110,900 on 1,730 trades; $50 cost per trade (0.5 pip); net $24,500 = $2,816/day; $14 net/trade |
| Expanded state (2nd level depth) | net $25,400 on 1,806 trades |
| Authors' caveat | ignores execution delay, impact, costs beyond spread; "unlikely… such substantial profits in practice" |

Note: 1,730 × $50 = $86,500; $110,900 − $86,500 = $24,400 vs reported $24,500 (small rounding discrepancy in the report).

## Exact rules
| Rule | Value | Status |
|---|---|---|
| A: features | log return t, t−1; SMAs of log return 5/10/20/60/120; log price, square, cube, SMAs 5/10/20/60/220 + macro | CONFIRMED |
| A: trade | each day, if any predicted USD/ccy ratio < 1, hold the currency with the lowest predicted ratio for one day | CONFIRMED |
| B: features | best bid depth, best ask depth, previous 1-s mid change | CONFIRMED |
| B: signal | bid depth ≫ ask depth → up-tick; threshold 10M EUR imbalance | CONFIRMED |
| Tick-volume proxy for depth | our data has no depth → proxy = signed tick-volume imbalance | INFERRED |

**Fit:** A → USDJPY daily as a negative control (ML-on-price without costs). B → not reproducible (no L2 depth in our tick data); a tick-volume-imbalance proxy on USDJPY/XAUUSD is the only feasible test and must beat ≥1 spread per round trip.

## Backtest spec (exact defaults, 2026-10-31)
- A (USDJPY, daily 00:00 UTC bar): walk-forward RF (300 trees, max_depth 5 — INFERRED), features = A list without macro; train rolling 5 years, refit monthly; go long/short USDJPY 1 day if |pred| > 0; cost 1 spread per change. Holding 1 day. Sweep: depth {3,5,8}; train window {2,5,8}y; threshold {0, 0.5σ_pred}.
- B proxy (USDJPY & XAUUSD ticks, 07:00–16:00 UTC only): imbalance I = (upticks − downticks)/(total) over last 1 s / 5 s; enter in sign(I) if |I| > 0.6; exit after 1 s / 3 s; cost = full spread. Sweep: window {1,5,10}s; threshold {0.4,0.6,0.8}; hold {1,3,7}s.

### Pseudocode
```python
# B proxy
for t in ticks.index:
    w = ticks[t-window:t]
    I = (w.up.sum()-w.down.sum())/max(1,len(w))
    if abs(I) > thr:
        d = sign(I); entry = ask[t] if d>0 else bid[t]
        exit_px = bid[t+hold] if d>0 else ask[t+hold]
        pnl.append(d*(exit_px-entry))
```

## Labels
style=scalping (B) / swing-daily (A); confidence=high (that A is not tradeable as reported), low (B transfer to our data); instruments=GBP/EUR/JPY vs USD; EUR/USD; timeframe=daily / 1s; best_backtest_markets=USDJPY (negative control); XAUUSD (B proxy)
