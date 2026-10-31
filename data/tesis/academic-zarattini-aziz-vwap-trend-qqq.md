# Zarattini & Aziz – VWAP trend ("The Holy Grail for Day Trading Systems") on QQQ/TQQQ, plus independent replications

Paper: C. Zarattini & A. Aziz, *Volume Weighted Average Price (VWAP): The Holy Grail for Day Trading Systems*, SSRN 4631351. Opened PDF: https://concretumgroup.com/wp-content/uploads/2026/02/Volume-Weighted-Average-Price.pdf
Independent replications opened: Telonics Trading research note (Sep 2026) https://telonicstrading.com/research-vwap.html ; QuantConnect/LEAN reproduction https://www.quantconnect.com/terminal/cache/embedded_backtest_b115d0894231d55994b1068202f6c0ae.html

**Verified result:** Paper backtest only (not live), 2 Jan 2018 – 28 Sep 2023, $25k start, 100% equity, no leverage, commission $0.0005/share, **zero slippage** ("Since we initiated our system with a small account of only $25,000, we assumed no slippage"): QQQ +671% total, 43%/yr, vol 18%, Sharpe 2.1, MDD 9.4%, alpha 38%; TQQQ +8,242%, 116%/yr, vol 54%, Sharpe 1.7, MDD 36.1% (QQQ buy-and-hold: +126%, Sharpe 0.7, MDD 35.6%).
**Independent checks:** (1) Telonics reproduced it at zero slippage (May 2018–Sep 2023: Sharpe 1.91, QQQ +458%, TQQQ +4,643%, MDD 9.9%) but with **one tick (1¢) of slippage** Sharpe fell to 0.10, QQQ +1%, TQQQ −99%; ~15 reversals/day, edge ≈2.5¢/share; a passive limit at VWAP loses even at zero cost (QQQ −46%); post-publication Oct 2023–Sep 2026: Sharpe 0.63 at zero slippage, +28% vs buy-and-hold +100%; with one tick +2% (TQQQ −82%); 5-min bars do not fix it. (2) QuantConnect LEAN reproduction (2× leverage, next-bar-open fills, zero slippage) shows 2018-01-02→2023-09-28: net +592.9%, CAR 40.1%, Sharpe 1.754, MDD 9.1%, 24,387 orders, win rate 17%; its notes state OOS (Sep 2023 onward, frozen parameters) Sharpe decays "toward ~0.7" and "break-even sits below ~1 bp round-trip".
**Verdict:** In-sample effect is real (replicates across engines) but the net edge is smaller than one tick of slippage on QQQ. NOT tradable as published at retail cost. Style: intraday.

## Rules
| Rule | Detail | Status |
|---|---|---|
| Session VWAP | Anchored at 09:30 ET each day, typical price (H+L+C)/3 × volume, regular-hours bars only | CONFIRMED (paper PDF; LEAN code) |
| First signal | At 09:31 ET (after the first 1-min bar) take the side of price vs VWAP | CONFIRMED (paper) |
| Long / short | Long when 1-min close > VWAP; short when 1-min close < VWAP | CONFIRMED |
| Reversal | Stop-and-reverse on every 1-min close across VWAP (always in the market) | CONFIRMED |
| Exit | Flat at 16:00 ET (LEAN: 1 minute before close) | CONFIRMED |
| Sizing | 100% of equity, no leverage (paper); LEAN replication used 2× buying power | CONFIRMED / CONFLICT (replication setting differs) |
| Costs | $0.0005/share, zero slippage, zero spread | CONFIRMED (paper §3.4 per LEAN notes) |
| Fill price | Paper: signal bar close; LEAN: next bar open | CONFLICT (implementation choice; materially changes results) |
| Net viability | One tick slippage destroys edge (Telonics); break-even <~1 bp (LEAN notes) | CONFIRMED by two independent sources |
| Hysteresis band to reduce churn | Not in paper | INFERRED (our addition for the sweep) |

## Backtest spec (exact defaults, 2026-10-31)
- Markets: NAS100 first (paper instrument proxy), then GER40, XAUUSD, USDJPY, Brent, BTC. Data: 1-min 2020–2026; volume = tick volume (tick-weighted VWAP).
- Session/timezone: NAS100 09:30–16:00 America/New_York; GER40 09:00–17:30 Europe/Berlin; XAUUSD/USDJPY/Brent synthetic 09:30–16:00 New York (INFERRED-DEFAULT); BTC 13:30–20:00 UTC (INFERRED-DEFAULT).
- Entry: first decision on the close of the first 1-min bar; position = sign(close − VWAP); fill at the NEXT bar open (conservative default).
- Stop/TP: none; reverse on each cross; flat at session close (last bar open).
- Size: 1.0× notional (no leverage). Costs: default **1 tick + commission per side**; also report 0-cost run to reproduce paper.
- Sweep grid: hysteresis band h ∈ {0, 0.02%, 0.05%, 0.10%} of price; bar size {1, 5 min}; cost per side {0, 0.5, 1, 2 ticks}; session start delay {1, 5, 15 min}.
- Pass test: net Sharpe > 0.5 at 1 tick/side AND positive 2024–2026 (post-publication) AND trades/day reported. Break-even cost per side must be printed.

### Pseudocode
```python
for day in sessions:
    cum_pv = cum_v = 0; pos = 0
    for i, bar in enumerate(day.bars_1m):
        tp = (bar.h + bar.l + bar.c) / 3
        cum_pv += tp * bar.tickvol; cum_v += bar.tickvol
        vwap = cum_pv / cum_v
        if pending is not None:            # fill at this bar's open
            trade(to=pending, px=bar.o, cost=COST_TICKS); pos = pending; pending = None
        if bar.t >= day.close - 1min:      # flatten
            trade(to=0, px=bar.c, cost=COST_TICKS); break
        if bar.c > vwap * (1 + H) and pos <= 0: pending = +1
        elif bar.c < vwap * (1 - H) and pos >= 0: pending = -1
```

## Labels
style=intraday; confidence=low (net of costs); instruments=QQQ/TQQQ (paper); timeframe=1m; best_backtest_markets=NAS100;GER40
