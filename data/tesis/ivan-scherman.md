# Ivan Scherman — Diversified multi-system futures portfolio

**Verified result:**
- **Official standings (re-opened 2026-10-31):** 2023 World Cup Trading Championship (futures) 1st at 491.40%; 2nd that year was Serghey Magala at 280.50%. https://www.worldcupchampionships.com/world-cup-trading-championship-historical-standings
- **World Cup Advisor** (re-opened 2026-10-31): https://www.worldcupadvisor.com/follow-ivan-scherman/
  - "$241,360 into $1,428,728 in 10.85 months", net profit $1,187,368, drawdown −26.2% (8/31/23–10/31/23)
  - Return shown as 491.9% net
  - **CONFLICT (minor):** 491.9% (WCA) vs 491.40% (official list); the official figure is preferred.
- **NEW (CONFIRMED, WCA page):** Emerge Funds AutoTrade program from a $50,000 start: 212.0% net return, −33.5% max drawdown, over 33.86 months. "Performance includes open trade equity through October 29, 2026". This is a broker-hosted live copy record after the contest, not audited by me. Methodology listed: "Algorithmic Trading".
- Confidence: high (record, now including a ~2.8-year post-contest live record), low (rules).

## Rules
| Rule | Value | Status |
|---|---|---|
| Universe | Currency, energies, grains, indices, meats, metals, softs, treasuries | CONFIRMED (World Cup Advisor) |
| Methodology | "Algorithmic Trading" | CONFIRMED (World Cup Advisor, 2026-10-31) |
| Structure | Multiple uncorrelated systems, long & short, equal risk per asset & system, stop on every position | CONFIRMED – webinar https://www.youtube.com/watch?v=Lfnxi5WYHWs ("a stop loss in every single position… equivalent risk distribution among assets and among system") |
| Hedging swings | Trend system + counter-swing system simultaneously ("Everything moves in swings") | CONFIRMED – Forbes AU https://www.forbes.com.au/brand-voice/uncategorized/ivan-scherman-man-behind-the-money/ |
| Signal ingredients | Momentum, acceleration, MAs, std-dev / bands | CONFIRMED-secondary (search synthesis of DDE #37 interview, not verified verbatim) |
| Specific rules | Donchian/MA trend + Bollinger mean reversion, vol-based stops | INFERRED |
| Live drawdown | −33.5% on the AutoTrade program vs −26.2% in the contest | CONFIRMED (WCA); size accordingly |

## Backtest spec (exact defaults, 2026-10-31)
- Markets: XAUUSD, NAS100, GER40, USDJPY, Brent, BTC, plus EURUSD and GBPUSD. Daily bars from 1-min 2020-01-01 → 2026-09-30.
- Daily closes:
  - NAS100 16:00 America/New_York
  - GER40 17:30 Europe/Berlin
  - XAUUSD/USDJPY/Brent/FX 17:00 America/New_York
  - BTC 00:00 UTC
- Two systems, equal risk 0.5% of equity per position each (INFERRED-DEFAULT):
  - (a) Trend: Donchian 55-day breakout entry / 20-day opposite exit; stop 2×ATR20.
  - (b) Counter-swing: if close > SMA200, buy a close below the lower Bollinger(20, 2); exit at close > SMA20 or after 10 days; stop 3×ATR20. Mirror for shorts below SMA200.
- Portfolio: if the 60-day correlation between two systems' P&L in one market > 0.6, halve both.
- Costs: FX 0.2–0.5 pip + $7/lot; XAU 0.25; NAS100 1 pt; GER40 1 pt; Brent 0.03; BTC 0.05%.
- Sweep grid: BB {2, 2.5}; Donchian entry {20, 55}; trend stop {2, 3}×ATR; risk {0.25%, 0.5%}.
- Benchmark: the target max DD ≈ the WCA live −33.5%; reject parameter sets with max DD > 35% at 0.5% risk.

### Pseudocode
```python
for t in daily_closes:
    for m in markets:
        # S1 trend
        if flat(m,'S1') and C[m][t] > highest(H[m],55,t-1): enter(m,'S1',+1, stop=C-2*atr20, risk=0.005)
        if long(m,'S1') and C[m][t] < lowest(L[m],20,t-1): exit(m,'S1')
        # S2 counter-swing
        if flat(m,'S2') and C[m][t] > sma(C[m],200,t) and C[m][t] < bb_lower(C[m],20,2,t):
            enter(m,'S2',+1, stop=C-3*atr20, risk=0.005, max_days=10)
        if long(m,'S2') and C[m][t] > sma(C[m],20,t): exit(m,'S2')
        # shorts mirror; correlation halving
        if corr(pnl[m,'S1'], pnl[m,'S2'], 60) > 0.6: scale(m, 0.5)
```

## Labels
style=diversified trend + mean-reversion portfolio (swing/position); confidence=high (record incl. live AutoTrade) / low (rules); instruments=multi-asset futures; timeframe=daily/4h; best_backtest_markets=XAUUSD;NAS100;GER40;USDJPY;Brent;BTC
