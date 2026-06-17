import React from 'react';
import Navbar from './components/navbar/navbar';
// import Navbar from '../Roadmap/navbar/navbar';
import Sidebar from './components/sidebar/sidebar';
import BlueBox from './components/BlueBox/bluebox';
import CardStack from './components/SnapShorts/card';
import DashboardPage from './components/Dashboard/Dashboard';
import home from './admin.module.css';
import MyFooter from './components/footer/footer';
import { Link } from 'react-router-dom';
const AdminDashboard = () => {
  return (
    <div>
      {/* Navbar Component */}
      <Navbar />

      <div className={home.container}>
        {/* Sidebar Component */}
        <div className={home.sidebar}>
          <Sidebar />
        </div>

        <div className={home.mainContent}>
          {/* BlueBox Component */}
          <BlueBox />

          <div className={home.contentContainer}>
            {/* CardStack Component */}
            <div className={home.cardStackContainer}>
            <Link to='/bddashboard' className={home.link} > <CardStack /></Link>
            </div>

            {/* DashboardPage Component */}
            <div className={home.dashboardContainer}>
            <Link to='/dashboardadmin' className={home.link} > <DashboardPage /></Link>
            </div>
          </div>

          {/* Separator */}
          <div className={home.separator}></div>

          {/* RouteMap Container */}
          <div className={home.routeMap}>
          <Link to="/Roadmap" className={home.link}><h3>Route Map</h3></Link>
          </div>

          {/* Separator */}
          <div className={home.separator}></div>

          {/* New Main Container */}
          <div className={home.newMainContainer}>
            {/* Left Container */}
            <div className={home.leftContainer}>
              <div className={home.heatmap}>
            
                <Link to="/Heatmap" className={home.link}><h3>Heatmap</h3></Link>
              </div>
              <div className={home.scheduler}>
                <h3>Scheduler</h3>
              </div>
            </div>

            {/* Right Container */}
            <div className={home.rightContainer}>
              <div className={home.report}>
                <h3>Report</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
      <MyFooter/>
    </div>
  );
};

export default AdminDashboard;
