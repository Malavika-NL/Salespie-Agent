// import React, { useEffect, useState } from 'react';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// import { useDispatch } from 'react-redux';
// import styles from './BarChart.module.css';
// import { fetchAdminOpportunityCategoryTotalData } from '../slice/opportunityCategoryTotal';

// const AdminBarChartComponent: React.FC = () => {
//     const dispatch = useDispatch();
//     const [barChartData, setBarChartData] = useState([]);

    
//     useEffect(() => {
//         const fetchData = async () => {
//             const result = await dispatch(fetchAdminOpportunityCategoryTotalData() as any);
//             const OpportunityCategoryTotalData = result.payload;

//             if (OpportunityCategoryTotalData) {
//                 const { labels, totals } = OpportunityCategoryTotalData;

//                 // Map labels and totals into the desired format
//                 const transformedData = labels.map((label: string, index: number) => ({
//                     name: label,
//                     Total: totals[index],
//                 }));

//                 setBarChartData(transformedData);
//             }
//         };

//         fetchData();
//     }, [dispatch]);

// const getRoundedMax = (data: { Total: number }[]) => {
//   if (!data || !Array.isArray(data) || data.length === 0) return 100;
//   const maxValue = Math.max(...data.map(d => d.Total || 0));
//   if (maxValue === 0) return 100;
//   const magnitude = Math.pow(10, Math.floor(Math.log10(maxValue)));
//   return Math.ceil(maxValue / magnitude) * magnitude;
// };


//     console.log('barChartData', barChartData)
// return (
//   <div className={styles.barChartContainer}>
//     <p className={styles.head}>Category Wise Opportunity</p>
//     <div className={styles.chartWrapper}>
//       <ResponsiveContainer width="100%" height={300}>
//         <BarChart
//           data={barChartData ?? []}           // ← always pass an array
//           layout="vertical"
//           className={styles.barchart}
//           margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
//         >
//           <CartesianGrid strokeDasharray="3 3" />

//           {/* Safe domain – never crashes even if data is empty */}
//           <XAxis
//             type="number"
//             orientation="top"
//             domain={[0, getRoundedMax(barChartData ?? [])]}
//             tickFormatter={(value) => `${(value / 1_000_000).toFixed(1)}M`}
//           />

//           <YAxis
//             dataKey="name"
//             type="category"
//             width={120}
//             tick={{ fontSize: 12 }}
//           />

//           <Tooltip
//             formatter={(value: any) => {
//               const num = Number(value);
//               return num >= 1_000_000
//                 ? `${(num / 1_000_000).toFixed(1)}M`
//                 : num.toLocaleString();
//             }}
//             labelStyle={{ color: '#333' }}
//           />

//           <Legend />

//           <Bar dataKey="Total" fill="#8884d8" barSize={20} />

//           {/* Optional: nice "No Data" message when empty */}
//           {(!barChartData || barChartData.length === 0) && (
//             <text
//               x="50%"
//               y="50%"
//               textAnchor="middle"
//               dominantBaseline="middle"
//               className="recharts-text recharts-label"
//               style={{ fontSize: '16px', fill: '#999' }}
//             >
//               No data available
//             </text>
//           )}
//         </BarChart>
//       </ResponsiveContainer>
//     </div>
//   </div>
// );
// };

// export default AdminBarChartComponent;

// import React, { useEffect, useState } from 'react';
// import {
//   BarChart, Bar, XAxis, YAxis, CartesianGrid,
//   Tooltip, Cell, LabelList, ResponsiveContainer
// } from 'recharts';
// import { useDispatch } from 'react-redux';
// import styles from './BarChart.module.css';
// import { fetchAdminOpportunityCategoryTotalData } from '../slice/opportunityCategoryTotal';

// interface BarItem { name: string; Total: number; }

// function getBarColor(val: number, total: number) {
//   const pct = total > 0 ? val / total : 0;
//   if (pct > 0.4)  return '#4F46E5';
//   if (pct > 0.05) return '#06B6D4';
//   if (pct > 0)    return '#A5B4FC';
//   return '#E2E8F0';
// }

// const CustomTooltip = ({ active, payload, label, totalPip }: any) => {
//   if (!active || !payload?.length) return null;
//   const val = payload[0].value;
//   const pct = totalPip > 0 ? Math.round((val / totalPip) * 100) : 0;
//   return (
//     <div style={{
//       background: '#fff', border: '1px solid #E2E8F0',
//       borderRadius: 10, padding: '10px 14px',
//       fontFamily: "'DM Sans', system-ui",
//       boxShadow: '0 2px 12px rgba(15,23,42,0.08)',
//     }}>
//       <p style={{ fontSize: 12, fontWeight: 600, color: '#0F172A', marginBottom: 5 }}>{label}</p>
//       <p style={{ fontSize: 12, color: '#4F46E5', marginBottom: val > 0 ? 2 : 0 }}>
//         Value: <strong>{fmt(val)}</strong>
//       </p>
//       {val > 0 && (
//         <p style={{ fontSize: 11, color: '#94A3B8' }}>Share: {pct}% of pipeline</p>
//       )}
//     </div>
//   );
// };

// const CustomYTick = ({ x, y, payload }: any) => (
//   <text x={x - 6} y={y} dy={4} textAnchor="end"
//     fontSize={11} fill="#475569" fontFamily="'DM Sans', system-ui">
//     {payload.value}
//   </text>
// );

// const CustomXTick = ({ x, y, payload }: any) => (
//   <text x={x} y={y + 12} textAnchor="middle"
//     fontSize={10} fill="#94A3B8" fontFamily="'DM Sans', system-ui">
//     {fmtAxis(payload.value)}
//   </text>
// );

// const AdminBarChartComponent: React.FC = () => {
//   const dispatch = useDispatch();
//   const [data, setData] = useState<BarItem[]>([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       const result = await dispatch(fetchAdminOpportunityCategoryTotalData() as any);
//       const payload = result.payload;
//       if (payload) {
//         const { labels, totals } = payload;
//         const items: BarItem[] = labels.map((label: string, i: number) => ({
//           name: label,
//           Total: totals[i] ?? 0,
//         }));
//         items.sort((a, b) => a.Total - b.Total);
//         setData(items);
//       }
//     };
//     fetchData();
//   }, [dispatch]);

//   if (!data.length) return null;

//   const totalPip = data.reduce((s, d) => s + d.Total, 0);
//   const active   = data.filter(d => d.Total > 0).length;
//   const top      = [...data].sort((a, b) => b.Total - a.Total)[0];
//   const maxVal   = Math.max(...data.map(d => d.Total));
//   const rounded  = Math.ceil(maxVal / 1_000_000) * 1_000_000 || 1_000_000;

//   return (
//     <div className={styles.barChartContainer}>

//       {/* 3 summary cards */}
//       <div className={styles.summaryGrid}>
//         <div className={styles.sCard}>
//           <div className={styles.sCardLabel}>Total pipeline</div>
//           <div className={styles.sCardVal}>{fmt(totalPip)}</div>
//           <div className={styles.sCardSub}>all categories</div>
//         </div>
//         <div className={styles.sCard}>
//           <div className={styles.sCardLabel}>Top category</div>
//           <div className={styles.sCardVal}>{top.name}</div>
//           <div className={styles.sCardSub}>
//             {totalPip > 0 ? `${Math.round(top.Total / totalPip * 100)}% of pipeline` : '—'}
//           </div>
//         </div>
//         <div className={styles.sCard}>
//           <div className={styles.sCardLabel}>Active categories</div>
//           <div className={styles.sCardVal}>{active} / {data.length}</div>
//           <div className={styles.sCardSub}>with pipeline</div>
//         </div>
//       </div>

//       {/* Bar chart */}
//       <div className={styles.chartWrapper}>
//         <ResponsiveContainer width="100%" height={280}>
//           <BarChart
//             data={data}
//             layout="vertical"
//             margin={{ top: 4, right: 72, left: 4, bottom: 4 }}
//             barCategoryGap="28%"
//           >
//             <CartesianGrid
//               strokeDasharray="3 3"
//               stroke="#F1F5F9"
//               horizontal={false}
//               vertical={true}
//             />
//             <XAxis
//               type="number"
//               orientation="top"
//               domain={[0, rounded]}
//               tickCount={5}
//               tick={<CustomXTick />}
//               axisLine={{ stroke: '#E2E8F0' }}
//               tickLine={false}
//             />
//             <YAxis
//               dataKey="name"
//               type="category"
//               width={95}
//               tick={<CustomYTick />}
//               axisLine={false}
//               tickLine={false}
//             />
//             <Tooltip
//               content={<CustomTooltip totalPip={totalPip} />}
//               cursor={{ fill: 'rgba(79,70,229,0.04)' }}
//             />
//             <Bar
//               dataKey="Total"
//               radius={[0, 4, 4, 0]}
//               maxBarSize={18}
//               isAnimationActive={true}
//               animationDuration={1100}
//               animationEasing="ease-out"
//             >
//               {data.map((d, i) => (
//                 <Cell key={i} fill={getBarColor(d.Total, totalPip)} />
//               ))}
//               <LabelList
//                 dataKey="Total"
//                 position="right"
//                 formatter={(v: number) => v > 0 ? fmt(v) : ''}
//                 style={{
//                   fontSize: 11,
//                   fontWeight: 600,
//                   fill: '#334155',
//                   fontFamily: "'DM Sans', system-ui",
//                 }}
//               />
//             </Bar>
//           </BarChart>
//         </ResponsiveContainer>
//       </div>

//     </div>
//   );
// };

// export default AdminBarChartComponent;


// // src/features/SalesAdminDashboard/Category Wise opportunity/BarChart.tsx
// import React, { useEffect, useState } from 'react';
// import {
//   BarChart, Bar, XAxis, YAxis, CartesianGrid,
//   Tooltip, Cell, LabelList, ResponsiveContainer
// } from 'recharts';
// import { useDispatch, useSelector } from 'react-redux';
// import type { RootState } from '../../../app/store';
// import styles from './BarChart.module.css';

// // ✅ Import from the CORRECT slice that is registered in store
// import { fetchAdminOpportunityCategoryTotalData } from './slice/opportunityAdminCategoryTotal';

// interface BarItem { name: string; Total: number; }

// const fmt = (v: number) => {
//   const n = Number(v || 0);
//   if (n <= 0) return '-';
//   return `₹${Math.round(n).toLocaleString('en-IN')}`;
// };

// const fmtAxis = (v: number) =>
//   `${Math.round(Number(v || 0)).toLocaleString('en-IN')}`;

// function getBarColor(val: number, total: number) {
//   const pct = total > 0 ? val / total : 0;
//   if (pct > 0.4)  return '#4F46E5';
//   if (pct > 0.05) return '#06B6D4';
//   if (pct > 0)    return '#A5B4FC';
//   return '#E2E8F0';
// }

// const CustomTooltip = ({ active, payload, label, totalPip }: any) => {
//   if (!active || !payload?.length) return null;
//   const val = payload[0].value;
//   const pct = totalPip > 0 ? Math.round((val / totalPip) * 100) : 0;
//   return (
//     <div style={{
//       background:   '#fff',
//       border:       '1px solid #E2E8F0',
//       borderRadius: 10,
//       padding:      '10px 14px',
//       fontFamily:   "'DM Sans', system-ui",
//       boxShadow:    '0 2px 12px rgba(15,23,42,0.08)',
//     }}>
//       <p style={{
//         fontSize: 12, fontWeight: 600,
//         color: '#0F172A', marginBottom: 5,
//       }}>
//         {label}
//       </p>
//       <p style={{
//         fontSize: 12, color: '#4F46E5',
//         marginBottom: val > 0 ? 2 : 0,
//       }}>
//         Value: <strong>{fmt(val)}</strong>
//       </p>
//       {val > 0 && (
//         <p style={{ fontSize: 11, color: '#94A3B8' }}>
//           Share: {pct}% of pipeline
//         </p>
//       )}
//     </div>
//   );
// };

// const CustomYTick = ({ x, y, payload }: any) => (
//   <text
//     x={x - 6} y={y} dy={4}
//     textAnchor="end"
//     fontSize={11}
//     fill="#475569"
//     fontFamily="'DM Sans', system-ui"
//   >
//     {payload.value}
//   </text>
// );

// const CustomXTick = ({ x, y, payload }: any) => (
//   <text
//     x={x} y={y + 12}
//     textAnchor="middle"
//     fontSize={10}
//     fill="#94A3B8"
//     fontFamily="'DM Sans', system-ui"
//   >
//     {fmtAxis(payload.value)}
//   </text>
// );

// const AdminBarChartComponent: React.FC = () => {
//   const dispatch = useDispatch<any>();
//   const [chartData, setChartData] = useState<BarItem[]>([]);

//   // ✅ Read globalFilter for re-fetching on filter change
//   const { selectedYear, selectedMonth, filterType, selectedPic } = useSelector(
//     (s: RootState) => s.globalFilter
//   );

//   // ✅ Read from CORRECT store key
//   const categoryData: any = useSelector(
//     (s: RootState) => s.fetchAdminCategoryTotalData.data
//   );

//   // ✅ Re-fetch when filter changes
//   useEffect(() => {
//     dispatch(fetchAdminOpportunityCategoryTotalData());
//   }, [dispatch, selectedYear, selectedMonth, selectedPic, filterType]);

//   // ✅ Format data when Redux store updates
//   useEffect(() => {
//     let items: BarItem[] = [];

//     if (Array.isArray(categoryData)) {
//       items = categoryData.map((item: any) => ({
//         name: String(
//           item?.name ??
//           item?.label ??
//           item?.category ??
//           item?.category_name ??
//           item?.category_label ??
//           ''
//         ).trim(),
//         Total: Number(
//           item?.Total ??
//           item?.total ??
//           item?.amount ??
//           item?.total_amount ??
//           item?.value ??
//           0
//         ),
//       }));
//     } else if (categoryData?.data && Array.isArray(categoryData.data)) {
//       items = categoryData.data.map((item: any) => ({
//         name: String(
//           item?.name ??
//           item?.label ??
//           item?.category ??
//           item?.category_name ??
//           item?.category_label ??
//           ''
//         ).trim(),
//         Total: Number(
//           item?.Total ??
//           item?.total ??
//           item?.amount ??
//           item?.total_amount ??
//           item?.value ??
//           0
//         ),
//       }));
//     } else if (Array.isArray(categoryData?.labels)) {
//       items = categoryData.labels.map((label: string, i: number) => ({
//         name: String(label || '').trim(),
//         Total: Number(categoryData?.totals?.[i] ?? 0),
//       }));
//     }

//     const cleanedItems = items
//       .filter((item) => item.name.length > 0)
//       .filter((item) => Number.isFinite(item.Total))
//       .sort((a, b) => a.Total - b.Total);

//     setChartData(cleanedItems);
//   }, [categoryData]);

//   if (!chartData.length) {
//     return (
//       <div style={{
//         textAlign: 'center',
//         padding:   40,
//         color:     '#94A3B8',
//         fontSize:  13,
//       }}>
//         No data available
//       </div>
//     );
//   }

//   const totalPip = chartData.reduce((s, d) => s + d.Total, 0);
//   const active   = chartData.filter(d => d.Total > 0).length;
//   const top      = [...chartData].sort((a, b) => b.Total - a.Total)[0];
//   const maxVal   = Math.max(...chartData.map(d => d.Total));
//   const rounded  = Math.ceil(maxVal / 1_000_000) * 1_000_000 || 1_000_000;

//   return (
//     <div className={styles.barChartContainer}>

//       {/* Summary cards */}
//       <div className={styles.summaryGrid}>
//         <div className={styles.sCard}>
//           <div className={styles.sCardLabel}>Total pipeline</div>
//           <div className={styles.sCardVal}>{fmt(totalPip)}</div>
//           <div className={styles.sCardSub}>all categories</div>
//         </div>
//         <div className={styles.sCard}>
//           <div className={styles.sCardLabel}>Top category</div>
//           <div className={styles.sCardVal}>{top?.name || '—'}</div>
//           <div className={styles.sCardSub}>
//             {totalPip > 0 && top
//               ? `${Math.round((top.Total / totalPip) * 100)}% of pipeline`
//               : '—'}
//           </div>
//         </div>
//         <div className={styles.sCard}>
//           <div className={styles.sCardLabel}>Active categories</div>
//           <div className={styles.sCardVal}>{active} / {chartData.length}</div>
//           <div className={styles.sCardSub}>with pipeline</div>
//         </div>
//       </div>

//       {/* Bar chart */}
//       <div className={styles.chartWrapper}>
//         <ResponsiveContainer width="100%" height={280}>
//           <BarChart
//             data={chartData}
//             layout="vertical"
//             margin={{ top: 4, right: 72, left: 4, bottom: 4 }}
//             barCategoryGap="28%"
//           >
//             <CartesianGrid
//               strokeDasharray="3 3"
//               stroke="#F1F5F9"
//               horizontal={false}
//               vertical={true}
//             />
//             <XAxis
//               type="number"
//               orientation="top"
//               domain={[0, rounded]}
//               tickCount={5}
//               tick={<CustomXTick />}
//               axisLine={{ stroke: '#E2E8F0' }}
//               tickLine={false}
//             />
//             <YAxis
//               dataKey="name"
//               type="category"
//               width={95}
//               tick={<CustomYTick />}
//               axisLine={false}
//               tickLine={false}
//             />
//             <Tooltip
//               content={<CustomTooltip totalPip={totalPip} />}
//               cursor={{ fill: 'rgba(79,70,229,0.04)' }}
//             />
//             <Bar
//               dataKey="Total"
//               radius={[0, 4, 4, 0]}
//               maxBarSize={18}
//               isAnimationActive={true}
//               animationDuration={1100}
//               animationEasing="ease-out"
//             >
//               {chartData.map((d, i) => (
//                 <Cell key={i} fill={getBarColor(d.Total, totalPip)} />
//               ))}
//               <LabelList
//                 dataKey="Total"
//                 position="right"
//                 formatter={(v: number) => v > 0 ? fmt(v) : ''}
//                 style={{
//                   fontSize:   11,
//                   fontWeight: 600,
//                   fill:       '#334155',
//                   fontFamily: "'DM Sans', system-ui",
//                 }}
//               />
//             </Bar>
//           </BarChart>
//         </ResponsiveContainer>
//       </div>

//     </div>
//   );
// };

// export default AdminBarChartComponent;



// src/features/SalesAdminDashboard/Category Wise opportunity/BarChart.tsx
import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Cell, LabelList, ResponsiveContainer
} from 'recharts';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../../app/store';
import styles from './BarChart.module.css';
import { fetchAdminOpportunityCategoryTotalData } from './slice/opportunityAdminCategoryTotal';
import type { HierarchicalItem } from './slice/opportunityAdminCategoryTotal';

/* ── Formatters ──────────────────────────────────────────────── */
const fmt = (v: number) => {
  const n = Number(v || 0);
  if (n <= 0) return '-';
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(1)}Cr`;
  if (n >= 100000)   return `₹${(n / 100000).toFixed(1)}L`;
  if (n >= 1000)     return `₹${(n / 1000).toFixed(1)}K`;
  return `₹${Math.round(n).toLocaleString('en-IN')}`;
};

const fmtAxis = (v: number) => {
  const n = Number(v || 0);
  if (n >= 10000000) return `${(n / 10000000).toFixed(1)}Cr`;
  if (n >= 100000)   return `${(n / 100000).toFixed(1)}L`;
  if (n >= 1000)     return `${(n / 1000).toFixed(1)}K`;
  return `${Math.round(n)}`;
};

/* ── Colors ──────────────────────────────────────────────────── */
const OPP_COLORS  = ['#4F46E5', '#6366F1', '#818CF8', '#A5B4FC', '#C7D2FE'];
const MAKE_COLORS = ['#059669', '#10B981', '#34D399', '#6EE7B7', '#A7F3D0'];

/* ── Flat row shape for recharts ─────────────────────────────── */
interface FlatRow {
  name:      string;
  Total:     number;
  isOpp:     boolean;       // true = opportunity row, false = make row
  oppIndex:  number;        // which opportunity this belongs to
  isMake:    boolean;
  oppName:   string;
}

/* ── Tooltip ─────────────────────────────────────────────────── */
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const row: FlatRow = payload[0]?.payload;
  const val = payload[0].value;

  return (
    <div style={{
      background: '#fff',
      border: '1px solid #E2E8F0',
      borderRadius: 10,
      padding: '10px 14px',
      fontFamily: "'DM Sans', system-ui",
      boxShadow: '0 2px 12px rgba(15,23,42,0.08)',
      minWidth: 180,
    }}>
      {row.isMake && (
        <p style={{ fontSize: 10, color: '#94A3B8', marginBottom: 2 }}>
          Under: <strong>{row.oppName}</strong>
        </p>
      )}
      <p style={{
        fontSize: 12, fontWeight: 700,
        color: row.isOpp ? '#4F46E5' : '#059669',
        marginBottom: 4,
      }}>
        {row.isOpp ? '📦 ' : '   └ 🏷 '}{label}
      </p>
      <p style={{ fontSize: 12, color: '#334155' }}>
        Value: <strong>{fmt(val)}</strong>
      </p>
      <p style={{ fontSize: 10, color: '#94A3B8', marginTop: 2 }}>
        {row.isOpp ? 'Opportunity Category' : 'Product Category 1 (Make)'}
      </p>
    </div>
  );
};

/* ── Custom Y-Axis Tick ──────────────────────────────────────── */
const CustomYTick = ({ x, y, payload, flatRows }: any) => {
  const row: FlatRow | undefined = flatRows?.find(
    (r: FlatRow) => r.name === payload.value
  );
  const isMake  = row?.isMake  ?? false;
  const isOpp   = row?.isOpp   ?? true;
  const label   = payload.value || '';

  // Truncate long labels
  const maxLen  = isMake ? 18 : 20;
  const display = label.length > maxLen ? `${label.slice(0, maxLen)}…` : label;

  return (
    <text
      x={x - 6}
      y={y}
      dy={4}
      textAnchor="end"
      fontSize={isMake ? 10 : 11}
      fontWeight={isOpp ? 700 : 400}
      fill={isOpp ? '#1E293B' : '#64748B'}
      fontFamily="'DM Sans', system-ui"
    >
      {isMake ? `  └ ${display}` : display}
    </text>
  );
};

/* ── Custom X-Axis Tick ──────────────────────────────────────── */
const CustomXTick = ({ x, y, payload }: any) => (
  <text
    x={x} y={y + 12}
    textAnchor="middle"
    fontSize={10}
    fill="#94A3B8"
    fontFamily="'DM Sans', system-ui"
  >
    {fmtAxis(payload.value)}
  </text>
);

/* ── Custom Bar Shape — different radius for opp vs make ─────── */
const CustomBar = (props: any) => {
  const { x, y, width, height, fill, payload } = props;
  const radius = payload?.isOpp ? 4 : 2;
  return (
    <rect
      x={x}
      y={y}
      width={Math.max(width, 0)}
      height={Math.max(height, 0)}
      fill={fill}
      rx={radius}
      ry={radius}
    />
  );
};

/* ── Main Component ──────────────────────────────────────────── */
const AdminBarChartComponent: React.FC = () => {
  const dispatch = useDispatch<any>();
  const [flatRows, setFlatRows] = useState<FlatRow[]>([]);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const { selectedYear, selectedMonth, filterType, selectedPic } = useSelector(
    (s: RootState) => s.globalFilter
  );

  const categoryData: any = useSelector(
    (s: RootState) => s.fetchAdminCategoryTotalData.data
  );

  /* ── Re-fetch on filter change ───────────────────────────── */
  useEffect(() => {
    dispatch(fetchAdminOpportunityCategoryTotalData());
  }, [dispatch, selectedYear, selectedMonth, selectedPic, filterType]);

  /* ── Parse API → flat rows ───────────────────────────────── */
  useEffect(() => {
    const hierarchical: HierarchicalItem[] = Array.isArray(categoryData?.hierarchical)
      ? categoryData.hierarchical
      : [];

    if (!hierarchical.length) {
      setFlatRows([]);
      return;
    }

    const rows: FlatRow[] = [];

    hierarchical.forEach((opp, oppIdx) => {
      // Opportunity row
      rows.push({
        name:     opp.opportunity,
        Total:    opp.total_amount,
        isOpp:    true,
        isMake:   false,
        oppIndex: oppIdx,
        oppName:  opp.opportunity,
      });

      // Make rows — only if this opp is expanded
      if (expanded.has(opp.opportunity)) {
        opp.makes.forEach((m) => {
          rows.push({
            name:     m.make,
            Total:    m.total_amount,
            isOpp:    false,
            isMake:   true,
            oppIndex: oppIdx,
            oppName:  opp.opportunity,
          });
        });
      }
    });

    setFlatRows(rows);
  }, [categoryData, expanded]);

  /* ── Toggle expand/collapse ──────────────────────────────── */
  const toggleExpand = (oppName: string) => {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(oppName)) {
        next.delete(oppName);
      } else {
        next.add(oppName);
      }
      return next;
    });
  };

  /* ── Expand / Collapse All ───────────────────────────────── */
  const allOppNames: string[] = Array.isArray(categoryData?.hierarchical)
    ? categoryData.hierarchical.map((o: HierarchicalItem) => o.opportunity)
    : [];

  const allExpanded = allOppNames.length > 0 && allOppNames.every(n => expanded.has(n));

  const toggleAll = () => {
    if (allExpanded) {
      setExpanded(new Set());
    } else {
      setExpanded(new Set(allOppNames));
    }
  };

  /* ── Derived summary values ──────────────────────────────── */
  const hierarchical: HierarchicalItem[] = Array.isArray(categoryData?.hierarchical)
    ? categoryData.hierarchical
    : [];

  const totalPip    = hierarchical.reduce((s, o) => s + o.total_amount, 0);
  const activeCount = hierarchical.filter(o => o.total_amount > 0).length;
  const top         = [...hierarchical].sort((a, b) => b.total_amount - a.total_amount)[0];
  const maxVal      = Math.max(...flatRows.map(r => r.Total), 0);
  const rounded     = Math.ceil(maxVal / 1_000_000) * 1_000_000 || 1_000_000;

  // Dynamic chart height based on visible rows
  const chartHeight = Math.max(220, flatRows.length * 34 + 40);

  /* ── Empty state ─────────────────────────────────────────── */
  if (!flatRows.length && !hierarchical.length) {
    return (
      <div style={{ textAlign: 'center', padding: 40, color: '#94A3B8', fontSize: 13 }}>
        No data available
      </div>
    );
  }

  return (
    <div className={styles.barChartContainer}>

      {/* ── Controls ────────────────────────────────────────── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
        gap: 8,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{
            fontSize: 11,
            fontWeight: 600,
            color: '#64748B',
            fontFamily: "'DM Sans', system-ui",
          }}>
            Click opportunity row to expand makes
          </span>
        </div>

        <button
          onClick={toggleAll}
          style={{
            padding: '4px 12px',
            borderRadius: 6,
            border: '1px solid #E2E8F0',
            background: allExpanded ? '#4F46E5' : '#F8FAFC',
            color: allExpanded ? '#fff' : '#475569',
            fontSize: 11,
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: "'DM Sans', system-ui",
            transition: 'all 0.15s ease',
          }}
        >
          {allExpanded ? '▲ Collapse All' : '▼ Expand All'}
        </button>
      </div>

      {/* ── Legend ──────────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: 14, marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <div style={{
            width: 10, height: 10, borderRadius: 2,
            background: '#4F46E5',
          }} />
          <span style={{ fontSize: 11, color: '#64748B', fontFamily: "'DM Sans', system-ui" }}>
            Opportunity Category
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <div style={{
            width: 10, height: 10, borderRadius: 2,
            background: '#059669',
          }} />
          <span style={{ fontSize: 11, color: '#64748B', fontFamily: "'DM Sans', system-ui" }}>
            Product Category 1 (Make)
          </span>
        </div>
      </div>

      {/* ── Summary Cards ───────────────────────────────────── */}
      <div className={styles.summaryGrid}>
        <div className={styles.sCard}>
          <div className={styles.sCardLabel}>Total Pipeline</div>
          <div className={styles.sCardVal}>{fmt(totalPip)}</div>
          <div className={styles.sCardSub}>all categories</div>
        </div>
        <div className={styles.sCard}>
          <div className={styles.sCardLabel}>Top Category</div>
          <div className={styles.sCardVal}>{top?.opportunity || '—'}</div>
          <div className={styles.sCardSub}>
            {totalPip > 0 && top
              ? `${Math.round((top.total_amount / totalPip) * 100)}% of pipeline`
              : '—'}
          </div>
        </div>
        <div className={styles.sCard}>
          <div className={styles.sCardLabel}>Active Categories</div>
          <div className={styles.sCardVal}>{activeCount} / {hierarchical.length}</div>
          <div className={styles.sCardSub}>with pipeline</div>
        </div>
      </div>

      {/* ── Clickable Opportunity Labels (outside recharts) ─── */}
      <div style={{
        overflowY: 'auto',
        maxHeight: 520,
      }}>
        {/* Recharts bar chart */}
        <div style={{ width: '100%', height: chartHeight }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={flatRows}
              layout="vertical"
              margin={{ top: 4, right: 80, left: 4, bottom: 4 }}
              barCategoryGap="20%"
              onClick={(chartData: any) => {
  if (!chartData?.activePayload?.length) return;
  const row: FlatRow = chartData.activePayload[0]?.payload;
  if (row?.isOpp) {
    toggleExpand(row.name);
  }
}}
              style={{ cursor: 'pointer' }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#F1F5F9"
                horizontal={false}
                vertical={true}
              />
              <XAxis
                type="number"
                orientation="top"
                domain={[0, rounded]}
                tickCount={5}
                tick={<CustomXTick />}
                axisLine={{ stroke: '#E2E8F0' }}
                tickLine={false}
              />
              <YAxis
                dataKey="name"
                type="category"
                width={130}
                tick={<CustomYTick flatRows={flatRows} />}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: 'rgba(79,70,229,0.04)' }}
              />
              <Bar
                dataKey="Total"
                maxBarSize={20}
                isAnimationActive={true}
                animationDuration={600}
                animationEasing="ease-out"
                shape={<CustomBar />}
              >
                {flatRows.map((row, i) => (
                  <Cell
                    key={i}
                    fill={
                      row.isOpp
                        ? OPP_COLORS[row.oppIndex % OPP_COLORS.length]
                        : MAKE_COLORS[row.oppIndex % MAKE_COLORS.length]
                    }
                    opacity={row.isMake ? 0.85 : 1}
                  />
                ))}
                <LabelList
                  dataKey="Total"
                  position="right"
                  formatter={(v: number) => v > 0 ? fmt(v) : ''}
                  style={{
                    fontSize: 10.5,
                    fontWeight: 600,
                    fill: '#334155',
                    fontFamily: "'DM Sans', system-ui",
                  }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Expand hint ─────────────────────────────────────── */}
      <div style={{
        marginTop: 8,
        fontSize: 10.5,
        color: '#94A3B8',
        textAlign: 'center',
        fontFamily: "'DM Sans', system-ui",
      }}>
        {expanded.size > 0
          ? `${expanded.size} categor${expanded.size > 1 ? 'ies' : 'y'} expanded`
          : 'Click any bar or label to expand makes'}
      </div>

    </div>
  );
};

export default AdminBarChartComponent;