# London 4pm WMR Fix — end-of-month pre-fix reversal (Evans 2018; Melvin & Prins 2015)

**Papers**
- Martin D. D. Evans (Georgetown), "Forex Trading and the WMR Fix", Journal of Banking & Finance 87 (2018) 233–247, doi 10.1016/j.jbankfin.2017.09.017. Opened the MPRA preprint: https://mpra.ub.uni-muenchen.de/81583/1/MPRA_paper_81583.pdf.
- Michael Melvin & John Prins, "Equity hedging and exchange rates at the London 4p.m. fix", Journal of Financial Markets 22 (2015) 50–72. Abstract opened: https://econpapers.repec.org/RePEc:eee:finmar:v:22:y:2015:i:c:p:50-72.
- Fix-window change: FSB "Foreign Exchange Benchmarks" progress report, https://www.fsb.org/uploads/FX-Benchmarks-progress-report.pdf (opened).

**Verified result:** VERIFIED (paper).
- Evans sample: 2004–2013, 21 currency pairs, Gain Capital 1-min data, costs from EBS spreads.
- Table 6, annual return % for h = 15 / 5 / 1 min:
  - EUR/USD: 3.965 / 0.486 / 0.068 (Sharpe 1.881 / 0.222 / 0.042)
  - EUR/GBP: 8.325 / 8.614 / 6.657 (SR 2.865 / 3.162 / 2.460)
  - AUD/USD: 9.187 / 12.292 / 8.353 (SR 3.375 / 4.353 / 3.124)
  - CAD/USD: 2.486 / 9.538 / 8.429 (SR 0.852 / 3.450 / 3.176)
  - NZD/EUR: 10.698 / 15.098 / 2.450
  - Negative: JPY/USD (−1.646 / −0.667 / −1.234) and USD/GBP (−3.054 / −2.091 / −5.804)
- Summary: Sharpe > 1 for 15 pairs at some horizon and > 2 for 8 pairs; most max drawdowns < 2%.
- Pseudo-OOS: "I also calculated the post-2010 returns on the strategy for each currency pair that had the highest Sharpe Ratio in the pre-2010 data. This produced an average return across the currencies of 3.25 percent."
- Melvin & Prins: "equity market appreciation over the month can be used to predict currency depreciation before the end-of-month fix" (hedging channel).

**Regime change (CONFIRMED, FSB):** "On 15 February 2015, WM widened the window used to calculate benchmark rates from 1 minute for 'traded' currencies and 2 minutes for 'non-traded' currencies, to 5 minutes for all currency pairs". The FSB also saw a jump in algorithmic execution of fix orders. Evans' sample predates this, and in his sample the fix was computed over "a one minute window starting 30 seconds before 4:00 pm". So 2020–2026 is a post-reform OOS test; expect decay. Confidence: high (in-sample), low-medium (post-2015).

## Rules
| Rule | Detail | Status |
|---|---|---|
| Days | End-of-month trading days only | CONFIRMED (Evans) |
| Signal | Return over the h minutes before 4:00pm London; trade against it (long if the price fell into the fix, short if it rose) | CONFIRMED (Evans) |
| Entry / hold | Enter at the 4:00pm fix and hold h ∈ {1, 5, 15} minutes | CONFIRMED |
| Costs in paper | Zero at the fix (fix-priced order), half the average EBS spread on close | CONFIRMED. Retail cannot trade at the fix price → INFERRED full spread |
| Quote convention | Pairs are labelled e.g. "JPY/USD", "CAD/USD", "USD/GBP", so the sign/convention must be mapped to market quotes (USDJPY, USDCAD, GBPUSD) | CONFIRMED labels; mapping INFERRED |
| Hedging-direction variant | Month-to-date foreign equity return > domestic → the foreign currency weakens into the fix (Melvin & Prins), then partially reverses | CONFIRMED (abstract); reversal part INFERRED |
| Post-2015 window | 5-minute window centred on 4pm (FSB: widened to 5 min) → use 15:57:30–16:02:30 London as the fix span | CONFIRMED width; centring INFERRED |

## Backtest spec (exact defaults, 2026-10-31)
- Markets: EURGBP, AUDUSD, EURUSD (primary); USDCAD, NZDUSD, GBPUSD, USDJPY (controls); XAUUSD (the 4pm fix also matters for gold, INFERRED) as an extra control. Data: 1-min bid/ask 2020-01-01→2026-09-30. Time zone Europe/London (DST-aware).
- Day filter: last trading day of each calendar month (≈ 81 events in 2020–2026).
- Signal: r_pre = mid(15:57) / mid(15:42) − 1. Pre-window h = 15 min, ending before the post-2015 window opens; INFERRED shift.
- Entry: at 16:03 London (just after the 5-min window), direction = −sign(r_pre). Require |r_pre| ≥ 0.5×ATR(15-min, 20-day) (INFERRED filter; off in the base run).
- Exit: time exit at entry + 15 min (16:18 London). No stop/TP (holding rule); optional stop 1×|r_pre| move.
- Cost: full spread at entry and exit (EURUSD 0.3 pip, EURGBP 0.8, AUDUSD 0.6 typical 16:00 London, INFERRED) plus 0.2 pip slippage.
- Sweep grid: h_pre {5, 15, 30, 60} min; hold {1, 5, 15, 30} min; entry {16:00, 16:03, 16:05}; days {EOM only, EOM + last-3, all days (control)}; quarter-end only; Melvin-Prins equity-sign variant (sign = −(foreign MTD equity − US MTD equity)).

### Pseudocode
```python
for d in last_trading_day_each_month(start='2020-01', end='2026-09'):
    pre = mid(d,'15:57') / mid(d,'15:42') - 1          # London time
    if abs(pre) < thr: continue
    side = -sign(pre)
    e = ask(d,'16:03') if side>0 else bid(d,'16:03')
    x = bid(d,'16:18') if side>0 else ask(d,'16:18')
    pnl.append(side*(x-e)/e)
report(annual_return(pnl), sharpe(pnl), maxdd(pnl), by_year(pnl), compare_to_all_days_control)
```

## Labels
style=intraday (event scalp, 15-min hold); confidence=high (in-sample 2004-13) / low-medium (post-2015 window reform); instruments=FX majors/crosses; timeframe=1m; best_backtest_markets=EURGBP;AUDUSD;EURUSD;USDCAD;XAUUSD
