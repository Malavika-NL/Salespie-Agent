import React from 'react';
import { PieChart, Pie, Cell, LabelList, Tooltip } from 'recharts';
import styles from './SummaryOverview.module.css'; // Import corresponding CSS file

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']; // Example colors

// Dummy data for the PieChart
const formattedPieData = [
  { name: 'Category A', value: 40 },
  { name: 'Category B', value: 30 },
  { name: 'Category C', value: 20 },
  { name: 'Category D', value: 10 },
];

const SummaryOverview: React.FC = () => {
  return (
    <div className={styles.summaryOverview}>
         <div className={styles.head}>
         Summary Overview
        </div>
        <hr className={styles.separator} />
      <div className={styles.barChartContainer}>
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
              formatter={(value: any) => `${Number(value).toFixed(0)}`} // Display whole number
              fill="#fff"
            />
          </Pie>
          <Tooltip formatter={(value: any) => `${Number(value).toFixed(0)}`} />
        </PieChart>
      </div>
    </div>
  );
};

export default SummaryOverview;
