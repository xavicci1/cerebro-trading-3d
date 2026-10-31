# FX: USDJPY Tokyo 09:55 fix and gotobi days (Ito & Yamada 2017; KruegerAlgorithms pre-registered forward test 2026–27), plus FX reference-candle and 1:20 R:R cost check
**Sources (opened 2026-10-31):**
- Ito, T. & Yamada, M. (2017), "Puzzles in the Tokyo fixing in the forex market: Order imbalances and Bank pricing", *Journal of International Economics* 109, 214–234, doi 10.1016/j.jinteco.2017.09.005. RePEc: https://ideas.repec.org/a/eee/inecon/v109y2017icp214-234.html. Working paper (UTokyo Price Project WP 087, Sep 2016): https://www.centralbank-project.jp/wp-content/uploads/2018/08/p_wp087.pdf. NBER w22820: https://www.nber.org/papers/w22820
- Krueger, "Tokyo fix USDJPY forward test" (2026-09-29): https://kruegeralgorithms.com/en/research/tokyo-fix-usdjpy-forward-test
- Krueger, FX/gold reference-candle scan (2026-08-17, with retraction note): https://kruegeralgorithms.com/en/research/fx-gold-reference-candle-scan
- Context, not used for rules: Elaut, Frömmel & Lampaert (2018), "Intraday momentum in FX markets: Disentangling informed trading from liquidity provision", *J. Financial Markets* 37, 35–51, doi 10.1016/j.finmar.2016.09.002 (RePEc abstract https://ideas.repec.org/a/eee/finmar/v37y2018icp35-51.html; the UGent full text is access-restricted). RUB–USD on the Moscow Interbank Currency Exchange, 2005–2014, transaction-level data: the first half-hour return predicts the last half-hour, attributed to liquidity providers' aversion to overnight inventory. Abstract-level only; no numbers used.

**Verified result:** A mechanism with a real counterparty. The academic side is CONFIRMED (peer-reviewed abstract): at the 09:55 JST Tokyo fix, customer orders are biased toward buying USD (importers), banks set their own fixing rate, and the price path is "hump-shaped". Calendar effects matter.

Krueger's numbers (CONFIRMED as published third-party research):
- **Data:** Dukascopy USDJPY minute data in JST, 2015–2022 search, holdout 2023 → 5 Jun 2026, plus real Pepperstone demo ticks 04/2023–09/2026.
- **Every business day:** +1.43 bp in the 30 min before the fix (t 6.7) and −1.35 bp in the 30 min after (t 6.4).
- **Gotobi days:** +2.74 bp over the 2 h before vs +0.23 bp on other days.
- **Japanese weekday holidays (no fix):** −4.28 bp over the 2 h before 09:55 (t −2.9, n 112). The effect belongs to the fix, not the clock.
- **Status:** three rules frozen and **pre-registered 27 Sep 2026** (SHA-256 8833eea12aab6c1a961f1833fde2b3c88438979b0af43324643d919278cc21fc), evaluation 30 Sep 2027.

Not proven yet: global q = 0.15 for month-end and 0.13 for gotobi.

## Rules
| Rule | Detail | Status |
|---|---|---|
| Fix time | 09:55 Tokyo (JST, UTC+9, no DST) | CONFIRMED (Ito-Yamada abstract; Krueger) |
| Gotobi days | 5th, 10th, 15th, 20th, 25th and last day of the month | CONFIRMED (Krueger). Roll to the previous business day when the date is a non-business day: INFERRED |
| R1 month-end | Last Japanese business day: **short from the fix until late morning** | CONFIRMED direction/window. Exact exit time not published ("exact times are in the pre-registration document"); default 11:30 JST INFERRED |
| R1 results | Search n 96, +4.35 bps, t 4.9, 8/8 years. Ticks 04/2023–06/2026 n 38, +5.1 bps, t 1.8. Since 6 Jun 2026 n 3, +9.4 bps. Without its 5 best months the holdout t drops to 0.6; the effect sits mostly at quarter ends | CONFIRMED |
| R2 gotobi | **Long into the fix, then short until late morning** | CONFIRMED. Entry 07:55 JST (2 h before) and exit 11:30 JST INFERRED |
| R2 results | Search n 573, +3.35 bps, t 3.0. Ticks n 225, +4.5 bps, t 2.7. New since 6 Jun 2026 n 22, +5.3 bps, t 1.0. **Switching 1 minute late cuts ticks from +4.5 to +1.9 bps** | CONFIRMED |
| R3 weekday JP holidays | Short in the morning until the time the fix would be | CONFIRMED. Entry 07:55 JST INFERRED. Rule written only after 2023–26 values were known, so the forward test is its first clean test |
| R3 results | Search n 126, +1.7 bps (t 1.3). Ticks n 56, +5.6 bps (t 3.3) to 09/2026 | CONFIRMED |
| Costs | Search 1.6 pips round trip. Real tick spread around 09:55 median 0.3 pips (month-end fix-minute mean peak 0.88 pips). Forward test: real spread + 0.7 bps flat commission. Latency of 5–60 s kept month-end at +4.1 to +4.5 bps | CONFIRMED |
| Management | Hougaard-style management lowered month-end from 4.35 to 2.79 bps. Use fixed time exits | CONFIRMED |
| Pre-registration pass rule | Net mean > 0 and t ≥ 1.65, Holm over three rules (p < 0.017 / 0.025 / 0.05) | CONFIRMED |
| FX reference candles (EURUSD/GBPUSD/USDJPY, M15) | London morning 07:15–09:15 Berlin: every cell negative net (USDJPY −0.138 R, t −7.0). Cost mechanism: 6 USD/lot round turn ≈ 0.05–0.11 R at 5–12 pip stops. Anti-breakout −0.186 R. Late-London-morning peak (USDJPY +0.39 R, t 15.1) **comes from the old chain; page note: "not proven"** | CONFIRMED (morning negatives); CONFLICT (afternoon positives retracted by the author) |
| Asian-open breakout, USDJPY | Tokyo open −0.068 R (t −3.7) | CONFIRMED (old chain, negative, so the bias would only flatter it) |

## 1:20 R:R check (brief requirement)
- **No 1:20 claim is made by any source in this file.**
- Arithmetic for any 1:20 claim on USDJPY (derived, INFERRED):
  - Break-even win rate = (1 + c) / 21, where c is the round-trip cost in R.
  - Example: 10-pip stop, 0.3-pip spread and 0.7 bps commission (≈ 1.0 pip at USDJPY 150) gives c ≈ 0.13 R and a break-even of **5.4%** (vs 4.76% cost-free).
  - Example: 5-pip stop gives c ≈ 0.26 R and a break-even of **6.0%**.
- Empirical anchor: in Krueger's index ORB replication only 2.2–3.7% of trades reached even a **10R** target (see audit-krueger-index-orb-gao-breakouts-nq-spx-dj30-ger40-2015-2026.md). A 20R hit rate above 5–6% would need verified evidence (Myfxbook / broker statement), which none of the 1:20 sellers in the library has provided (see ict-silver-bullet-smc-1to20-audit.md).

## Backtest spec (exact defaults, 2026-10-31)
- **Instrument:** USDJPY, tick data (bid/ask) preferred, else 1-min. 2020-01-01 → 2026-10-31. Timezone Asia/Tokyo.
- **Calendar:** Japanese business days per the national holiday law (+ 31 Dec, 1–3 Jan bank holidays). Gotobi = 5/10/15/20/25/last day; a non-business date rolls to the previous business day (INFERRED).
- **R2 gotobi (primary):** buy at 07:55:00 JST, reverse to short at exactly 09:55:00 JST, flat at 11:30:00 JST. No stop (time-based, as published). Optional catastrophe stop 50 pips.
- **R1 month-end:** short at 09:55:00 JST on the last business day, flat at 11:30:00 JST.
- **R3 holidays:** short at 07:55:00 JST on a weekday JP holiday, flat at 09:55:00 JST.
- **Costs (single default):** real spread on ticks + 0.7 bps commission per round trip. On 1-min data use 1.6 pips round trip (conservative, Krueger search spec).
- **Sweep grid:**
  - Pre-fix entry {07:25, 07:55, 08:55, 09:25} JST
  - Switch delay {0, 60, 300} s
  - Exit {10:25, 10:55, 11:30, 12:00} JST
  - Cost {0.3, 0.9, 1.6} pips
  - Filter {all, exclude BoJ/MoF intervention days}
  - Report per rule; Holm across rules; separate quarter-end vs other month-ends.
- **Controls:** the same clock on non-gotobi business days, on JP holidays and on a random market.

### Pseudocode
```python
for d in jp_calendar_days(2020, 2026):
    if is_gotobi(d) and is_business_day(d):
        e1 = price_at(d, '07:55:00', side='ask'); x1 = price_at(d, '09:55:00', side='bid')
        e2 = x1;                                   x2 = price_at(d, '11:30:00', side='ask')
        pnl_bps = 1e4*((x1-e1)/e1 + (e2-x2)/e2) - 2*COMM_BPS   # long leg then short leg
        log('gotobi', d, pnl_bps)
    if is_last_business_day_of_month(d):
        e = price_at(d, '09:55:00', 'bid'); x = price_at(d, '11:30:00', 'ask')
        log('month_end', d, 1e4*(e-x)/e - COMM_BPS)
    if is_weekday_holiday_jp(d):
        e = price_at(d, '07:55:00', 'bid'); x = price_at(d, '09:55:00', 'ask')
        log('holiday', d, 1e4*(e-x)/e - COMM_BPS)
holm_test(['gotobi','month_end','holiday'], alpha=0.05, one_sided=True)
```

## Labels
style=intraday (calendar/flow); confidence=medium (mechanism peer-reviewed; edge small, pre-registered and not yet passed); instruments=USDJPY; timeframe=tick/1m; best_backtest_markets=USDJPY
