# Market Wizards FX: Bill Lipschutz (Hathersage) & Bruce Kovner (Caxton) — discretionary macro FX, record audit + extractable rules

**Sources opened**
- Hathersage press release, Feb 21 2008 (author's firm site): https://www.hathersage.com/hathersage/pr/080221.html
- Schwager, *The New Market Wizards* (1992), Lipschutz chapter, excerpt hosted on hathersage.com. Opened pp. "continued" sections: https://www.hathersage.com/hathersage/nmw/nmw_6.html and https://www.hathersage.com/hathersage/nmw/nmw_7.html (risk control, scaling).
- Business Insider (Sep 14 2011), quoting Bloomberg on Kovner's retirement plus *Market Wizards* (1989) excerpts: https://www.businessinsider.com/wisdom-from-kovner-2011-9
- Not opened (search snippets only, NOT cited as fact): Trader Monthly Nov 2006 PDF on hathersage.com (Salomon desk "> $300 million" a year).

**Verified result**
- **Lipschutz — PARTIALLY VERIFIED** (self-reported by the firm).
  - Hathersage "has a 16-year track record and over that period has produced an average annual return of 18.69% (net of fees)", AUM > USD 300M (as of Feb 2008).
  - Deutsche Bank FXSelect: Hathersage Long Term Currency was the top of 69 programs in 2007 at +34.33%, "+19.15%" average annual since March 2005. Figures are "gross of fees and net of interest", reported by the platform via the firm's press release.
  - No monthly series or audit seen; nothing after 2008 found.
- **Kovner — VERIFIED-press** (Bloomberg via Business Insider).
  - "Caxton Global Investment fund has returned an average of 21 percent a year since inception" (1983), vs 11% for the S&P 500 including dividends.
  - "one losing year, in 1994, when it fell 2.5 percent".
  - Retired in 2011.
  - Caxton was multi-asset macro, not FX-only.
- **Lien/Schlossberg** (requested in the batch) → see kathy-lien-currency-day-swing-book.md: UNVERIFIED.

## Rules
| Rule | Detail | Status |
|---|---|---|
| Kovner: stop before entry | "Whenever I enter a position, I have a predetermined stop… The position size on a trade is determined by the stop, and the stop is determined on a technical basis… I always put my stop behind some technical barrier." | CONFIRMED (BI excerpt) |
| Kovner: risk per trade | Novices "are taking 5 to 10 percent risks on a trade when they should be taking 1 to 2 percent risks." | CONFIRMED |
| Kovner: setup | "Tight congestions in which a breakout occurs for reasons that nobody understands are usually good risk/reward trades"; "the less observed, the better the trade" | CONFIRMED |
| Kovner: correlation | "If you have eight highly correlated positions, then you are really trading one position that is eight times as large." | CONFIRMED |
| Kovner: needs a view | "I almost always trade on a market view; I don't trade simply on technical information." | CONFIRMED → fundamental layer not replicable (UNVERIFIED for backtest) |
| Lipschutz: scale in/out | "My approach is to build to a larger size as the market is going my way… I am definitely a scale-in type of trader. I do the same thing getting out of positions." | CONFIRMED (NMW excerpt) |
| Lipschutz: low hit rate | "You have to figure out how to make money being right only 20 to 30 percent of the time." | CONFIRMED |
| Lipschutz: risk control | "Don't concentrate too much of your money on one big trade or group of highly correlated trades. Always understand the risk/reward of the trade as it now stands"; cut size in a losing streak | CONFIRMED |
| Lipschutz: liquidity | Biggest scare: misjudged liquidity on a ~$3B short-USD/DEM position in thin NY afternoon trade; waited for Tokyo liquidity | CONFIRMED (anecdote) |
| Mechanical system | Neither trader published one | INFERRED spec below |

**1:20 R:R context (computed):** at a 20–30% hit rate (Lipschutz) the breakeven reward:risk is 1/p − 1 = 4.0 (20%) to 2.33 (30%) before costs. A 1:20 target needs only 4.76% wins before costs. Neither Market Wizard claims fixed 1:20 targets; their asymmetry comes from scaling into trends, not fixed far TPs.

## Backtest spec (exact defaults, 2026-10-31) — INFERRED "Kovner congestion breakout + Lipschutz pyramid"
- Markets: EURUSD, USDJPY, GBPUSD, AUDUSD, USDCAD, EURJPY, plus XAUUSD, Brent, NAS100, GER40, BTC. Daily bars from 1-min 2020-01-01 → 2026-09-30. FX/XAU/Brent close 17:00 America/New_York; NAS100 16:00 NY; GER40 17:30 Berlin; BTC 00:00 UTC.
- Congestion filter (Kovner "tight congestion"): 20-day high−low range ≤ 30th percentile of its own 250-day history.
- Entry: buy stop at the 20-day high + 0.1×ATR20 (sell stop at the 20-day low − 0.1×ATR20). Order active while the filter was true at the prior close.
- Stop "behind technical barrier": opposite side of the 20-day congestion range ± 0.1×ATR20. Risk 1% equity per initial unit.
- Pyramid (Lipschutz): add 0.5% risk units at +1R and +2R (max 3 units); move all stops to the last add's entry − 1R.
- Exit / scale out: close 1/3 at +3R; remaining on a 20-day opposite breakout (Donchian 20) or a 60-day time stop. No fixed TP.
- Correlation cap: total open risk ≤ 4%; if 60-day |ρ| > 0.7 between two open positions, they count as one (cap combined at 1.5%).
- Losing-streak rule (Lipschutz): after 4 consecutive losses, halve risk until the next winner.
- Costs: FX 0.2–0.8 pip + $7/lot; XAU 0.25; Brent 0.03; NAS100 1 pt; GER40 1 pt; BTC 0.05%; swaps.
- Sweep grid:
  - congestion length {10, 20, 40}
  - percentile {20, 30, 50}
  - adds {0, 1, 2}
  - exit Donchian {10, 20, 55}
  - initial risk {0.5%, 1%, 2%}
- Report hit rate (expect 25–40%) and avg win/avg loss vs breakeven.

### Pseudocode
```python
for t in daily_closes:
    for m in markets:
        rng = max(H[m][t-19:t+1]) - min(L[m][t-19:t+1])
        if rng <= pct(range_hist[m][-250:], 30) and flat(m):
            oco(buy_stop=hi20+0.1*atr, sell_stop=lo20-0.1*atr,
                stop_long=lo20-0.1*atr, stop_short=hi20+0.1*atr, risk=risk_unit(m))
        if long(m):
            if C >= entry + k*R for k in (1,2) and adds<2: add(0.5*risk); trail_all_stops(last_add - R)
            if C >= entry + 3*R and not scaled: close(1/3)
            if C < min(L[m][t-19:t]) or age>60: close_all(m)
    enforce_correlation_cap(open_positions, rho=0.7, cap=0.015, total=0.04)
```

## Labels
style=swing/position (discretionary macro; mechanical proxy INFERRED); confidence=medium (records: Kovner press-verified, Lipschutz firm self-reported) / low (rules: principles only, system INFERRED); instruments=FX majors, macro futures; timeframe=daily; best_backtest_markets=USDJPY;EURUSD;GBPUSD;AUDUSD;XAUUSD;Brent
