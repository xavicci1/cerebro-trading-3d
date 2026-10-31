# Audit: XAUUSD intraday breakouts (London/NY reference candles, Shanghai open, NFP/CPI news) and gold trend-following, independent tests 2015–2026 (KruegerAlgorithms) + vendor cross-check
**Sources (all opened 2026-10-31):**
- Night-session breakouts Asia and gold, real ticks (2026-10-05): https://kruegeralgorithms.com/en/research/night-session-breakouts-asia-gold-real-ticks
- News trading gold and bitcoin, fill artefact: https://kruegeralgorithms.com/en/research/news-trading-gold-bitcoin-fill-artifact
- Reference candles on FX and gold (2026-08-17, carries a 29 Sep / 5 Oct 2026 "not proven" note): https://kruegeralgorithms.com/en/research/fx-gold-reference-candle-scan
- Gold trend-following is long beta: https://kruegeralgorithms.com/en/research/gold-trend-following-is-long-beta
- Vendor (self-reported, net): TRAIDE Research inventory: https://traideapp.com/papers/inventory.html

**Verified result:** These are independent third-party tests, not a trader record. Data and costs:
- Dukascopy CFD minute data (BID) 2015–2022 as the search period.
- One holdout run 2023 → 5 Jun 2026.
- Real Pepperstone demo-feed ticks in the MT5 tester, 3 Apr 2023 – 29 Sep 2026.
- Costs: minute model 0.40 USD round trip for gold; ticks use the real bid/ask spread plus 0.07 USD/oz commission (news study).
- The null is a random market (each 1-min candle mirrored around its open with probability ½).

Verdict: **no tested mechanical intraday gold breakout survives real-tick fills.**
- Minute-data "news edges" are a fill artefact.
- The only robust fact is that **range expands** after the Shanghai Gold Exchange open, and the expansion has no direction.
- Gold trend-following since 2023 is mostly long beta.

Status: CONFIRMED as published research; not reproduced by us.

## Rules and results
| Rule / finding | Detail | Status |
|---|---|---|
| Shanghai-open breakout | Early 15-min reference candle in the quarter hour before the SGE open at 01:00 UTC. Enter on the break of its high/low, stop at the opposite side, trailed | CONFIRMED (rule description) |
| Real ticks, gold configurations | Before the Shanghai open: −0.049 R (t −1.1) with lockout / −0.028 (−0.8) without. Later candle: −0.063 / −0.045. Fixed European clock time: −0.060 / −0.036. All 18 Asia+gold configurations lose; PF 0.78–0.98 | CONFIRMED |
| Why it loses | Before the entry spread the configurations sit at −0.022 to +0.040 R. Gold spread averages 0.21 USD vs an average stop of 5.4 USD, so the spread alone costs 0.038–0.077 R | CONFIRMED |
| Gold holdout (minute chain) | −0.161 R (t −3.52); with the "tight prior range" filter −0.182 R. Gold has no day-by-day cross-check between chains | CONFIRMED |
| Range jump at the SGE open | 10-min range after 01:00 UTC is **1.77×** the 10 min before (1,930 Chinese trading days, 2015–22); 1.09× on mainland holidays (132 days, t of the difference 14.2). Volatility, not direction | CONFIRMED |
| NFP/CPI breakout (15-min candle ending at the 08:30 NY release), minute data | 2015–22: NFP/CPI +0.40 R (t 2.5, 118 trades), but the random market gives +0.47 R. Other news days −0.11 R; calm days −0.09 R | CONFIRMED |
| Real-tick fill on NFP/CPI | Market order with 100 ms latency fills **4.20 USD** beyond the level on average (median spread 2.00 USD), i.e. 0.50 R vs 0.14 R modelled. Calm days: 0.35 USD | CONFIRMED |
| MT5 real ticks (04/2023–09/2026, 687 trades) | NFP/CPI +0.27 R (t 1.1, 49 trades), median 0.00 R, −0.17 R without the 5 best days. All days −0.01 R | CONFIRMED |
| News straddle (15-min hold) | Minute data +9.92 bps (t 5.9) vs random markets +9.47 / +10.13 bps; real ticks −4.32 bps (99 trades). First-move rule: all 36 cells ≤ −3.4 bps net | CONFIRMED |
| Prop-firm constraint | Per FTMO's FAQ (as cited by Krueger, accessed 30 Sep 2026): on Funded Standard accounts, trading restricted instruments is prohibited from 2 min before to 2 min after restricted releases; gold, NFP and CPI are affected | CONFIRMED (as cited; FTMO page not opened by us) |
| London/NY reference candles, gold (old chain) | Peak late-London-morning window, gold +0.26 R (t 11.5); 11:00–13:00 Berlin hump +0.37 to +0.39; Shanghai-open cell −0.101 R (t −4.8). The second break of the same candle is −0.56 to −0.69 R. **Page note: these R values come from the older chain; "Positive R levels and comparisons in this study are therefore not proven"** | CONFLICT (the author's own retraction note) |
| Gold trend-following = long beta | GC=F daily 2005 → Sep 2026, 2 bps costs. Buy & hold beats all rules in the 3 rising phases (2023–26: B&H +24.2%/yr vs 200-DMA long-only +23.7, Donchian 55/20 L/S +10.3, 12-m momentum L/S +20.0). 2013–18: all rules −1.4 to −2.8 vs B&H −3.4. The short side lost in 9 of 12 rule×phase cells. 200-DMA long-only had a smaller drawdown in 2023–26 (−19.4% vs −24.9%) | CONFIRMED |
| Vendor claim: Channel Breakout Gold XAUUSD M30 | +6.3%/yr, max DD −13.5%, Sharpe 1.34, PF 1.48 (self-reported, net) | UNVERIFIED vendor; given Krueger's fill-bias evidence, treat as unproven until re-run on ticks |

## Backtest spec (exact defaults, 2026-10-31)
- **Purpose:** a negative-control / fill-realism harness for any XAUUSD intraday breakout in the library (ICT Silver Bullet, ORB-style gold rules, the TRAIDE gold channel). It is not a stand-alone edge.
- **Test A: SGE-open breakout (should fail).**
  - XAUUSD 1-min, reference candle 00:45–01:00 UTC.
  - OCO stop orders at its high + spread / low − spread; first break only (lockout); entry cut-off 03:00 UTC.
  - Stop at the opposite side of the candle; exit at 06:00 UTC (time stop) or a trail of 1.0× candle range.
- **Test B: NFP/CPI 15-min breakout.**
  - Reference candle 08:15–08:30 America/New_York on NFP/CPI days.
  - Market-order entry on the first tick through the level after 08:30:00, plus 100 ms latency.
  - Stop at the opposite side; exit at 16:00 NY or 2R.
  - **Fill model: bid/ask ticks only.** On 1-min data add a 4.20 USD adverse fill on NFP/CPI and 0.35 USD on other days (Krueger's measured means).
- **Test C: 200-DMA long-only vs buy & hold** on daily XAUUSD 2020–2026. Report time-in-market and the drawdown difference.
- **Costs (single default):** real spread on ticks + 0.07 USD/oz commission; on minute data 0.40 USD round trip.
- **Null:** random market (mirror 1-min candles around the open, p = 0.5, 8 seeds) and a placebo time (09:30 NY for news).
- **Sweep grid:**
  - Reference candle {5, 15} min
  - Lockout {on, off}
  - Exit {time stop 06:00 UTC, trail 0.5/1.0× range, 2R}
  - Latency {0, 100, 250} ms (news only)
  - Session {SGE 01:00 UTC, London 07:00 UTC, NY 13:30 UTC}
  - Pass only if net t ≥ 2 **and** (real − random) t ≥ 2 in a single 2025–2026 holdout.

### Pseudocode
```python
for day in days:
    ref = bars_1m(day, '00:45Z','01:00Z')            # Test A
    hi, lo = ref.high, ref.low
    for tick in ticks(day, '01:00Z','03:00Z'):
        if tick.ask >= hi:  side, entry = +1, tick.ask; break
        if tick.bid <= lo:  side, entry = -1, tick.bid; break
    else: continue
    stop = lo if side>0 else hi
    R = simulate_ticks(entry, stop, trail=1.0*(hi-lo), t_exit='06:00Z') - 0.07/abs(entry-stop)
    log(R)
# Test B on news days: replace the fill with first_tick_after('08:30:00 NY')+100ms at ask/bid
compare(real=R, random=[rerun(mirror_1m(seed=s)) for s in range(8)])
```

## Labels
style=intraday (audit/negative control); confidence=high (as independent evidence); instruments=XAUUSD CFD, GC futures; timeframe=tick/1m/15m/daily; best_backtest_markets=XAUUSD;BTC
