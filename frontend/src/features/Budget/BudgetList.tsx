
// src/features/Budget/BudgetList.tsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState, AppDispatch } from '../../app/store';
import { fetchBudgets, deleteBudget } from './slice/budgetSlice';
import { useBudgetPrefix } from './useBudgetPrefix';
import styles from './BudgetList.module.css';

// ── Helpers ──────────────────────────────────────────────────
const currencySymbol = (c: string) =>
  ({ INR: '₹', USD: '$', EUR: '€', GBP: '£' }[c] ?? c);

const fmtAmount = (v: number, sym: string) => {
  if (v >= 10_000_000) return `${sym}${(v / 10_000_000).toFixed(2)}Cr`;
  if (v >= 100_000)    return `${sym}${(v / 100_000).toFixed(2)}L`;
  if (v >= 1_000)      return `${sym}${(v / 1_000).toFixed(1)}K`;
  return `${sym}${v}`;
};

const periodLabel = (p: string) =>
  ({ annual: 'Annual · 12 months', quarterly: 'Quarterly', monthly: 'Monthly' }[p] ?? p);

// ── SVG Icons ────────────────────────────────────────────────
const IconSearch = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

const IconPlus = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

const IconEdit = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

const IconTrash = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6M14 11v6"/>
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
  </svg>
);

const IconUser = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

const IconDashboard = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
    <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
  </svg>
);

const IconAlloc = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
  </svg>
);

// Summary card icons
const IconBudgets = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 9h20M9 21V9M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/>
  </svg>
);
const IconPlanned = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <path d="M12 8v8M8 12h8"/>
  </svg>
);
const IconSpent = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
  </svg>
);
const IconTarget = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/>
    <polyline points="16 7 22 7 22 13"/>
  </svg>
);

// ── Component ────────────────────────────────────────────────
const BudgetList: React.FC = () => {
  const dispatch    = useDispatch<AppDispatch>();
  const navigate    = useNavigate();
  const prefix      = useBudgetPrefix();
  const { budgets: rawBudgets, loading } = useSelector((s: RootState) => s.budget);

// Ensure budgets is always an array
  const budgets = Array.isArray(rawBudgets) ? rawBudgets : [];
  const currentUser = useSelector((s: RootState) => s.userLoginAuth?.user);
  const isAdmin     = currentUser?.role === 'admin' || currentUser?.role === 'manager';
  const [search, setSearch] = useState('');

  useEffect(() => { dispatch(fetchBudgets()); }, [dispatch]);

  const filtered = budgets.filter((b: any) =>
    b.title?.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id: number, title: string) => {
    if (window.confirm(`Delete "${title}"? This action cannot be undone.`)) {
      dispatch(deleteBudget(id));
    }
  };

  return (
    <div className={styles.page}>

      {/* ── Header ── */}
      <div className={styles.pageHeader}>
        <div className={styles.pageTitleBlock}>
          <h1 className={styles.pageTitle}>Budget Planner</h1>
          <p className={styles.pageSubtitle}>Manage sales budgets, allocations and ROI targets</p>
        </div>
        <div className={styles.headerRight}>
          <div className={styles.searchBar}>
            <IconSearch />
            <input
              className={styles.searchInput}
              placeholder="Search budgets…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button className={styles.createBtn} onClick={() => navigate(`${prefix}/budget/new`)}>
            <IconPlus /> New Budget
          </button>
        </div>
      </div>

      {/* ── Summary Strip ── */}
      {budgets.length > 0 && (
        <div className={styles.summaryRow}>
        {[
          {
            icon: <IconBudgets />,
            cls: styles.summIndigo,
            value: budgets.length,
            label: 'Total Budgets',
            bgValue: budgets.length, // The number for the background
          },
          {
            icon: <IconPlanned />,
            cls: styles.summCyan,
            value: fmtAmount(budgets.reduce((s: number, b: any) => s + parseFloat(b.total_budget || 0), 0), '₹'),
            label: 'Total Planned',
            bgValue: '₹', // A symbol works well here
          },
          {
            icon: <IconSpent />,
            cls: styles.summEmerald,
            value: fmtAmount(budgets.reduce((s: number, b: any) => s + parseFloat(b.total_spent || 0), 0), '₹'),
            label: 'Total Spent',
            bgValue: '$', // A different symbol for variety
          },
          {
            icon: <IconTarget />,
            cls: styles.summAmber,
            value: fmtAmount(budgets.reduce((s: number, b: any) => s + parseFloat(b.revenue_target || 0), 0), '₹'),
            label: 'Revenue Target',
            bgValue: '%', // Another symbol
          },
        ].map(({ icon, cls, value, label, bgValue }) => (
          <div key={label} className={`${styles.summCard} ${cls}`}>
            <div className={styles.summIconWrap}>{icon}</div>
            <div className={styles.summText}>
              <div className={styles.summValue}>{value}</div>
              <div className={styles.summLabel}>{label}</div>
            </div>
            {/* ADDED: This div creates the background number effect */}
            <div className={styles.summBgNumber}>{bgValue}</div>
          </div>
        ))}
      </div>
      )}

      {/* ── Loading ── */}
      {loading && (
        <div className={styles.stateBox}>
          {[1, 2, 3].map(i => <div key={i} className={styles.skeletonCard} />)}
        </div>
      )}

      {/* ── Empty ── */}
      {!loading && filtered.length === 0 && (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>💰</div>
          <h3 className={styles.emptyTitle}>No budgets yet</h3>
          <p className={styles.emptyText}>Create your first budget to start tracking spend and ROI</p>
          <button className={styles.createBtn} onClick={() => navigate(`${prefix}/budget/new`)}>
            <IconPlus /> Create Budget
          </button>
        </div>
      )}

      {/* ── Budget Cards ── */}
      {!loading && filtered.length > 0 && (
        <>
          <div className={styles.sectionLabel}>{filtered.length} budget{filtered.length !== 1 ? 's' : ''}</div>
          <div className={styles.cardGrid}>
            {filtered.map((b: any, idx: number) => {
              const sym       = currencySymbol(b.currency);
              const spent     = parseFloat(b.total_spent     || 0);
              const total     = parseFloat(b.total_budget    || 0);
              const remaining = parseFloat(b.total_remaining || 0);
              const pct       = b.overall_utilization_pct || 0;
              const revTarget = parseFloat(b.revenue_target || 0);
              const roiRatio  = spent > 0 ? (revTarget / spent).toFixed(1) : '—';
              const isOver    = spent > total;
              const isWarn    = pct > 80 && !isOver;

              return (
                <div
                  key={b.id}
                  className={styles.budgetCard}
                  style={{ animationDelay: `${idx * 60}ms` }}
                >
                  {/* Card header */}
                  <div className={styles.cardHeader}>
                    <div className={styles.cardTitleWrap}>
                      <div className={styles.cardAvatar}>
                        {b.title?.[0]?.toUpperCase() ?? 'B'}
                      </div>
                      <div className={styles.cardTitleGroup}>
                        <div className={styles.cardTitle}>
                          <span>{b.title}</span>
                          {isAdmin && b.username && (
                            <span className={styles.cardUserBadge}>
                              <IconUser /> {b.username}
                            </span>
                          )}
                        </div>
                        <div className={styles.cardPeriod}>{periodLabel(b.period)}</div>
                      </div>
                    </div>
                    <div className={styles.cardActions}>
                      <button
                        className={`${styles.iconBtn} ${styles.edit}`}
                        onClick={() => navigate(`${prefix}/budget/${b.id}/edit`)}
                        title="Edit budget"
                      >
                        <IconEdit />
                      </button>
                      <button
                        className={`${styles.iconBtn} ${styles.delete}`}
                        onClick={() => handleDelete(b.id, b.title)}
                        title="Delete budget"
                      >
                        <IconTrash />
                      </button>
                    </div>
                  </div>

                  {/* Utilization bar */}
                  <div className={styles.utilizationWrap}>
                    <div className={styles.utilizationRow}>
                      <span className={styles.utilizationLabel}>Budget utilization</span>
                      <span className={`${styles.utilizationPct} ${isOver ? styles.pctRed : isWarn ? styles.pctAmber : styles.pctGreen}`}>
                        {pct}%
                      </span>
                    </div>
                    <div className={styles.progTrack}>
                      <div
                        className={`${styles.progFill} ${isOver ? styles.progRed : isWarn ? styles.progAmber : styles.progGreen}`}
                        style={{ width: `${Math.min(pct, 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Metrics */}
                  <div className={styles.metricsRow}>
                    <div className={styles.metric}>
                      <div className={styles.metricValue}>{fmtAmount(total, sym)}</div>
                      <div className={styles.metricLabel}>Total Budget</div>
                    </div>
                    <div className={styles.metric}>
                      <div className={`${styles.metricValue} ${styles.spentColor}`}>{fmtAmount(spent, sym)}</div>
                      <div className={styles.metricLabel}>Spent</div>
                    </div>
                    <div className={styles.metric}>
                      <div className={`${styles.metricValue} ${remaining < 0 ? styles.overColor : styles.remainColor}`}>
                        {remaining < 0 ? '−' : ''}{fmtAmount(Math.abs(remaining), sym)}
                      </div>
                      <div className={styles.metricLabel}>Remaining</div>
                    </div>
                    <div className={styles.metric}>
                      <div className={`${styles.metricValue} ${styles.roiColor}`}>{roiRatio}x</div>
                      <div className={styles.metricLabel}>ROI Target</div>
                    </div>
                  </div>

                  {/* Category chips */}
                  {b.categories?.length > 0 && (
                    <div className={styles.catChips}>
                      {b.categories.slice(0, 4).map((c: any) => (
                        <span key={c.id} className={`${styles.catChip} ${
                          c.utilization_pct >= 100 ? styles.chipRed :
                          c.utilization_pct >= (c.alert_threshold || 80) ? styles.chipAmber :
                          styles.chipGreen
                        }`}>
                          {c.name} · {c.utilization_pct}%
                        </span>
                      ))}
                      {b.categories.length > 4 && (
                        <span className={styles.catChipMore}>+{b.categories.length - 4} more</span>
                      )}
                    </div>
                  )}

                  {/* CTA buttons */}
                  <div className={styles.cardFooter}>
                    <button
                      className={styles.dashBtn}
                      onClick={() => navigate(`${prefix}/budget/${b.id}/dashboard`)}
                    >
                      <IconDashboard /> Dashboard
                    </button>
                    <button
                      className={styles.allocBtn}
                      onClick={() => navigate(`${prefix}/budget/${b.id}/allocation`)}
                    >
                      <IconAlloc /> Allocations
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default BudgetList;