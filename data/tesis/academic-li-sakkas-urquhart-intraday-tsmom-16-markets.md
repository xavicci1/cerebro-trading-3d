# Li, Sakkas & Urquhart (2022) – Intraday time-series momentum in 16 developed equity markets (DAX/GER40 evidence)

Paper: Z. Li, A. Sakkas, A. Urquhart, "Intraday time series momentum: global evidence and links to market characteristics", *Journal of Financial Markets* 57 (2022) 100619. Opened accepted version: https://centaur.reading.ac.uk/95566/1/Accepted-Version.pdf

**Verified result:** Academic, not live; data PRE-2018 (4 Oct 2005 – 29 Dec 2017), so it does not meet this batch's post-2018 criterion — included as the only opened source with per-country DAX statistics. 1-min Thomson Reuters Tick History index quotes, 16 MSCI developed markets, USD-converted. ITSM rule: sign of first half-hour return (incl. overnight) → position in last half-hour, closed at the close.
- Germany (DAX, trading hours 09:00–17:30 per Table 1): in-sample slope β = 2.97 (t 3.25), adj. R² 0.78% (Table 3, Panel A); out-of-sample (Table 4) R²_OOS −0.64, constrained R²_OOS 0.11, Clark-West MSPE-adj 1.02 (not significant), ENC-NEW 7.32 (5%); economic value (Table 5): ITSM mean 4.105%/yr, SD 5.591%, Sharpe 0.734 vs always-long-last-half-hour 0.673 and buy-and-hold 0.293; alpha vs always-long 4.222% (5% level).
- US (S&P 500): ITSM Sharpe 1.115 (Table 5); OOS R²_OOS −3.10, MSPE-adj 2.07 (5%).
- Cross-country: alphas significant in 10 of 16 countries (2.66% UK to 7.45% Norway per annum vs always-long); predictability stronger in crisis/recession and in low-liquidity groups; US first half-hour predicts other markets' last half-hour.
**Independent check on later data:** none for DAX found; on ES/NQ 2020–2026 the US version lost before costs (RIP Backtest, https://ripbacktest.com/posts/intraday-momentum-strategy-papers/). Style: intraday.

## Rules
| Rule | Detail | Status |
|---|---|---|
| First half-hour return | r_F = price(open+30 min)/prev close − 1 (includes overnight) | CONFIRMED (paper eq. 1 and Table 3 note) |
| Signal | Long last half-hour if r_F > 0; short if r_F ≤ 0 | CONFIRMED (eq. 6) |
| Exit | Close at market close every day | CONFIRMED |
| DAX session | 09:00–17:30 local | CONFIRMED (Table 1) |
| OOS strength on DAX | Weak (R²_OOS negative, MSPE-adj not significant) | CONFIRMED (Table 4) |
| Use of US first half-hour as extra signal for GER40 | Paper finds US predictability across markets; exact model not reproduced | INFERRED |
| Costs | Paper returns are gross | INFERRED (no cost model seen in opened sections) |

## Backtest spec (exact defaults, 2026-10-31)
- Market: GER40 1-min 2020–2026, session 09:00–17:30 Europe/Berlin (cash). Control markets: NAS100 09:30–16:00 America/New_York; XAUUSD synthetic 09:30–16:00 NY (INFERRED).
- Signal at 09:30 Berlin: r_F = close(09:29 bar)/close(prev 17:29 bar) − 1. Entry 17:00 Berlin bar open; side = +1 if r_F > 0 else −1; exit 17:29 bar close. No stop/TP; holding 30 min.
- Size 1× notional; cost default 1.0 index point round-trip on GER40.
- Sweep grid: last-window length {15, 30, 60 min}; min |r_F| threshold {0, 0.2, 0.5}%; add-on filter: US 09:30–10:00 ET return same sign (for GER40 last window, note 17:00 Berlin ≈ 11:00 ET) {off, on}; drop days with |r_F| > 3%.
- Report per-year PnL and break-even cost.

### Pseudocode
```python
for d in days:
    rF = close_at(d, '09:29') / close_at(d-1, '17:29') - 1
    if abs(rF) < TH: continue
    side = 1 if rF > 0 else -1
    if US_FILTER and sign(us_first30(d)) != side: continue
    pnl += side * (close_at(d, '17:29') / open_at(d, '17:00') - 1) - COST
```

## Labels
style=intraday; confidence=low; instruments=16 developed equity indices incl. DAX, S&P 500; timeframe=1m (30m windows); best_backtest_markets=GER40;NAS100
