# Audit: index event days — short the FTSE 100 into the closing-auction print on FTSE/STOXX/MSCI rebalancing days (KruegerAlgorithms 2026, the programme's only rule confirmed after its pattern scan), with GER40 / US500 transfer specs
**Sources (all opened 2026-10-31):**
- KruegerAlgorithms, "Index Event Days: the FTSE Falls Into the Auction Print, and It Held Out of Sample" (2026-09-29, verdict "Edge confirmed"): https://kruegeralgorithms.com/en/research/index-rebalancing-closing-auction
- KruegerAlgorithms, "Forced Flows, Second Round…" (2026-10-05; other forced flows, Hang Seng date re-verification): https://kruegeralgorithms.com/en/research/forced-flows-second-round-pensions-cta-leveraged-etfs
- KruegerAlgorithms research index (programme status: "106 rules have been through an untouched holdout so far, 2 passed"; CAC 40 / SMI event days "same direction in the holdout but not confirmed (q 0.18)"): https://kruegeralgorithms.com/en/research
- Library cross-reference: audit-krueger-index-orb-gao-breakouts-nq-spx-dj30-ger40-2015-2026.md (same data/cost model), fx-usdjpy-tokyo-fix-gotobi-ito-yamada-krueger.md (the programme's second, unconfirmed trace).

**Verified result:** Independent third-party research (not peer-reviewed, no trader record). Mechanism: on the closing auction before an index change becomes effective, passive funds must trade at the close. On the FTSE 100 CFD, a **short held from the last cash hour until after the auction print** made **+8.3 bps per event day in 2015–2022 (n 63, t 2.3, 65% positive, 8/8 years)** and **+11.5 bps in the untouched holdout Jan 2023 → 5 Jun 2026 (n 27, t 3.9, 81% / 22 of 27 positive, 4/4 years)**; on real broker ticks +11.9 bps (n 25, t 4.2); placebo days +0.05 bps (n 51, t 0.0). Benjamini-Hochberg over the 19 holdout candidates of the scan: q 0.0008 (all others q ≥ 0.13); addendum 6 Oct 2026: across 59 holdout tests as of 8 Oct 2026, q 0.002. Two 2026 days (+35 and +45 bps) carry 30% of the holdout total; 5 of 27 holdout days negative. Economic size is small: ~8 event days/yr ≈ 0.8%/yr on notional. Krueger does not publish its execution parameters (exact entry minute, protection, size).

## Rules / findings
| Rule / finding | Detail | Status |
|---|---|---|
| Event days | Closing auction before the effective date of (a) FTSE 100 / STOXX quarterly reviews (third Friday of Mar/Jun/Sep/Dec) and (b) MSCI index reviews (dates from MSCI press releases). UK bank holidays have no auction (e.g., the MSCI date of 31 Aug 2026 is skipped) | CONFIRMED |
| Direction | Short | CONFIRMED |
| Entry | In the last cash hour; entries 15–60 min before the close all made +9.9 to +12.3 bps in the holdout | CONFIRMED (range); single default time INFERRED |
| Exit | Buy back **after the auction print** (tick data show the jump after 16:30 London; the path chart shows no selling pressure until ~16:20). Exit 1 min before the cash close gives only +4.0 bps (t 2.1) → ~⅔ of the gain arrives with the print | CONFIRMED |
| Flow visible in all 8 index markets | Auction-window range on event days 1.2–1.7× placebo; FTSE 1.42× (t 8.5); futures-roll control days nothing. Addendum: Hong Kong only on MSCI dates (1.29×, t 3.6), not Hang Seng reconstitutions (1.05×) after the old calendar was found wrong on 25 of 47 dates | CONFIRMED |
| Costs | 1.5 FTSE points round trip; broker spread 1.0 pt before the cash close, 1.8 pts after, same on event and placebo days; commissions not included; ticks from a Pepperstone demo feed. Costs ×1.5: +10.6 bps (t 3.9); ×2: +9.7 (t 3.6) | CONFIRMED |
| Selection | FTSE picked after looking at 8 markets in the search period (t 2.3 only); global correction does not cover this preselection | CONFIRMED |
| Robustness | Entry 1/2 min later +12.2 / +13.1 bps; without 5 best days +6.4 (t 3.2); MSCI only +12.0 (n 14); FTSE/STOXX only +11.0 (n 13); by year 2023 +11.5, 2024 +13.7, 2025 +2.7, 2026 +28.9 | CONFIRMED |
| Post-holdout days with ticks | −8.7 and +13.3 bps | CONFIRMED |
| Forward test | Next events: MSCI 30 Nov 2026, FTSE/STOXX 18 Dec 2026 | CONFIRMED (dates as published) |
| AUS200 twin | Search +12.6 bps (t 3.4) → holdout −3.5 (−3.3 on ticks): **failed** | CONFIRMED |
| CAC 40 / SMI | Same direction in holdout, not confirmed (q 0.18) | CONFIRMED (research index) |
| DAX / Dow / NQ / SPX direction | Not shown on the page (only the range ratio). **Untested for us** | CONFLICT/UNKNOWN |
| "Trade with the day's direction" variant | Look-ahead bug (direction set with a price 30 min after entry) found by independent re-implementation; corrected, nothing left | CONFIRMED |

**Mechanism (CONFIRMED as Krueger's stated hypothesis):** on the auction before the effective date, deleted stocks are still in the index and are sold into the auction while additions are not yet in, so the index level should fall into the print. Capacity is large (passive-fund flow). **INFERRED:** direction can flip on single events (e.g., 28 Feb 2025 MSCI day rose); no imbalance or trade-list data are used.

## 1:20 R:R check
Not applicable (time exit). A 1:20 bracket is incompatible with a ~10 bps event edge.

## Backtest spec (exact defaults, 2026-10-31)
- **Primary (replication):** UK100/FTSE 100 CFD, 1-min bars + ticks if available, Jan 2015 → Oct 2026. Timezone Europe/London. Event calendar = third Friday of Mar/Jun/Sep/Dec + MSCI review effective-date-minus-one closes (from MSCI press releases), minus UK bank holidays.
- **Entry:** short at 15:30:00 London (default; middle of the published 15–60 min range). **Exit:** first price at/after 16:35:00 London (after the 16:30 auction print + random end). Fallback if CFD does not print the auction: 16:36 first tick.
- **Stops/TP:** none (time exit). Catastrophe stop 1.0%.
- **Costs:** 1.5 FTSE points round trip (single default); stress at 2.25 and 3.0 pts.
- **Transfer test A (GER40, INFERRED, out-of-sample for this rule):** event days = Xetra closing auction on the third Friday of Mar/Jun/Sep/Dec (STOXX/DAX quarterly review effective dates; check STOXX/Deutsche Börse calendars) + MSCI review dates. Short 16:30:00 Berlin, exit at/after 17:36:00 Berlin (closing auction 17:30–17:35 + random end). Costs 2.5 pts round trip.
- **Transfer test B (US500/NAS100, INFERRED):** S&P/Nasdaq quarterly rebalance (third Friday Mar/Jun/Sep/Dec; Nasdaq-100 annual reconstitution in December) + MSCI dates. Short 15:00:00 NY, exit 16:00:30 NY. Costs US500 0.8 pts, NAS100 2.5 pts. Prior failure: Krueger "S&P 500 additions" (stock level) failed; index-level direction not published.
- **Sweep:** entry {15, 30, 45, 60} min before close × exit {1 min before close, after print} × event type {FTSE/STOXX, MSCI, both} × cost {1×, 1.5×, 2×}. Controls: 51+ placebo days (same weekday/month, non-event), random-direction market, drop-5-best-days. Treat GER40/US500 as a single pre-registered run each; report BH q across the 3 markets.
- **Do not backtest on:** XAUUSD, USDJPY, Brent, BTC (no index auction).

### Pseudocode
```python
EVENTS = ftse_stoxx_third_fridays() | msci_review_days() - uk_bank_holidays()
for d in EVENTS:
    entry = px(d, close_time(d) - ENTRY_MIN)      # 16:30 London - 60 min = 15:30
    exit_ = first_px_at_or_after(d, AUCTION_END + 1)  # 16:35 + 1 min
    pnl_bps = (entry - exit_) / entry * 1e4 - COST_BPS(entry)
    log(d, event_type(d), pnl_bps)
placebo = sample_non_event_days(same_weekday=True, n=len(EVENTS)*2)
report(mean_t(pnl), mean_t(placebo), drop_best(5), by_year(), bh_q())
```

## Labels
style=intraday (event/flow, last hour + auction); confidence=medium (holdout + ticks + BH q 0.0008, but n 27, ~8 days/yr, execution unpublished, single vendor); instruments=FTSE 100 CFD; timeframe=1m/ticks, event-day only; best_backtest_markets=UK100;GER40;US500
