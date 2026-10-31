# Carlo Rosa (2022) – Understanding intraday momentum strategies (E-mini S&P 500, OOS + threshold rule)

Paper: C. Rosa, "Understanding intraday momentum strategies", *Journal of Futures Markets* 42(12):2218–2234 (Dec 2022), doi 10.1002/fut.22375. Opened: https://law-journals-books.vlex.com/vid/understanding-intraday-momentum-strategies-1049461706 (abstract, introduction, data section). Wiley page timed out; full tables NOT opened.

**Verified result:** Academic, not live. Data: 5-min E-mini S&P 500 (ES) futures, front month rolled on expiry, Sep 1997 – Dec 2020. Findings (CONFIRMED from opened text): (1) the Gao et al. (2018) overnight-return → last-half-hour predictability **disappears out-of-sample** (2014–2020), which the author reads as "likely due to data mining"; (2) a Markov-switching model finds two regimes, and between 2014 and 2020 the high-predictability state occurred **only March–December 2020 (COVID)**; (3) a strategy that trades only when |overnight return| exceeds a threshold has higher success rate, return per trade and Sharpe as the threshold rises, while total return is hump-shaped with an optimum threshold > 0; (4) returns have significant alpha and low loadings on Fama-French factors. Exact threshold values, Sharpe ratios and per-trade returns were NOT opened → not reported.
**Independent 2020–26 check:** RIP Backtest found all 8 Gao-Han-Li-Zhou versions (first half-hour → last half-hour) on ES/NQ 2020–2026 lost before costs (https://ripbacktest.com/posts/intraday-momentum-strategy-papers/). Rosa's signal (overnight return) is a close cousin; treat as weak. Style: intraday.

## Rules
| Rule | Detail | Status |
|---|---|---|
| Signal | Overnight return = (RTH open or start of day session) vs previous close; sign predicts last 30 min | CONFIRMED (paper intro) |
| Entry | At the start of the last half-hour: long if overnight return > 0, short otherwise | CONFIRMED |
| Exit | Always unwound at market close | CONFIRMED |
| Threshold filter | Trade only when |overnight return| > threshold | CONFIRMED (concept); value NOT opened |
| Default threshold value | 0.25% (our choice; sweep below) | INFERRED |
| Overnight definition boundaries | Previous 16:15 ET futures settlement vs 09:30 ET | INFERRED (paper excerpt does not give exact clock times) |
| Regime dependence | Edge concentrated in high-volatility regime (2020) | CONFIRMED |
| Citation | Paz Serpa (2026) cites this as J. Financial Markets 60:100718 | CONFLICT (the paper itself prints J Futures Markets 42:2218–2234) |

## Backtest spec (exact defaults, 2026-10-31)
- Markets: NAS100 and S&P (US500) 1-min 2020–2026; GER40 analog (overnight = prior 17:30 → 09:00 Europe/Berlin, last half-hour 17:00–17:30); XAUUSD analog (overnight = prior 17:00 NY → 09:30 NY, trade 16:30–17:00 NY) INFERRED.
- US session: overnight return r_on = open(09:30 ET)/close(16:00 ET prev) − 1. Entry 15:30 ET bar open, direction sign(r_on), exit 16:00 ET (15:59 bar close). No stop, no TP (holding rule = 30 min).
- Default threshold |r_on| ≥ 0.25%; size 1× notional; cost 1 tick + commission per side.
- Sweep grid: threshold {0, 0.10, 0.25, 0.50, 0.75, 1.00}%; signal = overnight only vs overnight + first 30 min (Gao); also condition on VIX/realized vol top tercile (regime proxy).
- Report per-year results; expect positive only in 2020 and high-vol years.

### Pseudocode
```python
for d in days:
    r_on = open_at(d, '09:30') / close_at(d-1, '16:00') - 1
    if abs(r_on) < TH: continue
    side = 1 if r_on > 0 else -1
    entry = open_at(d, '15:30'); exit_ = close_at(d, '15:59')
    pnl += side * (exit_ / entry - 1) - 2 * COST
```

## Labels
style=intraday; confidence=low; instruments=ES futures; timeframe=5m (last 30m); best_backtest_markets=NAS100;US500;GER40
