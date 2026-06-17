import React, { useEffect, useState } from 'react';
import styles from './AdminHomePage.module.css';
import Navbar from '../UserDashboard/components/navbar/navbar';
import UserSidebar from './components/AdminSidebar/AdminSidebar';
import FooterLinks from './components/BottomContent/Links';
import UserCarousel from './components/UserCarousel/UserCarousel';
import UserVerticalCarousel from './components/VerticalUserCarousel/VerticalUserCarousel';
import AdminSidebar from './components/AdminSidebar/AdminSidebar';
import AdminNavbar from './components/navbar/navbar';
import { Route, Routes, useLocation } from 'react-router-dom';
import MainComponent from './components/MainComponent/MainComponent';
import AccountWorkspace from '../AccountWorkspace/AccountWorkspace';
import LeadWorkspaceList from '../LeadWorkspaceList/LeadWorkspaceList';
import LeadWorkspace from '../LeadWorkspace/LeadWorkspace';
import AdminLeadWorkspaceList from '../AdminLeadWorkspaceList/AdminLeadWorkspaceList';
import AdminLeadDashboard from '../AdminLeadDashboard/AdminLeadDashboard';
import EditLeadWorkspace from '../EditLeadWorkspace/EditLeadWorkspace';
import OpportunityWorkspace from '../OpportunityWorkspace/OpportunityWorkspace';
import AdminAccountWorkspaceTable from '../AdminAccountWorkspaceTable/AdminAccountWorkspaceTable';
import AdminOpportunityWorkspaceTable from '../AdminOpportunityWorkspaceTable/AdminOpportunityWorkspaceTable';
import AdminTaskWorkspaceList from '../AdminTaskWorkspaceList/AdminTaskWorkspaceList';
import TaskWorkspace from '../TaskWorkspace/TaskWorkspace';
import EditAccountWorkspace from '../EditAccountWorkspace/EditAccountWorkspace';
import EditOpportunityWorkspace from '../EditOpportunityWorkspace/EditOpportunityWorkspace';
import EventCreation from '../EditOpportunityWorkspace/components/Bar/Componetns/EventCreation/EventCreation';
import TaskCreationForm from '../EditOpportunityWorkspace/components/Bar/Componetns/TaskCreation/TaskCreationForm/TaskCreationForm';
import EditAdminAccountWorkspace from '../EditAdminAccountWorkspace/EditAdminAccountWorkspace';
import EditAdminOpportunityWorkspace from '../AdminEditOpportunityWorkspace/AdminEditOpportunityWorkspace';
import TargetWorkspace from '../TargetWorkspace/TargetWorkspace';
import AdminTargetWorkspaceTable from '../AdminTargetWorkspaceTable/AdminTargetWorkspaceTable';
import EditAdminTargetWorkspace from '../EditAdminTargetWorkspace/EditAdminTargetWorkspace';
import CRMDashboard from '../CRMdashboard/crmdashboard';
// import Home from '../dashboard/Home';
import Dashboard from '../SalesAdminDashboard/Dashboard';
import BdDashboard from '../BDdashboard/BDdashboard';
import BDDashboardNew from '../BDDashboardNew/BDDashboardNew';
import AdminEditLeadWorkspace from '../AdminEditLeadWorkspace/AdminEditLeadWorkspace';
import SalesAdminDashboard from '../SalesAdminDashboard/SalesAdminDashboard';
import RegisterForm from '../RegisterForm/registerForm';
import BudgetDashboard  from '../Budget/BudgetDashboard';
import BudgetForm       from '../Budget/BudgetForm';
import BudgetList       from '../Budget/BudgetList';
import BudgetAllocation from '../Budget/BudgetAllocation';
import Settings from '../UserHome/Settings/Settings';
import ResumeScanningPage from '../ResumeScan/ResumeScanningPage';
import BudgetOverview from '../Budget/BudgetOverview';
import BudgetAdminDashboard from '../Budget/BudgetAdminDashboard';
import ChatbotWidget from '../Chatbot/ChatbotWidget';
const AdminHomePage: React.FC = () => {
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

  // Data array for UserCarousel
  const data = [
    { id: 1, page: "AdminDashboard", backgroundColor: "#FFFFFF" },
    { id: 2, page: "UserDashboard", backgroundColor: "#2A2A2A" },
    { id: 3, page: "BdDashboard", backgroundColor: "#727FFF" },
    { id: 4, page: "UserHome", backgroundColor: "#727FFF" },
  ];


  // Total pages are the length of the data array
  const totalPages = data.length;

  // State for horizontal carousel
  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // State for vertical carousel (as an example)
  const [currentPageVertical, setCurrentPageVertical] = useState(1);
  const totalVerticalPages = 5; // Example total pages for vertical carousel

  const handleVerticalPageChange = (page: number) => {
    if (page >= 1 && page <= totalVerticalPages) {
      setCurrentPageVertical(page);
    }
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
          <AdminSidebar
            isCollapsed={isCollapsed}
            toggleSidebar={toggleSidebar}
          />
        </div>
        <div className={`${styles.mainContent} ${isCollapsed ? styles.collapsed : styles.expanded} ${isMobileView ? styles.mobileContent : ''}`}>
          <Routes>
            <Route path="home" element={<MainComponent  />} />

            <Route path="accountworkspace" element={<AccountWorkspace />} />
            <Route path="AdminAccountWorkspaceTable" element={<AdminAccountWorkspaceTable />} />
            <Route path="editaccountworkspace/:id" element={<EditAccountWorkspace />} />
            <Route path="EditAdminAccountWorkspace/:id" element={<EditAdminAccountWorkspace />} />

            <Route path="opportunityspace/*" element={<OpportunityWorkspace />} />
            <Route path="AdminOpportunityWorkspaceTable" element={<AdminOpportunityWorkspaceTable />} />
            <Route path="/editopportunityspace/*" element={<EditOpportunityWorkspace />}>

              <Route path="event/:id" element={<EventCreation />} />
              <Route path="task/:id" element={<TaskCreationForm />} />
            </Route>

            <Route path="/editadminopportunityspace/*" element={<EditAdminOpportunityWorkspace />}>
              <Route path="event/:id" element={<EventCreation />} />
              <Route path="task/:id" element={<TaskCreationForm />} />
            </Route>

            <Route path="TargetWorkspace" element={<TargetWorkspace />} />
            <Route path="AdminTargetWorkspaceTable" element={<AdminTargetWorkspaceTable />} />
            <Route path="EditAdminTargetWorkspace/:id" element={<EditAdminTargetWorkspace />} />

            <Route path="LeadWorkspace" element={<LeadWorkspace />} />
            <Route path="AdminLeadWorkspaceList" element={<AdminLeadWorkspaceList />} />
            <Route path="AdminLeadDashboard" element={<AdminLeadDashboard />} />
            <Route path="EditLeadWorkspace/:id" element={<AdminEditLeadWorkspace />} />

            <Route path="TaskWorkspace" element={<TaskWorkspace />} />
            <Route path="AdminTaskWorkspaceList" element={<AdminTaskWorkspaceList />} />

            <Route path="/crmdashboard" element={<CRMDashboard />} />

            <Route path="/dashboardadmin" element={<Dashboard />} />

            <Route path="/SalesAdminDashboard" element={<SalesAdminDashboard />} />
            {/* <Route path="budget"                    element={<BudgetList />}        /> */}
            <Route path="budget/new"                element={<BudgetForm />}        />
            <Route path="budget/:id/dashboard"      element={<BudgetDashboard />}   />
            <Route path="budget/:id/edit"           element={<BudgetForm />}        />
            {/* <Route path="budget/:id/allocation"     element={<BudgetAllocation />}  /> */}
            <Route path="/budget/:id/view"   element={<BudgetForm />} />
            <Route path="/budget/dashboard" element={<BudgetAdminDashboard />} />
            <Route path="/bddashboardnew" element={<BDDashboardNew />} />
            <Route path="budget/overview" element={<BudgetOverview />} />
            <Route path="resumescan" element={<ResumeScanningPage/>}/>
            <Route path="settings" element={<Settings />} />
            <Route path="home/registerForm" element={<RegisterForm />} />
          </Routes>
        </div>
      </div>
      <ChatbotWidget />
    </div>
  );
};

export default AdminHomePage;
