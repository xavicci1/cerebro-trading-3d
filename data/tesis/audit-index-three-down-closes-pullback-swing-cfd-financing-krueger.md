# Audit: "third down close above the 50/200-day average, hold 5 days" (NAS100 / 8 indices), turn-of-month, pre-holiday, 20-day-high and 4h hammer, measured after CFD overnight financing (KruegerAlgorithms 2026; daily search to 2018, holdout 2019 → 2 Oct 2026). This file resolves the "Russell 2000 three lower closes" lead with the closest opened evidence
**Sources (all opened 2026-10-31):**
- KruegerAlgorithms, "Swing patterns on daily and weekly bars after CFD financing". Search: data start (1962–1992) → 2018. Holdout: 1 Jan 2019 → 2 Oct 2026. 4h patterns use Dukascopy 1m, search 2015–2022, holdout 2023 → 5 Jun 2026. 1,920 daily/weekly tests + 500 4h tests: https://kruegeralgorithms.com/en/research/swing-patterns-daily-weekly-after-cfd-financing
- Library cross-reference (not re-opened today): larry-connors-rsi2.md (Krueger's confirmed RSI(2) dip rule, referred to on the page "as in the RSI(2) study"), audit-krueger-seven-published-anomalies-net-of-costs.md, academic Lakonishok-Smidt pre-holiday row.
- **Not found:** no opened page tests a *Russell 2000* "three lower closes" rule. That lead stays open; Krueger covers S&P 500, Nasdaq-100, Dow, DAX, FTSE 100, Nikkei 225, Hang Seng, ASX 200 and GLD only.

**Verified result:** Independent third-party research. It is not peer-reviewed and has no trader record.
- **Cost model:** Pepperstone swap formula + spread 1.6–5.1 bps RT + dividend adjustment.
- **Best lead:** **NAS100 long after the third consecutive down close while above the 50-day SMA, hold 5 days.** Search +70.1 bps net per trade; holdout **+73.6 bps (t 1.81, n 47)**. About half of that equals buy-and-hold of the same exposure: excess t 0.92, global q 0.20. With a **one-day entry delay the holdout gives −12.2 bps**.
- **Other candidates:**
  - 8-index version (above the 200-day SMA): +25.2 bps in the holdout (t 1.58, n 528; excess t 0.35).
  - Turn of the month: +18.7 bps (t 1.00, n 736).
  - Day before a holiday: +8.0 bps (t 1.52, n 527).
  - 20-day-high close, 1 day: +4.9 bps (t 1.69, n 1,315).
- **Verdict:** no excess over buy-and-hold reaches t 1, and none passes the global correction (q 0.20–0.85, threshold 0.10). These are observations, not rules.

## Rules / findings
| Rule / finding | Detail | Status |
|---|---|---|
| NAS100 pullback | Buy at the close of the **third down close in a row** while close > SMA(50); hold **5 trading days**; exit at the close. Search +70.1 bps / holdout +73.6 bps (t 1.81; n 47 in 7.75 yrs) | CONFIRMED (rule wording, numbers) |
| 8-index pullback | Same, with close > SMA(200), across 8 indices. Search +27.7 / holdout +25.2 bps (t 1.58; n 528); 80% of the holdout result = buy-and-hold | CONFIRMED |
| "Down close" definition | Close < previous close, three days in a row | INFERRED (page says "third down close in a row") |
| Entry timing | At the signal close (idealised). With a one-day delay the NAS100 holdout gives −12.2 bps | CONFIRMED |
| Turn of the month | Buy at the close of the second-to-last trading day; sell at the close of the third trading day of the new month. Daily: search +29.5 (t 4.25), holdout +18.7 (t 1.00). CFD 1m: 2015–2022 +8.8 (t 0.49), 2023–Jun 2026 +0.05 (t 0.00) | CONFIRMED |
| Day before a holiday | Search +7.9 (t 3.69), holdout +8.0 (t 1.52); CFD 1m +17.7 (t 2.61) / +9.6 (t 1.27). Positive in all four windows, significant in none | CONFIRMED |
| 4h hammer at the 20-bar low (NAS100) | Search +43.9 bps (t 3.2), q 0.12; holdout 2023–Jun 2026 +7.9 bps (t 0.36) | CONFIRMED |
| Candle patterns (inside bar, NR7, engulfing, hammer, key reversal) | Family pre-registered. Apart from the Hang Seng weekly key reversal (holdout +65.7 bps, t 0.61, n 11) and the 4h hammer above, no candle rule (incl. NR7, inside bar) reached the holdout | CONFIRMED |
| CFD overnight financing | Pepperstone formula: nights × price × size × (reference rate ± 2.5%) / 360. Friday counts triple (gold: Wednesday). Median 5-day long rule: gross +17.5, financing −10.8, dividends +3.5 → +6.6 bps net (financing ate 62% of gross). Friday→Monday long: −7.95 bps (t −5.8) | CONFIRMED |
| Short side | Only 7–21% of short rules net positive vs 48–65% of long rules (index drift). Of 119 tests with q ≤ 0.10, 99 are significantly negative | CONFIRMED |
| Forward vs cash CFD | Forward CFDs are cheaper after ~1 night for US500, NAS100, US30, GER40, and after 4–5 nights for UK100, HK50, AUS200 | CONFIRMED |
| Gold | None of 210 gold variants reaches t 3 (best t 2.2) | CONFIRMED |
| CONFLICT with retail "3 lower closes" folklore | Retail versions present it as a stand-alone edge. Krueger: half is market drift, and the excess is statistically indistinguishable from zero | CONFLICT |

## 1:20 R:R check
Not applicable: these are time exits (5 days or turn-of-month) with no target. Risk is the 5-day path (no stop in the source).

## Backtest spec (exact defaults, 2026-10-31)
- **Markets / data:**
  - Primary NAS100 (cash index or CFD daily, 2000-01-01 → 2026-09-30); holdout reporting 2019-01-01 → 2026-09-30.
  - Transfer (INFERRED, not in Krueger): US2000/Russell 2000 (IWM or RTY), GER40, US500. XAUUSD/GLD as a negative control.
- **Signal (EOD, exchange close; NY 16:00 for US, Frankfurt 17:30 for GER40):** C[t] < C[t−1] < C[t−2] < C[t−3] (third consecutive down close) AND C[t] > SMA(C, 50).
- **Entry:** at close t (default; MOC). Variant: next open (Krueger: one-day delay flips the sign).
- **Exit:** close of t+5 trading days. No stop, no TP. Catastrophe stop −8% close-to-close (INFERRED, off in the replication). No overlapping trades: ignore new signals while in a trade.
- **Costs:**
  - Spread 2.5 bps RT for NAS100 (Krueger range 1.6–5.1 bps).
  - Financing: nights × price × (ref rate + 2.5%) / 360 for longs; Friday ×3; dividends credited at index yield.
  - Futures variant: 1 tick + commission, no swap.
- **Sweep:**
  - Down closes {2, 3, 4}; trend filter {none, SMA50, SMA200}; hold {1, 3, 5, 10} days.
  - Entry {signal close, next open, next close}; instrument {cash CFD, forward CFD, futures}.
  - Market {NAS100, US500, US2000, GER40, XAUUSD}.
- **Controls:** buy-and-hold of the same exposure (same days in the market), 1,000 random entries with the same hold, block-bootstrap random market; report excess over buy-and-hold with its t, plus BH q across the sweep.
- **Do not backtest on:** FX majors and BTC with this exact rule; there is no Krueger test and the drift logic does not apply.

### Pseudocode
```python
in_trade_until = None
for t in range(200, len(C)):
    if in_trade_until and t <= in_trade_until: continue
    three_down = C[t] < C[t-1] < C[t-2] < C[t-3]
    if three_down and C[t] > sma(C, 50)[t]:
        entry, exit_ = C[t], C[t+5]
        nights = calendar_nights(dates[t], dates[t+5])                # Fri counts 3
        fin = nights * (ref_rate[t] + 0.025) / 360                    # long pays
        div = div_yield[t] * nights / 365
        pnl = exit_/entry - 1 - 2.5e-4 - fin + div
        log(dates[t], pnl); in_trade_until = t + 5
bh = buy_hold_same_exposure(days_in_market)
report(mean_t(pnl), excess_vs(bh), split(<2019, >=2019), delay_variant(1), bh_q())
```

## Labels
style=swing (2–10 days, mean-reversion in uptrend); confidence=low (holdout positive but t 1.8, n 47, ~50% = market drift, sign flips with 1-day delay, q 0.20); instruments=NAS100;US500;8 indices; timeframe=daily; best_backtest_markets=NAS100;US500;US2000;GER40
