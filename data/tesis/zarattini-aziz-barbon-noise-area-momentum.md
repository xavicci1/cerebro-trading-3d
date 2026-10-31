# Zarattini / Aziz / Barbon (Concretum) – 'Beat the Market' intraday momentum (Noise Area)

**Verified result:** Published academic backtest (not live): SPY intraday momentum 2007–early 2024, total return 1,985% net of costs, 19.6% annualized, Sharpe 1.33 — *Beat the Market: An Effective Intraday Momentum Strategy for S&P500 ETF (SPY)*, SSRN 4824172 / SFI WP 24-97 (PDF https://concretumgroup.com/wp-content/uploads/2026/02/Beat-the-Market.pdf). The paper notes the base version without vol sizing and trailing stops earned only 178% (Sharpe 0.61). Treated as a 'public CTA-style rule set' (Concretum Group). Style: intraday.

| Rule | Detail | Status |
|---|---|---|
| Noise Area | For each minute HH:MM, σ = average over the prior 14 days of |close(HH:MM)/open − 1| | CONFIRMED (PDF) |
| Bands | Upper = max(open, prev close)×(1+σ); Lower = min(open, prev close)×(1−σ) (gap-adjusted) | CONFIRMED (PDF/summary) |
| Signal checks | Only at :00/:30 (every 30 min) to limit overtrading | CONFIRMED |
| Entry | Long above Upper, short below Lower | CONFIRMED |
| Trailing stop | **CORRECTED 2026-10-31:** long stop = max(UB_t,HH:MM, VWAP); short stop = min(LB_t,HH:MM, VWAP) — the CURRENT band, not the opposite band. Stops are only triggered at HH:00/HH:30. The opposite-band stop is the weak base model (178%, Sharpe 0.61). Earlier text "opposite band or VWAP" was wrong | CONFIRMED (paper PDF, trailing-stop equations and Fig. 5 "Stop = max(VWAP,UpperBand)"; "Stop losses can also be triggered only on semi-hourly intervals") |
| Exit | Flat at the close | CONFIRMED |
| Sizing | Shares = AUM_{t-1} × min(4, 2%/σ_SPY,t) / Open_9:30, σ = 14-day stdev of daily returns | CONFIRMED (paper PDF) |
| Lookback / VM | Paper default 14 days, VM 1; Q14: 90-day lookback SR 1.50 (vs 1.35 at 14d in that table), VM ≈1.5 best SR | CONFIRMED (paper Q&A) |

## Backtest adaptation
Markets: XAUUSD, NAS100, GER40, USDJPY, Brent, BTC. Data: tick/1-min 2020–2026. Tick volume stands in for volume/delta (relative volume = tick count vs. its same-time-of-day 20-day average).
```
sigma[t] = mean_{d=1..14} |close_d(t)/open_d - 1|
UB = max(O, prevC)*(1+sigma[t]); LB = min(O, prevC)*(1-sigma[t])
every 30 min: if px>UB and px>VWAP: long; elif px<LB and px<VWAP: short
at each :00/:30 mark: long stop = max(UB, VWAP); short stop = min(LB, VWAP)   # CORRECTED 2026-10-31 (was opposite band)
flat at session close; lev = min(4, 0.02/daily_vol14)
```
**Market fit:** The best fit for this batch, because it is fully mechanical and native to 1-min data. NAS100 and GER40 are excellent (cash session). For XAUUSD, USDJPY, Brent and BTC, define a synthetic session (e.g. NY 09:30–16:00 or London 08:00–16:30); 24h BTC needs a fixed anchor. Tick volume only matters for VWAP: use tick-weighted VWAP.

## Backtest spec (exact defaults, 2026-10-30)
- NAS100 session 09:30–16:00 NY; GER40 09:00–17:30 CET; XAUUSD/USDJPY/Brent synthetic 09:30–16:00 NY (INFERRED-DEFAULT); BTC 13:30–20:00 UTC (INFERRED-DEFAULT).
- σ lookback 14 days, VM=1.0. Checks at :00 and :30 from 10:00. Long if px>UB and >VWAP, short if <LB and <VWAP. Trailing stop (CORRECTED 2026-10-31): long max(UB,VWAP), short min(LB,VWAP), checked only at the 30-min marks. Exit at the session close. No TP. Size 2% target daily vol, max 4x. Cost: 1 tick + commission.
- Sweep: VM {0.8,1.0,1.2,1.5}; lookback {10,14,20,90}; check interval {15,30,60 min}; stop {current band+VWAP, VWAP only, opposite band (base)}.

## Rotation re-check 2026-10-31 (batch 20261031-0132)
- **Fixed:** trailing stop rule (see Rules). Paper equations: Long TrailingStop = max(UB, VWAP); Short = min(LB, VWAP).
- Paper Q22 (May 2007–Dec 2024): opposite band 1x 169%, IRR 5.8%, Sharpe 0.58, MDD 21%; current band+VWAP 1x 393%, 9.5%, Sharpe 1.23, MDD 12%; current band+VWAP dynamic 2,382%, 19.9%, Sharpe 1.35, MDD 25%, 7,964 trades; VWAP-only dynamic 1,846%, 18.3%, Sharpe 1.17, MDD 27%, 6,728 trades.
- Paper Q13 (33 futures, Jan 2007–Sep 2024, same rules): only 2 negative, average Sharpe 0.60, diversified portfolio Sharpe 1.65; Nasdaq futures 1,533%, 16.8%/yr, vol 13.6%, Sharpe 1.23, MDD 26%; S&P 500 futures 2,501%, 19.8%, Sharpe 1.32, MDD 23%; Russell Sharpe 0.45, S&P 400 Sharpe 0.80. Other markets anonymized (no gold figure).
- Paper costs: commission $0.0035/share + slippage $0.001/share; Q15 with I-Star slippage model Sharpe 1.17.
- **Independent OOS (CONFLICT with paper-level performance):** Paz Serpa (SSRN 7290621, https://wato.it.com/papers/spy-intraday-momentum-oos-2026.pdf) SPY OOS May 2024–Mar 2026 +9.4% total, Sharpe 0.39, t 0.54 (in-sample 2015–Apr 2024 Sharpe 1.34). RIP Backtest (https://ripbacktest.com/posts/intraday-momentum-strategy-papers/) 2020–Sep 2026: NQ NY session passes 6/6 gates (+$231,557/contract, 1,504 trades); ES 2/6; gold net ≈ cost; BTC lost; Asia/London sessions fail everywhere. See audit-intraday-momentum-replications-nq-es-gold-btc-2020-2026.md.
- Market-fit update: NAS100 (NY 09:30–16:00) first; GER40 untested independently; XAUUSD/BTC/Brent/USDJPY expected to fail on costs.
