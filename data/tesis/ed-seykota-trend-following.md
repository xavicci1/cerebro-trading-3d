# Ed Seykota – Exponential MA trend following

**Verified result:** CONFIRMED: a 'model account' started with $5,000 in 1972 and passed $15M over **16 years** (>250,000%) — S&C interview https://www.meta-formula.com/support-files/ed-seykota-of-technical-tools.pdf ; https://www.businessinsider.com/stock-trading-legend-ed-seykota-shares-strategy-advice-market-wizards-2020-10 . (Corrected from '~12 years'.) Rules only partially public. Style: position.

Legend: CONFIRMED = stated in primary/well-documented source (cited); INFERRED = my reasoning to make it mechanical; CONFLICT = sources disagree.

## Rules
| Item | Rule | Status |
|---|---|---|
| Philosophy | Follow the trend, cut losses, ride winners, risk small fraction | CONFIRMED – Market Wizards interview |
| Model | Exponential moving average crossovers; his published teaching example 'EMA system' uses 15/150-day EMA cross with ATR stop | CONFIRMED – Seykota "TTP Trend Trading Project" pages https://www.seykota.com/tribe/TSP/EA/index.htm |
| Entry | Long when fast EMA > slow EMA (and breakout variant) | CONFIRMED (TSP example) |
| Stop | ATR-based protective stop (example: entry ± ~5–7 ATR? exact multiple in TSP pages) | CONFLICT/INFERRED – exact multiplier varies across TSP examples; verify on site |
| Sizing | Risk ~1% equity per trade ("heat") | CONFIRMED – Seykota TSP pages |
| His real-world system | Proprietary, never published | CONFIRMED (Market Wizards) → replicas are proxies only |


## Backtest adaptation (XAUUSD, NAS100, GER40, USDJPY, Brent, BTC; 1-min/tick 2020–2026)
- Resample 1-min to daily bars using each market's session close (FX/metals/Brent: 17:00 New York; NAS100: 16:00 NY cash close or 17:00 CFD roll; GER40: 17:30 Frankfurt; BTC: 00:00 UTC). Weekly = Friday close (BTC: Sunday 00:00 UTC). INFERRED: consistent session boundaries are required so N-day highs/ATR match published daily-bar rules.
- Use the 1-min data only for intrabar fill sequencing (stop vs. target hit order) and realistic slippage; signals are on daily/weekly closes unless stated.
- Costs: spread + commission per market (e.g. XAU 0.2–0.3$, NAS100 1–2 pts, GER40 1–2 pts, USDJPY 0.5–1 pip, Brent 0.03$, BTC 0.05–0.1%) plus overnight financing for CFDs. Position sizing in risk-% of equity, contract value normalized by point value.
- Warm-up: need ≥ longest lookback (e.g. 200d / 30w) before 2020 → start trades 2020-10 or load 2019 data.
- Validation: walk-forward 2020–2023 in-sample / 2024–2026 OOS; no parameter optimization beyond the published values first (faithful replica), then robustness sweep ±20%.

### Market fit
Best: Brent, XAUUSD, USDJPY, BTC. Equity indices OK long-biased. Proxy only.

## Pseudocode
```python
f=ema(c,15); s=ema(c,150); atr=atr(20)
if f>s and not long: buy; stop=c-k*atr   # k INFERRED 3..5
if f<s and not short: sell; stop=c+k*atr
trail stop by k*atr; reverse on cross
size=0.01*eq/(k*atr*pv)
```

## Verification pass (2026-10-30)
- FIXED: the period is 16 years (1972 start), not ~12.
- CONFIRMED: Seykota's FAQ says the original system 'expects 50% draw downs' — https://www.seykota.com/tt/Aggregation/Seykota_FAQ-1.html . Expect very deep drawdowns in any replication.
- CONTEXT for the EMA crossover: Seykota's TSP EMA page (https://seykota.com/tribe/TSP/EA/index.htm) is an *educational* long-only S&P system with ATR position sizing and 50% 'skid' assumptions. Example lag settings include 150/15 and 325/85. Treat 15/150 as one published example, not 'the' Seykota system.
- DOWNGRADED to INFERRED: any '~1% heat' position-sizing figure (no primary source found).

## Backtest spec (exact defaults, 2026-10-30)
- Daily closes: NAS100 16:00 NY, GER40 17:30 CET, XAUUSD/USDJPY/Brent 17:00 NY, BTC 00:00 UTC.
- Seykota TSP EMA example: long when EMA15 > EMA150, short when below (CONFIRMED form). ATR stop 5×ATR20 from entry (INFERRED-DEFAULT; exact multiple CONFLICT). Exit on the opposite cross or the stop. No TP. Heat 1% per position (CONFIRMED).
- Sweep: fast {15,25}; slow {100,150,200}; stop {3,5,7}×ATR.
