# Patrick Nill — FX counter-trend range trading (impulse → range, weekly value-area edges)

**Verified result:** CONFIRMED on the official WCTC standings (historical page https://www.worldcupchampionships.com/world-cup-trading-championship-historical-standings and current page https://www.worldcupchampionships.com/world-cup-trading-championship-standings, both opened 2026-10-31).
- **World Cup Championship of Forex Trading:**
  - 2021: 2nd, +229.2%
  - 2022: 2nd, +245.7%
  - 2023: 2nd, +81.5%
  - 2024: 4th, +112.9%
  - 2025: 2nd, +202.1%
  - 2026: 1st, +305.1% (in progress, Jan 1–Oct 29 2026)
- **Global Cup of Forex:**
  - 2021-22: 1st, +94.5%
  - 2022-23: 1st, +219.1%
  - 2023-24: 2nd, +72.2%
  - 2024-25: 3rd, +97.8%
  - 2025-26: 3rd, +100.5% (Final)
  - 2026-27: 1st, +43.9% (in progress, Jun 1–Oct 29 2026)

This is the most consistent FX contest record in the library. Confidence: high (record), low (rules: only secondary or AI-summarised descriptions were opened; I did not watch the source video myself).

Sources opened:
- https://youtubesummary.com/summary/2ZmIn274eds (AI summary of the video "Best Trader in the World Reveals His Exact Strategy LIVE on Charts!")
- https://www.forex.in.rs/german-trader-mentorship/ (generic, looks AI-synthesised)
- https://finanzmarktwelt.de/trading-weltmeister-369810/ (R. Born, 7 Nov 2025; video embed only, no rules in the text)

## Rules
| Rule | Detail | Status |
|---|---|---|
| Philosophy | Counter-trader; markets alternate impulse → range ("PBD" model); trade ping-pong inside the range, or continuation after the range | UNVERIFIED (secondary AI summary) |
| Levels | Weekly market-profile value area high/low (VAH/VAL) as zones | UNVERIFIED (secondary) |
| Execution | 15-min chart; footprint / order flow optional | UNVERIFIED (secondary) |
| Holding | 4 hours to 3 days | UNVERIFIED (secondary) |
| Risk | ≤ 1% per trade personally (~0.2% at times); 2–3% in competitions | UNVERIFIED (secondary) |
| Stats | ~50–60% win rate; losing streaks of 10–20 possible; target DD < 10%, > 20% unacceptable; out of the market around big news | UNVERIFIED (secondary) |
| 1:20 R:R | Not his style (50–60% win, swing holds) | INFERRED from the above |

## Backtest spec (exact defaults, 2026-10-31)
- Markets: EURUSD, GBPUSD, USDJPY, EURJPY, XAUUSD, GER40. Data: 1-min 2020-01-01→2026-09-30 resampled to 15-min. Tick volume is the volume proxy for the volume profile.
- Weekly value area (previous Mon 00:00 → Fri 17:00 New York): build a tick-volume profile over price bins of 0.1×ATR14(D1). POC = max bin; VA = 70% of the volume around the POC → VAH/VAL.
- Range regime filter: the previous week's range ≤ 1.5× its 10-week median weekly range, or the current price is inside the previous VA (INFERRED).
- Entry (fade): short when a 15-min bar trades above VAH and then closes back below VAH; long mirror at VAL. Active 02:00–12:00 New York only (London + NY morning); no entries within 30 min of high-impact news.
- Stop: 0.3×ATR14(D1) beyond the bar extreme. TP1 = POC (close 50%); TP2 = opposite VA edge. Time stop 3 trading days (CONFIRMED-secondary holding range).
- Risk 0.5% per trade; max 2 open positions.
- Sweep grid: VA {60, 70, 80}%; stop {0.2, 0.3, 0.5}×ATR; time stop {1, 2, 3, 5} days; profile period {previous week, previous 2 weeks}; trigger {close-back-inside, touch}.

### Pseudocode
```python
vah, poc, val = value_area(prev_week_tickvol_profile, pct=0.70)
for bar in bars_15m(this_week):
    if not in_session(bar, '02:00','12:00','America/New_York') or near_news(bar,30): continue
    if bar.high > vah and bar.close < vah and flat:
        sell(bar.close); stop = bar.high + 0.3*atr_d; tp1, tp2 = poc, val
    if bar.low < val and bar.close > val and flat:
        buy(bar.close); stop = bar.low - 0.3*atr_d; tp1, tp2 = poc, vah
    manage(take 50% at tp1, rest at tp2, exit after 3 days)
```

## Labels
style=swing (intraday entries, 4h–3d holds); confidence=high (record) / low (rules UNVERIFIED-secondary); instruments=FX majors/crosses, gold, indices; timeframe=15m execution, weekly levels; best_backtest_markets=EURUSD;GBPUSD;USDJPY;XAUUSD;GER40
