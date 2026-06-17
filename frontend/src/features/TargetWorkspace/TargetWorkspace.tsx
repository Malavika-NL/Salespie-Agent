// import React, { useEffect, useState } from 'react';
// import styles from './TargetWorkspace.module.css';
// import Navbar from '../UserDashboard/components/navbar/navbar';
// import UserSidebar from '../UserHome/components/UserSidebar/userSidebar';
// import AccountDetails from './components/AccountDetails/accountDetails';
// import AccountMapping from './components/AccountMapping/AccountMapping';
// import { FaRegEdit } from "react-icons/fa";
// import { CiBookmark } from "react-icons/ci";
// import { useDispatch, useSelector } from 'react-redux';
// import { accountForm, clearAccountData } from '../AccountForm/slice/accountFormSlice';
// import { getCurrentDate } from '../currentDate/date';
// import {type AppDispatch,type RootState } from '../../app/store';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { targetWorkspaceData, submitForm, clearResponseData, resetFormData } from './Slice/TargetWorkspaceSlice';



// type Contact = {
//   category: string;
//   name: string;
//   designation: string;
//   mobile_no: string;
//   email_id: string;
// };

// type Finance = {
//   turn_over: number;
//   account_resumable: number;
//   credits: number;
// };

// type Company = {
//   company_type: string;
//   account_type: string;
//   company_scale: string;
// };

// type FormData = {
//   account_holder: string;
//   account_name: string;
//   department: string;
//   vertical: string;
//   vertical_sub: string | null;
//   pic: string;
//   designation: string;
//   business: string;
//   region: string;
//   mobile_number: string;
//   email_id: string;
//   location: string;
//   state: string;
//   city: string;
//   address: string;
//   activity: string;
//   activity_date: string;
//   next_action: string;
//   remarks: string;
//   next_action_date: string;
//   acct_created_date: string;
//   last_update: string | null;
//   targetcontacts: Contact[];
//   finance: Finance[];
//   company: Company[];
// };

// const TargetWorkspace: React.FC = () => {

//   const navigate = useNavigate();
//    const location = useLocation();
//   const [isCollapsed, setIsCollapsed] = useState(false);
//   const [currentDate, setCurrentDate] = useState<string>('');

//   const { loading, data, error, formData } = useSelector(
//     (state: RootState) => state.TargetWorkspaceData
//   );


   
//    const isUser = location.pathname.startsWith("/user");  
//   useEffect(() => {

//     if (data?.message === "Success") {
//       alert("Target Form Submitted successfully");
//       dispatch(clearResponseData());
//       dispatch(resetFormData());
//       if (isUser) {
//         navigate("/user/TargetWorkspaceTable");
//       } else {
//         navigate("/AdminTargetWorkspaceTable");
//       }
  
     
//     } else if (data?.message && data.message !== "Success") {
//       alert("Submission failed");
//       dispatch(clearResponseData());
//     }
//   }, [data, navigate]);
//   // Initialize the formData with the structure

//   const dispatch = useDispatch<AppDispatch>();
//   const [errors, setErrors] = useState<{ [key: string]: string }>({});


//   // console.log('errors',errors)
//   const handleSubmit = () => {
//     const newErrors: { [key: string]: string } = {};

//     // Validate required fields
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

//       return; // Stop submission
//     }

//     const userConfirmed = window.confirm("Do you want to save the changes?");
//     if (userConfirmed) {
//       if (formData) {
//         dispatch(targetWorkspaceData(formData) as any); // Dispatch the submitForm action with formData
//         console.log("Form submitted successfully:", formData);
//       } else {
//         console.error("Form data is missing.");
//       }
//     } else {
//       console.log(" canceled the save action.");
//     }
//     // Dispatch the submitForm action with formData if no errors


//     // Log the data for debugging
//     console.log("Form submitted successfully:", formData);
//   };




//   return (
//     <div className={styles.mainContent}>
//       <div className={styles.head}>
//         <p className={styles.subhead}>Target Workspace</p>
//         <p className={styles.subtext}>Monitor and edit all your data</p>
//       </div>
//       <div className={styles.accountwrapper}>
//         <AccountDetails

//           errors={errors}
//         />
//       </div>
//       <AccountMapping />

      

//       <div className={styles.buttonContainer}>
//         <button
//           type="button"
//           className={styles.savebutton}
//           onClick={handleSubmit}
//         >
//           <CiBookmark color="white" size={20} style={{ marginRight: "5px" }} />
//           Save
//         </button>
//       </div>
//     </div>
//   );
// };

// export default TargetWorkspace;




import React, { useEffect, useState } from 'react';
import AccountDetails from './components/AccountDetails/accountDetails';
import AccountMapping from './components/AccountMapping/AccountMapping';
import { CiBookmark } from "react-icons/ci";
import { Crosshair } from "lucide-react";
import { useDispatch, useSelector } from 'react-redux';
import { type AppDispatch, type RootState } from '../../app/store';
import { useLocation, useNavigate } from 'react-router-dom';
import { targetWorkspaceData, clearResponseData, resetFormData } from './Slice/TargetWorkspaceSlice';

// ─── Types ────────────────────────────────────────────────────────────────────

type Contact = { category: string; name: string; designation: string; mobile_no: string; email_id: string; };
type Finance = { turn_over: number; account_resumable: number; credits: number; };
type Company = { company_type: string; account_type: string; company_scale: string; };
type FormData = {
  account_holder: string; account_name: string; department: string; vertical: string;
  vertical_sub: string | null; pic: string; designation: string; business: string;
  region: string; mobile_number: string; email_id: string; location: string;
  state: string; city: string; address: string; activity: string; activity_date: string;
  next_action: string; remarks: string; next_action_date: string;
  acct_created_date: string; last_update: string | null;
  targetcontacts: Contact[]; finance: Finance[]; company: Company[];
};

// ─── Component ────────────────────────────────────────────────────────────────

const TargetWorkspace: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const { loading, data, error, formData } = useSelector((state: RootState) => state.TargetWorkspaceData);
  const dispatch = useDispatch<AppDispatch>();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const isUser = location.pathname.startsWith("/user");

  useEffect(() => {
    if (data?.message === "Success") {
      alert("Target Form Submitted successfully");
      dispatch(clearResponseData());
      dispatch(resetFormData());
      if (isUser) { navigate("/user/TargetWorkspaceTable"); }
      else { navigate("/AdminTargetWorkspaceTable"); }
    } else if (data?.message && data.message !== "Success") {
      alert("Submission failed");
      dispatch(clearResponseData());
    }
  }, [data, navigate]);

  const handleSubmit = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData?.account_name) newErrors.account_name = "Account Name is required";
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
      if (formData) {
        dispatch(targetWorkspaceData(formData) as any);
        console.log("Form submitted successfully:", formData);
      } else {
        console.error("Form data is missing.");
      }
    } else {
      console.log("canceled the save action.");
    }
    console.log("Form submitted successfully:", formData);
  };

  return (
    <div
      className="p-5 overflow-y-auto flex flex-col gap-5"
      style={{
        background:
          "radial-gradient(ellipse 62% 45% at 0% 0%, rgba(3,105,161,0.16) 0%, transparent 58%), radial-gradient(ellipse 52% 40% at 100% 100%, rgba(20,184,166,0.16) 0%, transparent 62%), linear-gradient(180deg, #f0fdfa 0%, #eff6ff 48%, #f8fafc 100%)",
      }}
    >

      {/* Page Header — consistent gradient banner */}
      <div className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-gradient-to-r from-teal-700 via-cyan-600 to-sky-500 shadow-md mt-2">
        <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
          <Crosshair size={18} color="white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white leading-tight">Target Workspace</h1>
          <p className="text-blue-100 text-xs mt-0.5">Monitor and edit all your data</p>
        </div>
      </div>

      {/* Account Details */}
      <div className="rounded-2xl p-[2px] bg-gradient-to-r from-teal-500/40 via-cyan-400/30 to-sky-400/30">
        <div className="rounded-2xl bg-white/80 backdrop-blur-sm">
          <AccountDetails errors={errors} />
        </div>
      </div>

      {/* Account Mapping */}
      <div className="rounded-2xl p-[2px] bg-gradient-to-r from-cyan-500/35 to-teal-500/30">
        <div className="rounded-2xl bg-white/80 backdrop-blur-sm">
          <AccountMapping />
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-center mt-2 mb-4">
        <button
          type="button"
          onClick={handleSubmit}
          className="flex items-center justify-center gap-2 w-full max-w-sm py-3 rounded-xl text-white text-base font-semibold transition-all duration-200 shadow-md"
          style={{ background: "linear-gradient(120deg, #0f766e 0%, #0891b2 50%, #0284c7 100%)" }}
        >
          <CiBookmark size={20} />
          Save
        </button>
      </div>

    </div>
  );
};

export default TargetWorkspace;
