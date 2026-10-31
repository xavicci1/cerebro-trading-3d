# Meb Faber – 10-month SMA tactical allocation (RESEARCH)

**Verified result:** RESEARCH: Faber, *A Quantitative Approach to Tactical Asset Allocation* (SSRN 962461; https://mebfaber.com/wp-content/uploads/2016/05/SSRN-id962461.pdf). For the S&P 500 since 1900 the timing rule returned 10.66%/yr vs 9.75% buy-and-hold, with 15.38% vs 19.91% volatility and 49.98% vs 83.66% max drawdown (CMT version https://www.trendfollowing.com/whitepaper/CMT-Simple.pdf). Style: position.

| Rule | Detail | Status |
|---|---|---|
| Signal | Month-end total-return price > 10-month SMA → hold; else cash | CONFIRMED |
| Evaluation | Month-end only | CONFIRMED |
| Portfolio | Equal-weight 5 asset classes (US stocks, intl stocks, bonds, REITs, commodities) | CONFIRMED (paper) |

## Backtest adaptation
Markets: XAUUSD, NAS100, GER40, USDJPY, Brent, BTC. Data: tick/1-min 2020–2026, resampled to daily where noted. Tick volume stands in for volume.

## Backtest spec
- Month-end close (last daily close; NY 16:00 for NAS100, 17:00 NY FX/metals/Brent, 00:00 UTC BTC). Long if close > SMA10 of monthly closes, else flat. No stop, no TP. Equal-weight across the 6 markets, long/flat only.
- Sweep: SMA months {6,10,12}.
**Market fit:** NAS100, XAUUSD and BTC. USDJPY is ambiguous for long/flat.
