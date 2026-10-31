# Al Brooks — Emini 5-min price-action scalping
**Verified result (re-checked 2026-10-31):** None audited/public. Long-time full-time trader & author (Wiley trilogy). Confidence on record: **low**; on rules: high (self-published).
| Rule | Value | Status |
|---|---|---|
| Instrument/TF | ES Emini, 5-min chart | CONFIRMED – https://www.brookstradingcourse.com/futures-market/day-trading-5-minute-emini/ |
| Entry | Stop order 1 tick beyond signal bar (e.g. High 2 in bull trend / Low 2 in bear) | CONFIRMED stop-entry (BTC pages); H2/L2 as primary scalp setup INFERRED from his course vocabulary |
| Stop | Beyond signal-bar extreme | INFERRED |
| Target | Never scalp < 1 pt in Emini (< 10 pips FX, < 10 cents stocks); scalp profit ≈ half an average bar | CONFIRMED – https://www.brookstradingcourse.com/trading-strategies/rules-for-scalping/ (re-opened 2026-10-31). Earlier "2-pt only when bars ~4 pts / 4-pt target needs ~6 ticks" NOT on this page → unverified |
| Risk/reward | **CONFLICT (corrected 2026-10-31):** earlier file said "reward ≥ risk CONFIRMED". The page says the opposite: scalp reward ≈ ½ bar, risk ≈ 1 bar (stop beyond signal bar), so you need ~67% to break even and "70% or more" in practice; great scalpers win 80–90%. Brooks says most traders should swing trade instead (reward ≫ risk, 30–40% win rate OK) | CONFIRMED – same page |
| Scalping chart | When scalping he uses a 2-min chart with a 10-bar EMA (normally 5-min with 20-bar EMA); stop entry 1 tick beyond a with-trend signal bar closing on its extreme near the EMA; beginners: stop orders only, no scaling in | CONFIRMED – same page |
| Session | US RTH 09:30–16:15 ET | INFERRED |
```
bars 5m; EMA20; trend = close>EMA20 for >=10 of last 20 bars
H2: in bull trend, count pullback legs; 2nd bar whose high > prior bar high after a pullback = H2 signal (bar close above its midpoint)
entry buy stop = signal.high + 1 tick; stop = signal.low - 1 tick
target_scalp = entry + max(1pt, 0.5*avg_range(20))   # Brooks: reward≈½ bar, risk≈1 bar
# swing variant (Brooks' recommendation): target = entry + 2*stop_dist
skip if signal bar range > 1.5*avg_range (risk too big); mirror L2 shorts
```
**Fit:** NAS100, GER40 (cash-open), XAUUSD good; USDJPY ok in Tokyo/NY overlap; Brent/BTC noisier. No order flow needed → high fidelity. Spread cost critical (target ≈ 0.5 bar).

## Backtest spec (exact defaults, 2026-10-30)
- NAS100 5-min, 09:30–16:15 NY; GER40 09:00–17:30 CET. Bull trend = close > EMA20 and EMA20 rising 3 bars.
- H2 = signal bar of the second pullback leg → buy stop 1 tick above it. Stop 1 tick below the signal bar. **Scalp TP = 0.5 × average bar range (20), floor 1 pt NAS100 / 10 pips FX (CONFIRMED rule; corrected 2026-10-31 — earlier TP = 1.0R "reward ≥ risk" was CONFLICT).** Swing variant: TP = 2.0R. Flat at the session close. L2 mirror. Break-even win rate for the scalp ≈ 67% before costs.
- Scalp variant chart: 2-min bars + EMA10 (CONFIRMED); default variant: 5-min + EMA20.
- Sweep: TP {0.5 bar, 1.0R, 2.0R}; chart {2m+EMA10, 5m+EMA20}.

## Independent re-check 2026-10-31 (rotation)
Source opened 2026-10-31: KruegerAlgorithms, "80% of Breakouts Fail, Just as in a Random Market: Al Brooks' Price Action Against Chance" (2026-09-29), https://kruegeralgorithms.com/en/research/al-brooks-price-action-tested

**Setup:**
- Markets: DAX, FTSE, Dow, NQ, SPX cash sessions on 5-min candles, plus gold and EURUSD as a transfer test.
- Dukascopy CFD minute data, search period 2015–2022. No holdout, because no candidate survived.
- Costs: DAX 2.5, FTSE 1.5, Dow 4.0, NQ 2.5, SPX 0.8 points = 0.17–0.27 R per trade.
- Eight core setups pre-formalised from Brooks' glossary; 3,586 rule variants.

| Item | Detail | Status |
|---|---|---|
| H2 at the 20-EMA (buy stop 1 tick above the signal bar, stop below it, target 1R) | n 5,276, hit rate 49.4% vs random walk 50.1% / random market 50.6%. Gross −0.17 bps, **net −2.57 bps (t −9.26)**. H1: 50.4%, net −1.95 bps. H3+: 51.4%, net −1.84 bps | CONFIRMED |
| Break-even needed | With costs of 0.17–0.27 R, a 1R scalp needs 59–64% hits | CONFIRMED |
| Pullback-count variants | None of 125 is net positive; best t −0.22 | CONFIRMED |
| "80% of breakouts fail" | Real 78.3–80.4% vs random market 80.3–81.3% (EU 12-candle: 80.3% vs 80.3%). **The number is right, but it is the number of a random walk.** US indices fail slightly *less* often than chance (continuation) | CONFIRMED |
| Fading failed breakouts (target mid-range) | 57.5% hits vs 56.2% random walk; net −0.5 to −2.2 bps, best t −0.92 | CONFIRMED |
| Other setups | Always-in (trend candle + follow-through): no prediction for the next 30/60 min (gross +0.02/+0.13 bps, n 30,752). Wedge/three pushes −1.6 to −2.4 bps; breakout pullback −1.3 to −2.2; ii/iii −1.6 to −3.7; final flag −1.3 to −2.6; first EMA touch best t 0.67. Trend from the open: US alone +5.69 bps (t 1.51), all markets +2.19 bps (t 0.79), without the five best days −0.03. Highest t of the whole test 1.95 (trend from the open, NQ alone). Gold/EURUSD transfer: 714 rules, best t 0.89 | CONFIRMED |
| Small real effects | Midday always-in state: +3.37 bps gross / +0.88 net (t 0.90). First break of a micro channel fails 52.2% vs 50.7%: real but smaller than costs | CONFIRMED |
| Caveat | Tests a mechanical translation; Brooks trades with discretion and futures costs | CONFIRMED (their stated limit) |

**Impact on this file:** consistent with the 2026-10-31 R:R correction above. The scalp needs ≈ 67–70% wins, but measured H2 hit rates at 1R are ≈ 49–51%. Mechanical H2/L2 is **net negative** in an independent 3,586-variant test. Confidence on the record stays low; rule-level edge status is CONFLICT (no edge found).

**Backtest spec addendum (2026-10-31):**
- Keep the existing spec, but mandatory controls are now:
  - a placebo stop entry at the same time of day and on the same side;
  - a random market (mirror 1-min candles around the open, p = 0.5).
- Costs: NAS100 2.5 pts, US500 0.8, GER40 2.5, DJ30 4.0 round trip.
- Report hit rate vs the 59–64% cost-adjusted break-even.
