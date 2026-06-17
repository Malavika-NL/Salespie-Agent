// import React, { useEffect } from 'react';
// import { PieChart, Pie, Cell, LabelList, Tooltip } from 'recharts';
// import styles from './SummaryOverview.module.css'; // Import corresponding CSS file
// import { useDispatch, useSelector } from 'react-redux';
// import type { RootState } from '../../../../app/store';
// import { useNavigate, useParams } from 'react-router-dom';
// import { editAccountWorkspaceFetchUserById } from '../../Slice/EditAccountWorkspaceSlice';

// const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']; // Example colors

// // Dummy data for the PieChart
// const formattedPieData = [
//   { name: 'Category A', value: 40 },
//   { name: 'Category B', value: 30 },
//   { name: 'Category C', value: 20 },
//   { name: 'Category D', value: 10 },
// ];

// const SummaryOverview: React.FC = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { id } = useParams<{ id: string }>();
//   const { loading, data, error, formData } = useSelector(
//     (state: RootState) => state.AccountWorkspaceEditFormData
//   );

//   useEffect(() => {
    
  
//       if (id) {
//        const respone= dispatch(editAccountWorkspaceFetchUserById(id) as any);
//        console.log('response from get',respone)
//       }
//     }, [dispatch, id]);

// console.log('form data for edit form ',formData)
//   return (
//     <div className={styles.summaryOverview}>
//          <div className={styles.head}>
//          Summary Overview
//         </div>
//         <hr className={styles.separator} />
//       <div className={styles.barChartContainer}>
//         <PieChart width={300} height={300}>
//           <Pie
//             data={formattedPieData}
//             cx={150}
//             cy={150}
//             outerRadius={100}
//             innerRadius={60}
//             fill="#8884d8"
//             dataKey="value"
//             labelLine={false}
//           >
//             {formattedPieData.map((entry, index) => (
//               <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//             ))}
//             <LabelList
//               dataKey="value"
//               position="inside"
//               formatter={(value: any) => `${Number(value).toFixed(0)}`} // Display whole number
//               fill="#fff"
//             />
//           </Pie>
//           <Tooltip formatter={(value: any) => `${Number(value).toFixed(0)}`} />
//         </PieChart>
//       </div>
//     </div>
//   );
// };

// export default SummaryOverview;







import React, { useEffect } from 'react';
import { PieChart, Pie, Cell, LabelList, Tooltip } from 'recharts';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../../../app/store';
import { useNavigate, useParams } from 'react-router-dom';
import { editAccountWorkspaceFetchUserById } from '../../Slice/EditAccountWorkspaceSlice';
import { LayoutDashboard } from 'lucide-react';

// ─── Constants ────────────────────────────────────────────────────────────────

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const formattedPieData = [
  { name: 'Category A', value: 40 },
  { name: 'Category B', value: 30 },
  { name: 'Category C', value: 20 },
  { name: 'Category D', value: 10 },
];

// ─── Component ────────────────────────────────────────────────────────────────

const SummaryOverview: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const { loading, data, error, formData } = useSelector(
    (state: RootState) => state.AccountWorkspaceEditFormData
  );

  useEffect(() => {
    if (id) {
      const respone = dispatch(editAccountWorkspaceFetchUserById(id) as any);
      console.log('response from get', respone);
    }
  }, [dispatch, id]);

  console.log('form data for edit form ', formData);

  return (
    <div className="rounded-2xl border-2 border-indigo-100 shadow-lg overflow-hidden h-full flex flex-col">

      {/* Gradient Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-500 px-5 py-3 flex items-center gap-2">
        <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center">
          <LayoutDashboard size={15} color="white" />
        </div>
        <h2 className="text-sm font-bold text-white tracking-wide">Summary Overview</h2>
      </div>

      {/* Chart Body */}
      <div className="bg-white px-5 py-4 flex flex-col items-center gap-3 flex-1">

        <div className="flex items-center justify-center">
          <PieChart width={300} height={300}>
            <Pie
              data={formattedPieData}
              cx={150}
              cy={150}
              outerRadius={100}
              innerRadius={60}
              fill="#8884d8"
              dataKey="value"
              labelLine={false}
            >
              {formattedPieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
              <LabelList
                dataKey="value"
                position="inside"
                formatter={(value: any) => `${Number(value).toFixed(0)}`}
                fill="#fff"
              />
            </Pie>
            <Tooltip formatter={(value: any) => `${Number(value).toFixed(0)}`} />
          </PieChart>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 pb-2">
          {formattedPieData.map((entry, index) => (
            <div key={entry.name} className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
              <span className="text-xs font-medium text-slate-600">{entry.name}</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default SummaryOverview;
