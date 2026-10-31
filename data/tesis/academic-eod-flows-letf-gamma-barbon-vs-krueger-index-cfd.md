# End-of-day mechanical flows: leveraged-ETF rebalancing and option gamma hedging (Barbon-Beckmeyer-Buraschi-Moerke, SFI working paper) vs. index-CFD tests of the same flows (KruegerAlgorithms 2026) — NAS100 / US500 / DJ30 last 30 minutes
**Sources (all opened 2026-10-31):**
- Barbon, A., Beckmeyer, H., Buraschi, A. & Moerke, M., "Liquidity Provision to Rebalancing Flows from Leveraged ETFs and Equity Options" (Swiss Finance Institute RP 22-40; previously circulated as "The Role of Leveraged ETFs and Option Market Imbalances on End-of-Day Price Dynamics"). Full text PDF: https://abarbon.com/assets/Liquidity_Provision_to_Rebalancing_Flows_from_Leveraged_ETFs_and_Equity_Options.pdf
- KruegerAlgorithms, "Forced Flows, Second Round: Several Flows Are Visible, None Is Tradable…" (2026-10-05): https://kruegeralgorithms.com/en/research/forced-flows-second-round-pensions-cta-leveraged-etfs
- KruegerAlgorithms, research index (one-paragraph summaries of "Two Forced Flows Tested" (vol-target funds) and "VIX Curve, VVIX and Dealer Gamma Predict the Width of the Next US Session, Not Its Direction"): https://kruegeralgorithms.com/en/research
- KruegerAlgorithms, "VIX Curve, VVIX and Dealer Gamma Predict the Width of the Next US Session, Not Its Direction": https://kruegeralgorithms.com/en/research/vix-term-structure-vvix-gamma-predict-range-not-direction
- KruegerAlgorithms, "Dealer Gamma in Practice" (mechanics study 2026-06-11, with 5 Oct 2026 note retracting its own reconstructed gamma series): https://kruegeralgorithms.com/en/research/dealer-gamma-structure-vs-0dte
- Library cross-reference: academic-hedging-demand-intraday-momentum-baltussen.md (index-futures version of the gamma channel) and audit-krueger-seven-published-anomalies-net-of-costs.md (Baltussen rule reversed in SPX holdout).

**Verified result:** Two-sided.
- **Academic (CONFIRMED, working paper; journal status not checked):** On US single stocks 2012–2019 (1,882,332 stock-days; 72 leveraged ETFs on 24 benchmarks), both flows predict the 15:30–16:00 NY return. A one-SD rise in LETF rebalancing raises end-of-day returns by 430% of the average last-half-hour return; one-SD lower gamma-hedging pressure by 113%. Both reverse later (the LETF effect essentially overnight, the gamma effect over about a day). **The paper reports the LETF effect declining over time and only marginally significant late in the sample, while the gamma effect is persistent or increasing** (paraphrase). Net of costs (effective spread = 25% of quoted), the LETF long-short decile strategy has **net Sharpe 0.05** (gross 2.51); the gamma strategy net Sharpe 1.76; combined 1.77.
- **Index level, independent (CONFIRMED as published third-party research, not peer-reviewed):** KruegerAlgorithms rebuilt LETF daily rebalancing with real fund sizes on SPX/NQ/Dow CFDs: **net −1.5 bps per trade, does not grow with the demand (t 0.27)**. Vol-target-fund selling after 2-sigma days: the last hour instead tends to rise (short loses even gross −1.2 to −4.2 bps). Option pinning at round strikes on expiry: distance as on other Fridays (t 0.57; DAX −1.23). Dealer gamma predicts the **width** of the next session (holdout 2023–06/2026: range +0.20 typical ranges, t 3.2) but **not the direction**; long/short rules after the states are ≈ 0 after costs.
- Bottom line for our markets (NAS100/US500/DJ30 CFDs): the flows are real at stock level, but **no index-level directional rule survives costs** in the only independent post-2015 test found. Use as a volatility/range filter, not a signal.

## Rules / findings
| Item | Detail | Status |
|---|---|---|
| LETF rebalancing formula | Required trade = L·(L−1)·A·r_bench (L leverage, A AUM, r_bench benchmark return so far). L·(L−1) > 0 for L∉[0,1], so **both bull and inverse funds trade in the direction of the day's move** | CONFIRMED (Barbon et al. §2.3) |
| Stock-level LETF pressure | Ω = Σ_i L_i(L_i−1)·A_i,t−1·w_i,j,t−1·r_pre(benchmark to 15:30) / ADV_end(last-30-min $ volume, 1-month avg) | CONFIRMED (eq. 6) |
| Gamma hedging pressure | Γ_HP = 100 · Γ_IB · r_pre, where Γ_IB is dealers' net option gamma imbalance scaled by end-of-day dollar volume | CONFIRMED (definition); scaling details INFERRED — check paper eqs. before coding |
| Hedging window | 15:30–16:00 New York; r_pre = prior close → 15:30 | CONFIRMED |
| Main regression (2012–2019) | separately: Γ_HP −9.46 (t −4.71), Ω_LETF +43.39 (t 4.80); jointly −10.96 (t −5.52) and +46.74 (t 5.20) | CONFIRMED (Table 2) |
| Reversal | close → 10:00 next day: Γ_HP +25.57 (t 3.21), Ω_LETF −70.94 (t −3.38); LETF reversal essentially overnight, gamma over about a day | CONFIRMED (Table 4) |
| Trading strategies (stocks, 30 min/day, VW deciles) | Γ (long lowest / short highest Γ_HP decile): 5.20%/yr, Sharpe 3.83, **net Sharpe 1.76**, success 61.07%. Ω (long highest / short lowest): 5.78%/yr, Sharpe 2.51, **net 0.05**, 56.29%. Combined Ω−Γ: 6.63%/yr, Sharpe 4.29, net 1.77, 62.70%. Market 15:30–16:00: −1.39%/yr | CONFIRMED (Table 6) |
| Flow size | Γ flows ≈ 80 bn USD (2012) → 160 bn (2019); LETF 35 → 85 bn | CONFIRMED (Fig. 3 text) |
| Decay | LETF effect declining over the sample; gamma effect persistent/increasing | CONFIRMED (paper's time-variation analysis) |
| LETF at index level (SPX/NQ/Dow CFD, real fund sizes) | net −1.5 bps per trade, no dose-response (t 0.27); no holdout run. Direxion listed as untestable (demand likely undercounted) | CONFIRMED (Krueger forced flows) |
| Vol-target funds after 2-sigma days | Last hour Dow/NQ/SPX tends to rise; short −1.2 to −4.2 bps gross | CONFIRMED (Krueger research index summary) |
| Pinning on expiry day | SPX/NQ/Dow/DAX distance to round strike as on other Fridays (t 0.57; DAX −1.23) | CONFIRMED (Krueger forced flows) |
| Collar fund (JPM Hedged Equity) quarterly roll | close above the call in 21 of 40 quarters vs 20.4 expected: no cap | CONFIRMED |
| First trading day of quarter, SPX long 15:00–16:00 NY | search n 27 +11.4 bps (t 3.30); holdout n 13 +15.0 bps (t 2.26) but global q 0.12; without five best days negative | CONFIRMED; **not a finding** (Krueger) |
| Pension month-end rebalancing (Harvey-Mazzoleni-Melone 2025, NBER w33554) | 1990–2022 +6.95 bps/day (n 1,979, t 2.85) replicated; holdout +3.17 bps (t 0.60); CFDs net +3.3 bps search (t 0.17), −13.9 bps holdout (t −0.68) | CONFIRMED |
| Dealer gamma / VIX curve / VVIX → range, not direction | Next-session range in typical daily ranges (search → holdout 2019–2026): VIX9D>VIX +0.27 (t 6.7) → +0.26 (t 5.4), 446/1,949 days; VIX>VIX3M +0.35 (4.1) → +0.33 (2.6); VVIX top third +0.12 (4.0) → +0.21 (5.2). Gamma (SqueezeMetrics GEX) lowest vs highest third, search 2015–22 +0.25 (t 6.5) → holdout 2023–06/2026 +0.20 (t 3.2); variance ratio +0.071 (t 3.9) → +0.069 (t 2.0). Holds at equal VIX. Direction: no |t| > 1.5; gamma last-half-hour continuation −0.50 bps (t −0.25), first-hour-to-close −3.05 bps (t −1.0). BH q ≤ 0.02 (4 filters) / ≤ 0.08 (with 32 holdout checks) | CONFIRMED (VIX/VVIX/gamma page) |
| Free GEX maps | Blended 0–60 DTE GEX is dominated by 0DTE gamma: on 2026-06-10 the NQ call wall "migrated" 29,091 → 30,390 intraday with unchanged OI. 5 Oct 2026 note: Krueger's reconstructed SPY gamma series vs an independent reference: rank correlation −0.01 over 1,302 days (short gamma 99% vs 12% of days) → **flip/regime readings not validated** | CONFIRMED (dealer-gamma page) |

**Conflicts with the library:**
- academic-hedging-demand-intraday-momentum-baltussen.md (index futures, gamma-conditioned last-30-min momentum): Barbon et al. CONFIRM the gamma channel at stock level 2012–2019, but Krueger's index-CFD replication of the unconditional Baltussen rule is net −1.89 bps and reversed in the SPX 2023–06/2026 holdout (t −3.71). CONFLICT for retail index CFDs post-2020.

## 1:20 R:R check
Not applicable (no 1:20 claim; time-exit rules). For any 1:20 bracket on NAS100 last-30-min with a 0.3% stop (~60 pts at 20,000): c = 2.5/60 ≈ 0.04 R → break-even (1+c)/21 ≈ 4.96% (derived, INFERRED).

## Backtest spec (exact defaults, 2026-10-31)
- **Purpose:** index-level negative control + range filter. Expected result per Krueger: ≈ 0 or negative net.
- **Instruments:** NAS100 (primary), US500, DJ30 CFDs; 1-min bars 2020-01-01 → 2026-10-31; timezone America/New_York (cash 09:30–16:00).
- **Signal A (LETF demand):** D_t = Σ_funds L(L−1)·AUM_{t−1}·r_pre / ADV_index_last30. r_pre = prior 16:00 close → 15:30. Funds NAS100: TQQQ (+3), SQQQ (−3), QLD (+2), QID (−2); US500: UPRO, SPXU, SSO, SDS, SPXL, SPXS; DJ30: UDOW, SDOW, DDM, DXD (fund list INFERRED; AUM from issuer daily files). Default: trade only if |r_pre| ≥ 1.0% (INFERRED threshold).
- **Entry/exit:** at 15:30:00 NY go in the direction of r_pre; exit 15:59:00 NY (CFD may not print the auction; Krueger's FTSE study shows ⅔ of an auction effect arrives with the print — test both 15:59 and 16:00:30 if the CFD prices the print).
- **Signal B (gamma range filter, no direction):** if prior-day SqueezeMetrics GEX (value of D available ~05:30 NY on D+1) is in the lowest tercile of its trailing 252-day distribution, widen stops/ATR multipliers for any intraday system the next day; do not trade direction.
- **Stops/TP:** none (time exit). Catastrophe stop 1.0% of price.
- **Costs (single default):** NAS100 2.5 pts, US500 0.8 pts, DJ30 4.0 pts per round trip (Krueger cost model), + 0 swap (intraday).
- **Sweep:** |r_pre| threshold {0, 0.5, 1.0, 1.5, 2.0}% × entry {15:00, 15:30, 15:45} × exit {15:55, 15:59, 16:00 print} × D_t quintile {all, top quintile only} × cost {1×, 1.5×, 2×}. Holdout 2024-01-01 → 2026-10-31, one run; BH q ≤ 0.10 across cells. Controls: random-direction market (mirror each 1-min candle with p = ½), placebo windows 14:30–15:00.
- **Also test on BTC (24/7):** none — no closing benchmark; skip. XAUUSD: skip (no LETF flow of size).

### Pseudocode
```python
for d in us_trading_days(2020, 2026):
    c_prev = close(d-1, '16:00'); p1530 = px(d, '15:30')
    r_pre = p1530 / c_prev - 1
    D = sum(L*(L-1)*aum[f][d-1]*r_pre for f, L in FUNDS) / adv_last30(d)
    if abs(r_pre) < THR: continue
    side = sign(r_pre)
    exit_px = px(d, EXIT)
    pnl = side*(exit_px - p1530) - COST_PTS
    log(d, r_pre, D, pnl)
report(by_quintile(D), holm_or_bh(), random_market_control())
```

## Labels
style=intraday (flow, last 30 min); confidence=medium for the stock-level mechanism (large TAQ sample, working paper), low for any index-CFD rule (independent net −1.5 bps); instruments=US single stocks (paper), SPX/NQ/Dow CFDs (Krueger); timeframe=1m/30m; best_backtest_markets=NAS100;US500;DJ30
