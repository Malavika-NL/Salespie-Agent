// src/app/store.ts



import { configureStore, combineReducers } from '@reduxjs/toolkit';


import accountFormReducer from '../features/AccountForm/slice/accountFormSlice'
import opportunityFormReducer from '../features/opportunityForm/slice/opportunityFormSlice'
import registerFormReducer from '../features/RegisterForm/slice/registerFormSlice'
import taskFormReducer  from '../features/TaskForm/slice/taskFormSlice'
import targetFormReducer  from '../features/TargetForm/slice/targetFormSice'
import {leadFormReducer,getUserDataReducer} from '../features/lead/slice/leadFormSlice'
import accountDataReducer from '../features/tables/slice/tablesSlice'
import adminAccountDataReducer from '../features/AdminAccountTable/slice/tablesSlice'
import opportunityDataReducer from '../features/OpportunityTable/slice/opportunityTableSlice'
import adminOpportunityDataReducer from '../features/OpportunityAdminTable/slice/opportunityTableSlice'
import targetDataReducer from '../features/TargetTable/slice/targetFormData'
import adminTargetDataReducer from '../features/TargetAdminTable/slice/targetFormData'
import taskDataReducer from '../features/TaskTable/slice/taskTableSlice'
import adminLeadDataReducer from '../features/LeadAdminTable/slice/leadTableSlice'
import leadDataReducer from '../features/LeadTable/slice/leadTableSlice'
import userLoginAuthReducer from '../features/login/slice/login'
import adminLoginReducer from '../features/AdminLogin/slice/adminLogin'
import authReducer from '../features/Authslice/authslice'
import refreshTokenReducer from '../features/Authslice/refreshToken';
// import accountFormEditReducer from '../features/EditAccountForm/slice/accountFormEdit';
import {opportunityFormEditReducer , opportunityFetchUserByidReducer} from '../features/EditOpportunityForm/slice/editOpportunity'
import {targetFormEditReducer ,targetFetchUserByidReducer} from '../features/EditTargetForm/slice/targetFormEdit'
import {leadFormEditReducer , leadFetchUserByidReducer } from '../features/EditLeadForm/slice/editLead'
import {accountFormEditReducer , accountFetchUserByidReducer} from '../features/EditAccountForm/slice/accountFormEdit'
import {taskFormEditReducer , taskFetchUserByIdReducer} from '../features/EditTaskForm/slice/editTask'
import commonAPIReducer from '../features/CommonAPI/commonAPI'
import opportunityCategoryTotalDataReducer from '../features/SalesAdminDashboard/slice/opportunityCategoryTotal'
import speedometerDataReducer from '../features/SalesAdminDashboard/slice/speedometer'
import funnelGraphDataReducer from '../features/dashboardUser/FunnelGraph/slice/funnelgraph'
import pieChartDataReducer from '../features/SalesAdminDashboard/PieChart/slice/AdminPieChart'
import monthWiseBudgetDataReducer from '../features/SalesAdminDashboard/MonthWiseBudget/monthWiseBudget'
import fetchOpportunityListReducer from '../features/AccountWorkspace/components/OpportunityList/slice/OpportunityList'
import fetchTaskDetailsReducer from '../features/TaskWorkspace/components/NewTaskDetails/TaskDetails/TaskDetails'
import postCreateTaskReducer from '../features/TaskWorkspace/components/CreateTask/Slice/CreateTaskSlice'
import fetchTaskAssignedByMeReducer from '../features/TaskWorkspace/components/TaskAssignedByMe/Slice/TaskAssignedByMeSlice'
import postTaskStatusReducer  from '../features/TaskWorkspace/components/TaskStatus/Slice/TaskStatusSlice';
import postOpportunityWorkspaceFormReducer from '../features/OpportunityWorkspace/slice/opportunitySlice'
import postEditOpportunityWorkspaceFormReducer from '../features/EditOpportunityWorkspace/slice/EditOpportunityWorkspace'
import postLeadWorkspaceFormReducer  from '../features/LeadWorkspace/slice/LeadWorkspace';
import {fetchAdminTaskDataReducer , deleteAdminTaskWorkspaceTableDataReducer} from '../features/AdminTaskWorkspaceList/Slice/AdminTaskWorkspaceListSlice'
import postAccountWorkspaceFormReducer from '../features/AccountWorkspace/Slice/AccountWorkspaceSlice'
import fetchLeadWorkspaceListReducer from '../features/LeadWorkspaceList/Slice/LeadWorkspaceList'
import {fetchAdminLeadWorkspaceListReducer ,deleteAdminLeadWorkspaceTableDataReducer} from '../features/AdminLeadWorkspaceList/Slice/AdminLeadWorkspaceListSlice'
import postEditLeadWorkspaceFormReducer from '../features/EditLeadWorkspace/slice/EditLeadWorkspace'
import postAdminLeadWorkspaceStatusReducer from '../features/AdminLeadDashboard/LeadStatus/Slice/AdminLeadStatusSlice'
import  EditAdminWorkspaceEditDataReducer from '../features/EditAdminAccountWorkspace/Slice/EditAdminAccountWorkspaceSlice'
import EditAdminOpportunityWorkspaceFormReducer from '../features/AdminEditOpportunityWorkspace/slice/AdminEditOpportunityWorkspaceSlice'
import TargetWorkspaceFormReducer from '../features/TargetWorkspace/Slice/TargetWorkspaceSlice'
import AccountWorkspaceEditFormReducer from '../features/EditAccountWorkspace/Slice/EditAccountWorkspaceSlice'
import AdminTargetWorkspaceEditFormReducer from '../features/EditAdminTargetWorkspace/Slice/EditAdminTargetWorkspaceSlice'
import TargetWorkspaceEditFormReducer from '../features/EditTargetWorkspace/Slice/EditTargetWorkspaceSlice'
import fetchTargetWorkspaceFormDataReducer from '../features/TargetWorkspaceTable/Slice/TargetWorkspaceTableSlice'
import {fetchAdminTargetWorkspaceFormDataReducer ,deleteAdminTargetWorkspaceTableDataReducer} from '../features/AdminTargetWorkspaceTable/Slice/AdminTargetWorkspaceTableSlice'
import updateTaskWorkspaceReducer from '../features/TaskWorkspace/components/TaskStatus/Slice/TaskStatusSlice'
import fetchOpportunityWorkspaceTableDataReducer from '../features/OpportunityWorkspaceTable/Slice/OpportunityWorkspaceTableSlice'
import TodaysTasksReducer from '../features/TaskWorkspace/components/TodaysTasks/TodaysTasksSlice/TodaysTasksSlice'
import AllAccountNamesDataReducer from '../features/CommonAPI/FetchAccountNames/FetchAccountNamesSlice'
import fetchRequestedAccountDataReducer from '../features/CommonAPI/FetchRequestedAccountData/FetchRequestedAccountDataSlice'
import AdminEditLeadWorkspaceFormReducer from '../features/AdminEditLeadWorkspace/slice/AdminEditLeadWorkspaceSlice'
import {deleteAdminAccountWorkspaceTableDataReducer, fetchAdminAccountWorkspaceTableDataReducer} from '../features/AdminAccountWorkspaceTable/AdminAccountWorkspaceTableSlice/AdminAccountWorkspaceTableSlice'
import {deleteAdminOpportunityWorkspaceTableDataReducer, fetchAdminOpportunityWorkspaceTableDataReducer} from '../features/AdminOpportunityWorkspaceTable/AdminOpportunityWorkspaceTableSlice/AdminOpportunityWorkspaceTableSlice'
import fetchUserSpeedometerDataReducer from '../features/dashboardUser/speedometer/Slice/UserSpeedometer'
import fetchUserPieChartDataReducer from '../features/dashboardUser/PieChart/slice/piechart'
import fetchopportunityAdminCategoryTotalDataReducer from '../features/SalesAdminDashboard/Category Wise opportunity/slice/opportunityAdminCategoryTotal'
import fetchAdminSpeedometerDataReducer from '../features/SalesAdminDashboard/AdminSpeedometer/Slice/AdminSpeedometer'
import fetchAdminFunnelGraphDataReducer from '../features/SalesAdminDashboard/FunnelGraph/slice/funnelgraph'
import fetchAdminPieChartDataReducer from '../features/SalesAdminDashboard/PieChart/slice/AdminPieChart'
import fetchAdminMonthWiseBudgetDataReducer from '../features/SalesAdminDashboard/MonthWiseBudget/Slice/AdminMonthWiseBudgetSlice'
import fetchHeaderStatsReducer from '../features/dashboardUser/Header/slice/headerStatsSlice';
import budgetReducer from '../features/Budget/slice/budgetSlice';
import forgotPasswordReducer from '../features/login/slice/forgotpasswordslice';
import settingsReducer from '../features/UserHome/Settings/slice/settingsSlice';
import globalFilterReducer from '../features/globalFilter/globalFilterSlice';
import formSettingsReducer from '../features/FormSettings/formSettingsSlice';

const rootReducer = combineReducers({
  acountForm : accountFormReducer,
  opportunityForm : opportunityFormReducer,
  registerForm: registerFormReducer,
  taskForm: taskFormReducer,
  targetForm: targetFormReducer,
  leadForm : leadFormReducer,
  accountData: accountDataReducer,
  adminAccountData : adminAccountDataReducer,
  opportunityData : opportunityDataReducer,
  adminOpportunityData : adminOpportunityDataReducer,
  targetData : targetDataReducer,
  adminTargetData : adminTargetDataReducer,
  taskData : taskDataReducer,
  adminLeadData : adminLeadDataReducer,
  leadData: leadDataReducer,
  userLoginAuth:userLoginAuthReducer,
  adminLoginData : adminLoginReducer,
  auth: authReducer,
  refreshTokenAuth:refreshTokenReducer,
  accountEditForm:accountFormEditReducer,
  accountFetchUserByid: accountFetchUserByidReducer,
  opportunityEditForm: opportunityFormEditReducer,
  opportunityFetchUserById: opportunityFetchUserByidReducer,
  targetEditForm: targetFormEditReducer,
  targetFetchUserByid: targetFetchUserByidReducer,
  getUserData : getUserDataReducer,
  leadEditForm : leadFormEditReducer,
  leadFetchUserById:leadFetchUserByidReducer,
  taskEditForm : taskFormEditReducer,
  commonAPIData : commonAPIReducer,
  taskFetchUserById: taskFetchUserByIdReducer,
  

  opportunityFetchCategoryTotalData: opportunityCategoryTotalDataReducer,
  fetchSpeedometerData : speedometerDataReducer,
  fetchUserFunnelGraphData : funnelGraphDataReducer,
  fetchPieChartData : pieChartDataReducer,
  fetchMonthWiseBudgetData : monthWiseBudgetDataReducer,

  fetchOpportunityListData : fetchOpportunityListReducer,
  fetchTaskDetailsData : fetchTaskDetailsReducer,
  postCreateTask : postCreateTaskReducer,
  fetchTaskAssignedByMeData : fetchTaskAssignedByMeReducer,
  postTaskStatusData : postTaskStatusReducer,
  // Add other reducers here if needed

  postAccountWorkspaceForm : postAccountWorkspaceFormReducer,
  AccountWorkspaceEditFormData: AccountWorkspaceEditFormReducer,
  fetchAllAccountNamesDetails : AllAccountNamesDataReducer,
  fetchRequestedAccountDetails : fetchRequestedAccountDataReducer,
  deleteAdminAccountWorkspaceTableData : deleteAdminAccountWorkspaceTableDataReducer,
  fetchAdminAccountWorkspaceData : fetchAdminAccountWorkspaceTableDataReducer,
  
  postOpportunityWorkspaceData : postOpportunityWorkspaceFormReducer,
  postEditOpportunityWorkspaceForm :postEditOpportunityWorkspaceFormReducer,
  OpportunityWorkspaceTableData : fetchOpportunityWorkspaceTableDataReducer,
  deleteAdminOpportunityWorkspaceTableData : deleteAdminOpportunityWorkspaceTableDataReducer,
  fetchAdminOpportunityWorkspaceData : fetchAdminOpportunityWorkspaceTableDataReducer,
  

  postLeadWorkspaceData : postLeadWorkspaceFormReducer,

  fetchAdminTaskData :fetchAdminTaskDataReducer,
  deleteAdminTaskWorkspaceData:deleteAdminTaskWorkspaceTableDataReducer,

  fetchLeadWorkspaceListData : fetchLeadWorkspaceListReducer,
  fetchAdminLeadWorkspaceListData : fetchAdminLeadWorkspaceListReducer,
  deleteAdminLeadWorkspaceList : deleteAdminLeadWorkspaceTableDataReducer,
  postEditLeadWorkspaceData : postEditLeadWorkspaceFormReducer,
  postAdminLeadWorkspaceStatus : postAdminLeadWorkspaceStatusReducer, 
  AdminEditLeadWorkspaceData : AdminEditLeadWorkspaceFormReducer,

  EditAdminWorkspaceEditData:EditAdminWorkspaceEditDataReducer,

  EditAdminOpportunityWorkspaceData : EditAdminOpportunityWorkspaceFormReducer,

  TargetWorkspaceData : TargetWorkspaceFormReducer,
  fetchTargetWorkspaceFormData : fetchTargetWorkspaceFormDataReducer,
  AdminTargetWorkspaceEditData : AdminTargetWorkspaceEditFormReducer,
  fetchAdminTargetWorkspaceFormData : fetchAdminTargetWorkspaceFormDataReducer,
  deleteAdminTargetWorkspaceData : deleteAdminTargetWorkspaceTableDataReducer,
  TargetWorkspaceEditData : TargetWorkspaceEditFormReducer,

  updateTaskWorkspaceStatus: updateTaskWorkspaceReducer,
  TodaysTasksData : TodaysTasksReducer,

  fetchUserSpeedometer : fetchUserSpeedometerDataReducer,
  fetchUserPieChart : fetchUserPieChartDataReducer,



  //Sales Admin Dashboard
  fetchAdminCategoryTotalData:fetchopportunityAdminCategoryTotalDataReducer,
  fetchAdminSpeedometer:fetchAdminSpeedometerDataReducer,
  fetchAdminFunnelGraph:fetchAdminFunnelGraphDataReducer,
  fetchAdminPieChart:fetchAdminPieChartDataReducer,
  fetchAdminMonthWiseBudget:fetchAdminMonthWiseBudgetDataReducer,
  fetchHeaderStats: fetchHeaderStatsReducer,
  budget: budgetReducer,
  forgotPassword: forgotPasswordReducer,
  settings: settingsReducer,
  globalFilter: globalFilterReducer,
  formSettings: formSettingsReducer,
});



const store = configureStore({
  reducer: rootReducer,
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof rootReducer>;

export default store;
