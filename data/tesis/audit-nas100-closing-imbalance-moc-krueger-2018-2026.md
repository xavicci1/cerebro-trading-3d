# Audit: NAS100, trade the Nasdaq closing-cross imbalance of the 20 largest Nasdaq-100 stocks from 15:51 to 16:00 NY (KruegerAlgorithms 2026; pre-registered; passed the 2018–2022 search gate, **failed** the 2023 → Jun 2026 holdout)
**Sources (all opened 2026-10-31):**
- KruegerAlgorithms, "Nasdaq 100 closing imbalance: passed the search, failed the holdout". Imbalance data: Nasdaq NOII via Databento. Prices: NAS100 CFD, Dukascopy 1m. Pre-registered 19 Oct 2026, SHA-256 lock 441dd24d…: https://kruegeralgorithms.com/en/research/nasdaq-100-closing-imbalance-passed-search-failed-holdout
- KruegerAlgorithms, "Time-of-day and calendar effects intraday". Context: no index time window is net positive, and the closing-auction minutes are flagged as microstructure edges: https://kruegeralgorithms.com/en/research/time-of-day-and-calendar-effects-intraday
- Library cross-reference (not re-opened today): audit-index-event-day-closing-auction-ftse-krueger.md (the one confirmed auction rule), academic-eod-flows-letf-gamma-barbon-vs-krueger-index-cfd.md (end-of-day LETF/gamma flows), academic-intraday-momentum Baltussen/Gao rows.

**Verified result:** Independent third-party research. It is not peer-reviewed and has no trader record, but it was pre-registered with a one-shot holdout.
- **Search period, 1 May 2018 – 30 Dec 2022:** the primary rule (|imbalance| ≥ 60-day median, exit 16:00) made **+3.15 bps net per trade** (n 569, t 2.60, BH q 0.014, gross +5.63 bps, t 4.63). None of 2,000 direction swaps did as well.
- **Holdout, 2 Jan 2023 – 5 Jun 2026, run once on 19 Oct 2026:** **−0.15 bps net** (n 434, t −0.19, gross +1.20). At 1.5× costs −0.82 bps. Global q 0.81 across the programme's 82 holdout tests.
- **Verdict:** "not confirmed". The holdout SE of 0.79 bps rules out the search-period size. A gross remainder of about 1 bp is not ruled out but is below costs.

## Rules / findings
| Rule / finding | Detail | Status |
|---|---|---|
| Universe | AAPL, MSFT, NVDA, AMZN, GOOGL, GOOG, META (FB until 8 Jun 2022), AVGO, TSLA, COST, NFLX, AMD, PEP, ADBE, CSCO, QCOM, INTU, AMGN, TXN, ISRG. This is today's top-20 list, so it carries survivorship bias; it covers ~⅔ of index weight | CONFIRMED |
| Signal | Per stock, the first closing-auction message from 15:50:00 NY. Sum over stocks of side (buy +1 / sell −1) × imbalance shares × reference price, in USD | CONFIRMED |
| Direction | Sign of the USD sum (long if net buy imbalance) | CONFIRMED |
| Size filter | \|sum\| vs the previous 60 days: all days / ≥ median (primary) / ≥ 75th pct | CONFIRMED |
| Entry / exit | NAS100 CFD, enter at the 15:51 open; exit at the 16:00 open (before the auction print, primary) or at 16:01 (after it) | CONFIRMED |
| Costs | 2.5 index points round trip (≈2.5 bps in 2018–2022) | CONFIRMED |
| Search results (net bps / t / n) | All days 16:00: −0.03 / −0.04 / 1,167. ≥ median 16:00: **+3.15 / 2.60 / 569**. ≥ median 16:01: +1.27 / 1.12. ≥ 75th 16:00: +5.47 / 3.01 / 296. ≥ 75th 16:01: +3.10 / 1.76 | CONFIRMED |
| Warning signs before the holdout | By year: 2018 +4.34, 2019 +3.51, 2020 +5.33, 2021 +2.46, 2022 +0.67 bps. Long +2.29 (t 1.31) vs short +3.95 (t 2.35). Without the best 1% of days: +1.47 (t 1.58). Median trade +1.25 bps; hit rate 52.4%. Third-Friday expiries +1.45 bps (34 days) | CONFIRMED |
| Holdout results (net bps / t / n) | All days 16:00: −1.00 / −1.84 / 851. ≥ median 16:00: **−0.15 / −0.19 / 434**. ≥ median 16:01: −0.66 / −0.76. ≥ 75th 16:00: +0.63 / 0.54 / 232. Random markets −1.87 / −2.70. Direction-swap p 0.09 | CONFIRMED |
| Earlier ETF-level tests | SPY and QQQ closing-auction imbalance tests: "without result" (pages not opened today) | CONFIRMED (as stated on the page) |
| CONFLICT with the "MOC imbalance" folklore | MOC-imbalance trading is popular in retail/prop content. Here the public 15:50 imbalance carried information in 2018–2021 and has decayed since 2022 | CONFLICT (folklore vs holdout) |

## 1:20 R:R check
Not applicable: this is a 9-minute time exit with no target. Mean |move| is a few bps against a 2.5 bps cost, so any R:R framing is meaningless.

## Backtest spec (exact defaults, 2026-10-31)
- **Purpose:** replication / decay monitor, not a candidate. Krueger's result is a failed holdout. Treat a positive 2023–2026 result as a data error until explained.
- **Data:**
  - Nasdaq closing-cross NOII messages for the 20 stocks above (Krueger used Databento; exact dataset name not stated on the page — Nasdaq TotalView-ITCH NOII messages INFERRED), 15:50:00–16:01 America/New_York.
  - NAS100 CFD or NQ futures 1-min bars, 2018-05-01 → 2026-09-30.
- **Signal at 15:50:** for each stock take the first NOII message at or after 15:50:00. S = Σ side × imbalance_shares × ref_price.
- **Size filter:** trade if |S| ≥ median(|S|) over the previous 60 trading days (default).
- **Entry:** 15:51:00 NY open of the minute bar, direction sign(S).
- **Exit:** 16:00:00 NY bar open (default). No stop, no TP. Catastrophe stop 0.5%.
- **Costs:** 2.5 NAS100 points round trip (default); stress at 3.75 pts. On half trading days there is no 15:50 message, so skip them.
- **Sweep:**
  - Size filter {all, ≥ median, ≥ p75}; exit {16:00, 16:01}.
  - Signal time {15:50 first message, 15:55 last message, 15:59 last message (extension, Krueger did not test)}.
  - Weighting {equal USD, index-weight USD (extension)}; universe {top 20 as of each year (survivorship fix), Krueger list}; instrument {NAS100 CFD, NQ futures}.
- **Controls:** 2,000 random-direction swaps; always-long on the same days; drop the best 1% of days; by-year table; third-Friday split.
- **Do not backtest on:** GER40/XAUUSD/FX/BTC (no Nasdaq auction). GER40 analogue = the Xetra closing auction, see audit-index-event-day-closing-auction-ftse-krueger.md.

### Pseudocode
```python
TICKERS = ["AAPL","MSFT","NVDA","AMZN","GOOGL","GOOG","META","AVGO","TSLA","COST",
           "NFLX","AMD","PEP","ADBE","CSCO","QCOM","INTU","AMGN","TXN","ISRG"]   # FB before 2022-06-08
hist = deque(maxlen=60)
for d in trading_days:
    msgs = [first_noii_at_or_after(t, d, "15:50:00") for t in tickers_on(d)]
    if any(m is None for m in msgs): continue                       # half days
    S = sum(m.side * m.imbalance_shares * m.ref_price for m in msgs)
    thr = median(hist) if len(hist) == 60 else None
    hist.append(abs(S))
    if thr is None or abs(S) < thr: continue
    side = 1 if S > 0 else -1
    px_in, px_out = open_at(nas100, d, "15:51"), open_at(nas100, d, "16:00")
    pnl_bps = side * (px_out / px_in - 1) * 1e4 - 2.5 / px_in * 1e4
    log(d, side, pnl_bps)
report(mean_t(pnl), split(2018-2022, 2023-2026), by_year(), random_swaps(2000), drop_best(0.01))
```

## Labels
style=intraday (closing-auction flow, last 9 minutes); confidence=low (passed search t 2.6 / q 0.014, failed pre-registered holdout, global q 0.81); instruments=NAS100 CFD / NQ; timeframe=1m + NOII messages; best_backtest_markets=NAS100
