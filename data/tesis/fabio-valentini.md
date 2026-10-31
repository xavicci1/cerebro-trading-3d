# Fabio Valentini — Order-flow NQ scalping (Direction → Location → Aggression)

**Verified result (OFFICIAL, CONFIRMED):** Robbins World Cup *Futures Day Trading (quarterly)*: Q1-2024 3rd +89.5%, Q4-2024 2nd +218.3% (https://www.worldcupchampionships.com/2024-quarterly-finals); Q1-2025 3rd +169.7% (https://www.worldcupchampionships.com/world-cup-trading-championship-standings). Q4-2023 +68.6% per secondary X post only. 500+ trades / DD<20% per IQ Capital (secondary).

## Rules
| Rule | Value | Status |
|---|---|---|
| Instrument | Nasdaq futures (NQ/MNQ) | CONFIRMED – Chart Academy synthesis + Chart Fanatics episode (https://www.youtube.com/watch?v=tvERE-Beu2U, "future scalper… New York session") |
| Session | New York cash session | CONFIRMED (same video: "live during New York session") ; exact window (09:30–11:30 ET) INFERRED |
| Framework | 3 steps: Direction, Location, Aggression | CONFIRMED – https://www.chartacademy.com/instructors/fabio-valentini: "He finds the direction, waits for price to reach a key level, then enters only when he sees real buying or selling pressure in the order flow." |
| Direction filter | Day's volume profile: balanced (bell curve) vs out-of-balance. Breakouts against a balanced profile fail ("only 30% will go through the rest will remain in … fair value area") | CONFIRMED quote (video transcript). Rule "trend-trade only when out of balance, else fade back to POC/value" INFERRED |
| Location | Volume profile levels (VAH/VAL/POC, LVNs), VWAP | CONFIRMED tools (Chart Academy). Which level precisely = INFERRED (LVN/value edge) |
| Entry trigger | Aggression on footprint/CVD at the level (aggressive buyers/sellers, absorption → initiative) | CONFIRMED concept; numeric threshold INFERRED |
| Chart | Range charts (40-range NQ referenced for his "effort indicator") | CONFIRMED-secondary: https://x.com/IQCapital_io/status/2111751789313740898 (about a student using "Fabio's NASDAQ effort indicator, built for exactly that chart type") |
| Stop | Beyond the aggression candle / level ("You wait for this candle. You put the stop loss here") ; fast move to breakeven | CONFIRMED qualitative (video, Chart Academy "move his stop to breakeven sooner") |
| Target | Scale out; next volume node/POC; let runners on directional days | CONFIRMED "scale out" (video); targets INFERRED |
| Risk | ~0.25% per trade; increase risk only with intraday profits ("building profit for the day"); stop after 3 losses | CONFIRMED (Chart Academy) |

## Backtest adaptation (no footprint)
Proxy delta per 1-min bar: `d = sign(close-open)*tick_volume` (or tick-rule on tick data: +vol if price>prev, − if <). CVD = cumsum(d) reset daily. Aggression = |d| > k·rolling_median(|d|,20) AND bar range > 1.2·median range, close in top/bottom 25% of bar.
```
each NY day (09:30–11:30 ET for NAS100; 08:00–11:00 London-time for GER40; 08:20–11:00 ET XAUUSD):
  build developing profile from tick vol (prior day + overnight) -> POC, VAH, VAL, LVNs
  balanced = today's open inside prior VA AND first 30m inside VA
  if not balanced: dir = sign(price - VWAP) (out-of-balance)
     wait pullback to VWAP or LVN/VAH(VAL) in dir; entry when aggression bar in dir -> market
  else (balanced): fade failed break of VAH/VAL: price pokes outside, aggression opposite -> enter toward POC
  stop = beyond aggression bar extreme + 1 tick-ATR buffer; move to BE at +1R
  TP1 50% at 1.5R or POC; runner to opposite value edge / trailing 2-bar extreme
  risk 0.25%; after daily P&L > +1R allow 0.5%; stop day after 3 losses
```
**Fit:** NAS100 (best, original market), GER40 (good, liquid open), XAUUSD (ok, NY open), BTC (ok, CME-hours tick vol noisy), USDJPY/Brent (weak — CFD tick volume weakly correlated with true aggression). Caveat: tick-volume delta is a poor proxy for footprint; expect big degradation vs. live discretionary reads.

## Backtest spec (exact defaults, 2026-10-30)
- NAS100 only; window 09:30–11:30 NY (INFERRED-DEFAULT). Value area from the prior session (70%) + developing POC on 1-min tick-volume profile.
- Direction: balanced if the open is inside the prior VA → fade the VA edges; out-of-balance if the open is outside the VA and the first 30 min hold outside → trade with the trend from LVN pullbacks.
- Trigger: 1-min bar at the level with tick volume ≥ 2.0× 20-bar average and close in the trade direction (aggression proxy, INFERRED-DEFAULT).
- Stop: the trigger-bar extreme ± 2 pts, minimum distance 20 NAS100 pts (INFERRED-DEFAULT). Move to breakeven at +1R. TP: 50% at 1.5R, rest at the prior POC / 3R. Flat at 11:30 NY. Risk 0.25%, stop after 3 losses/day (CONFIRMED).
- Sweep: tickvol mult {1.5,2,3}; stop pts {15,20,30}.
