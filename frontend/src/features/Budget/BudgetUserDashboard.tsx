// src/features/Budget/BudgetUserDashboard.tsx
import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState, AppDispatch } from '../../app/store';
import { fetchUserBudgetDashboard } from './slice/budgetSlice';
import { useBudgetPrefix } from './useBudgetPrefix';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer,
} from 'recharts';
import styles from './BudgetUserDashboard.module.css';

/* ══════════════════════════════════════════════════════════════
   CONSTANTS
══════════════════════════════════════════════════════════════ */
const FY_MONTHS = [
  'April','May','June','July','August','September',
  'October','November','December','January','February','March',
];

const QUARTERS: Record<string, string[]> = {
  Q1: ['April','May','June'],
  Q2: ['July','August','September'],
  Q3: ['October','November','December'],
  Q4: ['January','February','March'],
};

const QUARTER_LABELS: Record<string, string> = {
  Q1: 'Q1 (Apr–Jun)',
  Q2: 'Q2 (Jul–Sep)',
  Q3: 'Q3 (Oct–Dec)',
  Q4: 'Q4 (Jan–Mar)',
};

type ChartScale = 'auto' | 'thousands' | 'lakhs' | 'crores';

/* ══════════════════════════════════════════════════════════════
   FORMATTERS
══════════════════════════════════════════════════════════════ */
const fmt = (v: number): string =>
  v >= 1_00_00_000 ? `₹${(v / 1_00_00_000).toFixed(1)}Cr`
  : v >= 1_00_000  ? `₹${(v / 1_00_000).toFixed(1)}L`
  : v >= 1_000     ? `₹${(v / 1_000).toFixed(1)}K`
  : `₹${v.toLocaleString()}`;

const fmtPct = (pct: number): string => {
  if (pct > 100) return '>100%';
  if (pct <= 0)  return '0%';
  return `${pct.toFixed(1)}%`;
};

const getPctHex = (pct: number): string =>
  pct >= 80 ? '#059669' : pct >= 50 ? '#D97706' : '#E11D48';

const getPctTrend = (pct: number): { text: string; up: boolean } => {
  if (pct > 100) return { text: 'Target exceeded! 🎉', up: true  };
  if (pct >= 80) return { text: 'On track',            up: true  };
  if (pct >= 50) return { text: 'Moderate progress',   up: true  };
  return              { text: 'Needs attention',       up: false };
};

/**
 * Scale-aware Y-axis tick formatter.
 * 'auto' uses the standard fmt() which auto-detects K/L/Cr.
 * Others force a specific scale so small values (like 50K) are visible.
 */
const getScaleFormatter = (scale: ChartScale) => {
  switch (scale) {
    case 'thousands': return (v: number) => `₹${(v / 1_000).toFixed(0)}K`;
    case 'lakhs':     return (v: number) => `₹${(v / 1_00_000).toFixed(1)}L`;
    case 'crores':    return (v: number) => `₹${(v / 1_00_00_000).toFixed(2)}Cr`;
    default:          return (v: number) => fmt(v);
  }
};

const getScaleLabel = (scale: ChartScale): string => {
  switch (scale) {
    case 'thousands': return 'in Thousands (K)';
    case 'lakhs':     return 'in Lakhs (L)';
    case 'crores':    return 'in Crores (Cr)';
    default:          return 'Auto Scale';
  }
};

/**
 * Tooltip formatter — always shows the full readable amount
 * regardless of the Y-axis scale chosen.
 */
const fmtTooltip = (v: any): [string, string] => [fmt(Number(v)), ''];

/* ══════════════════════════════════════════════════════════════
   ICONS
══════════════════════════════════════════════════════════════ */
const IconTarget = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <circle cx="12" cy="12" r="6"/>
    <circle cx="12" cy="12" r="2"/>
  </svg>
);
const IconAchieved = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const IconPercent = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="5" x2="5" y2="19"/>
    <circle cx="6.5" cy="6.5" r="2.5"/>
    <circle cx="17.5" cy="17.5" r="2.5"/>
  </svg>
);
const IconGap = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="1" x2="12" y2="23"/>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
  </svg>
);
const IconPipeline = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
  </svg>
);

/* ══════════════════════════════════════════════════════════════
   KPI CARD
══════════════════════════════════════════════════════════════ */
interface KpiCardProps {
  icon: React.ReactNode;
  color: string;
  label: string;
  value: string;
  trend: string;
  up: boolean;
  subtitle?: string;
  valueColor?: string;
}

const KpiCard: React.FC<KpiCardProps> = ({
  icon, color, label, value, trend, up, subtitle, valueColor,
}) => (
  <div className={styles.kpiCard} style={{ borderLeftColor: color }}>
    <div className={styles.kpiIconWrap} style={{ background: `${color}15`, color }}>
      {icon}
    </div>
    <div className={styles.kpiBody}>
      <span className={styles.kpiLabel}>{label}</span>
      <span
        className={styles.kpiValue}
        style={valueColor ? { color: valueColor } : undefined}
      >
        {value}
      </span>
      <div className={styles.kpiFooter}>
        {subtitle && <span className={styles.kpiSubtitle}>{subtitle}</span>}
        <span className={`${styles.kpiBadge} ${up ? styles.up : styles.down}`}>
          {up ? '↑' : '↓'} {trend}
        </span>
      </div>
    </div>
  </div>
);

/* ══════════════════════════════════════════════════════════════
   CHART TOOLTIP
══════════════════════════════════════════════════════════════ */
const ChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className={styles.chartTooltip}>
      <div className={styles.tooltipLabel}>{label}</div>
      {payload.map((p: any) => (
        <div key={p.dataKey} className={styles.tooltipRow}>
          <span style={{ color: p.color, fontWeight: 600 }}>{p.name}</span>
          <span className={styles.tooltipVal}>{fmt(p.value)}</span>
        </div>
      ))}
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════
   SCALE FILTER DROPDOWN — reusable component
══════════════════════════════════════════════════════════════ */
const ScaleDropdown: React.FC<{
  value: ChartScale;
  onChange: (v: ChartScale) => void;
}> = ({ value, onChange }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
    <select
      value={value}
      onChange={e => onChange(e.target.value as ChartScale)}
      className={styles.filterSelect}
      style={{
        fontSize: 11, padding: '4px 10px', minWidth: 130,
        borderColor: value !== 'auto' ? '#4F46E5' : undefined,
        color:       value !== 'auto' ? '#4338CA' : undefined,
        background:  value !== 'auto' ? '#EEF2FF' : undefined,
        fontWeight:  value !== 'auto' ? 700       : undefined,
      }}
    >
      <option value="auto">Auto Scale</option>
      <option value="thousands">In Thousands (K)</option>
      <option value="lakhs">In Lakhs (L)</option>
      <option value="crores">In Crores (Cr)</option>
    </select>
    {value !== 'auto' && (
      <button
        type="button"
        onClick={() => onChange('auto')}
        style={{
          background: 'none', border: 'none',
          color: '#94A3B8', cursor: 'pointer',
          fontSize: 11, padding: '2px 4px',
        }}
        title="Reset to auto scale"
      >
        ✕
      </button>
    )}
  </div>
);

/* ══════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════ */
const BudgetUserDashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const prefix   = useBudgetPrefix();

  const { userDashboard: data, userDashboardLoading: loading } =
    useSelector((s: RootState) => s.budget);

  const now          = new Date();
  const cMonth       = now.getMonth() + 1;
  const defaultFY    = cMonth >= 4 ? now.getFullYear() : now.getFullYear() - 1;
  const defaultMonth = now.toLocaleString('default', { month: 'long' });

  // ── Filter state ──────────────────────────────────────────
  const [selectedYear,    setSelectedYear]    = useState<number>(defaultFY);
  const [selectedMonth,   setSelectedMonth]   = useState<string>(defaultMonth);
  const [selectedQuarter, setSelectedQuarter] = useState<string>('');

  // ── Chart scale states (one per chart) ────────────────────
  const [monthlyChartScale, setMonthlyChartScale] = useState<ChartScale>('auto');
  const [catChartScale,     setCatChartScale]     = useState<ChartScale>('auto');

  const fyLabel = `FY ${selectedYear}–${String(selectedYear + 1).slice(2)}`;

  const displayedMonths = useMemo<string[]>(() => {
    if (selectedQuarter && QUARTERS[selectedQuarter]) return QUARTERS[selectedQuarter];
    return FY_MONTHS;
  }, [selectedQuarter]);

  const handleQuarterChange = (q: string) => {
    setSelectedQuarter(q);
    if (q && QUARTERS[q]) setSelectedMonth(QUARTERS[q][0]);
  };

  // ── Fetch ─────────────────────────────────────────────────
  useEffect(() => {
    dispatch(fetchUserBudgetDashboard({ year: selectedYear, month: selectedMonth }));
  }, [dispatch, selectedYear, selectedMonth]);

  /* ── Derived ── */
  const monthlyData  = data?.monthly_data  || [];
  const categories   = data?.categories    || [];
  const fyTrend      = getPctTrend(data?.fy_pct || 0);
  const fyGap        = data?.fy_remaining  || 0;

  // ── Monthly chart data ────────────────────────────────────
  const monthlyChartData = useMemo(() =>
    displayedMonths.map(m => {
      const md = monthlyData.find((d: any) => d.month === m);
      return {
        month:    m.slice(0, 3),
        Target:   Math.round(md?.target   || 0),
        Achieved: Math.round(md?.achieved || 0),
      };
    }),
    [monthlyData, displayedMonths]
  );

  // ── Quarterly data ────────────────────────────────────────
  const quarterData = useMemo(() =>
    [
      { q:'Q1', label:'Apr–Jun', months:['April','May','June'] },
      { q:'Q2', label:'Jul–Sep', months:['July','August','September'] },
      { q:'Q3', label:'Oct–Dec', months:['October','November','December'] },
      { q:'Q4', label:'Jan–Mar', months:['January','February','March'] },
    ].map(({ q, label, months }) => {
      let t = 0, a = 0;
      months.forEach(m => {
        const md = monthlyData.find((d: any) => d.month === m);
        t += md?.target   || 0;
        a += md?.achieved || 0;
      });
      return { quarter: q, label, target: Math.round(t), achieved: Math.round(a) };
    }),
    [monthlyData]
  );

  // ── Category chart data ───────────────────────────────────
  const catChartData = useMemo(() =>
    categories.map((cat: any) => ({
      name:  cat.name,
      FY:    Math.round(cat.fy_allocated    || 0),
      Month: Math.round(cat.month_allocated || 0),
    })),
    [categories]
  );

  /* ════════════════════════════════════════════════════════════
     RENDER
  ════════════════════════════════════════════════════════════ */
  return (
    <div className={styles.dashboardRoot}>
      <main className={styles.mainContent}>

        {/* ── Header ── */}
        <div className={styles.pageHeader}>
          <div className={styles.headerLeft}>
            <button className={styles.backBtn}
              onClick={() => navigate(`${prefix}/budget/overview`)}>
              ← Back
            </button>
            <div className={styles.headerAccent} />
            <div>
              <h1 className={styles.pageTitle}>My Sales Target Dashboard</h1>
              <p className={styles.pageSubtitle}>
                {fyLabel} — Your target vs achievement
                {selectedQuarter && (
                  <span className={styles.quarterBadgeInline}>
                    {QUARTER_LABELS[selectedQuarter]}
                  </span>
                )}
              </p>
            </div>
          </div>
          <div className={styles.headerRight}>
            {/* FY */}
            <select className={styles.filterSelect} value={selectedYear}
              onChange={e => setSelectedYear(Number(e.target.value))}>
              {[defaultFY-1, defaultFY, defaultFY+1].map(y => (
                <option key={y} value={y}>FY {y}–{String(y+1).slice(2)}</option>
              ))}
            </select>

            {/* Quarter */}
            <select className={styles.filterSelect} value={selectedQuarter}
              onChange={e => handleQuarterChange(e.target.value)}
              style={{
                borderColor: selectedQuarter ? '#4F46E5' : undefined,
                color:       selectedQuarter ? '#4338CA' : undefined,
                background:  selectedQuarter ? '#EEF2FF' : undefined,
                fontWeight:  selectedQuarter ? 700       : undefined,
              }}>
              <option value="">All Quarters</option>
              {Object.entries(QUARTER_LABELS).map(([q, l]) => (
                <option key={q} value={q}>{l}</option>
              ))}
            </select>

            {/* Month */}
            <select className={styles.filterSelect} value={selectedMonth}
              onChange={e => { setSelectedMonth(e.target.value); setSelectedQuarter(''); }}>
              {FY_MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
            </select>

            <span className={styles.fyBadge}>{fyLabel}</span>
          </div>
        </div>

        {/* ── Loading ── */}
        {loading && (
          <div className={styles.loadingState}>Loading your dashboard…</div>
        )}

        {/* ── No data ── */}
        {!loading && !data?.has_data && (
          <div className={styles.emptyState}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📊</div>
            <h2>No Budget Assigned</h2>
            <p>Your admin hasn't assigned any sales target to you yet.</p>
          </div>
        )}

        {!loading && data?.has_data && (
          <>
            {/* ── KPI Cards ── */}
            <div className={styles.kpiGrid}>
              <KpiCard icon={<IconTarget />} color="#F59E0B"
                label="FY Target" value={fmt(data.fy_target)}
                trend={fyLabel} up={true} />

              <KpiCard icon={<IconAchieved />} color="#4F46E5"
                label="FY Achieved" value={fmt(data.fy_achieved)}
                subtitle={`${data.fy_deals} deal${data.fy_deals !== 1 ? 's' : ''} won`}
                trend={`${fmtPct(data.fy_pct)} of target`}
                up={data.fy_pct >= 50} />

              <KpiCard icon={<IconPercent />} color={getPctHex(data.fy_pct)}
                label="FY Achievement" value={fmtPct(data.fy_pct)}
                valueColor={getPctHex(data.fy_pct)}
                trend={fyTrend.text} up={fyTrend.up} />

              <KpiCard icon={<IconPipeline />} color="#06B6D4"
                label="Rank B Pipeline" value={`${data.fy_rank_b_count} deals`}
                subtitle={`Worth ${fmt(data.fy_rank_b_value)}`}
                trend={`${data.month_rank_b_count} in ${selectedMonth}`}
                up={data.fy_rank_b_count > 0} />

              <KpiCard icon={<IconGap />} color={fyGap > 0 ? '#E11D48' : '#059669'}
                label="FY Gap" value={fyGap > 0 ? fmt(fyGap) : '₹0'}
                valueColor={fyGap > 0 ? '#E11D48' : '#059669'}
                trend={fyGap > 0 ? 'Gap to close' : 'Target met!'}
                up={fyGap === 0} />
            </div>

            {/* ══════════════════════════════════════════════════
                MONTHLY TARGET vs ACHIEVEMENT CHART
                with Scale Dropdown Filter
            ══════════════════════════════════════════════════ */}
            <div className={styles.chartCard}>
              <div className={styles.cardHeader}>
                <span className={styles.cardTitle}>
                  📊 {selectedQuarter
                    ? QUARTER_LABELS[selectedQuarter]
                    : 'Monthly'} — Target vs Achievement
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <ScaleDropdown value={monthlyChartScale} onChange={setMonthlyChartScale} />
                  <span className={styles.cardBadge}>{fyLabel}</span>
                </div>
              </div>

              {/* Scale indicator */}
              <div style={{
                fontSize: 11, color: '#94A3B8', marginBottom: 4,
                display: 'flex', alignItems: 'center', gap: 6,
              }}>
                <span>Y-axis: {getScaleLabel(monthlyChartScale)}</span>
              </div>

              {monthlyChartData.every(d => d.Target === 0 && d.Achieved === 0) ? (
                <div style={{
                  textAlign: 'center', padding: '40px 20px',
                  color: '#94A3B8', fontSize: 13,
                }}>
                  No target or achievement data for{' '}
                  {selectedQuarter ? QUARTER_LABELS[selectedQuarter] : 'the selected period'}
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={monthlyChartData} barSize={24} barGap={4}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748B' }} />
                    <YAxis
                      tickFormatter={getScaleFormatter(monthlyChartScale)}
                      tick={{ fontSize: 11, fill: '#64748B' }}
                      width={72}
                      domain={monthlyChartScale === 'auto' ? ['auto', 'auto'] : [0, 'auto']}
                    />
                    <Tooltip
                      formatter={fmtTooltip}
                      contentStyle={{ borderRadius: 8, fontSize: 13 }}
                    />
                    <Legend wrapperStyle={{ fontSize: 12 }}
                      formatter={(v: string) => <span style={{ color: '#475569' }}>{v}</span>} />
                    <Bar dataKey="Target"   fill="#F59E0B" radius={[4,4,0,0]} name="Target" />
                    <Bar dataKey="Achieved" fill="#4F46E5" radius={[4,4,0,0]} name="Achieved" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* ══════════════════════════════════════════════════
                CATEGORY ALLOCATION CHART
                with Scale Dropdown Filter
            ══════════════════════════════════════════════════ */}
            {catChartData.length > 0 && (
              <div className={styles.chartCard}>
                <div className={styles.cardHeader}>
                  <span className={styles.cardTitle}>📦 Category-wise Target Allocation</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <ScaleDropdown value={catChartScale} onChange={setCatChartScale} />
                    <span className={styles.cardBadge}>{selectedMonth}</span>
                  </div>
                </div>

                <div style={{
                  fontSize: 11, color: '#94A3B8', marginBottom: 4,
                  display: 'flex', alignItems: 'center', gap: 6,
                }}>
                  <span>Y-axis: {getScaleLabel(catChartScale)}</span>
                </div>

                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={catChartData} barSize={20} barGap={4}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748B' }} />
                    <YAxis
                      tickFormatter={getScaleFormatter(catChartScale)}
                      tick={{ fontSize: 11, fill: '#64748B' }}
                      width={72}
                      domain={catChartScale === 'auto' ? ['auto', 'auto'] : [0, 'auto']}
                    />
                    <Tooltip
                      formatter={fmtTooltip}
                      contentStyle={{ borderRadius: 8, fontSize: 13 }}
                    />
                    <Legend wrapperStyle={{ fontSize: 12 }}
                      formatter={(v: string) => <span style={{ color: '#475569' }}>{v}</span>} />
                    <Bar dataKey="FY"    fill="#F59E0B" radius={[4,4,0,0]} name="FY Allocation" />
                    <Bar dataKey="Month" fill="#4F46E5" radius={[4,4,0,0]} name={`${selectedMonth} Allocation`} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* ── Quarterly Cards ── */}
            <div className={styles.quarterGrid}>
              {quarterData.map(q => {
                const pct = q.target > 0 ? (q.achieved / q.target) * 100 : 0;
                return (
                  <div key={q.quarter} className={styles.quarterCard}>
                    <div className={styles.quarterHeader}>
                      <span className={styles.quarterTitle}>{q.quarter}</span>
                      <span className={styles.quarterLabel}>{q.label}</span>
                    </div>
                    <div className={styles.quarterRow}>
                      <span>Target</span>
                      <span style={{ fontWeight: 700, color: '#F59E0B' }}>{fmt(q.target)}</span>
                    </div>
                    <div className={styles.quarterRow}>
                      <span>Achieved</span>
                      <span style={{ fontWeight: 700, color: '#4F46E5' }}>{fmt(q.achieved)}</span>
                    </div>
                    <div style={{
                      width: '100%', height: 5, background: '#E2E8F0',
                      borderRadius: 3, overflow: 'hidden', margin: '6px 0 4px',
                    }}>
                      <div style={{
                        width: `${Math.min(100, pct)}%`, height: '100%', borderRadius: 3,
                        background: getPctHex(pct), transition: 'width 0.4s',
                      }} />
                    </div>
                    <div style={{
                      textAlign: 'right', fontSize: 12,
                      fontWeight: 700, color: getPctHex(pct),
                    }}>
                      {fmtPct(pct)}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ── Monthly Breakdown Table ── */}
            <div className={styles.tableCard}>
              <div className={styles.tableCardHeader}>
                <span className={styles.cardTitle}>
                  📅 Month-wise Target vs Achievement
                  {selectedQuarter && (
                    <span className={styles.quarterBadgeInline}>
                      {QUARTER_LABELS[selectedQuarter]}
                    </span>
                  )}
                </span>
                <span className={styles.cardBadge}>{fyLabel}</span>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table className={styles.table}>
                  <thead>
                    <tr className={styles.tableHead}>
                      <th className={styles.th} style={{ textAlign: 'left', minWidth: 100 }}>
                        Month
                      </th>
                      <th className={styles.th} style={{ textAlign: 'right' }}>Target</th>
                      <th className={styles.th} style={{ textAlign: 'right' }}>Achieved</th>
                      <th className={styles.th} style={{ textAlign: 'right' }}>Gap</th>
                      <th className={styles.th} style={{ textAlign: 'right' }}>%</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayedMonths.map(month => {
                      const md       = monthlyData.find((d: any) => d.month === month);
                      const target   = md?.target   || 0;
                      const achieved = md?.achieved || 0;
                      const gap      = target - achieved;
                      const pct      = target > 0 ? (achieved / target) * 100 : 0;
                      const isCurrent = month === selectedMonth;

                      return (
                        <tr key={month} className={styles.tableRow}
                          style={{ background: isCurrent ? '#EEF2FF' : undefined }}>
                          <td className={styles.td} style={{
                            fontWeight: isCurrent ? 700 : 500,
                            color: isCurrent ? '#4338CA' : '#0F172A',
                          }}>
                            {month}
                            {isCurrent && (
                              <span style={{
                                marginLeft: 6, fontSize: 9, color: '#818CF8',
                                fontWeight: 700,
                              }}>● now</span>
                            )}
                          </td>
                          <td className={styles.td} style={{
                            textAlign: 'right', fontWeight: 600,
                            color: target > 0 ? '#F59E0B' : '#CBD5E1',
                          }}>
                            {target > 0 ? fmt(target) : '—'}
                          </td>
                          <td className={styles.td} style={{
                            textAlign: 'right', fontWeight: 600,
                            color: achieved > 0 ? '#4F46E5' : '#CBD5E1',
                          }}>
                            {achieved > 0 ? fmt(achieved) : '—'}
                          </td>
                          <td className={styles.td} style={{
                            textAlign: 'right', fontWeight: 600,
                            color: target > 0
                              ? (gap > 0 ? '#E11D48' : '#059669')
                              : '#CBD5E1',
                          }}>
                            {target > 0
                              ? (gap > 0 ? fmt(gap) : gap < 0 ? '✓ Exceeded' : '✓ Met')
                              : '—'}
                          </td>
                          <td className={styles.td} style={{
                            textAlign: 'right', fontWeight: 700,
                            color: target > 0 ? getPctHex(pct) : '#CBD5E1',
                          }}>
                            {target > 0 ? fmtPct(pct) : '—'}
                          </td>
                        </tr>
                      );
                    })}

                    {/* Totals Row */}
                    <tr style={{
                      background: '#F8FAFC',
                      borderTop: '2px solid #E2E8F0',
                      fontWeight: 700,
                    }}>
                      <td className={styles.td} style={{
                        fontWeight: 800, color: '#0F172A',
                      }}>
                        {selectedQuarter ? `${selectedQuarter} Total` : 'FY Total'}
                      </td>
                      <td className={styles.td} style={{ textAlign: 'right', color: '#F59E0B' }}>
                        {fmt(displayedMonths.reduce((s, m) => {
                          const md = monthlyData.find((d: any) => d.month === m);
                          return s + (md?.target || 0);
                        }, 0))}
                      </td>
                      <td className={styles.td} style={{ textAlign: 'right', color: '#4F46E5' }}>
                        {fmt(displayedMonths.reduce((s, m) => {
                          const md = monthlyData.find((d: any) => d.month === m);
                          return s + (md?.achieved || 0);
                        }, 0))}
                      </td>
                      <td className={styles.td} style={{
                        textAlign: 'right',
                        color: fyGap > 0 ? '#E11D48' : '#059669',
                      }}>
                        {fyGap > 0 ? fmt(fyGap) : '✓ Met'}
                      </td>
                      <td className={styles.td} style={{
                        textAlign: 'right',
                        color: getPctHex(data.fy_pct),
                      }}>
                        {fmtPct(data.fy_pct)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className={styles.footer}>
                Target = Budget allocation by admin · Achieved = Rank A opportunity value ·
                <span style={{ color: '#059669', fontWeight: 700 }}> ●</span> ≥80%
                <span style={{ color: '#D97706', fontWeight: 700 }}> ●</span> 50–79%
                <span style={{ color: '#E11D48', fontWeight: 700 }}> ●</span> &lt;50%
                · {fyLabel}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default BudgetUserDashboard;