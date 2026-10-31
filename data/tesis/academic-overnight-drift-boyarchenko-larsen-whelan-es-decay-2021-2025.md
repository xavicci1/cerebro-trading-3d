# Boyarchenko, Larsen & Whelan: "The Overnight Drift" (ES 2:00–3:00 ET) and the authors' 2026 update "The Disappearing Overnight Drift"

**Sources (all opened 2026-10-31):**
- NY Fed Staff Report 917, "The Overnight Drift" (Nina Boyarchenko, Lars C. Larsen, Paul Whelan). Published in the Review of Financial Studies 36(9), 2023, pp. 3502–3547, doi 10.1093/rfs/hhad020: https://www.newyorkfed.org/medialibrary/media/research/staff_reports/sr917.pdf
- Liberty Street Economics (NY Fed), "The Disappearing Overnight Drift", same authors, 1 July 2026, doi 10.59576/lse.20260701: https://libertystreeteconomics.newyorkfed.org/2026/07/the-disappearing-overnight-drift/
- Perfiltrade (independent data site; CC BY 4.0; generated 2026-10-17). ES/ZN front-month 1-min data, 2010-06-07 → 2026-10-09; costs are 1 tick per side plus USD 4.50 round trip:
  - https://www.perfiltrade.com/en/learn/rth-vs-globex-futures
  - https://www.perfiltrade.com/datos/en/efectos-famosos-antes-despues.csv
- Library cross-reference: audit-krueger-seven-published-anomalies-net-of-costs.md. Krueger's search gives +1.20 bps (t 2.9), "~0 since 2017", and net −5.5 bps on CFD costs.

**Verified result:** CONFIRMED in-sample (peer-reviewed RFS, ES 1998–2020), then CONFLICT / DECAYED out of sample. The authors themselves report the drift close to zero in 2021–2025. An independent 1-min ES replication gives −0.26 bp/day after 2021, and the trade is net negative after costs in every period.

## Rules / findings
| Rule/finding | Detail | Status |
|---|---|---|
| Window | ES mid-quote return 2:00→3:00 a.m. ET averaged 3.7% annualised (1.48 bps/day), Jan 1998–Dec 2020. Positive in 20 of 23 years and significant in 17. Negative in 2002, 2008 and 2019. Largest in 2020 (10.7% p.a.) | CONFIRMED (SR917) |
| Robustness | Significant on every weekday and in 9 of 12 months. During the about 3 weeks a year when US and European DST are out of sync, the effect moves to 4:00–5:00 ET, i.e. it follows the European cash open, not the US clock | CONFIRMED (SR917) |
| Mechanism | End-of-day order imbalance, RSV_close = signed volume / gross volume over 15:15–16:15 ET. Sell-offs are followed by larger overnight reversals (dealers' inventory risk is resolved at the European open) | CONFIRMED (SR917) |
| OD long 2:00→3:00, 2004.1–2020.12 (Table IX) | No costs 3.75% p.a., sd 2.65, Sharpe 1.10. With bid-ask costs −0.59%, Sharpe −0.54 | CONFIRMED (SR917) |
| OD+ long 1:30→3:30 | No costs 6.21%, sd 4.13, Sharpe 1.30. With costs 1.91%, Sharpe 0.26 | CONFIRMED (SR917) |
| BtD: OD+ only if RSV_close(t−1) < 0 | No costs 6.07%, sd 2.95, Sharpe 1.78. **With costs 4.04%, Sharpe 1.10** (the only variant that survives costs in the paper) | CONFIRMED (SR917) |
| Benchmarks | CTC buy & hold 8.95% (Sharpe 0.42). CTO 16:15→8:30 = 4.62%. OTC 9:30→16:15 = 4.20% (no costs) | CONFIRMED (SR917) |
| Post-sample (authors) | Jan 2021–Dec 2025 (1,245 days): 2:00–3:00 average "close to zero". Before 2021 it was >60% of the 5.9% annualised CTC return. The same holds for NQ and YM. The std of end-of-day RSV fell from 6.5% to 2.9%. VIX mean 20.4 → 19.4. Overnight volume share 15% → 16% | CONFIRMED (LSE 2026) |
| Authors' falsifiable prediction | The drift should return if end-of-day imbalance dispersion widens again | CONFIRMED (LSE 2026) |
| Commercial evidence | NightShares overnight ETFs (NSPY/NIWM) launched June 2022 and closed about 14 months later | CONFIRMED (LSE 2026) |
| Independent ES 1-min, 2:00→3:00 | 2010–2020 +1.53 bp [0.86, 2.22], n 2,694. 2021–2025 −0.26 [−0.97, 0.41], n 1,289. From Oct 2023 +0.36 [−0.34, 1.09], n 780. **Net of costs −1.57 (2010–20), −1.44 (full history)** | CONFIRMED (Perfiltrade) |
| Krueger CFD test | +1.20 bps (t 2.9) gross in the search, "~0 since 2017"; net −5.5 (t −13.4) on CFD spreads outside the cash session | CONFIRMED (library file; Krueger) |
| CFD transfer to NAS100/US500 | A 1-hour hold with retail CFD spreads ×2.5 outside cash hours costs more than the gross edge even in-sample | INFERRED |
| GER40 analogue | Long GER40 into the Xetra 09:00 CET open after a US sell-off day | INFERRED (mechanism only; not tested by the authors) |

## 1:20 R:R check
Not applicable: this is a holding-period rule with no TP. Mean gross ≈ 1.5 bp/day against a cost of 1 tick + commission ≈ 1.4–1.6 bp per round trip on ES, so the cost coverage is about 1×. With 1:20 brackets the break-even win rate would be 1/(1+20) = 4.76%, which is irrelevant for a 1-hour drift trade.

## Backtest spec (exact defaults, 2026-10-31)
- **Purpose:** confirm the decay. It is a replication and regime monitor, not a candidate for live trading unless the RSV dispersion regime returns.
- **Data:** NAS100 and US500 CFD (or NQ/ES), plus GER40. Tick/1-min data 2020-01-01 → 2026-10-30. Splits: 2020 (in-sample tail), 2021–2023, 2024–2026.
- **RSV proxy (order-flow proxy = tick volume):** over 15:15–16:15 America/New_York, RSV = Σ(sign(close_1m − open_1m) × tickvol_1m) / Σ tickvol_1m.
- **Signal (default = BtD variant):** if RSV(t−1) < 0 (the previous US close hour was net selling), go long at 01:30 America/New_York.
- **Exit:** 03:30 America/New_York (holding rule). No TP. Catastrophic stop 1.0 × ATR14(H1) from entry.
- **Controls:**
  - (i) plain OD: long 02:00→03:00 every day;
  - (ii) OD+: 01:30→03:30 every day;
  - (iii) the same windows on random-sign days;
  - (iv) DST-asynchronous weeks shifted to 04:00→05:00 ET.
- **GER40 variant:** if the US RSV(t−1) < 0, buy GER40 at 08:30 Europe/Berlin and exit 09:30 Europe/Berlin (holding).
- **Costs:** NAS100 2.5 pts and GER40 2.5 pts round trip (spreads outside the cash session ×1.5 as base, ×2 as stress). US500 0.6 pts.
- **Sweep grid:**
  - entry {01:00, 01:30, 02:00} ET;
  - exit {03:00, 03:30, 04:00} ET;
  - RSV threshold {<0, < −0.5σ, < −1σ} using a rolling 250-day σ;
  - RSV window {15:15–16:15, 15:45–16:00};
  - cost {×1, ×1.5, ×2}.
- **Regime monitor:** rolling 250-day std of RSV. Per the authors, the effect should reappear only if the std moves back towards the pre-2021 level (6.5% in their measure). Report the trade results split by high vs low RSV-dispersion terciles.
- **Report:** mean bp/trade, t-stat, hit rate, Sharpe by year, cost coverage (gross/cost).

### Pseudocode
```python
for d in trading_days:
    rsv = sum(sign(c-o)*tv for o,c,tv in bars_1m(d-1,'15:15','16:15',tz='America/New_York')) / sum_tv(d-1,'15:15','16:15')
    if rsv >= thr: continue                               # BtD: only after net-selling close
    e = ask_at(d,'01:30',tz='America/New_York')
    stop = e - 1.0*atr14_h1(d)
    x, why = first_touch_or_time(d, stop=stop, exit_time='03:30', tz='America/New_York')
    pnl.append((x - e) - cost_pts)
report(pnl, by_year=True, by_rsv_dispersion_tercile=True)
```

## Labels
style=intraday (overnight futures window); confidence=high (in-sample peer-reviewed) / low (2021–2025: decayed, net negative); instruments=ES/NQ/YM, NAS100/US500 CFD, GER40 analogue; timeframe=1-min, 1–2 h hold; best_backtest_markets=NAS100;US500;GER40
