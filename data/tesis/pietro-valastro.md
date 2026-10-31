# Pietro Valastro — Order flow + option flow + gamma-exposure day filter
**Verified result (OFFICIAL, live re-checked 2026-10-31):** Q4-2025 Futures Day Trading 2nd +80.4%; Q1-2026 4th +76.6% (https://www.worldcupchampionships.com/world-cup-trading-championship-standings ; also in the historical table https://www.worldcupchampionships.com/world-cup-trading-championship-historical-standings). No placing for him in Q2-2026, Q3-2026 or Q4-2026-to-date top lists (checked 2026-10-31). No conflict found. Confidence: high (record), low-med (rules).
| Rule | Value | Status |
|---|---|---|
| Tools | OrderFlow, OptionFlow, macro-sentiment | CONFIRMED – LinkedIn https://es.linkedin.com/posts/pietro-valastro-449b91291_subcampe%C3%B3n-mundial-q42025-futuros-q4-activity-7415421427925106688-zoA4 |
| Day filter | Filter days with gamma exposure; trade only the most directional days → fewer trades, higher RR, lower win rate | CONFIRMED (same post) |
| Chart | 40-range NQ chart, uses Fabio Valentini's "NASDAQ effort indicator"; waits for absorption or initiative at its zones | INFERRED (unverified social-media claim; not confirmed this session) |
| Negative-GEX = directional day | INFERRED (standard GEX interpretation) |
```
day filter (no GEX data): trade only if overnight range/ATR20 < 0.6 AND first 15m range > 1.2*median (directional open) — proxy for negative gamma
then Fabio-style entry at zones: absorption (high |d|, small range) -> fade; initiative (high |d|, large range, close at extreme) -> join
stop beyond zone; target >=2.5R (high RR), trail
```
**Fit:** NAS100 (needs proxy for GEX), GER40, XAUUSD; others weak.

## Backtest spec (exact defaults, 2026-10-30)
- NAS100 1-min, 09:30–11:30 NY. GEX unavailable → directional-day proxy: trade only if the first-30-min range ≥ 0.35×ATR14d (INFERRED-DEFAULT). Entry: pullback to the developing VWAP with a tick-volume spike ≥ 2× avg20, in the first-30-min direction. Stop 20 pts. TP 3R. Flat 11:30 NY. Sweep: range filter {0.25,0.35,0.5}.
