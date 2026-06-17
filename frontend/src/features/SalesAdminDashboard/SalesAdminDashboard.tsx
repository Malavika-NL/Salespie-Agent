
import React, { useEffect, useCallback, useMemo, useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LabelList } from 'recharts';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState, AppDispatch } from '../../app/store';
import axiosInstance from '../../app/axiosInstance';
import { fetchAdminBudgetSummary, fetchSalesPersons } from '../Budget/slice/budgetSlice';
import { fetchAdminLeadWorkspaceList } from '../AdminLeadWorkspaceList/Slice/AdminLeadWorkspaceListSlice';
import { fetchAdminOpportunityWorkspaceTableData } from '../AdminOpportunityWorkspaceTable/AdminOpportunityWorkspaceTableSlice/AdminOpportunityWorkspaceTableSlice';
import {
  setFilterType, setSelectedMonth, setSelectedYear, setSelectedPic,
  resetFilter, FY_MONTHS,
} from '../globalFilter/globalFilterSlice';
import Header from '../dashboardUser/Header/Header';
import AdminSpeedometer from './AdminSpeedometer/AdminSpeedometer';
import CustomAdminFunnelChart from './FunnelGraph/funnelgraph';
import AdminPieChartComponent from './PieChart/AdminPieChart';
import AdminMonthWiseBudget from './MonthWiseBudget/AdminMonthWiseBudget';
import { fetchAdminMonthWiseBudgetData } from './MonthWiseBudget/Slice/AdminMonthWiseBudgetSlice';
import AdminBarChartComponent from './Category Wise opportunity/BarChart';
import AdminOpportunityStatus from './OpportunityStatus/OpportunityStatus';
import styles from './SalesAdminDashboard.module.css';

/* ══════════════════════════════════════════════════════════════
   SVG ICONS
══════════════════════════════════════════════════════════════ */
const IconRevenue = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="1" x2="12" y2="23" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);
const IconBudget = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="M12 8v8" /><path d="M8 12h8" />
  </svg>
);
const IconAchieved = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const IconWallet = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
    <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
    <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
  </svg>
);
const IconDeals = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);
const IconFilter = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
  </svg>
);
const IconCalendar = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

/* ══════════════════════════════════════════════════════════════
   HELPER
══════════════════════════════════════════════════════════════ */
const formatAmount = (value: number, currency: string = 'INR'): string => {
  const symbol = ({ INR: 'INR ', USD: '$', EUR: 'EUR ', GBP: 'GBP ' } as Record<string, string>)[currency] || 'INR ';
  if (!value || isNaN(value)) return `${symbol}0`;
  if (value >= 10000000) return `${symbol}${(value / 10000000).toFixed(1)}Cr`;
  if (value >= 100000)   return `${symbol}${(value / 100000).toFixed(1)}L`;
  if (value >= 1000)     return `${symbol}${(value / 1000).toFixed(1)}K`;
  return `${symbol}${value.toLocaleString()}`;
};

const formatUserRoleLabel = (user: any): string => {
  const username = String(user?.username || '').trim();
  if (!username) return '';
  return username;
};

const MONTH_NAME_TO_NUM: Record<string, number> = {
  January: 1,
  February: 2,
  March: 3,
  April: 4,
  May: 5,
  June: 6,
  July: 7,
  August: 8,
  September: 9,
  October: 10,
  November: 11,
  December: 12,
};

const normalizeText = (value: any) => String(value || '').trim().toLowerCase();

const getOpportunityPlannedAmount = (row: any): number => {
  const valuesAmount = Number(row?.values || 0);
  const totalAmount = Number(row?.total_amount || 0);

  if (totalAmount > 0) return totalAmount;
  if (valuesAmount > 0) return valuesAmount;
  return 0;
};

const getLeadStatusBucket = (value: any): 'open' | 'won' | 'lost' => {
  const status = normalizeText(value);
  if (status.includes('won')) return 'won';
  if (status.includes('lost') || status.includes('drop')) return 'lost';
  return 'open';
};

const parseFlexibleDate = (value: any): Date | null => {
  if (!value) return null;

  const raw = String(value).trim();
  if (!raw) return null;

  const direct = new Date(raw);
  if (!Number.isNaN(direct.getTime())) return direct;

  const match = raw.match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/);
  if (!match) return null;

  const [, day, month, year] = match;
  const parsed = new Date(Number(year), Number(month) - 1, Number(day));
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const getFiscalMonthLabel = (date: Date): string =>
  FY_MONTHS[date.getMonth() >= 3 ? date.getMonth() - 3 : date.getMonth() + 9];

/* ══════════════════════════════════════════════════════════════
   UNIVERSAL FILTER BAR
══════════════════════════════════════════════════════════════ */
interface FilterBarProps {
  filterType: 'monthly' | 'yearly';
  selectedMonth: string;
  selectedYear: number;
  selectedPic: string;
  picOptions: { value: string; label: string }[];
  onFilterType: (v: 'monthly' | 'yearly') => void;
  onMonth: (v: string) => void;
  onYear: (v: number) => void;
  onPic: (v: string) => void;
  onReset: () => void;
  isFiltered: boolean;
}

const UniversalFilterBar: React.FC<FilterBarProps> = ({
  filterType, selectedMonth, selectedYear, selectedPic,
  picOptions,
  onFilterType, onMonth, onYear, onPic, onReset, isFiltered,
}) => {
  const now = new Date();
  const currentFYYear = now.getMonth() >= 3 ? now.getFullYear() : now.getFullYear() - 1;
  const yearOptions = [currentFYYear - 2, currentFYYear - 1, currentFYYear].filter(y => y > 2020);
  const selectedPicLabel =
    selectedPic === 'all'
      ? 'All PICs'
      : (picOptions.find((p) => p.value === selectedPic)?.label || selectedPic);

  const showingLabel =
    filterType === 'monthly'
      ? `${selectedMonth} FY${selectedYear}-${String(selectedYear + 1).slice(2)}`
      : `Full FY ${selectedYear}-${String(selectedYear + 1).slice(2)}`;

  const showingParts = [showingLabel];
  if (selectedPic !== 'all') showingParts.push(`PIC ${selectedPicLabel}`);

  return (
    /* ── Wrapper: same max-width & horizontal padding as mainContent ── */
    <div className={styles.filterBarWrapper}>
      <div className={`${styles.filterBar} ${isFiltered ? styles.filterBarActive : ''}`}>

        {/* Left label */}
        <div className={styles.filterLeft}>
          <span className={styles.filterIconBox}><IconFilter /></span>
          <div className={styles.filterLabelStack}>
            <span className={styles.filterHeading}>Views</span>
            {/* <span className={styles.filterSubtag}>Applies to all components</span> */}
          </div>
        </div>

        <div className={styles.filterSep} />

        {/* Mode toggle */}
        <div className={styles.filterToggle}>
          {(['yearly', 'monthly'] as const).map(t => (
            <button
              key={t}
              onClick={() => onFilterType(t)}
              className={`${styles.filterToggleBtn} ${filterType === t ? styles.filterToggleBtnActive : ''}`}
            >
              {t === 'yearly' ? 'Year (FY)' : 'Month'}
            </button>
          ))}
        </div>

        <div className={styles.filterSep} />

        {/* FY year */}
        <div className={styles.filterGroup}>
          <span className={styles.filterGroupLabel}><IconCalendar /> FY</span>
          <select value={selectedYear} onChange={e => onYear(Number(e.target.value))} className={styles.filterSelect}>
            {yearOptions.map(y => (
              <option key={y} value={y}>{y}-{String(y + 1).slice(2)}</option>
            ))}
          </select>
        </div>

        {/* PIC */}
        <div className={styles.filterGroup}>
          <span className={styles.filterGroupLabel}>PIC</span>
          <select value={selectedPic} onChange={e => onPic(e.target.value)} className={`${styles.filterSelect} ${styles.filterSelectPic}`}>
            <option value="all">All PICs</option>
            {picOptions.map((pic) => (
              <option key={pic.value} value={pic.value}>{pic.label}</option>
            ))}
          </select>
        </div>

        {/* Month */}
        {filterType === 'monthly' && (
          <div className={styles.filterGroup}>
            <span className={styles.filterGroupLabel}><IconCalendar /> Month</span>
            <select value={selectedMonth} onChange={e => onMonth(e.target.value)} className={styles.filterSelect}>
              {FY_MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
        )}

        {/* Active chip */}
        {isFiltered && (
          <div className={styles.filterChip}>
            <span>
              {filterType === 'monthly'
                ? `${selectedMonth} FY${selectedYear}-${String(selectedYear + 1).slice(2)}`
                : `FY ${selectedYear}-${String(selectedYear + 1).slice(2)}`}
              {selectedPic !== 'all' ? ` | PIC ${selectedPicLabel}` : ''}
            </span>
            <button onClick={onReset} className={styles.filterChipX} title="Reset">x</button>
          </div>
        )}

        <div className={styles.filterGrow} />

        {/* Showing label */}
        <div className={styles.filterShowing}>
          <span>Showing:</span>
          <strong>{showingParts.join(' | ')}</strong>
        </div>

      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════
   KPI CARD
══════════════════════════════════════════════════════════════ */
interface KPICardProps {
  icon: React.ReactNode;
  color: 'indigo' | 'sky' | 'emerald' | 'amber' | 'violet' | 'rose' | 'teal' | 'fuchsia';
  label: string;
  value: string;
  trend: string;
  up: boolean;
  onClick?: () => void;
  subtitle?: string;
}

const KPICard: React.FC<KPICardProps> = ({ icon, color, label, value, trend, up, onClick, subtitle }) => (
  <div
    className={`${styles.kpiCard} ${styles[`kpiAccent_${color}`]} ${onClick ? styles.kpiClickable : ''}`}
    onClick={onClick}
  >
    <div className={`${styles.kpiIconWrap} ${styles[`kpiIcon_${color}`]}`}>{icon}</div>
    <div className={styles.kpiBody}>
      <span className={styles.kpiLabel}>{label}</span>
      <span className={styles.kpiValue}>{value}</span>
      <div className={styles.kpiFooter}>
        {subtitle && <span className={styles.kpiSubtitle}>{subtitle}</span>}
        <span className={`${styles.kpiBadge} ${up ? styles.badgeUp : styles.badgeDown}`}>
          {up ? "UP" : "DOWN"} {trend}
        </span>
      </div>
    </div>
  </div>
);

/* ══════════════════════════════════════════════════════════════
   TARGET vs ACHIEVEMENT SUMMARY
══════════════════════════════════════════════════════════════ */
// src/features/SalesAdminDashboard/SalesAdminDashboard.tsx

// Replace the TargetAchievementSummary component with this:

const TargetAchievementSummary: React.FC<{
  data: any;
  currency: string;
  monthLabel: string;
}> = ({
  data,
  currency,
  monthLabel,
}) => {
  if (!data || !data.has_data) {
    return (
      <div className={styles.noData}>
        <span className={styles.noDataIcon}>N/A</span>
        <span>No budget data available</span>
      </div>
    );
  }

  const rawCategories = Array.isArray(data?.category_breakdown)
    ? data.category_breakdown
    : [];

  const blockedCategoryNames = new Set(['marketing', 'travel']);

  const categories = rawCategories
    .filter((cat: any) =>
      cat &&
      String(cat?.category || '').trim() &&
      !blockedCategoryNames.has(String(cat?.category || '').trim().toLowerCase()) &&
      Number(cat?.month_target || 0) > 0
    )
    .map((cat: any) => ({
      category: String(cat?.category || '').trim(),
      month_target: Number(cat?.month_target || 0),
      fy_target: Number(cat?.fy_target || 0),
    }))
    .sort((a: any, b: any) => Number(b?.month_target || 0) - Number(a?.month_target || 0));

  const categoryProductMap = useMemo(() => {
    const map = new Map<string, any>();
    const raw = Array.isArray(data?.category_product_breakdown)
      ? data.category_product_breakdown
      : [];

    raw.forEach((entry: any) => {
      const categoryName = String(entry?.category || '').trim();
      if (!categoryName) return;

      const products = Array.isArray(entry?.products)
        ? entry.products.map((product: any) => ({
            product: String(product?.product || '').trim() || 'Unspecified Product',
            sold_count: Number(product?.sold_count || 0),
            units_sold: Number(product?.units_sold || 0),
            total_value: Number(product?.total_value || 0),
          }))
        : [];

      map.set(categoryName.toLowerCase(), {
        category: categoryName,
        total_products: Number(entry?.total_products || products.length || 0),
        total_sold_count: Number(entry?.total_sold_count || 0),
        total_units_sold: Number(entry?.total_units_sold || 0),
        total_value: Number(entry?.total_value || 0),
        products,
      });
    });

    return map;
  }, [data?.category_product_breakdown]);

  if (categories.length === 0) {
    return (
      <div className={styles.noData}>
        <span className={styles.noDataIcon}>N/A</span>
        <span>No category targets available for {monthLabel}</span>
      </div>
    );
  }

  const totalMonthTarget = categories.reduce((sum: number, cat: any) => sum + (cat.month_target || 0), 0);
  const monthTargetValue = Number(data?.month_target || 0);
  const monthAchievedValue = Number(data?.month_achieved || 0);
  const monthGapValue = Math.max(monthTargetValue - monthAchievedValue, 0);
  const chartHeight = 320;
  const chartMinWidth = Math.max(540, categories.length * 110);

  const compactAmount = (value: number) => {
    const v = Number(value || 0);
    const abs = Math.abs(v);
    if (abs >= 10000000) return `${(v / 10000000).toFixed(1)}Cr`;
    if (abs >= 100000) return `${(v / 100000).toFixed(1)}L`;
    if (abs >= 1000) return `${(v / 1000).toFixed(1)}K`;
    return `${Math.round(v)}`;
  };

  const CategoryTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    const row = payload[0]?.payload;
    if (!row) return null;
    const details = categoryProductMap.get(String(row?.category || '').trim().toLowerCase());
    const products = Array.isArray(details?.products)
      ? [...details.products].sort((a: any, b: any) => Number(b?.sold_count || 0) - Number(a?.sold_count || 0))
      : [];

    return (
      <div
        style={{
          background: '#fff',
          border: '1px solid #E2E8F0',
          borderRadius: 10,
          padding: '10px 12px',
          boxShadow: '0 4px 16px rgba(15,23,42,0.10)',
        }}
      >
        <div style={{ fontSize: 12, fontWeight: 700, color: '#0F172A', marginBottom: 6 }}>
          {row.category}
        </div>
        <div style={{ fontSize: 12, color: '#475569' }}>
          {monthLabel} Target: <strong style={{ color: '#4F46E5' }}>{formatAmount(row.month_target, currency)}</strong>
        </div>
        <div style={{ fontSize: 12, color: '#475569' }}>
          FY Target: <strong style={{ color: '#0EA5E9' }}>{formatAmount(row.fy_target, currency)}</strong>
        </div>
        <div style={{ fontSize: 11.5, color: '#334155', marginTop: 8, fontWeight: 700 }}>
          Sold in {monthLabel}: {Number(details?.total_sold_count || 0)}
        </div>
        {products.length > 0 ? (
          <div
            style={{
              marginTop: 6,
              borderTop: '1px dashed #E2E8F0',
              paddingTop: 6,
              maxHeight: 180,
              overflowY: 'auto',
            }}
          >
            {products.map((item: any, index: number) => (
              <div key={`tooltip-prod-${row.category}-${index}`} style={{ fontSize: 11.5, color: '#475569' }}>
                {item.product}: <strong style={{ color: '#4338CA' }}>{item.sold_count}</strong>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ fontSize: 11.5, color: '#94A3B8', marginTop: 6 }}>
            No sold products in {monthLabel}
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div className={styles.categorySummaryStrip}>
        <div className={`${styles.categorySummaryItem} ${styles.categorySummaryPrimary}`}>
          <span className={styles.categorySummaryLabel}>{monthLabel} Target</span>
          <span className={styles.categorySummaryValue}>{formatAmount(monthTargetValue, currency)}</span>
          <span className={styles.categorySummaryHint}>Financial target for selected month</span>
        </div>
        <div className={styles.categorySummaryItem}>
          <span className={styles.categorySummaryLabel}>Visible Categories</span>
          <span className={styles.categorySummaryValue}>{categories.length}</span>
          <span className={styles.categorySummaryHint}>Categories with non-zero target</span>
        </div>
        <div className={styles.categorySummaryItem}>
          <span className={styles.categorySummaryLabel}>Category Total</span>
          <span className={styles.categorySummaryValue}>{formatAmount(totalMonthTarget, currency)}</span>
          <span className={styles.categorySummaryHint}>Budget sum shown in chart bars</span>
        </div>
      </div>

      <div
        style={{
          width: '100%',
          overflowX: 'auto',
          overflowY: 'hidden',
        }}
      >
        <div style={{ width: chartMinWidth, height: chartHeight }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={categories}
              margin={{ top: 22, right: 20, left: 8, bottom: 44 }}
              barCategoryGap="28%"
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#EEF2FF" vertical={false} />
              <XAxis
                type="category"
                dataKey="category"
                interval={0}
                height={56}
                tickMargin={10}
                tick={{ fontSize: 11.5, fill: '#334155', fontWeight: 600, fontFamily: "'DM Sans', system-ui" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                type="number"
                tickFormatter={compactAmount}
                width={56}
                tick={{ fontSize: 11, fill: '#94A3B8', fontFamily: "'DM Sans', system-ui" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CategoryTooltip />} cursor={{ fill: 'rgba(79,70,229,0.06)' }} />
              <Bar
                dataKey="month_target"
                name={`${monthLabel} Target`}
                fill="#4F46E5"
                radius={[8, 8, 0, 0]}
                maxBarSize={54}
              >
                <LabelList
                  dataKey="month_target"
                  position="top"
                  formatter={(value: any) => formatAmount(Number(value || 0), currency)}
                  style={{ fontSize: 10.5, fontWeight: 700, fill: '#312E81' }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div
        style={{
          marginTop: 2,
          paddingTop: 10,
          borderTop: '1px solid #E2E8F0',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <span style={{ fontSize: 12, color: '#64748B' }}>
          Month Achieved: <strong style={{ color: '#6366F1' }}>{formatAmount(monthAchievedValue, currency)}</strong>
        </span>
        <span style={{ fontSize: 12, color: '#64748B' }}>
          Gap to Close: <strong style={{ color: '#475569' }}>{formatAmount(monthGapValue, currency)}</strong>
        </span>
      </div>
    </div>
  );
};

// const MonthlyProgress: React.FC<{ budgetData: any }> = ({ budgetData }) => {
//   if (!budgetData || !budgetData.has_data) {
//     return (
//       <div className={styles.noData}>
//         <span className={styles.noDataIcon}>📈</span>
//         <span>No progress data available</span>
//       </div>
//     );
//   }

//   const monthPct      = budgetData.month_achievement_pct || 0;
//   const isOver        = monthPct >= 100;
//   const isGood        = monthPct >= 70;
//   const dealsProgress = budgetData.monthly_target_deals > 0
//     ? Math.round((budgetData.deals_closed_this_month / budgetData.monthly_target_deals) * 100) : 0;
//   const daysProgress  = budgetData.days_elapsed > 0
//     ? Math.round((budgetData.days_elapsed / 30) * 100) : 0;

//   return (
//     <div className={styles.monthlyProgress}>
//       <div className={styles.progressItem}>
//         <div className={styles.progressHeader}>
//           <span className={styles.progressLabel}>Month Achievement</span>
//           <span className={styles.progressValue}>{monthPct}%</span>
//         </div>
//         <div className={styles.progressTrack}>
//           <div
//             className={`${styles.progressFill} ${isOver ? styles.fillEmerald : isGood ? styles.fillAmber : styles.fillRose}`}
//             style={{ width: `${Math.min(monthPct, 100)}%` }}
//           />
//         </div>
//         <div className={styles.progressFooter}>
//           <span>{formatAmount(budgetData.month_achieved, budgetData.currency)} achieved</span>
//           <span>of {formatAmount(budgetData.month_target, budgetData.currency)}</span>
//         </div>
//       </div>
//       <div className={styles.progressItem}>
//         <div className={styles.progressHeader}>
//           <span className={styles.progressLabel}>Deals Closed</span>
//           <span className={styles.progressValue}>{budgetData.deals_closed_this_month} / {budgetData.monthly_target_deals}</span>
//         </div>
//         <div className={styles.progressTrack}>
//           <div className={`${styles.progressFill} ${styles.fillIndigo}`} style={{ width: `${Math.min(dealsProgress, 100)}%` }} />
//         </div>
//         <div className={styles.progressFooter}>
//           <span>{dealsProgress}% of target</span>
//           <span>{Math.max(0, budgetData.monthly_target_deals - budgetData.deals_closed_this_month)} remaining</span>
//         </div>
//       </div>
//       <div className={styles.progressItem}>
//         <div className={styles.progressHeader}>
//           <span className={styles.progressLabel}>Month Progress</span>
//           <span className={styles.progressValue}>Day {budgetData.days_elapsed}</span>
//         </div>
//         <div className={styles.progressTrack}>
//           <div className={`${styles.progressFill} ${styles.fillSky}`} style={{ width: `${daysProgress}%` }} />
//         </div>
//         <div className={styles.progressFooter}>
//           <span>{budgetData.days_elapsed} days elapsed</span>
//           <span>{budgetData.days_remaining} days left</span>
//         </div>
//       </div>
//     </div>
//   );
// };

const MonthlyProgress: React.FC<{ budgetData: any }> = ({ budgetData }) => {

  console.log('MonthlyProgress budgetData:', {
    month_rank_b_count: budgetData?.month_rank_b_count,
    month_rank_c_count: budgetData?.month_rank_c_count,
    month_rank_d_count: budgetData?.month_rank_d_count,
    month_rank_e_count: budgetData?.month_rank_e_count,
  });
  if (!budgetData || !budgetData.has_data) {
    return (
      <div className={styles.noData}>
        <span className={styles.noDataIcon}>📈</span>
        <span>No progress data available</span>
      </div>
    );
  }

  const currency      = budgetData.currency || 'INR';
  const monthTarget   = budgetData.month_target   || 0;
  const monthAchieved = budgetData.month_achieved  || 0;
  const monthPct      = budgetData.month_achievement_pct || 0;

  // Rank counts split into current-month vs carried-forward
  const rankB = budgetData.month_rank_b_count || 0;
  const rankC = budgetData.month_rank_c_count || 0;
  const rankD = budgetData.month_rank_d_count || 0;
  const rankE = budgetData.month_rank_e_count || 0;
  const rankBCurrent = budgetData.month_rank_b_current_count || 0;
  const rankCCurrent = budgetData.month_rank_c_current_count || 0;
  const rankDCurrent = budgetData.month_rank_d_current_count || 0;
  const rankECurrent = budgetData.month_rank_e_current_count || 0;
  const rankBCarried = budgetData.month_rank_b_carried_count || 0;
  const rankCCarried = budgetData.month_rank_c_carried_count || 0;
  const rankDCarried = budgetData.month_rank_d_carried_count || 0;
  const rankECarried = budgetData.month_rank_e_carried_count || 0;
  const totalRankBCDE = rankB + rankC + rankD + rankE;

  const rankConfig = [
    {
      label: 'Rank B',
      count: rankB,
      currentCount: rankBCurrent,
      carriedCount: rankBCarried,
      color: '#6366F1',
      lightColor: '#C7D2FE',
      bgColor: '#EEF2FF',
    },
    {
      label: 'Rank C',
      count: rankC,
      currentCount: rankCCurrent,
      carriedCount: rankCCarried,
      color: '#F59E0B',
      lightColor: '#FDE68A',
      bgColor: '#FFFBEB',
    },
    {
      label: 'Rank D',
      count: rankD,
      currentCount: rankDCurrent,
      carriedCount: rankDCarried,
      color: '#F97316',
      lightColor: '#FDBA74',
      bgColor: '#FFF7ED',
    },
    {
      label: 'Rank E',
      count: rankE,
      currentCount: rankECurrent,
      carriedCount: rankECarried,
      color: '#EF4444',
      lightColor: '#FCA5A5',
      bgColor: '#FEF2F2',
    },
  ];

  const isOver = monthPct >= 100;
  const isGood = monthPct >= 70;

  return (
    <div className={styles.monthlyProgress}>

      {/* ── Monthly Budget (Total across all users) ──────────── */}
      <div className={styles.progressItem}>
        <div className={styles.progressHeader}>
          <span className={styles.progressLabel}>Monthly Budget</span>
          <span className={styles.progressValue}>
            {formatAmount(monthTarget, currency)}
          </span>
        </div>
        <div className={styles.progressTrack}>
          <div
            className={`${styles.progressFill} ${styles.fillIndigo}`}
            style={{ width: '100%' }}
          />
        </div>
        <div className={styles.progressFooter}>
          <span>Total target across all users</span>
          <span>{budgetData.days_remaining || 0} days left</span>
        </div>
      </div>

      {/* ── Monthly Achievement ──────────────────────────────── */}
      <div className={styles.progressItem}>
        <div className={styles.progressHeader}>
          <span className={styles.progressLabel}>Monthly Achievement</span>
          <span className={styles.progressValue}>{monthPct}%</span>
        </div>
        <div className={styles.progressTrack}>
          <div
            className={`${styles.progressFill} ${
              isOver ? styles.fillEmerald
                : isGood ? styles.fillAmber
                : styles.fillRose
            }`}
            style={{ width: `${Math.min(monthPct, 100)}%` }}
          />
        </div>
        <div className={styles.progressFooter}>
          <span>{formatAmount(monthAchieved, currency)} achieved</span>
          <span>of {formatAmount(monthTarget, currency)}</span>
        </div>
      </div>

      {/* ── Monthly Rank Distribution (B, C, D, E) ───────────── */}
      <div className={styles.progressItem}>
        <div className={styles.progressHeader}>
          <span className={styles.progressLabel}>Monthly Rank Distribution</span>
          <span className={styles.progressValue}>
            {totalRankBCDE} deal{totalRankBCDE !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Segmented rank bar: dark = current month, light = carried forward */}
        <div style={{
          display: 'flex',
          width: '100%',
          height: 8,
          borderRadius: 6,
          overflow: 'hidden',
          background: '#F1F5F9',
          marginTop: 4,
          marginBottom: 6,
        }}>
          {totalRankBCDE > 0 ? (
            rankConfig.map((rank) => {
              const pct = Math.max(
                (rank.count / totalRankBCDE) * 100,
                rank.count > 0 ? 4 : 0
              );
              return (
                <div
                  key={rank.label}
                  style={{
                    width: `${pct}%`,
                    background: `linear-gradient(to right,
                      ${rank.color} 0%,
                      ${rank.color} ${rank.count > 0 ? (rank.currentCount / rank.count) * 100 : 0}%,
                      ${rank.lightColor} ${rank.count > 0 ? (rank.currentCount / rank.count) * 100 : 0}%,
                      ${rank.lightColor} 100%)`,
                    transition: 'width 0.4s ease',
                    minWidth: rank.count > 0 ? 4 : 0,
                  }}
                  title={`${rank.label}: ${rank.count} total, ${rank.currentCount} current month, ${rank.carriedCount} carried forward`}
                />
              );
            })
          ) : (
            <div style={{ width: '100%', background: '#F1F5F9' }} />
          )}
        </div>

        {/* Rank pills grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 6,
          marginTop: 2,
        }}>
          {rankConfig.map((rank) => (
            <div
              key={rank.label}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '5px 10px',
                borderRadius: 8,
                background: rank.bgColor,
                border: `1px solid ${rank.color}20`,
                transition: 'all 0.2s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <div style={{
                    width: 8, height: 8, borderRadius: 2,
                    background: rank.color,
                    flexShrink: 0,
                  }} />
                  <div style={{
                    width: 8, height: 8, borderRadius: 2,
                    background: rank.lightColor,
                    flexShrink: 0,
                  }} />
                </div>
                <span style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: rank.color,
                  fontFamily: "'DM Sans', system-ui",
                }}>
                  {rank.label}
                </span>
              </div>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                lineHeight: 1.15,
              }}>
                <span style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: rank.color,
                  fontFamily: "'DM Sans', system-ui",
                  minWidth: 28,
                  textAlign: 'right',
                }}>
                  {rank.count}
                </span>
                <span style={{
                  fontSize: 10,
                  color: '#64748B',
                  fontFamily: "'DM Sans', system-ui",
                }}>
                  {rank.currentCount} now / {rank.carriedCount} carry
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className={styles.progressFooter} style={{ marginTop: 6 }}>
          <span>Dark = current month, light = carried from previous months</span>
          <span>
            {totalRankBCDE > 0 && rankB > 0
              ? `${Math.round((rankB / totalRankBCDE) * 100)}% at Rank B`
              : 'No Rank B deals'}
          </span>
        </div>
      </div>

    </div>
  );
};
/* ══════════════════════════════════════════════════════════════
   MAIN DASHBOARD COMPONENT
══════════════════════════════════════════════════════════════ */
const SalesAdminDashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [registeredUsers, setRegisteredUsers] = useState<any[]>([]);

  const { adminSummary, adminSummaryLoading } = useSelector((s: RootState) => s.budget);
  const adminLeads = useSelector((s: RootState) => s.fetchAdminLeadWorkspaceListData.data || []);
  const adminOpportunities = useSelector((s: RootState) => s.fetchAdminOpportunityWorkspaceData.data || []);
  const monthWiseBudgetData = useSelector((s: RootState) => s.fetchAdminMonthWiseBudget.budgetdata || []);
  const { filterType, selectedMonth, selectedYear, selectedPic } = useSelector((s: RootState) => s.globalFilter);

  const now              = new Date();
  const currentFYYear    = now.getMonth() >= 3 ? now.getFullYear() : now.getFullYear() - 1;
  const currentMonthName = now.toLocaleString('default', { month: 'long' });
  const isFiltered =
    selectedYear !== currentFYYear ||
    (filterType === 'monthly' && selectedMonth !== currentMonthName) ||
    selectedPic !== 'all';

  const picOptions = useMemo(() => {
    const users = Array.isArray(registeredUsers) ? registeredUsers : [];
    const filtered = users.filter(
      (u: any) => String(u?.role || '').trim().toLowerCase() === 'user'
    );

    return filtered
      .map((u: any) => ({
        value: String(u?.id ?? ''),
        label: formatUserRoleLabel(u),
      }))
      .filter((u: { value: string; label: string }) => u.value && u.label)
      .sort((a, b) => a.label.localeCompare(b.label, undefined, { sensitivity: 'base' }));
  }, [registeredUsers]);

  useEffect(() => {
    dispatch(fetchSalesPersons());
    dispatch(fetchAdminLeadWorkspaceList());
    dispatch(fetchAdminOpportunityWorkspaceTableData() as any);
    dispatch(fetchAdminMonthWiseBudgetData() as any);
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchAdminMonthWiseBudgetData() as any);
  }, [dispatch, selectedYear, selectedMonth, selectedPic, filterType]);

  useEffect(() => {
    let mounted = true;
    axiosInstance
      .get('/users/')
      .then((res) => {
        if (!mounted) return;
        setRegisteredUsers(Array.isArray(res.data) ? res.data : []);
      })
      .catch(() => {
        if (!mounted) return;
        setRegisteredUsers([]);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const fetchAllData = useCallback(() => {
    dispatch(fetchAdminBudgetSummary({
      year:  selectedYear,
      month: selectedMonth,
      pic: selectedPic !== 'all' ? selectedPic : undefined,
    }));
  }, [dispatch, selectedYear, selectedMonth, selectedPic]);

  useEffect(() => { fetchAllData(); }, [fetchAllData]);

  const handleFilterType = (type: 'monthly' | 'yearly') => dispatch(setFilterType(type));
  const handleMonth      = (month: string)               => dispatch(setSelectedMonth(month));
  const handleYear       = (year: number)                => dispatch(setSelectedYear(year));
  const handlePic        = (pic: string)                 => dispatch(setSelectedPic(pic));
  const handleReset      = ()                            => dispatch(resetFilter());

  const data     = adminSummary || {};
  const hasData  = data.has_data === true;
  const currency = data.currency || 'INR';
  const fyPct    = data.fy_achievement_pct    || 0;
  const monthPct = data.month_achievement_pct || 0;
  const fyLabel = `${selectedYear}-${String(selectedYear + 1).slice(2)}`;
  const monthLabel =
    filterType === 'monthly'
      ? selectedMonth
      : (data.current_month || selectedMonth);

  const monthKpiColor: KPICardProps['color'] =
    monthPct >= 100 ? 'emerald' : monthPct >= 70 ? 'amber' : 'rose';

  const selectedPicUsername = useMemo(() => {
    if (selectedPic === 'all') return '';
    const user = (Array.isArray(registeredUsers) ? registeredUsers : []).find(
      (u: any) => String(u?.id) === String(selectedPic)
    );
    return normalizeText(user?.username);
  }, [registeredUsers, selectedPic]);

  const leadsAfterDateAndPic = useMemo(() => {
    const leads = Array.isArray(adminLeads) ? adminLeads : [];
    const fyStart = new Date(selectedYear, 3, 1, 0, 0, 0, 0);
    const fyEnd = new Date(selectedYear + 1, 2, 31, 23, 59, 59, 999);
    const selectedMonthNum = MONTH_NAME_TO_NUM[selectedMonth] || 0;
    const selectedMonthYear =
      selectedMonthNum > 0 ? (selectedMonthNum <= 3 ? selectedYear + 1 : selectedYear) : selectedYear;

    return leads.filter((lead: any) => {
      const rawDate = lead?.acct_created_date || lead?.last_update;
      if (!rawDate) return false;

      const d = new Date(rawDate);
      if (Number.isNaN(d.getTime())) return false;

      const isDateMatch =
        filterType === 'monthly'
          ? d.getMonth() + 1 === selectedMonthNum && d.getFullYear() === selectedMonthYear
          : d >= fyStart && d <= fyEnd;
      if (!isDateMatch) return false;

      if (!selectedPicUsername) return true;
      const assignTo = normalizeText(lead?.assign_to);
      const owner = normalizeText(lead?.user);
      const picField = normalizeText(lead?.pic);
      return assignTo === selectedPicUsername || owner === selectedPicUsername || picField === selectedPicUsername;
    });
  }, [adminLeads, selectedYear, selectedMonth, filterType, selectedPicUsername]);

  const leadSectionData = useMemo(() => {
    const filtered = leadsAfterDateAndPic;

    const won = filtered.filter((lead: any) => getLeadStatusBucket(lead?.status) === 'won').length;
    const lost = filtered.filter((lead: any) => getLeadStatusBucket(lead?.status) === 'lost').length;
    const open = Math.max(0, filtered.length - won - lost);
    const conversion = filtered.length ? Math.round((won / filtered.length) * 100) : 0;
    const uniquePersons = new Set(
      filtered.map((lead: any) => String(lead?.assign_to || '').trim()).filter(Boolean)
    );

    return {
      total: filtered.length,
      won,
      open,
      conversion,
      persons: uniquePersons.size,
    };
  }, [leadsAfterDateAndPic]);

  const plannedPoValue = useMemo(() => {
    const rows = Array.isArray(adminOpportunities) ? adminOpportunities : [];
    const fyStart = new Date(selectedYear, 3, 1, 0, 0, 0, 0);
    const fyEnd = new Date(selectedYear + 1, 2, 31, 23, 59, 59, 999);
    const selectedMonthNum = MONTH_NAME_TO_NUM[selectedMonth] || 0;
    const selectedMonthYear =
      selectedMonthNum > 0 ? (selectedMonthNum <= 3 ? selectedYear + 1 : selectedYear) : selectedYear;

    return rows.reduce((sum: number, row: any) => {
      const poDate = parseFlexibleDate(row?.exp_po_date);
      if (!poDate) return sum;

      const isDateMatch =
        filterType === 'monthly'
          ? poDate.getMonth() + 1 === selectedMonthNum && poDate.getFullYear() === selectedMonthYear
          : poDate >= fyStart && poDate <= fyEnd;
      if (!isDateMatch) return sum;

      if (selectedPicUsername) {
        const ownerKeys = [
          row?.user,
          row?.pic,
          row?.account_holder,
          row?.assign_to,
        ].map(normalizeText);

        if (!ownerKeys.includes(selectedPicUsername)) return sum;
      }

      const numericValue = getOpportunityPlannedAmount(row);
      return sum + numericValue;
    }, 0);
  }, [adminOpportunities, filterType, selectedMonth, selectedPicUsername, selectedYear]);

  const plannedPoChartData = useMemo(() => {
    const rows = Array.isArray(adminOpportunities) ? adminOpportunities : [];
    const fyStart = new Date(selectedYear, 3, 1, 0, 0, 0, 0);
    const fyEnd = new Date(selectedYear + 1, 2, 31, 23, 59, 59, 999);
    const selectedMonthNum = MONTH_NAME_TO_NUM[selectedMonth] || 0;
    const selectedMonthYear =
      selectedMonthNum > 0 ? (selectedMonthNum <= 3 ? selectedYear + 1 : selectedYear) : selectedYear;
    const grouped = new Map<string, number>();

    if (filterType === 'yearly') {
      FY_MONTHS.forEach((month) => grouped.set(month, 0));
    }

    rows.forEach((row: any) => {
      const poDate = parseFlexibleDate(row?.exp_po_date);
      if (!poDate) return;

      const isDateMatch =
        filterType === 'monthly'
          ? poDate.getMonth() + 1 === selectedMonthNum && poDate.getFullYear() === selectedMonthYear
          : poDate >= fyStart && poDate <= fyEnd;
      if (!isDateMatch) return;

      if (selectedPicUsername) {
        const ownerKeys = [
          row?.user,
          row?.pic,
          row?.account_holder,
          row?.assign_to,
        ].map(normalizeText);

        if (!ownerKeys.includes(selectedPicUsername)) return;
      }

      const numericValue = getOpportunityPlannedAmount(row);
      if (numericValue <= 0) return;

      const label =
        filterType === 'monthly'
          ? selectedMonth
          : getFiscalMonthLabel(poDate);

      grouped.set(label, (grouped.get(label) || 0) + numericValue);
    });

    const achievedByMonth = new Map<string, number>();
    (Array.isArray(monthWiseBudgetData) ? monthWiseBudgetData : []).forEach((entry: any) => {
      const monthLabel = String(entry?.month_name || '').trim();
      if (!monthLabel) return;
      achievedByMonth.set(monthLabel, Math.max(0, Number(entry?.total_amount || 0)));
    });

    const orderedLabels = filterType === 'monthly' ? [selectedMonth] : FY_MONTHS;
    return orderedLabels
      .map((label) => {
        const value = grouped.get(label) || 0;
        const achieved = achievedByMonth.get(label) || 0;

        return {
          label,
          value,
          color: achieved >= value && value > 0 ? '#10B981' : '#A7F3D0',
        };
      })
      .filter((item) => item.value > 0);
  }, [adminOpportunities, filterType, monthWiseBudgetData, selectedMonth, selectedPicUsername, selectedYear]);

  const filterKey = `${selectedYear}-${filterType === 'monthly' ? selectedMonth : 'fy'}-${selectedPic}`;

  return (
    <div className={styles.dashboardRoot}>

      {/* ╔══════════════════════════════════════════════════════════╗
          ║  UNIVERSAL FILTER — constrained width, rounded corners  ║
          ║  Sits ABOVE Header, aligned to content area             ║
          ╚══════════════════════════════════════════════════════════╝ */}
      <UniversalFilterBar
        filterType={filterType}
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
        selectedPic={selectedPic}
        picOptions={picOptions}
        onFilterType={handleFilterType}
        onMonth={handleMonth}
        onYear={handleYear}
        onPic={handlePic}
        onReset={handleReset}
        isFiltered={isFiltered}
      />

      <div className={styles.topActionsRow}>
        <button className={styles.manageBudgetsBtn} onClick={() => navigate('/budget/overview')}>
          Manage Budgets
        </button>
      </div>

      {/* Site header / nav — comes AFTER the universal filter */}
      <Header
        showRankBreakdownInSecondCard
        showPlanCard
        planCardValue={plannedPoValue}
        planCardScopeLabel={selectedPic === 'all' ? 'All PICs' : 'Filtered PIC'}
        planCardMode={filterType}
        planCardData={plannedPoChartData}
      />

      <main className={styles.mainContent}>
        {/* ── KPI Grid ─────────────────────────────────────────── */}
        {hasData && (
          <section className={styles.entitySplitRow}>
            <article className={`${styles.entitySectionCard} ${styles.entitySectionUsers}`}>
              <div className={styles.entitySectionHeader}>
                <span className={styles.entitySectionTitle}>Users Section</span>
                <span className={styles.entitySectionBadge}>PIC</span>
              </div>
              <div className={styles.entityMetricGrid}>
                <div className={styles.entityMetricItem}>
                  <span>Total Users</span>
                  <strong>{Number(data.total_sales_persons || 0).toLocaleString()}</strong>
                </div>
                <div className={styles.entityMetricItem}>
                  <span>Active Budgets</span>
                  <strong>{Number(data.total_budgets || 0).toLocaleString()}</strong>
                </div>
              </div>
            </article>

            <article className={`${styles.entitySectionCard} ${styles.entitySectionLeads}`}>
              <div className={styles.entitySectionHeader}>
                <span className={styles.entitySectionTitle}>Leads Section</span>
                <span className={styles.entitySectionBadge}>Filtered</span>
              </div>
              <div className={styles.entityMetricGrid}>
                <div className={styles.entityMetricItem}>
                  <span>Total Leads</span>
                  <strong>{leadSectionData.total.toLocaleString()}</strong>
                </div>
                <div className={styles.entityMetricItem}>
                  <span>Lead Persons</span>
                  <strong>{leadSectionData.persons.toLocaleString()}</strong>
                </div>
                <div className={styles.entityMetricItem}>
                  <span>Won Leads</span>
                  <strong>{leadSectionData.won.toLocaleString()}</strong>
                </div>
                <div className={styles.entityMetricItem}>
                  <span>Open Leads</span>
                  <strong>{leadSectionData.open.toLocaleString()}</strong>
                </div>
                <div className={styles.entityMetricItem}>
                  <span>Conversion</span>
                  <strong>{leadSectionData.conversion}%</strong>
                </div>
              </div>
            </article>
          </section>
        )}

        {hasData && (
          <div className={styles.kpiGrid}>
            <KPICard
              icon={<IconRevenue />} color="indigo"
              label="FY Revenue Target"
              value={formatAmount(data.fy_total_target || 0, currency)}
              subtitle={`Across ${data.total_sales_persons} sales persons`}
              trend={`FY ${fyLabel}`} up={true}
              onClick={() => navigate('/budget/dashboard')}
            />
            <KPICard
              icon={<IconBudget />} color="sky"
              label={`${monthLabel} Target`}
              value={formatAmount(data.month_target || 0, currency)}
              subtitle={`${data.days_remaining || 0} days remaining`}
              trend={`Day ${data.days_elapsed || 0} of month`} up={true}
              onClick={() => navigate('/budget/dashboard')}
            />
            <KPICard
              icon={<IconAchieved />} color={monthKpiColor}
              label={`${monthLabel} Achieved`}
              value={formatAmount(data.month_achieved || 0, currency)}
              subtitle={`${monthPct}% of month target`}
              trend={monthPct >= 100 ? 'Target exceeded!' : `${formatAmount(data.month_remaining || 0, currency)} remaining`}
              up={monthPct >= 50}
              onClick={() => navigate('/budget/dashboard')}
            />
            <KPICard
              icon={<IconWallet />}
              color={(data.fy_remaining || 0) > 0 ? 'violet' : 'emerald'}
              label="FY Remaining"
              value={formatAmount(data.fy_remaining || 0, currency)}
              subtitle={`${fyPct}% achieved so far`}
              trend={(data.fy_remaining || 0) > 0 ? `${(100 - fyPct).toFixed(1)}% to go` : 'Above target'}
              up={(data.fy_remaining || 0) <= 0}
              onClick={() => navigate('/budget/dashboard')}
            />
            <KPICard
              icon={<IconDeals />} color="amber"
              label="Deals Closed (FY)"
              value={`${data.fy_deals_closed || 0} / ${data.total_target_deals || 0}`}
              subtitle={`${data.deals_closed_this_month || 0} this month`}
              trend={`Target: ${data.total_target_deals || 0} deals`}
              up={(data.fy_deals_closed || 0) >= (data.total_target_deals || 0)}
              onClick={() => navigate('/budget/dashboard')}
            />
          </div>
        )}

{/* ── Row 1: Budget by Category + Achievements ─────────── */}
        <div className={styles.chartsRow}>
          <div className={`${styles.chartCard} ${styles.cardBorderIndigo}`}>
            <div className={styles.cardHeader}>
              <span className={styles.cardTitle}>Monthly Budget by Category</span>
              <div className={styles.cardHeaderActions}>
                <span className={`${styles.cardBadge} ${styles.badgeIndigo}`}>
                  FY {fyLabel}
                </span>
                <select
                  className={styles.cardMonthSelect}
                  value={selectedMonth}
                  onChange={(e) => handleMonth(e.target.value)}
                  aria-label="Select month in financial year"
                >
                  {FY_MONTHS.map((month) => (
                    <option key={month} value={month}>{month}</option>
                  ))}
                </select>
              </div>
            </div>
            <TargetAchievementSummary
              data={data}
              currency={currency}
              monthLabel={monthLabel}
            />
          </div>
          <div className={`${styles.chartCard} ${styles.cardBorderSky}`}>
            <div className={styles.cardHeader}>
              <span className={styles.cardTitle}>Achievements</span>
              <span className={`${styles.cardBadge} ${styles.badgeSky}`}>Speedometer</span>
            </div>
            <AdminSpeedometer key={`speed-${filterKey}`} />
          </div>
        </div>

        {/* ── Row 2: Funnel + Pie + Progress ───────────────────── */}
        <div className={styles.chartsRow3}>
          <div className={`${styles.chartCard} ${styles.cardBorderViolet}`}>
            <div className={styles.cardHeader}>
              <span className={styles.cardTitle}>Sales Funnel</span>
              <span className={`${styles.cardBadge} ${styles.badgeViolet}`}>By Stage</span>
            </div>
            <CustomAdminFunnelChart key={`funnel-${filterKey}`} />
          </div>
          <div className={`${styles.chartCard} ${styles.cardBorderTeal}`}>
            <div className={styles.cardHeader}>
              <span className={styles.cardTitle}>Business Bifurcation</span>
              <span className={`${styles.cardBadge} ${styles.badgeTeal}`}>Vertical</span>
            </div>
            <AdminPieChartComponent key={`pie-${filterKey}`} />
          </div>
          <div className={`${styles.chartCard} ${styles.cardBorderAmber}`}>
            <div className={styles.cardHeader}>
              <span className={styles.cardTitle}>Monthly Progress</span>
              <span className={`${styles.cardBadge} ${styles.badgeAmber}`}>{monthLabel || 'This Month'}</span>
            </div>
            <MonthlyProgress budgetData={data} />
          </div>
        </div>

        {/* ── Row 3: Category opportunity + Month wise ─────────── */}
        <div className={styles.chartsRow}>
          <div className={`${styles.chartCard} ${styles.cardBorderFuchsia}`}>
            <div className={styles.cardHeader}>
              <span className={styles.cardTitle}>Category Wise Opportunity</span>
              <span className={`${styles.cardBadge} ${styles.badgeFuchsia}`}>By Value</span>
            </div>
            <AdminBarChartComponent key={`bar-${filterKey}`} />
          </div>
          <div className={`${styles.chartCard} ${styles.cardBorderEmerald}`}>
            <div className={styles.cardHeader}>
              <span className={styles.cardTitle}>Month Wise Budget vs Sales</span>
              <span className={`${styles.cardBadge} ${styles.badgeEmerald}`}>Trend</span>
            </div>
            <AdminMonthWiseBudget key={`budget-${filterKey}`} />
          </div>
        </div>

        {/* ── Opportunity Pipeline ─────────────────────────────── */}
        <div className={`${styles.tableCard} ${styles.cardBorderIndigo}`}>
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>Opportunity Pipeline</span>
            <span className={`${styles.cardBadge} ${styles.badgeIndigo}`}>All Stages</span>
          </div>
          <AdminOpportunityStatus />
        </div>

      </main>
    </div>
  );
};

export default SalesAdminDashboard;


