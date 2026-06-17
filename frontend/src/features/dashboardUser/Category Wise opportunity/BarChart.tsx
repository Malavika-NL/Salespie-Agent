// import React, { useEffect, useState } from 'react';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// import { fetchOpportunityCategoryTotalData } from './slice/opportunityCategoryTotal';
// import { useDispatch } from 'react-redux';
// import styles from './BarChart.module.css';

// const BarChartComponent: React.FC = () => {
//     const dispatch = useDispatch();
//     const [barChartData, setBarChartData] = useState([]);

    
//     useEffect(() => {
//         const fetchData = async () => {
//             const result = await dispatch(fetchOpportunityCategoryTotalData() as any);
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

//     const getRoundedMax = (data: { Total: number }[]) => {
//         if (!data.length) return 100; // Default value

//         const maxValue = Math.max(...data.map(d => d.Total));
//         const magnitude = Math.pow(10, Math.floor(Math.log10(maxValue)));
//         return Math.ceil(maxValue / magnitude) * magnitude;
//     };


//     // console.log('barChartData', barChartData)
//     return (
//         <div className={styles.barChartContainer}>
//             <p className={styles.head}>Category Wise Opportunity</p>
//             <div className={styles.chartWrapper}>
//                 <ResponsiveContainer width="100%" height={300}>
//                     <BarChart
//                         data={barChartData}
//                         layout="vertical"
//                         className={styles.barchart}
//                     >
//                         <CartesianGrid strokeDasharray="1" />
//                         <XAxis
//                             type="number"
//                             orientation="top"
//                             domain={[0, getRoundedMax(barChartData)]}
//                             tickFormatter={(value) => `${(value / 1_000_000).toFixed(1)}M`}
//                         />
//                         <YAxis dataKey="name" type="category" width={100} />
//                          <Tooltip formatter={(value: any) => `${Number(value).toFixed(1)}`} />
//                         <Legend />
//                         <Bar dataKey="Total" fill="#8884d8" />
//                     </BarChart>
//                 </ResponsiveContainer>
//             </div>
//         </div>
//     );
// };

// export default BarChartComponent;

// import React, { useEffect, useState } from 'react';
// import {
//   BarChart, Bar, XAxis, YAxis, CartesianGrid,
//   Tooltip, Legend, ResponsiveContainer
// } from 'recharts';
// import { fetchOpportunityCategoryTotalData } from './slice/opportunityCategoryTotal';
// import { useDispatch } from 'react-redux';
// import styles from './BarChart.module.css';

// /* ── Custom Tooltip ── */
// const CustomTooltip = ({ active, payload, label }: any) => {
//   if (!active || !payload?.length) return null;
//   return (
//     <div style={{
//       background: '#fff',
//       border: '1px solid #E2E8F0',
//       borderRadius: 10,
//       padding: '10px 14px',
//       boxShadow: '0 4px 16px rgba(15,23,42,0.10)',
//       fontFamily: "'DM Sans', system-ui, sans-serif",
//     }}>
//       <p style={{ fontSize: 12, fontWeight: 600, color: '#0F172A', marginBottom: 4 }}>{label}</p>
//       <p style={{ fontSize: 12, color: '#4F46E5' }}>
//         Total: <strong>₹{(Number(payload[0].value) / 1_000_000).toFixed(2)}M</strong>
//       </p>
//     </div>
//   );
// };

// const BarChartComponent: React.FC = () => {
//   const dispatch = useDispatch();
//   const [barChartData, setBarChartData] = useState([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       const result = await dispatch(fetchOpportunityCategoryTotalData() as any);
//       const data = result.payload;
//       if (data) {
//         const { labels, totals } = data;
//         setBarChartData(
//           labels.map((label: string, index: number) => ({
//             name: label,
//             Total: totals[index],
//           }))
//         );
//       }
//     };
//     fetchData();
//   }, [dispatch]);

//   const getRoundedMax = (data: { Total: number }[]) => {
//     if (!data.length) return 100;
//     const maxValue = Math.max(...data.map(d => d.Total));
//     const magnitude = Math.pow(10, Math.floor(Math.log10(maxValue)));
//     return Math.ceil(maxValue / magnitude) * magnitude;
//   };

//   return (
//     <div className={styles.barChartContainer}>
//       <div className={styles.chartWrapper}>
//         <ResponsiveContainer width="100%" height={280}>
//           <BarChart
//             data={barChartData}
//             layout="vertical"
//             margin={{ top: 0, right: 20, left: 8, bottom: 0 }}
//             barCategoryGap="30%"
//           >
//             <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />
//             <XAxis
//               type="number"
//               orientation="top"
//               domain={[0, getRoundedMax(barChartData)]}
//               tickFormatter={(v) => `${(v / 1_000_000).toFixed(0)}M`}
//               tick={{ fontSize: 11, fill: '#94A3B8', fontFamily: "'DM Sans', system-ui" }}
//               axisLine={false}
//               tickLine={false}
//             />
//             <YAxis
//               dataKey="name"
//               type="category"
//               width={110}
//               tick={{ fontSize: 12, fill: '#1E293B', fontFamily: "'DM Sans', system-ui" }}
//               axisLine={false}
//               tickLine={false}
//             />
//             <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(79,70,229,0.04)' }} />
//             <Bar dataKey="Total" name="Total Opportunity" fill="#06B6D4" radius={[0, 4, 4, 0]} />
//           </BarChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// };

// export default BarChartComponent;

// import React, { useEffect, useState } from 'react';
// import {
//   BarChart, Bar, XAxis, YAxis, CartesianGrid,
//   Tooltip, Legend, ResponsiveContainer
// } from 'recharts';
// import { fetchOpportunityCategoryTotalData } from './slice/opportunityCategoryTotal';
// import { useDispatch } from 'react-redux';
// import styles from './BarChart.module.css';

// /* ── Custom Tooltip ── */
// const CustomTooltip = ({ active, payload, label }: any) => {
//   if (!active || !payload?.length) return null;
//   return (
//     <div style={{
//       background: '#fff',
//       border: '1px solid #E2E8F0',
//       borderRadius: 10,
//       padding: '10px 14px',
//       boxShadow: '0 4px 16px rgba(15,23,42,0.10)',
//       fontFamily: "'DM Sans', system-ui, sans-serif",
//     }}>
//       <p style={{ fontSize: 12, fontWeight: 600, color: '#0F172A', marginBottom: 4 }}>{label}</p>
//       <p style={{ fontSize: 12, color: '#4F46E5' }}>
//         Total: <strong>₹{(Number(payload[0].value) / 1_000_000).toFixed(2)}M</strong>
//       </p>
//     </div>
//   );
// };

// const BarChartComponent: React.FC = () => {
//   const dispatch = useDispatch();
//   const [barChartData, setBarChartData] = useState([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       const result = await dispatch(fetchOpportunityCategoryTotalData() as any);
//       const data = result.payload;
//       if (data) {
//         const { labels, totals } = data;
//         setBarChartData(
//           labels.map((label: string, index: number) => ({
//             name: label,
//             Total: totals[index],
//           }))
//         );
//       }
//     };
//     fetchData();
//   }, [dispatch]);

//   const getRoundedMax = (data: { Total: number }[]) => {
//     if (!data.length) return 100;
//     const maxValue = Math.max(...data.map(d => d.Total));
//     const magnitude = Math.pow(10, Math.floor(Math.log10(maxValue)));
//     return Math.ceil(maxValue / magnitude) * magnitude;
//   };

//   return (
//     <div className={styles.barChartContainer}>
//       <div className={styles.chartWrapper}>
//         <ResponsiveContainer width="100%" height={280}>
//           <BarChart
//             data={barChartData}
//             layout="vertical"
//             margin={{ top: 0, right: 20, left: 8, bottom: 0 }}
//             barCategoryGap="30%"
//           >
//             <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />
//             <XAxis
//               type="number"
//               orientation="top"
//               domain={[0, getRoundedMax(barChartData)]}
//               tickFormatter={(v) => `${(v / 1_000_000).toFixed(0)}M`}
//               tick={{ fontSize: 11, fill: '#94A3B8', fontFamily: "'DM Sans', system-ui" }}
//               axisLine={false}
//               tickLine={false}
//             />
//             <YAxis
//               dataKey="name"
//               type="category"
//               width={120}
//               tick={{ fontSize: 12, fill: '#1E293B', fontFamily: "'DM Sans', system-ui" }}
//               axisLine={false}
//               tickLine={false}
//               tickMargin={8}
//             />
//             <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(79,70,229,0.04)' }} />
//             <Bar
//               dataKey="Total"
//               name="Total Opportunity"
//               fill="#06B6D4"
//               radius={[0, 4, 4, 0]}
//               maxBarSize={18}
//               activeBar={{ fill: '#0891B2', opacity: 0.9 }}
//             />
//           </BarChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// };

// export default BarChartComponent;

// import React, { useEffect, useState } from 'react';
// import {
//   BarChart, Bar, XAxis, YAxis, CartesianGrid,
//   Tooltip, Cell, LabelList, ResponsiveContainer
// } from 'recharts';
// import { useDispatch } from 'react-redux';
// import styles from './BarChart.module.css';
// import { fetchOpportunityCategoryTotalData } from './slice/opportunityCategoryTotal';

// interface BarItem { name: string; Total: number; }

// const fmt  = (v: number) =>
//   v >= 1_000_000 ? `₹${(v / 1_000_000).toFixed(2)}M`
//   : v >= 1_000   ? `₹${(v / 1_000).toFixed(0)}K`
//   : v > 0 ? `₹${v}` : '—';

// const fmtAxis = (v: number) =>
//   v >= 1_000_000 ? `${(v / 1_000_000).toFixed(0)}M`
//   : v >= 1_000   ? `${(v / 1_000).toFixed(0)}K` : `${v}`;

// function getBarColor(val: number, total: number) {
//   const pct = total > 0 ? val / total : 0;
//   if (pct > 0.4)  return '#4F46E5'; // dominant — indigo
//   if (pct > 0.05) return '#06B6D4'; // mid — cyan
//   if (pct > 0)    return '#A5B4FC'; // low — soft indigo
//   return '#E2E8F0';                  // zero — gray
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
// // const fetchData = async () => {
// //   const result = await dispatch(fetchOpportunityCategoryTotalData() as any);
// //   const payload = result.payload;
  
// //   console.log("API Response payload:", payload); // 👈 check this in browser console
  
// //   if (payload && payload.labels && payload.totals) {  // ✅ guard both fields
// //     const { labels, totals } = payload;
// //     const items: BarItem[] = labels.map((label: string, i: number) => ({
// //       name: label,
// //       Total: totals[i] ?? 0,
// //     }));
// //     items.sort((a, b) => a.Total - b.Total);
// //     setData(items);
// //   }
// // };
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

// const BarChartComponent: React.FC = () => {
//   const dispatch = useDispatch();
//   const [data, setData] = useState<BarItem[]>([]);

//   // useEffect(() => {
//   //   const fetchData = async () => {
//   //     const result = await dispatch(fetchOpportunityCategoryTotalData() as any);
//   //     const payload = result.payload;
//   //     if (payload) {
//   //       const { labels, totals } = payload;
//   //       const items: BarItem[] = labels.map((label: string, i: number) => ({
//   //         name: label,
//   //         Total: totals[i] ?? 0,
//   //       }));
//   //       // sort ascending so largest bar is at top in horizontal layout
//   //       items.sort((a, b) => a.Total - b.Total);
//   //       setData(items);
//   //     }
//   //   };
//   //   fetchData();
//   // }, [dispatch]);
  
//   useEffect(() => {
//     const fetchData = async () => {
//       const result = await dispatch(fetchOpportunityCategoryTotalData() as any);
//       const payload = result.payload;
  
//       console.log('payload:', payload); // 👈 check this first
  
//       // Normalise — handle array or { labels, totals } shape
//       let items: BarItem[] = [];
  
//       if (Array.isArray(payload)) {
//         // shape: [{ name: 'Printer', Total: 50000 }, ...]
//         items = payload.map((item: any) => ({
//           name:  item.name  ?? item.label ?? item.category ?? '—',
//           Total: item.Total ?? item.total ?? item.amount   ?? 0,
//         }));
  
//       } else if (payload?.labels && Array.isArray(payload.labels)) {
//         // shape: { labels: [...], totals: [...] }
//         items = payload.labels.map((label: string, i: number) => ({
//           name:  label,
//           Total: payload.totals?.[i] ?? 0,
//         }));
  
//       } else if (payload?.data && Array.isArray(payload.data)) {
//         // shape: { data: [...] }
//         items = payload.data.map((item: any) => ({
//           name:  item.name  ?? item.label ?? item.category ?? '—',
//           Total: item.Total ?? item.total ?? item.amount   ?? 0,
//         }));
//       }
  
//       items.sort((a, b) => a.Total - b.Total);
//       setData(items);
//     };
  
//     fetchData();
//   }, [dispatch]);

//   if (!data.length) return null;

//   const totalPip  = data.reduce((s, d) => s + d.Total, 0);
//   const active    = data.filter(d => d.Total > 0).length;
//   const top       = [...data].sort((a, b) => b.Total - a.Total)[0];
//   const maxVal    = Math.max(...data.map(d => d.Total));
//   const rounded   = Math.ceil(maxVal / 1_000_000) * 1_000_000 || 1_000_000;

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

// export default BarChartComponent;


// import React, { useEffect, useState } from 'react';
// import {
//   BarChart, Bar, XAxis, YAxis, CartesianGrid,
//   Tooltip, Cell, LabelList, ResponsiveContainer,
// } from 'recharts';
// import { useDispatch, useSelector } from 'react-redux';
// import styles from './BarChart.module.css';
// import { fetchOpportunityCategoryTotalData } from './slice/opportunityCategoryTotal';
// import type { RootState } from '../../../app/store';

// interface BarItem { name: string; Total: number; }

// const fmt = (v: number) =>
//   v >= 1_000_000 ? `₹${(v / 1_000_000).toFixed(2)}M`
//   : v >= 1_000   ? `₹${(v / 1_000).toFixed(0)}K`
//   : v > 0 ? `₹${v}` : '—';

// const fmtAxis = (v: number) =>
//   v >= 1_000_000 ? `${(v / 1_000_000).toFixed(0)}M`
//   : v >= 1_000   ? `${(v / 1_000).toFixed(0)}K` : `${v}`;

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
//       background:'#fff', border:'1px solid #E2E8F0',
//       borderRadius:10, padding:'10px 14px',
//       fontFamily:"'DM Sans', system-ui",
//       boxShadow:'0 2px 12px rgba(15,23,42,0.08)',
//     }}>
//       <p style={{ fontSize:12, fontWeight:600, color:'#0F172A', marginBottom:5 }}>{label}</p>
//       <p style={{ fontSize:12, color:'#4F46E5', marginBottom: val > 0 ? 2 : 0 }}>
//         Value: <strong>{fmt(val)}</strong>
//       </p>
//       {val > 0 && (
//         <p style={{ fontSize:11, color:'#94A3B8' }}>Share: {pct}% of pipeline</p>
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

// const BarChartComponent: React.FC = () => {
//   const dispatch = useDispatch<any>();
//   const [data, setData] = useState<BarItem[]>([]);

//   // ── Read globalFilter ──────────────────────────────────────
//   const { selectedYear, selectedMonth, filterType } = useSelector(
//     (s: RootState) => s.globalFilter
//   );

//   // ✅ Re-fetch when filter changes
//   useEffect(() => {
//     const fetchData = async () => {
//       const result  = await dispatch(fetchOpportunityCategoryTotalData());
//       const payload = result.payload;

//       let items: BarItem[] = [];

//       if (Array.isArray(payload)) {
//         items = payload.map((item: any) => ({
//           name:  item.name ?? item.label ?? item.category ?? '—',
//           Total: item.Total ?? item.total ?? item.amount ?? 0,
//         }));
//       } else if (payload?.labels && Array.isArray(payload.labels)) {
//         items = payload.labels.map((label: string, i: number) => ({
//           name:  label,
//           Total: payload.totals?.[i] ?? 0,
//         }));
//       } else if (payload?.data && Array.isArray(payload.data)) {
//         items = payload.data.map((item: any) => ({
//           name:  item.name ?? item.label ?? item.category ?? '—',
//           Total: item.Total ?? item.total ?? item.amount ?? 0,
//         }));
//       }

//       items.sort((a, b) => a.Total - b.Total);
//       setData(items);
//     };

//     fetchData();
//   }, [dispatch, selectedYear, selectedMonth, filterType]);

//   if (!data.length) return null;

//   const totalPip = data.reduce((s, d) => s + d.Total, 0);
//   const active   = data.filter(d => d.Total > 0).length;
//   const top      = [...data].sort((a, b) => b.Total - a.Total)[0];
//   const maxVal   = Math.max(...data.map(d => d.Total));
//   const rounded  = Math.ceil(maxVal / 1_000_000) * 1_000_000 || 1_000_000;

//   return (
//     <div className={styles.barChartContainer}>
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

//       <div className={styles.chartWrapper}>
//         <ResponsiveContainer width="100%" height={280}>
//           <BarChart data={data} layout="vertical"
//             margin={{ top:4, right:72, left:4, bottom:4 }}
//             barCategoryGap="28%">
//             <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9"
//               horizontal={false} vertical={true} />
//             <XAxis type="number" orientation="top"
//               domain={[0, rounded]} tickCount={5}
//               tick={<CustomXTick />}
//               axisLine={{ stroke:'#E2E8F0' }} tickLine={false} />
//             <YAxis dataKey="name" type="category" width={95}
//               tick={<CustomYTick />}
//               axisLine={false} tickLine={false} />
//             <Tooltip content={<CustomTooltip totalPip={totalPip} />}
//               cursor={{ fill:'rgba(79,70,229,0.04)' }} />
//             <Bar dataKey="Total" radius={[0,4,4,0]}
//               maxBarSize={18} isAnimationActive={true}
//               animationDuration={1100} animationEasing="ease-out">
//               {data.map((d, i) => (
//                 <Cell key={i} fill={getBarColor(d.Total, totalPip)} />
//               ))}
//               <LabelList dataKey="Total" position="right"
//                 formatter={(v: number) => v > 0 ? fmt(v) : ''}
//                 style={{
//                   fontSize:11, fontWeight:600,
//                   fill:'#334155', fontFamily:"'DM Sans', system-ui",
//                 }}
//               />
//             </Bar>
//           </BarChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// };

// export default BarChartComponent;


import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Cell, LabelList, ResponsiveContainer,
} from 'recharts';
import { useDispatch, useSelector } from 'react-redux';
import styles from './BarChart.module.css';
import { fetchOpportunityCategoryTotalData } from './slice/opportunityCategoryTotal';
import type { HierarchicalItem } from './slice/opportunityCategoryTotal';
import type { RootState } from '../../../app/store';

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

/* ── Flat row shape ──────────────────────────────────────────── */
interface FlatRow {
  name:     string;
  Total:    number;
  isOpp:    boolean;
  isMake:   boolean;
  oppIndex: number;
  oppName:  string;
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
  const isMake  = row?.isMake ?? false;
  const isOpp   = row?.isOpp  ?? true;
  const label   = payload.value || '';
  const maxLen  = isMake ? 18 : 20;
  const display = label.length > maxLen ? `${label.slice(0, maxLen)}…` : label;

  return (
    <text
      x={x - 6} y={y} dy={4}
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

/* ── Custom Bar Shape ────────────────────────────────────────── */
const CustomBar = (props: any) => {
  const { x, y, width, height, fill, payload } = props;
  const radius = payload?.isOpp ? 4 : 2;
  return (
    <rect
      x={x} y={y}
      width={Math.max(width, 0)}
      height={Math.max(height, 0)}
      fill={fill}
      rx={radius} ry={radius}
    />
  );
};

/* ── Main Component ──────────────────────────────────────────── */
const BarChartComponent: React.FC = () => {
  const dispatch = useDispatch<any>();
  const [flatRows, setFlatRows]   = useState<FlatRow[]>([]);
  const [expanded, setExpanded]   = useState<Set<string>>(new Set());
  const [hierarchical, setHierarchical] = useState<HierarchicalItem[]>([]);

  const { selectedYear, selectedMonth, filterType } = useSelector(
    (s: RootState) => s.globalFilter
  );

  /* ── Re-fetch on filter change ───────────────────────────── */
  useEffect(() => {
    const fetchData = async () => {
      const result  = await dispatch(fetchOpportunityCategoryTotalData());
      const payload = result.payload;

      const hier: HierarchicalItem[] = Array.isArray(payload?.hierarchical)
        ? payload.hierarchical
        : [];

      setHierarchical(hier);
    };

    fetchData();
  }, [dispatch, selectedYear, selectedMonth, filterType]);

  /* ── Parse hierarchical → flat rows ─────────────────────── */
  useEffect(() => {
    if (!hierarchical.length) {
      setFlatRows([]);
      return;
    }

    const rows: FlatRow[] = [];

    hierarchical.forEach((opp, oppIdx) => {
      rows.push({
        name:     opp.opportunity,
        Total:    opp.total_amount,
        isOpp:    true,
        isMake:   false,
        oppIndex: oppIdx,
        oppName:  opp.opportunity,
      });

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
  }, [hierarchical, expanded]);

  /* ── Toggle expand/collapse ──────────────────────────────── */
  const toggleExpand = (oppName: string) => {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(oppName)) next.delete(oppName);
      else next.add(oppName);
      return next;
    });
  };

  /* ── Expand / Collapse All ───────────────────────────────── */
  const allOppNames  = hierarchical.map(o => o.opportunity);
  const allExpanded  = allOppNames.length > 0 && allOppNames.every(n => expanded.has(n));
  const toggleAll    = () => {
    setExpanded(allExpanded ? new Set() : new Set(allOppNames));
  };

  /* ── Derived ─────────────────────────────────────────────── */
  const totalPip    = hierarchical.reduce((s, o) => s + o.total_amount, 0);
  const activeCount = hierarchical.filter(o => o.total_amount > 0).length;
  const top         = [...hierarchical].sort((a, b) => b.total_amount - a.total_amount)[0];
  const maxVal      = Math.max(...flatRows.map(r => r.Total), 0);
  const rounded     = Math.ceil(maxVal / 1_000_000) * 1_000_000 || 1_000_000;
  const chartHeight = Math.max(220, flatRows.length * 34 + 40);

  /* ── Empty state ─────────────────────────────────────────── */
  if (!flatRows.length && !hierarchical.length) return null;

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
        <span style={{
          fontSize: 11, fontWeight: 600,
          color: '#64748B', fontFamily: "'DM Sans', system-ui",
        }}>
          Click opportunity row to expand makes
        </span>
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
        {[
          { color: '#4F46E5', label: 'Opportunity Category' },
          { color: '#059669', label: 'Product Category 1 (Make)' },
        ].map(item => (
          <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{
              width: 10, height: 10, borderRadius: 2,
              background: item.color,
            }} />
            <span style={{ fontSize: 11, color: '#64748B', fontFamily: "'DM Sans', system-ui" }}>
              {item.label}
            </span>
          </div>
        ))}
      </div>

      {/* ── Summary Cards ───────────────────────────────────── */}
      <div className={styles.summaryGrid}>
        <div className={styles.sCard}>
          <div className={styles.sCardLabel}>Total pipeline</div>
          <div className={styles.sCardVal}>{fmt(totalPip)}</div>
          <div className={styles.sCardSub}>all categories</div>
        </div>
        <div className={styles.sCard}>
          <div className={styles.sCardLabel}>Top category</div>
          <div className={styles.sCardVal}>{top?.opportunity || '—'}</div>
          <div className={styles.sCardSub}>
            {totalPip > 0 && top
              ? `${Math.round((top.total_amount / totalPip) * 100)}% of pipeline`
              : '—'}
          </div>
        </div>
        <div className={styles.sCard}>
          <div className={styles.sCardLabel}>Active categories</div>
          <div className={styles.sCardVal}>{activeCount} / {hierarchical.length}</div>
          <div className={styles.sCardSub}>with pipeline</div>
        </div>
      </div>

      {/* ── Chart ───────────────────────────────────────────── */}
      <div style={{ overflowY: 'auto', maxHeight: 520 }}>
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
                if (row?.isOpp) toggleExpand(row.name);
              }}
              style={{ cursor: 'pointer' }}
            >
              <CartesianGrid
                strokeDasharray="3 3" stroke="#F1F5F9"
                horizontal={false} vertical={true}
              />
              <XAxis
                type="number" orientation="top"
                domain={[0, rounded]} tickCount={5}
                tick={<CustomXTick />}
                axisLine={{ stroke: '#E2E8F0' }} tickLine={false}
              />
              <YAxis
                dataKey="name" type="category" width={130}
                tick={<CustomYTick flatRows={flatRows} />}
                axisLine={false} tickLine={false}
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
                    fontSize: 10.5, fontWeight: 600,
                    fill: '#334155', fontFamily: "'DM Sans', system-ui",
                  }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Hint ────────────────────────────────────────────── */}
      <div style={{
        marginTop: 8, fontSize: 10.5,
        color: '#94A3B8', textAlign: 'center',
        fontFamily: "'DM Sans', system-ui",
      }}>
        {expanded.size > 0
          ? `${expanded.size} categor${expanded.size > 1 ? 'ies' : 'y'} expanded`
          : 'Click any bar or label to expand makes'}
      </div>

    </div>
  );
};

export default BarChartComponent;