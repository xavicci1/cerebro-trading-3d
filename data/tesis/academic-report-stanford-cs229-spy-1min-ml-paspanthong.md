# Academic report (Stanford CS229, Spring 2019) — Machine learning for next-minute SPY direction
**Status:** PDF opened and read. Course project report, not a peer-reviewed paper or thesis. **Hold-out test set: yes; result after 15 bps costs: negative for every model.**

- **Authors:** Art Paspanthong, Nick Tantivasadakarn, Will Vithayapalert (Stanford University). *Machine Learning in Intraday Stock Trading*, CS229 Spring 2019.
- **Report (opened):** https://cs229.stanford.edu/proj2019spr/report/28.pdf
- **Data:** SPY 1-minute bars, 2019-03-01 → 2019-05-24, from IEX. CONFIRMED.
- **Models:** logistic regression, SVM (best: polynomial kernel), LSTM, multi-layer LSTM/GRU, CNN; lookback window 5 bars was best for RNNs. CONFIRMED.

## Reported results (CONFIRMED)
| Item | Value |
|---|---|
| Rule | long if predicted up-probability > upper threshold, short if < lower threshold, else hold existing position; table uses thresholds **0.48 / 0.50** |
| Best model | SVM polynomial kernel (best portfolio value on test) |
| Test set, 0 cost ($1,000, no leverage, full long/short) | profit/hour: SVM-poly **$1.61** (test acc 0.5449), SVM-RBF $0.79, SVM-linear $0.68, GRU $0.51, multi-layer LSTM $0.47, logistic −$0.11, single LSTM −$0.20, CNN −$0.46, SVM-sigmoid −$0.69 |
| With 15 bps per execution (30 bps round trip) | "transaction costs erode all of our profit, resulting in negative return for all strategies" |
| Accuracy vs profit | higher accuracy does not necessarily mean higher profit (GRU beat multi-layer LSTM on accuracy but made less) |

**Takeaway:** 1-minute direction models need costs well below 1 bp per side to survive. On CFDs (NAS100 spread ≈ 1–2 bps), a next-minute classifier is very unlikely to pay. Useful as a cost-hurdle control.

## Exact rules
| Rule | Value | Status |
|---|---|---|
| Target | sign of next 1-min return | CONFIRMED |
| Features | recent 1-min prices/returns (lookback 5 for RNN) | CONFIRMED (lookback); full feature list INFERRED |
| Thresholds | upper 0.50, lower 0.48 | CONFIRMED |
| Costs | 15 bps per execution | CONFIRMED |

## Backtest spec (defaults)
- Market: NAS100 1-min, 09:30–16:00 America/New_York, 2020–2026 (secondary: GER40 09:00–17:30 Berlin, XAUUSD 08:00–17:00 London).
- Model: SVM (polynomial kernel, degree 3) on the last 5 one-minute log returns plus tick-volume z-score; rolling train 60 trading days, test next 20 days.
- Signal: p_up > 0.50 → long; p_up < 0.48 → short; otherwise keep the position. Re-evaluated every minute; flat at 16:00 NY.
- Costs: actual CFD spread + 0.5 bps slippage; also run 0, 1, 5, 15 bps per side to find the break-even cost.
- Sweep: thresholds {(0.48,0.50),(0.45,0.55),(0.40,0.60)}; lookback {5,10,30}; bar {1,5} min; min-hold {1,5,15} bars.

### Pseudocode
```python
for window in rolling(train=60d, test=20d):
    clf = SVC(kernel='poly', degree=3, probability=True).fit(X[train], y[train])
    for t in test_minutes:
        p = clf.predict_proba(X[t])[1]
        pos = 1 if p > 0.50 else (-1 if p < 0.48 else pos)
        pnl += pos*ret[t+1] - cost*abs(pos - prev_pos)
```

## Labels
style=scalping/HF ML; timeframe=1m; confidence=high that it is cost-negative; best_backtest_markets=NAS100 (control).
