# Jerry Parker (Chesapeake Capital) — long-term multi-length breakout trend following

**Verified result:** CONFIRMED (manager's own monthly net-of-fee sheet): Multi-Asset Trend Program (formerly Diversified Plus; private fund May 1994–May 2024, ETF sub-advised from June 2024; returns net of all fees, highest-fee class). Yearly: 1995 14.94%, 1996 15.94, 1997 13.90, 1998 25.12, 1999 −1.52, 2000 11.63, 2001 −19.70, 2002 28.02, 2003 46.32, 2004 10.81, 2005 −6.02, 2006 18.06, 2007 −22.42, 2008 19.40, 2009 3.49, 2010 17.63, 2011 −14.08, 2012 −23.63, 2013 46.03, 2014 31.10, 2015 4.38, 2016 −7.43, 2017 9.91, 2018 −15.45, 2019 −0.67, 2020 23.20, 2021 23.76, 2022 14.01, 2023 −0.32, 2024 6.68, 2025 4.02, 2026 YTD (Jan–May) 23.72. Worst month Aug 2007 −38.80%; other large losing months May 2010 −25.03%, Sep 2011 −20.39%. My computation (not published by Chesapeake): CAGR 1995–2025 ≈ 7.5%/yr; 2015–2025 ≈ 5.0%/yr; 2020–2025 ≈ 11.5%/yr. 1994 partial-year column (27.38%) alignment is ambiguous in the PDF text extraction — not used.
CONFLICT: Opalesque reports the *flagship* program had only two negative years in 22 and lost 0.69% in 2005; the Diversified Plus/Multi-Asset sheet shows 2005 −6.02% — different programs (flagship vs higher-leverage Diversified Plus); treat figures as program-specific. Not audited by me; manager-published. Confidence: high (record exists, manager-published, long), medium (exact rules).

Sources opened:
- https://chesapeakecapital.com/wp-content/uploads/2026/07/Multi-Asset-Trend_YTD-2026.pdf (monthly/yearly net returns, disclosures)
- https://www.toptradersunplugged.com/podcast/ttu145-jerry-parker-founder-of-chesapeake-capital/ (TTU145, 2023)
- https://thehedgefundjournal.com/chesapeake-capitals-jerry-parker/ (re-opened 2026-10-31)
- https://bettersystemtrader.com/trading-triumphs-jerry-parker-3-the-dangers-of-optimization/ (Dec 22 2023)
- http://www.opalesque.com/OFI1162/Insider_Capital_had_only_two_negative162.html

| Rule | Value | Status |
|---|---|---|
| Origin | Turtle trained 1983 (Dennis/Eckhardt); breakout entries, breakout exits, ATR-based stops | CONFIRMED (BST) |
| Speed | Moved from 20-day to "100 to 200 or 300-day breakouts"; systems in increments of 50 or 25 | CONFIRMED (TTU145) |
| Why slow | "short-term trend following stopped working in the late 1990s… our average holding period has extended to an average of one year" | CONFIRMED (Hedge Fund Journal) |
| Structure | "one entry, one exit, and a stop loss" per system; several lengths run in parallel (example 50/75/100-day) | CONFIRMED (TTU145; BST) |
| Stop | Turtle 2-ATR stops "too short-term"; optimising the stop gave average loss "the same as no stops at all"; trailing stop "so far away"; "risk $1 to make $3" | CONFIRMED (TTU145) |
| Sizing | Vol-based size on entry day; fixed trading level (e.g. $1M kept for a year), risk a small % of it; cutback = reduce leverage, never skip trades | CONFIRMED (TTU145 interviewer framing + BST) |
| Over-optimisation warning | Adding profit objectives / vol reduction → 4 consecutive losing months | CONFIRMED (BST) |
| Win rate / tail | About half of trades lose; winners can run > 1 year; fat right tail | CONFIRMED (Opalesque) |
| Exit length, stop ATR multiple, risk % | Not public | INFERRED (defaults below) |

**Fit:** XAUUSD, Brent, USDJPY, BTC, NAS100, GER40 on daily bars; works only as a diversified basket (single-market results will be lumpy). 2020–2026 is a short window for a 1-year-holding system — expect few trades per market.

## Backtest spec (exact defaults, 2026-10-31)
- Data: 1-min resampled to daily bars, 00:00 UTC close for XAUUSD/USDJPY/Brent/BTC; GER40 17:30 Berlin close; NAS100 16:00 NY close. Costs: 1 spread + 0.5 spread slippage per side; financing/swap per instrument.
- Systems (equal risk, run in parallel): breakout N ∈ {100, 200, 300} days (CONFIRMED lengths). Long if close > highest close of prior N days; short if close < lowest close of prior N.
- Exit: opposite breakout of N/2 days (INFERRED-DEFAULT).
- Stop: initial 5×ATR(20) from entry, not trailed except by the N/2 exit (INFERRED; "far away" CONFIRMED).
- Sizing: units = (0.5% × fixed trading level) / (5×ATR20 × point value), fixed level reset yearly (INFERRED 0.5%).
- Time stop: none (holding ~1 yr average CONFIRMED).
- Sweep: N {50,100,150,200,250,300}; exit {N/4, N/2, N}; stop {3,5,8,none}×ATR20; risk {0.25,0.5,1}%.

### Pseudocode
```python
for mkt in markets:
  for N in (100, 200, 300):
    hi, lo = close.shift(1).rolling(N).max(), close.shift(1).rolling(N).min()
    xhi, xlo = close.shift(1).rolling(N//2).max(), close.shift(1).rolling(N//2).min()
    pos = 0
    for t in days:
      if pos == 0:
        if close[t] > hi[t]: pos, entry, stop = 1, close[t], close[t]-5*atr20[t]; size = 0.005*level/(5*atr20[t]*pv)
        elif close[t] < lo[t]: pos, entry, stop = -1, close[t], close[t]+5*atr20[t]; size = 0.005*level/(5*atr20[t]*pv)
      elif pos == 1 and (close[t] < xlo[t] or low[t] <= stop): pos = 0
      elif pos == -1 and (close[t] > xhi[t] or high[t] >= stop): pos = 0
```

## Labels
style=position; confidence=high (record) / medium (rules); instruments=diversified futures (ETF since 2024); timeframe=daily; best_backtest_markets=XAUUSD;Brent;USDJPY;BTC;NAS100;GER40
