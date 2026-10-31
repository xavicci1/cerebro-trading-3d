# Richard Dennis / Turtle Traders (Turtle System 1 & 2)

**Verified result:** Dennis reportedly turned ~$5k into ~$100M+ (widely reported, Market Wizards / Covel); Turtle program 1984–88 reported ~80% annual compounded (Curtis Faith, *Way of the Turtle*, 2007). Rules published free by original Turtles (Faith/ originalturtles.org). Style: position (trend following). Instruments: diversified futures.

Legend: CONFIRMED = stated in primary/well-documented source (cited); INFERRED = my reasoning to make it mechanical; CONFLICT = sources disagree.

## Rules
| Item | Rule | Status |
|---|---|---|
| Universe | Liquid futures: bonds, FX, gold/silver/copper, crude/heating oil, cotton, coffee, cocoa, sugar, S&P | CONFIRMED – Original Turtle Rules (https://www.originalturtles.org/) |
| N | 20-day exponential-ish average of True Range: N=(19*prevN+TR)/20 | CONFIRMED – Turtle Rules |
| Unit size | Unit = 1% equity / (N × $ per point) | CONFIRMED |
| Entry S1 | Breakout of 20-day high (long) / low (short), intraday stop entry; skip if last S1 breakout would have been a winner (failsafe: take 55-day breakout if skipped) | CONFIRMED |
| Entry S2 | 55-day breakout, always taken | CONFIRMED |
| Pyramiding | Add 1 unit every +½N from last fill, max 4 units/market | CONFIRMED |
| Stop | 2N from last entry; all units' stops raised to 2N below latest unit (or Whipsaw variant ½N) | CONFIRMED |
| Exit | S1: 10-day opposite extreme; S2: 20-day opposite extreme | CONFIRMED |
| Portfolio limits | 4 units/market, 6 closely correlated, 10 loosely correlated, 12 per direction | CONFIRMED |
| Drawdown rule | Reduce notional account 20% for each 10% drawdown | CONFIRMED |
| TP | None (trailing channel exit only) | CONFIRMED |
| Performance after 2000 | Published rules weaker post-1990s; most backtests show long flat periods | INFERRED from Trading Blox forum discussions/Faith |


## Backtest adaptation (XAUUSD, NAS100, GER40, USDJPY, Brent, BTC; 1-min/tick 2020–2026)
- Resample 1-min to daily bars using each market's session close (FX/metals/Brent: 17:00 New York; NAS100: 16:00 NY cash close or 17:00 CFD roll; GER40: 17:30 Frankfurt; BTC: 00:00 UTC). Weekly = Friday close (BTC: Sunday 00:00 UTC). INFERRED: consistent session boundaries are required so N-day highs/ATR match published daily-bar rules.
- Use the 1-min data only for intrabar fill sequencing (stop vs. target hit order) and realistic slippage; signals are on daily/weekly closes unless stated.
- Costs: spread + commission per market (e.g. XAU 0.2–0.3$, NAS100 1–2 pts, GER40 1–2 pts, USDJPY 0.5–1 pip, Brent 0.03$, BTC 0.05–0.1%) plus overnight financing for CFDs. Position sizing in risk-% of equity, contract value normalized by point value.
- Warm-up: need ≥ longest lookback (e.g. 200d / 30w) before 2020 → start trades 2020-10 or load 2019 data.
- Validation: walk-forward 2020–2023 in-sample / 2024–2026 OOS; no parameter optimization beyond the published values first (faithful replica), then robustness sweep ±20%.

### Market fit
Best: XAUUSD, Brent, USDJPY, BTC (strong trends 2020–26). NAS100/GER40 work long-side but shorts whipsaw. Run as a 6-market portfolio with the correlation caps.

## Pseudocode
```python
N=ema_tr(20)  # wilder-style
unit = 0.01*equity/(N*point_value)
for bar in daily:
  if flat:
     if close_breaks(high20) and not last_s1_winner: enter_long(unit, stop=entry-2*N)
     elif close_breaks(high55): enter_long(unit, stop=entry-2*N)
     (mirror for shorts)
  else:
     if price>=last_fill+0.5*N and units<4: add(unit); stop=last_fill-2*N for all
     if low<=stop or low<=low10 (S1) / low20 (S2): exit_all
# fill: stop orders checked on 1-min path
```

## Verification pass (2026-10-30)
- CONFIRMED (book blurb): Faith reports the Turtles averaged over 80%/yr with >$100M in profits — https://books.google.com/books/about/Way_of_the_Turtle_The_Secret_Methods_tha.html?id=tatZTyKeL2AC
- CONFIRMED: complete rule text at https://www.tradingblox.com/originalturtles/originalturtlerules.htm (N sizing, 20/55-day breakouts, 2N stops, unit limits, the drawdown-reduction rule).
- Dennis's '$5k→$100M+' figure remains reported/secondary.

## Backtest spec (exact defaults, 2026-10-30)
- Daily bars (closes: 16:00 NY NAS100, 17:30 CET GER40, 17:00 NY FX/XAU/Brent, 00:00 UTC BTC). N = 20-day Wilder TR average. Unit = 1% equity / (N × point value).
- S1: stop-entry at the 20-day high/low +/−1 tick, skipped if the last S1 signal won; S2: 55-day, always taken. Add +1 unit every 0.5N, max 4. Stop 2N below the last unit. Exit S1 at the 10-day opposite extreme, S2 at 20-day. No TP. All CONFIRMED.
- Sweep: entry {20,55}; exit {10,20}; stop {2N,1N}.
