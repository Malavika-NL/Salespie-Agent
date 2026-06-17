import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import './App.css';

import { Provider } from 'react-redux';
import store from './app/store';


import AdminDashboard from './features/AdminDashboard/admin';
import UserDashboard from './features/UserDashboard/userdashboard';
import AccountForm from './features/AccountForm/accountForm';
// import RegisterForm from './features/RegisterForm/registerForm';
import TaskForm from './features/TaskForm/taskForm';
import OpportuntiyForm from './features/opportunityForm/opportunityForm';
import LeadForm from './features/lead/lead';
import TableComponent from './features/tables/accountTables';
import OpportunityTable from './features/OpportunityTable/opportunityTable';
import TaskTable from './features/TaskTable/taskTable';
import TargetTable from './features/TargetTable/targetTable';
import LeadTable from './features/LeadTable/leadTable';
import TargetForm from './features/TargetForm/targetForm';
import UserLogin from './features/UserLogin/login';
import AdminLogin from './features/AdminLogin/admin';
import AccountEitForm from './features/EditAccountForm/accountFormEdit';
import OpportuntiyEditForm from './features/EditOpportunityForm/editOpportunity';
import TargetEditForm from './features/EditTargetForm/targetFormEdit';
import LeadEditForm from './features/EditLeadForm/leadFormEdit';
import TaskEditForm from './features/EditTaskForm/taskFormEdit';
import CityList from './features/CommonAPI/demo';
import Login from './features/login/login';
import AdminAccountTableComponent from './features/AdminAccountTable/accountTables';
import AdminOpportunityTable from './features/OpportunityAdminTable/opportunityTable';
import AdminTargetTable from './features/TargetAdminTable/targetTable';
import AdminLeadTable from './features/LeadAdminTable/leadTable';
import BdDashboard from './features/BDdashboard/BDdashboard';
import Dashboard from './features/SalesAdminDashboard/Dashboard';
// import Home from './features/dashboard/Home';
import OpportuntiyStatusEditForm from './features/SalesAdminDashboard/EditOpportunityStatus/editOpportunityStatus';
import UserHome from './features/dashboardUser/Home';
import AdminHome from './features/AdminHome/adminHome';
import NewUserHome from './features/UserHome/UserHome';
import AccountWorkspace from './features/AccountWorkspace/AccountWorkspace';
import OpportunityWorkspace from './features/OpportunityWorkspace/OpportunityWorkspace';
import MarketingWorkspace from './features/MarketingWorkspace/MarketingWorkspace';
import EditAccountWorkspace from './features/EditAccountWorkspace/EditAccountWorkspace';
import TaskWorkspace from './features/TaskWorkspace/TaskWorkspace';
import EditOpportunityWorkspace from './features/EditOpportunityWorkspace/EditOpportunityWorkspace';

import TaskCreationForm from './features/EditOpportunityWorkspace/components/Bar/Componetns/TaskCreation/TaskCreationForm/TaskCreationForm';
import EventCreation from './features/EditOpportunityWorkspace/components/Bar/Componetns/EventCreation/EventCreation';
import OpportunityWorkspaceTable from './features/OpportunityWorkspaceTable/OpportunityWorkspaceTable';
import TaskWorkspaceList from './features/TaskWorkspaceList/TaskWorkspaceList';
import CRMDashboard from './features/CRMdashboard/crmdashboard';
import AccountWorkspaceTable from './features/AccountWorkspaceTable/AccountWorkspaceTable';
import AdminHomePage from './features/AdminHomePage/AdminHomePage';
import AdminAccountWorkspaceTable from './features/AdminAccountWorkspaceTable/AdminAccountWorkspaceTable';
import AdminOpportunityWorkspaceTable from './features/AdminOpportunityWorkspaceTable/AdminOpportunityWorkspaceTable';
import LeadWorkspace from './features/LeadWorkspace/LeadWorkspace';
import BDDashboardNew from './features/BDDashboardNew/BDDashboardNew';
import AdminLeadWorkspaceList from './features/AdminLeadWorkspaceList/AdminLeadWorkspaceList';
import LeadWorkspaceList from './features/LeadWorkspaceList/LeadWorkspaceList';
import AdminTaskWorkspaceList from './features/AdminTaskWorkspaceList/AdminTaskWorkspaceList';
import AdminLeadDashboard from './features/AdminLeadDashboard/AdminLeadDashboard';
import StateCitySelector from './features/CommonAPI/demo';
import Carousel from './features/CommonAPI/Demo/Carousel';
import LeadDetailsForm from './features/LeadDetailsForm';
import ForgotPassword from './features/login/Forgotpassword';
// import ResumeScanningPage from './features/ResumeScan/ResumeScanningPage';

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
        <Route path="/admindashboard" element={<AdminDashboard />} />
        <Route path="/userdashboard" element={<UserDashboard />} />
        <Route path="/accountForm" element={<AccountForm />} />
        {/* <Route path="home/registerForm" element={<RegisterForm />} /> */}
        <Route path="/taskForm" element={<TaskForm />} />
        <Route path="/opportuntiy" element={<OpportuntiyForm />} />
        <Route path="/lead" element={<LeadForm />} />
        <Route path="/table" element={<TableComponent />} />
        <Route path="/opportunityTable" element={<OpportunityTable />} />
        <Route path="/task" element={<TaskTable />} />
        <Route path="/target" element={<TargetTable />} />
        <Route path="/Leadtable" element={<LeadTable />} />
        <Route path="/targetform" element={<TargetForm />} />
        <Route path="/userlogin" element={<UserLogin />} />
        <Route path="/adminLogin" element={<AdminLogin />} />
        <Route path="/editAccountForm/:id" element={<AccountEitForm />} />
        <Route path="/editOpportunityForm/:id" element={<OpportuntiyEditForm />} />
        <Route path="/editTargetForm/:id" element={<TargetEditForm />} />
        <Route path="/editLeadForm/:id" element={<LeadEditForm />} />
        <Route path="/editTaskForm/:id" element={<TaskEditForm />} />
        <Route path="/citylist" element={<CityList />} />
        <Route path="/admintable" element={<AdminAccountTableComponent />} />
        <Route path="/adminopportunitytable" element={<AdminOpportunityTable />} />
        <Route path="/admintargettable" element={<AdminTargetTable />} />
        <Route path="/adminleadtable" element={<AdminLeadTable />} />
        {/* <Route path="/bddashboard" element={<BdDashboard />} /> */}
        {/* <Route path="/dashboardadmin" element={<Home />} /> */}
        <Route path="/editopportunitystatus/:id" element={<OpportuntiyStatusEditForm />} />
        {/* <Route path="/dashboard" element={<UserHome />} /> */}
        <Route path="/Adminhome" element={<AdminHome />} />
        <Route path="/user/*" element={<NewUserHome />} />
        {/* <Route path="/resumescan" element={<ResumeScanningPage/>}/> */}
        <Route path="/*" element={<AdminHomePage />} />
        <Route path="/AdminHomePage" element={<AdminHomePage />} />
        <Route path="/LeadDetailsForm" element={<LeadDetailsForm />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        {/* <Route path="/accountworkspace" element={<AccountWorkspace />} /> */}
        {/* <Route path="/editaccountworkspace/:id" element={<EditAccountWorkspace />} /> */}
        {/* <Route path="/editaccountworkspace/:id" element={<EditAccountWorkspace />} /> */}
        {/* <Route path="/editopportunityspace/*" element={<EditOpportunityWorkspace />}>

          <Route path="event/:id" element={<EventCreation />} />
          <Route path="task/:id" element={<TaskCreationForm />} />
        </Route> */}
        {/* <Route path="/opportunityspace/*" element={<OpportunityWorkspace />} /> */}
        <Route path="/marketingspace/*" element={<MarketingWorkspace />} />
        {/* <Route path="/taskworkspace" element={<TaskWorkspace />} /> */}
        {/* <Route path="/OpportunityWorkspaceTable" element={<OpportunityWorkspaceTable />} /> */}
        {/* <Route path="/AdminOpportunityWorkspaceTable" element={<AdminOpportunityWorkspaceTable />} /> */}
        {/* <Route path="/AccountWorkspaceTable" element={<AccountWorkspaceTable />} /> */}
        {/* <Route path="/AdminAccountWorkspaceTable" element={<AdminAccountWorkspaceTable />} /> */}
        {/* <Route path="/TaskWorkspaceList" element={<TaskWorkspaceList />} /> */}
        {/* <Route path="/AdminTaskWorkspaceList" element={<AdminTaskWorkspaceList />} /> */}
        {/* <Route path="/AdminLeadWorkspaceList" element={<AdminLeadWorkspaceList />} /> */}
        {/* <Route path="/LeadWorkspaceList" element={<LeadWorkspaceList />} /> */}
        {/* <Route path="/crmdashboard" element={<CRMDashboard />} /> */}
        {/* <Route path="/LeadWorkspace" element={<LeadWorkspace />} /> */}
        <Route path="/carouseldemo" element={<Carousel />} />
        <Route path="/state" element={<StateCitySelector />} />
        <Route path="/" element={<Login />} />
    </>
  )
);

function App() {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
}

export default App;
