// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {type RootState,type AppDispatch } from "../../app/store";
// import {
//   setFormData,
//   submitForm,
//   postEditOpportunityWorkspaceForm,
//   fetchOpportunityWorkspaceUserById,
//   clearEditOpportunityData,
// } from './slice/EditOpportunityWorkspace';


// import AccountDetails from "./components/AccountDetails/accountDetails";
// import PicData from "./components/Picdata/Picdata";
// import StageData from "./components/StageData/Stagedata";
// import Bar from "./components/Bar/Bar";
// import ProgressBar from "./components/ProgressBar/Progressbar";
// import styles from "./EditOpportunityWorkspace.module.css";
// import { CiBookmark } from "react-icons/ci";
// import { Route, Routes, useNavigate, useParams } from "react-router-dom";
// import EventCreation from "./components/Bar/Componetns/EventCreation/EventCreation";
// import TaskCreationForm from "./components/Bar/Componetns/TaskCreation/TaskCreationForm/TaskCreationForm";

// // Interfaces for Various Details


// // Main Component
// const EditOpportunityWorkspace: React.FC = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch<AppDispatch>();
//   const { id } = useParams<{ id: string }>();
//   // console.log(id)
//   useEffect(() => {
//     if (id) {
//       dispatch(fetchOpportunityWorkspaceUserById(id) as any);
//     }
//   }, [id, dispatch]);


//   const { loading, data, error, formData } = useSelector(
//     (state: RootState) => state.postEditOpportunityWorkspaceForm
//   );
//   console.log('final data ', formData)

//   useEffect(() => {

//     if (data?.message === "success") {
//       alert("Opportunity Form  Submitted successfully");
//       dispatch(clearEditOpportunityData());
//       navigate("/user/OpportunityWorkspaceTable"); // Redirect to UserHome

//     } else if (data?.message && data.message !== "success") {
//       dispatch(clearEditOpportunityData());
//       alert("Submission failed");

//     }
//   }, [data, navigate]);




//   const [errors, setErrors] = useState<{ [key: string]: string }>({});

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
//         dispatch(postEditOpportunityWorkspaceForm({ id, formData })); // Dispatch with both id and formData
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
//           <Route path="task/:id" element={<TaskCreationForm />} />
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

// export default EditOpportunityWorkspace;

// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { type RootState, type AppDispatch } from "../../app/store";
// import {
//   postEditOpportunityWorkspaceForm,
//   fetchOpportunityWorkspaceUserById,
//   clearEditOpportunityData,
// } from './slice/EditOpportunityWorkspace';

// import AccountDetails from "./components/AccountDetails/accountDetails";
// import PicData from "./components/Picdata/Picdata";
// import StageData from "./components/StageData/Stagedata";
// import Bar from "./components/Bar/Bar";
// import ProgressBar from "./components/ProgressBar/Progressbar";
// import styles from "./EditOpportunityWorkspace.module.css";
// import { CiBookmark } from "react-icons/ci";
// import { Route, Routes, useNavigate, useParams } from "react-router-dom";

// // ✅ Import the full wrappers, NOT just the form
// import EventCreation from "./components/Bar/Componetns/EventCreation/EventCreation";
// import TaskCreation from "./components/Bar/Componetns/TaskCreation/TaskCreation";
// import EditFollowupCreation from "./components/Bar/Componetns/FollowupCreation/EditFollowupCreation";

// const EditOpportunityWorkspace: React.FC = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch<AppDispatch>();
//   const { id } = useParams<{ id: string }>();

//   useEffect(() => {
//     if (id) {
//       dispatch(fetchOpportunityWorkspaceUserById(id) as any);
//     }
//   }, [id, dispatch]);

//   const { data, formData } = useSelector(
//     (state: RootState) => state.postEditOpportunityWorkspaceForm
//   );

//   useEffect(() => {
//     if (data?.message === "success") {
//       alert("Opportunity Form Submitted successfully");
//       dispatch(clearEditOpportunityData());
//       navigate("/user/OpportunityWorkspaceTable");
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
//         dispatch(postEditOpportunityWorkspaceForm({ id, formData }));
//       } else {
//         console.warn("Form data or ID is incomplete or missing.");
//       }
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
//           {/* ✅ EventCreation already has its own UpcomingEvents inside */}
//           <Route path="event/:id" element={<EventCreation />} />
//           {/* ✅ TaskCreation now includes TaskCreationForm + UpcomingTasks */}
//           <Route path="task/:id" element={<TaskCreation />} />
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

// export default EditOpportunityWorkspace;

// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { type RootState, type AppDispatch } from "../../app/store";
// import {
//   postEditOpportunityWorkspaceForm,
//   fetchOpportunityWorkspaceUserById,
//   clearEditOpportunityData,
// } from './slice/EditOpportunityWorkspace';

// import AccountDetails from "./components/AccountDetails/accountDetails";
// import PicData from "./components/Picdata/Picdata";
// import StageData from "./components/StageData/Stagedata";
// import Bar from "./components/Bar/Bar";
// import ProgressBar from "./components/ProgressBar/Progressbar";
// import styles from "./EditOpportunityWorkspace.module.css";
// import { CiBookmark } from "react-icons/ci";
// import { Route, Routes, useLocation, useNavigate, useParams } from "react-router-dom"; // ✅ Added useLocation

// import EventCreation from "./components/Bar/Componetns/EventCreation/EventCreation";
// import TaskCreation from "./components/Bar/Componetns/TaskCreation/TaskCreation";
// import EditFollowupCreation from "./components/Bar/Componetns/FollowupCreation/EditFollowupCreation";

// const EditOpportunityWorkspace: React.FC = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch<AppDispatch>();
//   const location = useLocation(); // ✅ Used to safely grab the ID
  
//   // ✅ FIX 1: Safely grab the ID. If useParams loses it because of nested routes, grab it from the end of the URL.
//   const { id: paramId } = useParams<{ id: string }>();
//   const id = paramId || location.pathname.split('/').pop(); 

//   useEffect(() => {
//     if (id) {
//       dispatch(fetchOpportunityWorkspaceUserById(id) as any);
//     }
//   }, [id, dispatch]);

//   const { data, formData } = useSelector(
//     (state: RootState) => state.postEditOpportunityWorkspaceForm
//   );

//   useEffect(() => {
//     if (data?.message === "success") {
//       alert("Opportunity Form Submitted successfully");
//       dispatch(clearEditOpportunityData());
//       navigate("/user/OpportunityWorkspaceTable");
//     } else if (data?.message && data.message !== "success") {
//       dispatch(clearEditOpportunityData());
//       alert("Submission failed");
//     }
//   }, [data, navigate]);

//   const [errors, setErrors] = useState<{ [key: string]: string }>({});

//   // ✅ FIX 2: Changed to React.MouseEvent since this is triggered by a Button click, not a Form
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
//       // ✅ Now `id` will always exist!
//       if (formData && id) {
//         dispatch(postEditOpportunityWorkspaceForm({ id, formData }));
//       } else {
//         console.warn("Form data or ID is incomplete or missing. ID:", id);
//       }
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

// export default EditOpportunityWorkspace;




import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { type RootState, type AppDispatch } from "../../app/store";
import {
  postEditOpportunityWorkspaceForm,
  fetchOpportunityWorkspaceUserById,
  clearEditOpportunityData,
} from './slice/EditOpportunityWorkspace';
import { CiBookmark } from "react-icons/ci";
import { Target } from "lucide-react";
import AccountDetails from "./components/AccountDetails/accountDetails";
import PicData from "./components/Picdata/Picdata";
import StageData from "./components/StageData/Stagedata";
import Bar from "./components/Bar/Bar";
import ProgressBar from "./components/ProgressBar/Progressbar";
import { Route, Routes, useLocation, useNavigate, useParams } from "react-router-dom";
import EventCreation from "./components/Bar/Componetns/EventCreation/EventCreation";
import TaskCreation from "./components/Bar/Componetns/TaskCreation/TaskCreation";
import EditFollowupCreation from "./components/Bar/Componetns/FollowupCreation/EditFollowupCreation";

// ─── Component ────────────────────────────────────────────────────────────────

const EditOpportunityWorkspace: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();

  // ✅ FIX 1: Safely grab the ID. If useParams loses it because of nested routes, grab it from the end of the URL.
  const { id: paramId } = useParams<{ id: string }>();
  const id = paramId || location.pathname.split('/').pop();

  useEffect(() => {
    if (id) {
      dispatch(fetchOpportunityWorkspaceUserById(id) as any);
    }
  }, [id, dispatch]);

  const { data, formData } = useSelector(
    (state: RootState) => state.postEditOpportunityWorkspaceForm
  );

  useEffect(() => {
    if (data?.message === "success") {
      alert("Opportunity Form Submitted successfully");
      dispatch(clearEditOpportunityData());
      navigate("/user/OpportunityWorkspaceTable");
    } else if (data?.message && data.message !== "success") {
      dispatch(clearEditOpportunityData());
      alert("Submission failed");
    }
  }, [data, navigate]);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // ✅ FIX 2: Changed to React.MouseEvent since this is triggered by a Button click, not a Form
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
      // ✅ Now `id` will always exist!
      if (formData && id) {
        dispatch(postEditOpportunityWorkspaceForm({ id, formData }));
      } else {
        console.warn("Form data or ID is incomplete or missing. ID:", id);
      }
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="p-5 overflow-y-auto flex flex-col gap-5">

      {/* Page Header — gradient banner */}
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
          <Route path="event/:id"   element={<EventCreation />} />
          <Route path="task/:id"    element={<TaskCreation />} />
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

export default EditOpportunityWorkspace;
