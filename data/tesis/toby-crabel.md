# Toby Crabel — Opening Range Breakout with NR7 / stretch
**Verified result:** Crabel Capital Management (institutional CTA, long track record; returns not public here). Confidence: med (record), high (rules — published book 1990).
| Rule | Value | Status |
|---|---|---|
| Source | Day Trading with Short Term Price Patterns and Opening Range Breakout | CONFIRMED – https://www.buysidedigest.com/wp-content/uploads/2024/08/Day-trading-with-short-term-price-patterns-Tony-crabel.pdf |
| Setup | NR7 (narrowest range of 7 days), NR4/ID-NR4 | CONFIRMED – https://oxfordstrat.com/trading-strategies/nr7/ |
| Stretch | avg over 10 days of min(O−L, H−O); ×2 (secondary implementations) | CONFIRMED-secondary (oxfordstrat) |
| Entry | Buy stop Open+Stretch / Sell stop Open−Stretch; first trigger; earlier triggers better (ideally within ~10 min) | CONFIRMED-secondary |
| Stop | Opposite stop level | CONFIRMED-secondary |
| Exit | Close of day | INFERRED (book uses close-of-day evaluation) |
```
daily: stretch = mean(min(O-L,H-O),10); setup = range[1]==min(range,7)
day t (if setup): long stop O+stretch, short stop O-stretch (OCO); stop = opposite level; exit session close
optional: only first 60 min triggers
```
**Fit:** all six; strongest NAS100, GER40, Brent, XAUUSD. Define session open per market (BTC 00:00 UTC). Highest backtest readiness.

## Backtest spec (exact defaults, 2026-10-30)
- Setup: yesterday is NR7 (smallest H−L of 7 days). Stretch = mean over 10 days of min(H−O, O−L), multiplier 1.0 (Crabel's stretch; INFERRED-DEFAULT; oxfordstrat uses 2.0 in a sweep).
- Times: NAS100 open 09:30 NY, entries valid until 10:30 NY; GER40 09:00–10:00 CET; FX/XAU/Brent 08:00–09:00 London (UTC+0/+1); BTC 00:00–01:00 UTC.
- Entry: buy stop open+stretch, sell stop open−stretch, first trigger only. Stop: opposite stop level. Exit: session close (16:00 NY/17:30 CET/17:00 NY/23:59 UTC). No TP.
- Sweep: mult {0.5,1.0,2.0}; entry deadline {30,60,120 min}; NR {4,7}.

## Rotation re-check 2026-10-31 (CONFLICT)
- **Oxford Capital Strategies, NR7 test (opened 2026-10-31):** https://oxfordstrat.com/trading-strategies/nr7/
  - Setup: today's range narrower than each of the previous six days' ranges. ORB stop orders at open ± stretch.
  - Data: 42 US futures, 1980-01-01 → 2016-01-31, $50 round turn.
  - Summary (iii): "Once the cost of trading is applied (Figure 2), the pattern is not currently tradeable without some additional rules."
  - Also (i) NR_Length ≥ 6 is better and (ii) longer holding periods are preferred.
  - **CONFLICT** with the "edge as published" reading of Crabel.
- **KruegerAlgorithms, "Swing patterns on daily and weekly bars after CFD financing" (opened 2026-10-31):** https://kruegeralgorithms.com/en/research/swing-patterns-daily-weekly-after-cfd-financing
  - NR7 and inside bar were in the pre-registered candle family on 8 indices + GLD (daily search to 2018, holdout 2019 → 2 Oct 2026). No NR7/inside-bar rule became a holdout candidate.
  - 4h inside-bar/breakout patterns on CFD minute data (500 variants, 2015–2022): one t ≥ 3 at chance level.
  - Note: daily NR7 with a *next-day close* hold, not Crabel's intraday ORB exit. **CONFLICT (partial)**.
- **George Pruitt interview (TRADERS' magazine Germany, opened 2026-10-31):** https://georgepruitt.com/check-out-my-interview-in-traders-magazine-germany/
  - "With the disappearance of the pits, the opening range was diluted. That said, I believe it still works for stocks and stock indices."
  - Pruitt is a credible practitioner witness, but this is opinion with no numbers.
- **Library cross-check:** audit-krueger-index-orb (vendor DAX Crabel ORB −4.3%/yr, PF 0.83) is consistent with the above.
- **Link status:** the buysidedigest PDF link cited in index.csv now returns an HTML page (HTTP 200, text/html), not the PDF. Treat it as unavailable. The book (Traders Press 1990) is out of print.
- **Spec change:** none to the rules. Add stretch multiplier 2.0 (oxfordstrat) to the default reporting set, hold {session close, 1-day, N-day close}, cost stress ×1.5/×2, and require the post-2018 split to be reported separately. Expect a negative net result on GER40 per the vendor cross-check.
- **Status after re-check:** Crabel's track record (Crabel Capital) is institutional and not public here. The NR7/ORB edge net of costs is **CONFLICT / not confirmed** by two independent sources.
