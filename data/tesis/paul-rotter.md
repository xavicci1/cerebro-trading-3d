# Paul Rotter ("The Flipper") — Eurex Bund order-book scalping
**Verified result:** No audited figures. Self-reported (Traders Magazine interview, translated on varchev, re-opened 2026-10-31): usually 150,000 round turns/day, up to 250,000 (page intro says 200–300,000); no losing month in his first 3 years; one 2.5 million loss day after which he took 4 weeks off; biggest positions "5 digit number of contracts"; uses a daily max-loss cut-off. Confidence: low (record), medium (concept), **not backtestable faithfully**.
| Rule | Value | Status |
|---|---|---|
| Instruments | Bund, Bobl, Schatz (Eurex) | CONFIRMED-secondary – https://www.varchev.com/en/paul-rotter-aka-the-eurex-flipper/ |
| Method | Quote bids/offers near last price, read Level-2, decide in 3–5 ticks, use fills to gauge demand | CONFIRMED-secondary (varchev, https://www.mql5.com/en/blogs/post/10367) |
| "Flipping" | Large displayed bid, cancel, flip to sell | **CONFLICT (2026-10-31): the varchev interview does NOT describe this**; he describes quoting both sides near last price as "some kind of market making" and admits trying to run stops. The flip description rests only on the trade2win thread (https://www.trade2win.com/threads/300000-r-ts-a-day-the-rotter-interview.14326/, not re-opened) → INFERRED/unverified. Note: today that behaviour would be spoofing — ILLEGAL, do not replicate |
| Holding / risk | Positions held seconds to hours as fills change; on volatile days fewer resting orders and more single trades held seconds; daily P&L goal plus max-loss stop; scales up in winning phases, down in losing ones; no formal money-management rules | CONFIRMED-secondary (varchev interview) |
| Later | Moved to longer-term trades | CONFIRMED-secondary (mql5) |
```
# legitimate proxy only: L1 imbalance mean-reversion — requires bid/ask sizes; tick-volume CFD data cannot do this
skip / or: 1-min, if |tickvol z|>3 and bar reverses >60% -> fade 3 ticks, stop 3 ticks
```
**Fit:** none of the six faithfully (needs DOM). USDJPY/GER40 crude proxy only. Include for completeness.

## Backtest spec (exact defaults, 2026-10-30)
- Needs DOM/order-book data; not testable on tick-volume CFD data. No spec.
