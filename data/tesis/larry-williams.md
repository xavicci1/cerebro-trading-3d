# Larry Williams — Volatility breakout from the open

**Verified result:** CONFIRMED (re-verified live 2026-10-31). The official historical standings https://www.worldcupchampionships.com/world-cup-trading-championship-historical-standings list "1987 World Cup Trading Championship 1st Larry Williams 11,376.00". Note: no source says the 1987 trades used *this exact* rule; he traded a discretionary/system mix. Confidence: high (record), medium (rule mapping).

## Rules
| Rule | Value | Status |
|---|---|---|
| Core | Trend set by "explosions of price activity" from a center point; uses yesterday's range | CONFIRMED – Long-Term Secrets to Short-Term Trading (https://atoast2trading.wordpress.com/wp-content/uploads/2012/02/larry-williams-long-term-secrets-to-short-term-trading.pdf): "using just yesterday's range as my comparison of volatility works wonders" |
| Anchor | Today's open (book also tests close) | CONFIRMED (book tables; open variant in WH SelfInvest https://www.whselfinvest.com/en-lu/trading-platform/free-trading-strategies/tradingsystem/56-volatility-break-out-larry-williams-free) |
| Entry | Buy stop open + k·(H−L)prev; sell stop open − k·range | CONFIRMED form. CONFLICT on k (corrected 2026-10-31): the book's own examples use k = 1.0 ("100 percent of the previous day's range above the open", bonds) and, for the S&P swing-value variant, 80% above / 120% below the open of the largest of (H[3]−L[0], H[1]−L[3]). Secondary sources use 0.25–0.7. Default 0.6 stays INFERRED; 1.0 added to the sweep |
| Timeframe | Daily signal, intraday stop fill | CONFIRMED |
| Exit | "Bailout": "exit on the first profitable opening if the profit is only one tick, take it"; for slower markets "I will delay the bailout a day or two". Also "Exit and reverse if you get an opposite signal" | CONFIRMED (book text, re-read 2026-10-31; upgraded from CONFIRMED-secondary) |
| Stop | "Always use a dollar stop on all trades". Book bond example: "A protective stop of $1,500 or 50 percent of the previous day's range subtracted from our entry" | CONFIRMED (book; upgraded from INFERRED) |
| Filters | Trend/COT, day-of-week (TDW), Williams %R | CONFIRMED that he uses COT & %R (secondary); combination INFERRED |

## Pseudocode
```
R = H[1]-L[1]; k in {0.4,0.5,0.6}
long if price >= O + k*R (optionally only if C[1] > SMA(C,20))
short if price <= O - k*R (optionally only below SMA20)
stop = entry -/+ 0.5*R (or $ stop); exit at first profitable daily open, max hold 3 days
```
**Fit:** XAUUSD, NAS100, Brent, BTC (open = 00:00 UTC), GER40; USDJPY weaker (lower range expansion). Fully OHLC-based → no order-flow proxy needed.

## Backtest spec (exact defaults, 2026-10-30)
- Daily bars; entry intraday. NAS100 session 09:30–16:00 NY; GER40 09:00–17:30 CET; FX/XAU/Brent 17:00–17:00 NY; BTC 00:00 UTC.
- Buy stop = open + 0.6×(H−L)prev; sell stop = open − 0.6×(H−L)prev. k=0.6 INFERRED-DEFAULT (sources 0.25–0.7; ~midpoint/common).
- Stop: 0.5×(H−L)prev from entry (INFERRED-DEFAULT). Exit: first profitable open ('bailout', CONFIRMED-secondary); else hard exit at the 3rd open. No TP.
- Sweep: k {0.4,0.6,0.8,1.0}; stop {0.5,1.0}×range; bailout delay {0,1,2} days; stop-and-reverse {on,off}.


## Re-verification log (2026-10-31, batch 20261031-0018)
- Record: re-confirmed on the official historical standings (1987, 1st, 11,376.00). No conflict.
- Book source (https://atoast2trading.wordpress.com/wp-content/uploads/2012/02/larry-williams-long-term-secrets-to-short-term-trading.pdf) re-opened. This is a third-party upload of the full book, not a publisher preview, so no edition or page numbers are cited. The quoted rule text was read from it.
- WH SelfInvest page re-checked live (HTTP 200).
- Corrections: k CONFLICT added (the book uses 1.0 and 0.8/1.2 swing-value variants); bailout, dollar stop, 50%-range stop and stop-and-reverse upgraded to CONFIRMED.
