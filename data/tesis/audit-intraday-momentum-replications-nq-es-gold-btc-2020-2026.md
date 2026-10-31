# Audit – independent replications of published intraday-momentum papers on NQ/ES/gold/BTC (2020–2026) and SPY OOS

Opened sources:
- RIP Backtest, "Intraday momentum strategy papers" (written 18 Oct 2026): https://ripbacktest.com/posts/intraday-momentum-strategy-papers/
- Paz Serpa, *SPY intraday momentum out-of-sample* (June 2026) PDF: https://wato.it.com/papers/spy-intraday-momentum-oos-2026.pdf ; SSRN https://papers.ssrn.com/sol3/papers.cfm?abstract_id=7290621 ; code github.com/PazSheimy/spy-intraday-momentum-oos
- Original paper for the rules: Zarattini, Aziz & Barbon, *Beat the Market* (SSRN 4824172) https://concretumgroup.com/wp-content/uploads/2026/02/Beat-the-Market.pdf

**Verified result (independent, not live):**
- RIP Backtest, 1-min data ES/NQ Jan 2020–25 Sep 2026, gold spot 2004–2026, BTCUSDT 2017–2026; round-trip costs ES $30.76, NQ $15.76, gold $0.30/oz, BTC ~0.1%; six gates (validation PF ≥ 1.2; ≥ 50 trades per period; development t ≥ 2.5; ≥ 95th pct of a random-entry control; positive without 10 best trades; positive holdout).
  - **Noise Area, NQ, NY session 09:30–16:00, long/short: +$231,557 per contract, 1,504 trades, +$153.96/trade, validation PF 1.33, t 2.82, control percentile 100, holdout +$48,864, 6/6 gates.** Long-only: +$152,227, 747 trades, +$203.78/trade, t 2.98, holdout +$47,433, 6/6. Profitable every year 2020–2026; forward test started 12 Oct 2026.
  - Noise Area failures: Asia and London sessions failed on every market; ES NY long/short +$38,508, t 1.91, holdout −$25,692, 2/6; gold NY gross $0.28–0.42/oz vs $0.30 cost (net −$0.34 to +$0.12/oz); BTC all versions lost. Gross/cost ratio NQ 10.8×, ES 1.8×, gold 0.9×.
  - 5-min ORB on NQ reproduced the paper's 24.3% winners and +0.107R/trade (+$70,146) but sits at the 78.6th percentile of the random control and loses without its 10 best trades → "Buried · Fragile".
  - Gao-Han-Li-Zhou (first half-hour → last half-hour) on ES/NQ 2020–26: all 8 versions lost before costs.
- Paz Serpa (IQFeed 1-min SPY, Noise Area rules): in-sample 2015–Apr 2024 +432.6%, 19.8%/yr, vol 14.3%, Sharpe 1.34, hit 44.8%, MDD 26.2%; **OOS May 2024–Mar 2026 +9.4% total, 4.8%/yr, Sharpe 0.39, hit 45%, MDD 18.5%** (buy-and-hold +29.5%); OOS mean t = 0.54 (p = 0.59). Calendar years: 2016 −13.4%, 2017 −8.8%, 2018 +60.5%, 2019 +8.4%, 2020 +26.2%, 2021 +32.8%, 2022 +23.7%, 2023 +37.8%, 2024 +30.1%, 2025 −2.7%, 2026 YTD −3.1%.
- CONFLICT (citation): Paz cites Rosa as "Journal of Financial Markets 60:100718"; the Rosa paper itself (opened, see academic-rosa-2022-intraday-momentum-oos-es.md) is J. Futures Markets 42(12):2218–2234.

**Takeaway:** Of all published intraday index/gold/BTC momentum rules tested independently on 2020–2026 data, only the Noise Area on NQ in the NY cash session survives costs, random control and holdout. SPY version decayed sharply after publication. Style: intraday.

## Rules (Noise Area as tested; from the original paper unless noted)
| Rule | Detail | Status |
|---|---|---|
| σ(HH:MM) | Mean over prior 14 days of |price(HH:MM)/open(09:30) − 1| | CONFIRMED (paper) |
| Bands | UB = max(Open, PrevClose)×(1+VM·σ); LB = min(Open, PrevClose)×(1−VM·σ); VM = 1 | CONFIRMED (paper) |
| Decision times | Only at HH:00 and HH:30; stops also only checked at those times | CONFIRMED (paper) |
| Entry | Long if price > UB; short if price < LB | CONFIRMED (paper) |
| Trailing stop | Long: max(UB, VWAP); short: min(LB, VWAP) (current band, not opposite band) | CONFIRMED (paper) |
| Exit | Flat at 16:00 ET | CONFIRMED |
| Sizing | Shares = AUM × min(4, 2%/σ14d) / Open | CONFIRMED (paper) |
| NQ futures = best market | Only NY session passes; long-only also passes | CONFIRMED (RIP Backtest) |
| Gold/BTC/ES not viable at realistic costs | Gross/cost ≤ 1.8× | CONFIRMED (RIP Backtest) |
| Expected post-2024 decay | SPY OOS Sharpe 0.39 | CONFIRMED (Paz) |

## Backtest spec (exact defaults, 2026-10-31)
- Primary market: NAS100 (NQ proxy), session 09:30–16:00 America/New_York, 1-min data 2020–2026. Controls: GER40 09:00–17:30 Europe/Berlin (open-anchored), XAUUSD 09:30–16:00 NY (expect failure), BTC 13:30–20:00 UTC (expect failure).
- Defaults: lookback 14 days; VM 1.0; decisions at :00/:30 starting 10:00 ET; long > UB, short < LB; trailing stop long max(UB,VWAP) / short min(LB,VWAP) checked at :00/:30; exit at 15:59 bar close; no TP; size min(4, 0.02/σ14d) × equity. VWAP tick-weighted, session-anchored.
- Costs: NAS100 1 index point round-trip default (≈ NQ $15.76/contract/$20 per point is ~0.8 pt; round up); report break-even cost.
- Validation design (copy RIP Backtest): dev 2020–2023, validation 2024–Mar 2025, holdout Apr 2025–2026; random-entry control (circularly shifted days, 500 runs); drop-top-10-trades test.
- Sweep grid: VM {0.8, 1.0, 1.2, 1.5}; lookback {14, 30, 90}; check interval {15, 30, 60 min}; long-only vs long/short.

### Pseudocode
```python
for d in days:
    O = open_0930(d); PC = close_1600(d-1); lev = min(4, 0.02 / stdev(daily_ret[-14:]))
    pos = 0
    for t in d.half_hour_marks_from_1000:
        s = mean(abs(px(d-k, t) / open_0930(d-k) - 1) for k in 1..14)
        UB = max(O, PC) * (1 + VM*s); LB = min(O, PC) * (1 - VM*s)
        p = px(d, t); v = vwap(d, t)
        if pos > 0 and p < max(UB, v): pos = 0
        if pos < 0 and p > min(LB, v): pos = 0
        if pos == 0:
            if p > UB: pos = +lev
            elif p < LB: pos = -lev
    close_all(at=close_1559(d))
```

## Labels
style=intraday; confidence=medium (NQ NY only); instruments=NQ, ES, gold, BTC, SPY; timeframe=1m, 30m checks; best_backtest_markets=NAS100;GER40
