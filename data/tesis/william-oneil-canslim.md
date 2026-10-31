# William O'Neil – CANSLIM / cup-with-handle

**Verified result:** INFERRED/unverified: the '~2000% on 1962–63 trades' figure (no primary source found this pass). CONFIRMED: the AAII original CAN SLIM screen averaged 24.4%/yr from 1998 to Feb 2013, but often had ≤3 passing stocks (https://www.aaii.com/journal/article/a-can-slim-screen-with-no-float-but-plenty-of-lift). The revised 3rd-edition screen: 10-yr 8.0%, 20-yr 10.2% annualized as of 4/30/2025 (https://www.aaii.com/stocks/screens/78). Style: position/swing.

Legend: CONFIRMED = stated in primary/well-documented source (cited); INFERRED = my reasoning to make it mechanical; CONFLICT = sources disagree.

## Rules
| Item | Rule | Status |
|---|---|---|
| C/A | Current qtr EPS +25%+ YoY; annual EPS growth 25%+ 3 yrs | CONFIRMED – *How to Make Money in Stocks* (O'Neil) |
| N/S/L/I | New product/high; supply/demand (volume); Leader RS ≥80; Institutional sponsorship | CONFIRMED |
| M | Market in confirmed uptrend (follow-through day: index up ≥1.25–1.7% on higher volume day 4+ of rally attempt) | CONFIRMED (IBD) – exact % threshold varies over years → CONFLICT (1%, 1.25%, 1.7% cited) |
| Base | Cup-with-handle 7–65 weeks, depth 12–33%, handle ≥1 week in upper half, drifting down on low volume | CONFIRMED |
| Entry | Buy at pivot (handle high + 0.10) on volume ≥40–50% above average; don't buy >5% above pivot | CONFIRMED |
| Stop | Sell at 7–8% below purchase price, no exceptions | CONFIRMED |
| TP | Take most profits at 20–25% gain, except hold 8 weeks if +20% within 3 weeks | CONFIRMED |
| Distribution days | 5–6 distribution days in 4–5 weeks = market top → reduce exposure | CONFIRMED (IBD) |


## Backtest adaptation (XAUUSD, NAS100, GER40, USDJPY, Brent, BTC; 1-min/tick 2020–2026)
- Resample 1-min to daily bars using each market's session close (FX/metals/Brent: 17:00 New York; NAS100: 16:00 NY cash close or 17:00 CFD roll; GER40: 17:30 Frankfurt; BTC: 00:00 UTC). Weekly = Friday close (BTC: Sunday 00:00 UTC). INFERRED: consistent session boundaries are required so N-day highs/ATR match published daily-bar rules.
- Use the 1-min data only for intrabar fill sequencing (stop vs. target hit order) and realistic slippage; signals are on daily/weekly closes unless stated.
- Costs: spread + commission per market (e.g. XAU 0.2–0.3$, NAS100 1–2 pts, GER40 1–2 pts, USDJPY 0.5–1 pip, Brent 0.03$, BTC 0.05–0.1%) plus overnight financing for CFDs. Position sizing in risk-% of equity, contract value normalized by point value.
- Warm-up: need ≥ longest lookback (e.g. 200d / 30w) before 2020 → start trades 2020-10 or load 2019 data.
- Validation: walk-forward 2020–2023 in-sample / 2024–2026 OOS; no parameter optimization beyond the published values first (faithful replica), then robustness sweep ±20%.

### Market fit
Native to stocks. On NAS100 index use M-rule + base breakout only (fundamentals N/A). BTC/XAU: technical subset (cup+handle+7–8% stop+20–25% TP) – INFERRED adaptation, low fidelity.

## Pseudocode
```python
M = index_uptrend_ftd()  # follow-through day logic
base = detect_cup_handle(weekly, depth 0.12..0.33, len 7..65w)
if M and base and high>pivot and vol>1.4*vol50 and c<=pivot*1.05:
    buy; stop=entry*0.92
    if gain>=0.20 and days_since_entry<=15: hold_until(days=40)
    elif gain>=0.20: sell
    if low<=stop: sell
```

## Verification pass (2026-10-30)
- CONFIRMED (AAII): cut losses at 7–8%; take many profits at 20–25%. Exception: hold 8 weeks if a stock gains 20% within 1–3 weeks of a breakout in a bull market — https://www.aaii.com/journal/article/when-to-sell-and-nail-down-your-profits-while-you-still-have-them
- DOWNGRADED: the 1962–63 return claim. ADDED: the AAII live-screen performance has decayed sharply (24.4% → ~8–10%). Expect weaker out-of-sample results 2020–2026.

## Backtest spec (exact defaults, 2026-10-30)
- Daily closes: NAS100 16:00 NY, GER40 17:30 CET, XAUUSD/USDJPY/Brent 17:00 NY, BTC 00:00 UTC. Price-only proxy (no fundamentals): cup-with-handle = 35–325-bar base, depth 12–33%, handle ≥ 5 bars in the upper half. Entry: buy stop at the handle high +0.1%, only on breakout tick volume ≥ 1.5× avg50 (CONFIRMED 40–50%); skip if > 5% above the pivot. Stop 7% (CONFIRMED 7–8%). TP 20% (CONFIRMED 20–25%), unless +20% within 15 bars → hold 40 bars. M filter: NAS100 > SMA50. Sweep: TP {20,25}%.
