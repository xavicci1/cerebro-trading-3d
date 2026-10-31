# Andrea Marenda – systematic + discretionary cross-asset (crypto, commodities, indices)

**Verified result:** CONFIRMED (Robbins): 2024 Q4 Forex 1st +111.2%; 2025 Futures 3rd +155.9%; 2025 Forex 5th +126.2%; 2025-26 Global Cup Forex 2nd +207.7% (his LinkedIn claims 1st: CONFLICT); 2025 Q2 Forex 3rd +56.2%, Q3 3rd +91.4%; 2026 Q1 Forex 3rd +32.6%. Style: swing (INFERRED).

| Rule | Detail | Status |
|---|---|---|
| Approach | Mix of algorithmic/quant and discretionary | CONFIRMED (Giornale di Vicenza https://www.ilgiornaledivicenza.it/argomenti/economia/economia-vicentina/andrea-merenda-campione-mondiale-di-trading-1.12557452) |
| Markets | Crypto, commodities, indices | CONFIRMED |
| Edge view | Simple logic works on explosive-volatility assets; trading means 'taking a piece of a big move' | CONFIRMED (paraphrase of the interview) |
| Risk | A predefined max-loss exit point; avoid leverage (advice to beginners) | CONFIRMED |
| Setups | Not public | INFERRED: volatility-breakout trend |

## Backtest adaptation
Markets: XAUUSD, NAS100, GER40, USDJPY, Brent, BTC. Data: tick/1-min 2020–2026, resampled to daily where noted. Tick volume stands in for volume.
```
BTC/XAUUSD/Brent daily: long if close > 20d high, short if < 20d low; stop 2*ATR20; exit on the 10d opposite channel; risk 1%
```
**Market fit:** BTC, Brent and XAUUSD (high volatility). Low confidence.

## Backtest spec (exact defaults, 2026-10-30)
- BTC close 00:00 UTC, XAU/Brent 17:00 NY. Proxy only: long above the 20d high, short below the 20d low; stop 2×ATR20; exit on the 10d opposite channel; risk 1%. Sweep: channel {20,55}.
