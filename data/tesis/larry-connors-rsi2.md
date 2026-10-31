# Larry Connors – RSI(2) mean reversion (RESEARCH system)

**Verified result:** RESEARCH, published rules, not a trader track record: Connors & Alvarez, *Short Term Trading Strategies That Work* (2008). StockCharts summary: https://chartschool.stockcharts.com/table-of-contents/trading-strategies-and-models/trading-strategies/rsi-2 . Style: swing (2–5 days).

| Rule | Detail | Status |
|---|---|---|
| Trend filter | Long only above SMA200, short only below | CONFIRMED |
| Entry | Long when RSI(2) ≤ 5 (≤10 gives more signals, weaker results); short when RSI(2) ≥ 95 | CONFIRMED |
| Execution | At/just before the close | CONFIRMED (Connors prefers the close) |
| Exit | Long: close > SMA5; short: close < SMA5 | CONFIRMED |
| Stop | None ('stops hurt' in his tests) | CONFIRMED |

## Backtest adaptation
Markets: XAUUSD, NAS100, GER40, USDJPY, Brent, BTC. Data: tick/1-min 2020–2026, resampled to daily where noted. Tick volume stands in for volume.

## Backtest spec
- Bars: daily, close at 16:00 NY for NAS100; 17:00 NY roll for FX/XAU/Brent; 00:00 UTC for BTC; 17:30 CET for GER40.
- Long: close>SMA200 and RSI2<=5 → buy at close. Exit close>SMA5 at close. Short mirror at 95. No stop, no TP. INFERRED-DEFAULT disaster stop: none, plus an optional 10-day time stop.
- Sweep: RSI threshold {2,5,10}; exit SMA {5,10}; SMA filter {100,200}.
**Market fit (corrected 2026-10-31, rotation re-check):** US indices only (US500 > NAS100 ≈ US30). **GER40 = CONFLICT** (Krueger: DAX long +23.7 bps, t 1.2, no edge). XAUUSD, EURUSD, BTC and non-US indices = CONFLICT (Krueger 15-market holdout 0 of 23, see below). The old line "NAS100 and GER40 are best; XAUUSD OK" was not sourced and is withdrawn.

## Rotation re-check 2026-10-31 (batch 20261031-0200) — independent holdout
**Sources opened 2026-10-31:**
- KruegerAlgorithms, "Buying RSI(2) Dips on US Index CFDs: +48 bps per Trade in the Holdout After Costs, but Small in Risk Units" (2026-10-05): https://kruegeralgorithms.com/en/research/rsi2-dip-buying-index-cfds-holdout
- KruegerAlgorithms, RSI(2) pullbacks on 15 markets (2026-10-21; search passed, holdout 0 of 23): https://kruegeralgorithms.com/en/research/rsi2-pullbacks-15-markets-search-passed-holdout-0-of-23
- KruegerAlgorithms home page product list: https://kruegeralgorithms.com/en ("PropDip — MetaTrader 5 · EA · 99 USD — Buys short pullbacks in the S&P 500, Nasdaq 100 and Dow at the cash close, the RSI(2) rule from our holdout.") → **vendor conflict of interest: the tester sells this rule.**

**Krueger rule (slightly different from Connors' ≤5):** RSI(2) < 10, close > SMA200, buy at the close, exit at the first close above SMA5, max 20 sessions; long only. SPY/QQQ/DIA daily as stand-ins for US500/NAS100/US30; costs 2 bps round trip + swap (interest + 2.5%, triple at weekend, 70% dividend credit).

| Item | Search 2000–2018 | Holdout 2019–Oct 2026 | Status |
|---|---|---|---|
| Trades (avg hold) | 419 (3.6 sessions) | 206 (3.4) | CONFIRMED |
| Net per trade | +34.6 bps (t 3.1) | +48.3 bps (t 3.6) | CONFIRMED |
| Drift (any entry, same hold) | +1.0 | +14.7 | CONFIRMED |
| Excess over drift | +33.6 (t 3.0) | +33.6 (t 2.4); beats 98% of 1,000 random draws | CONFIRMED |
| Years positive | 13/19 | 6/8 (2020 −38, 2022 −92 bps) | CONFIRMED |
| Global correction | — | q = 0.005 across 59 holdout tests (8 Oct 2026); one of 2 of 106 rules that passed | CONFIRMED |
| R units, 3-ATR(10) emergency stop | NAS100 +0.07 (t 1.6), US30 +0.09, US500 +0.14 | NAS100 +0.13 (t 2.5), US30 +0.07, US500 +0.18 (descriptive) | CONFIRMED |
| Trades/yr per market | ~8 | ~9–10 | CONFIRMED |
| Hit rate / median / worst | — | 70% / +0.82% / −8.0% (Feb 2020); 1% quantile −4.3% | CONFIRMED |
| Stops | 3 ATR stop hit 9–12% of trades, no improvement; 2 ATR below no-stop in bps in all 3 | — | CONFIRMED (matches Connors "stops hurt") |
| Correlation | 189 holdout trades on only 124 days → the 3 indices are ONE signal | | CONFIRMED |
| Account return at 1% risk to the stop (NAS100) | ~0.6%/yr, max DD −6.3% | ~1.2%/yr, max DD −1.6% | CONFIRMED |
| Execution delay | CFD 5/10 min after close: −0.6 / −0.4 bps | | CONFIRMED |
| Short side (US) | +12.2 bps (t 0.2) → no edge | | CONFLICT with Connors short rule |
| Caveats | chosen among 3 related rules by t, missed the year criterion; bull-market holdout; IBS and 7-day-low also positive (family effect) | | CONFIRMED |

**15-market extension (Krueger 2026-10-21):** nine non-US indices + GLD + EURUSD + BTC: primary pooled search +22.35 bps (t 2.27) → holdout +6.49 (t 0.34), −5.2 bps on CFD data from 2023; FTSE −21.35 (t −0.93), CAC −10.20; 0 of 23 candidates passed (best q 0.26). DAX, Nikkei, ASX near zero even in search. Free FX daily candles produce false IBS signals. → **CONFLICT for GER40, XAUUSD, EURUSD/USDJPY-type FX, BTC.**

## Backtest spec v2 (exact defaults, 2026-10-31)
- **Markets:** US500 (primary), NAS100, US30 — treat as one portfolio signal (max 1 R total open per day across the three). Do not run on GER40/XAUUSD/USDJPY/Brent/BTC except as a pre-registered negative control.
- **Bars:** daily, cash close 16:00 America/New_York; signal and entry at the close (CFD price 16:00–16:10 NY acceptable).
- **Entry:** close > SMA200 and RSI(2) < 10 → buy at close. (Connors variant RSI(2) ≤ 5 as sweep cell.)
- **Exit:** first close > SMA5; time stop 20 sessions. Short side disabled.
- **Stop:** none (default) — optional emergency stop 3 × ATR(10) for R accounting only.
- **Costs:** 2 bps round trip + overnight swap (benchmark rate + 2.5% p.a., ×3 on weekends) — or broker points: US500 0.8, NAS100 2.5, US30 4.0 round trip.
- **Sizing:** 1% risk to the 3-ATR stop.
- **Sweep:** RSI threshold {5, 10, 15} × exit {SMA5 cross, SMA10 cross} × trend filter {SMA100, SMA200} × time stop {10, 20}. Report excess over same-hold random entries; holdout 2019–2026 already used by Krueger → use 2026-11 onward as true forward test.

### Pseudocode
```python
for t in days:
    if pos is None and close[t] > sma(close,200)[t] and rsi(close,2)[t] < 10:
        pos = Trade(entry=close[t], stop=close[t] - 3*atr(10)[t], t0=t)
    elif pos and (close[t] > sma(close,5)[t] or t - pos.t0 >= 20):
        pnl = close[t]/pos.entry - 1 - 0.0002 - swap(pos.t0, t); pos = None
```

