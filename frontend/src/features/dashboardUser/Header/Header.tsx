import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './Header.module.css';
import { fetchHeaderStats } from './slice/headerStatsSlice';
import { fetchOpportunityWorkspaceTableData } from '../../OpportunityWorkspaceTable/Slice/OpportunityWorkspaceTableSlice';
import { fetchAdminOpportunityWorkspaceTableData } from '../../AdminOpportunityWorkspaceTable/AdminOpportunityWorkspaceTableSlice/AdminOpportunityWorkspaceTableSlice';
import { fetchMonthWiseBudgetData } from '../MonthWiseBudget/slice/monthWiseBudget';
import type { RootState } from '../../../app/store';
import {
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  PieChart as RechartsPieChart,
  Bar,
  Pie,
  Cell,
  LabelList,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

interface SparklineProps {
  points: number[];
  pointLabels?: string[];
  color: string;
  gradientId: string;
}

const formatSparkValue = (value: number): string => {
  if (!Number.isFinite(value)) return '0';
  const rounded = Math.abs(value % 1) > 0 ? Number(value.toFixed(2)) : value;
  return rounded.toLocaleString('en-IN', {
    minimumFractionDigits: Math.abs(rounded % 1) > 0 ? 2 : 0,
    maximumFractionDigits: 2,
  });
};

const Sparkline: React.FC<SparklineProps> = ({ points, pointLabels, color, gradientId }) => {
  const W = 220;
  const H = 56;
  const pad = 9;
  const safePoints = points.length > 0 ? points : [0];
  const safePointLabels =
    pointLabels && pointLabels.length > 0
      ? pointLabels
      : safePoints.map((_, i) => `Point ${i + 1}`);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const min = Math.min(...safePoints);
  const max = Math.max(...safePoints);
  const range = max - min || 1;
  const pointCount = safePoints.length;

  const xs = safePoints.map((_, i) =>
    pointCount === 1 ? W / 2 : (i / (pointCount - 1)) * W
  );
  const ys = safePoints.map(
    (v) => H - pad - ((v - min) / range) * (H - pad * 2) + pad
  );
  const linePath = xs.map((x, i) => `${i === 0 ? 'M' : 'L'}${x},${ys[i]}`).join(' ');
  const areaPath = `${linePath} L${W},${H + 4} L0,${H + 4}Z`;

  const safeActiveIndex = activeIndex === null ? pointCount - 1 : activeIndex;
  const activeX = xs[Math.max(0, Math.min(safeActiveIndex, pointCount - 1))];
  const activeY = ys[Math.max(0, Math.min(safeActiveIndex, pointCount - 1))];
  const activeLabelText =
    safePointLabels[Math.max(0, Math.min(safeActiveIndex, safePointLabels.length - 1))] ||
    `Point ${safeActiveIndex + 1}`;
  const activeValueText = formatSparkValue(
    safePoints[Math.max(0, Math.min(safeActiveIndex, pointCount - 1))]
  );
  const bubbleWidth = Math.min(
    W - 6,
    Math.max(
      96,
      Math.max(activeLabelText.length * 6.2 + 16, activeValueText.length * 6.8 + 16)
    )
  );
  const preferredX =
    activeX + bubbleWidth + 10 > W
      ? activeX - bubbleWidth - 10
      : activeX + 10;
  const bubbleX = Math.max(2, Math.min(preferredX, W - bubbleWidth - 2));
  const bubbleY = 2;

  const handleMouseMove = (event: React.MouseEvent<SVGSVGElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    if (rect.width <= 0) return;
    const localX = ((event.clientX - rect.left) / rect.width) * W;
    let nearest = 0;
    let minDistance = Math.abs(xs[0] - localX);

    for (let i = 1; i < xs.length; i += 1) {
      const dist = Math.abs(xs[i] - localX);
      if (dist < minDistance) {
        nearest = i;
        minDistance = dist;
      }
    }

    setActiveIndex(nearest);
  };

  return (
    <svg
      className={styles.sparklineSvg}
      viewBox={`0 0 ${W} ${H + 4}`}
      preserveAspectRatio="none"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setActiveIndex(null)}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.18" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#${gradientId})`} />
      <path
        d={linePath}
        fill="none"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line
        x1={0}
        y1={H + 2}
        x2={W}
        y2={H + 2}
        stroke="#E2E8F0"
        strokeWidth="1"
      />
      {activeIndex !== null && (
        <line
          x1={activeX}
          y1={pad - 1}
          x2={activeX}
          y2={H + 2}
          stroke={color}
          strokeOpacity="0.45"
          strokeDasharray="2 2"
          strokeWidth="1"
        />
      )}
      <circle cx={activeX} cy={activeY} r="2.8" fill={color} />
      {activeIndex !== null && (
        <g transform={`translate(${bubbleX}, ${bubbleY})`}>
          <rect
            width={bubbleWidth}
            height={30}
            rx={8}
            ry={8}
            fill="rgba(255,255,255,0.98)"
            stroke="#CBD5E1"
          />
          <text
            x={8}
            y={11}
            textAnchor="start"
            fontSize="8.5"
            fontWeight="700"
            fill="#475569"
          >
            {activeLabelText}
          </text>
          <text
            x={8}
            y={23}
            textAnchor="start"
            fontSize="9"
            fontWeight="700"
            fill="#0F172A"
          >
            {activeValueText}
          </text>
        </g>
      )}
    </svg>
  );
};

const TrendBadge: React.FC<{ value: string; up: boolean }> = ({ value, up }) => (
  <span className={up ? styles.trendUp : styles.trendDown}>
    {up ? '\u2191' : '\u2193'} {value}
  </span>
);

interface StatCardProps {
  colorClass: 'order' | 'funnel' | 'projection' | 'sales';
  heading: string;
  iconPath: string;
  primaryValue: string;
  primaryLabel: string;
  trend: string;
  trendUp: boolean;
  sparkPoints: number[];
  sparkLabels?: string[];
  sparkColor: string;
  sparkGradientId: string;
  rows: { label: string; value: string | number }[];
  customChart?: React.ReactNode;
  customChartHeight?: number;
}

const BudgetVsAchievementChart: React.FC<{
  budget: number;
  achievement: number;
  periodLabel: string;
}> = ({
  budget,
  achievement,
  periodLabel,
}) => {
  const safeBudget = Math.max(0, budget);
  const safeAchievement = Math.max(0, achievement);
  const achievedPct = safeBudget > 0 ? Math.round((safeAchievement / safeBudget) * 100) : 0;
  const variance = safeAchievement - safeBudget;
  const variancePositive = variance >= 0;
  const maxValue = Math.max(safeBudget, safeAchievement, 1);
  const chartData = [
    {
      name: 'Budget',
      value: safeBudget,
      color: '#F59E0B',
    },
    {
      name: 'Achievement',
      value: safeAchievement,
      color: '#0EA5A3',
    },
  ];

  const compact = (v: number) => {
    if (v >= 10_000_000) return `\u20B9${(v / 10_000_000).toFixed(1)}Cr`;
    if (v >= 100_000) return `\u20B9${(v / 100_000).toFixed(1)}L`;
    if (v >= 1000) return `\u20B9${(v / 1000).toFixed(1)}K`;
    return `\u20B9${Math.round(v)}`;
  };

  const axisCompact = (v: number) => {
    if (v >= 10_000_000) return `${(v / 10_000_000).toFixed(1)}Cr`;
    if (v >= 100_000) return `${(v / 100_000).toFixed(1)}L`;
    if (v >= 1000) return `${(v / 1000).toFixed(1)}K`;
    return `${Math.round(v)}`;
  };

  const safePeriodLabel = periodLabel?.trim() || 'Monthly View';

  return (
    <div className={styles.budgetBarChart}>
      <div className={styles.budgetBarMeta}>
        <span className={styles.budgetBarTitle}>{safePeriodLabel}</span>
        <span className={styles.budgetBarPct}>{achievedPct}% Achieved</span>
      </div>

      <div className={styles.budgetChartCanvas}>
        <ResponsiveContainer width="100%" height="100%">
          <RechartsBarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 12, right: 40, left: 4, bottom: 8 }}
            barCategoryGap="34%"
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
            <XAxis
              type="number"
              domain={[0, Math.ceil(maxValue * 1.2)]}
              tickFormatter={axisCompact}
              axisLine={{ stroke: '#E2E8F0' }}
              tickLine={false}
              width={50}
              tick={{ fontSize: 10.5, fill: '#94A3B8', fontWeight: 600 }}
            />
            <YAxis
              type="category"
              dataKey="name"
              axisLine={false}
              tickLine={false}
              width={92}
              tick={{ fontSize: 12, fill: '#64748B', fontWeight: 700 }}
            />
            <Tooltip
              cursor={{ fill: 'rgba(148,163,184,0.06)' }}
              formatter={(value: any, _name: string, item: any) => [
                compact(Number(value || 0)),
                item?.payload?.name || '',
              ]}
            />
            <Bar dataKey="value" radius={[0, 12, 12, 0]} barSize={42}>
              {chartData.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
              <LabelList
                dataKey="value"
                position="right"
                formatter={(value: number) => compact(Number(value || 0))}
                fill="#0F172A"
                fontSize={11}
                fontWeight={700}
              />
            </Bar>
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>

      <div className={styles.budgetLegend}>
        <span className={styles.budgetLegendItem}>Budget {compact(safeBudget)}</span>
        <span className={styles.budgetLegendItem}>Achievement {compact(safeAchievement)}</span>
      </div>

      <div className={styles.budgetVarianceRow}>
        <span className={styles.budgetVarianceLabel}>Variance</span>
        <span
          className={`${styles.budgetVarianceValue} ${
            variancePositive ? styles.budgetVariancePositive : styles.budgetVarianceNegative
          }`}
        >
          {variancePositive ? '+' : '-'} {compact(Math.abs(variance))}
        </span>
      </div>
    </div>
  );
};

const RankDistributionChart: React.FC<{
  periodLabel: string;
  data: {
    label: string;
    value: number;
    currentValue?: number;
    carriedValue?: number;
    color: string;
    lightColor?: string;
  }[];
}> = ({ periodLabel, data }) => {
  const safeData = data.map((item) => ({
    ...item,
    value: Math.max(0, Number(item.value || 0)),
    currentValue: Math.max(0, Number(item.currentValue ?? item.value ?? 0)),
    carriedValue: Math.max(0, Number(item.carriedValue ?? 0)),
  }));
  const total = safeData.reduce((sum, item) => sum + item.value, 0);
  const maxValue = Math.max(...safeData.map((item) => item.value), 1);

  return (
    <div className={styles.rankBarChart}>
      <div className={styles.rankBarMeta}>
        <span className={styles.rankBarTitle}>Ranks A-E</span>
        <span className={styles.rankBarTotal}>Total {total}</span>
      </div>

      <div className={styles.rankChartCanvas}>
        <ResponsiveContainer width="100%" height="100%">
          <RechartsBarChart
            data={safeData}
            margin={{ top: 12, right: 12, left: -8, bottom: 6 }}
            barCategoryGap="26%"
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EEF2FF" />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={{ stroke: '#E2E8F0' }}
              tick={{ fontSize: 10.5, fill: '#64748B', fontWeight: 700 }}
            />
            <YAxis
              allowDecimals={false}
              domain={[0, Math.ceil(maxValue * 1.2)]}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 9.5, fill: '#94A3B8' }}
              width={28}
            />
            <Tooltip
              cursor={{ fill: 'rgba(148,163,184,0.08)' }}
              formatter={(value: any, _name: string, payload: any) => [
                Number(value || 0).toLocaleString('en-IN'),
                payload?.name || payload?.payload?.label || '',
              ]}
            />
            <Bar dataKey="carriedValue" stackId="rank" radius={[0, 0, 0, 0]} barSize={34} name={`Passed Before ${periodLabel}`}>
              {safeData.map((item) => (
                <Cell key={`${item.label}-carried`} fill={item.lightColor || item.color} />
              ))}
            </Bar>
            <Bar dataKey="currentValue" stackId="rank" radius={[8, 8, 0, 0]} barSize={34} name={`${periodLabel} Changes`}>
              {safeData.map((item) => (
                <Cell key={`${item.label}-current`} fill={item.color} />
              ))}
              <LabelList
                dataKey="value"
                position="top"
                formatter={(value: number) => Number(value || 0).toLocaleString('en-IN')}
                fill="#0F172A"
                fontSize={9.5}
                fontWeight={700}
              />
            </Bar>
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>

      <div className={styles.rankBarFooter}>
        {periodLabel} · Light = passed from previous months · Dark = changes in selected filter month
      </div>
    </div>
  );
};

const OverallRankPieChart: React.FC<{
  periodLabel: string;
  data: { name: string; value: number; color: string }[];
}> = ({ periodLabel, data }) => {
  const safeData = data.map((item) => ({
    ...item,
    value: Math.max(0, Number(item.value || 0)),
  }));
  const total = safeData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className={styles.overallRankPieChart}>
      <div className={styles.overallRankMeta}>
        <span className={styles.overallRankTitle}>Overall Rank-wise Leads</span>
        <span className={styles.overallRankTotal}>Total {total}</span>
      </div>

      <div className={styles.overallRankCanvas}>
        <ResponsiveContainer width="100%" height="100%">
          <RechartsPieChart>
            <Pie
              data={safeData}
              dataKey="value"
              nameKey="name"
              innerRadius={48}
              outerRadius={82}
              paddingAngle={2}
              stroke="#FFFFFF"
              strokeWidth={2}
            >
              {safeData.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: any, _name: string, payload: any) => [
                Number(value || 0).toLocaleString('en-IN'),
                payload?.payload?.name || '',
              ]}
            />
          </RechartsPieChart>
        </ResponsiveContainer>

        <div className={styles.overallRankCenter}>
          <span className={styles.overallRankCenterValue}>{total}</span>
          <span className={styles.overallRankCenterLabel}>Leads</span>
        </div>
      </div>

      <div className={styles.overallRankLegend}>
        {safeData.map((item) => (
          <span key={item.name} className={styles.overallRankLegendItem}>
            <span
              className={styles.overallRankLegendDot}
              style={{ backgroundColor: item.color }}
            />
            {item.name}
          </span>
        ))}
      </div>

      <div className={styles.overallRankFooter}>{periodLabel}</div>
    </div>
  );
};

const ProjectionRankModelChart: React.FC<{
  periodLabel: string;
  rankAAchieved: number;
  rankBFunnelTotal: number;
  successRatioPct: number;
  scopeLabel: string;
}> = ({ periodLabel, rankAAchieved, rankBFunnelTotal, successRatioPct, scopeLabel }) => {
  const safeRankA = Math.max(0, Number(rankAAchieved || 0));
  const safeRankB = Math.max(0, Number(rankBFunnelTotal || 0));
  const safeSuccessRatio = Math.max(0, Number(successRatioPct || 0));
  const rankBCalculated = Number(((safeRankB * safeSuccessRatio) / 100).toFixed(2));
  const combinedTotal = Number((safeRankA + rankBCalculated).toFixed(2));
  const maxValue = Math.max(safeRankA, rankBCalculated, combinedTotal, 1);
  const noRankBData = safeRankB <= 0 || safeSuccessRatio <= 0 || rankBCalculated <= 0;

  const chartData = [
    { label: 'A (Achieved)', value: safeRankA, color: '#10B981' },
    { label: 'B (Calculated)', value: rankBCalculated, color: '#06B6D4' },
    { label: 'Total', value: combinedTotal, color: '#059669' },
  ];

  const amountFmt = (v: number): string => {
    const n = Math.max(0, Number(v || 0));
    if (n >= 10_000_000) return `\u20B9${(n / 10_000_000).toFixed(2)}Cr`;
    if (n >= 100_000) return `\u20B9${(n / 100_000).toFixed(2)}L`;
    return `\u20B9${n.toLocaleString('en-IN', {
      minimumFractionDigits: Number.isInteger(n) ? 0 : 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const axisFmt = (v: number): string => amountFmt(v).replace('\u20B9', '');

  return (
    <div className={styles.projectionModelChart}>
      <div className={styles.projectionModelMeta}>
        <span className={styles.projectionModelTitle}>Rank Projection Model</span>
        <span className={styles.projectionModelBadge}>
          B = {amountFmt(safeRankB)} x {safeSuccessRatio}%
        </span>
      </div>

      <div className={styles.projectionModelCanvas}>
        <ResponsiveContainer width="100%" height="100%">
          <RechartsBarChart
            data={chartData}
            margin={{ top: 14, right: 10, left: -8, bottom: 6 }}
            barCategoryGap="26%"
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#DCFCE7" />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={{ stroke: '#D1FAE5' }}
              tick={{ fontSize: 10.5, fill: '#065F46', fontWeight: 700 }}
            />
            <YAxis
              allowDecimals
              domain={[0, Math.ceil(maxValue * 1.25)]}
              tickFormatter={axisFmt}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 9.5, fill: '#86EFAC', fontWeight: 700 }}
              width={42}
            />
            <Tooltip
              cursor={{ fill: 'rgba(16,185,129,0.08)' }}
              formatter={(value: any, _name: string, payload: any) => [
                amountFmt(Number(value || 0)),
                payload?.payload?.label || '',
              ]}
            />
            <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={34} minPointSize={6}>
              {chartData.map((entry) => (
                <Cell key={entry.label} fill={entry.color} />
              ))}
              <LabelList
                dataKey="value"
                position="top"
                formatter={(value: number) => amountFmt(Number(value || 0))}
                fill="#14532D"
                fontSize={9.5}
                fontWeight={700}
              />
            </Bar>
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>

      <div className={styles.projectionModelFooter}>{periodLabel} | {scopeLabel}</div>
      {noRankBData && (
        <div className={styles.projectionModelHint}>
          Rank B value or success ratio is 0 for this filter, so B contribution is 0.
        </div>
      )}
    </div>
  );
};

const StatCard: React.FC<StatCardProps> = ({
  colorClass,
  heading,
  iconPath,
  primaryValue,
  primaryLabel,
  trend,
  trendUp,
  sparkPoints,
  sparkLabels,
  sparkColor,
  sparkGradientId,
  rows,
  customChart,
  customChartHeight,
}) => (
  <div className={`${styles.card} ${styles[colorClass]}`}>
    <div className={styles.cardTop}>
      <div className={styles.cardTopLeft}>
        <div className={styles.iconWrap}>
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d={iconPath} />
          </svg>
        </div>
        <span className={styles.heading}>{heading}</span>
      </div>
      <TrendBadge value={trend} up={trendUp} />
    </div>

    <div className={styles.primaryValue}>{primaryValue}</div>
    <div className={styles.primaryLabel}>{primaryLabel}</div>

    <div
      className={styles.sparkWrap}
      style={customChart ? { height: customChartHeight ?? 128 } : undefined}
    >
      {customChart ?? (
        <Sparkline
          points={sparkPoints}
          pointLabels={sparkLabels}
          color={sparkColor}
          gradientId={sparkGradientId}
        />
      )}
    </div>

    <div className={styles.divider} />

    <div className={styles.rows}>
      {rows.map((row, i) => (
        <div key={i} className={styles.row}>
          <span className={styles.label}>{row.label}</span>
          <span className={styles.value}>{row.value}</span>
        </div>
      ))}
    </div>
  </div>
);

const SkeletonCard: React.FC = () => (
  <div
    className={styles.card}
    style={{
      background: '#F8FAFC',
      animation: 'pulse 1.5s ease-in-out infinite',
      minHeight: 200,
    }}
  />
);

const fmtAmount = (v: number): string => {
  if (v >= 10_000_000) return `\u20B9${(v / 10_000_000).toFixed(2)}Cr`;
  if (v >= 100_000) return `\u20B9${(v / 100_000).toFixed(2)}L`;
  if (v > 0) return `\u20B9${v.toLocaleString('en-IN')}`;
  return '\u20B90';
};

const buildSpark = (...values: number[]): number[] => {
  const pts = values.map((v) => Math.max(v, 0));
  return pts.every((p) => p === 0) ? [0, 0, 0, 0] : pts;
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

const normalizeRank = (value: unknown): string => String(value || '').trim().toLowerCase();

const parseStageMonthValue = (value: unknown): Date | null => {
  const text = String(value || '').trim();
  if (!text) return null;

  const parsed = new Date(text);
  if (!Number.isNaN(parsed.getTime())) {
    return parsed;
  }

  const parts = text.split(/\s+/);
  if (parts.length >= 2) {
    const monthNum = MONTH_NAME_TO_NUM[parts[0]];
    const yearNum = Number(parts[1]);
    if (monthNum && Number.isFinite(yearNum)) {
      return new Date(yearNum, monthNum - 1, 1);
    }
  }

  return null;
};

const parseFlexibleDate = (value: unknown): Date | null => {
  const text = String(value || '').trim();
  if (!text) return null;

  const parsed = new Date(text);
  if (!Number.isNaN(parsed.getTime())) {
    return parsed;
  }

  const parts = text.match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/);
  if (parts) {
    const [, day, month, year] = parts;
    const fallback = new Date(Number(year), Number(month) - 1, Number(day));
    if (!Number.isNaN(fallback.getTime())) {
      return fallback;
    }
  }

  return null;
};

const getFiscalMonthIndex = (date: Date): number => {
  const month = date.getMonth() + 1;
  return month >= 4 ? month - 3 : month + 9;
};

const normalizeUserKey = (value: unknown): string =>
  String(value || '').trim().toLowerCase();

const getOpportunityPlannedAmount = (row: any): number => {
  const valuesAmount = Number(row?.values || 0);
  const totalAmount = Number(row?.total_amount || 0);

  if (totalAmount > 0) return totalAmount;
  if (valuesAmount > 0) return valuesAmount;
  return 0;
};

interface HeaderProps {
  showRankBreakdownInSecondCard?: boolean;
  showPlanCard?: boolean;
  planCardValue?: number;
  planCardScopeLabel?: string;
  planCardMode?: 'monthly' | 'yearly';
  planCardData?: { label: string; value: number; color?: string }[];
}

const Header: React.FC<HeaderProps> = ({
  showRankBreakdownInSecondCard = false,
  showPlanCard = false,
  planCardValue = 0,
  planCardScopeLabel,
  planCardMode = 'yearly',
  planCardData = [],
}) => {
  const dispatch = useDispatch();

  const { data, loading, error } = useSelector((s: RootState) => s.fetchHeaderStats);
  const { currentMonth, adminSummary } = useSelector((s: RootState) => s.budget);
  const opportunityRows = useSelector((s: RootState) => s.OpportunityWorkspaceTableData?.OpportunityData ?? []);
  const adminOpportunityRows = useSelector((s: RootState) => s.fetchAdminOpportunityWorkspaceData?.data ?? []);
  const monthWiseBudgetData = useSelector((s: RootState) => s.fetchMonthWiseBudgetData?.budgetdata ?? []);
  const salesPersons = useSelector((s: RootState) => (s as any)?.budget?.salesPersons ?? []);
  const currentUser = useSelector((s: RootState) => (s as any)?.userLoginAuth?.user);
  const userRole = currentUser?.role;
  const { selectedYear, selectedMonth, filterType, selectedPic } = useSelector((s: RootState) => s.globalFilter);

  useEffect(() => {
    dispatch(fetchHeaderStats() as any);
  }, [dispatch, selectedYear, selectedMonth, selectedPic, filterType]);

  useEffect(() => {
    if (userRole !== 'admin') {
      dispatch(fetchOpportunityWorkspaceTableData() as any);
      dispatch(fetchMonthWiseBudgetData() as any);
    } else {
      dispatch(fetchAdminOpportunityWorkspaceTableData() as any);
    }
  }, [dispatch, userRole]);

  useEffect(() => {
    if (showPlanCard && userRole !== 'admin') {
      dispatch(fetchMonthWiseBudgetData() as any);
    }
  }, [dispatch, filterType, selectedMonth, selectedYear, showPlanCard, userRole]);

  const order = data?.order ?? {
    new_orders: 0,
    new_funnel: 0,
    new_customers: 0,
  };

  const funnel = data?.funnel ?? {
    total_funnel: 0,
    total_a_funnel: 0,
    repeat_funnel: 0,
    rank_a: 0,
    rank_b: 0,
    rank_c: 0,
    rank_d: 0,
    rank_abcd_total: 0,
  };

  const projection = data?.projection ?? {
    projection_pct: 0,
    projection_deals: 0,
    total_funnel_fy: 0,
    rank_a_fy: 0,
    conversion_ratio: 0,
    repeat_order: 0,
  };

  const sales = data?.sales ?? {
    rank_a_total: 0,
    to_be_build: 0,
    repeat_sales: 0,
  };
  const monthWiseSource =
    userRole === 'admin'
      ? (adminSummary ?? currentMonth)
      : (currentMonth ?? adminSummary);
  const budgetAmount = Math.max(
    0,
    Number(
      filterType === 'monthly'
        ? (monthWiseSource?.monthly_budget || monthWiseSource?.month_target || 0)
        : (monthWiseSource?.fy_target || monthWiseSource?.fy_total_target || 0)
    )
  );
  const achievedAmount = Math.max(
    0,
    Number(
      filterType === 'monthly'
        ? (monthWiseSource?.month_achieved ?? 0)
        : (monthWiseSource?.fy_achieved ?? 0)
    )
  );

  const periodLabel =
    filterType === 'monthly'
      ? selectedMonth
      : `FY ${selectedYear}-${String(selectedYear + 1).slice(2)}`;
  const budgetPeriodLabel =
    filterType === 'monthly'
      ? `${selectedMonth} FY ${selectedYear}-${String(selectedYear + 1).slice(2)}`
      : `FY ${selectedYear}-${String(selectedYear + 1).slice(2)}`;

  const derivedRankStats = React.useMemo(() => {
    const rows =
      userRole === 'admin'
        ? (Array.isArray(adminOpportunityRows) ? adminOpportunityRows : [])
        : (Array.isArray(opportunityRows) ? opportunityRows : []);
    const fyStart = new Date(selectedYear, 3, 1, 0, 0, 0, 0);
    const fyEnd = new Date(selectedYear + 1, 2, 31, 23, 59, 59, 999);
    const selectedMonthNum = MONTH_NAME_TO_NUM[selectedMonth] || 0;
    const selectedMonthYear =
      selectedMonthNum > 0 ? (selectedMonthNum <= 3 ? selectedYear + 1 : selectedYear) : selectedYear;
    const selectedMonthIndex =
      selectedMonthNum > 0 ? getFiscalMonthIndex(new Date(selectedMonthYear, selectedMonthNum - 1, 1)) : 0;
    const currentUserKeys = new Set(
      [
        currentUser?.username,
        currentUser?.name,
        currentUser?.full_name,
        currentUser?.email,
      ]
        .map(normalizeUserKey)
        .filter(Boolean)
    );
    const selectedPicKeys = new Set(
      (
        selectedPic !== 'all'
          ? (Array.isArray(salesPersons) ? salesPersons : []).flatMap((person: any) => {
              if (String(person?.id ?? '') !== String(selectedPic)) return [];

              return [
                person?.id,
                person?.username,
                person?.name,
                person?.full_name,
                person?.first_name,
                person?.email,
                person?.email_id,
              ];
            })
          : []
      )
        .map(normalizeUserKey)
        .filter(Boolean)
    );

    const createRankBucket = () => ({
      total: 0,
      current: 0,
      carried: 0,
    });
    const counts = {
      rankA: createRankBucket(),
      rankB: createRankBucket(),
      rankC: createRankBucket(),
      rankD: createRankBucket(),
      rankE: createRankBucket(),
    };
    const rankKeyMap: Record<string, keyof typeof counts> = {
      'rank a': 'rankA',
      'rank b': 'rankB',
      'rank c': 'rankC',
      'rank d': 'rankD',
      'rank e': 'rankE',
    };

    rows.forEach((row: any) => {
      const rowKeys = [
        row?.user,
        row?.pic,
        row?.account_holder,
        row?.assign_to,
        row?.username,
        row?.email_id,
        row?.user_id,
        row?.pic_id,
      ]
        .map(normalizeUserKey)
        .filter(Boolean);

      if (userRole !== 'admin' && currentUserKeys.size > 0) {
        const belongsToCurrentUser = rowKeys.some((key) => currentUserKeys.has(key));
        if (!belongsToCurrentUser) return;
      }

      if (userRole === 'admin' && selectedPicKeys.size > 0) {
        const belongsToSelectedPic = rowKeys.some((key) => selectedPicKeys.has(key));
        if (!belongsToSelectedPic) return;
      }

      const stages = Array.isArray(row?.opportunity_stages) ? row.opportunity_stages : [];
      const latestStage = stages[stages.length - 1];
      const date =
        parseStageMonthValue(latestStage?.month) ||
        parseStageMonthValue(row?.last_update) ||
        parseStageMonthValue(row?.acct_created_date);
      if (!date) return;
      if (Number.isNaN(date.getTime())) return;

      const latestRank = normalizeRank(latestStage?.ranks);
      const rankKey = rankKeyMap[latestRank];
      if (!rankKey) return;

      const isInFy = date >= fyStart && date <= fyEnd;
      if (!isInFy) return;

      if (filterType === 'yearly') {
        counts[rankKey].total += 1;
        counts[rankKey].current += 1;
        return;
      }

      const rowFiscalIndex = getFiscalMonthIndex(date);
      if (rowFiscalIndex > selectedMonthIndex) return;

      const isCurrentMonthStage =
        date.getMonth() + 1 === selectedMonthNum && date.getFullYear() === selectedMonthYear;

      if (rankKey === 'rankA') {
        if (isCurrentMonthStage) {
          counts[rankKey].total += 1;
          counts[rankKey].current += 1;
        }
        return;
      }

      counts[rankKey].total += 1;

      if (isCurrentMonthStage) {
        counts[rankKey].current += 1;
      } else {
        counts[rankKey].carried += 1;
      }
    });

    return counts;
  }, [adminOpportunityRows, currentUser, filterType, opportunityRows, salesPersons, selectedMonth, selectedPic, selectedYear, userRole]);

  const rankA = Math.max(
    0,
    Number(
      filterType === 'monthly'
        ? (derivedRankStats.rankA.total || 0)
        : (derivedRankStats.rankA.total || (funnel as any).rank_a || 0)
    )
  );
  const rankB = Math.max(
    0,
    Number(
      filterType === 'monthly'
        ? (derivedRankStats.rankB.total || 0)
        : (derivedRankStats.rankB.total || monthWiseSource?.fy_rank_b_count || (funnel as any).rank_b || 0)
    )
  );
  const rankC = Math.max(
    0,
    Number(
      filterType === 'monthly'
        ? (derivedRankStats.rankC.total || 0)
        : (derivedRankStats.rankC.total || (funnel as any).rank_c || 0)
    )
  );
  const rankD = Math.max(
    0,
    Number(
      filterType === 'monthly'
        ? (derivedRankStats.rankD.total || 0)
        : (derivedRankStats.rankD.total || (funnel as any).rank_d || 0)
    )
  );
  const rankE = Math.max(
    0,
    Number(
      filterType === 'monthly'
        ? (derivedRankStats.rankE.total || 0)
        : (derivedRankStats.rankE.total || (funnel as any).rank_e || order.new_customers || 0)
    )
  );
  const rankACurrent = Number(
    filterType === 'monthly' ? derivedRankStats.rankA.current : rankA
  );
  const rankBCurrent = Number(
    filterType === 'monthly' ? derivedRankStats.rankB.current : rankB
  );
  const rankCCurrent = Number(
    filterType === 'monthly' ? derivedRankStats.rankC.current : rankC
  );
  const rankDCurrent = Number(
    filterType === 'monthly' ? derivedRankStats.rankD.current : rankD
  );
  const rankECurrent = Number(
    filterType === 'monthly' ? derivedRankStats.rankE.current : rankE
  );
  const rankACarried = Number(
    0
  );
  const rankBCarried = Number(
    filterType === 'monthly' ? derivedRankStats.rankB.carried : 0
  );
  const rankCCarried = Number(
    filterType === 'monthly' ? derivedRankStats.rankC.carried : 0
  );
  const rankDCarried = Number(
    filterType === 'monthly' ? derivedRankStats.rankD.carried : 0
  );
  const rankECarried = Number(
    filterType === 'monthly' ? derivedRankStats.rankE.carried : 0
  );
  const selectedPicLabel =
    selectedPic === 'all'
      ? 'All PICs'
      : (() => {
          const match = (Array.isArray(salesPersons) ? salesPersons : []).find(
            (p: any) => String(p?.id) === String(selectedPic)
          );
          const name = String(
            match?.username ??
            match?.name ??
            match?.full_name ??
            match?.first_name ??
            ''
          ).trim();
          return name ? `PIC ${name}` : `PIC ${selectedPic}`;
        })();
  const projectionRankATotal = Math.max(
    0,
    Number(
      (
        filterType === 'monthly'
          ? monthWiseSource?.month_achieved
          : monthWiseSource?.fy_achieved
      ) ?? sales.rank_a_total ?? achievedAmount ?? 0
    )
  );
  const projectionRankBFunnelTotal = Math.max(
    0,
    Number(
      (
        filterType === 'monthly'
          ? monthWiseSource?.month_rank_b_value
          : monthWiseSource?.fy_rank_b_value
      ) ?? (
        filterType === 'monthly'
          ? monthWiseSource?.month_rank_b_count
          : monthWiseSource?.fy_rank_b_count
      ) ?? rankB ?? 0
    )
  );
  const projectionSuccessRatio = Math.max(
    0,
    Number(
      (
        filterType === 'monthly'
          ? monthWiseSource?.month_achievement_pct
          : monthWiseSource?.fy_achievement_pct
      ) ?? projection.projection_pct ?? projection.conversion_ratio ?? 0
    )
  );
  const projectionRankBCalculated = Number(
    ((projectionRankBFunnelTotal * projectionSuccessRatio) / 100).toFixed(2)
  );
  const projectionRankABTotal = Number(
    (projectionRankATotal + projectionRankBCalculated).toFixed(2)
  );
  const rankChartData = [
    { label: 'Rank A', value: rankA, currentValue: filterType === 'monthly' ? rankACurrent : rankA, carriedValue: filterType === 'monthly' ? rankACarried : 0, color: '#4F46E5', lightColor: '#C7D2FE' },
    {
      label: 'Rank B',
      value: rankB,
      currentValue: filterType === 'monthly' ? rankBCurrent : rankB,
      carriedValue: filterType === 'monthly' ? rankBCarried : 0,
      color: '#0891B2',
      lightColor: '#E0F7FF',
    },
    {
      label: 'Rank C',
      value: rankC,
      currentValue: filterType === 'monthly' ? rankCCurrent : rankC,
      carriedValue: filterType === 'monthly' ? rankCCarried : 0,
      color: '#0F9F8C',
      lightColor: '#DCFDF7',
    },
    {
      label: 'Rank D',
      value: rankD,
      currentValue: filterType === 'monthly' ? rankDCurrent : rankD,
      carriedValue: filterType === 'monthly' ? rankDCarried : 0,
      color: '#D97706',
      lightColor: '#FFF3D6',
    },
    {
      label: 'Rank E',
      value: rankE,
      currentValue: filterType === 'monthly' ? rankECurrent : rankE,
      carriedValue: filterType === 'monthly' ? rankECarried : 0,
      color: '#DC2626',
      lightColor: '#FFE1E1',
    },
  ];
  const rankPieData = [
    { name: 'Rank A', value: rankA, color: '#4F46E5' },
    { name: 'Rank B', value: rankB, color: '#06B6D4' },
    { name: 'Rank C', value: rankC, color: '#14B8A6' },
    { name: 'Rank D', value: rankD, color: '#F59E0B' },
    { name: 'Rank E', value: rankE, color: '#EF4444' },
  ];
  const totalRankLeads = rankPieData.reduce((sum, item) => sum + item.value, 0);
  const totalFunnelValue = Math.max(
    0,
    Number(funnel.total_funnel || funnel.rank_abcd_total || totalRankLeads || 0)
  );
  const currentUserKeys = new Set(
    [
      currentUser?.username,
      currentUser?.name,
      currentUser?.full_name,
      currentUser?.email,
    ]
      .map(normalizeUserKey)
      .filter(Boolean)
  );
  const defaultPlanCardValue = React.useMemo(() => {
    if (!showPlanCard || userRole === 'admin') return 0;

    const rows = Array.isArray(opportunityRows) ? opportunityRows : [];
    const fyStart = new Date(selectedYear, 3, 1, 0, 0, 0, 0);
    const fyEnd = new Date(selectedYear + 1, 2, 31, 23, 59, 59, 999);
    const selectedMonthNum = MONTH_NAME_TO_NUM[selectedMonth] || 0;
    const selectedMonthYear =
      selectedMonthNum > 0 ? (selectedMonthNum <= 3 ? selectedYear + 1 : selectedYear) : selectedYear;

    return rows.reduce((sum: number, row: any) => {
      const rowKeys = [
        row?.user,
        row?.pic,
        row?.account_holder,
        row?.assign_to,
        row?.username,
        row?.email_id,
      ]
        .map(normalizeUserKey)
        .filter(Boolean);
      if (currentUserKeys.size > 0 && !rowKeys.some((key) => currentUserKeys.has(key))) return sum;

      const poDate = parseFlexibleDate(row?.exp_po_date);
      if (!poDate) return sum;

      const isDateMatch =
        filterType === 'monthly'
          ? poDate.getMonth() + 1 === selectedMonthNum && poDate.getFullYear() === selectedMonthYear
          : poDate >= fyStart && poDate <= fyEnd;
      if (!isDateMatch) return sum;

      const numericValue = getOpportunityPlannedAmount(row);
      return sum + numericValue;
    }, 0);
  }, [showPlanCard, userRole, opportunityRows, selectedYear, selectedMonth, filterType, currentUserKeys]);
  const defaultPlanCardData = React.useMemo(() => {
    if (!showPlanCard || userRole === 'admin') return [];

    const rows = Array.isArray(opportunityRows) ? opportunityRows : [];
    const fyStart = new Date(selectedYear, 3, 1, 0, 0, 0, 0);
    const fyEnd = new Date(selectedYear + 1, 2, 31, 23, 59, 59, 999);
    const selectedMonthNum = MONTH_NAME_TO_NUM[selectedMonth] || 0;
    const selectedMonthYear =
      selectedMonthNum > 0 ? (selectedMonthNum <= 3 ? selectedYear + 1 : selectedYear) : selectedYear;
    const grouped = new Map<string, number>();

    const fiscalMonths = [
      'April', 'May', 'June', 'July', 'August', 'September',
      'October', 'November', 'December', 'January', 'February', 'March',
    ];

    const getFiscalMonthLabel = (date: Date): string =>
      fiscalMonths[date.getMonth() >= 3 ? date.getMonth() - 3 : date.getMonth() + 9];

    if (filterType === 'yearly') {
      fiscalMonths.forEach((month) => grouped.set(month, 0));
    }

    rows.forEach((row: any) => {
      const rowKeys = [
        row?.user,
        row?.pic,
        row?.account_holder,
        row?.assign_to,
        row?.username,
        row?.email_id,
      ]
        .map(normalizeUserKey)
        .filter(Boolean);
      if (currentUserKeys.size > 0 && !rowKeys.some((key) => currentUserKeys.has(key))) return;

      const poDate = parseFlexibleDate(row?.exp_po_date);
      if (!poDate) return;

      const isDateMatch =
        filterType === 'monthly'
          ? poDate.getMonth() + 1 === selectedMonthNum && poDate.getFullYear() === selectedMonthYear
          : poDate >= fyStart && poDate <= fyEnd;
      if (!isDateMatch) return;

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

    const orderedLabels = filterType === 'monthly' ? [selectedMonth] : fiscalMonths;
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
  }, [showPlanCard, userRole, opportunityRows, monthWiseBudgetData, selectedYear, selectedMonth, filterType, currentUserKeys]);
  const effectivePlanCardValue =
    planCardValue > 0 || userRole === 'admin' ? planCardValue : defaultPlanCardValue;
  const effectivePlanCardData =
    planCardData.length > 0 || userRole === 'admin' ? planCardData : defaultPlanCardData;
  const effectivePlanScopeLabel =
    planCardScopeLabel || (userRole === 'admin' ? selectedPicLabel : 'My Opportunities');

  if (loading) {
    return (
      <div className={styles.mainContent}>
        {[1, 2, 3, 4].map((i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.mainContent}>
        <p style={{ color: '#DC2626', fontSize: 13, padding: '0 28px' }}>
          Failed to load stats. Please refresh.
        </p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className={styles.mainContent}>
        <p style={{ fontSize: 13, padding: '0 28px', color: '#6B7280' }}>
          No data available. Add opportunity data to get started.
        </p>
      </div>
    );
  }

  return (
    <div className={`${styles.mainContent} ${showPlanCard ? styles.mainContentFiveCols : ''}`}>
      <StatCard
        colorClass="sales"
        heading="Budget"
        iconPath="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"
        primaryValue={fmtAmount(budgetAmount)}
        primaryLabel={
          filterType === 'monthly'
            ? `Month target - ${budgetPeriodLabel}`
            : `FY target - ${budgetPeriodLabel}`
        }
        trend={budgetPeriodLabel}
        trendUp={budgetAmount > 0}
        sparkPoints={buildSpark(
          sales.repeat_sales,
          sales.to_be_build,
          sales.rank_a_total,
          sales.rank_a_total
        )}
        sparkLabels={['Repeat Sales', 'Open Pipeline', 'Rank A Revenue', 'Rank A Revenue']}
        sparkColor="#F59E0B"
        sparkGradientId="spark-sales"
        customChart={
          <BudgetVsAchievementChart
            budget={budgetAmount}
            achievement={achievedAmount}
            periodLabel={budgetPeriodLabel}
          />
        }
        customChartHeight={260}
        rows={[
          { label: filterType === 'monthly' ? 'Month Target' : 'FY Target', value: fmtAmount(budgetAmount) },
          { label: filterType === 'monthly' ? 'Month Achieved' : 'FY Achieved', value: fmtAmount(achievedAmount) },
        ]}
      />

      <StatCard
        colorClass="order"
        heading="Rank A"
        iconPath="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0"
        primaryValue={String(rankA)}
        primaryLabel={`Rank A count - ${periodLabel}`}
        trend={periodLabel}
        trendUp={rankA > 0}
        sparkPoints={buildSpark(rankA, rankB, rankC, rankD, rankE)}
        sparkLabels={['Rank A', 'Rank B', 'Rank C', 'Rank D', 'Rank E']}
        sparkColor="#4F46E5"
        sparkGradientId="spark-order"
        customChart={<RankDistributionChart periodLabel={periodLabel} data={rankChartData} />}
        customChartHeight={310}
        rows={[
          { label: 'Rank A', value: rankA },
          { label: 'Rank B', value: rankB },
          { label: 'Rank C', value: rankC },
          { label: 'Rank D', value: rankD },
          { label: 'Rank E', value: rankE },
        ]}
      />

      <StatCard
        colorClass="funnel"
        heading={showRankBreakdownInSecondCard ? 'Overall Leads' : 'Funnel'}
        iconPath={showRankBreakdownInSecondCard ? 'M4 6h16M4 12h16M4 18h16' : 'M22 3H2l8 9.46V19l4 2v-8.54L22 3z'}
        primaryValue={showRankBreakdownInSecondCard ? String(totalRankLeads) : String(totalFunnelValue)}
        primaryLabel={
          showRankBreakdownInSecondCard
            ? `Overall rank-wise leads - ${periodLabel}`
            : `Active pipeline - ${periodLabel} (B/C/D/E)`
        }
        trend={periodLabel}
        trendUp={showRankBreakdownInSecondCard ? totalRankLeads > 0 : totalFunnelValue > 0}
        sparkPoints={
          showRankBreakdownInSecondCard
            ? buildSpark(rankD, rankC, rankB, rankA)
            : buildSpark(funnel.repeat_funnel, funnel.total_a_funnel, totalFunnelValue, totalFunnelValue)
        }
        sparkLabels={
          showRankBreakdownInSecondCard
            ? ['Rank D', 'Rank C', 'Rank B', 'Rank A']
            : ['Repeat Accounts', 'Rank A Won', 'Total Funnel', 'Total Funnel']
        }
        sparkColor="#06B6D4"
        sparkGradientId="spark-funnel"
        customChart={
          showRankBreakdownInSecondCard
            ? <OverallRankPieChart periodLabel={periodLabel} data={rankPieData} />
            : undefined
        }
        customChartHeight={showRankBreakdownInSecondCard ? 310 : undefined}
        rows={
          showRankBreakdownInSecondCard
            ? [
                { label: 'Rank A', value: rankA },
                { label: 'Rank B', value: rankB },
                { label: 'Rank C', value: rankC },
                { label: 'Rank D', value: rankD },
                { label: 'Rank E', value: rankE },
              ]
            : [
                { label: 'Rank A Won', value: funnel.total_a_funnel },
                { label: 'Repeat Accounts in Funnel', value: funnel.repeat_funnel },
              ]
        }
      />

      <StatCard
        colorClass="projection"
        heading="Projection"
        iconPath="M18 20V10M12 20V4M6 20v-6"
        primaryValue={fmtAmount(projectionRankABTotal)}
        primaryLabel={`Total projected value - ${periodLabel}`}
        trend={selectedPicLabel}
        trendUp={projectionRankABTotal >= projectionRankATotal}
        sparkPoints={buildSpark(
          projection.repeat_order,
          (projection as any).projection_deals || 0,
          (projection as any).rank_a_fy || 0,
          (projection as any).total_funnel_fy || 0
        )}
        sparkLabels={['Repeat Orders', 'Projected Deals', 'Rank A FY', 'Total Funnel FY']}
        sparkColor="#10B981"
        sparkGradientId="spark-proj"
        customChart={
          <ProjectionRankModelChart
            periodLabel={periodLabel}
            rankAAchieved={projectionRankATotal}
            rankBFunnelTotal={projectionRankBFunnelTotal}
            successRatioPct={projectionSuccessRatio}
            scopeLabel={selectedPicLabel}
          />
        }
        customChartHeight={290}
        rows={[
          { label: 'Rank A Achieved', value: fmtAmount(projectionRankATotal) },
          { label: 'Rank B Funnel Total', value: fmtAmount(projectionRankBFunnelTotal) },
          { label: 'Success Ratio', value: `${projectionSuccessRatio}%` },
          { label: 'Rank B Calculated', value: fmtAmount(projectionRankBCalculated) },
          { label: 'Total', value: fmtAmount(projectionRankABTotal) },
        ]}
      />

      {showPlanCard && (
        <StatCard
          colorClass="projection"
          heading="PLAN"
          iconPath="M7 2v4M17 2v4M3 9h18M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z"
          primaryValue={fmtAmount(effectivePlanCardValue)}
          primaryLabel={`Expected PO by month - ${periodLabel}`}
          trend={effectivePlanScopeLabel}
          trendUp={effectivePlanCardValue > 0}
          sparkPoints={buildSpark(effectivePlanCardValue, effectivePlanCardValue, effectivePlanCardValue, effectivePlanCardValue)}
          sparkLabels={['Plan', 'Plan', 'Plan', 'Plan']}
          sparkColor="#10B981"
          sparkGradientId="spark-plan"
          customChart={
            <PlanPoBarChart
              mode={planCardMode}
              periodLabel={periodLabel}
              scopeLabel={effectivePlanScopeLabel}
              data={effectivePlanCardData}
            />
          }
          customChartHeight={290}
          rows={[
            { label: 'Expected PO Total', value: fmtAmount(effectivePlanCardValue) },
            { label: 'Filter', value: periodLabel },
            { label: 'Scope', value: effectivePlanScopeLabel },
          ]}
        />
      )}
    </div>
  );
};

const PlanPoBarChart: React.FC<{
  mode: 'monthly' | 'yearly';
  periodLabel: string;
  scopeLabel: string;
  data: { label: string; value: number; color?: string }[];
}> = ({ mode, periodLabel, scopeLabel, data }) => {
  const palette = ['#10B981', '#06B6D4', '#4F46E5', '#F59E0B', '#EF4444'];
  const chartTitle = mode === 'monthly' ? 'Expected PO Total' : 'Expected PO Allocation';
  const safeData = (Array.isArray(data) ? data : [])
    .map((item, index) => ({
      label: String(item?.label || `Item ${index + 1}`),
      shortLabel: String(item?.label || `Item ${index + 1}`).slice(0, 3),
      value: Math.max(0, Number(item?.value || 0)),
      color: item?.color || palette[index % palette.length],
    }))
    .filter((item) => item.value > 0);

  const total = safeData.reduce((sum, item) => sum + item.value, 0);
  const maxValue = Math.max(...safeData.map((item) => item.value), 1);

  const compact = (v: number): string => {
    if (v >= 10_000_000) return `\u20B9${(v / 10_000_000).toFixed(2)}Cr`;
    if (v >= 100_000) return `\u20B9${(v / 100_000).toFixed(2)}L`;
    if (v >= 1000) return `\u20B9${(v / 1000).toFixed(1)}K`;
    return `\u20B9${Math.round(v)}`;
  };

  const axisCompact = (v: number): string => {
    if (v >= 10_000_000) return `${(v / 10_000_000).toFixed(1)}Cr`;
    if (v >= 100_000) return `${(v / 100_000).toFixed(1)}L`;
    if (v >= 1000) return `${(v / 1000).toFixed(1)}K`;
    return `${Math.round(v)}`;
  };

  if (safeData.length === 0) {
    return (
      <div className={styles.projectionModelChart}>
        <div className={styles.projectionModelMeta}>
          <span className={styles.projectionModelTitle}>{chartTitle}</span>
          <span className={styles.projectionModelBadge}>Total {compact(total)}</span>
        </div>
        <div className={styles.projectionModelHint}>No expected PO records found for this filter.</div>
      </div>
    );
  }

  return (
    <div className={styles.projectionModelChart}>
      <div className={styles.projectionModelMeta}>
        <span className={styles.projectionModelTitle}>{chartTitle}</span>
        <span className={styles.projectionModelBadge}>Total {compact(total)}</span>
      </div>

      <div className={styles.projectionModelCanvas}>
        <ResponsiveContainer width="100%" height="100%">
          <RechartsBarChart
            data={safeData}
            margin={{ top: 14, right: 8, left: -8, bottom: 6 }}
            barCategoryGap="24%"
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#DCFCE7" />
            <XAxis
              dataKey="shortLabel"
              tickLine={false}
              axisLine={{ stroke: '#D1FAE5' }}
              tick={{ fontSize: 9.5, fill: '#065F46', fontWeight: 700 }}
              interval={0}
            />
            <YAxis
              domain={[0, Math.ceil(maxValue * 1.25)]}
              tickFormatter={axisCompact}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 9, fill: '#86EFAC', fontWeight: 700 }}
              width={42}
            />
            <Tooltip
              cursor={{ fill: 'rgba(16,185,129,0.08)' }}
              formatter={(value: any) => [
                compact(Number(value || 0)),
                'Expected PO',
              ]}
            />
            <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={28} minPointSize={6}>
              {safeData.map((entry) => (
                <Cell key={entry.label} fill={entry.color} />
              ))}
              <LabelList
                dataKey="value"
                position="top"
                formatter={(value: number) => compact(Number(value || 0))}
                fill="#14532D"
                fontSize={8.5}
                fontWeight={700}
              />
            </Bar>
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>

      <div className={styles.projectionModelFooter}>{periodLabel} | {scopeLabel}</div>
    </div>
  );
};

export default Header;
