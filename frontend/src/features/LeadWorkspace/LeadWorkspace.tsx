import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { type RootState, type AppDispatch } from "../../app/store";
import {
  setFormData, submitForm, postLeadWorkspaceForm,
  clearOpportunityData, resetFormData,
} from './slice/LeadWorkspace';
import { CiBookmark } from "react-icons/ci";
import { Layers } from "lucide-react";
import AccountDetails from "./components/AccountDetails/accountDetails";
import PicData from "./components/Picdata/Picdata";
import StageData from "./components/StageData/Stagedata";
import { Route, Routes, useNavigate } from "react-router-dom";
import { getUserDetails } from "../lead/slice/leadFormSlice";

// ─── Component ────────────────────────────────────────────────────────────────

const LeadWorkspace: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { loading, data, error, formData } = useSelector((state: RootState) => state.postLeadWorkspaceData);
  console.log(formData);

  const { user } = useSelector((state: RootState) => state.userLoginAuth);
  console.log('current user', user);

  useEffect(() => {
    if (data?.message === "Success") {
      alert("Lead Form Submitted successfully");
      if (user?.role === "admin") {
        navigate("/AdminLeadDashboard");
        dispatch(clearOpportunityData());
        dispatch(resetFormData());
      } else if (user?.role === "lead") {
        navigate("/user/AdminLeadDashboard");
        dispatch(clearOpportunityData());
        dispatch(resetFormData());
      } else {
        navigate("/user/UserLeadDashboad");
        dispatch(clearOpportunityData());
        dispatch(resetFormData());
      }
    } else if (data?.message && data.message !== "Success") {
      dispatch(clearOpportunityData());
      alert("Submission failed");
    }
  }, [data, navigate]);

  console.log('message', data.message);

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!formData?.account_name) {
      newErrors.account_name = "Account Name is required";
    } else if (!formData?.assign_to) {
      newErrors.assign_to = "Assign To is required";
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
      if (formData) {
        console.log("Submitting Form Data:", formData);
        dispatch(postLeadWorkspaceForm(formData));
      } else {
        console.warn("Form data is incomplete or missing.");
      }
    } else {
      console.log("User canceled the save action.");
    }
  };

  return (
    <div
      className="p-5 overflow-y-auto flex flex-col gap-5 relative"
      style={{
        background:
          "radial-gradient(ellipse 60% 45% at 0% 0%, rgba(14,116,144,0.18) 0%, transparent 56%), radial-gradient(ellipse 50% 40% at 100% 100%, rgba(251,146,60,0.16) 0%, transparent 62%), linear-gradient(180deg, #ecfeff 0%, #eff6ff 46%, #f8fafc 100%)",
      }}
    >

      {/* Page Header — Dojo-style gradient banner */}
      <div className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-gradient-to-r from-cyan-700 via-sky-600 to-amber-500 shadow-md mt-2">
        <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
          <Layers size={18} color="white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white leading-tight">Lead Workspace</h1>
          <p className="text-violet-100 text-xs mt-0.5">Monitor and edit all your data</p>
        </div>
      </div>

      {/* Account Details */}
      <div className="rounded-2xl p-[2px] bg-gradient-to-r from-cyan-500/40 via-sky-400/30 to-amber-400/35">
        <div className="rounded-2xl bg-white/80 backdrop-blur-sm">
          <AccountDetails errors={errors} />
        </div>
      </div>

      {/* Stage + PIC row */}
      <div className="flex gap-4 items-start">
        <div className="w-[39%] shrink-0 rounded-2xl p-[2px] bg-gradient-to-b from-cyan-500/40 to-sky-400/30">
          <div className="rounded-2xl bg-white/80 backdrop-blur-sm">
            <StageData />
          </div>
        </div>
        <div className="flex-1 min-w-0 rounded-2xl p-[2px] bg-gradient-to-b from-sky-500/35 to-amber-400/30">
          <div className="rounded-2xl bg-white/80 backdrop-blur-sm">
            <PicData />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-center mt-2 mb-4">
        <button
          type="button"
          onClick={handleSubmit}
          className="flex items-center justify-center gap-2 w-full max-w-sm py-3 rounded-xl text-white text-base font-semibold transition-all duration-200 shadow-md"
          style={{
            background: "linear-gradient(120deg, #0e7490 0%, #0284c7 55%, #f59e0b 100%)",
          }}
        >
          <CiBookmark size={20} />
          Save
        </button>
      </div>

    </div>
  );
};

export default LeadWorkspace;
