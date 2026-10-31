# GER40 auction effects: Xetra closing-auction overnight reversal (Bender, Clapham & Schwemmlein, Goethe Univ. 2023) + DAX expiry-hour short before the Eurex settlement auction (Krueger)

**Sources (all opened 2026-10-31):**
- Bender, Clapham & Schwemmlein, "Shifting Volumes to the Close: Consequences for Price Discovery and Market Quality". Goethe University Frankfurt; EFMA 2023 full paper. BMLL millisecond data, CAC 40 / DAX 30 / FTSE 100 stocks, Jan 2018–Dec 2021 (DAX from Feb 2019), 131 stocks: https://www.efmaefm.org/0EFMAMEETINGS/EFMA%20ANNUAL%20MEETINGS/2023-UK/papers/EFMA%202023_stage-4455_question-Full%20Paper_id-228.pdf
- KruegerAlgorithms, "Time-of-day and calendar effects intraday". Dukascopy CFD BID minute bars; search 2015–2022; 6,316 variants; the calendar results have no holdout: https://kruegeralgorithms.com/en/research/time-of-day-and-calendar-effects-intraday
- Eurex DAX Futures (FDAX) contract specification: https://www.eurex.com/ex-en/markets/idx/dax/DAX-Futures-139902
- Xetra auction schedule: https://www.eurexgroup.com/xetra-en/trading/trading-models/auctionschedule
- Strasmore, "DAX options settlement price": https://www.strasmore.com/blog/dax-options-settlement-price
- Seen only as a search snippet, NOT opened, so its numbers are not used: Joensuu (Aalto 2010), "Expiration day effects of the EURO STOXX 50 index futures and options", https://aaltodoc.aalto.fi/handle/123456789/429 (snippet: returns higher before the 12:00 CET settlement, reversed afterwards). Also Schlag (1996, EFM), https://onlinelibrary.wiley.com/doi/10.1111/j.1468-036X.1996.tb00029.x (title only).

**Verified result:**
- (A) The closing-auction reversal is CONFIRMED in-sample for 2019–2020 at stock level, post-2018 data, peer-reviewed conference paper. It is NOT significant in 2018 or 2021, and not on MSCI or derivatives-expiry days, so it is a decaying, regime-dependent effect (CONFLICT).
- (B) The DAX expiry-hour short is a search result only (n 96, t 2.5, no holdout, selected from 6,316 variants), so it is INFERRED and weak. It also conflicts in sign with the older EURO STOXX 50 expiry literature (snippet only).

## Rules / findings
| Rule/finding | Detail | Status |
|---|---|---|
| Auction times (paper) | Opening auction ends 8:00 GMT (9:00 CET) with a random end of up to 30 s. Xetra/LSE midday auction 12:00–12:02 GMT. Closing auction 16:30–16:35 GMT (17:30–17:35 CET) with a random end | CONFIRMED (paper) |
| Closing-auction share | 33.46% of daily volume on average. DAX stocks 27–35%, CAC 33–43%, FTSE 23% → ~45% (2018–2021). Highest on MSCI rebalancing and quarterly expiry days | CONFIRMED (paper) |
| Reversal regression (Table 4) | Overnight return (close→open) on the closing-auction return (last continuous midpoint → auction price). β full sample −0.23*** (0.07). FTSE −0.21***. CAC −0.20**. **DAX −0.36** (0.18)**; DAX at 08:05 −0.38**, at 08:40 −0.34 (n.s.) | CONFIRMED (paper) |
| Reversal speed | Full-sample reversal eliminated within 40 min of the next open. Half-spread adjusted: 17%, gone after 10 min for DAX and CAC, 15 min for FTSE | CONFIRMED (paper) |
| By year (Table 6, full sample) | 2018 −0.10 (n.s.). **2019 −0.36***. 2020 −0.27***. **2021 −0.07 (n.s.)**. DAX: 2019 −0.37***, 2020 −0.50*, **2021 −0.01** | CONFIRMED (paper) → CONFLICT for live use (decay in 2021) |
| COVID (Feb–May 2020) | Full sample −0.76**, DAX −1.36** (reversal larger than 100%) | CONFIRMED (paper) |
| Expiry / MSCI days | No significant reversal: full −0.32 (0.31), DAX −1.08 (0.80), despite closing-auction shares of about 46–54% | CONFIRMED (paper) |
| Index-level transfer | The paper is stock-level, not an index trade. Using the GER40 or DAX index auction return as the signal is my adaptation | INFERRED |
| FDAX settlement | Final settlement day is the third Friday of Mar/Jun/Sep/Dec. Trading in the expiring contract ceases at the start of the Xetra intraday auction at 13:00 CET. The final settlement price comes from the Xetra intraday-auction prices of the DAX stocks. Daily settlement = VWAP of the minute before 17:30 CET | CONFIRMED (Eurex) |
| Xetra on settlement days | The DAX-stock intraday auction lasts 5 minutes instead of 2, with a random end | CONFIRMED (Xetra) |
| ODAX | Monthly and weekly ODAX settle in the 13:00 CET intraday auction. Daily options (ODAP, launched 13 Nov 2023) settle in the 17:30 closing auction | CONFIRMED (Strasmore) |
| DAX expiry-hour short | Short DAX in the hour before the Eurex settlement: net +8.7 points (t 2.5, n 96). No reversal in the hour after (t −0.3). Search 2015–2022; calendar results have no holdout; groups with n<40 unreliable; 41 of 1,120 gross windows have \|t\|>3 vs 1 on random markets | CONFIRMED that Krueger reports it; edge INFERRED/weak |
| n=96 meaning | 8 years × 12 = 96, so it is monthly third Fridays 2015–2022 at 12:00→13:00 CET | INFERRED |
| Sign conflict | The older EURO STOXX 50 study (2000–2009, snippet only) reports *higher* returns before the 12:00 CET settlement, the opposite sign to Krueger's DAX short | CONFLICT (snippet only, unverified) |
| FTSE triple witching (same page) | Net t 3.6, n 32 (n<40, so unreliable per Krueger). Transfer to Xetra/CAC/SMI is untested | INFERRED |

## 1:20 R:R check
Not a TP-based rule. If 1:20 brackets were imposed, the break-even win rate would be 1/(1+20) = 4.76%. The 1-hour expiry move (+8.7 pts net on a ~24,000-point DAX ≈ 3.6 bp) cannot produce a 20R target with any realistic stop (20R would need a stop under 0.5 pt). Not applicable.

## Backtest spec (exact defaults, 2026-10-31)
**Part A: Xetra closing-auction fade (GER40)**
- **Data:** GER40 CFD 1-min + tick volume, 2020-01-01 → 2026-10-30. The DAX index (or FDAX) is needed for the auction print. Splits: 2020, 2021–2022, 2023–2026.
- **Signal:** AR = ln(DAX close auction price at 17:35 Europe/Berlin / GER40 mid at 17:29:59 Europe/Berlin). Trade only if |AR| ≥ 0.15%.
- **Entry:** at 17:36 Europe/Berlin, take the position opposite to sign(AR) in GER40.
- **Exit:** 09:10 Europe/Berlin next trading day (holding rule; the paper finds the reversal half-spread adjusted is gone within 10 min for DAX). Stop 1.0 × ATR14(H1). No TP.
- **Costs:** 2.5 pts round trip plus overnight financing at the broker rate. Stress ×1.5 and ×2.
- **Filters:**
  - skip quarterly expiry days and MSCI rebalance days (no reversal there per the paper);
  - variant: trade only if VIX > 25 (the reversal was largest in the COVID period).
- **Sweep grid:**
  - |AR| threshold {0.05, 0.10, 0.15, 0.25, 0.40}%;
  - exit {09:00:30, 09:05, 09:10, 09:30, 09:40} Europe/Berlin;
  - VIX filter {off, >20, >25};
  - expiry/MSCI-day skip {on, off}.
- **Controls:** random-sign entry; same rule on CAC40 (Euronext 17:30–17:35 CET) and UK100 (16:30–16:35 London); SMI (SIX close 17:20–17:31 CET, INFERRED schedule).

**Part B: DAX expiry-hour short (GER40)**
- **Days:** third Friday of each month (default monthly; variant quarterly only, Mar/Jun/Sep/Dec). If the third Friday is a Xetra holiday, skip it.
- **Entry:** short GER40 at 12:00:00 Europe/Berlin.
- **Exit:** 12:59 Europe/Berlin, before the 13:00 auction freeze (holding rule). Stop 1.0 × ATR14(5m) × √12 from entry. No TP.
- **Costs:** 2.5 pts round trip (stress 3.75 and 5).
- **Holdout:** 2023-01-01 → 2026-10-30, evaluated once. Report n, mean pts, t, and the sign by year.
- **Sweep grid:**
  - entry {11:30, 11:45, 12:00, 12:15};
  - exit {12:45, 12:59, 13:10, 13:30} Europe/Berlin;
  - days {monthly, quarterly, all Fridays (control), third Thursdays (placebo)}.

### Pseudocode
```python
# Part A
for d in days:
    if skip_expiry and (is_third_friday_quarterly(d) or is_msci_rebal(d)): continue
    ar = log(dax_close_auction(d) / ger40_mid(d,'17:29:59','Europe/Berlin'))
    if abs(ar) < thr: continue
    side = -sign(ar); e = fill(d,'17:36',side)
    x = exit_first(stop=e - side*atr14_h1(d), time=next_day(d,'09:10'))
    pnl.append(side*(x-e) - 2.5 - financing(side, nights=1))
# Part B
for d in third_fridays(2020, 2026, monthly=True):
    e = bid_at(d,'12:00','Europe/Berlin')
    x = exit_first(stop=e + atr14_5m(d)*sqrt(12), time=(d,'12:59'))
    pnl_b.append((e - x) - 2.5)
report(pnl, pnl_b, split='2023-01-01')
```

## Labels
style=intraday/overnight auction effects; confidence=medium (A: peer-reviewed 2019–20, decayed 2021) / low (B: search result, n 96, no holdout); instruments=GER40, FRA40, UK100, SMI20; timeframe=1-min; best_backtest_markets=GER40;FRA40;UK100
