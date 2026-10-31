# Peter Brandt – Factor LLC classical chart-pattern trading

**Verified result:** Self-reported, not audited. In *Diary of a Professional Commodity Trader* (Wiley, Feb 2011, 1st ed.) Brandt states: "For the active trading years of 1981-1995 (including four years when I granted power of attorney to another trader) and again starting in 2007, my average annual rate of return for proprietary funds has been 68.1 percent (annual Value Added Monthly Index [VAMI] method). I experienced one losing year during the time I was the sole trader for my proprietary funds (-4.7 percent in 1988). The numeric average of my worst annual month-ending drawdowns has been 15.4 percent." (Introduction excerpt opened via the publisher-distributed preview at https://www.schweitzer-online.de/ebook/Brandt/Diary-Professional-Commodity-Trader/9780470947265/A2082907/). The book publishes a real-time trade log: a "Trading Record" section for each month, Dec 2009–Apr 2010 (Ch. 8–12), plus Ch. 13 "Analysis of Trading Performance" (p. 217) (TOC CONFIRMED). The record is STATED-IN-BOOK; an independent audit is UNVERIFIED. He has been a long-time futures trader since the 1970s (book intro: moved to Chicago in 1972). Style: position/swing.

| Rule | Detail | Status |
|---|---|---|
| Patterns | Classical patterns of at least 10–12 weeks; shorter ones only if they confirm the trend | CONFIRMED (https://www.peterlbrandt.com/wp-content/uploads/2016/03/The-Trading-Tactics-of-the-Factor-LLC-Proprietary-Program-2.pdf) |
| Position Unit | Entered at the close on a completed pattern; target = largest implied target; risk 50–70 bp | CONFIRMED |
| Quick Profit Unit | Intraday breakout of a horizontal boundary; risk 30–50 bp; quick profit | CONFIRMED |
| Breakout filter | Breakout by 50% ATR (patterns < 16 weeks) or 100% ATR (looser/longer) | CONFIRMED (Factor rules PDF 2021 https://www.peterlbrandt.com/wp-content/uploads/2021/10/httpswww.peterlbrandt.comwp-contentuploads202110Factor-Trading-Rules-for-Entries-and-Exits.pdf) |
| ADX/MA anticipatory | ADX turns up from < 12 with the 18-DMA rising | CONFIRMED |
| Stops | Advance quickly on a retest, then gradually | CONFIRMED qualitative |

## Backtest adaptation
Markets: XAUUSD, NAS100, GER40, USDJPY, Brent, BTC. Data: 1-min 2020–2026, resampled to daily/weekly. Tick volume stands in for volume.

## Backtest spec
- Daily closes: NAS100 16:00 NY, GER40 17:30 CET, XAUUSD/USDJPY/Brent 17:00 NY, BTC 00:00 UTC. Horizontal-range proxy: over the last 60 bars (≈12 weeks), resistance = max high; require ≥ 2 touches within 0.5×ATR20 and range height ≤ 6×ATR20 (INFERRED-DEFAULT).
- Entry (Position Unit): close > resistance + 0.5×ATR20 (CONFIRMED). Stop: the low of the last 10 bars (INFERRED-DEFAULT). TP: resistance + range height (measured-move target, CONFIRMED concept). Risk 0.6% (midpoint 50–70 bp). Move to breakeven after +1×range/2.
- Short mirror.
- Sweep: pattern length {50,60,80}; breakout {0.5,1.0}×ATR.
**Market fit:** XAUUSD, Brent, USDJPY and BTC.

## Book rules — *Diary of a Professional Commodity Trader: Lessons from 21 Weeks of Real Trading* (added 2026-10-31, batch 20261031-0018)
Edition: Wiley, February 2011, hardcover ISBN 978-0-470-52145-8, e-book 978-0-470-94726-5, 304 pages (Wiley product page https://www.wiley.com/en-us/Diary+of+a+Professional+Commodity+Trader%3A+Lessons+from+21+Weeks+of+Real+Trading-p-9780470521458).

Legal previews opened:
- Publisher excerpt PDFs: Chapter 1, Contents and Index. https://media.wiley.com/product_data/excerpt/57/04705214/0470521457-71.pdf ; -72.pdf (Index) ; -73.pdf (Contents).
- Book pages 48–51, posted by the author: https://peterlbrandt.com/wp-content/uploads/2016/03/3-Day-Trailing-Stop-Rule-3DTSR.pdf. Page images read visually; there is no text layer.

Page references below are for the 2011 edition and come only from those previews. The Index gives page locations; the rule *content* comes from the pp. 48–51 scan or Brandt's own Q&A.

| Rule | Detail | Source / page | Status |
|---|---|---|---|
| Charts only | Relies "solely on high/low/close bar charts in daily, weekly, and monthly form"; uses ADX "to a very limited degree" | Ch. 1, p. 20 | STATED-IN-BOOK (CONFIRMED) |
| Pattern horizon | Weekly/daily patterns forming over "four weeks to many months"; trades last "a day or two (in the case of losses) to a month or two" | Introduction (preview) | STATED-IN-BOOK (CONFIRMED) |
| Last Day Rule (initial stop) | Index: pp. 42–44. Content (Brandt Q&A, Nov 2016, same PDF): stop = low of the breakout day if at least half of that bar is below the boundary; otherwise the low of the last full day inside the pattern | Index p. 42–44; Q&A | CONFIRMED (content from the author's Q&A, not the book page itself) |
| Last Hour Rule; Retest Failure Rule | Index: Last Hour Rule p. 44; Retest Failure Rule p. 46. Content not in the previews | Index | UNVERIFIED content |
| Targets | Swing objectives (a market tends to advance/decline in legs of roughly equal distance); periodic use of point & figure counts; "There is no guarantee that any market will reach its target" | p. 48 | STATED-IN-BOOK (CONFIRMED) |
| Pyramiding | Continuation patterns inside a major trend allow advancing the stop to the new pattern's Last Day Rule and/or pyramiding | p. 48 | STATED-IN-BOOK (CONFIRMED) |
| Old exit | "There was a time in my trading when I never moved my stops away from the Last Day Rule. A market would either reach its target or stop me out" | p. 49 | STATED-IN-BOOK (CONFIRMED) |
| Risk example | Risk of $800 per $100,000 (0.8%) with a $3,200 target, i.e. reward:risk 4:1 | pp. 49–50 | STATED-IN-BOOK (CONFIRMED) |
| Trailing Stop Rule (3-day) | Three days of price action: the high day, the setup day and the trigger day. Setup day = a close below the low of the high day (long). Trigger = penetration of the setup-day low. Example DJIA: high day Aug 28, setup Aug 31, exit on Sep 1 | p. 50 (Fig. 3.23–3.24) | STATED-IN-BOOK (CONFIRMED) |
| Weekend Rule (Donchian) | A market that decisively moves into new high/low ground on a Friday is likely to continue on Monday/early Tuesday. Most significant when a pattern breakout (especially weekly) happens on a Friday: "In such cases, I may extend my risk from six-tenths to eight-tenths of 1 percent to a full 1 or 2 percent" | p. 51 | STATED-IN-BOOK (CONFIRMED) |
| Normal risk per trade | 0.6–0.8% (from the Weekend Rule sentence) | p. 51 | STATED-IN-BOOK (CONFIRMED) |
| Post-book changes | Wide-bodied breakout bars: use an intraday reaction low/high instead of the bar extreme. Move stops faster via the Retest Failure Rule, aiming for "a break-even trade within a week after trade entry" (Q&A May 2016). Often uses the breakout-day open as a tighter stop (Q&A Nov 2016) | 3DTSR PDF Q&A | CONFIRMED (author) |
| 2023 tranche management | Trading tranche: LDR stop → breakeven ASAP, nearest target, 3DTSR immediately. Position tranche: stop at the last full day inside the pattern, advanced to the LDR; 3DTSR only if it would lock in a loss; exit at the farthest target or on an 8-DMA turn plus a full bar beyond the 8-DMA. "Rules can be applied to daily or weekly bars" | https://www.peterlbrandt.com/wp-content/uploads/2023/12/Managing-the-Factor-Position-Unit.pdf | CONFIRMED (author) |
| 1:20 R:R | Not his model: book example 4:1; the Index lists "Commodity/forex traders: favoring 30 percent right approach over 70 percent right approach" | Index | CONFIRMED (Index term only); page content not previewed |

### Backtest spec — Diary variant (exact defaults, 2026-10-31)
- Markets: XAUUSD, USDJPY, EURUSD, GBPUSD, AUDUSD, Brent, BTC (FX first). Daily bars from 1-min data (FX/XAU/Brent close 17:00 New York; BTC 00:00 UTC). Data 2020-01-01→2026-09-30.
- Pattern proxy: horizontal range over the last 40 daily bars (≈ 8 weeks; book horizon "four weeks to many months"); ≥ 2 touches within 0.5×ATR20; height ≤ 6×ATR20 (INFERRED).
- Entry: daily close beyond the boundary (Factor 2021 filter: + 0.5×ATR20 for patterns < 16 weeks).
- Initial stop (Last Day Rule): breakout-day low if ≥ 50% of the bar is inside/below the boundary, else the low of the last full bar inside the pattern (mirror for shorts).
- Target: measured move = boundary + pattern height (4:1 reference). Exit at the target OR on the 3-day Trailing Stop Rule once price has covered ≥ 70% of the distance to the target (CONFIRMED from the 2023 CAD example); move the stop to breakeven after 5 trading days if in profit (INFERRED from "break-even within a week").
- Risk: 0.7% per trade (midpoint of 0.6–0.8%); 1.5% if the breakout bar is a Friday weekly breakout (Weekend Rule, INFERRED midpoint of 1–2%).
- Sweep grid: lookback {20, 40, 60, 80} bars; breakout filter {0, 0.5, 1.0}×ATR20; 3DTSR activation {0%, 50%, 70%} of the target distance; Weekend-rule risk {0.7, 1.0, 1.5, 2.0}%; tranche split {100/0, 50/50}.

```python
if flat and close > res + 0.5*atr20 and pattern_ok:
    buy_at_close(); stop = low if (res - low) >= 0.5*(high - low) else last_full_bar_inside.low
    target = res + (res - sup); risk = 0.015 if is_friday and weekly_breakout else 0.007
if long:
    if price_progress(target) >= 0.7: arm_3dtsr = True
    if arm_3dtsr: hd = highest_high_day_since_arm; setup = first close < low[hd]; exit if low < low[setup]
    if bars_in_trade >= 5 and close > entry: stop = max(stop, entry)
    exit at target or stop
```

## Labels
style=position/swing; confidence=medium (record self-reported in book, not audited) / high (rules from book pages + author PDFs); instruments=futures, FX, crypto; timeframe=daily/weekly; best_backtest_markets=XAUUSD;USDJPY;EURUSD;GBPUSD;AUDUSD;Brent;BTC
