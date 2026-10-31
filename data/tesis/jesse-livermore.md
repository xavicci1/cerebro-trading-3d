# Jesse Livermore – Pivotal points / line of least resistance

**Verified result:** Historical and secondary only: ~$100M from the 1929 short (Wikipedia/press, secondary). Primary text: *How to Trade in Stocks* (1940) — http://www.r-5.org/files/books/trading/speculation/Jesse_Livermore-How_To_Trade_In_Stocks_(1940_original)-EN.pdf ; *Reminiscences* (Lefèvre 1923) is fictionalized. No audited record. Style: position.

Legend: CONFIRMED = stated in primary/well-documented source (cited); INFERRED = my reasoning to make it mechanical; CONFLICT = sources disagree.

## Rules
| Item | Rule | Status |
|---|---|---|
| Pivotal point | Buy when price breaks to new high through a key level (e.g. round number, prior top) | CONFIRMED – *How to Trade in Stocks* |
| Probe/pyramid | Initial 20% position, add 20%, 20%, 40% as each prior buy shows profit | CONFIRMED (Reminiscences/How to Trade – trial positions) – percentages from later commentators → CONFLICT |
| Stop | Never average down; close losing trade at ~10% loss | INFERRED (commonly attributed; not verified verbatim) |
| Market Key | 'Natural rally / natural reaction' columns with 6-point (and 3-point) thresholds | CONFIRMED – Livermore Market Key in book |
| TP | Ride trend until pivotal reversal; danger signals (climax volume) | CONFIRMED qualitative |


## Backtest adaptation (XAUUSD, NAS100, GER40, USDJPY, Brent, BTC; 1-min/tick 2020–2026)
- Resample 1-min to daily bars using each market's session close (FX/metals/Brent: 17:00 New York; NAS100: 16:00 NY cash close or 17:00 CFD roll; GER40: 17:30 Frankfurt; BTC: 00:00 UTC). Weekly = Friday close (BTC: Sunday 00:00 UTC). INFERRED: consistent session boundaries are required so N-day highs/ATR match published daily-bar rules.
- Use the 1-min data only for intrabar fill sequencing (stop vs. target hit order) and realistic slippage; signals are on daily/weekly closes unless stated.
- Costs: spread + commission per market (e.g. XAU 0.2–0.3$, NAS100 1–2 pts, GER40 1–2 pts, USDJPY 0.5–1 pip, Brent 0.03$, BTC 0.05–0.1%) plus overnight financing for CFDs. Position sizing in risk-% of equity, contract value normalized by point value.
- Warm-up: need ≥ longest lookback (e.g. 200d / 30w) before 2020 → start trades 2020-10 or load 2019 data.
- Validation: walk-forward 2020–2023 in-sample / 2024–2026 OOS; no parameter optimization beyond the published values first (faithful replica), then robustness sweep ±20%.

### Market fit
Best: XAUUSD, BTC, Brent. Rules partly discretionary → medium/low fidelity.

## Pseudocode
```python
# Market Key with threshold T = 6 pts (scale to ATR: T = 2*ATR20 daily INFERRED)
state machine columns: upward_trend, natural_rally, natural_reaction, downward_trend
buy when price exceeds last upward_trend pivot high by T/2 (pivotal confirmation)
pyramid: add tranches at +1 T increments (0.2,0.2,0.2,0.4)
stop: -10% from avg entry or reversal to downward_trend column
```

## Verification pass (2026-10-30)
- DOWNGRADED: the '10% loss rule' is CONFIRMED-secondary/INFERRED (commonly attributed; not verified verbatim in the 1940 text this pass). The $100M figure is secondary.

## Backtest spec (exact defaults, 2026-10-30)
- Daily closes: NAS100 16:00 NY, GER40 17:30 CET, XAUUSD/USDJPY/Brent 17:00 NY, BTC 00:00 UTC. Pivotal point = the 63-bar high. Enter a 20% unit on a close > the pivot; add 20%, 20%, 40% at each +3% from the last add (pyramid CONFIRMED; 3% INFERRED-DEFAULT). Stop 10% below the average entry (INFERRED). Exit at close < the 20-bar low. No TP. Sweep: pivot {20,63,126}; add step {2,3,5}%.
