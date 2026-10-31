# Andrew Aziz (Bear Bull Traders) – 5-min ORB, VWAP trend, ABCD

**Verified result:** No audited personal P&L. The verifiable part is co-authored, rule-exact research with backtests. (a) 5-min ORB on QQQ/TQQQ, 1 Jan 2016–17 Feb 2023: TQQQ +1,484% total, annualized **CONFLICT: 46% in the paper's text vs 48% in its Table 2**, Sharpe 1.19, MDD 28%, alpha 48%, avg 0.18R/trade; QQQ ORB +676% total, MDD 22%, alpha 33%, win rate 24%, avg 0.13R/trade, with **CONFLICT: text says annualized 31% / Sharpe 1.12, Table 2 says 33% / Sharpe 1.13**; net of $0.0005/share commission, no slippage modelled — Zarattini & Aziz, *Can Day Trading Really Be Profitable?* (SSRN 4416622; PDF https://concretumgroup.com/wp-content/uploads/2026/02/Can-Day-Trading-Really-Be-Profitable.pdf). (b) VWAP trend trading: QQQ +671%, TQQQ +8,242% (2018–2023), SSRN 4631351 (https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4631351). These are backtests, not live results. Style: intraday.

| Rule | Detail | Status |
|---|---|---|
| ORB direction | After the first 5-min candle: long if it closed up, short if down, skip a doji | CONFIRMED (SSRN 4416622 PDF) |
| ORB entry | Open of the 2nd 5-min candle | CONFIRMED |
| ORB stop | Low (long) / high (short) of the first candle = 1R | CONFIRMED |
| ORB target | 10R or end of day, whichever comes first; never overnight. Targets 1R–10R were tested and 10R/EoD was best | CONFIRMED |
| Sizing | Risk 1% of equity, max 4x leverage | CONFIRMED |
| Discretionary ORB (tradebook) | Stock opens near VWAP; enter on the break of the opening range; stop on loss of VWAP; target technical levels | CONFIRMED (BBT TradeBook https://members.bearbulltraders.com/wp-content/uploads/2024/01/BBT-TradeBook.pdf) |
| VWAP trend | Long above VWAP, short below, reverse on each 1-min close across VWAP, flat 16:00; 100% equity; zero slippage | CONFIRMED (paper PDF https://concretumgroup.com/wp-content/uploads/2026/02/Volume-Weighted-Average-Price.pdf); full file: academic-zarattini-aziz-vwap-trend-qqq.md |
| ABCD | Pullback 40–70% to support (prefer the 5-min 9 EMA), enter on the consolidation break, stop below the consolidation / new 1-min low, target ≥2R | CONFIRMED (TradeBook, via search summary) |
| 'Stocks in Play' filter (high relative volume) | Used in the stock version | INFERRED (from the paper's stock-universe section; not reproduced verbatim here) |

## Backtest adaptation
Markets: XAUUSD, NAS100, GER40, USDJPY, Brent, BTC. Data: tick/1-min 2020–2026. Tick volume stands in for volume/delta (relative volume = tick count vs. its same-time-of-day 20-day average).
```
on each session (exchange open; NAS100 09:30 NY, GER40 09:00 CET, others use 00:00 or a London open you define):
  c1 = first 5-min bar
  if c1.close == c1.open: skip
  dir = sign(c1.close - c1.open)
  entry = open(c2); stop = c1.low if dir>0 else c1.high; R = |entry-stop|
  size = 0.01*equity / R  (cap notional 4x)
  exit at entry + dir*10R or session close
variant VWAP: position = +1 if close>VWAP(session) else -1, evaluated each 1-min bar (add a 0.05% hysteresis to cut churn)
```
**Market fit:** NAS100 is the best match (the strategy was built on QQQ). GER40 is good, with a clean cash open. XAUUSD/USDJPY/Brent/BTC have no single clean open: test the London 08:00 and NY 08:30/09:30 anchors. Expect weaker results without the 'stock in play' selection. Add slippage, since the paper assumed none.

## Backtest spec (exact defaults, 2026-10-30)
- NAS100: first 5-min bar 09:30–09:35 NY; GER40 09:00–09:05 CET; XAUUSD/USDJPY/Brent 08:30–08:35 NY (INFERRED-DEFAULT anchor); BTC 00:00–00:05 UTC.
- Skip a doji (|C−O| < 0.05×(H−L), INFERRED-DEFAULT). Entry at the 09:35 bar open in the candle direction. Stop at the first bar's low/high. TP 10R, else exit at the session close (15:59 NY / 17:29 CET / 16:59 NY / 23:59 UTC). Risk 1%, leverage cap 4x. All CONFIRMED except the anchors and doji threshold.
- Sweep: TP {3R,5R,10R,close-only}; OR length {1,5,15 min}.

## Rotation re-check 2026-10-31 (batch 20261031-0132)
- **CONFLICT inside the ORB paper:** TQQQ annualized return 46% (text) vs 48% (Table 2); QQQ 31%/Sharpe 1.12 (text) vs 33%/Sharpe 1.13 (Table 2). Earlier file text quoted 46% as if unambiguous; Sharpe 1.19 and +1,484% are consistent.
- ORB paper rules re-confirmed: entry at the open of the 2nd 5-min candle, stop at the 1st candle's low/high, target 10R or EoD, risk 1%, max 4x, $25k start, $0.0005/share, no slippage, 1 Jan 2016–17 Feb 2023.
- **Independent ORB check:** RIP Backtest on NQ futures 2020–Sep 2026 reproduced 24.3% winners and +0.107R/trade (+$70,146/contract) but only the 78.6th percentile of a random-entry control and negative without the 10 best trades → "Buried · Fragile" (https://ripbacktest.com/posts/intraday-momentum-strategy-papers/).
- **Independent VWAP check:** Telonics (https://telonicstrading.com/research-vwap.html) reproduces Sharpe 1.91 at zero slippage but Sharpe 0.10 with one tick of slippage (QQQ +1%, TQQQ −99%); post-publication Oct 2023–Sep 2026 Sharpe 0.63 at zero cost. QuantConnect LEAN reproduction notes break-even below ~1 bp round trip and OOS Sharpe ~0.7.
- Confidence downgraded high → medium (rules exact; net edge not demonstrated independently).
