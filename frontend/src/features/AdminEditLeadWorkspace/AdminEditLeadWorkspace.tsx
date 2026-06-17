// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {type RootState,type AppDispatch } from "../../app/store";
// import {
//   setFormData,
//   submitForm,
//   clearEditLeadWorkspaceData,
//   resetFormData,
//   postAdminEditLeadWorkspaceForm,
//   fetchAdminLeadWorkspaceUserById,
// } from './slice/AdminEditLeadWorkspaceSlice';
// import { CiBookmark } from "react-icons/ci";
// import AccountDetails from "./components/AccountDetails/accountDetails";
// import PicData from "./components/Picdata/Picdata";
// import StageData from "./components/StageData/Stagedata";
// import styles from "./AdminEditLeadWorkspace.module.css";
// import { Route, Routes, useNavigate, useParams } from "react-router-dom";


// // Interfaces for Various Details


// // Main Component
// const AdminEditLeadWorkspace: React.FC = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const navigate = useNavigate();
//   const { id } = useParams<{ id: string }>();
//   const { loading, data, error, formData } = useSelector(
//     (state: RootState) => state.AdminEditLeadWorkspaceData
//   );


//   useEffect(() => {
//     if (id) {
//       dispatch(fetchAdminLeadWorkspaceUserById(id) as any);

//     }
//   }, []);

//   console.log(data)
//   const { user } = useSelector((state: RootState) => state.userLoginAuth);



//   useEffect(() => {
//     if (data?.message === "success") {
//       alert("Lead Form Edited successfully");
//       dispatch(clearEditLeadWorkspaceData());
//       dispatch(resetFormData());

//       // Navigate based on user role
//       if (user?.role === "lead") {
//         navigate("/user/UserHome");
//       } else if (user?.role === "admin") {
//         navigate("/AdminLeadWorkspaceList");
//       }
//     } else if (data?.message && data.message !== "success") {
//       dispatch(clearEditLeadWorkspaceData());
//       alert("Submission failed");
//     }
//   }, [data, navigate]);



//   const [isCollapsed, setIsCollapsed] = useState(false);


//   // Handle PIC Data Change (Dispatch to Redux)
//   const handlePicDataChange = (field: string, value: string) => {
//     dispatch(setFormData({ id: field, value }));
//   };



//   const [errors, setErrors] = useState<{ [key: string]: string }>({});
//   // Form Submission (With Validation)
//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();

//     const newErrors: { [key: string]: string } = {};
//     if (!formData?.account_name) {
//       newErrors.account_name = "Account Name is required";
//     }
//     else if (!formData?.assign_to) {
//       newErrors.assign_to = "Assign To is required";
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
//       if (formData && id) {
//         console.log("Submitting Form Data with ID:", id, formData);
//         dispatch(postAdminEditLeadWorkspaceForm({ id, formData })); // Dispatch with both id and formData
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
//         <p className={styles.subhead}>Lead Workspace</p>
//         <p className={styles.subtext}>Monitor and edit all your data</p>
//       </div>
//       <div className={styles.accountwrapper}>
//         <AccountDetails errors={errors} />
//       </div>

//       <div className={styles.row}>
//         <div className={styles.summaryOverview}>
//           <StageData />
//         </div>
//         <div className={styles.listOfOpportunities}>
//           <PicData />
//         </div>
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

// export default AdminEditLeadWorkspace;


import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { type RootState, type AppDispatch } from "../../app/store";
import {
  setFormData,
  submitForm,
  clearEditLeadWorkspaceData,
  resetFormData,
  postAdminEditLeadWorkspaceForm,
  fetchAdminLeadWorkspaceUserById,
} from './slice/AdminEditLeadWorkspaceSlice';
import { CiBookmark } from "react-icons/ci";
import { Layers } from "lucide-react";
import AccountDetails from "./components/AccountDetails/accountDetails";
import PicData from "./components/Picdata/Picdata";
import StageData from "./components/StageData/Stagedata";
import { Route, Routes, useNavigate, useParams } from "react-router-dom";

// ─── Component ────────────────────────────────────────────────────────────────

const AdminEditLeadWorkspace: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const { loading, data, error, formData } = useSelector(
    (state: RootState) => state.AdminEditLeadWorkspaceData
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchAdminLeadWorkspaceUserById(id) as any);
    }
  }, []);

  console.log(data);

  const { user } = useSelector((state: RootState) => state.userLoginAuth);

  useEffect(() => {
    if (data?.message === "success") {
      alert("Lead Form Edited successfully");
      dispatch(clearEditLeadWorkspaceData());
      dispatch(resetFormData());

      // Navigate based on user role
      if (user?.role === "lead") {
        navigate("/user/UserHome");
      } else if (user?.role === "admin") {
        navigate("/AdminLeadWorkspaceList");
      }
    } else if (data?.message && data.message !== "success") {
      dispatch(clearEditLeadWorkspaceData());
      alert("Submission failed");
    }
  }, [data, navigate]);

  const [isCollapsed, setIsCollapsed] = useState(false);

  // Handle PIC Data Change (Dispatch to Redux)
  const handlePicDataChange = (field: string, value: string) => {
    dispatch(setFormData({ id: field, value }));
  };

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Form Submission (With Validation)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { [key: string]: string } = {};
    if (!formData?.account_name) {
      newErrors.account_name = "Account Name is required";
    } else if (!formData?.assign_to) {
      newErrors.assign_to = "Assign To is required";
    }

    // Set errors
    setErrors(newErrors);

    // If there are errors, scroll to the first field with an error
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
        dispatch(postAdminEditLeadWorkspaceForm({ id, formData }));
      } else {
        console.warn("Form data or ID is incomplete or missing.");
      }
    } else {
      console.log("User canceled the save action.");
    }
  };

  return (
    <div className="p-5 overflow-y-auto flex flex-col gap-5">

      {/* Page Header */}
      <div className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-500 shadow-md mt-2">
        <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
          <Layers size={18} color="white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white leading-tight">Lead Workspace</h1>
          <p className="text-violet-100 text-xs mt-0.5">Monitor and edit all your data</p>
        </div>
      </div>

      {/* Account Details */}
      <AccountDetails errors={errors} />

      {/* Stage + PIC row */}
      <div className="flex gap-4 items-start">
        <div className="w-[39%] shrink-0">
          <StageData />
        </div>
        <div className="flex-1 min-w-0">
          <PicData />
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-center mt-2 mb-4">
        <button
          type="button"
          onClick={handleSubmit}
          className="flex items-center justify-center gap-2 w-full max-w-sm py-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-base font-semibold transition-colors duration-200 shadow-md"
        >
          <CiBookmark size={20} />
          Save
        </button>
      </div>

    </div>
  );
};

export default AdminEditLeadWorkspace;
