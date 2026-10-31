# Oliver Kell: *Victory in Stock Trading* (book) and the Cycle of Price Action (2020 US Investing Championship winner, +941.1%)

**Sources (all opened 2026-10-31):**
- Business Wire, "U.S. Investing Championship 2020 Final Standings" (25 Jan 2021): https://www.businesswire.com/news/home/20210125005140/en/U.S.-Investing-Championship-2020-Final-Standings
- Book page, kelltrading.com (table of contents / "what you'll learn"; the book text itself was NOT opened): https://kelltrading.com/the-book/
- TraderLion, "Cycle of Price Action" (author field: Oliver Kell; 10 Sep 2024): https://traderlion.com/technical-analysis/chart-patterns/cycle-of-price-action-by-oliver-kell/
- Kell's own TraderLion Masterclass slides, Session 3 (Nov 2021, PDF): https://traderlion.com/wp-content/uploads/sites/2/2021/11/Oliver-Masterclass-Slides-Session-3-FINAL-Pres-11-13.pdf

**Verified result:** VERIFIED contest record, single year.
- USIC 2020, stock division under USD 1M: **+941.1%**, 1st of 124 participants overall. Second place was +497% (Tomas Claro).
- The USIC is "a real money verified competition"; "brokerage statements associated with that account are used to verify performance claims" (Business Wire).
- Caveats:
  - One year only (2020 growth-stock bull market).
  - No multi-year audited track record found.
  - The organiser notes 13 of the top stock performers were Minervini clients or students.
- **Book-text status:** I did not open the book. No page numbers are cited. "Book-stated" below means listed on the official book page. Rule details come from Kell's own slides and his TraderLion article (author-stated, not the book).

## Rules / findings
| Rule/finding | Detail | Status |
|---|---|---|
| Framework | "Cycle of Price Action": Reversal Extension → Wedge Pop → EMA Crossback → Base n' Break → Exhaustion Extension → Wedge Drop → EMA Crossback (down) → Base n' Break (down) | CONFIRMED (book page lists "The Cycle of Price Action"; phases from the TraderLion article) |
| Book contents | Cycle phases; watchlist; "position sizing, risk management, and when to press your edge"; psychology; annotated championship-year charts; CAN SLIM / Livermore / Darvas / Wyckoff influences | CONFIRMED (book page; contents only) |
| Moving averages | 10- and 20-day EMA for the intermediate trend; 50- and 200-day SMA for the long trend | CONFIRMED (TraderLion article) |
| Time frames | "WEEKLY is the Anchor", "DAILY is for Management", "Intra-Day is for Initial Risk Management", "DO NOT GET CAUGHT LOOKING FOR OPPORTUNITIES ON THE 5 MINUTE CHART". Article: hourly and 15-min only for timing entries | CONFIRMED (slides + article) |
| Wedge Pop | After a reversal extension, price tightens with the MAs, then breaks above short-term resistance and reclaims the MAs. Entry on that break, with defined risk | CONFIRMED (article; qualitative) |
| EMA Crossback | Pullback into the 10/20 EMA; wait for supportive buying, then add | CONFIRMED (article; qualitative) |
| Base n' Break | Tight sideways base of about 2 weeks while the MAs catch up; trail stops under higher lows | CONFIRMED (article; qualitative) |
| Exhaustion Extension | Price far above the MAs on both higher and lower timeframes, then reverses. Take profits faster late in the cycle | CONFIRMED (article; qualitative) |
| Wedge Drop | Tight trade into the MAs, then a break through them on selling: the cycle has ended | CONFIRMED (article) |
| Buying in pieces (worked example) | Initial buy at 36 on a reversal into the 20 EMA (35) with a USD 1 stop: 10% position, about 3% stop, risk 30 bps. Add 10% on the bull-flag breakout at 38.50. New stop = flag-breakout-day low 37.75. "Smaller losses and big winners" | CONFIRMED (slides) |
| Outside reversal | Strong trend, then a 2–5 day pullback; price trades below the previous day's low and back up through it; often at the 10/20 EMA | CONFIRMED (slides) |
| Inside bar / volume dry-up | Inside bar with "extreme volume dry up"; trade the break of the inside bar's high/low | CONFIRMED (slides) |
| Bull flag | Lower highs and lower lows; volatility contraction; best on light volume | CONFIRMED (slides) |
| Buying checklist | 10 items, e.g. monthly/weekly consolidation; position vs the 10-week EMA; relative strength; catalyst; resistance to the left | CONFIRMED (slides) |
| Numeric thresholds (ATR multiples, base length in bars, "far above" = k·ATR) | Not stated in the opened sources | INFERRED (my quantification) |
| Index/CFD transfer (NAS100, GER40, XAUUSD) | Kell trades growth stocks (RS leaders); applying the cycle to indices is my adaptation | INFERRED |

## 1:20 R:R check
- **Not claimed by Kell.** The opened sources give no R:R target.
- His worked example risks about 3% per entry. Winners in his champion year were multi-week trends, so a 10R+ outcome per winner is plausible for stocks, but that is UNVERIFIED (no trade list).
- **Break-even at 1:20:** 1/(1+20) = 4.76%. With NAS100 costs of 2.5 pts on a 100-pt daily stop, the effective R is (2000−2.5)/(100+2.5), so p* = 102.5/2100 = 4.88%.

## Backtest spec (exact defaults, 2026-10-31)
- **Purpose:** test a mechanical "EMA Crossback after Wedge Pop" (trend-continuation pullback) on indices and gold.
- **Data:** NAS100, GER40, XAUUSD, BTC (daily bars built from 1-min data), 2020-01-01 → 2026-10-30. Weekly bars for the anchor. Daily close = 16:00 America/New_York for NAS100 and XAUUSD, 17:30 Europe/Berlin for GER40, 00:00 UTC for BTC.
- **Trend filter (weekly anchor):** weekly close > 10-week EMA, and daily close > SMA50 > SMA200.
- **Wedge Pop state (setup armed):** within the last 15 days, the close crossed from below to above both the 10 and 20 EMA after ≥ 5 closes below the 20 EMA.
- **EMA Crossback entry:**
  - daily low ≤ 20 EMA × 1.002 and close ≥ 20 EMA (touch-and-hold);
  - next day, buy stop at that bar's high + 0.1 × ATR14.
  - Variant: an inside bar on below 20-day-median tick volume, then buy stop above the inside-bar high.
- **Stop:** min(signal-bar low, 20 EMA) − 0.1 × ATR14. Risk 0.5% of equity per entry.
- **Pyramid add (once):** on a close above the 10-day high, add 1×. Move the stop on the whole position to that breakout-day low.
- **Exit:**
  - (a) daily close below the 20 EMA (Wedge Drop proxy); or
  - (b) Exhaustion Extension: close > 10 EMA + 3.0 × ATR14 → sell half; trail the rest under the 10 EMA close.
  - No fixed TP.
- **Costs:** NAS100 2.5 pts, GER40 2.5 pts, XAUUSD 0.40 USD, BTC 0.05%, plus overnight financing. Stress ×1.5 and ×2.
- **Sweep grid:**
  - EMA pair {(10,20), (8,21), (5,10)};
  - touch tolerance {0.0, 0.2, 0.5}%;
  - exhaustion k {2.0, 2.5, 3.0, 4.0} ATR;
  - exit MA {10, 20} EMA;
  - pyramid {off, on};
  - weekly filter {on, off};
  - inside-bar variant {off, on}.
- **Controls:** buy-and-hold over the same exposure days; random-entry trades with the same stop/exit rules; yearly table (2022 bear market is key).

### Pseudocode
```python
for t in daily_bars:
    if not (wk_close[t] > ema10w[t] and close[t] > sma50[t] > sma200[t]): continue
    armed = wedge_pop_within(t, lookback=15, below_min=5)
    if armed and low[t] <= ema20[t]*1.002 and close[t] >= ema20[t]:
        place_buy_stop(t+1, price=high[t]+0.1*atr14[t], stop=min(low[t], ema20[t])-0.1*atr14[t], risk=0.005)
    for pos in open_positions:
        if not pos.added and close[t] > max(high[t-10:t]): pos.add(1.0); pos.stop = low[t]
        if close[t] > ema10[t] + k*atr14[t] and not pos.half_sold: pos.sell(0.5)
        if close[t] < ema20[t]: pos.close_next_open()
```

## Labels
style=swing (daily, multi-week holds); confidence=medium (contest-verified 1-year record; rules qualitative, quantification INFERRED); instruments=US growth stocks (original); NAS100/GER40/XAUUSD/BTC (adaptation); timeframe=weekly anchor, daily management, 60m/15m timing; best_backtest_markets=NAS100;GER40;XAUUSD;BTC
