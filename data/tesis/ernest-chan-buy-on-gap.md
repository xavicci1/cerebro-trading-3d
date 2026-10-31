# Ernest Chan (QTS) — buy-on-gap stocks + FSTX opening-gap futures

**Verified result:** CONFIRMED (Chan's own blog, live-traded, not audited): "buy-on-gap" S&P 500 long-only model traded live from ~start of 2007; 2007/01/03–2008/10/29: APR 19% unlevered, Sharpe 1.4, MaxDD 4%; afterwards APR −6% — he declares the strategy "died" (2008/10/29 = high-water mark). A third-party commenter (Dec 2021, unverified) reports a Russell-1000 variant backtest 2000–2020 CAGR ~29%/Sharpe 1.91 but live CAGR 6% then −6% because of 30–40 bps entry slippage at the open; Chan attributes such gaps to non-synchronous NYSE opens.
Futures version (book *Algorithmic Trading*, 2013, ch. on opening gaps): code file gapFutures_FSTX.m (third-party mirror of the book code) — entryZscore 0.1, longs if open ≥ prior high×(1+0.1σ90), shorts if open ≤ prior low×(1−0.1σ90), exit at close; in-code result comment "APR= 0.1327 Sharpe=1.44" (data file inputDataOHLCDaily_20120517).
CONFLICT (direction): the code's P&L line is `ret=positions.*(op-cl)./op`, i.e. a long position after a gap-UP earns when price FALLS — the coded P&L is a gap FADE, while the position labels are momentum. My re-run (my computation) on third-party Yahoo-style Euro Stoxx 50 *cash-index* daily data 2007-04-02→2023-10-19 (4,152 days, 495 signals) with the momentum sign (close−open): APR 17.1% / Sharpe 2.1 / MaxDD −6.0% at zero cost; 13.7% / 1.75 / −6.9% at 5 bps per side; positive every calendar year → the FADE sign loses on this data. Treat the book figure as unverified for direction; cash-index opens are NOT tradeable prices (futures trade pre-cash-open), so this re-run is likely inflated. Confidence: medium (stock record), low (futures direction).

Sources opened:
- http://epchan.blogspot.com/2012/04/life-and-death-of-strategy.html (20 Apr 2012, incl. comments)
- https://gitee.com/funggtopp/algotrading/raw/master/gapFutures_FSTX.m (third-party mirror of book code)
- https://github.com/arjunmahesh1/algo-trading-strategies-practice (opening-gap-strategy.ipynb + data/FSTX_history.csv; that notebook itself reports APR −15.15% because it uses the same (Open−Close) sign)

| Rule | Value | Status |
|---|---|---|
| Universe (stocks) | S&P 500 | CONFIRMED |
| Signal (stocks) | return from previous day's LOW to today's OPEN < −1 × 90-day std of close-to-close returns | CONFIRMED |
| Selection | buy the 100 stocks with the most negative such return at the open | CONFIRMED |
| Exit | at the same day's close; no stops | CONFIRMED |
| Side | long-only (short side "does not perform very well") | CONFIRMED |
| Costs used | 5 bps large caps / 10 bps small caps one-way | CONFIRMED |
| Intraday variant | midday price vs previous low, "equally profitable" | CONFIRMED (claim) |
| Futures gap rule | z 0.1 × σ90 vs prior high/low; exit at close | CONFIRMED (code) |
| Futures direction | momentum (positions) vs fade (P&L sign) | CONFLICT |
| Index adaptation (GER40/NAS100) | single-instrument versions below | INFERRED |

**Fit:** GER40 (09:00 Berlin cash open) and NAS100 (09:30 NY) — both have an overnight/pre-market session in CFD data, so the "gap" must be measured from the prior *cash-session* high/low to the cash open price. XAUUSD/USDJPY/BTC have no real open gap → not applicable.

## Backtest spec (exact defaults, 2026-10-31)
- Data: 1-min. GER40 cash session 09:00–17:30 Europe/Berlin; NAS100 09:30–16:00 America/New_York. σ90 = std of last 90 cash-session close-to-close returns (lagged one day).
- Gap momentum (default, my re-run direction): at first 1-min bar of the session, open O. Long if O > prevHigh_cash × (1 + 0.1σ90); short if O < prevLow_cash × (1 − 0.1σ90).
- Gap fade (book-code P&L direction, control): opposite positions, same triggers.
- Buy-on-gap (Chan stocks, single index): long only if (O − prevLow_cash)/prevLow_cash < −1.0 σ90.
- Fill: open of the 2nd minute bar (avoid untradeable first print) + 1 spread.
- Stop: none (CONFIRMED for Chan); test overlay stop 1.0×ATR14d (INFERRED).
- Exit: last 1-min bar of the cash session (GER40 17:29 Berlin, NAS100 15:59 NY).
- Sweep: z {0.05,0.1,0.25,0.5,1.0}; entry delay {1,2,5,15} min; direction {momentum, fade}; stop {none, 0.5, 1.0}×ATR14d.

### Pseudocode
```python
for day in sessions:
    O = bars[day].open.iloc[1]        # 2nd minute
    s = sig90[day]                    # lagged close-to-close std
    if   O > prevH[day]*(1+z*s): d = +1
    elif O < prevL[day]*(1-z*s): d = -1
    else: continue
    if mode == 'fade': d = -d
    ret = d*(bars[day].close.iloc[-1] - O)/O - 2*cost
```

## Labels
style=intraday; confidence=medium (stock record) / low (index futures direction); instruments=S&P 500 stocks, FSTX futures; timeframe=open→close; best_backtest_markets=GER40;NAS100
