# Kevin Davey — Strategy-factory systematic breakout / mean-reversion

**Verified result:** World Cup Trading Championship (futures) 1st 2006 at 106.7%; 2nd 2005 at 148.0%; 2nd 2007 at 111.6%.
- Source: official historical standings, re-opened 2026-10-31: https://www.worldcupchampionships.com/world-cup-trading-championship-historical-standings
- Also the CTE dataset: https://completetradersedge.com/world-cup-trading-championships/
- Davey is not in the current (2026) standings.
- Confidence: high (record), **low** (exact rules — contest system not disclosed).
- *Rotation re-verification 2026-10-31:* added the exact 2nd-place returns (148.0% 2005, 111.6% 2007) from the official list, re-checked the BST interview, and repaired a garbled validation line in the backtest spec.

## Rules
| Rule | Value | Status |
|---|---|---|
| Disclosure | Competition system not disclosed; "not based on any indicator. It is based on statistical analysis" | CONFIRMED – http://2012tradingcontest.blogspot.com/2012/04/welcome-back-kevin.html |
| Process | Goals → idea → feasibility → walk-forward → Monte Carlo → 3–6 mo incubation → portfolio | CONFIRMED – https://www.youtube.com/watch?v=5tcyMqgtrTg |
| Entry testing | Test entries with a neutral n-bar time exit to verify edge before adding exits; test entries symmetrically (long and short) | CONFIRMED – Better System Trader ep. 162 (re-opened 2026-10-31): https://bettersystemtrader.com/162-building-effective-entries-and-exits-kevin-davey/ |
| Exits | Simple fixed stop; entry signals reused as exits | CONFIRMED (same) |
| Indicator accuracy | Most indicators/entries land around 45–55% accuracy and lose money once costs are included (BST interview paraphrase) | CONFIRMED-paraphrase (same) |
| Book | *Entry and Exit Confessions of a Champion Trader* (52 entry/exit studies) | CONFIRMED (BST page) |
| Example | Euro mean-reversion system goal: 50% annual, max 25% DD, max 2 trades/day | CONFIRMED (YouTube summary) |
| Concrete rules below | n-bar breakout with ATR stop | INFERRED (illustrative of his published style, NOT his contest system) |

## Backtest spec (exact defaults, 2026-10-31)
- Markets: XAUUSD, NAS100, GER40, USDJPY, Brent, BTC, EURUSD, GBPUSD. Daily bars from 1-min 2020-01-01 → 2026-09-30.
- Daily closes:
  - NAS100 16:00 America/New_York
  - GER40 17:30 Europe/Berlin
  - XAUUSD/USDJPY/Brent/FX 17:00 America/New_York
  - BTC 00:00 UTC
- Illustrative only; his contest system is undisclosed.
- Step 1, entry test (CONFIRMED method): buy stop at the 20-bar high, sell stop at the 20-bar low (INFERRED-DEFAULT). Exit after a fixed n bars, n ∈ {1, 5, 10, 20}, no stop. Keep the entry only if it is profitable after costs across most n and both sides.
- Step 2, full system: same entry; stop fixed 1.5×ATR20 at entry; exit on an opposite 10-bar breakout or a 20-bar time exit. No TP.
- Validation (CONFIRMED process): walk-forward 4y in / 1y out (anchored); 1,000 Monte Carlo trade-order resamples. Reject if the 95th-percentile max drawdown > 25% or risk of ruin > 10%. Incubate 3 months out-of-sample before live.
- Costs: FX 0.2–0.5 pip + $7/lot; XAU 0.25; NAS100 1 pt; GER40 1 pt; Brent 0.03; BTC 0.05%.
- Sweep grid: breakout {10, 20, 40}; stop {1, 1.5, 2.5}×ATR20; time exit {10, 20, 40} bars.

### Pseudocode
```python
for m in markets:
    for t in daily_closes(m):
        if flat(m):
            buy_stop(highest(H[m], 20, t)); sell_stop(lowest(L[m], 20, t))   # OCO
        if long(m) and (L[m][t] <= entry - 1.5*atr20_at_entry or C[m][t] < lowest(L[m],10,t-1) or bars_held >= 20):
            exit(m)
        # shorts mirror
wf = walk_forward(train_years=4, test_years=1, params=grid)
mc = monte_carlo(wf.trades, runs=1000)
accept = mc.dd_p95 <= 0.25 and mc.risk_of_ruin <= 0.10
```

## Labels
style=systematic breakout / mean-reversion (methodology wrapper); confidence=high (record) / low (rules); instruments=futures (various); timeframe=60m/daily; best_backtest_markets=XAUUSD;NAS100;GER40;USDJPY;Brent;BTC
