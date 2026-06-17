
// src/features/Budget/BudgetAdminDashboard.tsx
import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState, AppDispatch } from '../../app/store';
import {
  fetchTeamSummary,
  fetchSalesPersons,
  fetchPerUserAchievement,
  fetchAdminBudgetSummary,
  fetchAdminPerUserBudget,
  fetchBudgets,
  fetchGlobalCategories,
} from './slice/budgetSlice';
import { useBudgetPrefix } from './useBudgetPrefix';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer,
} from 'recharts';
import styles from './BudgetAdminDashboard.module.css';

/* ══════════════════════════════════════════════════════════════
   CONSTANTS
══════════════════════════════════════════════════════════════ */
const COLORS = [
  '#4F46E5','#10B981','#F59E0B','#F43F5E','#8B5CF6',
  '#06B6D4','#F97316','#84CC16','#EC4899','#14B8A6',
];

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
  Q1: 'Q1 (Apr-Jun)',
  Q2: 'Q2 (Jul-Sep)',
  Q3: 'Q3 (Oct-Dec)',
  Q4: 'Q4 (Jan-Mar)',
};

const EXCLUDED_CATEGORY_NAMES = new Set(['marketing', 'travel']);

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
  color: 'indigo'|'sky'|'emerald'|'amber'|'violet'|'rose'|'cyan';
  label: string;
  value: string;
  trend: string;
  up: boolean;
  subtitle?: string;
  valueColor?: string;
  onClick?: () => void;
}

const KpiCard: React.FC<KpiCardProps> = ({
  icon, color, label, value, trend, up, subtitle, valueColor, onClick,
}) => (
  <div
    className={`${styles.kpiCard} ${styles[`kpiAccent_${color}`]} ${onClick ? styles.kpiClickable : ''}`}
    onClick={onClick}
  >
    <div className={`${styles.kpiIconWrap} ${styles[`kpiIcon_${color}`]}`}>{icon}</div>
    <div className={styles.kpiBody}>
      <span className={styles.kpiLabel}>{label}</span>
      <span className={styles.kpiValue} style={valueColor ? { color: valueColor } : undefined}>
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
   TOOLTIPS
══════════════════════════════════════════════════════════════ */
const StackedTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const achieved  = payload.find((p: any) => p.dataKey === 'Achieved')?.value  || 0;
  const remaining = payload.find((p: any) => p.dataKey === 'Remaining')?.value || 0;
  const target    = achieved + remaining;
  const pct       = target > 0 ? (achieved / target) * 100 : 0;
  return (
    <div className={styles.chartTooltip}>
      <div className={styles.tooltipLabel}>{label}</div>
      <div className={styles.tooltipRow}>
        <span className={styles.tooltipAchieved}>Achieved</span>
        <span className={styles.tooltipVal}>{fmt(achieved)}</span>
      </div>
      <div className={styles.tooltipRow}>
        <span className={styles.tooltipRemaining}>Remaining</span>
        <span className={styles.tooltipVal}>{fmt(remaining)}</span>
      </div>
      <div className={styles.tooltipDivider} />
      <div className={styles.tooltipRow}>
        <span className={styles.tooltipMuted}>Target</span>
        <span>
          <span className={styles.tooltipVal}>{fmt(target)}</span>
          <span style={{ color: getPctHex(pct), marginLeft: 4, fontWeight: 700 }}>
            ({fmtPct(pct)})
          </span>
        </span>
      </div>
    </div>
  );
};

const CatTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const total = payload.reduce((s: number, p: any) => s + (p.value || 0), 0);
  return (
    <div className={styles.chartTooltip}>
      <div className={styles.tooltipLabel}>{label}</div>
      {payload.map((p: any) => (
        <div key={p.dataKey} className={styles.tooltipRow}>
          <span style={{ color: p.color, fontWeight: 600 }}>{p.name}</span>
          <span className={styles.tooltipVal}>{fmt(p.value)}</span>
        </div>
      ))}
      {payload.length > 1 && (
        <>
          <div className={styles.tooltipDivider} />
          <div className={styles.tooltipRow}>
            <span className={styles.tooltipMuted}>Total</span>
            <span className={styles.tooltipVal} style={{ fontWeight: 700 }}>{fmt(total)}</span>
          </div>
        </>
      )}
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════
   QUARTERLY CARD
══════════════════════════════════════════════════════════════ */
const QuarterCard: React.FC<{
  q: string; label: string; target: number; achieved: number;
}> = ({ q, label, target, achieved }) => {
  const pct = target > 0 ? (achieved / target) * 100 : 0;
  return (
    <div className={styles.quarterCard}>
      <div className={styles.quarterHeader}>
        <span className={styles.quarterTitle}>{q}</span>
        <span className={styles.quarterLabel}>{label}</span>
      </div>
      <div className={styles.quarterRow}>
        <span className={styles.quarterKey}>Target</span>
        <span className={styles.quarterTarget}>{fmt(target)}</span>
      </div>
      <div className={styles.quarterRow}>
        <span className={styles.quarterKey}>Achieved</span>
        <span className={styles.quarterAchieved}>{fmt(achieved)}</span>
      </div>
      <div style={{
        width: '100%', height: 5, background: '#E2E8F0',
        borderRadius: 3, overflow: 'hidden', margin: '8px 0 4px',
      }}>
        <div style={{
          width: `${Math.min(100, Math.max(0, pct))}%`,
          height: '100%', borderRadius: 3,
          background: pct >= 80 ? '#059669' : pct >= 50 ? '#D97706' : '#E11D48',
          transition: 'width 0.4s',
        }} />
      </div>
      <div className={styles.quarterPct} style={{ color: getPctHex(pct), fontWeight: 700 }}>
        {fmtPct(pct)} achieved
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════ */
const BudgetAdminDashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const prefix   = useBudgetPrefix();

  const currentUser = useSelector((s: RootState) => s.userLoginAuth?.user);
  const {
    teamSummary,
    salesPersons,
    adminSummary,
    adminPerUserBudget,
    adminSummaryLoading,
    adminPerUserLoading,
    budgets,
    categories,
  } = useSelector((s: RootState) => s.budget);

  const safeBudgets = Array.isArray(budgets)
    ? budgets
    : Array.isArray((budgets as any)?.results)
      ? (budgets as any).results
      : [];
  const safeEmpData = Array.isArray(adminPerUserBudget)
    ? adminPerUserBudget
    : Array.isArray((adminPerUserBudget as any)?.results)
      ? (adminPerUserBudget as any).results
      : [];
  const safeSalesPersons = Array.isArray(salesPersons)
    ? salesPersons
    : Array.isArray((salesPersons as any)?.results)
      ? (salesPersons as any).results
      : [];
  const safeGlobalCategories = Array.isArray(categories)
    ? categories
    : Array.isArray((categories as any)?.results)
      ? (categories as any).results
      : [];

  const isAdmin = currentUser?.role === 'admin';

  const now          = new Date();
  const cMonth       = now.getMonth() + 1;
  const defaultFY    = cMonth >= 4 ? now.getFullYear() : now.getFullYear() - 1;
  const defaultMonth = now.toLocaleString('default', { month: 'long' });

  const [selectedYear,    setSelectedYear]    = useState<number>(defaultFY);
  const [selectedMonth,   setSelectedMonth]   = useState<string>(defaultMonth);
  const [selectedQuarter, setSelectedQuarter] = useState<string>('');
  const [loading,         setLoading]         = useState(true);
  const [catChartCatId,   setCatChartCatId]   = useState<string>('');
  const [catChartSubId,   setCatChartSubId]   = useState<string>('');

  const fyLabel = `FY ${selectedYear}–${String(selectedYear + 1).slice(2)}`;

  const displayedMonths = useMemo<string[]>(() => {
    if (selectedQuarter && QUARTERS[selectedQuarter]) return QUARTERS[selectedQuarter];
    return FY_MONTHS;
  }, [selectedQuarter]);

  const handleQuarterChange = (q: string) => {
    setSelectedQuarter(q);
    if (q && QUARTERS[q]) setSelectedMonth(QUARTERS[q][0]);
  };

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      await Promise.all([
        dispatch(fetchTeamSummary()),
        dispatch(fetchSalesPersons()),
        dispatch(fetchBudgets()),
        dispatch(fetchGlobalCategories()),
        dispatch(fetchAdminBudgetSummary({ year: selectedYear, month: selectedMonth })),
        dispatch(fetchAdminPerUserBudget({ year: selectedYear, month: selectedMonth })),
        dispatch(fetchPerUserAchievement()),
      ]);
      setLoading(false);
    };
    fetchAll();
  }, [dispatch, selectedYear, selectedMonth]);

  if (!isAdmin) {
    return <div className={styles.accessDenied}>Access Denied — Admin only</div>;
  }

  /* ── DERIVED DATA ── */
  const empData = safeEmpData;

  const combinedUserData = useMemo(() =>
    empData.map((emp: any) => {
      const monthlyTarget:   Record<string, number> = {};
      const monthlyAchieved: Record<string, number> = {};
      const monthlyRows = Array.isArray(emp?.monthly_data) ? emp.monthly_data : [];
      monthlyRows.forEach((md: any) => {
        monthlyTarget[md.month]   = md.target   || 0;
        monthlyAchieved[md.month] = md.achieved || 0;
      });
      const teamRow = teamSummary.find(
        (t: any) =>
          t.sales_persons?.includes(emp.username) ||
          t.sales_persons?.includes(emp.full_name)
      );
      return {
        id:             emp.user_id,
        name:           emp.full_name || emp.username,
        fyTarget:       emp.fy_target,
        fyAchieved:     emp.fy_achieved,
        fyRemaining:    Math.max(0, emp.fy_remaining),
        fyPct:          emp.fy_pct,
        wonCount:       emp.fy_deals,
        monthTarget:    emp.month_target,
        monthAchieved:  emp.month_achieved,
        quarterTarget:  emp.quarter_target,
        qTarget:        teamRow?.this_quarter || emp.quarter_target || 0,
        monthlyTarget,
        monthlyAchieved,
      };
    }),
    [empData, teamSummary]
  );

  const userStackedData = useMemo(() => {
    if (!selectedQuarter) {
      return combinedUserData.map(u => ({
        name: u.name,
        Achieved:  Math.round(u.fyAchieved),
        Remaining: Math.round(u.fyRemaining),
      }));
    }
    const qMonths = QUARTERS[selectedQuarter] || [];
    return combinedUserData.map(u => {
      const qT = qMonths.reduce((s, m) => s + (u.monthlyTarget[m]   || 0), 0);
      const qA = qMonths.reduce((s, m) => s + (u.monthlyAchieved[m] || 0), 0);
      return {
        name: u.name,
        Achieved:  Math.round(qA),
        Remaining: Math.round(Math.max(0, qT - qA)),
      };
    });
  }, [combinedUserData, selectedQuarter]);

  const quarterData = useMemo(() => [
  { q:'Q1', label:'Apr–Jun', months:['April','May','June'] },
  { q:'Q2', label:'Jul–Sep', months:['July','August','September'] },
  { q:'Q3', label:'Oct–Dec', months:['October','November','December'] },
  { q:'Q4', label:'Jan–Mar', months:['January','February','March'] },
].map(({ q, label, months }) => {
  let target = 0, achieved = 0;
  months.forEach(m => combinedUserData.forEach(u => {
    target   += u.monthlyTarget[m]   || 0;   // ✅ Total target for quarter
    achieved += u.monthlyAchieved[m] || 0;   // ✅ Total achieved for quarter
  }));
  return {
    quarter:   q,
    label,
    Target:    Math.round(target),
    Achieved:  Math.round(achieved),
    Remaining: Math.round(Math.max(0, target - achieved)),  // ← THIS IS THE FIX
  };
}), [combinedUserData]);

  /* ── Category chart ── */
  const globalCatList = useMemo(() => {
    const catMap: Record<string, { id: string; name: string; subs: { id: string; name: string }[] }> = {};
    safeGlobalCategories.forEach((cat: any) => {
      const catId = String(cat?.id ?? '').trim();
      const catName = String(cat?.name ?? '').trim();
      if (!catId || !catName || EXCLUDED_CATEGORY_NAMES.has(catName.toLowerCase())) return;
      if (!catMap[catId]) catMap[catId] = { id: catId, name: catName, subs: [] };

      const subRows = Array.isArray(cat?.subcategories) ? cat.subcategories : [];
      subRows.forEach((sub: any) => {
        const subId = String(sub?.id ?? '').trim();
        const subName = String(sub?.name ?? '').trim();
        if (!subId || !subName) return;
        if (!catMap[catId].subs.find((s: any) => s.id === subId)) {
          catMap[catId].subs.push({ id: subId, name: subName });
        }
      });
    });
    return Object.values(catMap);
  }, [safeGlobalCategories]);

  const selectedCatObj = globalCatList.find(c => c.id === catChartCatId);
  const subListForCat  = selectedCatObj?.subs || [];
  const globalCategoryNameSet = useMemo(
    () => new Set(globalCatList.map((c) => String(c.name || '').trim().toLowerCase()).filter(Boolean)),
    [globalCatList]
  );

  const handleCatChange = (catId: string) => {
    setCatChartCatId(catId);
    setCatChartSubId('');
  };

  const categoryChartData = useMemo(() => {
    const months = selectedQuarter && QUARTERS[selectedQuarter]
      ? QUARTERS[selectedQuarter]
      : [selectedMonth];

    const entries: any[] = [];
    safeBudgets.forEach((b: any) => {
      const periodRows = Array.isArray(b?.period_entries) ? b.period_entries : [];
      periodRows.forEach((pe: any) => {
        if (!months.includes(pe.month)) return;
        const peCatId = String(pe.category_id ?? '').trim();
        const matchedCatById = peCatId
          ? globalCatList.find((c) => c.id === peCatId)
          : undefined;
        const rawCatName = String(pe.category_name || '').trim();
        const resolvedCatName = matchedCatById?.name || rawCatName;

        // Keep only categories that exist in the current category master list.
        if (!resolvedCatName || EXCLUDED_CATEGORY_NAMES.has(resolvedCatName.toLowerCase()) || !globalCategoryNameSet.has(resolvedCatName.toLowerCase())) return;

        if (catChartCatId) {
          const catMatch =
            peCatId === catChartCatId ||
            resolvedCatName === selectedCatObj?.name;
          if (!catMatch) return;
          if (catChartSubId) {
            const subName = subListForCat.find((s: any) => s.id === catChartSubId)?.name;
            const subMatch =
              String(pe.subcategory_id) === catChartSubId ||
              pe.subcategory_name === subName;
            if (!subMatch) return;
          }
        }
        entries.push({ ...pe, __resolvedCatName: resolvedCatName });
      });
    });

    if (entries.length === 0) return [];

    const userMap: Record<string, Record<string, number>> = {};
    const userNameById: Record<string, string> = {};
    safeSalesPersons.forEach((p: any) => {
      const id = String(p?.id ?? '').trim();
      const name = String(p?.full_name || p?.username || '').trim();
      if (id && name) userNameById[id] = name;
    });
    combinedUserData.forEach((u: any) => {
      const id = String(u?.id ?? '').trim();
      const name = String(u?.name || '').trim();
      if (id && name && !userNameById[id]) userNameById[id] = name;
    });

    entries.forEach(pe => {
      const userName =
        userNameById[String(pe?.user_id ?? '').trim()] ||
        String(pe?.sales_person_name || pe?.user_name || pe?.username || '').trim();
      if (!userName) return;
      const catName  = pe.__resolvedCatName;
      if (!userMap[userName]) userMap[userName] = {};
      userMap[userName][catName] = (userMap[userName][catName] || 0) + parseFloat(pe.allocated || 0);
    });

    const allCats = new Set<string>();
    Object.values(userMap).forEach(cats => Object.keys(cats).forEach(c => allCats.add(c)));

    return Object.entries(userMap).map(([userName, cats]) => {
      const point: Record<string, any> = { name: userName };
      allCats.forEach(cat => { point[cat] = cats[cat] || 0; });
      return point;
    });
  }, [safeBudgets, catChartCatId, catChartSubId, selectedMonth, selectedQuarter,
      safeSalesPersons, selectedCatObj, subListForCat, globalCatList, globalCategoryNameSet, combinedUserData]);

  const catChartBarKeys = useMemo(() => {
    const keys = new Set<string>();
    categoryChartData.forEach(pt => Object.keys(pt).forEach(k => { if (k !== 'name') keys.add(k); }));
    return Array.from(keys);
  }, [categoryChartData]);

  /* ── KPI AGGREGATES ── */
  const totalFYTarget   = adminSummary?.fy_total_target   || combinedUserData.reduce((s, u) => s + u.fyTarget,   0);
  const totalFYAchieved = adminSummary?.fy_achieved        || combinedUserData.reduce((s, u) => s + u.fyAchieved, 0);
  const totalFYPct      = adminSummary?.fy_achievement_pct || (totalFYTarget > 0 ? (totalFYAchieved / totalFYTarget) * 100 : 0);
  const totalGap        = Math.max(0, totalFYTarget - totalFYAchieved);
  const totalWon        = adminSummary?.fy_deals_closed    || combinedUserData.reduce((s, u) => s + u.wonCount, 0);

  const totalMonthTarget   = combinedUserData.reduce((s, u) => s + u.monthTarget,   0);
  const totalMonthAchieved = combinedUserData.reduce((s, u) => s + u.monthAchieved, 0);
  const totalMonthGap      = totalMonthTarget - totalMonthAchieved;
  const totalMonthPct      = totalMonthTarget > 0 ? (totalMonthAchieved / totalMonthTarget) * 100 : 0;

  const fyTrend    = getPctTrend(totalFYPct);
  const fyPctColor: KpiCardProps['color'] = totalFYPct >= 80 ? 'emerald' : totalFYPct >= 50 ? 'amber' : 'rose';
  const isDataLoading = loading || adminSummaryLoading || adminPerUserLoading;

  /* ════════════════════════════════════════════════════════════
     RENDER
  ════════════════════════════════════════════════════════════ */
  return (
    <div className={styles.dashboardRoot}>
      <main className={styles.mainContent}>

        {/* ── PAGE HEADER ── */}
        <div className={styles.monthHeader}>
          <div className={styles.monthHeaderLeft}>
            <button className={styles.backBtn}
              onClick={() => navigate(`${prefix}/budget/overview`)}>
              ← Back
            </button>
            <div className={styles.headerAccent} />
            <div className={styles.monthInfo}>
              <p className={styles.monthTitle}>Budget Dashboard</p>
              <p className={styles.monthSubtitle}>
                {fyLabel} — Target vs Rank A Achievement
                {selectedQuarter && (
                  <span style={{
                    marginLeft: 8, background: '#EEF2FF', color: '#4338CA',
                    borderRadius: 12, padding: '2px 10px', fontSize: 12, fontWeight: 700,
                  }}>
                    {QUARTER_LABELS[selectedQuarter]}
                  </span>
                )}
              </p>
            </div>
          </div>

          <div className={styles.monthHeaderRight}>
            {/* FY */}
            {/* <select
              value={selectedYear}
              onChange={e => setSelectedYear(Number(e.target.value))}
              className={styles.headerSelect}
            >
              {[defaultFY - 1, defaultFY, defaultFY + 1].map(y => (
                <option key={y} value={y}>FY {y}–{String(y + 1).slice(2)}</option>
              ))}
            </select> */}

            {/* Quarter — dropdown */}
            <select
              value={selectedQuarter}
              onChange={e => handleQuarterChange(e.target.value)}
              className={styles.headerSelect}
              style={{
                borderColor: selectedQuarter ? '#4F46E5' : undefined,
                color:       selectedQuarter ? '#4338CA' : undefined,
                background:  selectedQuarter ? '#EEF2FF' : undefined,
                fontWeight:  selectedQuarter ? 700       : undefined,
              }}
            >
              <option value="">All Quarters</option>
              {Object.entries(QUARTER_LABELS).map(([q, label]) => (
                <option key={q} value={q}>{label}</option>
              ))}
            </select>

            {/* Month */}
            <select
              value={selectedMonth}
              onChange={e => { setSelectedMonth(e.target.value); setSelectedQuarter(''); }}
              className={styles.headerSelect}
            >
              {FY_MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
            </select>

            {/* <span className={styles.monthPeriodBadge}>{fyLabel}</span>
            <span className={styles.teamBadge}>
              {salesPersons.length} member{salesPersons.length !== 1 ? 's' : ''}
            </span> */}
          </div>
        </div>

        {isDataLoading && (
          <div className={styles.loadingState}>
            <div className={styles.loadingText}>Loading dashboard data…</div>
          </div>
        )}

        {!isDataLoading && (
          <>
            {/* ── KPI GRID ── */}
            <div className={styles.kpiGrid}>
              <KpiCard icon={<IconTarget />} color="amber"
                label="FY Target" value={fmt(totalFYTarget)}
                trend={fyLabel} up={true} />
              <KpiCard icon={<IconAchieved />} color="indigo"
                label="FY Achieved" value={fmt(totalFYAchieved)}
                subtitle={`${totalWon} deal${totalWon !== 1 ? 's' : ''} won (Rank A)`}
                trend={totalFYPct > 100 ? 'Target exceeded!' : `${fmtPct(totalFYPct)} of target`}
                up={totalFYPct >= 50} />
              <KpiCard icon={<IconPercent />} color={fyPctColor}
                label="FY Achievement" value={fmtPct(totalFYPct)}
                valueColor={getPctHex(totalFYPct)}
                trend={fyTrend.text} up={fyTrend.up} />
              <KpiCard icon={<IconPipeline />} color="cyan"
                label="Rank B — Pipeline"
                value={`${adminSummary?.fy_rank_b_count || 0} deals`}
                trend={`${adminSummary?.month_rank_b_count || 0} active in ${selectedMonth}`}
                up={(adminSummary?.fy_rank_b_count || 0) > 0} />
              <KpiCard icon={<IconGap />}
                color={totalGap > 0 ? 'rose' : 'emerald'}
                label="FY Gap" value={totalGap > 0 ? fmt(totalGap) : '₹0'}
                valueColor={totalGap > 0 ? '#E11D48' : '#059669'}
                trend={totalGap > 0 ? 'Gap to close' : 'No gap — target met!'}
                up={totalGap === 0} />
            </div>

            {/* ── CHARTS ROW ── */}
            <div className={styles.chartsRow}>
              <div className={`${styles.chartCard} ${styles.cardBorderIndigo}`}>
                <div className={styles.cardHeader}>
                  <span className={styles.cardTitle}>
                    📊 {selectedQuarter ? QUARTER_LABELS[selectedQuarter] : 'FY'} — Target vs Achievement
                  </span>
                  <span className={styles.cardBadge}>{fyLabel}</span>
                </div>
                {userStackedData.length === 0 ? (
                  <div className={styles.noData}>
                    <span className={styles.noDataIcon}>📊</span>
                    <span>No data available</span>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={Math.max(280, userStackedData.length * 60)}>
                    <BarChart data={userStackedData} barSize={38}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                      <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#334155' }} />
                      <YAxis tickFormatter={fmt} tick={{ fontSize: 11, fill: '#64748B' }} width={72} />
                      <Tooltip content={<StackedTooltip />} />
                      <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
                        formatter={(v: string) => <span style={{ color: '#475569' }}>{v}</span>} />
                      <Bar dataKey="Achieved"  stackId="a" fill="#4F46E5" name="Achieved (Rank A)" />
                      <Bar dataKey="Remaining" stackId="a" fill="#F59E0B" radius={[4,4,0,0]} name="Remaining Target" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>

              <div className={`${styles.chartCard} ${styles.cardBorderAmber}`}>
                <div className={styles.cardHeader}>
                  <span className={styles.cardTitle}>📈 Quarterly Summary</span>
                  <span className={`${styles.cardBadge} ${styles.badgeAmber}`}>{fyLabel}</span>
                </div>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={quarterData} barSize={32}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                    <XAxis dataKey="quarter" tick={{ fontSize: 12, fill: '#64748B' }} />
                    <YAxis tickFormatter={fmt} tick={{ fontSize: 11, fill: '#64748B' }} width={72} />
                    <Tooltip content={<StackedTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 12 }}
                      formatter={(v: string) => <span style={{ color: '#475569' }}>{v}</span>} />
                    <Bar dataKey="Achieved"  stackId="a" fill="#4F46E5" name="Achieved" />
                    <Bar dataKey="Remaining" stackId="a" fill="#F59E0B" radius={[4,4,0,0]} name="Remaining" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* ── QUARTER CARDS ── */}
            <div className={styles.chartsRow3}>
              {quarterData.map(q => (
                <QuarterCard key={q.quarter} q={q.quarter} label={q.label}
                  target={q.Target} achieved={q.Achieved} />
              ))}
            </div>

            {/* ── CATEGORY ALLOCATION CHART ── */}
            <div className={`${styles.chartCard} ${styles.cardBorderIndigo}`} style={{ marginBottom: 20 }}>
              <div className={styles.cardHeader} style={{ flexWrap: 'wrap', gap: 10 }}>
                <span className={styles.cardTitle}>📦 Category-wise Target Allocation</span>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                  <select
                    value={catChartCatId}
                    onChange={e => handleCatChange(e.target.value)}
                    className={styles.headerSelect}
                    style={{ minWidth: 150, fontSize: 12 }}
                  >
                    <option value="">All Categories</option>
                    {globalCatList.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>

                  <select
                    value={catChartSubId}
                    onChange={e => setCatChartSubId(e.target.value)}
                    disabled={!catChartCatId}
                    className={styles.headerSelect}
                    style={{
                      minWidth: 150, fontSize: 12,
                      opacity: catChartCatId ? 1 : 0.5,
                      cursor: catChartCatId ? 'pointer' : 'not-allowed',
                    }}
                  >
                    <option value="">All Subcategories</option>
                    {subListForCat.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>

                  {catChartCatId && (
                    <button type="button"
                      onClick={() => { setCatChartCatId(''); setCatChartSubId(''); }}
                      style={{
                        padding: '4px 10px', borderRadius: 6,
                        border: '1px solid #E2E8F0', background: '#F8FAFC',
                        color: '#94A3B8', fontSize: 11, cursor: 'pointer',
                      }}>
                      ✕ Clear
                    </button>
                  )}

                  <span style={{ fontSize: 11, color: '#94A3B8' }}>
                    {selectedQuarter ? QUARTER_LABELS[selectedQuarter] : selectedMonth}
                  </span>
                </div>
              </div>

              {categoryChartData.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '28px 20px', color: '#94A3B8', fontSize: 13 }}>
                  No allocation data for {selectedQuarter ? QUARTER_LABELS[selectedQuarter] : selectedMonth}
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={categoryChartData} barSize={catChartBarKeys.length > 3 ? 16 : 24} barGap={2}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748B' }} />
                    <YAxis tickFormatter={fmt} tick={{ fontSize: 11, fill: '#64748B' }} width={72} />
                    <Tooltip content={<CatTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 11 }}
                      formatter={(v: string) => <span style={{ color: '#475569' }}>{v}</span>} />
                    {catChartBarKeys.map((key, i) => (
                      <Bar key={key} dataKey={key} fill={COLORS[i % COLORS.length]}
                        radius={[3,3,0,0]} name={key} />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* ══════════════════════════════════════════════════
                TEAM PERFORMANCE TABLE
                FY% and Month% — percentage ONLY (no progress bar)
            ══════════════════════════════════════════════════ */}
            <div className={styles.tableCard}>
              <div className={styles.tableCardHeader}>
                <span className={styles.cardTitle}>👥 Team Performance</span>
                <span className={styles.cardBadge}>
                  {selectedQuarter ? `${selectedQuarter} · ` : ''}{selectedMonth} · {fyLabel}
                </span>
              </div>

              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th colSpan={2} className={`${styles.th} ${styles.thLeft} ${styles.groupHeaderBase}`} />
                      <th colSpan={5} className={`${styles.th} ${styles.groupHeaderFY}`}>
                        📅 Financial Year — {fyLabel}
                      </th>
                      <th colSpan={4} className={`${styles.th} ${styles.groupHeaderMonth}`}>
                        🗓️ {selectedMonth} — Target vs Achieved
                      </th>
                    </tr>
                    <tr className={styles.tableHead}>
                      <th className={`${styles.th} ${styles.thLeft}`}>#</th>
                      <th className={`${styles.th} ${styles.thLeft}`}>Sales Person</th>
                      <th className={`${styles.th} ${styles.thRight} ${styles.thFY}`}>FY Target</th>
                      <th className={`${styles.th} ${styles.thRight} ${styles.thFY}`}>FY Achieved</th>
                      <th className={`${styles.th} ${styles.thRight} ${styles.thFY}`}>FY %</th>
                      <th className={`${styles.th} ${styles.thRight} ${styles.thFY}`}>Deals Won</th>
                      <th className={`${styles.th} ${styles.thRight} ${styles.thFY}`}>FY Gap</th>
                      <th className={`${styles.th} ${styles.thRight} ${styles.thMonth}`}>{selectedMonth} Target</th>
                      <th className={`${styles.th} ${styles.thRight} ${styles.thMonth}`}>{selectedMonth} Achieved</th>
                      <th className={`${styles.th} ${styles.thRight} ${styles.thMonth}`}>{selectedMonth} %</th>
                      <th className={`${styles.th} ${styles.thRight} ${styles.thMonth}`}>{selectedMonth} Gap</th>
                    </tr>
                  </thead>

                  <tbody>
                    {combinedUserData.map((u, i) => {
                      const fyGap    = u.fyTarget    - u.fyAchieved;
                      const monthGap = u.monthTarget - u.monthAchieved;
                      const monthPct = u.monthTarget > 0
                        ? (u.monthAchieved / u.monthTarget) * 100
                        : 0;

                      return (
                        <tr key={u.id} className={styles.tableRow}>
                          <td className={`${styles.td} ${styles.tdMuted}`}>{i + 1}</td>

                          <td className={styles.td}>
                            <div className={styles.personCell}>
                              <div className={styles.avatar} style={{
                                background: `${COLORS[i % COLORS.length]}18`,
                                color:       COLORS[i % COLORS.length],
                                borderColor: `${COLORS[i % COLORS.length]}40`,
                              }}>
                                {u.name[0].toUpperCase()}
                              </div>
                              <div>
                                <div className={styles.personName}>{u.name}</div>
                                <div className={styles.personSub}>Q: {fmt(u.quarterTarget)}</div>
                              </div>
                            </div>
                          </td>

                          {/* FY Target */}
                          <td className={`${styles.td} ${styles.tdRight} ${styles.tdTarget}`}
                            style={{ background: '#FAFBFF' }}>
                            {fmt(u.fyTarget)}
                          </td>

                          {/* FY Achieved */}
                          <td className={`${styles.td} ${styles.tdRight} ${styles.tdAchieved}`}
                            style={{ background: '#FAFBFF' }}>
                            {fmt(u.fyAchieved)}
                          </td>

                          {/* ── FY % — percentage only, NO progress bar ── */}
                          <td className={`${styles.td} ${styles.tdRight}`}
                            style={{ background: '#FAFBFF' }}>
                            <span style={{
                              fontSize: 13,
                              fontWeight: 700,
                              color: getPctHex(u.fyPct),
                            }}>
                              {fmtPct(u.fyPct)}
                            </span>
                          </td>

                          {/* Deals Won */}
                          <td className={`${styles.td} ${styles.tdRight}`}
                            style={{ background: '#FAFBFF' }}>
                            <span className={u.wonCount > 0 ? styles.wonBadge : styles.wonBadgeEmpty}>
                              {u.wonCount}
                            </span>
                          </td>

                          {/* FY Gap */}
                          <td className={`${styles.td} ${styles.tdRight}`}
                            style={{ background: '#FAFBFF' }}>
                            <span style={{
                              fontWeight: 600,
                              color: fyGap > 0 ? '#E11D48' : '#059669',
                            }}>
                              {fyGap > 0 ? fmt(fyGap) : fyGap < 0 ? '✓ Exceeded' : '✓ Met'}
                            </span>
                          </td>

                          {/* Month Target */}
                          <td className={`${styles.td} ${styles.tdRight}`}
                            style={{ background: '#F0FDF4', color: '#065F46', fontWeight: 600 }}>
                            {u.monthTarget > 0
                              ? fmt(u.monthTarget)
                              : <span style={{ color: '#CBD5E1' }}>—</span>}
                          </td>

                          {/* Month Achieved */}
                          <td className={`${styles.td} ${styles.tdRight}`}
                            style={{ background: '#F0FDF4', color: '#065F46', fontWeight: 600 }}>
                            {fmt(u.monthAchieved)}
                          </td>

                          {/* ── Month % — percentage only, NO progress bar ── */}
                          <td className={`${styles.td} ${styles.tdRight}`}
                            style={{ background: '#F0FDF4' }}>
                            {u.monthTarget > 0 ? (
                              <span style={{
                                fontSize: 13,
                                fontWeight: 700,
                                color: getPctHex(monthPct),
                              }}>
                                {fmtPct(monthPct)}
                              </span>
                            ) : (
                              <span style={{ color: '#CBD5E1', fontSize: 11 }}>No target</span>
                            )}
                          </td>

                          {/* Month Gap */}
                          <td className={`${styles.td} ${styles.tdRight}`}
                            style={{ background: '#F0FDF4' }}>
                            {u.monthTarget > 0 ? (
                              <span style={{
                                fontWeight: 600,
                                color: monthGap > 0 ? '#E11D48' : '#059669',
                              }}>
                                {monthGap > 0 ? fmt(monthGap) : monthGap < 0 ? '✓ Exceeded' : '✓ Met'}
                              </span>
                            ) : (
                              <span style={{ color: '#CBD5E1', fontSize: 11 }}>—</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}

                    {combinedUserData.length === 0 && (
                      <tr>
                        <td colSpan={11} className={styles.noDataRow}>
                          No team data available for selected period
                        </td>
                      </tr>
                    )}

                    {/* ── Totals Row ── */}
                    {combinedUserData.length > 0 && (
                      <tr className={styles.tableTotal}>
                        <td className={styles.td} />
                        <td className={`${styles.td} ${styles.totalLabel}`}>Team Total</td>

                        <td className={`${styles.td} ${styles.tdRight} ${styles.tdTarget}`}
                          style={{ background: '#EEF2FF' }}>
                          {fmt(totalFYTarget)}
                        </td>
                        <td className={`${styles.td} ${styles.tdRight} ${styles.tdAchieved}`}
                          style={{ background: '#EEF2FF' }}>
                          {fmt(totalFYAchieved)}
                        </td>

                        {/* ── Total FY % — percentage only ── */}
                        <td className={`${styles.td} ${styles.tdRight}`}
                          style={{ background: '#EEF2FF' }}>
                          <span style={{
                            fontSize: 13,
                            fontWeight: 700,
                            color: getPctHex(totalFYPct),
                          }}>
                            {fmtPct(totalFYPct)}
                          </span>
                        </td>

                        <td className={`${styles.td} ${styles.tdRight} ${styles.totalLabel}`}
                          style={{ background: '#EEF2FF' }}>
                          {totalWon}
                        </td>
                        <td className={`${styles.td} ${styles.tdRight}`}
                          style={{ background: '#EEF2FF' }}>
                          <span style={{
                            fontWeight: 700,
                            color: totalGap > 0 ? '#E11D48' : '#059669',
                          }}>
                            {totalGap > 0 ? fmt(totalGap) : '✓ Met'}
                          </span>
                        </td>

                        <td className={`${styles.td} ${styles.tdRight}`}
                          style={{ background: '#ECFDF5', color: '#065F46', fontWeight: 700 }}>
                          {fmt(totalMonthTarget)}
                        </td>
                        <td className={`${styles.td} ${styles.tdRight}`}
                          style={{ background: '#ECFDF5', color: '#065F46', fontWeight: 700 }}>
                          {fmt(totalMonthAchieved)}
                        </td>

                        {/* ── Total Month % — percentage only ── */}
                        <td className={`${styles.td} ${styles.tdRight}`}
                          style={{ background: '#ECFDF5' }}>
                          <span style={{
                            fontSize: 13,
                            fontWeight: 700,
                            color: getPctHex(totalMonthPct),
                          }}>
                            {fmtPct(totalMonthPct)}
                          </span>
                        </td>

                        <td className={`${styles.td} ${styles.tdRight}`}
                          style={{ background: '#ECFDF5' }}>
                          <span style={{
                            fontWeight: 700,
                            color: totalMonthGap > 0 ? '#E11D48' : '#059669',
                          }}>
                            {totalMonthGap > 0
                              ? fmt(totalMonthGap)
                              : totalMonthGap < 0
                                ? '✓ Exceeded'
                                : '✓ Met'}
                          </span>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ══════════════════════════════════════════════════
                MONTHLY BREAKDOWN TABLE
                Person name and Target label — more breathing room
            ══════════════════════════════════════════════════ */}
            <div className={styles.tableCard}>
              <div className={styles.tableCardHeader}>
                <span className={styles.cardTitle}>
                  📅 Month-wise Target vs Achievement
                  {selectedQuarter && (
                    <span style={{
                      marginLeft: 8, background: '#EEF2FF', color: '#4338CA',
                      borderRadius: 12, padding: '2px 10px', fontSize: 12,
                    }}>
                      {QUARTER_LABELS[selectedQuarter]}
                    </span>
                  )}
                </span>
                <span className={`${styles.cardBadge} ${styles.badgeEmerald}`}>{fyLabel}</span>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table className={styles.table}>
                  <thead>
                    <tr className={styles.tableHead}>
                      <th className={`${styles.th} ${styles.thLeft}`} style={{ minWidth: 180 }}>
                        Sales Person
                      </th>
                      {displayedMonths.map(m => (
                        <th key={m} className={styles.th} style={{
                          textAlign: 'center', fontSize: 11, whiteSpace: 'nowrap', minWidth: 72,
                          background: m === selectedMonth ? '#EEF2FF' : undefined,
                          color:      m === selectedMonth ? '#4338CA' : undefined,
                          borderBottom: m === selectedMonth ? '2px solid #4F46E5' : undefined,
                        }}>
                          {m.slice(0, 3)}
                          {m === selectedMonth && (
                            <div style={{ fontSize: 9, color: '#818CF8', fontWeight: 700 }}>● now</div>
                          )}
                        </th>
                      ))}
                      <th className={`${styles.th} ${styles.thRight}`} style={{ minWidth: 90 }}>
                        {selectedQuarter ? `${selectedQuarter} Total` : 'FY Total'}
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {combinedUserData.map((emp, i) => (
                      <React.Fragment key={emp.id}>

                        {/* ── TARGET ROW — spacious person cell ── */}
                        <tr style={{ background: '#FAFBFF', borderBottom: '1px solid #F1F5F9' }}>
                          <td style={{ padding: '12px 14px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              {/* Avatar */}
                              <div
                                className={styles.avatar}
                                style={{
                                  background:  `${COLORS[i % COLORS.length]}18`,
                                  color:        COLORS[i % COLORS.length],
                                  borderColor: `${COLORS[i % COLORS.length]}40`,
                                  width: 32, height: 32, fontSize: 13,
                                  flexShrink: 0,
                                }}
                              >
                                {emp.name[0].toUpperCase()}
                              </div>

                              {/* Name + label stacked */}
                              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                <span style={{
                                  fontSize: 12, fontWeight: 700,
                                  color: '#0F172A', lineHeight: 1.2,
                                }}>
                                  {emp.name}
                                </span>
                                <span style={{
                                  display: 'inline-block',
                                  fontSize: 9, fontWeight: 700,
                                  color: '#92400E',
                                  background: '#FEF3C7',
                                  borderRadius: 4,
                                  padding: '2px 7px',
                                  letterSpacing: 0.5,
                                  lineHeight: 1.5,
                                  textTransform: 'uppercase',
                                  width: 'fit-content',
                                }}>
                                  Target
                                </span>
                              </div>
                            </div>
                          </td>

                          {displayedMonths.map(month => {
                            const val = emp.monthlyTarget[month] || 0;
                            const sel = month === selectedMonth;
                            return (
                              <td key={month} className={styles.monthTdTarget} style={{
                                color:      val > 0 ? '#92400E' : '#CBD5E1',
                                fontWeight: val > 0 ? 700 : 400,
                                background: sel ? '#FEF3C7' : val > 0 ? '#FFFBEB' : 'transparent',
                                borderLeft:  sel ? '2px solid #F59E0B' : undefined,
                                borderRight: sel ? '2px solid #F59E0B' : undefined,
                              }}>
                                {val > 0 ? fmt(val) : '—'}
                              </td>
                            );
                          })}

                          <td className={`${styles.td} ${styles.tdRight} ${styles.tdTarget}`}>
                            {fmt(displayedMonths.reduce((s, m) => s + (emp.monthlyTarget[m] || 0), 0))}
                          </td>
                        </tr>

                        {/* ── ACHIEVED ROW — spacious label cell ── */}
                        <tr style={{ borderBottom: '3px solid #E2E8F0' }}>
                          <td style={{ padding: '10px 14px 12px 56px' }}>
                            <span style={{
                              display: 'inline-block',
                              fontSize: 9, fontWeight: 700,
                              color: '#1E40AF',
                              background: '#DBEAFE',
                              borderRadius: 4,
                              padding: '2px 7px',
                              letterSpacing: 0.5,
                              lineHeight: 1.5,
                              textTransform: 'uppercase',
                              width: 'fit-content',
                            }}>
                              Achieved
                            </span>
                          </td>

                          {displayedMonths.map(month => {
                            const val = emp.monthlyAchieved[month] || 0;
                            const tgt = emp.monthlyTarget[month]   || 0;
                            const sel = month === selectedMonth;
                            const pct = tgt > 0 ? (val / tgt) * 100 : 0;
                            return (
                              <td key={month} className={styles.monthTdAchieved} style={{
                                color:      val > 0 ? '#1E40AF' : '#CBD5E1',
                                fontWeight: val > 0 ? 700 : 400,
                                background: sel ? '#DBEAFE' : val > 0 ? '#EFF6FF' : 'transparent',
                                borderLeft:  sel ? '2px solid #4F46E5' : undefined,
                                borderRight: sel ? '2px solid #4F46E5' : undefined,
                              }}>
                                {val > 0 ? (
                                  <>
                                    <div>{fmt(val)}</div>
                                    {tgt > 0 && (
                                      <div style={{
                                        fontSize: 9,
                                        color: getPctHex(pct),
                                        fontWeight: 700,
                                      }}>
                                        {fmtPct(pct)}
                                      </div>
                                    )}
                                  </>
                                ) : '—'}
                              </td>
                            );
                          })}

                          <td className={`${styles.td} ${styles.tdRight} ${styles.tdAchieved}`}>
                            {fmt(displayedMonths.reduce((s, m) => s + (emp.monthlyAchieved[m] || 0), 0))}
                          </td>
                        </tr>

                      </React.Fragment>
                    ))}

                    {/* ── Team Target Totals ── */}
                    {combinedUserData.length > 0 && (
                      <>
                        <tr style={{ background: '#FFF7ED', borderTop: '2px solid #E2E8F0' }}>
                          <td className={`${styles.td} ${styles.totalLabel}`}
                            style={{ color: '#92400E', paddingLeft: 16 }}>
                            Team Target
                          </td>
                          {displayedMonths.map(month => {
                            const total = combinedUserData.reduce(
                              (s, u) => s + (u.monthlyTarget[month] || 0), 0
                            );
                            const sel = month === selectedMonth;
                            return (
                              <td key={month} className={styles.monthTdTarget} style={{
                                fontWeight: 700, fontSize: 12,
                                color:      total > 0 ? '#92400E' : '#CBD5E1',
                                background: sel ? '#FEF3C7' : 'transparent',
                                borderLeft:  sel ? '2px solid #F59E0B' : undefined,
                                borderRight: sel ? '2px solid #F59E0B' : undefined,
                              }}>
                                {total > 0 ? fmt(total) : '—'}
                              </td>
                            );
                          })}
                          <td className={`${styles.td} ${styles.tdRight} ${styles.tdTarget}`}>
                            {fmt(displayedMonths.reduce(
                              (s, m) => s + combinedUserData.reduce(
                                (ss, u) => ss + (u.monthlyTarget[m] || 0), 0
                              ), 0
                            ))}
                          </td>
                        </tr>

                        <tr style={{ background: '#EFF6FF', borderBottom: '3px solid #C7D2FE' }}>
                          <td className={`${styles.td} ${styles.totalLabel}`}
                            style={{ color: '#1E40AF', paddingLeft: 16 }}>
                            Team Achieved
                          </td>
                          {displayedMonths.map(month => {
                            const total = combinedUserData.reduce(
                              (s, u) => s + (u.monthlyAchieved[month] || 0), 0
                            );
                            const tgtT  = combinedUserData.reduce(
                              (s, u) => s + (u.monthlyTarget[month] || 0), 0
                            );
                            const sel   = month === selectedMonth;
                            const pct   = tgtT > 0 ? (total / tgtT) * 100 : 0;
                            return (
                              <td key={month} className={styles.monthTdAchieved} style={{
                                fontWeight: 700,
                                color:      total > 0 ? '#1E40AF' : '#CBD5E1',
                                background: sel ? '#DBEAFE' : 'transparent',
                                borderLeft:  sel ? '2px solid #4F46E5' : undefined,
                                borderRight: sel ? '2px solid #4F46E5' : undefined,
                              }}>
                                {total > 0 ? (
                                  <>
                                    <div>{fmt(total)}</div>
                                    {tgtT > 0 && (
                                      <div style={{
                                        fontSize: 9,
                                        color: getPctHex(pct),
                                        fontWeight: 700,
                                      }}>
                                        {fmtPct(pct)}
                                      </div>
                                    )}
                                  </>
                                ) : '—'}
                              </td>
                            );
                          })}
                          <td className={`${styles.td} ${styles.tdRight} ${styles.tdAchieved}`}>
                            {fmt(displayedMonths.reduce(
                              (s, m) => s + combinedUserData.reduce(
                                (ss, u) => ss + (u.monthlyAchieved[m] || 0), 0
                              ), 0
                            ))}
                          </td>
                        </tr>
                      </>
                    )}

                    {combinedUserData.length === 0 && (
                      <tr>
                        <td colSpan={displayedMonths.length + 2} className={styles.noDataRow}>
                          No monthly data available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className={styles.footer}>
                Target = Budget allocation · Achieved = Rank A value &nbsp;·&nbsp;
                <span style={{ color: '#059669', fontWeight: 700 }}>●</span> ≥80% &nbsp;
                <span style={{ color: '#D97706', fontWeight: 700 }}>●</span> 50–79% &nbsp;
                <span style={{ color: '#E11D48', fontWeight: 700 }}>●</span> &lt;50% &nbsp;·&nbsp;
                {selectedQuarter ? `${QUARTER_LABELS[selectedQuarter]} of ` : ''}{fyLabel}
              </div>
            </div>

          </>
        )}
      </main>
    </div>
  );
};

export default BudgetAdminDashboard;

