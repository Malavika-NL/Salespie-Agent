import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
} from 'recharts';
import type { RootState } from '../../../app/store';
import styles from './AdminMonthWiseBudget.module.css';
import { fetchAdminMonthWiseBudgetData } from './Slice/AdminMonthWiseBudgetSlice';

const FY_MONTH_ORDER = [
  'April', 'May', 'June', 'July', 'August', 'September',
  'October', 'November', 'December', 'January', 'February', 'March',
];

const FY_QUARTERS = [
  { label: 'Apr-Jun', months: ['April', 'May', 'June'] },
  { label: 'Jul-Sep', months: ['July', 'August', 'September'] },
  { label: 'Oct-Dec', months: ['October', 'November', 'December'] },
  { label: 'Jan-Mar', months: ['January', 'February', 'March'] },
];

const HALF_YEAR_BUCKETS = [
  { label: 'Apr-Sep', months: ['April', 'May', 'June', 'July', 'August', 'September'] },
  { label: 'Oct-Mar', months: ['October', 'November', 'December', 'January', 'February', 'March'] },
];

const formatCompactValue = (value: number): string => {
  const numeric = Number(value || 0);
  const abs = Math.abs(numeric);

  if (abs >= 1_00_00_000) return `${(numeric / 1_00_00_000).toFixed(1)}Cr`;
  if (abs >= 1_00_000) return `${(numeric / 1_00_000).toFixed(1)}L`;
  if (abs >= 1_000) return `${(numeric / 1_000).toFixed(1)}K`;
  return `${Math.round(numeric).toLocaleString('en-IN')}`;
};

const formatExactInr = (value: number): string => {
  const numeric = Number(value || 0);
  return `₹${Math.round(numeric).toLocaleString('en-IN')}`;
};

const formatActualBarLabel = (value: number) => {
  const numeric = Number(value || 0);
  if (!numeric || numeric <= 0) return '';
  return formatExactInr(numeric);
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const fullLabel = payload?.[0]?.payload?.month_name || label;

  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid #E2E8F0',
        borderRadius: 10,
        padding: '10px 14px',
        boxShadow: '0 4px 16px rgba(15,23,42,0.10)',
        fontFamily: "'DM Sans', system-ui, sans-serif",
      }}
    >
      <p
        style={{
          fontSize: 12,
          fontWeight: 600,
          color: '#0F172A',
          marginBottom: 6,
        }}
      >
        {fullLabel}
      </p>
      {payload.map((p: any, i: number) => (
        <p
          key={i}
          style={{
            fontSize: 12,
            color: p?.dataKey === 'total_amount' ? '#1E3A8A' : p.color,
            margin: '2px 0',
          }}
        >
          {p.name}: <strong>{formatExactInr(Number(p.value || 0))}</strong>
        </p>
      ))}
    </div>
  );
};

type ChartPeriod = 'yearly' | 'half-yearly' | 'quarterly' | 'monthly';

const AdminMonthWiseBudget: React.FC = () => {
  const dispatch = useDispatch<any>();
  const { selectedYear, selectedMonth, filterType, selectedPic } = useSelector(
    (s: RootState) => s.globalFilter
  );
  const budgetData = useSelector(
    (state: RootState) => state.fetchAdminMonthWiseBudget.budgetdata
  );

  useEffect(() => {
    dispatch(fetchAdminMonthWiseBudgetData());
  }, [dispatch, selectedYear, selectedMonth, selectedPic, filterType]);

  const formattedBudgetData = useMemo(() => {
    const safeBudgetData = Array.isArray(budgetData) ? budgetData : [];
    const monthOrderMap = new Map(FY_MONTH_ORDER.map((month, index) => [month, index]));

    return safeBudgetData
      .map((entry: any) => ({
        month_number: entry.month_number,
        month_name: entry.month_name,
        name: String(entry.month_name || '').slice(0, 3),
        Expected: entry.Expected || 0,
        total_amount: entry.total_amount || 0,
      }))
      .sort((a: any, b: any) => {
        const aIndex = monthOrderMap.get(a.month_name) ?? 99;
        const bIndex = monthOrderMap.get(b.month_name) ?? 99;
        return aIndex - bIndex;
      });
  }, [budgetData]);

  const [selectedPeriod, setSelectedPeriod] = useState<ChartPeriod>('yearly');
  const [filteredData, setFilteredData] = useState<any[]>([]);

  useEffect(() => {
    if (!formattedBudgetData.length) {
      setFilteredData([]);
      return;
    }

    if (filterType === 'monthly') {
      const entry = formattedBudgetData.find((e: any) => e.month_name === selectedMonth);
      setFilteredData(entry ? [{ ...entry, name: entry.month_name }] : []);
      return;
    }

    if (selectedPeriod === 'yearly') {
      const yearlyData = FY_QUARTERS.map((q) => {
        let totalExpected = 0;
        let totalAchieved = 0;

        q.months.forEach((monthName) => {
          const entry = formattedBudgetData.find((e: any) => e.month_name === monthName);
          if (!entry) return;
          totalExpected += Number(entry.Expected || 0);
          totalAchieved += Number(entry.total_amount || 0);
        });

        return {
          name: q.label,
          Expected: totalExpected,
          total_amount: totalAchieved,
        };
      });
      setFilteredData(yearlyData);
      return;
    }

    if (selectedPeriod === 'half-yearly') {
      const halfYearData = HALF_YEAR_BUCKETS.map((h) => {
        let totalExpected = 0;
        let totalAchieved = 0;

        h.months.forEach((monthName) => {
          const entry = formattedBudgetData.find((e: any) => e.month_name === monthName);
          if (!entry) return;
          totalExpected += Number(entry.Expected || 0);
          totalAchieved += Number(entry.total_amount || 0);
        });

        return {
          name: h.label,
          Expected: totalExpected,
          total_amount: totalAchieved,
        };
      });
      setFilteredData(halfYearData);
      return;
    }

    if (selectedPeriod === 'quarterly') {
      const selectedMonthIdx = FY_MONTH_ORDER.findIndex((m) => m === selectedMonth);
      const fallbackIdx = (() => {
        const monthNumber = new Date().getMonth() + 1;
        return monthNumber >= 4 ? monthNumber - 4 : monthNumber + 8;
      })();
      const fyIdx = selectedMonthIdx >= 0 ? selectedMonthIdx : fallbackIdx;
      const qIdx = Math.min(3, Math.max(0, Math.floor(fyIdx / 3)));

      const quarter = FY_QUARTERS[qIdx];
      const quarterData = quarter.months.map((monthName) => {
        const entry = formattedBudgetData.find((e: any) => e.month_name === monthName);
        return {
          name: String(monthName || '').slice(0, 3),
          month_name: monthName,
          Expected: entry?.Expected || 0,
          total_amount: entry?.total_amount || 0,
        };
      });

      setFilteredData(quarterData);
      return;
    }

    setFilteredData(formattedBudgetData);
  }, [formattedBudgetData, selectedPeriod, filterType, selectedMonth]);

  return (
    <div className={styles.Container}>
      <div className={styles.Wrapper}>
        {filterType !== 'monthly' && (
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value as ChartPeriod)}
            className={styles.select}
          >
            <option value="yearly">Yearly</option>
            <option value="half-yearly">Half Yearly</option>
            <option value="quarterly">Quarterly</option>
            <option value="monthly">Monthly</option>
          </select>
        )}

        {filteredData.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: 40,
              color: '#94A3B8',
              fontSize: 13,
            }}
          >
            No data available for selected period
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart
              data={filteredData}
              layout="horizontal"
              margin={{ top: 4, right: 16, left: 4, bottom: 4 }}
              barCategoryGap="28%"
              barGap={4}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis
                dataKey="name"
                type="category"
                tick={{
                  fontSize: 12,
                  fill: '#64748B',
                  fontFamily: "'DM Sans', system-ui",
                }}
                axisLine={{ stroke: '#E2E8F0' }}
                tickLine={false}
              />
              <YAxis
                type="number"
                tick={{
                  fontSize: 11,
                  fill: '#94A3B8',
                  fontFamily: "'DM Sans', system-ui",
                }}
                tickFormatter={(v) => formatCompactValue(Number(v || 0))}
                axisLine={false}
                tickLine={false}
                width={58}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(79,70,229,0.04)' }} />
              <Legend
                wrapperStyle={{
                  fontSize: 12,
                  fontFamily: "'DM Sans', system-ui",
                  paddingTop: 8,
                }}
                iconType="circle"
                iconSize={8}
                formatter={(value: string) => (
                  <span
                    style={{
                      color: value === 'Actual Sales' ? '#1E3A8A' : '#94A3B8',
                      fontWeight: value === 'Actual Sales' ? 700 : 600,
                    }}
                  >
                    {value}
                  </span>
                )}
              />
              <Bar dataKey="Expected" name="Expected" fill="#C7D2FE" radius={[4, 4, 0, 0]} />
              <Bar
                dataKey="total_amount"
                name="Actual Sales"
                fill="#1E3A8A"
                radius={[4, 4, 0, 0]}
                minPointSize={3}
              >
                <LabelList
                  dataKey="total_amount"
                  position="top"
                  formatter={(v: number) => formatActualBarLabel(v)}
                  fill="#1E3A8A"
                  fontSize={10}
                  fontWeight={700}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default AdminMonthWiseBudget;
