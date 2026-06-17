// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchMonthWiseBudgetData } from './slice/monthWiseBudget';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// import type { RootState } from '../../../app/store';
// import styles from './MonthWiseBudget.module.css';

// interface BudgetEntry {
//     month_number: number;
//     month_name: string;
//     total_amount: number;
// }

// const BarComponent: React.FC = () => {
//     const dispatch = useDispatch();
//     const budgetData = useSelector((state: RootState) => state.fetchMonthWiseBudgetData.budgetdata);

//     useEffect(() => {
//         dispatch(fetchMonthWiseBudgetData() as any);
//     }, [dispatch]);

//     const formattedBudgetData = budgetData?.map((entry: any) => ({
//         month_number: entry.month_number,
//         name: entry.month_name,
//         Expected: 10000000,
//         total_amount: entry.total_amount,
//     })) || [];

//     const [selectedPeriod, setSelectedPeriod] = useState('yearly');
//     const [filteredData, setFilteredData] = useState(formattedBudgetData);

//     useEffect(() => {
//         filterData('yearly'); // Default to yearly on first render
//     }, [budgetData]);

//     const filterData = (period: string) => {
//         const currentMonthIndex = new Date().getMonth(); // 0-based index (Jan = 0, Dec = 11)
    
//         if (period === 'yearly') {
//             // Group data into quarterly sums (Jan-Mar, Apr-Jun, Jul-Sep, Oct-Dec)
//             const groupedData = [
//                 { name: 'Jan-Mar', Expected: 30000000, total_amount: 0 },
//                 { name: 'Apr-Jun', Expected: 30000000, total_amount: 0 },
//                 { name: 'Jul-Sep', Expected: 30000000, total_amount: 0 },
//                 { name: 'Oct-Dec', Expected: 30000000, total_amount: 0 }
//             ];
    
//             formattedBudgetData.forEach((entry : BudgetEntry) => {
//                 if (entry.month_number <= 3) {
//                     groupedData[0].total_amount += entry.total_amount;
                    
//                 } else if (entry.month_number <= 6) {
//                     groupedData[1].total_amount += entry.total_amount;
//                 } else if (entry.month_number <= 9) {
//                     groupedData[2].total_amount += entry.total_amount;
//                 } else {
//                     groupedData[3].total_amount += entry.total_amount;
//                 }
//             });
    
//             setFilteredData(groupedData);
//             // console.log('yearly ' , filteredData)
//         } 
        
//         else if (period === 'half-yearly') {
            
//             // Show current month, previous 3 months, and next 3 months
//             const startMonth = Math.max(currentMonthIndex - 3, 0); // Ensure it doesn't go below index 0
//             const endMonth = Math.min(currentMonthIndex + 3, formattedBudgetData.length - 1); // Ensure it doesn't go above max index
    
//             const halfYearlyData = formattedBudgetData.filter((entry : BudgetEntry) =>
//                 entry.month_number - 1 >= startMonth && entry.month_number - 1 <= endMonth
//             );
    
//             setFilteredData(halfYearlyData);
//             // console.log('Half-Yearly:', halfYearlyData);
//         } 
        
//         else if (period === 'quarterly') {
//             const prevMonth = Math.max(currentMonthIndex - 1, 0);
//             const nextMonth = Math.min(currentMonthIndex + 1, formattedBudgetData.length - 1);
//             setFilteredData(formattedBudgetData.filter((entry: BudgetEntry) =>
//                 entry.month_number - 1 === prevMonth ||
//                 entry.month_number - 1 === currentMonthIndex ||
//                 entry.month_number - 1 === nextMonth
//             ));
//         }
//     };
    
    
//     const handlePeriodChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
//         const period = event.target.value;
//         setSelectedPeriod(period);
//         filterData(period);
//     };

//     // console.log('filteredData',filteredData)

//     return (
//         <div className={styles.Container}>
//             <p className={styles.head}>Month Wise Budget vs Sales</p>
//             <div className={styles.Wrapper}>
//                 {/* Select Dropdown */}
//                 <select value={selectedPeriod} onChange={handlePeriodChange} className={styles.select}>
//                     <option value="yearly">Yearly</option>
//                     <option value="half-yearly">Half Yearly</option>
//                     <option value="quarterly">Quarterly</option>
//                 </select>

//                 <ResponsiveContainer width="100%" height={300}>
//                     <BarChart
//                         width={800}
//                         height={300}
//                         data={filteredData}
//                         className={styles.barchart}
//                         layout="horizontal"
//                         margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
//                     >
//                         <CartesianGrid strokeDasharray="3 3" />
//                         <XAxis dataKey="name" type="category" />
//                         <YAxis type="number" tickFormatter={(value) => `${(value / 1_000_000).toFixed(1)}M`} />
//                         <Tooltip  />
//                         <Legend />
//                         <Bar dataKey="Expected" fill="#8884d8" />
//                         <Bar dataKey="total_amount" fill="#82ca9d" />
//                     </BarChart>
//                 </ResponsiveContainer>
//             </div>
//         </div>
//     );
// };

// export default BarComponent;

// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchMonthWiseBudgetData } from './slice/monthWiseBudget';
// import {
//   BarChart, Bar, XAxis, YAxis, CartesianGrid,
//   Tooltip, Legend, ResponsiveContainer, Cell
// } from 'recharts';
// import type { RootState } from '../../../app/store';
// import styles from './MonthWiseBudget.module.css';

// interface BudgetEntry {
//   month_number: number;
//   month_name: string;
//   total_amount: number;
// }

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
//       <p style={{ fontSize: 12, fontWeight: 600, color: '#0F172A', marginBottom: 6 }}>{label}</p>
//       {payload.map((p: any, i: number) => (
//         <p key={i} style={{ fontSize: 12, color: p.color, margin: '2px 0' }}>
//           {p.name}: <strong>{(p.value / 1_000_000).toFixed(2)}M</strong>
//         </p>
//       ))}
//     </div>
//   );
// };

// const BarComponent: React.FC = () => {
//   const dispatch = useDispatch();
//   const budgetData = useSelector((state: RootState) => state.fetchMonthWiseBudgetData.budgetdata);

//   useEffect(() => {
//     dispatch(fetchMonthWiseBudgetData() as any);
//   }, [dispatch]);

//   const formattedBudgetData = budgetData?.map((entry: any) => ({
//     month_number: entry.month_number,
//     name: entry.month_name,
//     Expected: 10000000,
//     total_amount: entry.total_amount,
//   })) || [];

//   const [selectedPeriod, setSelectedPeriod] = useState('yearly');
//   const [filteredData, setFilteredData] = useState(formattedBudgetData);

//   useEffect(() => {
//     filterData('yearly');
//   }, [budgetData]);

//   const filterData = (period: string) => {
//     const currentMonthIndex = new Date().getMonth();

//     if (period === 'yearly') {
//       const groupedData = [
//         { name: 'Jan–Mar', Expected: 30000000, total_amount: 0 },
//         { name: 'Apr–Jun', Expected: 30000000, total_amount: 0 },
//         { name: 'Jul–Sep', Expected: 30000000, total_amount: 0 },
//         { name: 'Oct–Dec', Expected: 30000000, total_amount: 0 },
//       ];
//       formattedBudgetData.forEach((entry: BudgetEntry) => {
//         if (entry.month_number <= 3) groupedData[0].total_amount += entry.total_amount;
//         else if (entry.month_number <= 6) groupedData[1].total_amount += entry.total_amount;
//         else if (entry.month_number <= 9) groupedData[2].total_amount += entry.total_amount;
//         else groupedData[3].total_amount += entry.total_amount;
//       });
//       setFilteredData(groupedData);
//     } else if (period === 'half-yearly') {
//       const startMonth = Math.max(currentMonthIndex - 3, 0);
//       const endMonth = Math.min(currentMonthIndex + 3, formattedBudgetData.length - 1);
//       setFilteredData(
//         formattedBudgetData.filter((entry: BudgetEntry) =>
//           entry.month_number - 1 >= startMonth && entry.month_number - 1 <= endMonth
//         )
//       );
//     } else if (period === 'quarterly') {
//       const prev = Math.max(currentMonthIndex - 1, 0);
//       const next = Math.min(currentMonthIndex + 1, formattedBudgetData.length - 1);
//       setFilteredData(
//         formattedBudgetData.filter((entry: BudgetEntry) =>
//           entry.month_number - 1 === prev ||
//           entry.month_number - 1 === currentMonthIndex ||
//           entry.month_number - 1 === next
//         )
//       );
//     }
//   };

//   const handlePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const period = e.target.value;
//     setSelectedPeriod(period);
//     filterData(period);
//   };

//   return (
//     <div className={styles.Container}>
//       <div className={styles.Wrapper}>
//         <select value={selectedPeriod} onChange={handlePeriodChange} className={styles.select}>
//           <option value="yearly">Yearly</option>
//           <option value="half-yearly">Half Yearly</option>
//           <option value="quarterly">Quarterly</option>
//         </select>

//         <ResponsiveContainer width="100%" height={260}>
//           <BarChart
//             data={filteredData}
//             layout="horizontal"
//             margin={{ top: 4, right: 16, left: 4, bottom: 4 }}
//             barCategoryGap="28%"
//             barGap={4}
//           >
//             <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
//             <XAxis
//               dataKey="name"
//               type="category"
//               tick={{ fontSize: 12, fill: '#64748B', fontFamily: "'DM Sans', system-ui" }}
//               axisLine={{ stroke: '#E2E8F0' }}
//               tickLine={false}
//             />
//             <YAxis
//               type="number"
//               tick={{ fontSize: 11, fill: '#94A3B8', fontFamily: "'DM Sans', system-ui" }}
//               tickFormatter={(v) => `${(v / 1_000_000).toFixed(0)}M`}
//               axisLine={false}
//               tickLine={false}
//               width={42}
//             />
//             <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(79,70,229,0.04)' }} />
//             <Legend
//               wrapperStyle={{ fontSize: 12, fontFamily: "'DM Sans', system-ui", paddingTop: 8 }}
//               iconType="circle"
//               iconSize={8}
//             />
//             <Bar dataKey="Expected"     name="Expected"     fill="#C7D2FE" radius={[4, 4, 0, 0]} />
//             <Bar dataKey="total_amount" name="Actual Sales" fill="#4F46E5" radius={[4, 4, 0, 0]} />
//           </BarChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// };

// export default BarComponent;


// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchMonthWiseBudgetData } from './slice/monthWiseBudget';
// import {
//   BarChart, Bar, XAxis, YAxis, CartesianGrid,
//   Tooltip, Legend, ResponsiveContainer,
// } from 'recharts';
// import type { RootState } from '../../../app/store';
// import styles from './MonthWiseBudget.module.css';

// interface BudgetEntry {
//   month_number: number;
//   month_name: string;
//   total_amount: number;
// }

// interface FormattedBudgetEntry {
//   month_number: number;
//   name: string;
//   Expected: number;
//   total_amount: number;
// }

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
//       <p style={{ fontSize: 12, fontWeight: 600, color: '#0F172A', marginBottom: 6 }}>{label}</p>
//       {payload.map((p: any, i: number) => (
//         <p key={i} style={{ fontSize: 12, color: p.color, margin: '2px 0' }}>
//           {p.name}: <strong>{(p.value / 1_000_000).toFixed(2)}M</strong>
//         </p>
//       ))}
//     </div>
//   );
// };

// const BarComponent: React.FC = () => {
//   const dispatch = useDispatch();
//   const { budgetdata, loading, error } = useSelector(
//     (state: RootState) => state.fetchMonthWiseBudgetData
//   );

//   useEffect(() => {
//     dispatch(fetchMonthWiseBudgetData() as any);
//   }, [dispatch]);

//   // ✅ Safety guard: normalize to array before mapping
//   const safeData: BudgetEntry[] = Array.isArray(budgetdata)
//     ? budgetdata
//     : budgetdata?.results ?? budgetdata?.data ?? [];

//   const formattedBudgetData: FormattedBudgetEntry[] = safeData.map((entry: BudgetEntry) => ({
//     month_number: entry.month_number,
//     name: entry.month_name,
//     Expected: 10000000,
//     total_amount: entry.total_amount,
//   }));

//   const [selectedPeriod, setSelectedPeriod] = useState('yearly');
//   const [filteredData, setFilteredData] = useState<any[]>([]);

//   // ✅ Re-run filter whenever formatted data changes
//   useEffect(() => {
//     if (formattedBudgetData.length > 0) {
//       applyFilter('yearly');
//     }
//   }, [budgetdata]);

//   const applyFilter = (period: string) => {
//     const currentMonthIndex = new Date().getMonth();

//     if (period === 'yearly') {
//       const groupedData = [
//         { name: 'Jan–Mar', Expected: 30000000, total_amount: 0 },
//         { name: 'Apr–Jun', Expected: 30000000, total_amount: 0 },
//         { name: 'Jul–Sep', Expected: 30000000, total_amount: 0 },
//         { name: 'Oct–Dec', Expected: 30000000, total_amount: 0 },
//       ];
//       formattedBudgetData.forEach((entry) => {
//         if (entry.month_number <= 3)       groupedData[0].total_amount += entry.total_amount;
//         else if (entry.month_number <= 6)  groupedData[1].total_amount += entry.total_amount;
//         else if (entry.month_number <= 9)  groupedData[2].total_amount += entry.total_amount;
//         else                               groupedData[3].total_amount += entry.total_amount;
//       });
//       setFilteredData(groupedData);

//     } else if (period === 'half-yearly') {
//       const startMonth = Math.max(currentMonthIndex - 3, 0);
//       const endMonth = Math.min(currentMonthIndex + 3, formattedBudgetData.length - 1);
//       setFilteredData(
//         formattedBudgetData.filter((entry) =>
//           entry.month_number - 1 >= startMonth &&
//           entry.month_number - 1 <= endMonth
//         )
//       );

//     } else if (period === 'quarterly') {
//       const prev = Math.max(currentMonthIndex - 1, 0);
//       const next = Math.min(currentMonthIndex + 1, formattedBudgetData.length - 1);
//       setFilteredData(
//         formattedBudgetData.filter((entry) =>
//           entry.month_number - 1 === prev ||
//           entry.month_number - 1 === currentMonthIndex ||
//           entry.month_number - 1 === next
//         )
//       );
//     }
//   };

//   const handlePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const period = e.target.value;
//     setSelectedPeriod(period);
//     applyFilter(period);
//   };

//   /* ── Loading / Error / Empty states ── */
//   if (loading) {
//     return (
//       <div className={styles.Container}>
//         <div className={styles.Wrapper} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 260 }}>
//           <p style={{ color: '#94A3B8', fontFamily: "'DM Sans', system-ui", fontSize: 14 }}>Loading...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className={styles.Container}>
//         <div className={styles.Wrapper} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 260 }}>
//           <p style={{ color: '#F43F5E', fontFamily: "'DM Sans', system-ui", fontSize: 14 }}>Failed to load chart data.</p>
//         </div>
//       </div>
//     );
//   }

//   if (filteredData.length === 0) {
//     return (
//       <div className={styles.Container}>
//         <div className={styles.Wrapper} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 260 }}>
//           <p style={{ color: '#94A3B8', fontFamily: "'DM Sans', system-ui", fontSize: 14 }}>No data available.</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className={styles.Container}>
//       <div className={styles.Wrapper}>
//         <select value={selectedPeriod} onChange={handlePeriodChange} className={styles.select}>
//           <option value="yearly">Yearly</option>
//           <option value="half-yearly">Half Yearly</option>
//           <option value="quarterly">Quarterly</option>
//         </select>

//         <ResponsiveContainer width="100%" height={260}>
//           <BarChart
//             data={filteredData}
//             layout="horizontal"
//             margin={{ top: 4, right: 16, left: 4, bottom: 4 }}
//             barCategoryGap="28%"
//             barGap={4}
//           >
//             <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
//             <XAxis
//               dataKey="name"
//               type="category"
//               tick={{ fontSize: 12, fill: '#64748B', fontFamily: "'DM Sans', system-ui" }}
//               axisLine={{ stroke: '#E2E8F0' }}
//               tickLine={false}
//             />
//             <YAxis
//               type="number"
//               tick={{ fontSize: 11, fill: '#94A3B8', fontFamily: "'DM Sans', system-ui" }}
//               tickFormatter={(v) => `${(v / 1_000_000).toFixed(0)}M`}
//               axisLine={false}
//               tickLine={false}
//               width={42}
//             />
//             <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(79,70,229,0.04)' }} />
//             <Legend
//               wrapperStyle={{ fontSize: 12, fontFamily: "'DM Sans', system-ui", paddingTop: 8 }}
//               iconType="circle"
//               iconSize={8}
//             />
//             <Bar dataKey="Expected"     name="Expected"     fill="#C7D2FE" radius={[4, 4, 0, 0]} />
//             <Bar dataKey="total_amount" name="Actual Sales" fill="#4F46E5" radius={[4, 4, 0, 0]} />
//           </BarChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// };

// export default BarComponent;

// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchMonthWiseBudgetData } from './slice/monthWiseBudget';
// import {
//   BarChart, Bar, XAxis, YAxis, CartesianGrid,
//   Tooltip, Legend, ResponsiveContainer,
// } from 'recharts';
// import type { RootState } from '../../../app/store';
// import styles from './MonthWiseBudget.module.css';

// const FY_QUARTERS = [
//   { label: 'Apr–Jun', months: ['April','May','June'] },
//   { label: 'Jul–Sep', months: ['July','August','September'] },
//   { label: 'Oct–Dec', months: ['October','November','December'] },
//   { label: 'Jan–Mar', months: ['January','February','March'] },
// ];

// const FY_MONTHS = [
//   'April','May','June','July','August','September',
//   'October','November','December','January','February','March',
// ];

// const getCurrentFYMonthIndex = (): number => {
//   const m = new Date().getMonth() + 1;
//   if (m >= 4) return m - 4;
//   return m + 8;
// };

// const CustomTooltip = ({ active, payload, label }: any) => {
//   if (!active || !payload?.length) return null;
//   return (
//     <div style={{
//       background:'#fff', border:'1px solid #E2E8F0',
//       borderRadius:10, padding:'10px 14px',
//       boxShadow:'0 4px 16px rgba(15,23,42,0.10)',
//       fontFamily:"'DM Sans', system-ui, sans-serif",
//     }}>
//       <p style={{ fontSize:12, fontWeight:600, color:'#0F172A', marginBottom:6 }}>{label}</p>
//       {payload.map((p: any, i: number) => (
//         <p key={i} style={{ fontSize:12, color:p.color, margin:'2px 0' }}>
//           {p.name}: <strong>{(p.value / 1_000_000).toFixed(2)}M</strong>
//         </p>
//       ))}
//     </div>
//   );
// };

// const BarComponent: React.FC = () => {
//   const dispatch = useDispatch<any>();

//   // ── Read globalFilter — only year matters ──────────────────
//   const { selectedYear } = useSelector(
//     (s: RootState) => s.globalFilter
//   );

//   const { budgetdata, loading, error } = useSelector(
//     (state: RootState) => state.fetchMonthWiseBudgetData
//   );

//   // ✅ Re-fetch when year changes
//   useEffect(() => {
//     dispatch(fetchMonthWiseBudgetData());
//   }, [dispatch, selectedYear]);

//   const safeData = Array.isArray(budgetdata) ? budgetdata : [];

//   // Build formatted data with FY ordering
//   const formattedBudgetData = FY_MONTHS.map(monthName => {
//     const entry = safeData.find((e: any) => e.month_name === monthName);
//     return {
//       month_number: entry?.month_number || 0,
//       month_name:   monthName,
//       name:         monthName,
//       Expected:     10000000,
//       total_amount: entry?.total_amount || 0,
//     };
//   });

//   const [selectedPeriod, setSelectedPeriod] = useState('yearly');
//   const [filteredData, setFilteredData]     = useState<any[]>([]);

//   useEffect(() => {
//     applyFilter(selectedPeriod);
//   }, [budgetdata, selectedPeriod]);

//   const applyFilter = (period: string) => {
//     if (formattedBudgetData.length === 0) {
//       setFilteredData([]);
//       return;
//     }

//     if (period === 'yearly') {
//       const groupedData = FY_QUARTERS.map(q => {
//         let totalExpected = 0;
//         let totalAchieved = 0;
//         q.months.forEach(monthName => {
//           const entry = formattedBudgetData.find(e => e.month_name === monthName);
//           if (entry) {
//             totalExpected += entry.Expected || 0;
//             totalAchieved += entry.total_amount || 0;
//           }
//         });
//         return { name: q.label, Expected: totalExpected, total_amount: totalAchieved };
//       });
//       setFilteredData(groupedData);
//     } else if (period === 'half-yearly') {
//       const currIdx = getCurrentFYMonthIndex();
//       const start   = Math.max(0, currIdx - 2);
//       const end     = Math.min(11, currIdx + 2);
//       setFilteredData(formattedBudgetData.slice(start, end + 1));
//     } else if (period === 'quarterly') {
//       const m = new Date().getMonth() + 1;
//       let qIdx: number;
//       if (m >= 4 && m <= 6)        qIdx = 0;
//       else if (m >= 7 && m <= 9)   qIdx = 1;
//       else if (m >= 10 && m <= 12) qIdx = 2;
//       else                          qIdx = 3;

//       const quarter = FY_QUARTERS[qIdx];
//       const qData = quarter.months.map(monthName => {
//         const entry = formattedBudgetData.find(e => e.month_name === monthName);
//         return {
//           name:         monthName,
//           Expected:     entry?.Expected     || 0,
//           total_amount: entry?.total_amount || 0,
//         };
//       });
//       setFilteredData(qData);
//     }
//   };

//   if (loading) {
//     return (
//       <div className={styles.Container}>
//         <div className={styles.Wrapper} style={{ display:'flex', alignItems:'center', justifyContent:'center', height:260 }}>
//           <p style={{ color:'#94A3B8', fontSize:14 }}>Loading...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className={styles.Container}>
//         <div className={styles.Wrapper} style={{ display:'flex', alignItems:'center', justifyContent:'center', height:260 }}>
//           <p style={{ color:'#F43F5E', fontSize:14 }}>Failed to load chart data.</p>
//         </div>
//       </div>
//     );
//   }

//   if (filteredData.length === 0) {
//     return (
//       <div className={styles.Container}>
//         <div className={styles.Wrapper} style={{ display:'flex', alignItems:'center', justifyContent:'center', height:260 }}>
//           <p style={{ color:'#94A3B8', fontSize:14 }}>No data available.</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className={styles.Container}>
//       <div className={styles.Wrapper}>
//         <select
//           value={selectedPeriod}
//           onChange={e => setSelectedPeriod(e.target.value)}
//           className={styles.select}
//         >
//           <option value="yearly">Yearly</option>
//           <option value="half-yearly">Half Yearly</option>
//           <option value="quarterly">Quarterly</option>
//         </select>

//         <ResponsiveContainer width="100%" height={260}>
//           <BarChart data={filteredData} layout="horizontal"
//             margin={{ top:4, right:16, left:4, bottom:4 }}
//             barCategoryGap="28%" barGap={4}>
//             <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
//             <XAxis dataKey="name" type="category"
//               tick={{ fontSize:12, fill:'#64748B', fontFamily:"'DM Sans', system-ui" }}
//               axisLine={{ stroke:'#E2E8F0' }} tickLine={false} />
//             <YAxis type="number"
//               tick={{ fontSize:11, fill:'#94A3B8', fontFamily:"'DM Sans', system-ui" }}
//               tickFormatter={(v) => `${(v / 1_000_000).toFixed(0)}M`}
//               axisLine={false} tickLine={false} width={42} />
//             <Tooltip content={<CustomTooltip />} cursor={{ fill:'rgba(79,70,229,0.04)' }} />
//             <Legend
//               wrapperStyle={{ fontSize:12, fontFamily:"'DM Sans', system-ui", paddingTop:8 }}
//               iconType="circle" iconSize={8} />
//             <Bar dataKey="Expected" name="Expected" fill="#C7D2FE" radius={[4,4,0,0]} />
//             <Bar dataKey="total_amount" name="Actual Sales" fill="#4F46E5" radius={[4,4,0,0]} />
//           </BarChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// };

// export default BarComponent;


// src/features/dashboardUser/MonthWiseBudget/month.tsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMonthWiseBudgetData } from './slice/monthWiseBudget';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import type { RootState } from '../../../app/store';
import styles from './MonthWiseBudget.module.css';

const FY_QUARTERS = [
  { label: 'Apr–Jun', months: ['April','May','June']            },
  { label: 'Jul–Sep', months: ['July','August','September']     },
  { label: 'Oct–Dec', months: ['October','November','December'] },
  { label: 'Jan–Mar', months: ['January','February','March']    },
];

const FY_MONTHS = [
  'April','May','June','July','August','September',
  'October','November','December','January','February','March',
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background:'#fff', border:'1px solid #E2E8F0',
      borderRadius:10, padding:'10px 14px',
      boxShadow:'0 4px 16px rgba(15,23,42,0.10)',
      fontFamily:"'DM Sans', system-ui, sans-serif",
    }}>
      <p style={{ fontSize:12, fontWeight:600, color:'#0F172A', marginBottom:6 }}>
        {label}
      </p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ fontSize:12, color:p.color, margin:'2px 0' }}>
          {p.name}: <strong>{(p.value / 1_000_000).toFixed(2)}M</strong>
        </p>
      ))}
    </div>
  );
};

const BarComponent: React.FC = () => {
  const dispatch = useDispatch<any>();

  // ✅ Read full globalFilter
  const { selectedYear, selectedMonth, filterType } = useSelector(
    (s: RootState) => s.globalFilter
  );

  const { budgetdata, loading, error } = useSelector(
    (state: RootState) => state.fetchMonthWiseBudgetData
  );

  // ✅ Re-fetch when filter changes
  useEffect(() => {
    dispatch(fetchMonthWiseBudgetData());
  }, [dispatch, selectedYear, selectedMonth, filterType]);

  const safeData = Array.isArray(budgetdata) ? budgetdata : [];

  // Build formatted data with FY ordering
  const formattedBudgetData = FY_MONTHS.map(monthName => {
    const entry = safeData.find((e: any) => e.month_name === monthName);
    return {
      month_name:   monthName,
      name:         monthName,
      // ✅ Use real Expected from slice — not hardcoded
      Expected:     entry?.Expected     || 0,
      total_amount: entry?.total_amount || 0,
    };
  });

  const [selectedPeriod, setSelectedPeriod] = useState('yearly');
  const [filteredData,   setFilteredData]   = useState<any[]>([]);

  // ✅ Re-filter when data or filter changes
  useEffect(() => {
    buildChartData(selectedPeriod);
  }, [budgetdata, selectedPeriod, filterType, selectedMonth]);

  const buildChartData = (period: string) => {
    if (!formattedBudgetData.length) {
      setFilteredData([]);
      return;
    }

    // ✅ Monthly mode: show only selected month
    if (filterType === 'monthly') {
      const entry = formattedBudgetData.find(
        e => e.month_name === selectedMonth
      );
      setFilteredData(
        entry ? [{ ...entry, name: entry.month_name }] : []
      );
      return;
    }

    // Yearly mode: group by period
    if (period === 'yearly') {
      const grouped = FY_QUARTERS.map(q => {
        let totalExpected = 0;
        let totalAchieved = 0;
        q.months.forEach(monthName => {
          const entry = formattedBudgetData.find(e => e.month_name === monthName);
          if (entry) {
            totalExpected += entry.Expected     || 0;
            totalAchieved += entry.total_amount || 0;
          }
        });
        return {
          name:         q.label,
          Expected:     totalExpected,
          total_amount: totalAchieved,
        };
      });
      setFilteredData(grouped);

    } else if (period === 'quarterly') {
      const m = new Date().getMonth() + 1;
      let qIdx = 0;
      if      (m >= 4  && m <= 6)  qIdx = 0;
      else if (m >= 7  && m <= 9)  qIdx = 1;
      else if (m >= 10 && m <= 12) qIdx = 2;
      else                         qIdx = 3;

      const quarter = FY_QUARTERS[qIdx];
      const qData   = quarter.months.map(monthName => {
        const entry = formattedBudgetData.find(e => e.month_name === monthName);
        return {
          name:         monthName,
          Expected:     entry?.Expected     || 0,
          total_amount: entry?.total_amount || 0,
        };
      });
      setFilteredData(qData);

    } else if (period === 'half-yearly') {
      const currentMonthName = new Date().toLocaleString(
        'default', { month: 'long' }
      );
      const currentIdx = formattedBudgetData.findIndex(
        e => e.month_name === currentMonthName
      );
      const start = Math.max(0, currentIdx - 2);
      const end   = Math.min(formattedBudgetData.length - 1, currentIdx + 2);
      setFilteredData(formattedBudgetData.slice(start, end + 1));
    }
  };

  if (loading) {
    return (
      <div className={styles.Container}>
        <div className={styles.Wrapper} style={{
          display:'flex', alignItems:'center',
          justifyContent:'center', height:260,
        }}>
          <p style={{ color:'#94A3B8', fontSize:14 }}>Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.Container}>
        <div className={styles.Wrapper} style={{
          display:'flex', alignItems:'center',
          justifyContent:'center', height:260,
        }}>
          <p style={{ color:'#F43F5E', fontSize:14 }}>
            Failed to load chart data.
          </p>
        </div>
      </div>
    );
  }

  if (filteredData.length === 0) {
    return (
      <div className={styles.Container}>
        <div className={styles.Wrapper} style={{
          display:'flex', alignItems:'center',
          justifyContent:'center', height:260,
        }}>
          <p style={{ color:'#94A3B8', fontSize:14 }}>No data available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.Container}>
      <div className={styles.Wrapper}>

        {/* ✅ Hide period selector in monthly mode */}
        {filterType !== 'monthly' && (
          <select
            value={selectedPeriod}
            onChange={e => setSelectedPeriod(e.target.value)}
            className={styles.select}
          >
            <option value="yearly">Yearly</option>
            <option value="half-yearly">Half Yearly</option>
            <option value="quarterly">Quarterly</option>
          </select>
        )}

        <ResponsiveContainer width="100%" height={260}>
          <BarChart
            data={filteredData}
            layout="horizontal"
            margin={{ top:4, right:16, left:4, bottom:4 }}
            barCategoryGap="28%"
            barGap={4}
          >
            <CartesianGrid
              strokeDasharray="3 3" stroke="#F1F5F9"
              vertical={false}
            />
            <XAxis
              dataKey="name" type="category"
              tick={{ fontSize:12, fill:'#64748B', fontFamily:"'DM Sans', system-ui" }}
              axisLine={{ stroke:'#E2E8F0' }} tickLine={false}
            />
            <YAxis
              type="number"
              tick={{ fontSize:11, fill:'#94A3B8', fontFamily:"'DM Sans', system-ui" }}
              tickFormatter={(v) => `${(v / 1_000_000).toFixed(0)}M`}
              axisLine={false} tickLine={false} width={42}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill:'rgba(79,70,229,0.04)' }}
            />
            <Legend
              wrapperStyle={{
                fontSize:12, fontFamily:"'DM Sans', system-ui", paddingTop:8,
              }}
              iconType="circle" iconSize={8}
            />
            <Bar
              dataKey="Expected"
              name="Expected"
              fill="#C7D2FE"
              radius={[4,4,0,0]}
            />
            <Bar
              dataKey="total_amount"
              name="Actual Sales"
              fill="#4F46E5"
              radius={[4,4,0,0]}
            />
          </BarChart>
        </ResponsiveContainer>

      </div>
    </div>
  );
};

export default BarComponent;