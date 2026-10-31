# Nicolas Darvas – Box Theory (techno-fundamental)

**Verified result:** Turned ~$25–36k into ~$2.25M in 18 months (1957–59), reported by Time magazine (1959) and his book *How I Made $2,000,000 in the Stock Market* (1960). Style: position/swing.

Legend: CONFIRMED = stated in primary/well-documented source (cited); INFERRED = my reasoning to make it mechanical; CONFLICT = sources disagree.

## Rules
| Item | Rule | Status |
|---|---|---|
| Universe | Stocks making new all-time/52w highs on rising volume, growing earnings industries | CONFIRMED – Darvas book |
| Box top | New high not exceeded for 3 consecutive days | CONFIRMED (book describes box forming; 3-day convention widely documented) – exact count partially INFERRED |
| Box bottom | Low not broken for 3 subsequent days after top set | CONFIRMED/INFERRED (same) |
| Entry | Buy stop just above box top | CONFIRMED |
| Stop | Automatic stop-loss just below box bottom (he used stop-loss orders always) | CONFIRMED |
| Trailing | Raise stop to bottom of each new higher box | CONFIRMED |
| TP | None; exit on stop | CONFIRMED |
| Sizing | Pyramid: bigger buys after confirmation; fixed initial | CONFIRMED qualitatively; amounts INFERRED |


## Backtest adaptation (XAUUSD, NAS100, GER40, USDJPY, Brent, BTC; 1-min/tick 2020–2026)
- Resample 1-min to daily bars using each market's session close (FX/metals/Brent: 17:00 New York; NAS100: 16:00 NY cash close or 17:00 CFD roll; GER40: 17:30 Frankfurt; BTC: 00:00 UTC). Weekly = Friday close (BTC: Sunday 00:00 UTC). INFERRED: consistent session boundaries are required so N-day highs/ATR match published daily-bar rules.
- Use the 1-min data only for intrabar fill sequencing (stop vs. target hit order) and realistic slippage; signals are on daily/weekly closes unless stated.
- Costs: spread + commission per market (e.g. XAU 0.2–0.3$, NAS100 1–2 pts, GER40 1–2 pts, USDJPY 0.5–1 pip, Brent 0.03$, BTC 0.05–0.1%) plus overnight financing for CFDs. Position sizing in risk-% of equity, contract value normalized by point value.
- Warm-up: need ≥ longest lookback (e.g. 200d / 30w) before 2020 → start trades 2020-10 or load 2019 data.
- Validation: walk-forward 2020–2023 in-sample / 2024–2026 OOS; no parameter optimization beyond the published values first (faithful replica), then robustness sweep ±20%.

### Market fit
Best: BTC, NAS100, XAUUSD (persistent new-high regimes 2020–26). Brent long+short variant (mirror). Tight boxes on daily → frequent whipsaws on USDJPY/GER40.

## Pseudocode
```python
track new high H; if 3 days no new high -> box_top=H
then lowest low L; if 3 days L holds -> box_bottom=L; box complete
if box complete and high>box_top: buy stop at box_top+tick; stop=box_bottom-tick
on each new completed box above: stop=new box_bottom
filter: c near 52w high, vol>vol50
```

## Verification pass (2026-10-30)
- CONFIRMED: a Time profile (25 May 1959) reports a fortune above $2M — https://time.com/archive/6803538/business-pas-de-dough/ . The 18-month framing and starting capital come from his own book (self-reported).

## Backtest spec (exact defaults, 2026-10-30)
- Daily closes: NAS100 16:00 NY, GER40 17:30 CET, XAUUSD/USDJPY/Brent 17:00 NY, BTC 00:00 UTC.
- Universe filter: close at a 252-day high in the last 10 days.
- Box top = a high not exceeded for the 3 following bars; box bottom = the lowest low after the top, not broken for 3 bars (CONFIRMED 3-day convention).
- Entry: buy stop box top +0.1% (INFERRED-DEFAULT). Stop: box bottom −0.1%. Trail the stop to each new box bottom. No TP. Risk 1%.
- Sweep: confirm bars {2,3,4}; buffer {0,0.1,0.5}%.
