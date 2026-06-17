
// src/features/Budget/BudgetAllocation.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import type { RootState, AppDispatch } from '../../app/store';
import { fetchBudgetDashboard, updateMonthAllocations } from './slice/budgetSlice';
import { useBudgetPrefix } from './useBudgetPrefix';
import styles from './BudgetAllocation.module.css';

// ── Helpers ───────────────────────────────────────────────────────────────────
const sym = (c: string) => ({ INR: '₹', USD: '$', EUR: '€', GBP: '£' }[c] ?? c);
const fmt = (v: number, s: string) => {
  if (v >= 10_000_000) return `${s}${(v / 10_000_000).toFixed(2)}Cr`;
  if (v >= 100_000)    return `${s}${(v / 100_000).toFixed(2)}L`;
  if (v >= 1_000)      return `${s}${(v / 1_000).toFixed(1)}K`;
  return `${s}${Number(v).toLocaleString()}`;
};

const FY_MONTHS = [
  'April','May','June','July','August','September',
  'October','November','December','January','February','March',
];

const getCurrentFYMonth = () =>
  new Date().toLocaleString('default', { month: 'long' });

// ── Icons ─────────────────────────────────────────────────────────────────────
const IconWallet = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 12V8H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4"/>
    <path d="M4 6v12a2 2 0 0 0 2 2h14v-4"/>
    <path d="M18 12a2 2 0 0 0-2 2c0 1.1.9 2 2 2h4v-4h-4z"/>
  </svg>
);
const IconCalendar = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);
const IconSpent = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
  </svg>
);
const IconVariance = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/>
    <polyline points="16 7 22 7 22 13"/>
  </svg>
);
const IconSave = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/>
    <polyline points="17 21 17 13 7 13 7 21"/>
    <polyline points="7 3 7 8 15 8"/>
  </svg>
);
const IconCheck = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const IconChevron = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);

// ── Types ─────────────────────────────────────────────────────────────────────
// spendEdits: key = "catId__subId"  (subId = subcategory id or 'null' for no-sub entries)
// value = edited spend string
type SpendEdits = Record<string, string>;

// ── Component ─────────────────────────────────────────────────────────────────
const BudgetAllocation: React.FC = () => {
  const { id }   = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const prefix   = useBudgetPrefix();

  const { dashboard, dashLoading, monthSaving } = useSelector(
    (s: RootState) => s.budget
  );

  const [selectedMonth,  setSelectedMonth]  = useState<string>(getCurrentFYMonth());
  const [spendEdits,     setSpendEdits]     = useState<SpendEdits>({});
  const [expandedCats,   setExpandedCats]   = useState<Set<number>>(new Set());
  const [saveFeedback,   setSaveFeedback]   = useState<string | null>(null);
  const [saveError,      setSaveError]      = useState<string | null>(null);

  // ── Fetch dashboard ───────────────────────────────────────────────────────
  useEffect(() => {
    if (id) dispatch(fetchBudgetDashboard(Number(id)));
  }, [id, dispatch]);

  // ── When month or dashboard changes, re-init spendEdits ──────────────────
  // KEY FIX: spendEdits key = "catId__subId" (unique per period entry)
  useEffect(() => {
    if (!dashboard?.period_entries) return;

    const init: SpendEdits = {};

    dashboard.period_entries
      .filter((pe: any) => pe.month === selectedMonth)
      .forEach((pe: any) => {
        const subId = pe.subcategory_id != null ? String(pe.subcategory_id) : 'null';
        const key   = `${pe.category_id}__${subId}`;
        init[key]   = String(pe.spent ?? 0);
      });

    setSpendEdits(init);
  }, [dashboard, selectedMonth]);

  // ── Expand all categories by default ─────────────────────────────────────
  useEffect(() => {
    if (dashboard?.categories) {
      setExpandedCats(new Set(dashboard.categories.map((c: any) => c.id)));
    }
  }, [dashboard]);

  // ── Loading state ─────────────────────────────────────────────────────────
  if (dashLoading || !dashboard) {
    return (
      <div className={styles.page}>
        <div className={styles.loadGrid}>
          {[1,2,3,4].map(i => <div key={i} className={styles.skelCard} />)}
        </div>
      </div>
    );
  }

  const d        = dashboard;
  const currency = sym(d.currency);

  // ── Get period entries for selected month ─────────────────────────────────
  const monthEntries: any[] = (d.period_entries || []).filter(
    (pe: any) => pe.month === selectedMonth
  );

  // ── Banner totals (use edited values for live feedback) ───────────────────
  const totalAllocated = monthEntries.reduce(
    (sum: number, pe: any) => sum + parseFloat(pe.allocated || 0), 0
  );
  const totalSpent = Object.values(spendEdits).reduce(
    (sum, v) => sum + (parseFloat(v) || 0), 0
  );
  const totalVariance   = totalAllocated - totalSpent;
  const totalBudget     = parseFloat(d.computed_total_budget || d.total_budget || 0);

  // ── Save handler ──────────────────────────────────────────────────────────
  // KEY FIX: Build entries from period_entries, not categories
  // This ensures we send the correct category_id + subcategory_id pairs
  const handleSave = async () => {
    setSaveError(null);

    // Build entries from the actual period_entries for this month
    // preserving allocated and using edited spent values
    const entries = monthEntries.map((pe: any) => {
      const subId = pe.subcategory_id != null ? String(pe.subcategory_id) : 'null';
      const key   = `${pe.category_id}__${subId}`;
      return {
        category_id:    pe.category_id,
        subcategory_id: pe.subcategory_id ?? null,
        allocated:      parseFloat(pe.allocated || 0),
        spent:          parseFloat(spendEdits[key] ?? String(pe.spent ?? 0)),
      };
    });

    if (entries.length === 0) {
      setSaveError('No allocations found for this month. Please set allocations in the budget form first.');
      return;
    }

    try {
      const result = await dispatch(updateMonthAllocations({
        budgetId: Number(id),
        month:    selectedMonth,
        entries,
      }));

      if (updateMonthAllocations.fulfilled.match(result)) {
        // Refresh dashboard to get updated data
        await dispatch(fetchBudgetDashboard(Number(id)));
        setSaveFeedback(`✓ ${selectedMonth} spend saved successfully!`);
        setTimeout(() => setSaveFeedback(null), 3000);
      } else {
        setSaveError('Failed to save. Please try again.');
      }
    } catch (err) {
      setSaveError('An error occurred while saving.');
    }
  };

  // ── Toggle category expand ────────────────────────────────────────────────
  const toggleCat = (catId: number) => {
    setExpandedCats(prev => {
      const next = new Set(prev);
      next.has(catId) ? next.delete(catId) : next.add(catId);
      return next;
    });
  };

  // ── Update a spend edit ───────────────────────────────────────────────────
  const updateEdit = (catId: number, subId: number | null, value: string) => {
    const key = `${catId}__${subId != null ? String(subId) : 'null'}`;
    setSpendEdits(prev => ({ ...prev, [key]: value }));
  };

  // ── Get spent value for a period entry ────────────────────────────────────
  const getSpent = (catId: number, subId: number | null): number => {
    const key = `${catId}__${subId != null ? String(subId) : 'null'}`;
    return parseFloat(spendEdits[key] ?? '0') || 0;
  };

  // ── Build category-grouped view ───────────────────────────────────────────
  // Group period entries by category
  interface CatGroup {
    cat:      any;
    entries:  any[];
    allocated: number;
    spent:    number;
  }

  const catGroups: CatGroup[] = (d.categories || []).map((cat: any) => {
    const catEntries = monthEntries.filter((pe: any) => pe.category_id === cat.id);
    const allocated  = catEntries.reduce((s: number, pe: any) => s + parseFloat(pe.allocated || 0), 0);
    const spent      = catEntries.reduce((s: number, pe: any) => {
      const subId = pe.subcategory_id != null ? String(pe.subcategory_id) : 'null';
      const key   = `${pe.category_id}__${subId}`;
      return s + (parseFloat(spendEdits[key] ?? String(pe.spent ?? 0)) || 0);
    }, 0);
    return { cat, entries: catEntries, allocated, spent };
  }).filter((g: CatGroup) => g.entries.length > 0 || g.cat);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className={styles.page}>

      {/* ── Page Header ── */}
      <div className={styles.pageHeader}>
        <div className={styles.headerLeft}>
          <button
            className={styles.backBtn}
            onClick={() => navigate(`${prefix}/budget/${id}/dashboard`)}
            type="button"
          >
            ← Dashboard
          </button>
          <div>
            <h1 className={styles.pageTitle}>Update Actual Spend</h1>
            <p className={styles.pageSubtitle}>
              {d.title} · Tracking actual spend by subcategory
            </p>
          </div>
        </div>
        <button
          className={styles.editBtn}
          onClick={() => navigate(`${prefix}/budget/${id}/edit`)}
          type="button"
        >
          ✏️ Edit Budget
        </button>
      </div>

      {/* ── Month Selector ── */}
      <div className={styles.monthSelectorWrap}>
        <div className={styles.monthSelectorLabel}>Select Month</div>
        <div className={styles.monthTabs}>
          {FY_MONTHS.map(month => {
            const hasData = (d.period_entries || []).some(
              (pe: any) => pe.month === month
            );
            const isSelected = month === selectedMonth;
            return (
              <button
                key={month}
                type="button"
                className={`${styles.monthTab} ${isSelected ? styles.monthTabActive : ''} ${!hasData ? styles.monthTabEmpty : ''}`}
                onClick={() => setSelectedMonth(month)}
                title={!hasData ? 'No allocations for this month' : month}
              >
                {month.slice(0, 3)}
                {hasData && <span className={styles.monthDot} />}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Banner ── */}
      <div className={styles.banner}>
        <div className={`${styles.bannerCard} ${styles.bannerIndigo}`}>
          <div className={styles.bannerIconWrap}><IconWallet /></div>
          <div className={styles.bannerContent}>
            <div className={styles.bannerValue}>{fmt(totalBudget, currency)}</div>
            <div className={styles.bannerLabel}>Total Annual Budget</div>
          </div>
          <div className={styles.bannerBg}>#</div>
        </div>

        <div className={`${styles.bannerCard} ${styles.bannerCyan}`}>
          <div className={styles.bannerIconWrap}><IconCalendar /></div>
          <div className={styles.bannerContent}>
            <div className={styles.bannerValue}>{fmt(totalAllocated, currency)}</div>
            <div className={styles.bannerLabel}>{selectedMonth} Allocated</div>
          </div>
          <div className={styles.bannerBg}>M</div>
        </div>

        <div className={`${styles.bannerCard} ${styles.bannerAmber}`}>
          <div className={styles.bannerIconWrap}><IconSpent /></div>
          <div className={styles.bannerContent}>
            <div className={styles.bannerValue}>{fmt(totalSpent, currency)}</div>
            <div className={styles.bannerLabel}>{selectedMonth} Spent</div>
          </div>
          <div className={styles.bannerBg}>$</div>
        </div>

        <div className={`${styles.bannerCard} ${totalVariance < 0 ? styles.bannerRed : styles.bannerEmerald}`}>
          <div className={styles.bannerIconWrap}><IconVariance /></div>
          <div className={styles.bannerContent}>
            <div className={styles.bannerValue}>
              {totalVariance < 0 ? '-' : ''}{fmt(Math.abs(totalVariance), currency)}
            </div>
            <div className={styles.bannerLabel}>
              {totalVariance < 0 ? 'Over Budget' : 'Remaining'}
            </div>
          </div>
          <div className={styles.bannerBg}>{totalVariance < 0 ? '!' : '✓'}</div>
        </div>
      </div>

      {/* ── Feedback ── */}
      {saveFeedback && (
        <div className={styles.feedbackSuccess}>
          <IconCheck /> {saveFeedback}
        </div>
      )}
      {saveError && (
        <div className={styles.feedbackError}>
          ⚠ {saveError}
        </div>
      )}

      {/* ── No allocations message ── */}
      {monthEntries.length === 0 && (
        <div className={styles.emptyMonth}>
          <div className={styles.emptyIcon}>📅</div>
          <h3 className={styles.emptyTitle}>No allocations for {selectedMonth}</h3>
          <p className={styles.emptyText}>
            Set budget allocations for this month in the budget form first.
          </p>
          <button
            type="button"
            className={styles.emptyBtn}
            onClick={() => navigate(`${prefix}/budget/${id}/edit`)}
          >
            ✏️ Edit Budget Allocations
          </button>
        </div>
      )}

      {/* ── Category / Subcategory spend table ── */}
      {monthEntries.length > 0 && (
        <div className={styles.spendSection}>

          {/* Table header */}
          <div className={styles.tableHeader}>
            <h2 className={styles.tableTitle}>
              Spend Breakdown — {selectedMonth}
            </h2>
            <span className={styles.tableSubtitle}>
              Enter actual spend per subcategory
            </span>
          </div>

          <div className={styles.catAccordions}>
            {catGroups.map(({ cat, entries, allocated, spent }) => {
              const isExpanded  = expandedCats.has(cat.id);
              const utilPct     = allocated > 0 ? Math.round((spent / allocated) * 100) : 0;
              const isOver      = utilPct >= 100;
              const isWarn      = utilPct >= (cat.alert_threshold || 80) && !isOver;
              const variance    = allocated - spent;
              const hasEntries  = entries.length > 0;

              return (
                <div
                  key={cat.id}
                  className={`${styles.catAccordion} ${isOver ? styles.accordionOver : isWarn ? styles.accordionWarn : ''}`}
                >
                  {/* Category header row */}
                  <button
                    type="button"
                    className={styles.catAccordionHeader}
                    onClick={() => toggleCat(cat.id)}
                  >
                    <div className={styles.catHeaderLeft}>
                      <span className={`${styles.catChevron} ${isExpanded ? styles.chevronOpen : ''}`}>
                        <IconChevron />
                      </span>
                      <div className={styles.catHeaderInfo}>
                        <span className={styles.catHeaderName}>{cat.name}</span>
                        <span className={styles.catHeaderMeta}>
                          {entries.length} entr{entries.length !== 1 ? 'ies' : 'y'} · Alert at {cat.alert_threshold}%
                        </span>
                      </div>
                    </div>

                    <div className={styles.catHeaderRight}>
                      {/* Mini progress bar */}
                      <div className={styles.catMiniProgress}>
                        <div className={styles.catMiniTrack}>
                          <div
                            className={styles.catMiniFill}
                            style={{
                              width: `${Math.min(utilPct, 100)}%`,
                              background: isOver ? '#ef4444' : isWarn ? '#f59e0b' : '#10b981',
                            }}
                          />
                        </div>
                        <span className={`${styles.catPct} ${isOver ? styles.pctRed : isWarn ? styles.pctAmber : styles.pctGreen}`}>
                          {utilPct}%
                        </span>
                      </div>

                      <div className={styles.catHeaderAmounts}>
                        <div className={styles.catAmtItem}>
                          <span className={styles.catAmtLabel}>Allocated</span>
                          <span className={styles.catAmtVal}>{fmt(allocated, currency)}</span>
                        </div>
                        <div className={styles.catAmtDivider} />
                        <div className={styles.catAmtItem}>
                          <span className={styles.catAmtLabel}>Spent</span>
                          <span className={`${styles.catAmtVal} ${styles.spentColor}`}>
                            {fmt(spent, currency)}
                          </span>
                        </div>
                        <div className={styles.catAmtDivider} />
                        <div className={styles.catAmtItem}>
                          <span className={styles.catAmtLabel}>
                            {variance < 0 ? 'Over' : 'Remaining'}
                          </span>
                          <span className={`${styles.catAmtVal} ${variance < 0 ? styles.overColor : styles.remainColor}`}>
                            {variance < 0 ? '-' : ''}{fmt(Math.abs(variance), currency)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>

                  {/* Subcategory rows — expanded */}
                  {isExpanded && (
                    <div className={styles.subEntriesWrap}>
                      {!hasEntries ? (
                        <div className={styles.noEntriesMsg}>
                          No period entries for this category in {selectedMonth}.
                        </div>
                      ) : (
                        <>
                          {/* Column headers */}
                          <div className={styles.subEntryHead}>
                            <span className={styles.subHeadSub}>Subcategory</span>
                            <span className={styles.subHeadAlloc}>Allocated</span>
                            <span className={styles.subHeadSpent}>Actual Spent</span>
                            <span className={styles.subHeadVar}>Variance</span>
                            <span className={styles.subHeadUtil}>Utilization</span>
                          </div>

                          {entries.map((pe: any) => {
                            const subId       = pe.subcategory_id ?? null;
                            const editKey     = `${pe.category_id}__${subId != null ? String(subId) : 'null'}`;
                            const editedSpent = parseFloat(spendEdits[editKey] ?? String(pe.spent ?? 0)) || 0;
                            const peAllocated = parseFloat(pe.allocated || 0);
                            const peVariance  = peAllocated - editedSpent;
                            const peUtil      = peAllocated > 0
                              ? Math.round((editedSpent / peAllocated) * 100)
                              : 0;
                            const peOver      = peUtil >= 100;
                            const peWarn      = peUtil >= (cat.alert_threshold || 80) && !peOver;

                            // Find subcategory name
                            const subName = pe.subcategory_name
                              || (cat.subcategories || []).find(
                                  (s: any) => s.id === pe.subcategory_id
                                )?.name
                              || (pe.subcategory_id ? `Sub #${pe.subcategory_id}` : 'General');

                            return (
                              <div key={`${pe.category_id}-${subId}`} className={styles.subEntryRow}>

                                {/* Subcategory name */}
                                <div className={styles.subEntryName}>
                                  <div className={styles.subDot} style={{
                                    background: peOver ? '#ef4444' : peWarn ? '#f59e0b' : '#6366f1',
                                  }} />
                                  <div>
                                    <div className={styles.subName}>{subName}</div>
                                    <div className={styles.catTag}>{cat.name}</div>
                                  </div>
                                </div>

                                {/* Allocated */}
                                <div className={styles.subEntryAlloc}>
                                  <span className={styles.subAllocAmt}>
                                    {fmt(peAllocated, currency)}
                                  </span>
                                </div>

                                {/* Spent input */}
                                <div className={styles.subEntrySpend}>
                                  <div className={styles.spendInputWrap}>
                                    <span className={styles.currencyPrefix}>
                                      {currency}
                                    </span>
                                    <input
                                      type="number"
                                      min="0"
                                      className={`${styles.spendInput} ${peOver ? styles.inputOver : peWarn ? styles.inputWarn : ''}`}
                                      value={spendEdits[editKey] ?? String(pe.spent ?? 0)}
                                      onChange={e => updateEdit(cat.id, subId, e.target.value)}
                                      placeholder="0"
                                    />
                                  </div>
                                </div>

                                {/* Variance */}
                                <div className={styles.subEntryVar}>
                                  <span className={`${styles.varianceChip} ${
                                    peAllocated === 0 ? styles.chipNeutral :
                                    peVariance < 0    ? styles.chipRed     : styles.chipGreen
                                  }`}>
                                    {peAllocated === 0
                                      ? '—'
                                      : `${peVariance >= 0 ? '+' : ''}${fmt(Math.abs(peVariance), currency)}`
                                    }
                                  </span>
                                </div>

                                {/* Utilization bar */}
                                <div className={styles.subEntryUtil}>
                                  <div className={styles.utilTrack}>
                                    <div
                                      className={styles.utilFill}
                                      style={{
                                        width: `${Math.min(peUtil, 100)}%`,
                                        background: peOver ? '#ef4444' : peWarn ? '#f59e0b' : '#10b981',
                                      }}
                                    />
                                  </div>
                                  <span className={`${styles.utilPct} ${
                                    peOver ? styles.pctRed : peWarn ? styles.pctAmber : styles.pctGreen
                                  }`}>
                                    {peUtil}%
                                  </span>
                                </div>
                              </div>
                            );
                          })}

                          {/* Category subtotal row */}
                          <div className={styles.catSubtotalRow}>
                            <span className={styles.subtotalLabel}>Category Total</span>
                            <span className={styles.subtotalAlloc}>
                              {fmt(allocated, currency)}
                            </span>
                            <span className={`${styles.subtotalSpent} ${styles.spentColor}`}>
                              {fmt(spent, currency)}
                            </span>
                            <span className={`${styles.subtotalVar} ${
                              variance < 0 ? styles.overColor : styles.remainColor
                            }`}>
                              {variance < 0 ? '-' : '+'}{fmt(Math.abs(variance), currency)}
                            </span>
                            <span className={`${styles.subtotalUtil} ${
                              isOver ? styles.pctRed : isWarn ? styles.pctAmber : styles.pctGreen
                            }`}>
                              {utilPct}%
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* ── Grand total row ── */}
          <div className={styles.grandTotalRow}>
            <span className={styles.gtLabel}>Month Grand Total — {selectedMonth}</span>
            <div className={styles.gtAmounts}>
              <div className={styles.gtItem}>
                <span className={styles.gtAmtLabel}>Allocated</span>
                <span className={styles.gtAmtVal}>{fmt(totalAllocated, currency)}</span>
              </div>
              <div className={styles.gtDivider} />
              <div className={styles.gtItem}>
                <span className={styles.gtAmtLabel}>Spent</span>
                <span className={`${styles.gtAmtVal} ${styles.spentColor}`}>
                  {fmt(totalSpent, currency)}
                </span>
              </div>
              <div className={styles.gtDivider} />
              <div className={styles.gtItem}>
                <span className={styles.gtAmtLabel}>
                  {totalVariance < 0 ? 'Over' : 'Remaining'}
                </span>
                <span className={`${styles.gtAmtVal} ${
                  totalVariance < 0 ? styles.overColor : styles.remainColor
                }`}>
                  {totalVariance < 0 ? '-' : ''}{fmt(Math.abs(totalVariance), currency)}
                </span>
              </div>
            </div>
          </div>

          {/* ── Save button ── */}
          <div className={styles.footerActions}>
            <button
              type="button"
              className={styles.saveAllBtn}
              onClick={handleSave}
              disabled={monthSaving}
            >
              {monthSaving ? (
                <>
                  <span className={styles.spinner} /> Saving…
                </>
              ) : (
                <>
                  <IconSave />
                  Save All Spend for {selectedMonth}
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetAllocation;