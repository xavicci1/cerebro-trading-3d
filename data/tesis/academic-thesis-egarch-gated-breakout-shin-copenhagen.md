# EGARCH Volatility-Gated Intraday Breakout on NQ / ES / CL (Master's thesis)

**Status: INFERRED** (genuine pre-OOS + walk-forward in thesis; no independent replication; recent 2026 master's thesis) · Style: intraday · Applies to: NAS100, Brent (CL proxy), (GER40 as untested transfer)

- **Author:** Woosub Shin — M.Sc. Economics thesis, University of Copenhagen (advisor Jacob Lundbeck Serup), June 2026
- **Repository (opened, full PDF read 2026-10-30):** https://curis.ku.dk/ws/files/553867958/Volatility_Gated_Momentum_An_EGARCH_Filtered_Intraday_Trading_Framework_for_Equity_Index_and_Energy_Futures.pdf
- **Data:** 5-minute NQ, ES, CL futures; parameters selected 2010–2018, evaluation 2019–2025

## Reported results (from PDF)
- **Pre-out-of-sample spec** (all parameters chosen on 2010–2018, zero exposure to 2019–2025): **Sharpe 1.195**, 3.36× on $200k. Development spec 1.412 (upper bound; tuned on eval window), max DD 10.6%.
- Without EGARCH gate: Sharpe 1.195 → 0.382 (dev 1.412 → 0.664), max DD ~3×; circular block bootstrap p = 0.004. Gate shifted 1 day → 0.884; random-gate placebo mean 0.561 (p = 0.002, 500 sims).
- **Walk-forward (Table 22):** annual re-fit of breakout window & ATR stop on rolling 24m, 2012–2025 → Sharpe **0.939** (2012–18: 0.376; 2019–25: 1.283), one negative year (2025 −4.6%). Fixed champion params: **−0.01 Sharpe in 2012–2018** → strong regime dependence.
- CL standalone weaker (Sharpe 0.479 long-only; short-only 0.122). Costs: round-turn NQ $14.51, ES $29.51, CL $12.80.
- Caveat: author discloses AI coding assistance; many parameters (6 entry conditions) → overfit risk despite tests.

## Genuine OOS?
Yes — pre-OOS parameter freeze (2010–18 → 2019–25) and rolling walk-forward 2012–2025.

## Exact rules (thesis)
Long only, enter on a 5-min bar when ALL hold:
1. Daily EGARCH(1,1) conditional vol yesterday > its 10-day MA (expansion gate).
2. Vol score (percentile rank of today's cond. vol) > 0.05.
3. Close > rolling high of prior L bars (L=60 NQ/ES, 30 CL).
4. RSI(14) > 58.  5. EMA(15)>EMA(40) NQ/ES; EMA(20)>EMA(50) CL.
6. ≥5 bars since last exit; session 09:30–14:00 ET (NQ/ES), 09:30–13:00 ET (CL).
Exit: trailing stop C_entry − m·ATR(14) (m=2.2 NQ/ES, 2.5 CL), RSI < 52, or 72 bars max. Size via inverse EGARCH vol targeting; CL capped 0/40/80% in low/med/high vol regime.

## Backtest spec (defaults)
- NAS100 CFD and Brent CFD (CL params), 5-min bars, times America/New_York; GER40 transfer test with session 09:00–13:30 Europe/Berlin.
- Fit EGARCH daily on expanding window; params frozen through 2018, test 2019→present; then rolling 24m walk-forward grid {45,60,75}×{1.8,2.2,2.6}.
- Costs: CFD spread + 1 tick slippage each side.

### Pseudocode
```python
gate = egarch_vol.shift(1) > egarch_vol.shift(1).rolling(10).mean()
entry = gate & (vscore>0.05) & (close>high.shift(1).rolling(L).max()) & (rsi>58) & (ema_f>ema_s) & in_session & cooldown_ok
stop = max(stop, close - m*atr)  # exit if close<stop or rsi<52 or bars>=72
```

## Labels
INFERRED = documented in thesis with OOS, but not independently replicated; CFD/GER40 mapping is my adaptation.
