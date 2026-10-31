# Audit: seven published intraday anomalies replicated on 13 CFD markets net of costs (KruegerAlgorithms 2026) — Baltussen closing momentum, Lucca-Moench pre-FOMC, Breedon-Ranaldo EUR session, Osler round numbers, Lou-Polk-Skouras overnight, Etula month-end, Boyarchenko overnight drift
**Sources (all opened 2026-10-31):**
- KruegerAlgorithms, "Seven Published Anomalies Replicated: Gross at 40–80% of the Paper Size, None Survives Costs": https://kruegeralgorithms.com/en/research/published-anomalies-net-of-costs
- KruegerAlgorithms research index (programme context: 106 rules through holdout, 2 passed): https://kruegeralgorithms.com/en/research
- Library files this audit updates: academic-hedging-demand-intraday-momentum-baltussen.md, academic-pre-fomc-drift-lucca-moench.md, academic-fx-intraday-breedon-ranaldo.md, academic-overnight-intraday-tug-of-war.md (Lou-Polk-Skouras). No library file yet for Osler, Etula or Boyarchenko.

**Verified result:** Independent third-party replication (not peer-reviewed). Data: DAX, FTSE, CAC, SMI, Dow, NQ, SPX, JPN225, AUS200, EURUSD, GBPUSD, USDJPY, gold; Dukascopy CFD minute data (BID); search 2015–2022, each paper rule run once; holdout Jan 2023 → Jun 2026 only for the 3 rules still standing. Costs: spread + slippage, round trip ~1–5 bps, indices outside cash hours ×2.5. Null: random markets (every 1-min candle mirrored at its open with p = ½), placebo levels, always long. **Gross, four of seven replicate at ~40–80% of the published size; net, none survives costs (the only positive net search result, Breedon-Ranaldo, failed its holdout); all three holdout runs failed (SPX closing momentum reversed).** Context cited by the page: McLean-Pontiff find ~58% less return for stock anomalies after publication.

## Rules / findings
| Paper / rule (as operationalised) | In the paper | Krueger gross | Krueger net / holdout | Status |
|---|---|---|---|---|
| Baltussen et al. 2021: last 30 min follow the day's return (from prior close to 30 min before close) | Sharpe 1.73, 6.9% p.a. | +1.15 bps/day (t 3.5), pooled 9 indices, 16,731 trades; Europe +1.60 (t 4.1) | −1.89 (t −5.7); only DAX net positive (+0.56, t 0.72, driven by 2020). **SPX holdout (788 days): −2.65 bps (t −3.71), hit 43.0%, 94% of random directions beat it** | CONFLICT with library Baltussen file for CFD trading |
| Baltussen gamma condition | momentum when dealers short gamma | untestable: Krueger's gamma file showed short gamma on 498/502 days 2021–22 | holdout = unconditional rule | CONFIRMED (limitation) |
| Lucca-Moench 2015: long 24 h before FOMC | +49 bps (t > 4.5) | +19.8 bps (t 2.3), without 5 best days t 0.5; intraday +0.6 (t 0.15) | 24 h +16.9 (t 1.8); intraday −2.2 (t −0.4); 63 FOMC dates | CONFIRMS library CONFLICT (decay) |
| Breedon-Ranaldo 2013: EURUSD falls in the European session | −0.084 annualised log | −0.067 (80%), +2.65 bps/day (t 4.1), 8/8 years | search +1.50 (t 2.35, 2,074 days) → **holdout −0.34 (t −0.41, 889 days)**; holdout overlaps another rejected window | CONFLICT (failed holdout) |
| Osler 2003/2005: reversal at round numbers | more reversals than at arbitrary levels | bounce 43.8% vs 47.5% placebo (t −5.3), 9,474 vs 19,502 touches, all 8 years | fade −2.8 (t −28); crossing continuation +0.89 bps vs placebo (t 4.0) → trade −1.63 (t −9.8). Tip: no stops just behind round numbers | CONFLICT (bounce part reversed) |
| Lou-Polk-Skouras 2019: trend following earns only overnight | 1.40%/month (t 3.24) | overnight +0.9 (t 0.8), intraday −1.8 (t −1.7) | intraday −4.6 (t −4.3) | not replicated at index level |
| Etula et al. 2020: month-end pressure then reversal | selling, then recovery | reversal days long +4.7 (t 1.3), intraday version | +1.7 (t 0.45) | not replicated |
| Boyarchenko et al. 2023: overnight drift | +1.5 bps/day (t 7.1) | +1.20 (t 2.9), ~0 since 2017 | −5.5 (t −13.4) | replicated gross, decayed |

**Combinations (search 2015–2022, pre-registered):**
| Combination | n | Gross | Net | t net |
|---|---|---|---|---|
| Round-number crossing in trend direction, 60 min | 3,443 | +2.00 | +0.18 | 0.37 |
| Trend following after open, high VIX only | 1,045 | −0.26 | −2.56 | −0.50 |
| Closing momentum, large days only | 3,858 | +0.83 | −2.08 | −2.18 |
| Closing momentum with 10-day trend | 6,648 | +1.76 | −1.14 | −2.02 |
| Noon-to-close day direction, high VIX only | 6,618 | +2.05 | −0.36 | −0.25 |
| Fade large 60-min moves in Asian hours (EUR, GBP) | 1,101 | +0.30 | −1.03 | −2.76 |
- DAX 17:00–17:30 closing momentum with the 10-day trend (picked after the fact, 1 of 7 markets): search 946 trades +2.60 bps net (t 2.89) → **holdout 419 trades +0.41 (t 0.65)**, negative at 1.5× costs, gain from 2025 (CONFIRMED).
- Filters lift ~1 bp to ~2 bps gross vs 2–3 bps costs; no combination net t ≥ 3 (CONFIRMED).

## 1:20 R:R check
Not applicable: all effects are 1–3 bps time-exit drifts. Using the round-number crossing (best gross +2.0 bps) with a 1:20 bracket is not supported by any number on the page (INFERRED).

## Backtest spec (exact defaults, 2026-10-31) — re-test the strongest residual only
- **Purpose:** reproduce Krueger's negative verdict on our own data before any library rule based on these papers is used; one cell per market, no new tuning.
- **Test A (closing momentum, Baltussen):** NAS100, US500 (NY 15:30→15:59, America/New_York) and GER40 (Berlin 17:00→17:29, Europe/Berlin). Signal r = px(close−30 min)/prior_close − 1; side = sign(r); exit 1 min before close. Costs NAS100 2.5 pts, US500 0.8 pts, GER40 2.5 pts. Variant filter: 10-day trend agreement (sign(close_t−1 / close_t−11 − 1) = side).
- **Test B (EUR session, Breedon-Ranaldo):** EURUSD short 08:00→16:00 London (Europe/London), cost 1.15 bps (INFERRED window; Krueger's exact session definition not stated on the page).
- **Test C (round numbers, Osler continuation):** XAUUSD (levels every 10 USD), USDJPY (every 1.00 yen), first touch per day, enter in crossing direction after the cross, exit 15 min later; costs XAUUSD 0.40 USD, USDJPY 0.016 yen. Placebo: quarter/three-quarter levels.
- **Stops/TP:** none (time exit) for A and B; C uses ±10 bps bracket variant as Krueger's fade did.
- **Sweep:** A filter {none, 10d trend, |r| top tercile}; B start {07:00, 08:00} × end {12:00, 16:00}; C hold {15, 30, 60} min. Period 2015–2022 search, 2023–2026 holdout single run; random-market null; BH across all cells.
- **Expected per Krueger:** all net ≤ 0. A positive holdout here would be NOTABLE.

### Pseudocode
```python
for d in sessions(mkt):
    r = px(d, close - 30m) / prior_close(d) - 1
    side = sign(r)
    if FILTER == '10d' and side != sign(close(d-1) / close(d-11) - 1): continue
    pnl = side * (px(d, close - 1m) / px(d, close - 30m) - 1) * 1e4 - cost_bps(mkt)
    log(d, pnl)
report(mean_t(), by_year(), random_market(), holdout_once(2023, 2026), bh_q())
```

## Labels
style=intraday (published anomalies); confidence=high that the paper rules are not tradable net on CFDs 2015–2026 (single independent replication, one run each, holdouts negative); instruments=13 CFDs (indices, FX majors, gold); timeframe=1m; best_backtest_markets=NAS100;US500;GER40;EURUSD;XAUUSD;USDJPY
