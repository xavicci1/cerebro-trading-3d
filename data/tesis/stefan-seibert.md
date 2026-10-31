# Stefan Seibert — Trend/value-area entries with COT & seasonality filters

**Verified result:** World Cup Futures champion 2020 (342.3%) and 2022 (262.3%); Global Cup Derivatives 2019-20 210.7% (https://oubotrading.com/world-cup-trading-championship-standings). Confidence: high (record), medium-low (rules).

## Rules
| Rule | Value | Status |
|---|---|---|
| Style | Interview: technical/price-action with macro, intermarket, seasonality, sentiment, COT as *subsidiary* market/direction selectors | CONFIRMED – https://www.traders-mag.it/trading-discrezionale-razionale/ |
| Note | Another profile calls him "fully systematic… CME index futures" (https://trading-tournaments.com/traders/stefan-seibert) — conflicts with "discretionary" interview | CONFLICT |
| Structure | "What, where, how": Dow-theory trend → enter in "value area" = typical retracement zone; trendline breaks = dip into value, not trend reversal | CONFIRMED (Traders' quote: "le interruzioni della linea di tendenza sono la prova dell'immersione in un'area di valore") |
| Range regime | Entries on both sides of range | CONFIRMED |
| Specific numbers | 38–62% retracement, swing-pivot trend definition, stop beyond swing | INFERRED |

## Pseudocode
```
daily trend = higher swing highs & lows (pivot 5) -> up
value zone = 38.2–61.8% retracement of last impulse leg (or EMA20–EMA50 band)
entry (4h/1h): price in zone AND 1h close breaks above prior 1h swing high (resumption) -> long
stop below zone low / last swing low; TP = prior swing high then trail 2*ATR(daily)
filter: COT commercials net-long percentile >50 (futures-only; skip for BTC/CFDs), seasonality optional
range regime (ADX<20): buy VAL / sell VAH of 20d range with reversal bar
```
**Fit:** XAUUSD, Brent, USDJPY (COT available), NAS100, GER40; BTC (no COT filter).

## Backtest spec (exact defaults, 2026-10-30)
- Daily closes: NAS100 16:00 NY, GER40 17:30 CET, XAUUSD/USDJPY/Brent 17:00 NY, BTC 00:00 UTC. Trend = higher swing highs/lows on 5-bar pivots. Entry: limit at the 50% retracement of the last swing (INFERRED-DEFAULT midpoint of 38–62%). Stop beyond the 78.6% retracement. TP: the prior swing extreme. Sweep: entry {38.2,50,61.8}%.
