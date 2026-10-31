# Jack Kellogg — Penny/small-cap day trading: VWAP, volume, panic dip buys
**Verified result:** Self-reported ~$10.5–11M in ~4 years (Business Insider https://www.businessinsider.com/stock-trader-made-millions-shares-swing-trading-momentum-strategy-2024-5); no independent audit found. Confidence: low-med.
| Rule | Value | Status |
|---|---|---|
| Indicators | VWAP, linear regression channel, volume, S/R | CONFIRMED – https://www.benzinga.com/news/23/05/32630450/24-year-old-stock-trader-reveals-the-4-key-indicators-behind-his-impressive-8m-earnings-in-two-years |
| VWAP rule | No long if price far above VWAP; no short below VWAP | CONFIRMED (Benzinga paraphrase) |
| Setups | OTC breakout, gapper (buy close, sell next-day gap), panic dip buy | CONFIRMED-secondary – https://myinvestingclub.com/how-25-year-old-trader-jack-kellogg-made-11041674-trading-penny-stocks-and-plans-to-retire-by-30/ |
| Priority | Volume > structure > dilution > catalyst | CONFIRMED-secondary |
| Management | Starter, add on confirmation, stop to BE | CONFIRMED-secondary |
| Session (2022) | First hour only | CONFIRMED (Business Insider) ; 2024 shifted to swing |
```
panic dip buy (1m): price falls >= 3*ATR14_1m below VWAP within 15 min of HOD, tickvol spike >4*median, then bar closes up -> buy
stop = panic low; TP = 50% retrace to VWAP / HOD; add 2nd unit if first 1m bar after entry closes > entry; stop->BE
```
**Fit:** BTC, NAS100, XAUUSD (flush days); weak on USDJPY/Brent.

## Backtest spec (exact defaults, 2026-10-30)
- 1-min bars, NAS100 09:30–10:30 NY; BTC 13:30–14:30 UTC. Long only above VWAP (CONFIRMED). Entry: break of the first-15-min high with 1-min tick volume ≥ 3× avg20 and price ≤ VWAP + 0.5×ATR14d ('not extended', INFERRED-DEFAULT). Stop: VWAP. Breakeven at +1R; TP 2R; flat at the window end. Sweep: TP {1.5,2,3}R.
