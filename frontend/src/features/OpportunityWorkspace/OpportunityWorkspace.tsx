
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../app/store";
import {
  setFormData, submitForm, postOpportunityWorkspaceForm,
  clearOpportunityData, resetFormData, type FollowupDetails,
} from './slice/opportunitySlice';
import { CiBookmark } from "react-icons/ci";
import { Target } from "lucide-react";
import AccountDetails from "./components/AccountDetails/accountDetails";
import PicData from "./components/Picdata/Picdata";
import StageData from "./components/StageData/Stagedata";
import Bar from "./components/Bar/Bar";
import ProgressBar from "./components/ProgressBar/Progressbar";
import EventCreation from "./components/Bar/Componetns/EventCreation/EventCreation";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import TaskCreation from "./components/Bar/Componetns/TaskCreation/TaskCreation";
import { fetchAccountNamesData } from "../CommonAPI/FetchAccountNames/FetchAccountNamesSlice";
import FollowupCreation from "./components/Bar/Componetns/Followupcreation/Followupcreation";
import QuotationGeneration from "./components/Bar/Componetns/QuotationGeneration/QuotationGeneration";

// ─── Interfaces ───────────────────────────────────────────────────────────────

interface Stage { stages: string; month: string; ranks: string; lost_reason?: string; }
interface PicDetails { pic_department: string; pic_name: string; pic_designation: string; pic_email: string; pic_phone: string; pic_phone_two?: string; }
interface EventDetails { start_date: string; end_date: string; start_time: string; end_time: string; event: string; remark: string; }
interface TaskDetails { task: string; assign_to: string; start_date: string; end_date: string; status: string; }
interface FormData {
  account_holder: string; account_name: string; opportunity: string; make: string;
  sub_make: string; sub_make_brand: string; pic: string; contact_person: string;
  designation: string; department: string; mobile_number: string; email_id: string;
  location: string; state: string; city: string; address: string; description: string; qty: string;
  values: number; exp_closure_date: string; exp_po_date: string; remarks?: string | null;
  hardware_amount: number; software_amount: number; consumables_amount: number;
  automation_amount: number; implementation_amount: number; solution_amount: number; maintenance_amount: number;
  others_amount: number; total_amount: number | null; status: string | null;
  vertical: string | null; last_update: string | null; sales_type: string;
  sales_type_value: number; opportunity_stages: Stage[]; opportunity_pic: PicDetails[];
  opportunity_event: EventDetails[]; opportunity_task: TaskDetails[];
  opportunity_followup: FollowupDetails[];
}

const initialFormData: FormData = {
  account_holder: '', account_name: '', opportunity: '', make: '', sub_make: '',
  sub_make_brand: '', pic: '', contact_person: '', designation: '', department: '',
  mobile_number: '', email_id: '', location: '', state: '', city: '', address: '',
  description: '',
  qty: '', values: 0, exp_closure_date: '', exp_po_date: '', remarks: null,
  hardware_amount: 0, software_amount: 0, consumables_amount: 0, automation_amount: 0,
  implementation_amount: 0,
  solution_amount: 0, maintenance_amount: 0, others_amount: 0, total_amount: null,
  status: null, vertical: null, last_update: '', sales_type: '', sales_type_value: 0,
  opportunity_stages: [], opportunity_pic: [], opportunity_event: [],
  opportunity_task: [], opportunity_followup: [],
};

// ─── Component ────────────────────────────────────────────────────────────────

const OpportunityWorkspace: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, data, error, formData } = useSelector(
    (state: RootState) => state.postOpportunityWorkspaceData
  );

  const isUser = location.pathname.startsWith("/user");

  useEffect(() => {
    if (data?.message === "Success") {
      alert("Opportunity Form Submitted successfully");
      dispatch(clearOpportunityData());
      dispatch(resetFormData());
      if (isUser) { navigate("/user/OpportunityWorkspaceTable"); }
      else { navigate("/AdminOpportunityWorkspaceTable"); }
    } else if (data?.message && data.message !== "Success") {
      dispatch(clearOpportunityData());
      alert("Submission failed");
    }
  }, [data, navigate, dispatch, isUser]);

  useEffect(() => {
    if (error) {
      alert(`Submission failed: ${error}`);
    }
  }, [error]);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleSubmit = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData?.account_name) newErrors.account_name = "Account Name is required";
    if (!formData?.exp_po_date) newErrors.exp_po_date = "Exp PO Date is required";
    if (!formData?.opportunity_stages?.[0]?.stages) newErrors.stage = "Stage is required";
    if (!formData?.opportunity_stages?.[0]?.month) newErrors.stage_month = "Month is required";
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
        dispatch(postOpportunityWorkspaceForm(formData));
        console.log("Form submitted successfully:", formData);
      } else {
        console.error("Form data is missing.");
      }
    } else {
      console.log("User canceled the save action.");
    }
    console.log("Form submitted successfully:", formData);
  };

  return (
    <div
      className="p-5 overflow-y-auto flex flex-col gap-5"
      style={{
        background:
          "radial-gradient(ellipse 60% 45% at 0% 0%, rgba(2,132,199,0.18) 0%, transparent 55%), radial-gradient(ellipse 50% 40% at 100% 100%, rgba(16,185,129,0.16) 0%, transparent 60%), linear-gradient(180deg, #eff6ff 0%, #ecfeff 50%, #f8fafc 100%)",
      }}
    >

      {/* Page Header — Dojo-style gradient banner */}
      <div className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-gradient-to-r from-sky-700 via-cyan-600 to-emerald-500 shadow-md mt-2">
        <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
          <Target size={18} color="white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white leading-tight">Opportunity Workspace</h1>
          <p className="text-indigo-100 text-xs mt-0.5">Monitor and edit all your data</p>
        </div>
      </div>

      {/* Account Details */}
      <div className="rounded-2xl p-[2px] bg-gradient-to-r from-sky-500/40 via-cyan-400/30 to-emerald-400/30">
        <div className="rounded-2xl bg-white/80 backdrop-blur-sm">
          <AccountDetails errors={errors} />
        </div>
      </div>

      {/* Progress Bar */}
      <div className="rounded-2xl p-[2px] bg-gradient-to-r from-cyan-500/35 to-emerald-500/30">
        <div className="rounded-2xl bg-white/85 backdrop-blur-sm">
          <ProgressBar />
        </div>
      </div>

      {/* Stage + PIC row */}
      <div className="flex gap-4 items-start">
        <div className="w-[39%] shrink-0 rounded-2xl p-[2px] bg-gradient-to-b from-sky-500/40 to-cyan-400/30">
          <div className="rounded-2xl bg-white/80 backdrop-blur-sm">
            <StageData />
          </div>
        </div>
        <div className="flex-1 min-w-0 rounded-2xl p-[2px] bg-gradient-to-b from-cyan-500/35 to-emerald-400/30">
          <div className="rounded-2xl bg-white/80 backdrop-blur-sm">
            <PicData />
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="rounded-2xl p-[2px] bg-gradient-to-r from-sky-500/35 to-emerald-500/30">
        <div className="rounded-2xl bg-white/85 backdrop-blur-sm">
          <Bar />
        </div>
      </div>

      {/* Routed sub-sections */}
      <div className="w-full">
        <Routes>
          <Route path="event"   element={<EventCreation />} />
          <Route path="task"    element={<TaskCreation />} />
          <Route path="quote"   element={<QuotationGeneration />} />
          <Route path="followup" element={<FollowupCreation />} />
        </Routes>
      </div>

      {/* Save Button */}
      <div className="flex justify-center mt-2 mb-4">
        <button
          type="button"
          onClick={handleSubmit}
          className="flex items-center justify-center gap-2 w-full max-w-sm py-3 rounded-xl text-white text-base font-semibold transition-all duration-200 shadow-md"
          style={{ background: "linear-gradient(120deg, #0369a1 0%, #0891b2 52%, #10b981 100%)" }}
        >
          <CiBookmark size={20} />
          Save
        </button>
      </div>

    </div>
  );
};

export default OpportunityWorkspace;
