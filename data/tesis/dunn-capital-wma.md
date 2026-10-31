# Dunn Capital — World Monetary and Agriculture (WMA) program: long-term systematic trend following with adaptive risk

**Sources opened**
- Dunn Capital programs page: https://dunncapital.com/programs/
- Fundpeak CTA database, DUNN WMA program page (fetched 2026-10-31): https://ctadatabase.fundpeak.com/Program.aspx?id=890
- Not opened (search snippet only): AutumnGold CTA profile https://www.autumngold.com/capital_trading/capital_cta_profile.php?id=393 — snippet: annualised ROR 12.23%, AUM ~$931M.

**Verified result:** VERIFIED (CTA monthly record reported to databases). Self-reported by the CTA to the database, not independently audited by me.
- Fundpeak statistics (as displayed 2026-10-31):
  - Cumulative 12,173.41%; annualised 12.24%
  - Annualised std dev 31.21%; Sharpe 0.52; Sortino 0.63
  - Max monthly drawdown −60.26% (start 03/2003, length 54 months, recovery 36 months, end 08/2010)
  - Worst month −30.68%; best month +31.63%
  - Winning months 54%; correlation vs S&P 500 −0.10
- Fundpeak calendar years: 2026 YTD (Jan–Aug) +15.97%, 2025 +7.66%, 2024 +7.83%, 2023 −17.86%, 2022 +60.23%, 2021 +4.11%.
- Fundpeak drawdown report also lists −49.76% (03/1985), −44.26% (10/1999), −35.08% (07/1994), −31.21% (04/2024, ended 08/2026).
- Fundpeak fund info: inception Jan 1985 (Fundpeak's listed date), 0% management fee, 25% performance fee, min investment USD 10M.
- **CONFLICT (minor):** a search-snippet citation (paragon report, not opened) dated the big drawdown Feb 2003–Aug 2007. That is consistent with Fundpeak as peak-to-trough (54 months from 03/2003 ≈ 2007) with recovery in 08/2010, so not a real contradiction. Exact peak month differs (Feb vs Mar 2003).
- **Interpretation:** a 40-year record with a 12% CAGR but a −60% drawdown and 31% volatility. It shows the edge is real but brutal to hold.

## Rules
| Rule | Detail | Status |
|---|---|---|
| Style | Medium-to-long-term trend following, 100% systematic, no discretionary override | CONFIRMED (dunncapital.com/programs) |
| Universe | ~65 global futures/FX markets | CONFIRMED (same) |
| Sizing | Adaptive Risk Profile (ARP): position risk set by "trend confidence, volatility and inter-market correlations"; total risk varies daily and is high only when signals agree and correlations are favourable | CONFIRMED (same, paraphrased) |
| Risk level | Monthly 99% VaR range 8–22% (avg ~15%), ≈23% annualised target vol; WMAI = half leverage (~11.5%) | CONFIRMED (same) |
| Signal formula | Proprietary; not disclosed | UNVERIFIED |
| Replication signal | Multi-speed breakout/MA trend with vol targeting and signal-agreement scaling | INFERRED |

## Backtest spec (exact defaults, 2026-10-31)
- Markets: XAUUSD, NAS100, GER40, USDJPY, Brent, BTC, EURUSD, GBPUSD, AUDUSD, USDCAD, EURJPY. Daily bars built from 1-min 2020-01-01 → 2026-09-30.
- Daily closes:
  - FX/XAU/Brent 17:00 America/New_York
  - NAS100 16:00 America/New_York
  - GER40 17:30 Europe/Berlin
  - BTC 00:00 UTC
- Signal (INFERRED): s_k = sign(close − SMA(n_k)) for n ∈ {50, 100, 200}. Trend confidence c = |Σ s_k| / 3 ∈ {1/3, 1}; direction = sign(Σ s_k).
- Sizing (INFERRED ARP proxy):
  - Target vol per market σ* = 23% / √N_eff × c, where N_eff = 1/ Σ(w_i w_j ρ_ij) computed from 60-day correlations.
  - Position = σ* / σ_60d(market).
  - Scale the whole book so ex-ante portfolio vol ≤ 23% (half-run 11.5% = WMAI proxy).
- Entry/exit: rebalance at the daily close when direction flips or the target size changes by > 25%. No TP. Catastrophe stop at 4×ATR20 from entry (optional; off in the base run, since Dunn states no override).
- Costs: 1 spread per change. FX 0.3–0.8 pip; XAU 0.25; NAS100 1.0 pt; GER40 1.0 pt; Brent 0.03; BTC 0.05%. Plus swap/carry at broker rates.
- Sweep grid:
  - SMA sets {(20,50,100), (50,100,200), (100,200,300)}
  - vol lookback {20, 60, 120}
  - target vol {11.5%, 23%}
  - rebalance threshold {10%, 25%, 50%}
  - correlation scaling on/off
- Benchmarks: compare to the Fundpeak WMA monthly series 2020-01 → 2026-08 (correlation of monthly returns).

### Pseudocode
```python
for t in daily_closes:
    for m in markets:
        s = [sign(C[m,t] - sma(C[m],n,t)) for n in (50,100,200)]
        conf = abs(sum(s))/3; dirn = sign(sum(s))
        vol = stdev(ret[m], 60, t)*sqrt(252)
        raw[m] = dirn * conf * TARGET/ vol
    corr = corrmat(ret, 60, t)
    w = raw / sqrt(raw @ corr_cov(vol, corr) @ raw) * TARGET   # cap book vol at 23%
    for m in markets:
        if abs(w[m]-pos[m]) > 0.25*abs(pos[m]) or sign(w[m])!=sign(pos[m]):
            trade(m, w[m]-pos[m], cost=spread(m))
report(cagr, vol, maxdd, sharpe, corr_to_dunn_monthly)
```

## Labels
style=position (long-term trend following, systematic); confidence=high (record, CTA database) / low (rules proprietary, replication INFERRED); instruments=global futures/FX (65 markets); timeframe=daily; best_backtest_markets=XAUUSD;USDJPY;Brent;NAS100;GER40;BTC;FX majors
