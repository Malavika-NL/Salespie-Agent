// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {type RootState,type AppDispatch } from "../../app/store";
// import {
//   setFormData,
//   submitForm,
//   postAdminEditOpportunityWorkspaceForm,
//   fetchAdminOpportunityWorkspaceUserById,
//   clearEditOpportunityData,
// } from './slice/AdminEditOpportunityWorkspaceSlice';


// import AccountDetails from "./components/AccountDetails/accountDetails";
// import PicData from "./components/Picdata/Picdata";
// import StageData from "./components/StageData/Stagedata";
// import Bar from "./components/Bar/Bar";
// import ProgressBar from "./components/ProgressBar/Progressbar";
// import styles from "./AdminEditOpportunityWorkspace.module.css";
// import { CiBookmark } from "react-icons/ci";
// import { Route, Routes, useNavigate, useParams } from "react-router-dom";
// import EventCreation from "./components/Bar/Componetns/EventCreation/EventCreation";
// import TaskCreationForm from "./components/Bar/Componetns/TaskCreation/TaskCreationForm/TaskCreationForm";

// // Interfaces for Various Details
// interface Stage {
//   stages: string;
//   ranks: string;
//   lost_reason?: string;
// }

// interface PicDetails {
//   pic_department: string;
//   pic_name: string;
//   pic_designation: string;
//   pic_email: string;
//   pic_phone: string;
//   pic_phone_two?: string;
// }

// interface EventDetails {
//   start_date: string;
//   end_date: string;
//   start_time: string;
//   end_time: string;
//   event: string;
//   remark: string;
// }

// interface TaskDetails {
//   task: string;
//   assign_to: string;
//   start_date: string;
//   end_date: string;
//   status: string;
// }

// // Main Form Interface (Including Missing Fields)
// interface FormData {
//   account_holder: string;
//   account_name: string;
//   opportunity: string;
//   make: string;
//   sub_make: string;
//   sub_make_brand: string;
//   pic: string;
//   contact_person: string;
//   designation: string;
//   department: string;
//   mobile_number: string;
//   email_id: string;
//   location: string;
//   state: string;
//   city: string;
//   address: string;
//   qty: string;
//   values: number;
//   exp_closure_date: string;
//   exp_po_date: string;
//   remarks?: string | null;
//   hardware_amount: number;
//   software_amount: number;
//   consumables_amount: number;
//   automation_amount: number;
//   solution_amount: number;
//   maintenance_amount: number;
//   others_amount: number;
//   total_amount: number;
//   status: string | null;
//   vertical: string | null;
//   last_update: string | null;
//   opportunity_stages: Stage[];
//   opportunity_pic: PicDetails[];
//   opportunity_event: EventDetails[];
//   opportunity_task: TaskDetails[];
// }

// // Initial Form Data (Default Values)
// const initialFormData: FormData = {
//   account_holder: '',
//   account_name: '',
//   opportunity: '',
//   make: '',
//   sub_make: '',
//   sub_make_brand: '',
//   pic: '',
//   contact_person: '',
//   designation: '',
//   department: '',
//   mobile_number: '',
//   email_id: '',
//   location: '',
//   state: '',
//   city: '',
//   address: '',
//   qty: '',
//   values: 0,
//   exp_closure_date: '',
//   exp_po_date: '',
//   remarks: null,
//   hardware_amount: 0,
//   software_amount: 0,
//   consumables_amount: 0,
//   automation_amount: 0,
//   solution_amount: 0,
//   maintenance_amount: 0,
//   others_amount: 0,
//   total_amount: 0,
//   status: null,
//   vertical: null,
//   last_update: '',
//   opportunity_stages: [],
//   opportunity_pic: [],
//   opportunity_event: [],
//   opportunity_task: [],
// };

// // Main Component
// const EditAdminOpportunityWorkspace: React.FC = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch<AppDispatch>();
//   const { id } = useParams<{ id: string }>();
//   // console.log(id)
//   useEffect(() => {
//     if (id) {
//       dispatch(fetchAdminOpportunityWorkspaceUserById(id) as any);

//     }
//   }, []);


//   const { loading, data, error, formData } = useSelector(
//     (state: RootState) => state.EditAdminOpportunityWorkspaceData
//   );

// // console.log('data?.message ',data )
//  useEffect(() => {
    
//         if (data?.message === "success") {
//           alert("Opportunity Form  Submitted successfully");
//           dispatch(clearEditOpportunityData());
//           navigate("/AdminOpportunityWorkspaceTable"); // Redirect to UserHome
         
//         } else if (data?.message && data.message !== "success") {
//           dispatch(clearEditOpportunityData());
//           alert("Submission failed");

//         }
//       }, [data, navigate]);



//     const [errors, setErrors] = useState<{ [key: string]: string }>({});
  
//   // Form Submission (With Validation)
//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
    
//     // Validate required fields
//     const newErrors: { [key: string]: string } = {};
//     if (!formData?.account_name) {
//       newErrors.account_name = "Account Name is required";
//     } 
  
//     // Set errors
//     setErrors(newErrors);
  
//     // If there are errors, scroll to the first field with an error
//     if (Object.keys(newErrors).length > 0) {
//       const focusField = Object.keys(newErrors)[0];
//       const fieldElement = document.getElementById(focusField); // Find the field by its `id`
//       if (fieldElement) {
//         fieldElement.scrollIntoView({ behavior: "smooth", block: "center" });
//         (fieldElement as HTMLInputElement).focus(); // Set focus to the field
//       }
//       return; // Stop further execution if validation fails
//     }
  
//     // If no errors, proceed with the confirmation prompt
//     const userConfirmed = window.confirm("Do you want to save the changes?");
//     if (userConfirmed) {
//       if (formData && id) {
//         console.log("Submitting Form Data with ID:", id, formData);
//         dispatch(postAdminEditOpportunityWorkspaceForm({ id, formData })); // Dispatch with both id and formData
//       } else {
//         console.warn("Form data or ID is incomplete or missing.");
//       }
//     } else {
//       console.log("User canceled the save action.");
//     }
//   };
  

//   return (
//     <div className={styles.mainContent }>
//         <div className={styles.head}>
//             <p className={styles.subhead}>Opportunity Workspace</p>
//             <p className={styles.subtext}>Monitor and edit all your data</p>
//           </div>
//           <div className={styles.accountwrapper}>
//             <AccountDetails    errors={errors} />
//           </div>
//           <ProgressBar />
//           <div className={styles.row}>
//             <div className={styles.summaryOverview}>
//               <StageData />
//             </div>
//             <div className={styles.listOfOpportunities}>
//               <PicData  />
//             </div>
//           </div>
//           <Bar />
//           <div className={styles.routes}>
//             <Routes>
//               <Route path="event/:id" element={<EventCreation />} />
//               <Route path="task/:id" element={<TaskCreationForm />} />
//             </Routes>
//           </div>
//           <button
//               type="button"
//               className={styles.savebutton}
//               onClick={handleSubmit}
//             >
//               <CiBookmark color="white" size={20} style={{ marginRight: "5px" }} />
//               Save
//             </button>
//         </div>
       
  
//   );
// };

// export default EditAdminOpportunityWorkspace;

// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { type RootState, type AppDispatch } from "../../app/store";
// import {
//   postAdminEditOpportunityWorkspaceForm,
//   fetchAdminOpportunityWorkspaceUserById,
//   clearEditOpportunityData,
// } from './slice/AdminEditOpportunityWorkspaceSlice';

// import AccountDetails from "./components/AccountDetails/accountDetails";
// import PicData from "./components/Picdata/Picdata";
// import StageData from "./components/StageData/Stagedata";
// import Bar from "./components/Bar/Bar";
// import ProgressBar from "./components/ProgressBar/Progressbar";
// import styles from "./AdminEditOpportunityWorkspace.module.css";
// import { CiBookmark } from "react-icons/ci";
// import { Route, Routes, useNavigate, useParams } from "react-router-dom";
// import EventCreation from "./components/Bar/Componetns/EventCreation/EventCreation";
// import TaskCreation from "./components/Bar/Componetns/TaskCreation/TaskCreation"; // ✅ changed

// // ── Interfaces ────────────────────────────────────────────────────────────────
// interface Stage {
//   stages: string;
//   ranks: string;
//   lost_reason?: string;
// }

// interface PicDetails {
//   pic_department: string;
//   pic_name: string;
//   pic_designation: string;
//   pic_email: string;
//   pic_phone: string;
//   pic_phone_two?: string;
// }

// interface EventDetails {
//   start_date: string;
//   end_date: string;
//   start_time: string;
//   end_time: string;
//   event: string;
//   remark: string;
// }

// interface TaskDetails {
//   task: string;
//   assign_to: string;
//   start_date: string;
//   end_date: string;
//   status: string;
// }

// interface FormData {
//   account_holder: string;
//   account_name: string;
//   opportunity: string;
//   make: string;
//   sub_make: string;
//   sub_make_brand: string;
//   pic: string;
//   contact_person: string;
//   designation: string;
//   department: string;
//   mobile_number: string;
//   email_id: string;
//   location: string;
//   state: string;
//   city: string;
//   address: string;
//   qty: string;
//   values: number;
//   exp_closure_date: string;
//   exp_po_date: string;
//   remarks?: string | null;
//   hardware_amount: number;
//   software_amount: number;
//   consumables_amount: number;
//   automation_amount: number;
//   solution_amount: number;
//   maintenance_amount: number;
//   others_amount: number;
//   total_amount: number;
//   status: string | null;
//   vertical: string | null;
//   last_update: string | null;
//   opportunity_stages: Stage[];
//   opportunity_pic: PicDetails[];
//   opportunity_event: EventDetails[];
//   opportunity_task: TaskDetails[];
// }

// // ── Initial Form Data ─────────────────────────────────────────────────────────
// const initialFormData: FormData = {
//   account_holder: '',
//   account_name: '',
//   opportunity: '',
//   make: '',
//   sub_make: '',
//   sub_make_brand: '',
//   pic: '',
//   contact_person: '',
//   designation: '',
//   department: '',
//   mobile_number: '',
//   email_id: '',
//   location: '',
//   state: '',
//   city: '',
//   address: '',
//   qty: '',
//   values: 0,
//   exp_closure_date: '',
//   exp_po_date: '',
//   remarks: null,
//   hardware_amount: 0,
//   software_amount: 0,
//   consumables_amount: 0,
//   automation_amount: 0,
//   solution_amount: 0,
//   maintenance_amount: 0,
//   others_amount: 0,
//   total_amount: 0,
//   status: null,
//   vertical: null,
//   last_update: '',
//   opportunity_stages: [],
//   opportunity_pic: [],
//   opportunity_event: [],
//   opportunity_task: [],
// };

// // ── Main Component ────────────────────────────────────────────────────────────
// const EditAdminOpportunityWorkspace: React.FC = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch<AppDispatch>();
//   const { id } = useParams<{ id: string }>();

//   useEffect(() => {
//     if (id) {
//       dispatch(fetchAdminOpportunityWorkspaceUserById(id) as any);
//     }
//   }, [id, dispatch]);

//   const { data, formData } = useSelector(
//     (state: RootState) => state.EditAdminOpportunityWorkspaceData
//   );

//   useEffect(() => {
//     if (data?.message === "success") {
//       alert("Opportunity Form Submitted successfully");
//       dispatch(clearEditOpportunityData());
//       navigate("/AdminOpportunityWorkspaceTable");
//     } else if (data?.message && data.message !== "success") {
//       dispatch(clearEditOpportunityData());
//       alert("Submission failed");
//     }
//   }, [data, navigate]);

//   const [errors, setErrors] = useState<{ [key: string]: string }>({});

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();

//     const newErrors: { [key: string]: string } = {};
//     if (!formData?.account_name) {
//       newErrors.account_name = "Account Name is required";
//     }
//     setErrors(newErrors);

//     if (Object.keys(newErrors).length > 0) {
//       const focusField = Object.keys(newErrors)[0];
//       const fieldElement = document.getElementById(focusField);
//       if (fieldElement) {
//         fieldElement.scrollIntoView({ behavior: "smooth", block: "center" });
//         (fieldElement as HTMLInputElement).focus();
//       }
//       return;
//     }

//     const userConfirmed = window.confirm("Do you want to save the changes?");
//     if (userConfirmed) {
//       if (formData && id) {
//         console.log("Submitting Form Data with ID:", id, formData);
//         dispatch(postAdminEditOpportunityWorkspaceForm({ id, formData }));
//       } else {
//         console.warn("Form data or ID is incomplete or missing.");
//       }
//     } else {
//       console.log("User canceled the save action.");
//     }
//   };

//   return (
//     <div className={styles.mainContent}>
//       <div className={styles.head}>
//         <p className={styles.subhead}>Opportunity Workspace</p>
//         <p className={styles.subtext}>Monitor and edit all your data</p>
//       </div>

//       <div className={styles.accountwrapper}>
//         <AccountDetails errors={errors} />
//       </div>

//       <ProgressBar />

//       <div className={styles.row}>
//         <div className={styles.summaryOverview}>
//           <StageData />
//         </div>
//         <div className={styles.listOfOpportunities}>
//           <PicData />
//         </div>
//       </div>

//       <Bar />

//       <div className={styles.routes}>
//         <Routes>
//           <Route path="event/:id" element={<EventCreation />} />
//           <Route path="task/:id" element={<TaskCreation />} /> {/* ✅ changed */}
//         </Routes>
//       </div>

//       <button
//         type="button"
//         className={styles.savebutton}
//         onClick={handleSubmit}
//       >
//         <CiBookmark color="white" size={20} style={{ marginRight: "5px" }} />
//         Save
//       </button>
//     </div>
//   );
// };

// export default EditAdminOpportunityWorkspace;

// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { type RootState, type AppDispatch } from "../../app/store";
// import {
//   postAdminEditOpportunityWorkspaceForm,
//   fetchAdminOpportunityWorkspaceUserById,
//   clearEditOpportunityData,
// } from './slice/AdminEditOpportunityWorkspaceSlice';

// import AccountDetails from "./components/AccountDetails/accountDetails";
// import PicData from "./components/Picdata/Picdata";
// import StageData from "./components/StageData/Stagedata";
// import Bar from "./components/Bar/Bar";
// import ProgressBar from "./components/ProgressBar/Progressbar";
// import styles from "./AdminEditOpportunityWorkspace.module.css";
// import { CiBookmark } from "react-icons/ci";
// import { Route, Routes, useNavigate, useParams, useLocation } from "react-router-dom"; // ✅ Added useLocation
// import EventCreation from "./components/Bar/Componetns/EventCreation/EventCreation";
// import TaskCreation from "./components/Bar/Componetns/TaskCreation/TaskCreation"; 
// import EditFollowupCreation from "./components/Bar/Componetns/FollowupCreation/EditFollowupCreation"; // ✅ Added Followup Import

// // ── Interfaces ────────────────────────────────────────────────────────────────
// interface Stage {
//   stages: string;
//   ranks: string;
//   lost_reason?: string;
// }

// interface PicDetails {
//   pic_department: string;
//   pic_name: string;
//   pic_designation: string;
//   pic_email: string;
//   pic_phone: string;
//   pic_phone_two?: string;
// }

// interface EventDetails {
//   start_date: string;
//   end_date: string;
//   start_time: string;
//   end_time: string;
//   event: string;
//   remark: string;
// }

// interface TaskDetails {
//   task: string;
//   assign_to: string;
//   start_date: string;
//   end_date: string;
//   status: string;
// }

// // ✅ Added Followup Interface
// interface FollowupDetails {
//   followup: string;
//   followup_topic: string;
//   start_date: string;
//   end_date: string;
//   remark: string;
// }

// interface FormData {
//   account_holder: string;
//   account_name: string;
//   opportunity: string;
//   make: string;
//   sub_make: string;
//   sub_make_brand: string;
//   pic: string;
//   contact_person: string;
//   designation: string;
//   department: string;
//   mobile_number: string;
//   email_id: string;
//   location: string;
//   state: string;
//   city: string;
//   address: string;
//   qty: string;
//   values: number;
//   exp_closure_date: string;
//   exp_po_date: string;
//   remarks?: string | null;
//   hardware_amount: number;
//   software_amount: number;
//   consumables_amount: number;
//   automation_amount: number;
//   solution_amount: number;
//   maintenance_amount: number;
//   others_amount: number;
//   total_amount: number;
//   status: string | null;
//   vertical: string | null;
//   last_update: string | null;
//   opportunity_stages: Stage[];
//   opportunity_pic: PicDetails[];
//   opportunity_event: EventDetails[];
//   opportunity_task: TaskDetails[];
//   opportunity_followup: FollowupDetails[]; // ✅ Added Followup Array
// }

// // ── Initial Form Data ─────────────────────────────────────────────────────────
// const initialFormData: FormData = {
//   account_holder: '',
//   account_name: '',
//   opportunity: '',
//   make: '',
//   sub_make: '',
//   sub_make_brand: '',
//   pic: '',
//   contact_person: '',
//   designation: '',
//   department: '',
//   mobile_number: '',
//   email_id: '',
//   location: '',
//   state: '',
//   city: '',
//   address: '',
//   qty: '',
//   values: 0,
//   exp_closure_date: '',
//   exp_po_date: '',
//   remarks: null,
//   hardware_amount: 0,
//   software_amount: 0,
//   consumables_amount: 0,
//   automation_amount: 0,
//   solution_amount: 0,
//   maintenance_amount: 0,
//   others_amount: 0,
//   total_amount: 0,
//   status: null,
//   vertical: null,
//   last_update: '',
//   opportunity_stages: [],
//   opportunity_pic: [],
//   opportunity_event: [],
//   opportunity_task: [],
//   opportunity_followup: [], // ✅ Added to initial data
// };

// // ── Main Component ────────────────────────────────────────────────────────────
// const EditAdminOpportunityWorkspace: React.FC = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch<AppDispatch>();
//   const location = useLocation();

//   // ✅ Fix 3: Safely grab the ID from URL to prevent 'undefined' saving error
//   const { id: paramId } = useParams<{ id: string }>();
//   const id = paramId || location.pathname.split('/').pop();

//   useEffect(() => {
//     if (id) {
//       dispatch(fetchAdminOpportunityWorkspaceUserById(id) as any);
//     }
//   }, [id, dispatch]);

//   const { data, formData } = useSelector(
//     (state: RootState) => state.EditAdminOpportunityWorkspaceData
//   );

//   useEffect(() => {
//     if (data?.message === "success") {
//       alert("Opportunity Form Submitted successfully");
//       dispatch(clearEditOpportunityData());
//       navigate("/AdminOpportunityWorkspaceTable");
//     } else if (data?.message && data.message !== "success") {
//       dispatch(clearEditOpportunityData());
//       alert("Submission failed");
//     }
//   }, [data, navigate]);

//   const [errors, setErrors] = useState<{ [key: string]: string }>({});

//   const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
//     e.preventDefault();

//     const newErrors: { [key: string]: string } = {};
//     if (!formData?.account_name) {
//       newErrors.account_name = "Account Name is required";
//     }
//     setErrors(newErrors);

//     if (Object.keys(newErrors).length > 0) {
//       const focusField = Object.keys(newErrors)[0];
//       const fieldElement = document.getElementById(focusField);
//       if (fieldElement) {
//         fieldElement.scrollIntoView({ behavior: "smooth", block: "center" });
//         (fieldElement as HTMLInputElement).focus();
//       }
//       return;
//     }

//     const userConfirmed = window.confirm("Do you want to save the changes?");
//     if (userConfirmed) {
//       if (formData && id) {
//         console.log("Submitting Form Data with ID:", id, formData);
//         dispatch(postAdminEditOpportunityWorkspaceForm({ id, formData }));
//       } else {
//         console.warn("Form data or ID is incomplete or missing. ID:", id);
//       }
//     } else {
//       console.log("User canceled the save action.");
//     }
//   };

//   return (
//     <div className={styles.mainContent}>
//       <div className={styles.head}>
//         <p className={styles.subhead}>Opportunity Workspace</p>
//         <p className={styles.subtext}>Monitor and edit all your data</p>
//       </div>

//       <div className={styles.accountwrapper}>
//         <AccountDetails errors={errors} />
//       </div>

//       <ProgressBar />

//       <div className={styles.row}>
//         <div className={styles.summaryOverview}>
//           <StageData />
//         </div>
//         <div className={styles.listOfOpportunities}>
//           <PicData />
//         </div>
//       </div>

//       <Bar />

//       <div className={styles.routes}>
//         <Routes>
//           <Route path="event/:id" element={<EventCreation />} />
//           <Route path="task/:id" element={<TaskCreation />} />
//           {/* ✅ Fix 2: Added Followup Route */}
//           <Route path="followup/:id" element={<EditFollowupCreation />} />
//         </Routes>
//       </div>

//       <button
//         type="button"
//         className={styles.savebutton}
//         onClick={handleSubmit}
//       >
//         <CiBookmark color="white" size={20} style={{ marginRight: "5px" }} />
//         Save
//       </button>
//     </div>
//   );
// };

// export default EditAdminOpportunityWorkspace;



import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { type RootState, type AppDispatch } from "../../app/store";
import {
  postAdminEditOpportunityWorkspaceForm,
  fetchAdminOpportunityWorkspaceUserById,
  clearEditOpportunityData,
} from './slice/AdminEditOpportunityWorkspaceSlice';
import { CiBookmark } from "react-icons/ci";
import { Target } from "lucide-react";
import AccountDetails from "./components/AccountDetails/accountDetails";
import PicData from "./components/Picdata/Picdata";
import StageData from "./components/StageData/Stagedata";
import Bar from "./components/Bar/Bar";
import ProgressBar from "./components/ProgressBar/Progressbar";
import { Route, Routes, useNavigate, useParams, useLocation } from "react-router-dom";
import EventCreation from "./components/Bar/Componetns/EventCreation/EventCreation";
import TaskCreation from "./components/Bar/Componetns/TaskCreation/TaskCreation";
import EditFollowupCreation from "./components/Bar/Componetns/FollowupCreation/EditFollowupCreation"; // ✅ Added Followup Import

// ── Interfaces ────────────────────────────────────────────────────────────────

interface Stage {
  stages: string;
  month: string;
  ranks: string;
  lost_reason?: string;
}

interface PicDetails {
  pic_department: string;
  pic_name: string;
  pic_designation: string;
  pic_email: string;
  pic_phone: string;
  pic_phone_two?: string;
}

interface EventDetails {
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  event: string;
  remark: string;
}

interface TaskDetails {
  task: string;
  assign_to: string;
  start_date: string;
  end_date: string;
  status: string;
}

// ✅ Added Followup Interface
interface FollowupDetails {
  followup: string;
  followup_topic: string;
  start_date: string;
  end_date: string;
  remark: string;
}

interface FormData {
  account_holder: string;
  account_name: string;
  opportunity: string;
  make: string;
  sub_make: string;
  sub_make_brand: string;
  pic: string;
  contact_person: string;
  designation: string;
  department: string;
  mobile_number: string;
  email_id: string;
  location: string;
  state: string;
  city: string;
  address: string;
  qty: string;
  values: number;
  exp_closure_date: string;
  exp_po_date: string;
  remarks?: string | null;
  hardware_amount: number;
  software_amount: number;
  consumables_amount: number;
  automation_amount: number;
  solution_amount: number;
  implementation_amount: number;
  others_amount: number;
  total_amount: number;
  status: string | null;
  vertical: string | null;
  last_update: string | null;
  opportunity_stages: Stage[];
  opportunity_pic: PicDetails[];
  opportunity_event: EventDetails[];
  opportunity_task: TaskDetails[];
  opportunity_followup: FollowupDetails[]; // ✅ Added Followup Array
}

// ── Initial Form Data ─────────────────────────────────────────────────────────

const initialFormData: FormData = {
  account_holder: '',
  account_name: '',
  opportunity: '',
  make: '',
  sub_make: '',
  sub_make_brand: '',
  pic: '',
  contact_person: '',
  designation: '',
  department: '',
  mobile_number: '',
  email_id: '',
  location: '',
  state: '',
  city: '',
  address: '',
  qty: '',
  values: 0,
  exp_closure_date: '',
  exp_po_date: '',
  remarks: null,
  hardware_amount: 0,
  software_amount: 0,
  consumables_amount: 0,
  automation_amount: 0,
  solution_amount: 0,
  implementation_amount: 0,
  others_amount: 0,
  total_amount: 0,
  status: null,
  vertical: null,
  last_update: '',
  opportunity_stages: [],
  opportunity_pic: [],
  opportunity_event: [],
  opportunity_task: [],
  opportunity_followup: [], // ✅ Added to initial data
};

// ── Main Component ────────────────────────────────────────────────────────────

const EditAdminOpportunityWorkspace: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();

  // ✅ Fix 3: Safely grab the ID from URL to prevent 'undefined' saving error
  const { id: paramId } = useParams<{ id: string }>();
  const id = paramId || location.pathname.split('/').pop();

  useEffect(() => {
    if (id) {
      dispatch(fetchAdminOpportunityWorkspaceUserById(id) as any);
    }
  }, [id, dispatch]);

  const { data, formData } = useSelector(
    (state: RootState) => state.EditAdminOpportunityWorkspaceData
  );

  useEffect(() => {
    if (data?.message === "success") {
      alert("Opportunity Form Submitted successfully");
      dispatch(clearEditOpportunityData());
      navigate("/AdminOpportunityWorkspaceTable");
    } else if (data?.message && data.message !== "success") {
      dispatch(clearEditOpportunityData());
      alert("Submission failed");
    }
  }, [data, navigate]);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const newErrors: { [key: string]: string } = {};
    if (!formData?.account_name) {
      newErrors.account_name = "Account Name is required";
    }
    if (!formData?.exp_po_date) {
      newErrors.exp_po_date = "Exp PO Date is required";
    }
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      const focusField = Object.keys(newErrors)[0];
      const fieldElement = document.getElementById(focusField);
      if (fieldElement) {
        fieldElement.scrollIntoView({ behavior: "smooth", block: "center" });
        (fieldElement as HTMLInputElement).focus();
      }
      return;
    }

    const userConfirmed = window.confirm("Do you want to save the changes?");
    if (userConfirmed) {
      if (formData && id) {
        console.log("Submitting Form Data with ID:", id, formData);
        dispatch(postAdminEditOpportunityWorkspaceForm({ id, formData }));
      } else {
        console.warn("Form data or ID is incomplete or missing. ID:", id);
      }
    } else {
      console.log("User canceled the save action.");
    }
  };

  return (
    <div className="p-5 overflow-y-auto flex flex-col gap-5">

      {/* Page Header */}
      <div className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-500 shadow-md mt-2">
        <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
          <Target size={18} color="white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white leading-tight">Opportunity Workspace</h1>
          <p className="text-indigo-100 text-xs mt-0.5">Monitor and edit all your data</p>
        </div>
      </div>

      {/* Account Details */}
      <AccountDetails errors={errors} />

      {/* Progress Bar */}
      <ProgressBar />

      {/* Stage + PIC row */}
      <div className="flex gap-4 items-start">
        <div className="w-[39%] shrink-0">
          <StageData />
        </div>
        <div className="flex-1 min-w-0">
          <PicData />
        </div>
      </div>

      {/* Navigation Bar */}
      <Bar />

      {/* Routed sub-sections */}
      <div className="w-full">
        <Routes>
          <Route path="event/:id"    element={<EventCreation />} />
          <Route path="task/:id"     element={<TaskCreation />} />
          {/* ✅ Fix 2: Added Followup Route */}
          <Route path="followup/:id" element={<EditFollowupCreation />} />
        </Routes>
      </div>

      {/* Save Button */}
      <div className="flex justify-center mt-2 mb-4">
        <button
          type="button"
          onClick={handleSubmit}
          className="flex items-center justify-center gap-2 w-full max-w-sm py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-base font-semibold transition-colors duration-200 shadow-md"
        >
          <CiBookmark size={20} />
          Save
        </button>
      </div>

    </div>
  );
};

export default EditAdminOpportunityWorkspace;
