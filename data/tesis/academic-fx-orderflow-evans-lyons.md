# Evans & Lyons "Meese-Rogoff Redux": end-user order flow forecasts USD/EUR out-of-sample (AER P&P 2005)

**Paper:** Martin D. D. Evans & Richard K. Lyons, "Meese-Rogoff Redux: Micro-Based Exchange Rate Forecasting", *American Economic Review* 95(2), 2005, 405–414. Opened: NBER Working Paper 11042 (Jan 2005), https://www.nber.org/papers/w11042 (PDF https://www.nber.org/system/files/working_papers/w11042/w11042.pdf).

**Verified result:** VERIFIED (paper, true ex-ante recursive out-of-sample).
- Data: all of Citibank's end-user trades in USD/EUR spot and forward, Jan 1993 – Jun 1999. Before 1999 the euro is synthesised from its legacy currencies.
- Order flow is split into 6 segments: US and non-US × {non-financial corporations, investors, leveraged traders}. Citibank end-user share was 10–15%.
- Forecast period starts 6/3/1996 with recursive estimates; 797–778 forecasts.
- Table 1, Micro II (6 disaggregated flows):
  - MSE ratio vs random walk 0.961 / 0.876 / 0.848 / 0.810 / 0.806 at h = 1 / 5 / 10 / 15 / 20 trading days
  - projection β = 0.027 / 0.057 / 0.102 / 0.122 / 0.157, p = 0.005 / 0.018 / 0.005 / 0.007 / 0.002
- Micro I (aggregate flow): β significant at h ≥ 10 (p 0.000); MSE ratio 0.896 at h = 20 (p 0.106).
- Macro models (UIP, Fama) never beat the random walk.
- Quote: "micro-based forecasts account for roughly 16 percent of the variance in monthly spot rate changes."
- **Key caveat (CONFIRMED, paper):** "this order flow information is not available to everyone." The edge needs private bank customer-flow data.
- No trading P&L or costs are reported. The paper measures forecasting accuracy, not strategy returns.

## Rules
| Rule | Detail | Status |
|---|---|---|
| Predictor | Signed end-user order flow (buyer- vs seller-initiated), summed over the past h days, by segment | CONFIRMED |
| Horizon | Forecast the next h ∈ {1, 5, 10, 15, 20} trading days; strongest at ~1 month | CONFIRMED |
| Estimation | Recursive OLS (growing window); rolling also robust | CONFIRMED |
| Retail data proxy | 1-min tick volume signed by bar direction (or CME 6E futures volume signed by the tick rule) as a crude order-flow proxy | INFERRED (tick volume ≠ signed customer flow; expect much weaker results) |
| Trading rule | Go long/short EURUSD by the sign of the forecast, hold h days | INFERRED |

## Backtest spec (exact defaults, 2026-10-31)
- Markets: EURUSD (primary, the paper's pair), plus USDJPY, GBPUSD, AUDUSD, and XAUUSD as a non-FX control.
- Data: 1-min OHLC + tick volume, 2020-01-01 → 2026-09-30. Daily cut at 17:00 America/New_York.
- Proxy flow (INFERRED): x_day = Σ_minutes sign(close − open) × tick_volume, normalised by the 60-day mean daily tick volume. Variant: "segment" proxy = flow split by session (Asia 17:00–02:00 ET, Europe 02:00–08:00, US 08:00–17:00) as 3 regressors, a stand-in for the paper's US/non-US split.
- Model: Δs(t→t+h) = a + b·X(t−h→t) + e. Recursive OLS starting with a 2-year burn-in (forecasts from 2022-01-01). h default 20 trading days, sweep {1, 5, 10, 20}.
- Trade: at the 17:00 ET daily close, position = sign(forecast). Size: vol-targeted at 10% annualised. Rebalance daily on overlapping-horizon forecasts (h tranches of 1/h each, INFERRED). No stop/TP: holding rule h days.
- Costs: EURUSD 0.2 pip + $7/lot, USDJPY 0.3, GBPUSD 0.5, AUDUSD 0.4, XAU 0.25 USD, plus swap.
- Evaluation, as in the paper: MSE ratio vs random walk and projection β with Newey-West (h−1 lags). Then trading Sharpe/max DD net.
- Sweep grid: h {1, 5, 10, 20}; flow proxy {sign×tickvol, (close−open)/range×tickvol, session-split}; window {recursive, rolling 500d}; threshold |forecast| > {0, 0.25σ}.

### Pseudocode
```python
X = daily_signed_tickflow(pair)            # sum sign(C-O)*tickvol per day, 17:00 ET cut
for t in days[burn_in:]:
    y = fwd_return(pair, h)                 # s(t+h)-s(t)
    b = ols(y[:t-h], rolling_sum(X,h)[:t-h])   # recursive, only data known at t
    f = b[0] + b[1]*rolling_sum(X,h)[t]
    fcst.append(f); tranche_pos[t] = sign(f)/h
pos = sum(last h tranches); pnl = pos*ret - costs(turnover)
report(mse_ratio, projection_beta_nw, sharpe_net, maxdd)
```

## Labels
style=swing/position (1–20 day horizon, flow-based); confidence=high (paper, private Citibank flow) / low (retail tick-volume proxy, INFERRED); instruments=EURUSD (paper), FX majors; timeframe=daily from 1m; best_backtest_markets=EURUSD;USDJPY;GBPUSD;AUDUSD
