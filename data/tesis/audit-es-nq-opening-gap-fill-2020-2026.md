# Audit – Opening gap fill (fade the RTH gap) on ES/NQ futures, 2020–2026 (two independent backtests)

Opened sources:
- RIP Backtest spec (frozen 22 Oct 2026): https://ripbacktest.com/posts/es-gap-fill-strategy/gf_spec.md
- RIP Backtest results (run 22 Oct 2026): https://ripbacktest.com/posts/es-gap-fill-strategy/gf_results.txt
- BacktestingMax, "Overnight gap fill backtest on NQ and ES futures" (tested 26 Oct 2026): https://www.backtestingmax.com/backtests/overnight-gap-fill

**Verified result (independent backtests, not live):**
- RIP Backtest, ES 1-min Jan 2020 – 25 Sep 2026, $30.76 round trip/contract, entry 09:31 open, target = previous RTH close:
  - Fill rates by close: 0.10–0.25% gaps up 72.7% / down 75.1%; 0.25–0.50% up 50.2% / down 55.3%; 0.50–1.00% ~33%; >1% ~19%.
  - GF-1X (all gaps ≥0.10%, stop one gap away): 1,391 trades, net −$19,787 (gross +$17/trade, net −$14), PF 0.97, 50.0% winners, control percentile 72.8, without top-10 −$74,217 → Buried (2/6). By year: 2020 −$22,763 … 2025 +$23,346, 2026 +$7,434.
  - GF-SMALL (0.10–0.50%): 907 trades, net −$20,274, holdout −$16,947 → Buried (1/6). GF-NS (no stop): 61.7% winners but net −$29,887 → Buried (2/6).
- BacktestingMax (CFD-derived futures data, 5-min, 2020–2025, gaps 0.25–1%, stop one gap beyond 09:30 price, 1% risk, $50k): MNQ +22.3% (PF 1.07; 2020–23 +24.4%, 2024–25 −1.7%), MES +4.6% (PF 1.01; costs took $8,190 of $10,505 gross), RTY −11.8%. "Gap filled" ≠ "trade won": MNQ filled 58.0% of days, only 47.5% hit TP first. Inside-previous-range gaps lost on all 3 markets; outside gaps made money on all 3 (MNQ +34.5R) — flagged by the authors as post-hoc. "Wait for first 5-min candle toward the fill" was the only variant positive in both periods (MNQ +5.3%/+3.7%, MES +0.8%/+4.4%) but failed their checks.
**Verdict:** The popular "gaps always fill" fade has no robust edge on ES/NQ after costs 2020–2026. Two sources agree. Only lead: NQ outside-range gaps + 5-min confirmation (post-hoc; needs a fresh holdout). Style: intraday.

## Rules
| Rule | Detail | Status |
|---|---|---|
| Gap | RTH open (09:30 ET) vs previous RTH close (16:00 ET; 13:00 on half days) as % | CONFIRMED (both) |
| Size filter | RIP: ≥0.10%; BTMax: 0.25%–1% | CONFIRMED / CONFLICT (different defaults) |
| Entry | Fade at the open (RIP 09:31 bar open; BTMax 09:30) | CONFIRMED |
| Target | Previous RTH close | CONFIRMED |
| Stop | One gap size beyond entry (risk = reward) | CONFIRMED (both) |
| Time exit | 16:00 ET | CONFIRMED |
| Confirmation variant | Enter at 09:35 only if first 5-min candle closed toward the fill | CONFIRMED (BTMax) |
| Outside-range filter | Trade only gaps opening beyond prior RTH high/low | CONFIRMED as observation; post-hoc (BTMax) |
| Half-target variant | Worse OOS (all 3 markets lost 2024–25) | CONFIRMED (BTMax) |

## Backtest spec (exact defaults, 2026-10-31)
- Markets: NAS100 (primary), US500/ES, GER40 (gap = 09:00 Berlin open vs prior 17:30 close), DJ30. Data 1-min 2020–2026.
- Defaults: gap band 0.25%–1.00%; filter = outside prior RTH range; confirmation = first 5-min bar closes toward the fill and has not touched TP/SL; entry next bar open (09:35 ET / 09:05 Berlin); TP = prior RTH close; SL = entry-side 09:30 price ± 1× gap; time exit 16:00 ET / 17:30 Berlin; 1 trade/day; risk 1% per trade; cost 1 tick per side + commission.
- Sweep grid: gap band lower {0.10, 0.25, 0.50}%, upper {0.50, 1.00, 2.00}%; stop multiple {0.5, 1.0, 1.5}× gap; confirmation {0, 5, 15 min}; range filter {none, inside, outside}.
- Validation: freeze defaults; holdout = Oct 2026 onward (all 2020–2026 data has been used by the sources).

### Pseudocode
```python
for d in days:
    pc = rth_close(d-1); o = price_at(d, OPEN)
    g = (o - pc) / pc
    if not (LO <= abs(g) <= HI): continue
    if FILTER == 'outside' and rth_low(d-1) <= o <= rth_high(d-1): continue
    side = -1 if g > 0 else 1
    tp = pc; sl = o - side * STOP_MULT * abs(o - pc)
    c5 = bar5(d, OPEN)
    if CONFIRM and not (side * (c5.close - c5.open) > 0): continue
    if touched(c5, tp) or touched(c5, sl): continue
    entry = open_at(d, OPEN + 5min)
    run_bracket(side, entry, tp, sl, exit_time=CLOSE, stop_first_on_tie=True)
```

## Labels
style=intraday; confidence=low; instruments=ES, MES, MNQ, RTY futures; timeframe=1m/5m; best_backtest_markets=NAS100;US500;GER40
