# David Ryan – CANSLIM practitioner

**Verified result:** CONFIRMED: USIC 1985 +161%. 1986 ≈ +160% (Schwager reports 2nd place; Business Insider https://www.businessinsider.com/stock-picking-strategy-11-part-model-market-legend-david-ryan-2020-8). 1987 first place with a triple-digit return; the exact % is not verified (the earlier '118%' is dropped). LA Times 1 Mar 1987 (https://www.latimes.com/archives/la-xpm-1987-03-01-fi-6876-story.html): two-year stock category, $43k → $295k (+578%). CONFLICT: which year/category each figure belongs to (see https://completetradersedge.com/us-investing-championship/). Style: swing/position stocks.

Legend: CONFIRMED = stated in primary/well-documented source (cited); INFERRED = my reasoning to make it mechanical; CONFLICT = sources disagree.

## Rules
| Item | Rule | Status |
|---|---|---|
| Selection | EPS growth, RS ≥90, new highs, base ≥ several months; liked smaller caps | CONFIRMED – Market Wizards interview |
| Entry | Breakout from base, buy pivot; pyramid as it works | CONFIRMED |
| Stop | Initial stop ~ base low, max ~7% loss | CONFIRMED (O'Neil style) |
| Exit | Sell when stock breaks 50d MA on volume / fails | INFERRED from IBD method |
| Sizing | Concentrated positions | CONFIRMED qualitative |


## Backtest adaptation (XAUUSD, NAS100, GER40, USDJPY, Brent, BTC; 1-min/tick 2020–2026)
- Resample 1-min to daily bars using each market's session close (FX/metals/Brent: 17:00 New York; NAS100: 16:00 NY cash close or 17:00 CFD roll; GER40: 17:30 Frankfurt; BTC: 00:00 UTC). Weekly = Friday close (BTC: Sunday 00:00 UTC). INFERRED: consistent session boundaries are required so N-day highs/ATR match published daily-bar rules.
- Use the 1-min data only for intrabar fill sequencing (stop vs. target hit order) and realistic slippage; signals are on daily/weekly closes unless stated.
- Costs: spread + commission per market (e.g. XAU 0.2–0.3$, NAS100 1–2 pts, GER40 1–2 pts, USDJPY 0.5–1 pip, Brent 0.03$, BTC 0.05–0.1%) plus overnight financing for CFDs. Position sizing in risk-% of equity, contract value normalized by point value.
- Warm-up: need ≥ longest lookback (e.g. 200d / 30w) before 2020 → start trades 2020-10 or load 2019 data.
- Validation: walk-forward 2020–2023 in-sample / 2024–2026 OOS; no parameter optimization beyond the published values first (faithful replica), then robustness sweep ±20%.

### Market fit
Stocks/NAS100 only; see O'Neil.

## Pseudocode
```python
same as canslim; filter rs_rank>=90; base_len>=35d; stop=min(base_low, entry*0.93)
exit: close<sma50 with vol>vol50*1.3
```

## Verification pass (2026-10-30)
- FIXED: removed the unverified 1987 '+118%'. Marked the year/category assignment as CONFLICT. Added the LA Times two-year figure.

## Backtest spec (exact defaults, 2026-10-30)
- Daily closes: NAS100 16:00 NY, GER40 17:30 CET, XAUUSD/USDJPY/Brent 17:00 NY, BTC 00:00 UTC. Entry: buy stop at the 30-bar base high; base depth ≤ 30%; close within 15% of the 52w high. Stop 7% (CONFIRMED max). Exit: close < SMA50 on tick volume ≥ 1.5× avg (INFERRED). No TP. Sweep: base {30,50}; stop {5,7}%.
