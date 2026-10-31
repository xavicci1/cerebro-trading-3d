# ICT (Michael J. Huddleston) Silver Bullet / 2022 Model / killzones + SMC FVG, with an audit of 1:20 R:R claims (FX)

**Verified result:** UNVERIFIED. I found no audited account, broker statement, Myfxbook or official competition result for ICT. I did not open a primary source for the reported Robbins participation (only a search snippet), so it is not cited. The public 1:20 / "90% win rate" claims I checked are MARKETING. Independent mechanical tests opened this batch give near-zero gross and negative net expectancy on ES, NQ, EURUSD, GBPUSD and gold. Confidence: high (that the edge is not proven), medium (the rule mapping, because ICT's rules are discretionary).

Sources opened (2026-10-31):
- https://ripbacktest.com/posts/ict-silver-bullet-strategy-es/ (ES 5-min, Jan 2020–25 Sep 2026)
- https://ripbacktest.com/posts/order-block-fair-value-gap-strategy-eurusd/ (EURUSD 5-min, 2004–Sep 2026, 1-pip RT cost)
- https://edgelabtrading.com/blog/ict-silver-bullet-backtest/ (NQ 1-min Jun 2010–Apr 2026, IS 2010–18 / OOS 2019–26; R. Eriksson, Oct 23 2026)
- https://cemarketsolutions.com/research/ict-silver-bullet-nq (NQ 1-min 2016-09-26→2026-08-27, gross)
- https://yuratrading.com/blogs/ict-silver-bullet (2,200 setups incl. FX/gold)
- https://www.thedtterminal.com/academy/ict-building-your-model (2022-model rule write-up)
- https://takeprofit.com/posts/reverse-engineering-a-public-1-20-rr-strategy-chart-fanatics-tg-capital-51 (Oct 13 2025; 1:20 claim audit)

## Rules (public material, mechanised)
| Rule | Detail | Status |
|---|---|---|
| Windows (Silver Bullet) | 03:00–04:00, 10:00–11:00 and 14:00–15:00 New York time | CONFIRMED (ripbacktest ES, EdgeLab, CE all use these as the ICT spec) |
| Sequence | Liquidity sweep → displacement / market-structure shift (MSS) → FVG → limit entry back into the FVG | CONFIRMED (ripbacktest; DT Terminal) |
| Entry | Limit at FVG edge (ripbacktest, EdgeLab) or at the 50% "consequent encroachment" (DT Terminal 2022 model) | CONFLICT between write-ups → sweep both |
| Stop | 1 tick beyond the first candle of the FVG (ripbacktest, EdgeLab), or 2 pips beyond the sweep wick (DT Terminal) | CONFLICT → sweep both |
| Target | 2R or the opposing liquidity pool | CONFIRMED (ripbacktest); DT Terminal: pool ≥ 2R away |
| Minimum room | Liquidity ≥ 10 points away (index futures) | CONFIRMED (ripbacktest ES). An FX "≈10 pips" equivalent is INFERRED |
| 2022 model specifics | Draw on liquidity written before the session; sweep candle wicks beyond the pool and closes back inside; MSS = body close beyond the last short-term high within 6 candles, leaving an FVG; buy limit at FVG 50%, cancelled at 05:00 NY if unfilled; 1% risk; no trade within 30 min of high-impact news; max 2 trades per session | CONFIRMED as DT Terminal's write-up (secondary, not ICT himself) |
| ICT's personal record | No audited or third-party record found | UNVERIFIED |

## Independent evidence (all opened)
| Test | Sample | Result | Status |
|---|---|---|---|
| ripbacktest ES Silver Bullet | 1,737 sessions 2020–2026, $30.76 RT | AM-2R: 673 trades, 37.0% win, net −$3/trade, PF 0.99; AM-LIQ: 669, 35.7%, +$14, PF 1.04; PM-2R: 569, 37.4%, −$16, PF 0.93; PM-LIQ: 569, 33.6%, +$1, PF 1.01. Random-day control 79.2–94.2 percentile (none ≥ 95th). Verdict "Buried · No proven edge" | CONFIRMED |
| ripbacktest EURUSD SMC sweep+OB+FVG, 2R | 2004–Sep 2026, 1 pip RT | Aggressive: 13,544 trades, 32.3% win, gross −0.000R, cost 0.291R, net −0.291R, PF 0.67, lost in all 23 years, median risk 4.6 pips. Conservative: 4,945 trades, 31.9%, net −0.171R, median risk 11.4 pips. FVG-entry aggressive: −0.412R | CONFIRMED |
| EdgeLab NQ Silver Bullet 10–11 | 3,483 trades | 34.1% win at 2R. OOS 2019–26 gross +0.003R, net −0.096R (A) / −0.142R (B). OOS by target: 0.5R 63.9% / −0.104R; 1R 48.5% / −0.123R; 1.5R 39.6% / −0.111R; 2R 33.8% / −0.096R; 3R 27.1% / −0.095R | CONFIRMED |
| CE Market Solutions NQ | 2016–2026, gross | V1 true-to-spec 426 trades, 35.2%, −0.010R (CI −0.104 to +0.083); V2 tight stop 22.8%, +0.029R; V3 fixed 1:2 10.6%, +0.039R; V4 no-sweep 1,589 trades, 24.0%, −0.007R; bias filters gave no lift | CONFIRMED |
| YuRa Trading | 2,200 setups | 36.1% win, −0.24R/trade; EUR/USD −0.37R, GBP/USD −0.23R, gold −0.42R | CONFIRMED (blog test, method less documented) |

## 1:20 R:R audit (FX)
| Claim | Verdict | Status |
|---|---|---|
| TG Capital / Chart Fanatics video "STEAL This INSANE Simple 90% Win Rate Trading Strategy (1:20+ RR)" | A 90% win rate at 1:20 would be an expectancy of +17.9R/trade, which is implausible. The independent EA reverse-engineering (EURUSD M30, MT5, zero-spread Exness Zero / The5ers ticks) reports ~20% win and "profitable in Out-of sample 2023-24", but trades were AI-summarised and full stats were not published | MARKETING (90%) / UNVERIFIED (EA result) |
| ICT 1:20 "home-run" targets | No verified log | UNVERIFIED |
| Verified FX champions (contrast) | WCTC Forex 2023 winner Magala: 69% win, money ratio ≈ 2.3:1 (Myfxbook snapshot). 5× WCTC FX top-2 Nill: 50–60% win (secondary). Neither trades 1:20 | CONFIRMED (see serghey-magala-fx.md, patrick-nill-fx.md) |
| Prop-firm "verified payouts" at 1:20 | Not found on an opened page (fundingpips.com returned 429 and is not cited) | UNVERIFIED |

**Break-even win rate = 1/(1+R).** 2R → 33.3%; 3R → 25.0%; 20R → 4.76%. For a driftless random walk, the probability of reaching +20s before −s is also 1/21 = 4.76%. So without an edge, the "realistic" 1:20 hit rate is about 4.8% gross, falling below break-even once costs are added (INFERRED, math). Every test above lands within about ±0.1R of zero before costs.

**Spread sensitivity** (my computation). Stop s pips, cost c pips round trip; the risk becomes s+c and the reward 20s−c. R_eff = (20s−c)/(s+c); BE = (s+c)/(21s).

| Stop s | Cost c | Cost as % of risk | R_eff (1:20) | BE win (1:20) | R_eff (1:2) | BE win (1:2) |
|---|---|---|---|---|---|---|
| 5 | 0.5 | 10% | 18.09 | 5.24% | 1.73 | 36.67% |
| 5 | 1.0 | 20% | 16.50 | 5.71% | 1.50 | 40.00% |
| 5 | 1.5 | 30% | 15.15 | 6.19% | 1.31 | 43.33% |
| 10 | 1.0 | 10% | 18.09 | 5.24% | 1.73 | 36.67% |
| 20 | 1.0 | 5% | 19.00 | 5.00% | 1.86 | 35.00% |

Empirical check: ripbacktest EURUSD paid 0.291R mean cost at a 4.6-pip median risk. That is larger than the table's 20% at 5 pips because many stops are smaller than the median (INFERRED).

## Backtest spec (exact defaults, 2026-10-31)
- Markets: EURUSD, GBPUSD (primary FX), USDJPY, XAUUSD; NAS100/GER40 as controls. Data: 1-min bid/ask (or bid + modelled spread), 2020-01-01→2026-09-30. Tick volume is used only as an optional displacement filter (displacement bar tick volume > 1.5× the 20-bar median, INFERRED).
- Windows (America/New_York, DST-aware): W1 03:00–04:00, W2 10:00–11:00. Default = W1+W2.
- Liquidity: 5-min swing highs/lows (2 bars each side) formed from 30 min before the window up to the signal. Sweep = 1-min high > swing high (or low < swing low) then a close back inside.
- MSS: within 6 one-minute bars after the sweep, a body close beyond the most recent opposite 1-min fractal.
- FVG: a 3-bar gap in the direction of the MSS with gap ≥ 1.0 pip (XAUUSD $0.50; NAS100 1.0 pt).
- Entry: limit at the FVG edge nearest price, valid until the window ends.
- Stop: 1 pip beyond the low/high of the FVG's first candle.
- TP: 2R (default). Time exit at 12:00 NY (W2) or 05:00 NY (W1).
- Cost: 1.0 pip round trip (EURUSD), 1.5 (GBPUSD), 1.0 (USDJPY), $0.30 (XAUUSD). Risk 1%/trade; max 1 trade per window; skip ±30 min around high-impact news.
- Sweep grid: TP {1, 2, 3, 5, 10, 20}R; cost {0.5, 1.0, 1.5} pips; entry {edge, CE 50%}; stop {FVG first candle, sweep wick + 2 pips}; FVG min {0.5, 1.0, 2.0} pips; window {W1, W2, W1+W2}. Report the hit rate vs 1/(1+R_eff) for each cell, plus a random-day control (same window, random direction).

### Pseudocode
```python
for day in days:
  for (ws, we, tx) in windows:                       # NY time
    pools = swings_5m(bars_5m[ws-30min : we], left=2, right=2)
    for t in bars_1m[ws:we]:
      sw = sweep(t, pools)                          # wick beyond pool and close back inside
      if not sw: continue
      mss = first_body_close_beyond_fractal(after=t, max_bars=6, side=sw.reverse_side)
      fvg = three_bar_gap(mss.leg, min_size=1.0*pip)
      if not fvg: continue
      entry = fvg.edge; stop = fvg.first_candle_extreme - sign*1*pip
      risk = abs(entry-stop); tp = entry + sign*R*risk
      fill = limit_fill(entry, until=we)
      if fill: exit = first_hit(stop, tp, time_exit=tx); pnl_R = (exit-entry)*sign/risk - cost/risk
      break                                          # 1 trade per window
```

## Labels
style=intraday (scalp-to-intraday); confidence=low (record UNVERIFIED) / medium (mechanised rules) / high (independent tests negative after costs); instruments=FX majors, gold, index futures; timeframe=1-5m; best_backtest_markets=EURUSD;GBPUSD;USDJPY;XAUUSD;NAS100;GER40
