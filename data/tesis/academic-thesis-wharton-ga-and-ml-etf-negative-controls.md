# Academic theses (Wharton / Penn) — Genetic-algorithm rules and intraday ML ETF rotation: negative OOS controls
**Status:** Both PDFs opened and read. **Genuine OOS: yes in both → no significant excess return after costs.** Useful as caveats and as cost-sensitivity templates, not as strategies to deploy.

## 1) Dworkis & Huang — GA-evolved technical rules (Wharton Research Scholars, 2008)
- **Authors:** Dworkis and Huang; faculty mentor Franklin Allen (Wharton). Wharton Research Scholars project, 2008.
- **Repository (opened):** https://repository.upenn.edu/server/api/core/bitstreams/2f833324-1ffa-49a5-9357-3b2dc175144d/content
- **Method:** Allen & Karjalainen (1999)-style genetic programming of trading rules (inputs: normalized price, moving averages, arithmetic and abs-difference operators). Fitness = cumulative excess return over buy-and-hold. CONFIRMED.

| Experiment | Design | Result (CONFIRMED, thesis text) |
|---|---|---|
| S&P 500 | Data from 1954; rolling 5-year training (1954–58, 1959–63, …), 1-year selection, out-of-sample to 2002; costs 0.1% / 0.25% / 0.5% | excess returns "essentially 0" at the lowest cost; "increasingly negative on average as transaction costs increase" |
| China A-shares | Shanghai A index normalized by 250-day MA; train 1998–2002, select 2003–04, OOS 2005 onward (to the 2007 bull top); same costs | **significantly negative** excess returns OOS (rules sat out a huge bull market) |
| Gasoline futures | Normalized front-month gasoline; 0% cost | slight negative average excess return; two rules +2.48% and +6.87% (authors flag one as likely non-robust) |
| Overall | — | "no significant positive excess returns" above buy-and-hold |

## 2) Fan Zhang — Intraday ML forecasting and ETF rotation (EAS 499 Senior Capstone, Penn/Wharton, 25 Apr 2018; advisor Abraham Wyner)
- **Repository (opened):** https://fisher.wharton.upenn.edu/wp-content/uploads/2019/06/Thesis_Fan-Zhang.pdf
- **Data/design:** 44 liquid ETFs and CFD index/FX/commodity proxies (US-listed ETFs mapped to CFDs, e.g. USA30IDXUSD, GAS.CMD → UNG), 1-min and 30-min bars in 2017; 52 training days, 40 validation days, 40 test days. Models: elastic net (EN), a kNN variant (SkNN), random forest (RF). Each bar: predict next-bar mid-price return and spread, go long the security with the best forecast profit after crossing the spread if forecast > cutoff π0, hold 1 bar. CONFIRMED.

| Result (CONFIRMED, thesis tables in text) | Value |
|---|---|
| 1-min validation, active trading | mostly negative after crossing spread; e.g. SkNN ARR **−99.18%** |
| 30-min test, selected (RF, R²), passive | 422 trades, ABR 2.51%, ARR **−27.65%**, RRT −0.0124%, MD −5.29%, Sharpe −0.08 |
| 30-min test, selected (RF, R²), active | 422 trades, ARR **−76.67%**, RRT −0.0510%, MD −21.12%, Sharpe −0.32 |
| Author's verdict | "Overfitting has cost us an arm and a leg"; spread cost dominates active trading |

## Exact rules usable as controls
| Rule | Value | Status |
|---|---|---|
| GA rule fitness | excess return over buy-and-hold, net of cost per trade | CONFIRMED |
| Train/select/OOS | 5y / 1y / next years, rolling | CONFIRMED |
| ML rotation | long top forecast if forecast net profit > π0; 1-bar hold | CONFIRMED |
| π0 value | tuned on validation; numeric value not reproduced here | INFERRED (use 0) |

## Backtest spec (defaults)
- Purpose: **cost/overfit control** for any rule-mining run on the six target markets (XAUUSD, NAS100, GER40, USDJPY, Brent, BTC), 2020–2026.
- GA control: daily bars; rolling 5-year train → 1-year select → 1-year OOS; costs {0.02, 0.05, 0.10}% per side; population 500, 50 generations, max tree depth 5 (INFERRED defaults). Report OOS excess vs buy-and-hold per market.
- ML rotation control: 30-min bars, session 00:00–24:00 UTC (BTC) or main session per market (NAS100 09:30–16:00 NY; GER40 09:00–17:30 Berlin; XAUUSD/USDJPY/Brent 08:00–17:00 London); random forest on last 10 bar returns, tick-volume z-score and spread; train 52 days / validate 40 / test 40, rolling; long-only top-1 if predicted return − spread > 0; hold 1 bar.
- Sweep: cost multiplier {0.5,1,2}; bar size {5,15,30,60} min; π0 {0, 0.5×spread, 1×spread}; train window {26,52,104} days.

### Pseudocode
```python
for window in rolling(train=52d, val=40d, test=40d):
    model = RandomForest().fit(X[train], y_ret[train])
    for bar in test:
        pred = model.predict(X[bar]) - spread[bar]
        k = argmax(pred)
        if pred[k] > pi0: long(k, hold=1 bar)   # pay full spread
report OOS vs buy-and-hold; expect ~0 or negative after costs
```

## Labels
style=intraday ML / daily GA; confidence=high that the result is negative; best_backtest_markets=all (as negative controls).
