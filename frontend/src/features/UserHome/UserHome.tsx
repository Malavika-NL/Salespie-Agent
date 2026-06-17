// src/features/UserHome/UserHome.tsx
import React, { useEffect, useState } from 'react';
import styles from './UserHome.module.css';
import Navbar from '../UserDashboard/components/navbar/navbar';
import UserSidebar from './components/UserSidebar/userSidebar';
import MainComponent from './components/MainComponent/MainComponent';
import { Route, Routes, useLocation } from 'react-router-dom';
import AccountWorkspace from '../AccountWorkspace/AccountWorkspace';
import LeadWorkspace from '../LeadWorkspace/LeadWorkspace';
import LeadWorkspaceList from '../LeadWorkspaceList/LeadWorkspaceList';
import UserLeadDashboad from '../UserLeadDashboad/UserLeadDashboad';
import OpportunityWorkspace from '../OpportunityWorkspace/OpportunityWorkspace';
import TaskWorkspace from '../TaskWorkspace/TaskWorkspace';
import OpportunityWorkspaceTable from '../OpportunityWorkspaceTable/OpportunityWorkspaceTable';
import TaskWorkspaceList from '../TaskWorkspaceList/TaskWorkspaceList';
import EditLeadWorkspace from '../EditLeadWorkspace/EditLeadWorkspace';
import EditAccountWorkspace from '../EditAccountWorkspace/EditAccountWorkspace';
import AccountWorkspaceTable from '../AccountWorkspaceTable/AccountWorkspaceTable';
import AdminLeadWorkspaceList from '../AdminLeadWorkspaceList/AdminLeadWorkspaceList';
import AdminLeadDashboard from '../AdminLeadDashboard/AdminLeadDashboard';
import EditOpportunityWorkspace from '../EditOpportunityWorkspace/EditOpportunityWorkspace';
import EventCreation from '../EditOpportunityWorkspace/components/Bar/Componetns/EventCreation/EventCreation';
import TaskCreationForm from '../EditOpportunityWorkspace/components/Bar/Componetns/TaskCreation/TaskCreationForm/TaskCreationForm';
import TargetWorkspace from '../TargetWorkspace/TargetWorkspace';
import TargetWorkspaceTable from '../TargetWorkspaceTable/TargetWorkspaceTable';
import EditTargetWorkspace from '../EditTargetWorkspace/EditTargetWorkspace';
import CRMDashboard from '../CRMdashboard/crmdashboard';
import UserDashboard from '../dashboardUser/Dashboard';
import BDDashboardNew from '../BDDashboardNew/BDDashboardNew';
import AdminEditLeadWorkspace from '../AdminEditLeadWorkspace/AdminEditLeadWorkspace';
import SalesUserDashboard from '../dashboardUser/Home';

import BudgetDashboard  from '../Budget/BudgetDashboard';
import BudgetForm       from '../Budget/BudgetForm';
import BudgetList       from '../Budget/BudgetList';
import BudgetAllocation from '../Budget/BudgetAllocation';
import Settings from './Settings/Settings';
import ResumeScanningPage from '../ResumeScan/ResumeScanningPage';
import BudgetOverview from '../Budget/BudgetOverview';
import BudgetUserDashboard from '../Budget/BudgetUserDashboard';
import ChatbotWidget from '../Chatbot/ChatbotWidget';

const NewUserHome: React.FC = () => {
  const MOBILE_BREAKPOINT = 768;
  const COLLAPSE_BREAKPOINT = 1024;
  const location = useLocation();

  const getViewportFlags = () => {
    if (typeof window === 'undefined') {
      return { isMobile: false, isCollapsedByDefault: false };
    }
    const width = window.innerWidth;
    return {
      isMobile: width <= MOBILE_BREAKPOINT,
      isCollapsedByDefault: width <= COLLAPSE_BREAKPOINT,
    };
  };

  const initialViewport = getViewportFlags();
  const [isMobileView, setIsMobileView] = useState(initialViewport.isMobile);
  const [isCollapsed, setIsCollapsed] = useState(initialViewport.isCollapsedByDefault);
  const [currentPageVertical, setCurrentPageVertical] = useState(1);

  const handleVerticalPageChange = (page: number) => {
    setCurrentPageVertical(page);
  };

  useEffect(() => {
    const handleResize = () => {
      const viewport = getViewportFlags();
      setIsMobileView(viewport.isMobile);
      setIsCollapsed(viewport.isCollapsedByDefault);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isMobileView) {
      setIsCollapsed(true);
    }
  }, [location.pathname, isMobileView]);

  const toggleSidebar = () => {
    setIsCollapsed((prev) => !prev);
  };

  return (
    <div className={styles.layoutContainer}>
      <div className={styles.navbar}>
        <Navbar />
      </div>
      {isMobileView && !isCollapsed && (
        <button
          type="button"
          className={styles.backdrop}
          aria-label="Close sidebar"
          onClick={() => setIsCollapsed(true)}
        />
      )}
      {isMobileView && (
        <button type="button" className={styles.mobileMenuButton} onClick={toggleSidebar}>
          {isCollapsed ? 'Menu' : 'Close'}
        </button>
      )}
      <div className={`${styles.mainArea} ${isMobileView ? styles.mobileMainArea : ''}`}>
        <div className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ''} ${isMobileView ? styles.mobileSidebar : ''}`}>
          <UserSidebar
            isCollapsed={isCollapsed}
            toggleSidebar={toggleSidebar}
          />
        </div>
        {/* <MainComponent verticalCurrentPage={currentPageVertical} onVerticalPageChange={handleVerticalPageChange} /> */}
        <div className={`${styles.mainContent} ${isCollapsed ? styles.collapsed : styles.expanded} ${isMobileView ? styles.mobileContent : ''}`}>
          <Routes>
            <Route path="Userhome" element={<MainComponent />} />

            <Route path="accountworkspace" element={<AccountWorkspace />} />
            <Route path="AccountWorkspaceTable" element={<AccountWorkspaceTable />} />
            <Route path="editaccountworkspace/:id" element={<EditAccountWorkspace />} />

            <Route path="opportunityspace/*" element={<OpportunityWorkspace />} />
            <Route path="OpportunityWorkspaceTable" element={<OpportunityWorkspaceTable />} />
            <Route path="editopportunityspace/*" element={<EditOpportunityWorkspace />}>

              <Route path="event/:id" element={<EventCreation />} />
              <Route path="task/:id" element={<TaskCreationForm />} />
            </Route>
            <Route path="TaskWorkspace" element={<TaskWorkspace />} />
            <Route path="TaskWorkspaceList" element={<TaskWorkspaceList />} />

            <Route path="TargetWorkspace" element={<TargetWorkspace />} />
            <Route path="TargetWorkspaceTable" element={<TargetWorkspaceTable />} />
            <Route path="EditTargetWorkspace/:id" element={<EditTargetWorkspace />} />

            <Route path="LeadWorkspace" element={<LeadWorkspace />} />
            <Route path="LeadWorkspaceList" element={<LeadWorkspaceList />} />
            <Route path="UserLeadDashboard" element={<UserLeadDashboad />} />
            <Route path="EditLeadWorkspace/:id" element={<AdminEditLeadWorkspace />} />
            <Route path="EditUserLeadWorkspace/:id" element={<EditLeadWorkspace />} />
            <Route path="AdminLeadDashboard" element={<AdminLeadDashboard />} />
            <Route path="AdminLeadWorkspaceList" element={<AdminLeadWorkspaceList />} />
            
            <Route path="crmdashboard" element={<CRMDashboard />} />

            <Route path="salesDashboard" element={<UserDashboard />} />
            <Route path="SalesUserDashboard" element={<SalesUserDashboard />} />
            {/* <Route path="budget"                element={<BudgetDashboard />}  />
            <Route path="budget/list"           element={<BudgetList />}        />
            <Route path="budget/new"            element={<BudgetForm />}        />
            <Route path="budget/edit/:id"       element={<BudgetForm />}        />
            <Route path="budget/allocation"     element={<BudgetAllocation />}  /> */}
            {/* <Route path="budget"                    element={<BudgetList />}        /> */}
            <Route path="budget/new"                element={<BudgetForm />}        />
            <Route path="budget/:id/dashboard"      element={<BudgetDashboard />}   />
            <Route path="budget/:id/edit"           element={<BudgetForm />}        />
            {/* <Route path="budget/:id/allocation"     element={<BudgetAllocation />}  /> */}
            <Route path="budget/:id/view" element={<BudgetForm />} />
            <Route path="budget/overview" element={<BudgetOverview />} />
            <Route path="budget/my-dashboard" element={<BudgetUserDashboard />} />
            <Route path="settings" element={<Settings />} />
            <Route path="resumescan" element={<ResumeScanningPage/>}/>
            <Route path="bddashboardnew" element={<BDDashboardNew />} />
          </Routes>

        </div>
      </div>
      <ChatbotWidget />

    </div>
  );
};

export default NewUserHome;
