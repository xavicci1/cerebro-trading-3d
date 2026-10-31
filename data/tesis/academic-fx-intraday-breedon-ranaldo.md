# Breedon & Ranaldo — "Intraday patterns in FX returns and order flow" (time-of-day effect: currencies weaken in their own trading hours)

**Authors:** Francis Breedon (Queen Mary, University of London), Angelo Ranaldo (Swiss National Bank at the time).
- Paper: SNB Working Paper 2011-4: https://www.snb.ch/public/asset/en/www-snb-ch/publications/research/working-papers/2011/working_paper_2011_04/publications0_en/working_paper_2011_04.n.pdf (opened 2026-10-31).
- Published version: Journal of Money, Credit and Banking 2013, doi 10.1111/jmcb.12032. I did not open the journal page.

**Verified result:** VERIFIED (paper, in-sample).
- Data: EBS hourly data, Jan 1997–Jun 2007.
- Table 2, annualised log mid-quote returns for EUR/USD:
  - EUR session −0.084**
  - USD session +0.100**
  - share positive 0.44** / 0.53*
- Trading return net of bid/ask: +0.06 (morning short) and +0.07 (afternoon long). Quote: "the notable exception is EUR/USD … this basic strategy has been profitable on average with Sharpe Ratios of 1.3 and 0.9 respectively for the morning short and afternoon long".
- Most other pairs are unprofitable after costs:
  - GBP/USD −0.12 / −0.08
  - USD/JPY −0.13 / −0.05
  - AUD/USD −0.51 / −0.50
  - USD/CHF −0.08 / −0.02
- Stability: the EUR-vs-USD session gap has the expected sign every year except 2004. Footnote: the USD appreciated vs EUR over the July 4 holiday on 15 of the last 20 occasions.
- No out-of-sample test in the paper. A 2020–2026 run is genuine OOS. Confidence: high (in-sample, net of EBS spreads), unknown (post-2007).

## Rules
| Rule | Detail | Status |
|---|---|---|
| Trading hours (Table 1) | US 08:00–16:00 New York. Europe 07:00–15:00 local, "+5 hours" vs NY, i.e. 02:00–10:00 NY. Japan 08:00–15:00 local. Australia 10:00–16:00 local. DST differences handled | CONFIRMED |
| Strategy | "go short the base currency in its own trading hours and long in the trading hours of the counter currency", measured open-to-close / open-to-open | CONFIRMED |
| EUR/USD legs | Short EUR from the EUR session open (02:00 NY) to the USD open (08:00 NY); long from 08:00 to the USD close (16:00 NY) | INFERRED (open-to-open wording + Table 1) |
| Costs | EBS firm bid/ask used for the trading return | CONFIRMED |
| Holidays | Not adjusted (deliberately, to limit data mining) | CONFIRMED |
| Note on "Europe" | "+5 hours" matches London time, not CET (+6) | INFERRED (default uses London 07:00) |

## Backtest spec (exact defaults, 2026-10-31)
- Market: EURUSD (primary). Controls: GBPUSD, USDJPY, AUDUSD, USDCHF. Data: 1-min bid/ask 2020-01-01→2026-09-30. All times America/New_York, DST-aware.
- Leg 1 (morning short): sell EURUSD at 02:00 NY (= 07:00 London), buy back at 08:00 NY.
- Leg 2 (afternoon long): buy at 08:00 NY, sell at 16:00 NY.
- Default = both legs (net effect: short 02→08, then reverse to long 08→16). Flat 16:00→02:00.
- No stop and no TP: pure holding-period rule. Optional catastrophic stop 1.5×ATR14(H1)×√hours (INFERRED, off by default).
- Cost: 0.6 pip round trip per leg on EURUSD (INFERRED retail ECN estimate). Skip US holidays and the 24 Dec–2 Jan period (variant).
- Sizing: fixed notional; report annualised return, Sharpe, and the yearly sign of (USD-session − EUR-session).
- Sweep grid: leg-1 start {01:00, 02:00, 03:00}; switch time {07:00, 08:00, 09:00}; leg-2 end {12:00, 14:00, 16:00}; cost {0.3, 0.6, 1.0} pips; legs {short only, long only, both}; pair {EURUSD, GBPUSD, USDCHF (inverse sign), USDJPY with the Tokyo session 19:00–02:00 NY}.

### Pseudocode
```python
for d in trading_days:
    if holiday_filter and is_us_or_target_holiday(d): continue
    p02, p08, p16 = price_at(d,'02:00'), price_at(d,'08:00'), price_at(d,'16:00')   # NY time, ask/bid as appropriate
    r_short = (p02.bid - p08.ask) / p02.bid
    r_long  = (p16.bid - p08.ask) / p08.ask
    pnl[d]  = r_short + r_long
annualise(pnl); sharpe(pnl); by_year(pnl)
```

## Rotation re-check 2026-10-31 (CONFLICT)
- **Source (opened 2026-10-31):** KruegerAlgorithms, "Time-of-day and calendar effects intraday". Dukascopy BID minute data; search 2015–2022; one-shot holdout 2023 → 5 Jun 2026; 6,316 variants; EURUSD cost 1.3 pips RT: https://kruegeralgorithms.com/en/research/time-of-day-and-calendar-effects-intraday
- **Closest independent replication of the Breedon-Ranaldo mechanism:** EURUSD **short 09:00 → 13:00 London** every weekday. Krueger cites Breedon & Ranaldo 2013 as the mechanism.
  - Search: n 2,075, gross 3.16 pips, net +1.86 pips (t 3.4); 7 of 8 years positive; walk-forward +1.69 (t 3.0); BH q 0.48; net zero at 2× costs.
  - **Holdout: n 889, net −0.30 pips (t −0.47)**, gross about a third of the search size. Holdout years net: +0.15 (2023), −0.59 (2024), +0.46 (2025), −2.46 pips (2026 to June).
  - Krueger's conclusion: effects of the search size are "refuted"; a remainder of about 1 pip gross is not, but it lies below costs.
- **CONFLICT with this file:**
  - The paper's EBS 1997–2007 in-sample Sharpe (1.3 morning short / 0.9 afternoon long) is **not confirmed out of sample after retail CFD costs** for the European-hours EUR short.
  - The window differs: our spec is 02:00→08:00 NY, roughly 07:00→13:00 London, while Krueger's is 09:00→13:00 London. Treat it as a near replication, not an exact one.
  - Our 0.6 pip cost assumption is below Krueger's 1.3 pips. At 1.3 pips even the search result covered costs only 2.4×.
- **Also on the page:** FX periodicity (Heston-Korajczyk-Sadka) exists in EURUSD (t 3.38) but only at 0.1–0.5 pips gross vs 1.3–2.0 pips costs; all 150 such rules are net negative. Block the 17:00 NY rollover (BID artefacts, gross t −11.9 for EURUSD).
- **Spec change:** keep the spec as a replication. Add cost 1.3 pips as the default stress (0.6 = ECN best case), a London 09:00–13:00 short variant, a holdout split 2023-01-01 → 2026-06-05, and a block on 16:45–18:30 NY.
- **Status after re-check:** in-sample academic result CONFIRMED (paper); retail OOS edge **CONFLICT / not confirmed** (Krueger holdout).

## Labels
style=intraday (session holding); confidence=high (in-sample paper) / low (OOS: Krueger 2023-26 holdout −0.30 pips net, re-checked 2026-10-31); instruments=FX majors; timeframe=hourly sessions; best_backtest_markets=EURUSD;GBPUSD;USDCHF;USDJPY
