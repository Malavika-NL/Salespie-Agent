import React, { useEffect, useMemo } from 'react';
import styles from './FunnelGraph.module.css';
import { Tooltip, FunnelChart, Funnel, LabelList, Trapezoid, ResponsiveContainer } from 'recharts';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFunnelGraphData } from './slice/funnelgraph';
import type { RootState } from '../../../app/store';

interface FunnelData {
  value: number;
  shapeValue: number;
  name: string;
  rankLabel: string;
  fill: string;
  total_stage_amount: number;
  valueLabel: string;
  stage_count: number;
}

interface ApiStageSummaryRow {
  ranks?: string;
  total_stage_amount?: number | string;
  stage_count?: number | string;
}

const RANK_ORDER = ['Rank E', 'Rank D', 'Rank C', 'Rank B', 'Rank A'] as const;
const FUNNEL_COLORS = ['#DBEAFE', '#BFDBFE', '#93C5FD', '#60A5FA', '#60A5FA'] as const;
const FIXED_SHAPE_VALUES = [100, 80, 60, 40, 20] as const;

const formatInr = (amount: number) =>
  `\u20B9${amount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;

const formatInMillions = (amount: number) => `${(amount / 1_000_000).toFixed(1)}M`;

const normalizeRank = (rawRank?: string): (typeof RANK_ORDER)[number] | null => {
  const input = String(rawRank || '').trim().toUpperCase();
  if (!input) return null;
  const match = input.match(/RANK\s*([A-E])/);
  if (!match) return null;
  return (`Rank ${match[1]}` as (typeof RANK_ORDER)[number]);
};

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: any[] }) => {
  if (!active || !payload?.length) return null;
  const row = payload[0].payload as FunnelData;

  return (
    <div className={styles.tooltipContainer}>
      <p className={styles.tooltipTitle}>{row.name}</p>
      <p className={styles.tooltipValue}>{formatInr(row.total_stage_amount)}</p>
      <p className={styles.tooltipMeta}>
        {row.stage_count} stage{row.stage_count !== 1 ? 's' : ''}
      </p>
    </div>
  );
};

const CustomFunnelChart: React.FC = () => {
  const dispatch = useDispatch<any>();
  const { selectedYear, selectedMonth, filterType } = useSelector((s: RootState) => s.globalFilter);
  const { usergraphdata, loading, error } = useSelector((state: RootState) => state.fetchUserFunnelGraphData);

  useEffect(() => {
    dispatch(fetchFunnelGraphData());
  }, [dispatch, selectedYear, selectedMonth, filterType]);

  const funnelData = useMemo<FunnelData[]>(() => {
    const rows = Array.isArray(usergraphdata) ? (usergraphdata as ApiStageSummaryRow[]) : [];
    const rankMap = new Map<(typeof RANK_ORDER)[number], { amount: number; count: number }>();

    rows.forEach((row) => {
      const rank = normalizeRank(row.ranks);
      if (!rank) return;

      const amount = Number(row.total_stage_amount ?? 0);
      const count = Number(row.stage_count ?? 0);
      const prev = rankMap.get(rank) || { amount: 0, count: 0 };

      rankMap.set(rank, {
        amount: prev.amount + (Number.isFinite(amount) ? amount : 0),
        count: prev.count + (Number.isFinite(count) ? count : 0),
      });
    });

    return RANK_ORDER.map((rank, index) => {
        const stage = rankMap.get(rank);
        const amount = stage?.amount ?? 0;
        const stageCount = stage?.count ?? 0;
        return {
          value: amount,
          shapeValue: FIXED_SHAPE_VALUES[index],
          name: rank,
          rankLabel: rank.replace(' ', '\u00A0'),
          fill: FUNNEL_COLORS[index],
          total_stage_amount: amount,
          valueLabel: formatInMillions(amount),
          stage_count: stageCount,
        };
      });
  }, [usergraphdata]);

  const renderCustomShape = (props: any) => {
    const { fill, x, y, upperWidth, lowerWidth, height } = props;

    return (
      <Trapezoid
        fill={fill}
        stroke="rgba(255,255,255,0.75)"
        strokeWidth={1.2}
        x={x}
        y={y}
        upperWidth={upperWidth}
        lowerWidth={lowerWidth}
        height={height}
      />
    );
  };

  if (loading) {
    return (
      <div className={styles.Container}>
        <div className={styles.chartWrapper} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p style={{ color: '#94A3B8', fontSize: 13 }}>Loading funnel data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.Container}>
        <div className={styles.chartWrapper} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p style={{ color: '#F43F5E', fontSize: 13 }}>Failed to load funnel data.</p>
        </div>
      </div>
    );
  }

  if (funnelData.length === 0) {
    return (
      <div className={styles.Container}>
        <div className={styles.chartWrapper} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p style={{ color: '#94A3B8', fontSize: 13 }}>No stage data available for this filter.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.Container}>
      <div className={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height={300}>
          <FunnelChart margin={{ top: 8, right: 70, bottom: 8, left: 8 }}>
            <Tooltip content={<CustomTooltip />} />
            <Funnel dataKey="shapeValue" data={funnelData} isAnimationActive shape={renderCustomShape} lastShapeType="triangle">
              <LabelList
                position="center"
                fill="#0B2A5A"
                stroke="none"
                dataKey="valueLabel"
                className={styles.label}
              />
              <LabelList
                position="right"
                offset={14}
                fill="#0f172a"
                stroke="none"
                dataKey="rankLabel"
                className={styles.rankLabel}
              />
            </Funnel>
          </FunnelChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CustomFunnelChart;
