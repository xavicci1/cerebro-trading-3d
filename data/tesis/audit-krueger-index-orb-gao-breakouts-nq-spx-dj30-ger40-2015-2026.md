# Audit: independent 2015–2026 replication of the 5-min ORB (Zarattini-Aziz), Gao et al. intraday momentum and 25 reference-candle breakouts on NQ / SPX / DJ30 / GER40 / FTSE (KruegerAlgorithms)
**Sources (all opened 2026-10-31):**
- ORB replication paper, v1.0, 16 Sep 2026 (PDF, German): https://kruegeralgorithms.com/research/opening-range-breakout-paper-replication/Opening_Range_Breakout_Paper_Replication.pdf. English page: https://kruegeralgorithms.com/en/research/opening-range-breakout-paper-replication
- Gao-Han-Li-Zhou replication (2026-09-17): https://kruegeralgorithms.com/en/research/intraday-momentum-paper-replication
- 25 breakout combinations re-measured on a random market and on real ticks (2026-10-05): https://kruegeralgorithms.com/en/research/breakout-setups-remeasured-random-market-real-ticks
- First hour vs. last hour (context): https://kruegeralgorithms.com/en/research/first-hour-vs-last-hour
- Vendor cross-check (self-reported): TRAIDE Research, DAX opening-range breakout: https://traideapp.com/papers/opening-range-breakout-dax
- GER40 range context: https://fxbacktest.app/backtest/dax/

**Verified result:** This is an *independent replication*, not a trader record. KruegerAlgorithms is a German algo-research shop that publishes code-level methods, pre-registrations and negative results. Their data is Dukascopy CFD minute data (BID) for the cash session in local time, 05.01.2015–05.06.2026, with 2,899–2,937 sessions per market. A subset was re-run on real broker ticks (06/2023–09/2026) in the MT5 strategy tester. Fixed round-trip costs in points: NQ 2.5, SPX 0.8, Dow 4.0, DAX 2.5, FTSE 1.5 (CONFIRMED, PDF and pages). Benchmark: the "random market", where every 1-min candle is mirrored around its open with probability ½. This keeps volatility and removes direction. Their findings:
1. The paper's ORB is gross-positive, but **net ≈ 0 on NQ and negative elsewhere**.
2. The Gao first-half-hour effect in DAX and FTSE **is the overnight gap**, and the timing strategy loses net everywhere.
3. 24 of 25 of their own breakout rules are net negative once the fill-bias of their old backtest chain was fixed.

Status: CONFIRMED as published third-party research. It is not peer-reviewed and has not been reproduced by us.

## Rules and results
| Rule / finding | Detail | Status |
|---|---|---|
| ORB rule (as in SSRN 4416622) | Direction of the first 5-min candle of the cash session. Entry at the open of the 2nd candle. Stop at the opposite extreme of the 1st candle. Target 10R, otherwise exit at the session close. Costs are deducted as a share of initial risk | CONFIRMED (PDF p.1 header box). Doji skip: INFERRED (not stated in Krueger's box) |
| ORB random benchmark | "Identical bracket order with random direction, computed as the mean of the long and short run of the same day" | CONFIRMED (PDF header box, translated from German) |
| ORB gross, no costs | avg R (t), win%, 10R hit%: NQ +0.131 (2.9), 23.2%, 2.4%; SPX +0.119 (2.4), 20.1%, 3.6%; Dow +0.048 (1.1), 22.6%, 2.6%; DAX +0.116 (2.4), 20.8%, 3.7%; FTSE +0.050 (1.1), 23.2%, 2.2% | CONFIRMED (PDF table) |
| ORB net (risk ≥ 2× round-trip cost) | NQ n 2,638, gross +0.147 → **net +0.002 (t 0.0)**; SPX −0.081 (−1.6); Dow −0.081 (−1.9); DAX −0.038 (−0.8); FTSE −0.079 (−1.8) | CONFIRMED |
| ORB vs random direction | Δ (t): NQ +0.124 (2.1), SPX +0.092 (1.2), Dow +0.021 (0.4), DAX +0.128 (2.5), FTSE +0.106 (2.0). The direction carries information in NQ and DAX, but less than the costs | CONFIRMED |
| ORB by epoch, net R | NQ −0.225 / +0.057 / +0.058 (2015–17 / 2018–20 / 2021–26). DAX −0.113 / +0.014 / −0.026. Dow −0.154 / −0.016 / −0.080. SPX −0.218 / −0.152 / +0.010. FTSE −0.083 / +0.047 / −0.146. Δ vs random 2021–26: NQ +0.128 (t 1.8), DAX +0.133 (t 2.0), Dow +0.016 (0.3) | CONFIRMED |
| Cost as a share of R | Median NQ stop since 2021 is 39 points, so cost ≈ 6% of R on NQ and ≈ 12% on SPX/FTSE | CONFIRMED |
| Gao et al. predictor (r_first30 → r_last30), paper spec | Slope (t): NQ −0.003 (−0.4), SPX −0.013 (−1.7), Dow −0.008 (−1.1), DAX +0.021 (+4.2, R² 0.60%), FTSE +0.032 (+6.1, R² 1.28%) | CONFIRMED |
| Gao, gap removed | DAX +0.002 (0.1), FTSE 0.000. **The effect is the overnight gap** | CONFIRMED |
| Gao OOS 2021–26 | DAX +0.002 (0.3), FTSE +0.018 (2.5), SPX −0.025 (−2.5), Dow −0.024 (−2.6) | CONFIRMED |
| Gao timing strategy, net bp/day (t) | NQ −3.15 (−5.5), SPX −2.88 (−5.6), Dow −2.66 (−5.4), DAX −1.10 (−2.8), FTSE −1.79 (−5.2) | CONFIRMED |
| First hour vs last hour | "signs agree on 48.5 to 50.8% of days" | CONFIRMED (first-hour-vs-last-hour page) |
| 25 reference-candle breakouts (DAX/FTSE/Dow/NQ) | Stop entry at the candle high/low, stop at the opposite side, trailing stop or session end. 55,337 trades. 24/25 net negative, mean −0.078 R (SE 0.009). Advantage over random −0.114 (t −11.0). "Real information" ≈ 0.024 R vs costs ≈ 0.140 R | CONFIRMED |
| Old-chain fill bias | Three errors pushed in the same direction: (1) filled at the level when it was no longer tradable; (2) first minute after the break too favourable; (3) the trailing stop "knew the order inside a candle" | CONFIRMED |
| Lone positive: DAX "early 5-minute" reference candle | +0.161 R (t 2.10) on minutes since 2015; +0.144 R (t 1.61) in 2015–22 alone; +0.236 R (t 1.46) on real ticks 06/2023–09/2026. Krueger: "That is not proof. With 25 combinations tested, a value like this is to be expected by chance." The exact candle clock time is not stated on the page | CONFIRMED numbers; start time INFERRED (first 5-min candle after 09:00 Berlin) |
| Exit comparison | Holding to the session end beat the trailing stop in 18 of 25 combinations (none significantly positive) | CONFIRMED |
| Vendor cross-check: DAX Crabel ORB (stretch after NR4, DE40 M15, 2019–2026) | −4.3%/yr, max DD −30.2%, Sharpe −0.52, PF 0.83, 389 trades, 43% wins (self-reported, net) | CONFIRMED as published; UNVERIFIED vendor |
| GER40 range regime | Median daily range 109.3 pts (2017) vs 334.6 pts (2026). Median hourly range around the Xetra open (07:00–09:00 UTC) 71.1 pts. **Use ATR/%-based stops and costs, not fixed points** | CONFIRMED (fxbacktest.app) |

**Conflicts with the library:**
- andrew-aziz-orb-vwap.md / concretum-stocks-in-play-orb.md report strongly positive ORB results on stocks-in-play / QQQ. Krueger's index-CFD replication is net ≈ 0 on NQ. CONFLICT by instrument and cost model (stocks-in-play filter vs plain index CFD), not necessarily a contradiction.
- academic-intraday-momentum-gao-han-li-zhou.md: the effect is weak or negative OOS on US index CFDs, and gap-driven in DAX/FTSE (CONFLICT with the paper's SPY result for 2015–26 CFD data).

## Backtest spec (exact defaults, 2026-10-31)
- **Primary test: replicate the 5-min ORB net on NAS100, US500, DJ30, GER40, 1-min data 2020–2026 (ticks where available).**
  - Sessions (INFERRED from "cash session in local time"): NAS100/US500/DJ30 09:30–16:00 America/New_York; GER40 09:00–17:30 Europe/Berlin.
  - Candle 1 = 09:30–09:35 NY / 09:00–09:05 Berlin.
  - Long if close1 > open1, short if close1 < open1, skip doji.
  - Entry at the open of candle 2 (market order).
  - Stop at candle-1 low (long) / high (short).
  - TP = entry ± 10R, else flat at the session close (16:00 NY / 17:30 Berlin).
- **Cost assumption (single defaults, round trip in points):** NAS100 2.5, US500 0.8, DJ30 4.0, GER40 2.5. Skip trades where risk < 2 × round-trip cost. On ticks, use the real spread plus 0.5 pt slippage per side for stop fills.
- **Mandatory null:** run the same code on (a) random direction (seeded coin) and (b) a Krueger random market (mirror each 1-min candle around its open with p = 0.5, 5 seeds). Report Δ = rule − random and its t-stat. A rule is not an edge unless net > 0 **and** Δ > 0 with t ≥ 2 OOS.
- **Secondary (GER40 only):** the "early 5-min" breakout as a stop entry.
  - Buy stop at candle-1 high + 0.5 pt / sell stop at the low − 0.5 pt, OCO.
  - Stop at the opposite side; exit at 17:30 Berlin (hold to the session end, which beat trailing in 18/25).
  - Pre-register; a single holdout run 2025-01-01→2026-10.
- **Holdout:** search 2020-01-01→2023-12-31; holdout 2024-01-01→2026-10-31, one run.
- **Sweep grid:**
  - ORB candle {5, 15, 30} min
  - target {5R, 10R, session close only}
  - min-risk filter {1×, 2×, 3×} cost
  - entry {market at candle-2 open, stop order at the candle-1 extreme}
  - exit {session close, trailing 1R}
  - markets {NAS100, US500, DJ30, GER40}
  - That is 3×3×3×2×2×4 = 432 cells. Apply Benjamini-Hochberg at q = 0.10 across cells.
- **Gao variant (gap test):** signal = sign(r(prev close→+30 min)) vs sign(r(open→+30 min)). Hold the last 30 min (15:30–16:00 NY; 17:00–17:30 Berlin). Report both; expect the gap version to carry the effect.

### Pseudocode
```python
for day in sessions(mkt):                      # cash session, local tz
    c1 = bars_1m(day, t0, t0+5min).ohlc()
    if c1.close == c1.open: continue          # doji skip INFERRED
    side = +1 if c1.close > c1.open else -1
    entry = open_at(day, t0+5min)
    stop  = c1.low if side>0 else c1.high
    risk  = abs(entry-stop)
    if risk < 2*COST[mkt]: continue
    tp = entry + side*10*risk
    pnl_pts = simulate_path(day, entry, stop, tp, exit_time=SESSION_END[mkt],
                            stop_fill='worse_of(level, next_tick)')
    R = (pnl_pts - COST[mkt]) / risk
    log(day, side, R)
null_dir = mean_of(rerun(side=+1), rerun(side=-1))   # Krueger's random-direction benchmark
null_mkt = rerun(bars=mirror_each_1m_candle(p=0.5, seed=s) for s in range(5))
report(mean(R), t(R), mean(R)-mean(null_dir), by_year=True)
```

## Labels
style=intraday; confidence=high (as independent negative/near-zero evidence); instruments=NQ, SPX, DJ30, GER40, FTSE CFDs; timeframe=1m/5m; best_backtest_markets=NAS100;GER40;DJ30;US500
