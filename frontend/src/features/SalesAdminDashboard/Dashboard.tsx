import React, { useEffect, useState } from 'react';
import styles from './dash.module.css'; // Import CSS module for styling

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, FunnelChart, Funnel, LabelList, PieChart, Pie, Cell, Trapezoid } from 'recharts';

import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminOpportunityCategoryTotalData } from './slice/opportunityCategoryTotal';
import { adminOpportunityFormData } from '../OpportunityAdminTable/slice/opportunityTableSlice';
import { useNavigate } from 'react-router-dom';
import { fetchSpeedometerData } from './slice/speedometer';
import type { RootState } from '../../app/store';
import ReactSpeedometer from 'react-d3-speedometer';
// import { fetchFunnelGraphData } from './FunnelGraph/slice/funnelgraph';
// import { fetchPieChartData } from './PieChart/slice/AdminPieChart';
import { fetchMonthWiseBudgetData } from './MonthWiseBudget/monthWiseBudget';



const funnelData = [
  { value: 125, sub_value: 100, name: 'Rank E', fill: '#a4de6c', actualValue: 200 }, // Narrowest part at the bottom
  { value: 100, sub_value: 100, name: 'Rank D', fill: '#8884d8', actualValue: 200 }, // Top of the triangle
  { value: 75, sub_value: 100, name: 'Rank C', fill: '#83a6ed', actualValue: 200 },
  { value: 50, sub_value: 100, name: 'Rank B', fill: '#8dd1e1', actualValue: 200 },
  { value: 25, sub_value: 100, name: 'Rank A', fill: '#82ca9d', actualValue: 200 },

];



const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#f408b5'];



const renderCustomShape = (props: any) => {
  const { fill, x, y, upperWidth, lowerWidth, height, index, payload } = props;
  const adjustedLowerWidth = index === funnelData.length - 1 ? upperWidth * 0.6 : lowerWidth;

  return (
    <Trapezoid
      fill={fill}
      x={x}
      y={y}
      upperWidth={upperWidth}
      lowerWidth={adjustedLowerWidth}
      height={height}
    />
  );
};

const Dashboard: React.FC = () => {

  const dispatch = useDispatch();
  const [barChartData, setBarChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await dispatch(fetchAdminOpportunityCategoryTotalData() as any);
      const OpportunityCategoryTotalData = result.payload; // Access payload data

      if (OpportunityCategoryTotalData && Array.isArray(OpportunityCategoryTotalData.labels) && Array.isArray(OpportunityCategoryTotalData.totals)) {
        const { labels, totals } = OpportunityCategoryTotalData;

        // Map labels and totals into the desired format
        const transformedData = labels.map((label: string, index: number) => ({
          name: label,
          Total: totals[index], // 'pv' is the bar chart data key
        }));

        setBarChartData(transformedData);
      }
    };

    fetchData();
  }, [dispatch]);

  const [tableData, setTableData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await dispatch(adminOpportunityFormData() as any);
      const alldata = Array.isArray(result.payload)
        ? result.payload
        : Array.isArray(result.payload?.data)
          ? result.payload.data
          : []; // Access the payload from the thunk action
      console.log(alldata);

      // Transform the data to match table structure
      const formattedData = alldata.map((item: any, index: number) => ({
        no: index + 1,
        orderDate: item.exp_closure_date,
        productName: item.opportunity,
        customer: item.account_name,
        totalAmount: item.total_amount,
        status: item.status,
        id: item.id,
      }));

      setTableData(formattedData);
    };

    fetchData();
  }, [dispatch]);


  useEffect(() => {
    dispatch(fetchSpeedometerData() as any);
  }, [dispatch]);

  const data = useSelector((state: RootState) => state.fetchSpeedometerData);

  // Access the total_sum and calculate the percentage for the speedometer
  const totalSum = data.piedata?.total_sum || 0;
  const gaugePercent = Math.min(totalSum / 1000, 1); // Cap at 1 (100%)


  // useEffect(() => {
  //   dispatch(fetchFunnelGraphData() as any);
  // }, [dispatch]);

  // const funnelGraphdata = useSelector((state: RootState) => state.fetchFunnelGraphData);
  // console.log('funnelGraphdata : ', funnelGraphdata)


  //piechart 
  interface PieDataItem {
    name: string;
    value: number; // Percentage value for the pie chart
  } 
  //  useEffect(() => {
  //   dispatch(fetchPieChartData() as any);
  // }, [dispatch]);

  // const pieData = useSelector((state: RootState) => state.fetchPieChartData.piedata);
  // console.log('piedata:', pieData);

  // Use the regular value (total_vertical_amount)
  // const formattedPieData: PieDataItem[] = pieData.map((item: any) => ({
  //   name: item.vertical,
  //   value: item.total_vertical_amount, // Use total_vertical_amount as the value
  // }));



  //month wise budget data




  // const [selectedPeriod, setSelectedPeriod] = useState('yearly');
  const budgetData = useSelector((state: RootState) => state.fetchMonthWiseBudgetData.budgetdata);

  // Fetch data when component mounts
  useEffect(() => {
    dispatch(fetchMonthWiseBudgetData() as any);
  }, [dispatch]);


  const safeBudgetData = Array.isArray(budgetData) ? budgetData : [];
  const filteredBudgetData = safeBudgetData.map((entry: any) => ({
    name: new Date(entry.month).toLocaleString('default', { month: 'short' }), // Format month as 'Jan', 'Feb', etc.
    Expected: 100,
    Collected: entry.total_amount,
  }));



  const [selectedPeriod, setSelectedPeriod] = useState('yearly');
  const [filteredData, setFilteredData] = useState(filteredBudgetData);

  useEffect(() => {
    const currentMonthIndex = new Date().getMonth();
    if (filteredBudgetData && filteredBudgetData.length > 0) {
      setFilteredData(filteredBudgetData.slice(0, currentMonthIndex + 1));
    }
  }, [budgetData]);

  const handlePeriodChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const period = event.target.value;
    setSelectedPeriod(period);

    // Get the current month index (0 for January, 11 for December)
    const currentMonthIndex = new Date().getMonth();

    if (period === 'yearly') {
      setFilteredData(filteredBudgetData.slice(0, currentMonthIndex + 1)); // All months up to current
    } else if (period === 'half-yearly') {
      setFilteredData(filteredBudgetData.slice(Math.max(currentMonthIndex - 5, 0), currentMonthIndex + 1)); // Last 6 months
    } else if (period === 'quarterly') {
      setFilteredData(filteredBudgetData.slice(Math.max(currentMonthIndex - 2, 0), currentMonthIndex + 1)); // Last 3 months
    }
  };

  const navigate = useNavigate();
  const handleEditClick = (id: string) => {
    navigate(`/editopportunitystatus/${id}`);
  };


  return (
    <>
      {/* <div className={styles.dashboardWrapper}>
        <div className={styles.dashboardContainer}>
          <div className={styles.containerTop}>
            <div className={styles.box1}>
              <div className={styles.boxContent}>
                <span className={styles.title}>New Customer</span>
                <span className={styles.number}>68</span>
                <span className={styles.subtext}>10% <span className={styles.spacing}>| This month</span></span>
              </div>
            </div>
            <div className={styles.box2}>
              <div className={styles.boxContent}>
                <span className={styles.title}>Running Orders</span>
                <span className={styles.number}>501</span>
                <span className={styles.subtext}>10% <span className={styles.spacing}>| This month</span></span>
              </div>
            </div>
          </div>

          <div className={styles.containerBottom}>
            <div className={styles.box3}>
              <div className={styles.boxContent}>
                <span className={styles.title}>Total Profit</span>
                <span className={styles.number}>$8.546</span>
                <span className={styles.subtext}>10% <span className={styles.spacing}>| This month</span></span>
              </div>
            </div>
            <div className={styles.box4}>
              <div className={styles.boxContent}>
                <span className={styles.title}>Order Completed</span>
                <span className={styles.number}>1,400</span>
                <span className={styles.subtext}>10% <span className={styles.spacing}>| This month</span></span>
              </div>
            </div>
          </div>
        </div>


        <div className={styles.middleContainer}>
          <div className={styles.box5}>
            <div className={styles.barChartContainer}>
              <h4>Category Wise Opportunity</h4>
              <BarChart
                width={400}
                height={300}
                data={barChartData}
                layout="vertical"
                // margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                className={styles.barchart}
              >
                <CartesianGrid strokeDasharray="1" />
                <XAxis type="number" orientation="top" />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip />
                <Legend />
                <Bar dataKey="Total" fill="#8884d8">

                </Bar>
              </BarChart>
            </div>
          </div>


          <div className={styles.box6}>
            <div className={styles.speedometer}>
              <h4>Speedometer</h4>
              <ReactSpeedometer
                value={totalSum}
                maxValue={500}
                needleColor="#5BE12C"
                startColor="#EA4228"

                endColor="#5BE12C"
                segments={5}
                // segmentColors={['#000']}
                // segmentColors={["linear-gradient(to right, #41295a, #2f0743)"]} 
                width={350}              
                height={200}               
                needleTransitionDuration={400}  
              
                needleHeightRatio={0.8}
                ringWidth={25}
              />
            </div>

          </div>
          <div className={styles.box7}>
            <div className={styles.barChartContainer}>
              <h4>Funnel Graph</h4>
              <FunnelChart width={350} height={300}>
                <Tooltip />
                <Funnel dataKey="value" data={funnelData} isAnimationActive={false} shape={renderCustomShape}>
                  <LabelList position="right" fill="#000" stroke="none" dataKey="name" />
                </Funnel>
              </FunnelChart>
            </div>
          </div>
        </div>


        <div className={styles.middleContainer}>
          <div className={styles.box8}>
            <div className={styles.barChartContainer}>
              <h4>Business Bifurcation </h4>
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
                    formatter={(value: any) => `${Number(value).toFixed(0)}`} // Display the regular number (no decimal)
                    fill="#fff"
                  />
                </Pie>
                <LabelList dataKey="name" position="outside" fill="#333" />
                <Tooltip formatter={(value: any) => `${Number(value).toFixed(0)}`} /> 
              </PieChart>
            </div>
          </div>

          <div className={styles.box9}>
            <div className={styles.barChartContainer}>
              <h4>Month Wise Budget vs Sales</h4>


              <select value={selectedPeriod} onChange={handlePeriodChange} className={styles.select}>
                <option value="yearly">Yearly</option>
                <option value="half-yearly">Half Yearly</option>
                <option value="quarterly">Quarterly</option>
              </select>


              <BarChart
                width={800}
                height={300}
                data={filteredData}
                layout="horizontal"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" type="category" />
                <YAxis type="number" />
                <Tooltip />
                <Legend />
                <Bar dataKey="Expected" fill="#8884d8" />
                <Bar dataKey="Collected" fill="#82ca9d" />
              </BarChart>
            </div>
          </div>
        </div>

        <div className={styles.dashboardContainer}>
          <div className={styles.boxFull}>
            <div className={styles.barChartContainer}>
              <h4>Opportunity Status</h4>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Order Date</th>
                    <th>Product Name</th>
                    <th>Customer</th>
                    <th>Total Amount</th>
                    <th>Status</th>
                    <th>Action</th>

                  </tr>
                </thead>
                <tbody>
                  {tableData.map((item, index) => (
                    <tr key={index}>
                      <td>{item.no}</td>
                      <td>{item.orderDate}</td>
                      <td>{item.productName}</td>
                      <td>{item.customer}</td>
                      <td>{item.totalAmount}</td>
                      <td>{item.status}</td>

                      <td>
                        <button className={styles.actionButton} onClick={() => handleEditClick(item.id)}>Edit</button>
                        <button className={styles.actionButton}>Delete</button>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div> */}

      <div className={styles.mainContent}>
        <div className={styles.dashboardContainer}>


          <div className={styles.box1}>

            <span className={styles.title}>New Customer</span>
            <span className={styles.number}>68</span>
            <span className={styles.subtext}>10% <span className={styles.spacing}>| This month</span></span>

          </div>
          <div className={styles.box2}>

            <span className={styles.title}>Running Orders</span>
            <span className={styles.number}>501</span>
            <span className={styles.subtext}>10% <span className={styles.spacing}>| This month</span></span>

          </div>



          <div className={styles.box3}>

            <span className={styles.title}>Total Profit</span>
            <span className={styles.number}>$8.546</span>
            <span className={styles.subtext}>10% <span className={styles.spacing}>| This month</span></span>

          </div>
          <div className={styles.box4}>

            <span className={styles.title}>Order Completed</span>
            <span className={styles.number}>1,400</span>
            <span className={styles.subtext}>10% <span className={styles.spacing}>| This month</span></span>

          </div>


        </div>

        <div className={styles.middleContainer}>
          <div className={styles.box5}>
            <div className={styles.barChartContainer}>
              <h4>Category Wise Opportunity</h4>
              <BarChart
                width={400}
                height={300}
                data={barChartData}
                layout="vertical"
                // margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                className={styles.barchart}
              >
                <CartesianGrid strokeDasharray="1" />
                <XAxis type="number" orientation="top" />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip />
                <Legend />
                <Bar dataKey="Total" fill="#8884d8">

                </Bar>
              </BarChart>
            </div>
          </div>


          <div className={styles.box6}>
            <div className={styles.speedometer}>
              <h4>Speedometer</h4>
              <ReactSpeedometer
                value={totalSum}
                maxValue={500}
                needleColor="#5BE12C"
                startColor="#EA4228"

                endColor="#5BE12C"
                segments={5}
                // segmentColors={['#000']}
                // segmentColors={["linear-gradient(to right, #41295a, #2f0743)"]} 
                width={350}
                height={200}
                needleTransitionDuration={400}

                needleHeightRatio={0.8}
                ringWidth={25}
              />
            </div>

          </div>
          <div className={styles.box7}>
            <div className={styles.barChartContainer}>
              <h4>Funnel Graph</h4>
              <FunnelChart width={350} height={300}>
                <Tooltip />
                <Funnel dataKey="value" data={funnelData} isAnimationActive={false} shape={renderCustomShape}>
                  <LabelList position="right" fill="#000" stroke="none" dataKey="name" />
                </Funnel>
              </FunnelChart>
            </div>
          </div>
        </div>


        <div className={styles.middleContainer}>
          {/* <div className={styles.box8}>
            <div className={styles.barChartContainer}>
              <h4>Business Bifurcation </h4>
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
                <LabelList dataKey="name" position="outside" fill="#333" />
                <Tooltip formatter={(value: any) => `${Number(value).toFixed(0)}`} />
              </PieChart>
            </div>
          </div> */}

          <div className={styles.box9}>
            <div className={styles.barChartContainer}>
              <h4>Month Wise Budget vs Sales</h4>


              <select value={selectedPeriod} onChange={handlePeriodChange} className={styles.select}>
                <option value="yearly">Yearly</option>
                <option value="half-yearly">Half Yearly</option>
                <option value="quarterly">Quarterly</option>
              </select>


              <BarChart
                width={800}
                height={300}
                data={filteredData}
                layout="horizontal"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" type="category" />
                <YAxis type="number" />
                <Tooltip />
                <Legend />
                <Bar dataKey="Expected" fill="#8884d8" />
                <Bar dataKey="Collected" fill="#82ca9d" />
              </BarChart>
            </div>
          </div>
        </div>

        <div className={styles.opportunitystatus}>
          <div className={styles.boxFull}>
            <div className={styles.barChartContainer}>
              <h4>Opportunity Status</h4>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Order Date</th>
                    <th>Product Name</th>
                    <th>Customer</th>
                    <th>Total Amount</th>
                    <th>Status</th>
                    <th>Action</th>

                  </tr>
                </thead>
                <tbody>
                  {tableData.map((item, index) => (
                    <tr key={index}>
                      <td>{item.no}</td>
                      <td>{item.orderDate}</td>
                      <td>{item.productName}</td>
                      <td>{item.customer}</td>
                      <td>{item.totalAmount}</td>
                      <td>{item.status}</td>

                      <td>
                        <button className={styles.actionButton} onClick={() => handleEditClick(item.id)}>Edit</button>
                        <button className={styles.actionButton}>Delete</button>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>


      </div>
    </>
  );
};

export default Dashboard;
