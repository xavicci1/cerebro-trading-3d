# Tom Hougaard — DAX intraday price action (1m/5m), pyramiding winners
**Verified result (re-checked 2026-10-31):** Public live-streamed trading on own account (UK spread bet), large documented days in videos; no third-party audit found. Confidence: low-med (record), medium (rules).
| Rule | Value | Status |
|---|---|---|
| Instrument | DAX (GER40), also Dow/Nasdaq | CONFIRMED – tradertom.com articles / manuals |
| TF | 5-min structure, 1-min timing | CONFIRMED-secondary (search synthesis of https://tradertom.com/wp-content/uploads/2021/03/Brief-Manual-on-Price-Action-1.pdf) |
| Entry | Strong bar closing near its high, higher low, break above recent highs | CONFIRMED-secondary (Brief Manual) |
| Exit | Out if that bar's low is violated | CONFIRMED-secondary |
| Management | "Add only when winning, reduce/exit when losing"; assume you are wrong | CONFIRMED – https://www.tradertom.com/wp-content/uploads/2021/03/BEST-LOSER-WINS-1.pdf |
| Session | DAX cash open 09:00 CET + US open | INFERRED |
```
GER40 5m from 09:00–11:30 CET (+15:30–17:00 CET)
signal bar: close in top 20% of range, low > prior bar low, close > max(high,6 bars)
entry next bar open (or stop above high); stop = signal.low - 1pt
pyramid: add 1 unit each new 5m bar close making new high while open profit>0, move all stops to latest signal low
exit: stop hit or 17:30 CET
```
**Fit:** GER40 (native), NAS100, XAUUSD; others ok. OHLC-only → high fidelity.

## Backtest spec (exact defaults, 2026-10-30)
- GER40 5-min bars, entries 09:00–11:00 CET, flat 17:30 CET. NAS100 entries 09:30–11:30 NY, flat 15:55 NY (INFERRED-DEFAULT).
- Long trigger: a 5-min bar closes in the top 20% of its range, range ≥ 1.0×ATR(20, 5m), its low > the prior bar low, close > the high of the last 6 bars (INFERRED-DEFAULT). Short mirror.
- Entry: next bar open. Stop: trigger-bar low −2 pts. Add 1 unit at each +1R (max 3; add only when winning, CONFIRMED principle). Trail under each new 5-min swing low. No fixed TP.
- Sweep: close-top% {10,20,30}; lookback {3,6,12}.

## Independent re-check 2026-10-31 (rotation)
Source opened 2026-10-31: KruegerAlgorithms, "Trade Management Creates No Edge: 3,780 Hougaard Variants End at Minus Costs on a Random Market" (2026-09-29), https://kruegeralgorithms.com/en/research/hougaard-trade-management-tested

**Setup:**
- Markets: DAX, FTSE, Dow, NQ and SPX cash sessions, Dukascopy CFD minute data (BID).
- Search period 2015–2022; a single holdout run 2023 → Jun 2026.
- Costs in points: DAX 2.5, FTSE 1.5, Dow 4.0, NQ 2.5, SPX 0.8; every added unit pays in full.
- 3,780 management policies (initial stop, adding, trailing, re-entry, time window), 61,793 tests.
- Nulls: a random market (5 draws), random direction, and always-long.

| Item | Detail | Status |
|---|---|---|
| Rules as summarised by Krueger | Tight stop of **20% of daily ATR** (10% on quiet, tight-spread markets) per his articles. Add to winners, never to losers ("Best Loser Wins", 2022). Fixed setups such as the DAX **"School Run"**: breakout of the 15-min candle **09:15–09:30** (CET) | CONFIRMED as Krueger's citation of Hougaard. Hougaard's own article not opened here: secondary |
| Random market | All 18,900 policy×market combos: +0.02 R gross, **−0.238 R net** (costs 0.258 R) | CONFIRMED |
| Real markets, mean of all policies | First-15-min direction: gross +0.108, net −0.160. School Run: gross +0.081, net −0.176. All signals: gross +0.072, net **−0.204 R/day** | CONFIRMED |
| Net significance | Of 30,240 net tests none reaches t > 2 (max 1.84, DAX +0.048 R/day). 92–98% of policies are net negative | CONFIRMED |
| Building blocks (net R/day, all markets) | Stop 0.1 ATR −0.371; 0.2 ATR −0.148; 0.3 ATR −0.094. Adding none −0.145, up to 2 units −0.206, up to 4 units −0.223. **Tight stops are the most expensive; adding harvests ≈ +0.01 R but costs 0.06–0.08 R** | CONFIRMED |
| School Run, DAX | −0.019 R/day (t −0.4). Pre-specified managed variant (stop 0.2 ATR, two add-ons, trail 0.2 ATR, re-entry): −0.149 R across markets (t −4.9) | CONFIRMED |
| Persistence | At 0.1 ATR moves, continuation 50.6% vs 50.9% random (pure chance). 0.3 ATR: 52.4% vs 50.5% (t 3.4). Tradable only at the cost threshold (52.3–54.2% needed) | CONFIRMED |
| Gap-and-go lead | 15-min range breakout in the gap direction, gap ≥ 0.3 ATR, stop 0.2 ATR. Search +0.167 R (t 2.85, 2,271 trades). **Holdout −0.087 R (t −1.15, 901 trades)**; sign flipped | CONFIRMED |
| Caveat | Tests a mechanical translation, not Hougaard's discretion (day selection, size on best days, overnight holds, futures costs) | CONFIRMED (their stated limit) |

**Impact on this file:** the record stays unverified (no audit). The mechanical translation of his rules is **net negative in independent tests**. Status of the backtest spec: CONFLICT. The pyramiding/tight-stop variant is expected to lose net. Run it only together with the random-market null.

**Backtest spec addendum (2026-10-31):**
- Add a "School Run" variant: GER40, 15-min candle 09:15–09:30 Europe/Berlin, OCO stop orders at its high/low, stop 0.2 × daily ATR(14), flat 17:30 Berlin.
- Costs: GER40 2.5 pts round trip per unit (each add-on pays in full).
- Null: random market (mirror 1-min candles around the open, p = 0.5, 5 seeds).
- Sweep: stop {0.1, 0.2, 0.3} × daily ATR; adds {0, 2, 4}; window {first 2 h, whole day}.
- Expected per Krueger: net < 0 in every cell.
