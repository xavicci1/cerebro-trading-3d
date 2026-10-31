# Book: Peter L. Brandt, *Diary of a Professional Commodity Trader: Lessons from 21 Weeks of Real Trading* (Wiley, 2011) — the real-time trade log (Dec 2009 – Apr 2010) as a performance audit of the Factor Trading Plan
**Companion to peter-brandt-factor.md.** That file already holds the rules: Last Day Rule, 3-Day Trailing Stop Rule, Position Unit, the 68.1% 1981–95/2007+ capsule, and the TOC. This file adds **what the book's own trade log shows**: the monthly trade counts, win rates and closed-trade vs VAMI results, the plan change made mid-diary, and the author's post-mortem.

**Sources (opened or extracted 2026-10-31):**
- Wiley Online Books, book page and TOC with page ranges: https://onlinelibrary.wiley.com/doi/book/10.1002/9781119202967
- Chapter abstracts (Wiley): Ch. 9 https://onlinelibrary.wiley.com/doi/10.1002/9781119202967.ch9 ; Ch. 10 https://onlinelibrary.wiley.com/doi/abs/10.1002/9781119202967.ch10 ; Ch. 11 https://doi.org/10.1002/9781119202967.ch11 ; Ch. 12 https://doi.org/10.1002/9781119202967.ch12 ; Ch. 13 https://doi.org/10.1002/9781119202967.ch13 ; Postscript https://doi.org/10.1002/9781119202967.oth1. **Access note:** direct fetches of these Wiley pages returned a Cloudflare challenge. Their abstract text was read through the search tool's page extracts, so these rows are marked "CONFIRMED (abstract extract)". The chapter bodies and the per-trade tables were NOT read.
- Publisher-distributed preview (TOC, introduction): https://www.schweitzer-online.de/ebook/Brandt/Diary-Professional-Commodity-Trader/9780470947241/A2082923/ and …/9780470947265/A2082907/
- Author-posted book pages 48–51 (3DTSR): https://peterlbrandt.com/wp-content/uploads/2016/03/3-Day-Trailing-Stop-Rule-3DTSR.pdf (already used in peter-brandt-factor.md)

**Author verification:**
- Long record, self-reported via VAMI: 68.1% average annual return 1981–95 and from 2007, one losing year (−4.7% in 1988), average worst month-end drawdown 15.4% (book intro, CONFIRMED quote in peter-brandt-factor.md).
- Not independently audited in what we opened, so the record status is **SELF-REPORTED (not UNVERIFIED-marketing)**: published in a Wiley book with VAMI methodology, a real-time diary, and an author's-note disclaimer.
- The diary period itself is reported as "the actual gain by the fund traded by Factor LLC" (Postscript).

## Trade-log results (book-stated)
| Period (chapter, pages) | Trades / markets | Winners–losers | Closed-trade result | VAMI (marked-to-market) | Status |
|---|---|---|---|---|---|
| Dec 2009 (Ch. 8, pp. 127–144; Trading Record p.129) | not extracted | not extracted | not extracted | not extracted | TOC CONFIRMED; numbers not read |
| Jan 2010 (Ch. 9, pp. 145–170) | 16 trades in 11 markets | 10 profitable | **+6.3%** | **+6.8%** | CONFIRMED (abstract extract) |
| Feb 2010 (Ch. 10, pp. 171–188) | 16 signals in 11 markets | 7 profit, 10 loss ("profit ratio of 43%") | **+0.9%** | **−1.23%** | CONFIRMED (abstract extract). Note 7 + 10 = 17 ≠ 16 as written in the abstract: CONFLICT inside the source, likely one carried-in trade (INFERRED) |
| Mar 2010 (Ch. 11, pp. 189–201) | 16 trades | 4 profitable (25%) | — | **−3.7%** | Search-tool synthesis of the Wiley abstract; exact abstract wording not seen: INFERRED-from-extract |
| Apr 2010 (Ch. 12, pp. 203–214) | 7 trades | 2 profit, 5 loss | — | — | Search-tool synthesis of the Wiley abstract: INFERRED-from-extract |
| Diary total (to 20 Apr 2010) | — | — | — | **+5.4% cumulative** vs a stated goal of 10–15% | CONFIRMED (Postscript extract) |
| Through 31 May 2010 (6 months from the first diary trade, 7 Dec 2009) | — | — | — | Text: "the six-month gain … stands at **9.6 percent** … the actual gain by the fund traded by Factor LLC"; "May was my best month by far in 2010"; "the profits in the past five weeks have come from two markets". Table PS.1 (flattened extract): Factor Trading Plan "7.8% \| 6.2%" under "Past Month (May 2010)" / "Past Six Months". **CONFLICT: 6.2% in the table vs 9.6% in the text** (possibly a column/ordering artefact of the extract) | CONFIRMED quotes; CONFLICT on the six-month figure |
| Benchmarks (Table PS.1 extract, May 2010 / Dec 2009–May 2010) | — | — | — | Factor goal (18%/yr) 1.5% / 9.0%; S&P 500 (9.2%) / (0.5%); BarclayHedge NewEdge CTA (1.4%) / (1.3%); Lyxor ST & LT CTA (0.2%) / (2.38%) | CONFIRMED (extract); column mapping INFERRED |

## Book-stated plan facts (beyond peter-brandt-factor.md)
| Fact | Detail | Status |
|---|---|---|
| Pattern horizon vs holding period | "I focus on weekly and daily chart patterns that form over a period of four weeks to many months … my actual trading tends to be short term, with trades lasting anywhere from a day or two (in the case of losses) to a month or two" | CONFIRMED quote (Schweitzer preview, Introduction) |
| Mid-diary plan amendment (Jan 2010) | After reviewing Q4-2009, he changed "the number of trading events entered each month", to "raise the bar on the criteria a chart pattern must meet". A **trade-frequency cap / stricter pattern filter** | CONFIRMED (Ch. 9 abstract extract) |
| 2010 "market selection" | Short GBP/USD, short S&Ps, short T-bonds, long gold, long sugar chosen for 2010 | CONFIRMED (Ch. 9 abstract extract) |
| Plan dependency on a few big winners | "Each month, the Factor Trading Plan needs a couple of profitable trades, properly leveraged, to produce the desired results" (Ch. 10). Ch. 13: signals met the plan's goals, but returns fell short "by nearly five percentage points", chiefly because the large winners ("net bottom liners") were absent | CONFIRMED (abstract extracts; Ch. 13 wording paraphrased by the extract) |
| Leverage disclosure | The Postscript's VAMI 1981–2010 is pro-forma at **one-third** of the 1981–2008 leverage ("currently trading with about one-third of the leverage") | CONFIRMED (Postscript extract) |
| Win rate profile | Diary months show 25–63% winners (Mar 4/16 to Jan 10/16). Results hinge on a few outsized trades: a positively skewed, low-hit-rate trend profile | Derived from the rows above: INFERRED |

**Takeaway for backtesting:** the trade log shows the rules' real-time behaviour. Five months of choppy markets gave a small gain (+5.4%) despite a high signal count (≈ 16/month). Profits were concentrated in a few trades (May: two markets). A backtest of the Factor rules should therefore:
- report results with and without the top 5% of trades;
- test the "fewer, higher-quality patterns" amendment explicitly.

## Backtest spec (exact defaults, 2026-10-31)
- **Universe (mapped to targets):** XAUUSD, Brent, USDJPY, US500, GER40, BTC. Daily bars 2020-01-01 → 2026-10-31 (plus weekly for pattern detection). Session: daily close at 17:00 America/New_York for FX/gold/Brent, the exchange close for indices, 00:00 UTC for BTC.
- **Signal (from peter-brandt-factor.md, unchanged):** horizontal-boundary breakout of a ≥ 20-bar (≈ 4-week) consolidation. Daily close beyond the boundary + 0.5 × ATR20.
  - Stop: Last Day Rule (breakout-day low if ≥ 50% of the bar is beyond the boundary, else the low of the last full bar inside the pattern).
  - Target: measured move (boundary ± pattern height).
  - Trail: 3-Day Trailing Stop Rule once ≥ 70% of the target distance is reached.
  - Risk: 0.6% of equity per trade.
- **New in this file, the diary amendment as a testable switch:**
  - **Frequency cap = 8 new trades per calendar month** across the universe (INFERRED number; the book states a cut in monthly trade count but no figure extracted). Rank candidates by pattern length (longer first).
  - Minimum pattern length 40 bars (≈ 8 weeks) when the cap binds.
- **Costs (single default):** round trip, in price units: XAUUSD 0.40 USD, Brent 0.05 USD, USDJPY 1.0 pip, US500 0.8 pt, GER40 2.5 pt, BTC 10 bps. Plus overnight financing at 5%/yr on notional for CFDs.
- **Holding rule:** exit at the target, the LDR stop, the 3DTSR, or a 60-trading-day time stop (from "a day or two … to a month or two").
- **Reports:**
  - Monthly trade count, win rate and closed-trade P&L vs MTM (VAMI-style).
  - Share of P&L from the top 5% of trades.
  - Comparison with the diary's 25–63% monthly win rates.
- **Sweep grid:**
  - Monthly cap {none, 12, 8, 4}
  - Minimum pattern length {20, 40, 60} bars
  - Breakout filter {0, 0.5, 1.0} × ATR20
  - Risk {0.4, 0.6, 1.0}%
  - 3DTSR activation {0, 50, 70}% of the target distance
  - Total 4×3×3×3×3 = 324; BH q = 0.10.

### Pseudocode
```python
for month in months:
    cands = [p for p in detect_rectangles(daily, min_len=MINLEN) if breakout_close(p, k=0.5*atr20)]
    cands.sort(key=lambda p: p.length, reverse=True)
    for p in cands[:CAP]:                      # diary amendment: fewer, better patterns
        stop = last_day_rule(p); target = p.boundary + p.side*p.height
        size = 0.006*equity/abs(p.entry-stop)
        open_trade(p, stop, target, trail='3DTSR@70%', time_stop=60)
report(monthly_counts, monthly_winrate, closed_vs_mtm, pnl_share_top5pct)
```

## Labels
style=position/swing (book, trade log); confidence=medium (self-reported VAMI, real-time diary; per-trade tables not read); instruments=futures/FX (gold, sugar, GBP/USD, S&P, T-bonds, crude, copper …); timeframe=daily/weekly; best_backtest_markets=XAUUSD;Brent;USDJPY;US500
