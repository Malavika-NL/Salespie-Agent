import React, { useEffect, useState } from 'react';
import styles from './dash.module.css'; // Import CSS module for styling
import GaugeChart from 'react-gauge-chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, FunnelChart, Funnel, LabelList, PieChart, Pie, Cell, Trapezoid } from 'recharts';
import Sidebar from '../AdminDashboard/components/sidebar/sidebar';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOpportunityCategoryTotalData } from './Category Wise opportunity/slice/opportunityCategoryTotal';
import { adminOpportunityFormData } from '../OpportunityAdminTable/slice/opportunityTableSlice';
import { useNavigate } from 'react-router-dom';
import { fetchSpeedometerData } from './slice/speedometer';
import type { RootState } from '../../app/store';
import ReactSpeedometer from 'react-d3-speedometer';
import { fetchFunnelGraphData } from './FunnelGraph/slice/funnelgraph';
import { fetchUserPieChartData } from './PieChart/slice/piechart';
import { fetchMonthWiseBudgetData } from './MonthWiseBudget/slice/monthWiseBudget';
import { opportunityFormData } from '../OpportunityTable/slice/opportunityTableSlice';
import BarChartComponent from './Category Wise opportunity/BarChart';
import { MdOutlineSearch } from "react-icons/md";
import CustomFunnelChart from './FunnelGraph/funnelgraph';
import Header from './Header/Header';
import UserSpeedometer from './speedometer/Speedometer';
import BarComponent from './MonthWiseBudget/month';
import PieChartComponent from './PieChart/Piechart';

// Data for the charts
// const data = [
//   { name: 'Page A', pv: 2400, uv: 4000 },
//   { name: 'Page B', pv: 1398, uv: 3000 },
//   { name: 'Page C', pv: 9800, uv: 2000 },
//   { name: 'Page D', pv: 3908, uv: 2780 },
//   { name: 'Page E', pv: 4800, uv: 1890 },
//   { name: 'Page F', pv: 3800, uv: 2390 },
//   { name: 'Page G', pv: 4300, uv: 3490 },
// ];



// const pieData = [
//   { name: 'Group A', value: 400, additionalData: '20%' },
//   { name: 'Group B', value: 300, additionalData: '15%' },
//   { name: 'Group C', value: 300, additionalData: '15%' },
//   { name: 'Group D', value: 200, additionalData: '10%' },
//   { name: 'Group E', value: 200, additionalData: '10%' },
// ];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#f408b5'];

// const sortedData = [...data].sort((a, b) => b.pv - a.pv);


const UserDashboard: React.FC = () => {

  const dispatch = useDispatch();
  const [barChartData, setBarChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await dispatch(fetchOpportunityCategoryTotalData() as any);
      const OpportunityCategoryTotalData = result.payload;

      if (OpportunityCategoryTotalData && Array.isArray(OpportunityCategoryTotalData.labels) && Array.isArray(OpportunityCategoryTotalData.totals)) {
        const { labels, totals } = OpportunityCategoryTotalData;


        const transformedData = labels.map((label: string, index: number) => ({
          name: label,
          Total: totals[index],
        }));

        setBarChartData(transformedData);
      }
    };

    fetchData();
  }, [dispatch]);



  const [tableData, setTableData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await dispatch(opportunityFormData() as any);
      const alldata = Array.isArray(result.payload)
        ? result.payload
        : Array.isArray(result.payload?.data)
          ? result.payload.data
          : [];
      // console.log('alldata',alldata);


      const formattedData = alldata.map((item: any, index: number) => ({
        no: index + 1,
        orderDate: item.exp_closure_date,
        productName: item.opportunity,
        customer: item.account_name,
        totalAmount: item.total_amount,
        status: item.status,
        id: item.id,
        acct_created_date: item.acct_created_date,
        ranks: item?.opportunity_stages[0]?.ranks,
        exp_closure_date: item.exp_closure_date,

      }));

      setTableData(formattedData);
    };

    fetchData();
  }, [dispatch]);




  // const data = useSelector((state: RootState) => state.fetchSpeedometerData);

  // const totalSum = data.piedata?.total_sum || 0;
  // const gaugePercent = Math.min(totalSum / 1000, 1); 


  useEffect(() => {
    dispatch(fetchFunnelGraphData() as any);
  }, [dispatch]);

  const funnelGraphdata = useSelector((state: RootState) => state.fetchUserFunnelGraphData);
  // console.log('funnelGraphdata : ', funnelGraphdata)


  //piechart 
  interface PieDataItem {
    name: string;
    value: number;
  }  useEffect(() => {
    dispatch(fetchUserPieChartData() as any);
  }, [dispatch]);

  // const pieData = useSelector((state: RootState) => state.fetchPieChartData.piedata);
  // console.log('piedata:', pieData);

  const { userpiedata } = useSelector((state: RootState) => state.fetchUserPieChart);
  // console.log('userpiedata:', userpiedata);

  // const formattedPieData: PieDataItem[] = pieData.map((item: any) => ({
  //   name: item.vertical,
  //   value: item.total_vertical_amount,
  // }));



  const budgetData = useSelector((state: RootState) => state.fetchMonthWiseBudgetData.budgetdata);

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











  const filterByDate = (dateString: string) => {
    if (!dateString) return false;

    const today = new Date();
    const expDate = new Date(dateString);

    const diffMonths = (today.getFullYear() - expDate.getFullYear()) * 12 + (today.getMonth() - expDate.getMonth());

    switch (selectedFrequency) {
        case "Monthly":
            return diffMonths === 0;
        case "Quarterly":
            return diffMonths >= 0 && diffMonths < 3;
        case "Half-Yearly":
            return diffMonths >= 0 && diffMonths < 6;
        case "Yearly":
            return diffMonths >= 0 && diffMonths < 12;
        default:
            return true; // "All" case
    }
};


  const [selectedRank, setSelectedRank] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedFrequency, setSelectedFrequency] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // console.log(' tableData ', tableData)

  const filteredSearchData = tableData.filter((row) => {
    // const matchesSearch =
    //     row.account_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    //     row.user.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRank = selectedRank === "All" || row.ranks === selectedRank;
    const matchesCategory = selectedCategory === "All" || row.productName === selectedCategory;
    const matchesDate = selectedFrequency === "All" || filterByDate(row.exp_closure_date);

    return matchesRank && matchesCategory && matchesDate;
    // matchesSearch && 
   
});


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
            <BarChartComponent data={[]} />
          </div>
          <div className={styles.box6}>
            <Speedometer />
          </div>
          <div className={styles.box7}>
           <CustomFunnelChart/>
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
                    formatter={(value: any) => `${Number(value).toFixed(0)}`} 
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
        <Header />
        {/* <div className={styles.dashboardContainer}>



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


        </div> */}

        <div className={styles.middleContainer}>

          <div className={styles.box5}>
            <BarChartComponent />
          </div>
          <div className={styles.box6}>
            {/* <UserSpeedometer /> */}
          </div>
          <div className={styles.box7}>
            <CustomFunnelChart />
          </div>

        </div>

        <div className={styles.middleContainer}>
          <div className={styles.box8}>
            {/* <div className={styles.barChartContainer}>
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
            </div> */}
            <PieChartComponent />
          </div>

          <div className={styles.box9}>
            {/* <div className={styles.barChartContainer}>
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
            </div> */}
            <BarComponent />
          </div>
        </div>

        <div className={styles.opportunitystatus}>
          <div className={styles.boxFull}>
            <div className={styles.barChartContainer}>
              <h4>Opportunity Status</h4>
              <div className={styles.rightContainer}>
                <select className={styles.select} value={selectedRank} onChange={(e) => setSelectedRank(e.target.value)}>
                  <option value="All">All Rank</option>
                  <option value="Rank A">Rank A</option>
                  <option value="Rank B">Rank B</option>
                  <option value="Rank C">Rank C</option>
                  <option value="Rank D">Rank D</option>
                  <option value="Rank E">Rank E</option>
                </select>

                <select className={styles.select} value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                  <option value="All">Category</option>
                  <option value="Printer">Printer</option>
                  <option value="Scanner">Scanner</option>
                  <option value="HHT">HHT</option>
                  <option value="Consumables">Consumables</option>
                  <option value="Software">Software</option>
                  <option value="Automation">Automation</option>
                </select>

                <select className={styles.select} value={selectedFrequency} onChange={(e) => setSelectedFrequency(e.target.value)}>
                  <option value="All">All Frequency</option>
                  <option value="Yearly">Yearly</option>
                  <option value="Half-Yearly">Half-Yearly</option>
                  <option value="Quarterly">Quarterly</option>
                  <option value="Monthly">Monthly</option>
                </select>

                <div className={styles.searchBar}>
                  <MdOutlineSearch className={styles.searchicon} />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={styles.search}
                  />
                </div>
              </div>

              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Order Date</th>
                    <th>Product Name</th>
                    <th>Customer</th>
                    <th>Total Amount</th>
                    <th>Status</th>
                  

                  </tr>
                </thead>
                <tbody>
                  {filteredSearchData.map((item, index) => (
                    <tr key={index}>
                      <td>{item.no}</td>
                      <td>{item.orderDate}</td>
                      <td>{item.productName}</td>
                      <td>{item.customer}</td>
                      <td>{item.totalAmount}</td>
                      <td>{item.status}</td>


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

export default UserDashboard;
