# J Law (@jlawstock) – Stage-2 momentum breakouts/pullbacks (Minervini school)

**Verified result:** CONFIRMED: 2024 USIC $1M+ division, record +353.9% (BusinessWire https://www.businesswire.com/news/home/20250127956815/en/2024-United-States-Investing-Championship-Final-Results). He is a Minervini student. Style: swing/position.

| Rule | Detail | Status |
|---|---|---|
| Universe | Stage-2 uptrend stocks, strong RS, hot themes | CONFIRMED (thread https://threadreaderapp.com/thread/1872983307094474850.html) |
| Entry | Mix of breakout and pullback entries | CONFIRMED |
| R:R | Requires 3–5R potential; mostly targets ≥5R, aiming for a 2–3R average win/loss | CONFIRMED |
| Risk per trade | Usually ≤0.5% of the account, typically ~0.3% | CONFIRMED (TraderLion https://traderlion.com/profile/j-law/11-lessons-from-j-law/) |
| Leverage | ~200% in the contest, used only with a profit cushion, early in a clear trend, with high confidence; cut quickly | CONFIRMED |
| Selling | Choppy market and parabolic stock → sell into strength; strong market and strong RS stock → sell on weakness | CONFIRMED |
| Drawdown | Exit everything in a bad streak, cut size, re-read rules | CONFIRMED |
| Stage-2 definition | Weinstein/Minervini trend template | INFERRED |

## Backtest adaptation
Markets: XAUUSD, NAS100, GER40, USDJPY, Brent, BTC. Data: tick/1-min 2020–2026, resampled to daily where noted. Tick volume stands in for volume.
```
daily: stage2 = close>SMA50>SMA150>SMA200 and SMA200 rising 20d and close >= 0.75*52w high
entry A (breakout): close > 20d high with volume(ticks) > 1.5x avg50
entry B (pullback): low touches EMA21 in stage2, then close > prior high
stop = 1.0*ATR14 below entry; risk 0.3%; trail SMA21 close; sell 1/3 at +5R
```
**Market fit:** NAS100 and BTC are best (momentum), then XAUUSD. Stock selection can't be replicated on indices.

## Backtest spec (exact defaults, 2026-10-30)
- Daily closes: NAS100 16:00 NY, GER40 17:30 CET, XAUUSD/USDJPY/Brent 17:00 NY, BTC 00:00 UTC. Stage 2 = close>SMA50>SMA150>SMA200, SMA200 up over 20d, close ≥ 0.75×52w high. Entry A: close > 20d high with tick volume ≥ 1.5× avg50, buy at the close. Entry B: low ≤ EMA21, then close > the prior high. Stop 1.0×ATR14 below entry. Sell 1/3 at +5R (CONFIRMED ≥5R target); trail the rest with a close < EMA21. Risk 0.4% (midpoint 0.3–0.5%, INFERRED-DEFAULT). Sweep: stop {0.75,1,1.5}×ATR.
