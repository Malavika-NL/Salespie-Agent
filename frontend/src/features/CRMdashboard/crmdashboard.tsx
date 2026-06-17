import React, { useState } from 'react';
import styles from './crmdashboard.module.css';
import Contact from './ContactCard/contact';
import Campaign from './CampaignCard/campaign';
import Customer from './CustomerCard/customer';
import Manage from './ManagementContainer/management';
import Activity from './ActivityCard/activity';
import Reminder from './Reminder/reminder';
import Statistics from './StatisticsCard/statistic';
import Response from './Response/response';
import TopBar from './TopBar/topbar';
import Sidebar from './CRMsidebar/sidebar'; // Import the Sidebar component

const CRMDashboard: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSidebarToggle = (isOpen: boolean) => {
    setIsSidebarOpen(isOpen);
  };

  return (
    // <div className={styles.dashboardContainer}>
    //   <Sidebar onToggle={handleSidebarToggle} /> {/* Add the Sidebar component */}
    //   <div className={styles.mainContent}>
    //     <TopBar />
    //     <div className={styles.container}>
    //       <div className={styles.row}>
    //         <Contact />
    //         <Campaign />
    //         <Customer />
    //         <Reminder />
    //       </div>
    //       <div className={styles.row}>
    //         <Manage />
    //         <Statistics />
    //       </div>
    //       <div className={styles.row}>
    //         <Activity />
    //         <Response />
    //       </div>
    //     </div>
    //   </div>
    // </div>
    <div className={styles.mainContent} >
      <div className={styles.row}>
        <Contact />
        <Campaign />
        <Customer />
        <Reminder />
      </div>
      <div className={styles.row}>
        <Manage />
        <Statistics />
      </div>
      <div className={styles.row}>
        <Activity />
        <Response />
      </div>
    </div>
  );
};

export default CRMDashboard;
