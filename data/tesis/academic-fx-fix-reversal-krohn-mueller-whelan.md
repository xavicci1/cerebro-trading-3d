# FX fixings and returns around the clock: Tokyo/ECB/London fix reversal (Krohn, Mueller & Whelan, JF 2024)

**Paper**
- Ingomar Krohn, Philippe Mueller & Paul Whelan, "Foreign Exchange Fixings and Returns Around the Clock", *Journal of Finance* 79(1), 2024, pp. 541–578, doi 10.1111/jofi.13306.
- Opened: Warwick WRAP accepted-version PDF, https://wrap.warwick.ac.uk/id/eprint/177333/
- Opened: Bank of Canada Staff Working Paper 2021-48, https://www.bankofcanada.ca/wp-content/uploads/2021/10/swp2021-48.pdf

**Verified result:** VERIFIED (peer-reviewed paper, in-sample). These are GROSS figures from mid-quotes.
- Data: G9 currencies vs USD, Jan 1999–Dec 2019, Refinitiv mid-quotes.
- Pattern: the USD appreciates into the major fixes and depreciates after them.
- Table IV mean daily returns (bps, gross), Tokyo-fix strategy:
  - EUR 4.14 (t 12.60, 57% of days positive), JPY 4.76, GBP 3.15, AUD 4.69, CAD 3.02, CHF 2.49, NZD 5.68
  - Dollar basket (DOL) 4.09 (59% positive)
- Table IV, Europe strategy (long USD before ECB, short USD after London):
  - EUR 6.26 (t 9.95, 56% positive), GBP 4.95, CHF 4.79, SEK 5.68, DOL 3.51
  - JPY −0.12, not significant
- Annualised gross: Tokyo 6.2% (CHF) to 14.2% (NZD); Europe EUR 15.6%, GBP 12.4%, CHF 12%. Standard deviations mostly < 8%.
- Table III, dollar portfolio (long the foreign currencies vs USD), Jun 2006–Dec 2019, mean bps per window: pre-Tokyo −1.58, post-Tokyo +1.88, pre-ECB −1.65, ECB→London −0.04, post-London +1.20. Negative means the foreign currencies depreciate, i.e. the USD appreciates into the fix (paper: "the U.S. dollar appreciates in the run up to foreign exchange fixes and depreciates thereafter"). Exception: the JPY depreciates after the London fix.
- Decay: profits trend down late in the sample. The paper attributes this to arbitrage capital and post-2013 benchmark reforms, but some of the largest European reversals were in 2015–2016.
- **Costs (CONFIRMED, Table X, 2006–2019):**
  - Liquidity providers vs liquidity demanders: AUD pre-ECB + post-London LP +2.45 bps vs LD −7.34 bps; GBP LP +3.95 vs LD −0.98.
  - Quote: "for the trader (or liquidity demander), reversal returns turn negative once transaction costs are taken into account."
- **Retail implication (INFERRED):** EURUSD Tokyo leg ≈ 4.14 bps ≈ 0.45–0.5 pip per day gross. It needs about 2 spread crossings per leg (enter, flip at the fix, exit), so even a 0.2-pip raw spread plus commission eats most of it. Retail = liquidity taker, so expect ≤ 0 net unless filled with limit orders.

## Rules
| Rule | Detail | Status |
|---|---|---|
| Tokyo leg | Long USD from 17:00 ET (NY close) to the Tokyo fix 9:55 JST (= 20:55 ET under EDT, 19:55 ET under EST); then short USD from the fix to 02:00 ET | CONFIRMED (paper windows) |
| Europe leg | Long USD 02:00 ET → ECB reference 14:15 CET (08:15 ET); flat ECB→London; short USD from WMR London 16:00 (11:00 ET) to 17:00 ET | CONFIRMED |
| ECB timing change | ECB reference publication moved to 16:00 CET in July 2016; the paper's window is the 14:15 CET concertation | CONFIRMED (paper note); impact on 2020–26 INFERRED |
| Universe | G9 vs USD; DOL = equal-weight basket | CONFIRMED |
| Costs | Liquidity demanders lose after costs (Table X) | CONFIRMED |
| Filters (size, vol) | None in the paper | INFERRED additions only |

## Backtest spec (exact defaults, 2026-10-31)
- Markets: EURUSD, USDJPY, GBPUSD, AUDUSD, NZDUSD, USDCAD, USDCHF, plus an equal-weight DOL basket. XAUUSD as a non-FX control (INFERRED: gold also has a 15:00 London LBMA PM price).
- Data: 1-min bid/ask 2020-01-01 → 2026-09-30, America/New_York clock with DST.
- Tokyo leg (default):
  - Enter long USD at 17:05 ET, not 17:00, to avoid the rollover spread spike (INFERRED).
  - At the Tokyo fix minute (09:55 JST, converted per day) flip to short USD.
  - Exit at 02:00 ET.
- Europe leg (default):
  - Long USD 02:00 → 08:15 ET (14:15 CET).
  - Flat 08:15–11:00.
  - Short USD 11:00 (16:00 London; post-2015 5-min window, so enter 11:03 ET) → exit 16:55 ET.
- No stop/TP: pure holding rule. Optional disaster stop 1.5× the 20-day average window range (off in the base run).
- Costs (INFERRED retail raw-ECN): EURUSD 0.2 pip, USDJPY 0.3, GBPUSD 0.5, AUDUSD 0.4, NZDUSD 0.8, USDCAD 0.5, USDCHF 0.6 plus $7/lot round-turn commission. Asian-hours spreads ×2. Report gross, maker-fill (zero spread) and taker-net runs.
- Sweep grid:
  - legs {Tokyo, Europe, both}
  - entry offset {0, 5, 15} min after window start
  - exit offset {−15, 0, +15} min
  - post-fix hold {1h, 2h, to window end}
  - pairs individual vs DOL
  - years {2020-22, 2023-26}
  - signal filter: only trade if the pre-fix leg moved ≥ 0.5 × 20-day mean |pre-fix move| (conditional reversal)
- Break-even check: report the average gross bps per trade vs the round-trip spread in bps per pair.

### Pseudocode
```python
for d in trading_days('2020-01-01','2026-09-30'):           # ET clock
    tf = tokyo_fix_et(d)                                     # 09:55 JST -> 20:55 EDT / 19:55 EST (prev ET evening)
    for p in pairs:
        s = +1 if usd_is_base(p) else -1                    # +1 = long USD
        pnl[p] += s   * ret(p, t0=et(d-1,'17:05'), t1=tf, cost=spread(p,'asia'))
        pnl[p] += -s  * ret(p, t0=tf, t1=et(d,'02:00'), cost=spread(p,'asia'))
        pnl[p] += s   * ret(p, t0=et(d,'02:00'), t1=et(d,'08:15'), cost=spread(p,'eu'))
        pnl[p] += -s  * ret(p, t0=et(d,'11:03'), t1=et(d,'16:55'), cost=spread(p,'ny'))
report(gross_vs_net_bps, sharpe, maxdd, by_year, by_leg, dol_basket)
```

## Labels
style=intraday (session/fix timing); confidence=high (in-sample 1999-2019 gross) / low (retail net, liquidity-taker costs negative per Table X); instruments=FX majors (G9 vs USD); timeframe=1m; best_backtest_markets=EURUSD;USDJPY;NZDUSD;AUDUSD;GBPUSD;DOL basket
