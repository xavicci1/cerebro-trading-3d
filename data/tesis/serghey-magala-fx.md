# Serghey Magala — FX swing systems ("Rialziello", "2 Corvi e 3 Soldati") + FOTSI currency-strength counter-trend

**Verified result:** CONFIRMED on the official WCTC historical standings (https://www.worldcupchampionships.com/world-cup-trading-championship-historical-standings, opened 2026-10-31):
- World Cup Championship of Forex Trading: 2023 1st +355.3%; 2024 1st +201.0%.
- Global Cup of Forex: 2023-24 1st +316.5%; 2024-25 2nd +223.2%.

Myfxbook account "2023 World Cup Championship": I opened the Wayback snapshot (https://web.archive.org/web/2025id_/https://www.myfxbook.com/members/Serghey_Magala/2023-world-cup-championship/10648475; snapshot 2025-01-03, data "Updated Jan 17, 2024 at 15:01"). The live page returned 403/captcha.
- Account: Real (EUR), ATC Brokers.
- Returns: Gain (TWR) +425.20%; Abs. gain +325.20%; Monthly 17.94%; Drawdown 31.40%.
- Trades: 124. Lost 39 of 124 (31%); longs won 43/62 (69%), shorts won 42/62 (67%).
- Average win €294.41 vs average loss −€129.62, a money ratio of ≈ 2.27 (my computation).
- Profit factor 4.95; Sharpe 0.36; Z-score −2.72; average trade length 5d; commissions −€758.39; interest −€2,304.63.

CONFLICT-to-note: Myfxbook TWR +425.2% vs official WCTC 2023 +355.3%. The likely cause is a different measurement basis or period (Myfxbook TWR to Jan 17 2024 vs the contest net % for calendar 2023, INFERRED). The Myfxbook pip stats are distorted (best trade 46,980 pips), which suggests non-FX CFDs (indices/metals) on the same account, so the account is not pure FX (INFERRED).

Marketing flag: sergheymagala.net is operated under TRADACADEMY LLC and shows course and prop-challenge promotions (https://sergheymagala.net/2023/06/04/sistemi-vincenti/). Confidence: high (record), medium (the systems are published by him but there is no proof they produced the contest record; the Traders' Magazine interview says the contest FX was a mix of manual strategies plus a couple of EAs).

Sources opened:
- https://sergheymagala.net/2020/03/14/trading-sul-forex-pt-1/ (system code)
- https://sergheymagala.net/2020/07/06/fotsi-introduzione/ ; https://sergheymagala.net/2020/07/09/fotsi-struttura-del-forex/
- https://it.tradingview.com/script/xjLnpOze/ (open-source FOTSI re-implementation by "stefanopanetta", NOT by Magala; updated 12 Nov 2022)
- https://www.traders-mag.it/intervista-di-traders-magazine-italia-a-serghey-magala/

## Rules
| Rule | Detail | Status |
|---|---|---|
| Timeframe | Systems shown on weekly charts; "also work on Daily with the same parameters" | CONFIRMED (pt-1 post) |
| Rialziello (buy-the-dip in uptrend) | Entry `close > Average[50](close) AND Close <= lowest[10](close)` → buy (text: the 100-SMA is also fine); exit `close >= Highest[5](close)` | CONFIRMED (code on pt-1 post) |
| 2 Corvi e 3 Soldati | Entry: `IF NOT LongOnMarket AND close < open and close[1] < open[1] THEN BUY` (two down bars). Exit code: `open > close and close[1] > open[1] and close[2] > open[2] THEN SELL` | CONFIRMED (code) |
| 2C3S exit conflict | Prose says exit "dopo le prime tre settimane consecutive di rialzo" (three up bars), but the code's current-bar term is `open > close` (a down bar after two up bars) | CONFLICT → test both |
| Markets in the post | Shown on US indices (upward bias), long-only | CONFIRMED; FX application INFERRED |
| FOTSI | "Forex Overview True Strength Index", created 2015; per-currency momentum in pips smoothed TSI-style; he has worked on FX since 2009 | CONFIRMED (FOTSI intro post) |
| FOTSI construction (re-implementation) | mom_USD = −EURUSD − GBPUSD + USDCHF + USDJPY − AUDUSD + USDCAD − NZDUSD, using 1-bar (close − open); then TSI double smoothing; OB +50 / OS −50, neutral ±25; trade the extreme currency vs the most opposite one, counter-trend; H1/H4/D1; exit half at EMA50, rest at EMA100; stop "not recommended" or 5×ATR; small size | CONFIRMED as the TradingView re-implementation (secondary, not Magala) |
| TSI lengths | Not visible on the opened page | INFERRED (25/15 standard TSI) |
| Risk | "Usare stoploss definito, sempre e comunque"; normal returns 50–70%/yr | CONFIRMED (Traders' Magazine interview) |
| 1:20 R:R | Not used: 69% win, ≈ 2.3:1 money ratio | CONFIRMED (Myfxbook snapshot) |

## Backtest spec (exact defaults, 2026-10-31)
- Data: 1-min bid 2020-01-01→2026-09-30, resampled. D1 close at 17:00 New York (FX, XAUUSD, Brent); GER40 17:30 Berlin; NAS100 16:00 NY; BTC 00:00 UTC. Costs: EURUSD 1.0 pip, crosses 2.0 pips round trip, plus swap.
- **A. Rialziello D1** (long-only on NAS100/GER40/XAUUSD; long and mirrored short on FX majors/crosses): long when close > SMA50 and close ≤ lowest close of the last 10 bars; exit at the close when close ≥ highest close of the last 5 bars. Protective stop 3×ATR20 (INFERRED; he says always use a stop). Risk 0.5% per trade.
- **B. FOTSI H4 counter-trend (28 pairs)**: 1-bar momentum per pair = close − open in pips. Currency momentum = signed sum over its 7 pairs. TSI(mom; 25, 15) scaled ×100 (INFERRED lengths). Signal when currency X has TSI ≥ +50 and currency Y has TSI ≤ −50: sell X/Y (or buy Y/X). Exit 50% at EMA50 touch, 50% at EMA100 touch. Stop 5×ATR14(H4). Max 3 concurrent positions; 0.25% risk each.
- Sweep grid: A: SMA {50, 100}, lookback {5, 10, 20}, exit {3, 5, 10}, stop {2, 3, none}×ATR. B: OB/OS {40, 50, 60}, TSI lengths {(25,15), (13,7)}, timeframe {H1, H4, D1}, stop {3, 5, none}×ATR.

### Pseudocode
```python
# A Rialziello (daily)
if flat and close > sma(close,50) and close <= min(close[-10:]):
    buy_at_close(); stop = close - 3*atr20
elif long and (close >= max(close[-5:]) or low <= stop): exit_at_close()

# B FOTSI (H4)
mom[c] = sum(sign(c,p) * (close[p]-open[p])/pip[p] for p in pairs_of(c))
tsi[c] = 100*ema(ema(mom[c],25),15)/ema(ema(abs(mom[c]),25),15)
hi, lo = argmax(tsi), argmin(tsi)
if tsi[hi] >= 50 and tsi[lo] <= -50: short pair(hi, lo); stop = 5*atr14
manage: close 50% at ema50 touch, rest at ema100 touch
```

## Labels
style=swing; confidence=high (record) / medium (rules); instruments=FX majors/crosses, indices; timeframe=H4/D1/W1; best_backtest_markets=EURUSD;GBPUSD;USDJPY;FX crosses;GER40;NAS100;XAUUSD
