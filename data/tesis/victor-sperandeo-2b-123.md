# Victor Sperandeo ("Trader Vic") — 1-2-3 trend change and 2B false breakout
**Verified result:** Not audited. Two self-reported figures that don't match each other (**CONFLICT**, different periods): (a) "nominal 70.7% a year with no losing year 1978–1989" (Money Tree Investing podcast bio); (b) per a summary of Schwager's *The New Market Wizards* (chapter interview, April 1991), "18 winning years before a loss in 1990, average annual gain 72%". Neither is broker-audited. **Independent test (2026, Krueger Algorithms, 10 markets, 1-min 2015–2022, intraday exit, ~2.2 bps costs):** 2B at prior-day extreme 12,955 trades, +2.07 bps gross / **−0.13 bps net** (t −0.16); 2B at M15 swings 16,584 trades, −0.41 gross / **−2.59 net** (t −4.22); 1-2-3 on H1 (no trendline) 6,060 trades, +1.41 gross / **−0.76 net** (t −0.70). 2B at the prior-day extreme vs. a random level at the same distance: difference +1.36 bps, t 1.57 (not significant). Confidence: record low; rules high; edge after costs **none intraday** (multi-day version untested).

Sources opened:
- https://moneytreepodcast.com/victor-sperandeo-legendary-futures-and-options-trader-and-market-wizard/
- https://the7circles.uk/victor-sperandeo-markets-grow-old-too/ (New Market Wizards chapter summary with quotes)
- https://www.chrisperruna.com/2010/05/17/trader-vic-1-2-3-trend-reversal-pattern/
- https://www.forex-goodies.com/how-to-trade-with-the-trend/
- https://thepatternsite.com/2B.html (Bulkowski) ; Wiley chapter https://onlinelibrary.wiley.com/doi/10.1002/9781119196792.ch4
- https://kruegeralgorithms.com/en/research/market-wizards-intraday-rules-tested

| Rule | Value | Status |
|---|---|---|
| 1-2-3 step 1 | Trendline broken. Uptrend line drawn from the lowest low to the highest low just before the highest high, with no prices between the two points crossing it | CONFIRMED (New Market Wizards quote via 7circles; chrisperruna) |
| 1-2-3 step 2 | Failed test of the extreme: no new high, or a small poke above then a pullback below it | CONFIRMED (same) |
| 1-2-3 step 3 | Price breaks the most recent relative low (top) or high (bottom) → trend change confirmed | CONFIRMED (same) |
| Any 2 of 3 | Any two conditions make a reversal "probable"; all three define it | CONFIRMED-secondary (chrisperruna / forex-goodies) |
| 2B top | Price makes a new high, fails to follow through, and falls back below the previous high → sell | CONFIRMED (thepatternsite quote; Wiley ch.) |
| 2B horizon | Minor 2B: failure within ~1 day; intermediate: 3–5 days; major: 7–10 days | CONFIRMED (thepatternsite) |
| 2B stop | Just beyond the failed extreme (new high) | CONFIRMED (thepatternsite / Wiley) |
| Why it works | Stops cluster at prior highs/lows; locals push price to trigger them and then reverse if fundamentals don't back the move | CONFIRMED (NMW quote via 7circles) |
| Risk | Losses predetermined before entry; size cut during losing streaks; flat before big legislative uncertainty | CONFIRMED (NMW quotes via 7circles) |
| Intraday 2B hit rate | ≈50% | CONFIRMED-secondary (mastertradertrading note seen last session; not re-opened) → INFERRED |
| Targets | Not specified by Sperandeo for 2B | INFERRED (use R-multiple or opposite swing) |

**Fit:** Swing/daily version is the original and is untested by the independent study → best candidate: XAUUSD, NAS100, GER40, Brent, USDJPY daily/H4. Intraday 2B on 1-min/M15 is **net-negative** in the independent test; run only as a control.

## Backtest spec (exact defaults, 2026-10-31)
- Data: 1-min bars 2020–2026 resampled to H1 and D1. Costs: per-market spread+slippage as in mark-fisher-acd.md.
- **2B daily (primary):** swing high = highest high of the last 20 daily bars (excluding today). Signal: today's high > swing high, and today's close < swing high (failure within 1 day = "minor 2B"). Enter short at the next session open (GER40 09:00 Berlin, NAS100 09:30 NY, XAUUSD/USDJPY/Brent/BTC 00:00 UTC daily bar). Stop = today's high + 0.1×ATR(14). Target = 2R; time stop 10 trading days. Long mirror on a 20-day swing low.
- **1-2-3 on H1:** pivot swings with 5-bar fractals; trendline from lowest swing low to the last higher swing low before the top; signal when (1) H1 close below trendline, (2) the following swing high < top (or pokes ≤0.2×ATR above it and closes back below), (3) H1 close < last swing low → short at next bar open; stop = step-2 swing high + 1 tick; target 2R; time stop 48 H1 bars.
- Sweep: swing lookback {10,20,55} days; failure window {1,3,5} days; stop buffer {0,0.1,0.25}×ATR; target {1,2,3}R; time stop {5,10,20} days; fractal width {3,5,7}.

### Pseudocode
```python
# 2B daily short
sh = max(high[t-20:t])
if high[t] > sh and close[t] < sh:
    entry = open[t+1]; stop = high[t] + 0.1*atr14[t]
    target = entry - 2*(stop-entry); exit on stop/target/10 bars
# 1-2-3 H1 short
if close_h1 < trendline and lower_high_after_top and close_h1 < last_swing_low:
    short(open_next); stop = lower_high + tick; target 2R; max 48 bars
```

## Labels
style=swing (daily 2B) / intraday control; confidence=low (record); independent intraday OOS: NEGATIVE/flat after costs.
