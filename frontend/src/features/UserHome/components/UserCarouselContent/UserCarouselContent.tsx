import React from 'react';
import styles from './UserCarouselContent.module.css';
import UserDashboard from '../../../UserDashboard/userdashboard';
import BdDashboard from '../../../BDdashboard/BDdashboard';
import BDDashboardNew from '../../../BDDashboardNew/BDDashboardNew';
import CRMDashboard from '../../../CRMdashboard/crmdashboard';
import Dashboard from '../../../dashboardUser/Dashboard';
import SalesUserDashboard from '../../../dashboardUser/Home';


interface ContentProps {
  data: number; // Ensure data is a number
}

const Content: React.FC<ContentProps> = ({ data }) => {
  const renderDashboard = () => {
    switch (data) {
      case 1:
        // return <Dashboard/>;
        return <SalesUserDashboard/>;
      case 2:
        return <BDDashboardNew />;
      case 3:
        return <CRMDashboard />;
      default:
        return <div>No Dashboard Found</div>;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {renderDashboard()}
      </div>
    </div>
  );
};

export default Content;
