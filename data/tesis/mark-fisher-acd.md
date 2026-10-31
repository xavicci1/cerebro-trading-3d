# Mark B. Fisher — ACD opening-range method (A/C levels + pivot range)
**Verified result:** No audited personal performance record found. Fisher was a NYMEX floor trader and founder of MBF Clearing; his book *The Logical Trader* (Wiley 2002) calls the method "proven" but gives no audited P&L (self-claim). **Independent test (2026, Krueger Algorithms):** ACD-A trade, 10 markets (DAX, FTSE, CAC, Dow, NQ, SPX, gold, EURUSD, GBPUSD, USDJPY), Dukascopy 1-min 2015–2022, intraday exit: **16,460 trades, +0.37 bps gross, −1.79 bps net, t = −2.45** → no edge after ~2.2 bps costs (that test dropped the B level and Fisher's "Number Line"). Confidence: record low; rules medium-high; edge **negative in independent test**.

Sources opened 2026-10-30/31:
- Book ch.1 (Logical Trader) PDF: https://www.forexfactory.com/attachment/file/72089?d=1197410422
- Pivot range: https://www.investopedia.com/articles/technical/04/040704.asp
- Independent test: https://kruegeralgorithms.com/en/research/market-wizards-intraday-rules-tested

| Rule | Value | Status |
|---|---|---|
| Opening range (OR) | High/low of the first N minutes after the open. Stocks: 20 min. Commodities: 5–30 min depending on market | CONFIRMED (book ch.1) |
| Which open | Use the instrument's "domicile" market open (e.g. Brent → London open, yen → Tokyo open) | CONFIRMED (book ch.1) |
| A up / A down | OR high + A ticks / OR low − A ticks. A is set per market by volatility (proprietary). Examples in the book: crude A ≈ 7–8 ticks, C ≈ 11–13; natural gas A ≈ 15 ticks; unleaded A ≈ 25 ticks, C ≈ 85 | CONFIRMED (examples); the general formula is NOT published → INFERRED (use a fraction of ATR) |
| Confirmation | Price must trade at/beyond the A level for **half the OR duration** (e.g. 10 min for a 20-min OR) | CONFIRMED (book ch.1) |
| Frequency | One A per day | CONFIRMED (book ch.1) |
| Stop | "B" level = opposite side of the OR (for A up: OR low / mid region) | CONFIRMED that the stop is B; exact B placement varies by market → INFERRED = OR opposite edge |
| Reversal (C) | After A up fails and price trades through the OR to C down (opposite side) and holds half-OR → short; stop "D" ≈ 1 tick beyond the opposite OR edge | CONFIRMED (book ch.1) |
| Time stop | If the trade isn't working within one OR length, exit | CONFIRMED (book ch.1) |
| Failed-A fade ("rubber band") | A level touched but not held → fade with stop at A | CONFIRMED (book ch.1) |
| Pivot range | pivot=(H+L+C)/3 of prior day; second=(H+L)/2; diff=|pivot−second|; range = pivot±diff. OR < pivot range < close = bullish bias | CONFIRMED (Investopedia summary of Fisher) |
| News days | OR shifted to 08:30 ET on NFP, 14:15 ET on FOMC days | CONFIRMED-secondary (clever-trading-strategies primer); not re-opened this batch |
| OR = day extreme | "about 20% of the time" in volatile markets | CONFIRMED as self-claim only |
| Edge | Fisher himself frames ACD as mainly a risk framework | CONFIRMED-secondary (Elite Trader thread excerpt in search synthesis; not opened) → INFERRED |

**Fit:** GER40 (Frankfurt cash open 09:00 CET), NAS100 (09:30 ET), Brent (London 09:00 UK), USDJPY (Tokyo 09:00 JST), XAUUSD (London 08:00 UK or COMEX 08:20 ET), BTC (no natural open → 00:00 UTC, weak). Independent test says net edge ≈ 0/negative on CFD data, so treat as a **baseline/control** strategy, not an expected winner.

## Backtest spec (exact defaults, 2026-10-31)
- Data: 1-min bars, 2020-01-01 → 2026-09-30. Costs: per-market spread+slippage (e.g. NAS100 2.5 pts, GER40 2.5 pts, XAUUSD 0.35 USD, USDJPY 1.2 pips, Brent 0.05, BTC 0.05%).
- Session/OR start: GER40 09:00 Europe/Berlin; NAS100 09:30 America/New_York; Brent 09:00 Europe/London; USDJPY 09:00 Asia/Tokyo; XAUUSD 08:20 America/New_York; BTC 00:00 UTC.
- OR length = 20 min (default). A = 0.10 × ATR(14, daily) beyond OR edge (INFERRED proxy for the proprietary table). C = 0.15 × ATR(14, daily).
- Entry long: price ≥ OR_high + A and every 1-min close for the next OR/2 = 10 min stays ≥ OR_high + A → buy at the close of the 10th minute. Short mirror.
- Stop: OR opposite edge (B). Time stop: exit if unrealised P&L ≤ 0 after 20 min (one OR length). Otherwise exit at session end (GER40 17:30 Berlin, NAS100 16:00 NY, Brent 17:00 London, USDJPY 15:00 Tokyo, XAUUSD 13:30 NY, BTC 23:59 UTC).
- C reversal: if A-long stopped and price reaches OR_low − C and holds 10 min → short, stop OR_high + 1 tick, same exits. Max 1 A + 1 C per day.
- Optional filter (test separately): long only if OR is above the prior-day pivot range, short only if below.
- Sweep: OR {5,10,15,20,30} min; A {0.05,0.10,0.15,0.20}×ATR; hold-confirm {0, 0.5, 1.0}×OR; pivot filter {on,off}; time stop {off, 1×OR, 2×OR}.

### Pseudocode
```python
for day in days:
    orh, orl = high/low of bars[open : open+OR]
    A = 0.10*atr14_daily; C = 0.15*atr14_daily
    a_up, a_dn = orh + A, orl - A
    # long
    t = first bar after OR with high >= a_up
    if t and all(close[t:t+OR//2] >= a_up) and (not pivot_filter or orl > pivot_range_hi):
        enter_long(close[t+OR//2]); stop = orl
        time_stop(OR); exit_at(session_end)
    # C reversal after failed A
    if long_stopped and price <= orl - C held OR//2:
        enter_short(); stop = orh + tick
```

## Labels
style=intraday; timeframe=1m/OR 20m; confidence=low (record) / medium (rules); independent OOS: NEGATIVE (−1.79 bps net/trade).
