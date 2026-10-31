# Gold London PM fix: information leakage in COMEX GC / GLD at the fixing start (Caminschi & Heaney, UWA, J. Futures Markets 2014) vs. post-2015 LBMA-auction and FX/BTC fixing tests net of costs (KruegerAlgorithms 2026) — XAUUSD, EURUSD, BTC
**Sources (all opened 2026-10-31):**
- Caminschi, A. & Heaney, R. (2014), "Fixing a Leaky Fixing: Short-term market reactions to the London PM gold price fixing", Journal of Futures Markets 34(11), doi 10.1002/fut.21636. Author accepted manuscript (UWA repository): https://api.research-repository.uwa.edu.au/ws/files/4725264/A0205_use_this.pdf
- KruegerAlgorithms, "Six Fixings and Settlement Events Tested: The Reaction Is Smaller Than the Costs, or Absent" (2026-09-29, "No edge"): https://kruegeralgorithms.com/en/research/fx-gold-crypto-fixings-tested
- Library cross-reference: audit-gold-xauusd-intraday-breakouts-asia-news-trend-krueger-2015-2026.md (Krueger gold breakouts/news/trend), academic-gold-overnight-blose-gondhalekar-kort.md, academic-fx-london-fix-evans-melvin-prins.md, academic-fx-fix-reversal-krohn-mueller-whelan.md.

**Verified result:** Historical edge that is **not available to outsiders**, and gone in its original form.
- **Caminschi-Heaney (CONFIRMED, peer-reviewed):** 2007–2012 (1,504 fixings) with 1-min GC (TickData Inc.) and GLD (Thomson Reuters Tick History) data. At the 15:00 London PM fixing start, GC volume +47.8% (t 26.2) and volatility +32.9% (t 23.8) in the first minute. Directional foresight of the fixing outcome gave "an advantage of around 10 bps in the first four minutes following the start of the fixing, and a possible further 4 bps in the two minutes" before the end (conclusion section). The price move 15:00→15:06 in GC predicted the fixing direction for 95.1% of large-move fixings (98 of 103) vs 62.1% of small ones (Aug 2011–Dec 2012 subsample, 338 fixings). **No significant returns after publication.** An uninformed trader cannot know the direction in advance (pre-fix 1-min GC direction predicts only 53.8%).
- **What happened next (INFERRED, background, not opened this batch):** the bank fixing was replaced by the electronic LBMA Gold Price auction in 2015, so the 2007–2012 mechanism no longer exists in that form (the paper itself only proposes moving to a public electronic order book).
- **Post-2015 independent test (CONFIRMED, third-party):** Krueger tested 31 gold windows on Dukascopy CFD minutes 2015–2022 (LBMA AM/PM, COMEX open/close, Shanghai, session handovers): **all ≤ 1.4 bps gross vs ~3 bps cost**. Best example: short 10:00–10:30 London before the AM price, n 2,062, gross +0.57 bps (t 2.12), **net −2.25 bps (t −7.78), 0/8 years positive**. Largest t: Shanghai benchmark +0.9 bps (t 3.2) gross, a third of the cost. The gold direction was chosen from the data (flatters the result).

## Rules / findings
| Item | Detail | Status |
|---|---|---|
| Fix timing (2007–2012) | PM starts 15:00 London; duration median 8 min; text says mean 11.3 min while the Table 2 summary row shows 10.4; 80% concluded within 3–19 min, 11% under 4 min | CONFIRMED (mean: CONFLICT inside the paper) |
| Volume spike | GC +47.8% at 15:01 (t 26.2), GLD +27.4%; subsample GC +81.1% / GLD +44.4% | CONFIRMED |
| Volatility spike | GC +32.9% (t 23.8), GLD +26.9%; subsample +52.2% / +47.3% | CONFIRMED |
| Informed-vs-uninformed return gap, GC | +3.8, +3.0, +1.8, +1.0 bps in minutes 1–4 (t from >17 to 7.2); GLD +3.8, +3.2, +1.7, +1.1; ~50% of the cumulative jump within 2 min, 80% within 5 min, peak ~12 min | CONFIRMED |
| Subsample gap | ~+8.5 bps in the first two minutes (DR+1 +4.2, DR+2 +4.2 GC; t > 5); opposite-sign returns in the last three minutes (−0.9, −1.5, −1.2 bps GC), cumulative −3.8 bps GC (−4.0 GLD) | CONFIRMED |
| Cost threshold | tick ≈ 0.63 bps at $1,600/oz; four ticks slippage/spread + two sets of transaction costs → 3 bps threshold | CONFIRMED |
| Prediction of fix direction from GC 15:00→15:0i | i=0: 53.8%; i=1: 69.9% overall (big 78.8%; 320 fixings published ≥15:02); i=6: 78.6% overall (big 95.1% = 98/103 large-move fixings, small 62.1%; 205 fixings published ≥15:07), on average 5.4 min before publication | CONFIRMED (Table 8 / text) |
| Tradable rule for outsiders | Follow the GC move in the first 1–2 minutes after 15:00 London (momentum into the fix) | INFERRED (paper measures informed returns, not a follow rule) |
| Krueger gold windows 2015–2022 | 31 windows, all ≤ 1.4 bps gross; AM-fix short net −2.25 bps (t −7.78) | CONFIRMED |
| London 4pm FX fix (EURUSD, n 2,075) | short 15:45–16:00 gross +0.56 (t 2.55), net −0.59 (t −2.44), 1/8 years; long 16:00–16:30 gross +0.69 (t 3.51), net −0.47 (t −2.48); month-end basket after the fix −2.5 bps gross (t −2.6). Cost ~1.15 bps | CONFIRMED |
| BTC funding (00/08/16 UTC) | all 12 variants net negative at 10 bps (best t −3.6) | CONFIRMED |
| BTC CME gap ≥ 50 bps (n 199) | fill within 24 h 44.2% vs mirror level 49.7%; 72 h 61.3% vs 63.3%; gap-fade −28 bps net (t −1.25) | CONFIRMED |
| CNY fix 09:15 Beijing | 104 variants −3.1 to +3.2 bps; no monotonicity with the surprise | CONFIRMED |
| ECB 14:10 CET reference | reversal +0.55 gross / −0.62 net (n 295) | CONFIRMED |

## 1:20 R:R check
For XAUUSD a 1:20 bracket around the PM price with a 5 USD stop and Krueger's 0.40 USD round-trip cost: c = 0.08 R → break-even hit rate (1+c)/21 = 5.14% (derived). Caminschi-Heaney's effect (~10 bps ≈ 4 USD at $4,000/oz, and only with foresight) is below a 1R stop of 5 USD, so a 20R target cannot come from the fix mechanism (INFERRED).

## Backtest spec (exact defaults, 2026-10-31)
- **Purpose:** test whether any residual of the fixing-start leakage exists in the LBMA electronic auction era; expectation per Krueger: none net.
- **Instrument/data:** XAUUSD (primary), GC front month if available; 1-min (preferably 1-s) bars 2015-04-01 → 2026-10-31; timezone Europe/London. Fix starts: AM 10:30, PM 15:00 London.
- **Rule F1 (follow the start, INFERRED from Caminschi-Heaney):** at 15:02:00 London, side = sign(px(15:02) − px(15:00)); enter at 15:02 market; exit at 15:12:00 (paper's CAR peak ~12 min). Skip if |move| < 0.3 USD (noise floor).
- **Rule F2 (fade the overshoot, INFERRED):** if LBMA publication time is available, enter opposite to F1 side at publication − 3 min, exit at publication + 1 min. Requires publication timestamps (not in standard data) → optional.
- **Rule F3 (Krueger negative control):** short 10:00–10:30 London before the AM price (expect ≈ −2 bps net).
- **Stops/TP:** none (time exit); catastrophe stop 10 USD.
- **Costs (single default):** XAUUSD 0.40 USD round trip (≈ 1 bp at $4,000/oz; Krueger macro-event cost model); stress 0.80 USD and ~3 bps (Krueger fixing study's gold cost).
- **Sweep:** signal window {1, 2, 3, 4} min × hold {4, 8, 12, 20} min × fix {AM, PM} × noise floor {0, 0.3, 0.6} USD × cost {1×, 2×}. Controls: same rule at 14:00 and 16:00 London (placebo), random-direction market. Split 2015–2020 / 2021–2026; holdout 2024-01 → 2026-10 one run; BH across cells.
- **Transfer:** EURUSD 4pm fix (15:45–16:00 short, 16:00–16:30 long) as a control, costs 1.15 bps. Not applicable to NAS100/GER40/Brent. BTC: test only the CME-gap mirror control, 10 bps cost.

### Pseudocode
```python
for d in london_business_days(2015, 2026):
    for fix in ('10:30', '15:00'):
        p0 = px(d, fix); p1 = px(d, fix + SIG_MIN)
        move = p1 - p0
        if abs(move) < FLOOR: continue
        side = sign(move)
        pnl = side * (px(d, fix + SIG_MIN + HOLD_MIN) - p1) - COST_USD
        log(d, fix, pnl)
    placebo(d, ['14:00', '16:00'])
report(mean_t(), by_year(), vs_placebo(), random_market(), bh_q())
```

## Labels
style=scalping/intraday (event, minutes); confidence=high for the 2007–2012 leakage (peer-reviewed), low for any outsider-tradable post-2015 rule (Krueger: all gold windows net negative); instruments=GC, GLD, spot gold (paper), XAUUSD/EURUSD/BTC CFDs (Krueger); timeframe=1m; best_backtest_markets=XAUUSD;EURUSD
