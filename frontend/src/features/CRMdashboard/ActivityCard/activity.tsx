import React from "react";
import { PieChart } from "react-minimal-pie-chart";
import styles from "./activity.module.css";

const Activity: React.FC = () => {
  return (
    <div className={styles.activity}>
      <div className={styles.h2}>Activity Sheet</div>

      <div style={{ position: "relative", width: "200px", height: "200px" }}>
      {/* Pie Chart */}
      <PieChart
        data={[
          { title: "Launch", value: 20, color: "#57AFBB" },
          { title: "Pending", value: 20, color: "#914B70" },
          { title: "Schedule", value: 20, color: "#455996" },
          { title: "Completed", value: 20, color: "#56B93C" },
          { title: "Plan", value: 20, color: "#D74E4E" },
        ]}
        style={{ width: "100%", height: "100%" }}
        radius={50}  // Shrinks the chart
        lineWidth={55}  // Adjusts thickness of slices
        paddingAngle={10}
        label={({ dataEntry }) => dataEntry.title} // Show section labels
        labelStyle={{
          fontSize: "5px",
          fontWeight: "bold",
          fill: "#fff",
        }}
        labelPosition={70}
      />

      {/* Center Text */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          fontSize: "14px",
          fontWeight: "bold",
          color: "#000",
          textAlign: "center",
          background: "white",
          borderRadius: "50%",
          padding: "10px",
        }}
      >
        CRM
      </div>
    </div>
    </div>
  );
};

export default Activity;


// import React from 'react';
// import ReactApexChart from 'react-apexcharts';
// import styles from './activity.module.css'; // Import CSS module
// import { ApexOptions } from 'apexcharts'; // Import ApexOptions type

// interface ActivityState {
//   series: number[];
//   options: ApexOptions;
// }

// class Activity extends React.Component<{}, ActivityState> {
//   constructor(props: {}) {
//     super(props);

//     this.state = {
//       series: [25, 25, 25, 25, 25],
//       options: {
//         chart: {
//           type: 'donut' as 'donut', // Use 'donut' directly to match type
//         },
//         labels: ['Launch', 'Schedule', 'Plan', 'Pending', 'Completed'],
//         responsive: [{
//           breakpoint: 480,
//           options: {
//             chart: {
//               width: 200,
//             },
//             legend: {
//               position: 'bottom',
//             },
//           },
//         }],
//         legend: {
//           position: 'right',
//           horizontalAlign: 'center',
//         },
//         plotOptions: {
//           pie: {
//             donut: {
//               size: '50%',
//               background: 'transparent',
//             },
//           },
//         },
//         dataLabels: {
//           enabled: true,
//           formatter: (value: number, { dataPointIndex }: { dataPointIndex: number }) => {
//             const labels = [125, 5, 6, 2, 3]; // Your desired values
//             return labels[dataPointIndex];
//           },
//           style: {
//             fontSize: '12px',
//             fontWeight: 'bold',
//             colors: ['#000'],
//           },
//           dropShadow: {
//             enabled: true,
//             top: 1,
//             left: 1,
//             blur: 1,
//             opacity: 0.75,
//           },
//         },
//       },
//     };
//   }

//   render() {
//     return (
//       <div className={styles.activity}>
//         <div className={styles.chartContainer}>
//           <ReactApexChart options={this.state.options} series={this.state.series} type="donut" />
//         </div>
//       </div>
//     );
//   }
// }

// export default Activity;
