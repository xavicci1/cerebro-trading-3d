# Linda Raschke — Intraday Holy Grail / ADX pullback (intraday variant only)
**Scope note:** swing (daily) version may be covered by the parallel swing worker; this file = intraday application she explicitly endorses ("particularly well suited for intraday trading").
**Verified result:** Market Wizards (New Market Wizards); LBR Group CTA; no audited figures here. Confidence: med (record), high (rules).
| Rule | Value | Status |
|---|---|---|
| Filter | ADX(14) > 30 and rising | CONFIRMED – Street Smarts excerpt https://www.purebytes.com/archives/metastock/1998/msg03629.html |
| Location | Pullback touches 20-EMA | CONFIRMED |
| Entry | Buy stop above prior bar high | CONFIRMED |
| Stop | Newly formed swing low; trail | CONFIRMED |
| Target | Retest of recent swing high (partial), tighten rest | CONFIRMED |
| Re-entry | If stopped, re-enter at original entry price; after success ADX must re-cross 30 | CONFIRMED |
| Discretion | "everything discretionary" per later interviews | INFERRED (discretionary overlay likely; not sourced) |
| Intraday TF (15m/5m) | INFERRED (she says any TF) |
```
15m bars: if ADX14>30 and ADX rising (ADX>ADX[3]) and +DI>-DI and low<=EMA20 -> place buy stop high[1]+tick
stop = lowest low since touch; TP1 = prior swing high (50%), trail rest under 2-bar low; flat at session end
```
**Fit:** all six; OHLC-only, high readiness. Best NAS100, XAUUSD, GER40, BTC.

## Backtest spec (exact defaults, 2026-10-30)
- 15-min bars. NAS100 09:30–16:00 NY; GER40 09:00–17:30 CET; others 08:00–17:00 London. ADX14>30 rising; touch of EMA20 → buy stop at the prior bar high + 1 tick. Stop at the swing low; TP at the last swing high; flat at the session end. Sweep: TF {5,15,60 min}; ADX {25,30}.
