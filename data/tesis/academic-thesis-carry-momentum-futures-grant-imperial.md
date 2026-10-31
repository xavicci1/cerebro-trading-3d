# Carry + Momentum Parametric Futures Portfolio (PhD thesis)

**Status: CONFIRMED** (OOS in thesis; carry & TSMOM independently replicated by Koijen et al. 2018 / Moskowitz-Ooi-Pedersen 2012) · Style: position · Applies to: XAUUSD, Brent, NAS100, GER40, USDJPY (as members of a diversified futures basket)

- **Author:** James Grant — PhD thesis, Imperial College Business School, Imperial College London
- **Repository (opened, full PDF read 2026-10-30):** https://spiral.imperial.ac.uk/server/api/core/bitstreams/4b99f119-f163-4671-b1c2-435323c19ccb/content · DOI https://doi.org/10.25560/32011
- **Data:** up to 55 futures (commodities, bonds, equity indices, currencies), 12 contracts at start, 55 by March 2004; monthly, 1981–2012

## Reported results (from PDF abstract/chapters)
- Carry and momentum combined: Sharpe ≈ 1.4 (in-sample, full period).
- Momentum Sharpe fell from 1.6 (Mar 1982–Mar 1992) in later subperiods; higher in recessions.
- **Out-of-sample (Ch. 2):** Brandt–Santa-Clara–Valkanov parametric portfolio policy, estimated 1981–1991 in-sample, then re-estimated each month on past data only and applied 1992–2012 → **Sharpe 1.2; CE gain 15% p.a. vs risk-free; +8% CE vs dynamic long-only futures portfolio**; robust to transaction costs. Optimal OOS momentum coefficient ≈ 1.5× carry.
- **Negative OOS (Ch. 3):** 19 commodities, in-sample 1990–2000 Sharpe 2.1, but **2000–2013 OOS: no characteristic (carry, momentum, hedging pressure, BDI, open interest, output gap) beats an equal-weight long-only commodity portfolio.** → do not trade carry/momentum on Brent/gold alone; use the cross-asset basket.

## Genuine OOS?
Yes — expanding-window, monthly re-estimated policy with no look-ahead (1992–2012), plus a separate negative commodity-only OOS.

## Exact rules (thesis)
- Momentum signal = past 12-month cumulative return; carry signal = 12-month average of the futures basis (annualized roll yield).
- Weight_i,t = w_bench + θ_mom·z(mom_i,t) + θ_carry·z(carry_i,t) (cross-sectionally standardized); θ chosen to maximize CRRA utility of past returns; rebalance monthly.

## Backtest spec (defaults)
- Universe (CFD proxies): XAUUSD, XAGUSD, Brent, WTI, NatGas, NAS100, SPX500, GER40, JPN225, USDJPY, EURUSD, GBPUSD, AUDUSD, Bund, UST10.
- Monthly rebalance last trading day 16:00 America/New_York; signals: 12m return and 12m avg roll yield (for CFDs use swap/financing differential as carry proxy).
- Position = vol-scaled (target 10% annual per asset, 60d realized vol), sign/size from θ-weighted z-scores; θ fit on expanding window, first fit 10 years.
- Costs: 1× spread + swap. Mandatory split: commodities-only vs full basket; post-2012 holdout.

### Pseudocode
```python
z = lambda x: (x - x.mean())/x.std()
score = th_mom*z(ret_12m) + th_carry*z(carry_12m)
w = score / vol_60d ; w *= target_vol / port_vol(w)
```

## Labels
CONFIRMED = documented in thesis with explicit OOS, and factors replicated independently. CFD mapping/vol scaling is my adaptation.
