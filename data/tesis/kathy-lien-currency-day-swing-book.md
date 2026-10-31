# Kathy Lien — *Day Trading and Swing Trading the Currency Market* (3rd ed.): Double Zeros, Waiting for the Deal, Inside Days, Fader, 20-Day Breakout, Perfect Order

**Book:** Kathy Lien, *Day Trading and Swing Trading the Currency Market: Technical and Fundamental Strategies to Profit from Market Moves*, 3rd edition, Wiley, 2015, ISBN 978-1-119-22009-1. Wiley Online Library: https://onlinelibrary.wiley.com/doi/book/10.1002/9781119212997.
- Chapter page ranges from the Wiley back-of-book index PDF (opened: https://catalogimages.wiley.com/images/db/pdf/9781119108412.index.pdf). That PDF is under ISBN 9781119108412, so it may be the e-book or a related edition (INFERRED same text).
  - Double zeros 111–116
  - Waiting for the deal 117–121
  - Inside days breakout 123–127
  - Fader 129–133
  - 20-day breakout 135–138
  - Channels 139–142
  - Perfect order 143–148
  - ADX 76, 81, 83, 143–144
  - Double Bollinger Bands 101, 103–110
- Rules text sources:
  - (1) Lien's own article "High Probability Breakout Strategy for Currency Trading", TradingMarkets, Feb 5 2008 (opened): https://tradingmarkets.com/recent/high_probability_breakout_strategy_for_currency_trading-676976 — Inside Days, verbatim rules.
  - (2) Bookey summary PDF (secondary, legally distributed summary; opened): https://cdn.bookey.app/files/pdf/book/en/day-trading-and-swing-trading-the-currency-market.pdf
  - (3) MacroFXTrader re-statement of Double Zeros (secondary, opened): https://macrofxtrader.com/double-zeros/
  - I did NOT see the book's own pages for any rule except via these sources.

**Verified result:** **UNVERIFIED** author record.
- Lien is a well-known strategist (DailyFX chief strategist per the 2008 article bio; co-founder of BK Forex Advisors / BK Asset Management with Boris Schlossberg).
- LeapRate (May 4 2012, opened: https://www.leaprate.com/news/kathy-lien-and-boris-schlossberg-start-managing-funds/) reported they would begin managing funds after regulatory approval. I found no audited track record, no CTA monthly series, no competition result and no Myfxbook.
- Treat these rules as published heuristics without proof.
- No examples in the book should be read as statistics: they are hand-picked trades.

## Rules
| Strategy | Rule | Status |
|---|---|---|
| Inside Days (daily) | ≥ 2 consecutive inside days; buy above the high of the most recent inside day (sell below its low) | CONFIRMED (Lien 2008 article) |
| Inside Days | Stop-and-reverse ≥ 10 pips below the nearest inside-day low; if price moves +risk, sell half, trail the rest; Lien's example trails by a 2-bar low | CONFIRMED (Lien 2008) |
| Inside Days entry offset | Bookey: "Buy 10 pips above the high of the last inside day"; take profit at 2× risk or trail | **CONFLICT** with the 2008 article (no offset, 1R half-exit); edition difference INFERRED |
| Double Zeros (15-min) | Long: price below the intraday 20-SMA, falling toward a 00 level; buy 10–15 pips above the 00 level, stop 20 pips below it; at +risk close half, move to breakeven, trail. Short = mirror | CONFIRMED-secondary (Bookey); MacroFXTrader uses 12 pips/20 pips/+32 pips — consistent |
| Waiting for the Deal (GBPUSD) | From ~1 AM NY, after the Frankfurt/London open range forms, wait for a false break ≥ 25 pips beyond the range then reversal; enter 10 pips beyond the opposite extreme; stop ≤ 25 pips; half off at +risk(?), target 3× risk | UNVERIFIED-secondary (Bookey text is garbled: "If the position drops by 50 pips, close half"; numbers need the book page) |
| Fader (daily) | 14-day ADX < 20 and falling; price breaks prior day's low by ≥ 15 pips; buy stop a few pips above the prior day's high; stop ≤ 20 pips; half at +risk, breakeven, trail. Short = mirror | CONFIRMED-secondary (Bookey) |
| 20-Day Breakout (daily) | New 20-day high; then a 2-day low within the next 1–2 days; buy if price re-exceeds the 20-day high within 3 days of that low; stop a few pips below the 2-day low; half at +risk, breakeven, trail | CONFIRMED-secondary (Bookey) |
| Perfect Order (daily) | SMA10 > SMA20 > SMA50 > SMA100 > SMA200 (reverse for shorts); ADX rising, preferably > 20; enter 5 candles after the order forms; stop at the low of the day of the first crossover; exit when the order breaks | CONFIRMED-secondary (Bookey) |
| Edge | No statistics in the sources | UNVERIFIED |

## Backtest spec (exact defaults, 2026-10-31)
- Markets: EURUSD, GBPUSD, USDJPY, AUDUSD, USDCAD, EURGBP, EURJPY, plus XAUUSD/NAS100/GER40/Brent/BTC as non-FX controls. For non-FX controls, scale every pip distance by volatility: dist_m = (pips / ATR20_EURUSD in pips) × ATR20_m (INFERRED).
- Data: 1-min bid/ask 2020-01-01 → 2026-09-30. Daily bars close at 17:00 America/New_York.
- Costs (INFERRED retail ECN): EURUSD 0.2 pip, GBPUSD 0.5, USDJPY 0.3, AUDUSD 0.4, USDCAD 0.5, EURGBP 0.6, EURJPY 0.8 plus $7/lot round-turn. Double Zeros/Waiting-for-Deal on 15-min bars: add 0.3-pip slippage on stop entries.
- Test 1 — Inside Days (primary, rules CONFIRMED):
  - Setup: ≥ 2 inside days.
  - Entry: buy stop at the last inside-day high + 0 pips (sweep {0, 10}); sell stop at the low − same.
  - Stop and reverse at the nearest inside-day opposite extreme ± 10 pips.
  - Exit: half at +1R; remainder breakeven then 2-bar-low trail (sweep {1, 2, 3, 5}).
  - Max one reversal per setup.
- Test 2 — Fader: ADX14 < 20 and ADX[t] < ADX[t−1]; prior-day-low break ≥ 15 pips; buy stop prior-day high + 2 pips; stop 20 pips; half at +1R, breakeven, 2-bar trail. Order valid 1 day.
- Test 3 — 20-Day Breakout: per the rules above; stop = 2-day low − 3 pips; order valid 3 days.
- Test 4 — Double Zeros (15-min, London+NY 02:00–17:00 ET only):
  - Long only if close < SMA20(15m) and price approaches a 00 level from above.
  - Entry limit at 00 + 12 pips (sweep {10, 12, 15}); stop 00 − 20 pips.
  - Half at +1R, breakeven, trail 3-bar low. Cancel at 17:00 ET.
- Test 5 — Perfect Order: as above; stop = first-crossover-day low; exit on order break; check daily.
- Sweep grid (global): ADX threshold {15, 20, 25}; trail bars {1, 2, 3, 5}; partial {50%, 0%}.
- Report win rate vs the breakeven win rate. With a fixed 1R half-exit plus breakeven and trail, compute the realized avg R; breakeven p = 1/(1 + avgWin/avgLoss).

### Pseudocode
```python
# Inside Days (daily, 17:00 NY closes)
for t in days:
    if inside(t) and inside(t-1):
        hi, lo = H[t], L[t]
        place_stop_buy(hi + off*pip); place_stop_sell(lo - off*pip)   # OCO
    on_fill(long):  stop_and_reverse = lo - 10*pip
                    risk = entry - stop_and_reverse
                    at entry + risk: close 50%, stop -> entry, trail = min(L[-2:]) 
    on_fill(short): mirror
# Fader
if adx14[t] < 20 and adx14[t] < adx14[t-1] and L_intraday(t+1) < L[t] - 15*pip:
    place_stop_buy(H[t] + 2*pip, valid=1day, stop=20*pip)
```

## Labels
style=day trading + swing (multi-strategy book); confidence=low (author record UNVERIFIED; rules partly secondary); instruments=FX majors/crosses; timeframe=15m/daily; best_backtest_markets=EURUSD;GBPUSD;USDJPY;AUDUSD;EURGBP
