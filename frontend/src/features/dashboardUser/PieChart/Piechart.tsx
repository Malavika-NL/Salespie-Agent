// import React, { useEffect } from 'react';
// import { ResponsiveContainer, Tooltip, PieChart, Pie, Cell } from 'recharts';
// import { useDispatch, useSelector } from 'react-redux';
// import type { RootState } from '../../../app/store';
// import { fetchUserPieChartData } from './slice/piechart';
// import styles from './Piechart.module.css';

// interface PieDataItem {
//   name: string;
//   value: number;
// }

// const PieChartComponent: React.FC = () => {
//   const dispatch = useDispatch();

//   useEffect(() => {
//     dispatch(fetchUserPieChartData() as any);
//   }, [dispatch]);

//   const pieData = useSelector((state: RootState) => state.fetchUserPieChart.userpiedata);

//   // console.log('Business Bifurcation:', pieData);

//   const formattedPieData: PieDataItem[] = pieData?.map((item: any) => ({
//     name: item.vertical,
//     value: item.total_vertical_amount,
//   })) || [];

//   const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#f408b5'];

//   return (
//     <div className={styles.Container}>
//        <p className={styles.head}>Business Bifurcation</p>
//        <div className={styles.Wrapper}>
//       <div style={{ width: '100%', maxWidth: '500px' }}> {/* Ensures max width */}
//         <ResponsiveContainer width="100%" height={300} minWidth={380}>
//           <PieChart>
//             <Pie
//               data={formattedPieData}
//               cx="50%"
//               cy="50%"
//               outerRadius={100}
//               innerRadius={60}
//               fill="#8884d8"
//               dataKey="value"
//               labelLine
//               label={({ name, value, cx, cy, midAngle, index }) => {
//                 const RADIAN = Math.PI / 180;
//                 const x = cx + Math.cos(-midAngle * RADIAN) * 130;
//                 const y = cy + Math.sin(-midAngle * RADIAN) * 130;
//                 const textColor = COLORS[index % COLORS.length]; // Get color based on index
              
//                 return (
//                   <text
//                     x={x}
//                     y={y}
//                     fill={textColor} // Set text color same as pie slice
//                     textAnchor={x > cx ? 'start' : 'end'}
//                     dominantBaseline="central"
//                     fontSize={10}
//                     fontWeight="bold"
//                     className={styles.text}
//                   >
//                     <tspan x={x} dy="-5">{(value/ 1_000_000).toFixed(3)}M</tspan> 
//                     <tspan x={x} dy="15">{name}</tspan> {/* Name below */}
//                   </text>
//                 );
//               }}
              
//             >
//               {formattedPieData.map((entry, index) => (
//                 <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//               ))}
//             </Pie>
//             <Tooltip formatter={(value: any) => `${Number(value).toFixed(0)}`} />
//           </PieChart>
//         </ResponsiveContainer>
//       </div>
//       </div>
//     </div>
//   );
// };

// export default PieChartComponent;


// import React, { useEffect } from 'react';
// import { ResponsiveContainer, Tooltip, PieChart, Pie, Cell } from 'recharts';
// import { useDispatch, useSelector } from 'react-redux';
// import type { RootState } from '../../../app/store';
// import { fetchUserPieChartData } from './slice/piechart';
// import styles from './Piechart.module.css';

// interface PieDataItem {
//   name: string;
//   value: number;
// }

// /* Refined corporate palette — indigo → cyan → emerald → amber → rose */
// const COLORS = ['#4F46E5', '#06B6D4', '#10B981', '#F59E0B', '#F43F5E'];

// /* Custom Tooltip */
// const CustomTooltip = ({ active, payload }: any) => {
//   if (!active || !payload?.length) return null;
//   const item = payload[0];
//   return (
//     <div style={{
//       background: '#fff',
//       border: '1px solid #E2E8F0',
//       borderRadius: 10,
//       padding: '10px 14px',
//       boxShadow: '0 4px 16px rgba(15,23,42,0.10)',
//       fontFamily: "'DM Sans', system-ui, sans-serif",
//     }}>
//       <p style={{ fontSize: 12, fontWeight: 600, color: '#0F172A', marginBottom: 4 }}>{item.name}</p>
//       <p style={{ fontSize: 12, color: item.payload.fill }}>
//         ₹{(Number(item.value) / 1_000_000).toFixed(3)}M
//       </p>
//     </div>
//   );
// };

// const PieChartComponent: React.FC = () => {
//   const dispatch = useDispatch();

//   useEffect(() => {
//     dispatch(fetchUserPieChartData() as any);
//   }, [dispatch]);

//   const pieData = useSelector((state: RootState) => state.fetchUserPieChart.userpiedata);

//   const formattedPieData: PieDataItem[] = pieData?.map((item: any) => ({
//     name: item.vertical,
//     value: item.total_vertical_amount,
//   })) || [];

//   return (
//     <div className={styles.Container}>
//       <div className={styles.Wrapper}>
//         <ResponsiveContainer width="100%" height={270} minWidth={240}>
//           <PieChart>
//             <Pie
//               data={formattedPieData}
//               cx="50%"
//               cy="50%"
//               outerRadius={90}
//               innerRadius={52}
//               dataKey="value"
//               strokeWidth={2}
//               stroke="#F8FAFC"
//               labelLine={false}
//               label={({ name, value, cx, cy, midAngle, outerRadius: or, index }) => {
//                 const RADIAN = Math.PI / 180;
//                 const radius = or + 22;
//                 const x = cx + Math.cos(-midAngle * RADIAN) * radius;
//                 const y = cy + Math.sin(-midAngle * RADIAN) * radius;
//                 return (
//                   <text
//                     x={x}
//                     y={y}
//                     fill={COLORS[index % COLORS.length]}
//                     textAnchor={x > cx ? 'start' : 'end'}
//                     dominantBaseline="central"
//                     fontSize={10}
//                     fontWeight={600}
//                     fontFamily="'DM Sans', system-ui"
//                   >
//                     <tspan x={x} dy="-5">{(value / 1_000_000).toFixed(2)}M</tspan>
//                     <tspan x={x} dy="14">{name}</tspan>
//                   </text>
//                 );
//               }}
//             >
//               {formattedPieData.map((entry, index) => (
//                 <Cell
//                   key={`cell-${index}`}
//                   fill={COLORS[index % COLORS.length]}
//                 />
//               ))}
//             </Pie>
//             <Tooltip content={<CustomTooltip />} />
//           </PieChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// };

// export default PieChartComponent;


// import React, { useEffect } from 'react';
// import { ResponsiveContainer, Tooltip, PieChart, Pie, Cell } from 'recharts';
// import { useDispatch, useSelector } from 'react-redux';
// import type { RootState } from '../../../app/store';
// import { fetchUserPieChartData } from './slice/piechart';
// import styles from './Piechart.module.css';

// interface PieDataItem {
//   name: string;
//   value: number;
// }

// const COLORS = ['#4F46E5', '#06B6D4', '#10B981', '#F59E0B', '#F43F5E'];

// const CustomTooltip = ({ active, payload }: any) => {
//   if (!active || !payload?.length) return null;
//   const item = payload[0];
//   return (
//     <div
//       style={{
//         background: '#fff',
//         border: '1px solid #E2E8F0',
//         borderRadius: 10,
//         padding: '10px 14px',
//         boxShadow: '0 4px 16px rgba(15,23,42,0.10)',
//         fontFamily: "'DM Sans', system-ui, sans-serif",
//       }}
//     >
//       <p style={{ fontSize: 12, fontWeight: 600, color: '#0F172A', marginBottom: 4 }}>
//         {item.name}
//       </p>
//       <p style={{ fontSize: 12, color: item.payload.fill }}>
//         ₹{(Number(item.value) / 1_000_000).toFixed(3)}M
//       </p>
//     </div>
//   );
// };

// const PieChartComponent: React.FC = () => {
//   const dispatch = useDispatch();

//   useEffect(() => {
//     dispatch(fetchUserPieChartData() as any);
//   }, [dispatch]);

//   const { userpiedata, loading, error } = useSelector(
//     (state: RootState) => state.fetchUserPieChart
//   );

//   // Safety guard: ensure it's always an array before mapping
//   const safeData = Array.isArray(userpiedata) ? userpiedata : [];

//   const formattedPieData: PieDataItem[] = safeData.map((item) => ({
//     name: item.vertical,
//     value: item.total_vertical_amount,
//   }));

//   if (loading) {
//     return (
//       <div className={styles.Container}>
//         <div className={styles.Wrapper} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 270 }}>
//           <p style={{ color: '#94A3B8', fontFamily: "'DM Sans', system-ui", fontSize: 14 }}>
//             Loading...
//           </p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className={styles.Container}>
//         <div className={styles.Wrapper} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 270 }}>
//           <p style={{ color: '#F43F5E', fontFamily: "'DM Sans', system-ui", fontSize: 14 }}>
//             Failed to load chart data.
//           </p>
//         </div>
//       </div>
//     );
//   }

//   if (formattedPieData.length === 0) {
//     return (
//       <div className={styles.Container}>
//         <div className={styles.Wrapper} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 270 }}>
//           <p style={{ color: '#94A3B8', fontFamily: "'DM Sans', system-ui", fontSize: 14 }}>
//             No data available.
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className={styles.Container}>
//       <div className={styles.Wrapper}>
//         <ResponsiveContainer width="100%" height={270} minWidth={240}>
//           <PieChart>
//             <Pie
//               data={formattedPieData}
//               cx="50%"
//               cy="50%"
//               outerRadius={90}
//               innerRadius={52}
//               dataKey="value"
//               strokeWidth={2}
//               stroke="#F8FAFC"
//               labelLine={false}
//               label={({
//                 name,
//                 value,
//                 cx,
//                 cy,
//                 midAngle,
//                 outerRadius: or,
//                 index,
//               }) => {
//                 const RADIAN = Math.PI / 180;
//                 const radius = or + 22;
//                 const x = cx + Math.cos(-midAngle * RADIAN) * radius;
//                 const y = cy + Math.sin(-midAngle * RADIAN) * radius;
//                 return (
//                   <text
//                     x={x}
//                     y={y}
//                     fill={COLORS[index % COLORS.length]}
//                     textAnchor={x > cx ? 'start' : 'end'}
//                     dominantBaseline="central"
//                     fontSize={10}
//                     fontWeight={600}
//                     fontFamily="'DM Sans', system-ui"
//                   >
//                     <tspan x={x} dy="-5">
//                       {(value / 1_000_000).toFixed(2)}M
//                     </tspan>
//                     <tspan x={x} dy="14">
//                       {name}
//                     </tspan>
//                   </text>
//                 );
//               }}
//             >
//               {formattedPieData.map((entry, index) => (
//                 <Cell
//                   key={`cell-${index}`}
//                   fill={COLORS[index % COLORS.length]}
//                 />
//               ))}
//             </Pie>
//             <Tooltip content={<CustomTooltip />} />
//           </PieChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// };

// export default PieChartComponent;


import React, { useEffect } from 'react';
import { ResponsiveContainer, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../../app/store';
import { fetchUserPieChartData } from './slice/piechart';
import styles from './Piechart.module.css';

interface PieDataItem {
  name:  string;
  value: number;
}

const COLORS = ['#4F46E5','#06B6D4','#10B981','#F59E0B','#F43F5E'];

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  return (
    <div style={{
      background:'#fff', border:'1px solid #E2E8F0',
      borderRadius:10, padding:'10px 14px',
      boxShadow:'0 4px 16px rgba(15,23,42,0.10)',
      fontFamily:"'DM Sans', system-ui, sans-serif",
    }}>
      <p style={{ fontSize:12, fontWeight:600, color:'#0F172A', marginBottom:4 }}>
        {item.name}
      </p>
      <p style={{ fontSize:12, color:item.payload.fill }}>
        ₹{(Number(item.value) / 1_000_000).toFixed(3)}M
      </p>
    </div>
  );
};

const PieChartComponent: React.FC = () => {
  const dispatch = useDispatch<any>();

  // ── Read globalFilter ──────────────────────────────────────
  const { selectedYear, selectedMonth, filterType } = useSelector(
    (s: RootState) => s.globalFilter
  );

  const { userpiedata, loading, error } = useSelector(
    (state: RootState) => state.fetchUserPieChart
  );

  // ✅ Re-fetch when filter changes
  useEffect(() => {
    dispatch(fetchUserPieChartData());
  }, [dispatch, selectedYear, selectedMonth, filterType]);

  const safeData = Array.isArray(userpiedata) ? userpiedata : [];

  const formattedPieData: PieDataItem[] = safeData.map((item) => ({
    name:  item.vertical,
    value: item.total_vertical_amount,
  }));

  if (loading) {
    return (
      <div className={styles.Container}>
        <div className={styles.Wrapper} style={{ display:'flex', alignItems:'center', justifyContent:'center', height:270 }}>
          <p style={{ color:'#94A3B8', fontFamily:"'DM Sans', system-ui", fontSize:14 }}>Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.Container}>
        <div className={styles.Wrapper} style={{ display:'flex', alignItems:'center', justifyContent:'center', height:270 }}>
          <p style={{ color:'#F43F5E', fontFamily:"'DM Sans', system-ui", fontSize:14 }}>Failed to load chart data.</p>
        </div>
      </div>
    );
  }

  if (formattedPieData.length === 0) {
    return (
      <div className={styles.Container}>
        <div className={styles.Wrapper} style={{ display:'flex', alignItems:'center', justifyContent:'center', height:270 }}>
          <p style={{ color:'#94A3B8', fontFamily:"'DM Sans', system-ui", fontSize:14 }}>No data available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.Container}>
      <div className={styles.Wrapper}>
        <ResponsiveContainer width="100%" height={270} minWidth={240}>
          <PieChart>
            <Pie
              data={formattedPieData}
              cx="50%" cy="50%"
              outerRadius={90} innerRadius={52}
              dataKey="value" strokeWidth={2} stroke="#F8FAFC"
              labelLine={false}
              label={({ name, value, cx, cy, midAngle, outerRadius: or, index }) => {
                const RADIAN = Math.PI / 180;
                const radius = or + 22;
                const x = cx + Math.cos(-midAngle * RADIAN) * radius;
                const y = cy + Math.sin(-midAngle * RADIAN) * radius;
                return (
                  <text x={x} y={y}
                    fill={COLORS[index % COLORS.length]}
                    textAnchor={x > cx ? 'start' : 'end'}
                    dominantBaseline="central"
                    fontSize={10} fontWeight={600}
                    fontFamily="'DM Sans', system-ui"
                  >
                    <tspan x={x} dy="-5">{(value / 1_000_000).toFixed(2)}M</tspan>
                    <tspan x={x} dy="14">{name}</tspan>
                  </text>
                );
              }}
            >
              {formattedPieData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PieChartComponent;