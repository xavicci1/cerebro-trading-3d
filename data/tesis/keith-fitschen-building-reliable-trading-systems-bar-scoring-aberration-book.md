# Keith Fitschen, *Building Reliable Trading Systems* (Wiley Trading, May 2013, 304 pp., ISBN 978-1-118-52874-7): bar-scoring (Ch. 8) and the author's Aberration system (Bollinger-band trend breakout, tracked by Futures Truth since its 1993 release)
**Sources (all opened 2026-10-31):**
- Wiley product page (description, "About the Author", links to three excerpt PDFs): https://www.wiley.com/en-ie/Building+Reliable+Trading+Systems%3A+Tradable+Strategies+That+Perform+As+They+Backtest+and+Meet+Your+Risk-Reward+Goals-p-x000645380
- Wiley excerpt, Chapter 1 "What Is a Tradeable Strategy?" (book pp. 1–6): https://media.wiley.com/product_data/excerpt/43/11185287/1118528743-123.pdf
- Wiley excerpt, book index (pp. 277+): https://media.wiley.com/product_data/excerpt/43/11185287/1118528743-124.pdf
- Wiley excerpt, Contents (pp. v–vi): https://media.wiley.com/product_data/excerpt/43/11185287/1118528743-125.pdf
- George Pruitt (ex-Director of Research, Futures Truth), "A Bar Scoring System – inspired by Keith Fitschen", 28 Feb 2019. Gives the eight bar types and EasyLanguage code "from his book": https://georgepruitt.com/a-bar-scoring-system-inspired-by-keith-fitschen/
- George Pruitt, interview in TRADERS' magazine (Germany). Covers the Aberration rules as he remembers them and its 2010–2020 drawdown: https://georgepruitt.com/check-out-my-interview-in-traders-magazine-germany/
- Wisdom Financial, Aberration product page (archived broker page, © 2003-2005): https://www.wisdomfinancialinc.com/pages/aberration.html
- Traderpedia, "TS Aberration" (TradeStation code, page last edited 14 Mar 2012): https://www.traderpedia.it/wiki/index.php/TS_Aberration
- Tried, not opened: traders.com 2007 Fitschen interview (HTTP 500).

**Verified result: author record PARTIALLY VERIFIED.**
- Aberration was developed in 1986, commercially released in 1993, and "monitored by Futures Truth since it's release". Futures Truth is an independent third party that tracks systems in real time.
- How many times Futures Truth named it a "Top Ten Trading System of All Time" differs by source (CONFLICT): **three** (Wisdom Financial) vs **four** (Wiley author bio).
- Futures Truth tracks hypothetical system performance, not an audited account.
- Fitschen's **personal trading P&L is UNVERIFIED**. Wiley says only that he "has actively traded his systems for thirty years".
- **Live decay:** Pruitt says Aberration "went through a difficult phase" from 2010 to 2020, and that iconic trend systems (Aberration, CatScan, Andromeda, Super Turtle) "began to falter" from late 2014 to early 2020, with trends returning since 2020.
- **Book content:** I opened only Ch. 1, the contents and the index. The Ch. 8 rules come from Pruitt's 2019 summary, a secondary source by a credible witness. The book's own tables were not opened.

## Rules / findings
| Rule / finding | Detail | Status |
|---|---|---|
| Book structure | Ch. 8 "Bar-Scoring: A New Trading Approach" starts p. 119. Index: "bar type criterion, 122–123"; "bar-scoring example, 123t"; "Volume, standard deviations (bar-scoring), 125"; "example, bar-scoring/defined criteria, 126–131" | BOOK-STATED (contents + index excerpts) |
| Tradeable-system goal | "A goal of a tradeable system is one that averages more per year than its largest draw-down" (p. 4). Use leverage to scale max DD below your threshold (p. 4) | BOOK-STATED (quoted, Ch. 1 excerpt) |
| CTA reality check | Table 1.1: Barclay top-20 CTAs, 1 Jul 2005 – 30 Jun 2010 (from 290 reporting CTAs). Averages: 5-yr compound annual return 27.98%, largest DD 24.46%, 65.08% winning months, best 12 months 125.3%, worst 12 months −15.1%. 17 of 20 had a full year without gain (pp. 2–3) | BOOK-STATED |
| Bar-scoring criteria | Book section "Scoring by a Bar Type Criterion" (Pruitt). Three tests on each bar: close vs open; close vs prior close; close vs midpoint of the day's range. Types 1–4 have C ≥ C[1]; types 5–8 have C < C[1] | BOOK-STATED via Pruitt (secondary) |
| Eight bar types (Pruitt's code, 0-indexed; type 8 = his index 7) | 1: C≥C1, C>O, C≥mid · 2: C≥C1, C>O, C<mid · 3: C≥C1, C<O, C≥mid · 4: C≥C1, C<O, C<mid · 5: C<C1, C>O, C≥mid · 6: C<C1, C>O, C<mid · 7: C<C1, C<O, C≥mid · **8: C<C1, C<O, C≤mid** | BOOK-STATED via Pruitt (secondary; exact book wording not seen) |
| Usage | Classify each day, then measure forward returns for each type over N-day holds, long or short. Pruitt uses this to "enhance an existing entry technique" | BOOK-STATED via Pruitt |
| Finding | Pruitt's test (ES, US bonds, soybeans, 10 yrs, no costs): "the Bar Category that bubbled to the top every time" was "the most counter-trend pattern", type 8 (weak close, down day). He writes "Keith was right", which implies the book found the same. Pruitt does not say in the text whether the winning side was buy or sell; I take long (buying weakness) as the default | CONFIRMED (Pruitt test, no costs, "hypothetical results") / INFERRED (book claim and long side) |
| Aberration entry | Close > upper Bollinger band (Length, +2 SD) → buy next bar at market; close < lower band → sell short next bar at market; only when flat | CONFIRMED (Traderpedia code); not from the book |
| Aberration exit | Long exits when close < SMA(Length); short exits when close > SMA(Length), at today's close (code labels the two exits swapped in its comments) | CONFIRMED (code) |
| Aberration length | **CONFLICT:** Traderpedia code Length = **35**; Pruitt interview "period length of **80** days and two standard deviations" | CONFLICT |
| Aberration profile | Same rules and parameter on 50+ futures in 8 sectors; each market traded 3–4×/yr; in the market ~60% of the time; average winner 90 days, average loser 30 days; "single parameter based" | CONFIRMED (vendor/broker page, self-reported) |
| Paradigm Shift | A later Fitschen system that roughly reverses Aberration's rules. Per Pruitt it backtested poorly, then worked for a while, "but only temporarily" | CONFIRMED (Pruitt) |

## 1:20 R:R check
Not a 1:20 method. Aberration is a classic trend-follower: winners last ~3× longer than losers (90 vs 30 days, vendor figure), and win rate and R:R are not published here. Bar-scoring uses N-day time exits with no fixed target.

## Backtest spec (exact defaults, 2026-10-31)
- **A. Bar-scoring type 8 (primary, short-horizon mean reversion):**
  - **Markets/data:** NAS100, GER40, XAUUSD, USDJPY, Brent, BTC. Daily bars from 1-min data, 2020-01-01 → 2026-09-30 (+ 2010–2019 as an extra window).
  - **Session close definition:** NAS100 16:00 NY; GER40 17:30 Frankfurt; XAUUSD/USDJPY/Brent 17:00 NY; BTC 00:00 UTC.
  - **Signal at close t:** C < C[1] AND C < O AND C ≤ (H+L)/2.
  - **Entry:** buy at close t (Pruitt "buy this bar on close"; long side INFERRED, short tested in the sweep). Variant: next open.
  - **Exit:** close of bar t+2 (Pruitt default numDaysToHold = 2). No stop, no TP. Catastrophe stop 3×ATR(20).
  - **Costs (RT):** NAS100 2.5 pts, GER40 2.5 pts, XAUUSD 0.40 USD, USDJPY 1.6 pips, Brent 0.05 USD, BTC 0.10%. Overnight financing for CFDs as in audit-index-three-down-closes-pullback-swing-cfd-financing-krueger.md.
  - **Sweep:** bar type {1..8} × side {long, short} × hold {1, 2, 3, 4, 5} days × entry {close, next open} × market. 6 markets × 8 × 2 × 5 × 2 = 960 tests, so report BH q.
  - **Controls:** buy-and-hold of the same exposure, random entry with the same hold, random-direction market.
- **B. Aberration (secondary, daily trend):**
  - **Markets:** XAUUSD, Brent, USDJPY, NAS100, GER40, BTC (daily, continuous back-adjusted futures where possible), 2000-01-01 → 2026-09-30. Out-of-sample read 2020–2026.
  - **Entry:** close > BB(Length, +2) → buy next open; close < BB(Length, −2) → short next open; only when flat.
  - **Exit:** close crosses SMA(Length) against the position → exit at that close.
  - **Default Length = 80** (Pruitt, the developer-era witness). Sweep {35, 50, 80, 100} to resolve the CONFLICT. SD {1.5, 2.0, 2.5}.
  - **Costs:** futures 1 tick + $5/side commission; CFD as above. Sizing: 1% equity risk to the SMA exit level at entry (INFERRED).
- **Do not backtest on:** 1-min intraday (both are daily-bar methods).

### Pseudocode
```python
# A. bar-scoring type 8
for t in range(1, len(D)-HOLD):
    o,h,l,c,c1 = D.o[t], D.h[t], D.l[t], D.c[t], D.c[t-1]
    if c < c1 and c < o and c <= (h+l)/2:
        pnl = D.c[t+HOLD]/c - 1 - cost_pct - financing(t, t+HOLD)
        log(t, pnl)
# B. Aberration
pos = 0
for t in range(L, len(D)-1):
    up, dn, mid = bb(D.c, L, +2)[t], bb(D.c, L, -2)[t], sma(D.c, L)[t]
    if pos == 0 and D.c[t] > up: pos, entry = 1, D.o[t+1]
    elif pos == 0 and D.c[t] < dn: pos, entry = -1, D.o[t+1]
    elif pos == 1 and D.c[t] < mid: book(pos, entry, D.c[t]); pos = 0
    elif pos == -1 and D.c[t] > mid: book(pos, entry, D.c[t]); pos = 0
report(by_year(), split(<2020, >=2020), bh_q(), excess_vs_buyhold())
```

## Labels
style=swing (bar-scoring, 1–5 days) + position (Aberration, daily trend, ~90-day winners); confidence=medium (author record third-party tracked but hypothetical; personal P&L UNVERIFIED; book rules seen via Pruitt only; Aberration decayed 2010/2014–2020); instruments=futures/CFDs; timeframe=daily; best_backtest_markets=NAS100;GER40;XAUUSD;Brent;USDJPY;BTC
