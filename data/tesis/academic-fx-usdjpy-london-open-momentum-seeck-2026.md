# Seeck (2026): Intraday momentum in spot FX and currency futures. First 30 min after the London open predicts the rest of the London–NY session; JPY amplification; costs kill everything except USDJPY spot

**Sources:**
- SSRN 7008318: Leander Seeck (Limes Technologies), "Intraday Momentum in Spot FX and Currency Futures: Signal Persistence, the JPY Amplification Mechanism, and the Cost Barrier to Retail Exploitability" (2026 preprint, not peer-reviewed): https://papers.ssrn.com/sol3/papers.cfm?abstract_id=7008318 and https://doi.org/10.2139/ssrn.7008318
  - **Not opened directly:** the SSRN page, the PDF and ResearchGate (https://www.researchgate.net/publication/410608403) all returned HTTP 403 / "Content Blocked" to curl on 2026-10-31, and WebFetch of the doi timed out.
  - All numbers below come from the abstract and search-engine excerpts of the doi.org record, so they are lower-grade than "opened".
- OpenAlex metadata (opened 2026-10-31; confirms title, sole author, 2026 SSRN preprint, accepted version): https://api.openalex.org/works/doi:10.2139/ssrn.7008318
- Independent cross-check (opened 2026-10-31): KruegerAlgorithms, "Reference Candles on FX and Gold: The Morning Is Dead Net of Costs, the Afternoon Is Not": https://kruegeralgorithms.com/en/research/fx-gold-reference-candle-scan

**Verified result:** INFERRED (from abstract and indexed excerpts; not peer-reviewed; PDF not opened).
- The paper has a proper split: in-sample 2012–2018, out-of-sample 2019–2024, permutation tests.
- USDJPY spot is the only spot pair positive after costs out of sample.
- Retail-feasibility evidence is thin: Sharpe about 0.7, max drawdown −15%, win rate 50.8%.

## Rules / findings
| Rule/finding | Detail | Status |
|---|---|---|
| Data | Dukascopy M5 bid for EURUSD, GBPUSD, AUDJPY, GBPJPY, USDJPY, 2012–2024, CET (Europe/Berlin) timestamps. 6J (JPY futures) M1 from Databento, 2019–2024. IS 2012–2018, OOS 2019–2024 | INFERRED (abstract/excerpt) |
| Signal | Sign of the log return over the first 30 minutes after the London open (09:00 CET → 09:30 CET) | INFERRED (excerpt) |
| Trade | Position = signal sign, held from the end of the signal window to an intraday exit inside the London–NY session. The exact default exit was not visible; the excerpts mention a set of tested exits including the NY close | INFERRED (exit time unknown) |
| Significance | Significant on 5 of 6 instruments, permutation p < 0.001 | INFERRED (abstract) |
| OOS coefficients | USDJPY β = +0.000748 (t 5.21). 6J +0.000691 (t 4.87). GBPUSD −0.000084 (t −0.66, reversed sign, n.s.). JPY coefficients about 3.8× larger (OOS 0.000859 vs 0.000226) | INFERRED (excerpt, Table 1) |
| Costs | USDJPY all-in round trip 1.47 pips | INFERRED (excerpt) |
| USDJPY OOS net 2019–2024 | Sortino +0.748, Sharpe +0.722, max drawdown −15.39%, win rate 50.8%. All other spot pairs rejected after costs | INFERRED (excerpt) |
| 6J futures | Positive but limited by prop-firm sizing constraints | INFERRED (excerpt) |
| 2022 BOJ YCC | USDJPY spot annual Sharpe −0.557 vs 6J +0.383. A 5-bp JGB-yield YCC regime filter did not improve USDJPY | INFERRED (excerpt) |
| Sign stability | One excerpt states the signal direction differs between 2012–18 and 2019–24 for some pairs (GBPUSD reversed) | CONFLICT (needs the PDF) |
| β interpretation | If β is the mean of sign × return, 0.000748 ≈ 7.5 bp ≈ 11 pips at USDJPY 150, about 7.6× the 1.47-pip cost | INFERRED (my arithmetic; confirm with the PDF) |
| Krueger cross-check, morning | M15 reference-candle breakouts 07:15–09:15 Berlin are net negative in every cell. USDJPY 08:15 candle −0.138R (t −7.0), 2015–2026 | CONFIRMED (Krueger page). Different rule (breakout with stop), same window: CONFLICT on retail feasibility |
| Krueger cross-check, afternoon | Peak window 05:00–07:00 New York, USDJPY +0.39R (t 15.1). **Retracted:** the 29 Sep 2026 note says the old chain books positive R on random markets. The 5 Oct 2026 re-run of 25 rule-market combos found none beat random, mean −0.08R/trade after costs | CONFIRMED (Krueger page, incl. retraction) |
| Commission sensitivity | 6 USD/lot round trip = 0.05–0.11R at 5–12 pip stops (Krueger) | CONFIRMED (Krueger page) |

## 1:20 R:R check
Seeck's rule is a time exit, not a bracket. If imposed on USDJPY with cost c = 1.47 pips:
- **No costs:** break-even win rate = 1/(1+20) = 4.76%.
- **20-pip stop, 400-pip TP:** win = +398.53 pips, loss = −21.47 pips, so p* = 21.47/420 = **5.11%**.
- **10-pip stop, 200-pip TP:** p* = 11.47/210 = **5.46%**.
- **Cost stress at 10-pip stop:** at ×2 costs (2.94 pips) p* = 12.94/210 = 6.16%.
- **Feasibility:** a 200–400 pip intraday move in USDJPY within one London–NY session is rare (typical daily range about 80–150 pips), so 1:20 cannot be reached intraday. This is consistent with the library's FX 1:20 audit: no verified 1:20 FX record exists.

## Backtest spec (exact defaults, 2026-10-31)
- **Data:** USDJPY tick / 1-min bid+ask, 2020-01-01 → 2026-10-30. Tick volume = order-flow proxy. Splits: 2020–2021, 2022 (YCC stress), 2023–2026 (beyond the paper's sample, true OOS).
- **Signal:** s = sign(ln(mid 09:30 / mid 09:00)), times Europe/Berlin (DST-aware; = 08:00–08:30 London). Skip if |r| < 0.02%.
- **Entry:** 09:30:00 Europe/Berlin at the ask (long) or bid (short).
- **Exit (default):** 17:30 Europe/Berlin (London close ≈ 16:30 London); INFERRED default. Hard stop 1.0 × ATR14(H1) × √8. No TP.
- **Costs:** 1.47 pips round trip (the paper's figure). Stress 2.2 and 2.94.
- **Filters (variants):**
  - tick-volume confirmation: signal-window tick volume > 20-day median of the same window;
  - skip BOJ meeting days and US NFP days.
- **Sweep grid:**
  - signal window {15, 30, 60} min;
  - entry delay {0, 5} min;
  - exit {12:00, 14:30, 16:00, 17:30, 22:00 (= 16:00 New York)} Europe/Berlin;
  - |r| threshold {0, 0.02, 0.05}%;
  - cost {1.0, 1.47, 2.2, 2.94} pips;
  - pairs {USDJPY, EURJPY, GBPJPY, AUDJPY, EURUSD control};
  - also XAUUSD (09:00 CET open, cost 0.35 USD) as a transfer test.
- **Controls:** random-sign signal (Krueger lesson), the same rule on mirrored minute bars, and a yearly sign table.

### Pseudocode
```python
for d in fx_days:
    m0 = mid_at(d,'09:00','Europe/Berlin'); m1 = mid_at(d,'09:30','Europe/Berlin')
    r = log(m1/m0)
    if abs(r) < thr: continue
    s = 1 if r > 0 else -1
    e = ask_at(d,'09:30') if s>0 else bid_at(d,'09:30')
    stop = e - s*atr14_h1(d)*sqrt(8)
    x = exit_first(stop=stop, time=(d,'17:30','Europe/Berlin'))
    pnl_pips.append(s*(x-e)/0.01 - extra_cost)
report(pnl_pips, by_year=True, oos_split='2023-01-01')
```

## Labels
style=intraday (session momentum); confidence=low-medium (preprint, PDF not opened, OOS 2019–24 claimed; Krueger breakout cross-check negative); instruments=USDJPY, JPY crosses, 6J; timeframe=M5/M1, 30-min signal + session hold; best_backtest_markets=USDJPY;EURJPY;GBPJPY;XAUUSD
