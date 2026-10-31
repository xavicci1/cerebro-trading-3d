# Audit: the "1:20 R:R" FX/gold claim (ICT/SMC sniper entries) checked against prop-firm payout data, a 3,308-rule SMC test incl. EURUSD/GBPUSD/USDJPY/gold, spread-toll arithmetic and an academic FX intraday-momentum thesis (2008–Oct 2024)
**Sources (all opened 2026-10-31):**
- KruegerAlgorithms, "Smart Money Concepts tested" (10 markets incl. EURUSD, GBPUSD, USDJPY, gold; Dukascopy 1m BID; search 2015–2022; holdout 2023 → 5 Jun 2026): https://kruegeralgorithms.com/en/research/smart-money-concepts-tested
- KruegerAlgorithms, "Time-of-day and calendar effects intraday" (15 markets incl. EURUSD, GBPUSD, USDJPY, gold, BTC; 6,316 variants; holdout 2023 → 5 Jun 2026): https://kruegeralgorithms.com/en/research/time-of-day-and-calendar-effects-intraday
- KruegerAlgorithms, "SMI, CAC 40, CA60 index expansion" (spread toll = spread / stop distance): https://kruegeralgorithms.com/en/research/smi-cac-ca60-index-expansion
- FundedNext, "FundedNext Payout Report – February 2026" (published 11 Mar 2026): https://fundednext.com/blog/fundednext-payout-report-feb-2026
- TradingLookup, compiled CSV of firm-published pass/payout rates (each row cites the firm page; I did **not** open the firm pages themselves): https://tradinglookup.com/data/prop-firm-published-rates.csv
- Majorin, J. (2025), "Intraday momentum in futures markets", Aalto University School of Business MSc thesis (abstract page; full PDF not opened): https://aaltodoc.aalto.fi/items/1011f043-edd1-4cb2-9694-b1216d77561f
- Library cross-reference (not re-opened today): ict-silver-bullet-smc-1to20-audit.md (named ICT/SMC claimants, ripbacktest, takeprofit 1:20), academic-fx-intraday-breedon-ranaldo.md, fx-usdjpy-tokyo-fix-gotobi-ito-yamada-krueger.md.

**Verified result:** **No verified 1:20 FX trader found. Treat 1:20 as MARKETING until a verified record shows it.**
- **Searches run:** Myfxbook "verified track record" plus 1:20; ICT/SMC 1:20 plus "payout proof". Only EA or demo accounts came back, and a "1:20" on Myfxbook pages means *leverage*, not R:R. I opened none of those pages, so none is cited.
- **What the opened data show:**
  - **(a) FundedNext's Feb 2026 paid CFD traders:** 8,340 traders were paid $15.19M. The median CFD trader had a **50.0% win rate** and a **1.49:1 R:R**, with **profit factor 1.47**, 1.5 trades/day and a median of 5 consecutive losses. Currency pairs were the top CFD asset class by volume and metals by trade count. The firm describes all of this as simulated trading. Paid traders cluster near **1.5R, not 20R**.
  - **(b) Krueger's SMC test:** ICT building blocks hit **1R in 48–52%** of trades and **2R in 27–33%** (random walk: 50% / 33%). Every ICT concept is net negative. FVG best net t 0.08, median −2.15 bps. Silver Bullet best t −1.51, median −2.27. In FX the three Silver Bullet windows show −0.50 to +0.08 bps gross, the same as the placebo hours (−0.32 to +0.23).
  - **(c) What this means:** on a driftless market the chance of hitting +kR before −1R is 1/(1+k). So 1:20 gives ≈4.76% winners gross with zero edge, and every cost pushes it negative.
- **Academic FX intraday evidence after 2018 (abstract only):** Majorin (Aalto 2025) uses 20 equity, bond and currency futures, Jan 2008–Oct 2024. Intraday momentum "still exist[s]", but "most intraday momentum and reversal trading strategies may not be feasible after transactions costs, especially in bond and currency futures".
- **Krueger time-of-day test:** its only stable FX block, EURUSD short 09:00–13:00 London (a Breedon-Ranaldo mechanism), failed the 2023–2026 holdout: net −0.30 pips, t −0.47.

## Rules / findings
| Rule / finding | Detail | Status |
|---|---|---|
| Break-even win rate, no costs | p* = 1/(1+R): 1:1 50.0%; 1.49:1 40.16%; 1:2 33.33%; 1:3 25.0%; 1:5 16.67%; 1:10 9.09%; **1:20 4.76%** | CONFIRMED (arithmetic) |
| Break-even win rate with costs | In R units, c = round-trip cost / stop distance. A win pays R−c and a loss costs 1+c, so **p* = (1+c)/(R+1)** | CONFIRMED (arithmetic) |
| 1:20 cost sensitivity, Krueger cost model | Format: stop → p*. EURUSD (1.3 pip RT): 5 pip → 6.00%, 10 → 5.38%, 20 → 5.07%, 40 → 4.92%. GBPUSD (2.0): 5 → 6.67%, 10 → 5.71%, 20 → 5.24%. USDJPY (1.6): 5 → 6.29%, 10 → 5.52%, 20 → 5.14%. XAUUSD (0.40 USD): 1 USD → 6.67%, 2 → 5.71%, 5 → 5.14%, 10 → 4.95%. NAS100 (2.5 pts): 10 → 5.95%, 20 → 5.36%. GER40 (2.5 pts): 5 → 7.14%, 10 → 5.95% | CONFIRMED (costs from the Krueger SMC page; p* computed) |
| The 1:20 trap | Small stops give the claimed 20R, but at a 5-pip EURUSD stop the spread toll is 26% of R. Break-even then needs 6.0% winners, ≈26% more than the zero-cost 4.76%, and a random walk delivers only 4.76%. Wide stops cut the toll, but the 20R target then exceeds a typical session range (e.g. a 40-pip stop needs an 800-pip target), so time exits truncate winners | CONFIRMED (arithmetic) / INFERRED (session-range comment) |
| Spread toll ranking (Krueger, indices, 0.08% stop) | DAX 4.3%, S&P 7.2%, FTSE 11.6%, CAC 14.3%, Dow 15.3%, Stoxx50 28.6%, SMI 30.9%, IBEX 31.0%, AEX 37.1% | CONFIRMED |
| Paid prop traders' real R:R | FundedNext Feb 2026 (CFD): median win 50.0%, median R:R 1.49:1, median PF 1.47, 41% of paid accounts below 50% win rate, median 28 days to first CFD payout. Futures: win 63.0%, PF 1.66 | CONFIRMED (firm self-report; simulated) |
| Pass and payout rates (firm-published, via the TradingLookup CSV) | Topstep 2025: 16.8% of Combines passed; 33.3% of funded-level participants paid; 0.71% of Express Funded traders moved to Live. Tradeify Aug 2025–Jul 2026: 17.2% passed, 28.5% paid. FX/CFD: Hola Prime 25.07% pass (15 Oct 2025–30 Sep 2026); E8 Markets 17.7% (2023–Mar 2024); FunderPro 7.35% (inception to date) | CONFIRMED as compiled; firm pages not opened |
| SMC/ICT on FX and gold | Retest + confirmation (864 variants): best net t 0.41. 472 context filters: none reach t ≥ 2. Asia-range sweep into the London open (FX, n 710): −0.47 bps (t −1.4). Only real effect: FVG fill-rate excess of FX +1.3pp (t 9.9) and gold +0.9pp (t 4.1), which is descriptive and below costs | CONFIRMED |
| Named 1:20 claimants | See ict-silver-bullet-smc-1to20-audit.md. No new claimant with verified Myfxbook, broker statements or payout proof was found in this batch | UNVERIFIED / marketing |
| Academic FX intraday, post-2018 | Majorin 2025 (Aalto): momentum persists to Oct 2024, but trading it is not feasible after costs in currency futures (abstract) | CONFIRMED (abstract only) |

## 1:20 R:R check
- **Break-even:** 4.76% before costs, 5–7% after costs for stops of 5–20 pips (table above).
- **Evidence against 1:20:**
  - Krueger's hit-rate data show target hits at random-walk frequency (2R: 27–33% vs 33% chance).
  - Paid prop traders sit at a median 1.49R.
- **Verdict:** a 1:20 claim without verified statements is **marketing**.
- **Test protocol:** the backtest below is designed to *falsify* any 1:20 rule. Compare its hit rate with the 1/(1+R) random-walk benchmark on the same stops.

## Backtest spec (exact defaults, 2026-10-31)
- **Purpose:** hit-rate test. Does any SMC entry beat the random-walk hit rate 1/(1+R) at R = 20, net of costs?
- **Markets / data:**
  - EURUSD, GBPUSD, USDJPY, XAUUSD: 1-min bid/ask (tick if available), 2020-01-01 → 2026-09-30.
  - Tick volume serves as the order-flow proxy (feature only).
- **Session (America/New_York, DST-aware):** London 03:00–06:00 and NY 08:30–11:00. Block 16:45–18:30 NY: these are rollover/BID artefacts per Krueger.
- **Entry (default, one mechanical SMC reading, INFERRED from Krueger's definitions):**
  - **Signal:**
    - The 5-min structure break is a close 0.03×ATR(14, 5m) beyond the last swing (swing = 3-bar fractal).
    - The FVG is a gap ≥ 0.02×ATR between candles 1 and 3, in the break direction.
  - **Order:** limit at the near edge of the first FVG after the break.
- **Stop:** far edge of the FVG minus a buffer of 0.1×ATR.
- **TP:** **20R**. Time exit at 16:00 NY (hard), no overnight.
- **Costs (round trip):** EURUSD 1.3 pips, GBPUSD 2.0, USDJPY 1.6, XAUUSD 0.40 USD. Stress at ×1.5 and ×2.
- **Benchmark:** for each trade, a random-entry trade at a random minute in the same session window with the same stop distance and the same R. Second benchmark: a random-direction coin flip at the same entry.
- **Metrics:**
  - Hit rate vs (1+c)/(R+1).
  - Expectancy in R, PF, max consecutive losses.
  - Share of 20R targets cut by the 16:00 time exit.
- **Sweep:**
  - R ∈ {1, 1.5, 2, 3, 5, 10, 20}; stop buffer {0, 0.1, 0.25}×ATR.
  - Session {London, NY, both}; timeframe {5m, 15m}; cost {1×, 1.5×, 2×}.
- **Controls:** mirrored placebo levels; random-direction market (each 1-min bar mirrored with p = ½); BH q across the grid. Krueger's bar for multiple testing is net t ≥ 4.
- **Do not backtest on:** BTC weekends (no session structure); Brent (no SMC claim found).

### Pseudocode
```python
for d in days:
    for sess in [("03:00","06:00"), ("08:30","11:00")]:              # NY time
        bos = structure_break(bars5m[d, sess], k_atr=0.03, swing=3)
        if not bos: continue
        fvg = first_fvg_after(bos, min_gap_atr=0.02, direction=bos.dir)
        if not fvg: continue
        entry = fvg.near_edge; stop = fvg.far_edge - bos.dir*0.1*atr14_5m
        risk = abs(entry - stop); tp = entry + bos.dir*R*risk
        fill = limit_fill(bars1m, entry, until=sess_end)
        if not fill: continue
        res = first_touch(bars1m, fill.t, stop, tp, hard_exit="16:00")   # skip 16:45-18:30 legs
        pnl_R = (res.exit - entry)*bos.dir/risk - cost[mkt]/risk
        rnd = random_entry_same_window(d, sess, risk, R)                   # benchmark
        log(pnl_R, res.hit_tp, rnd)
report(hit_rate, (1+mean(cost/risk))/(R+1), expectancy_R, pf, share_time_exit, bh_q)
```

## Labels
style=intraday (FX/gold sniper R:R claim audit); confidence=high that 1:20 is unproven (3,308-rule SMC test + firm payout data + arithmetic) / no positive edge found; instruments=EURUSD;GBPUSD;USDJPY;XAUUSD; timeframe=1m–15m; best_backtest_markets=EURUSD;USDJPY;XAUUSD;GBPUSD
