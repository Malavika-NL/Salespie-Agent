// import React, { useEffect, useState } from 'react';
// import { DndProvider, useDrag, useDrop } from 'react-dnd';
// import { HTML5Backend } from 'react-dnd-html5-backend';
// import styles from './LeadStatus.module.css';
// import { FiPlusCircle } from "react-icons/fi";
// import { CgArrowsExpandRight } from "react-icons/cg";
// import { FaChevronCircleRight } from "react-icons/fa";
// import { useDispatch, useSelector } from 'react-redux';
// import type { RootState } from '../../../app/store';
// import { fetchAdminLeadWorkspaceList } from '../../AdminLeadWorkspaceList/Slice/AdminLeadWorkspaceListSlice';
// import PopupForm from '../PopupForm/PopupForm';
// import { postEditLeadWorkspaceForm } from '../../EditLeadWorkspace/slice/EditLeadWorkspace';
// import { adminOpportunityFormData } from '../../OpportunityAdminTable/slice/opportunityTableSlice';
// import { postAdminLeadWorkspaceStatus } from './Slice/AdminLeadStatusSlice';
// import { postAdminEditLeadWorkspaceForm } from '../../AdminEditLeadWorkspace/slice/AdminEditLeadWorkspaceSlice';

// const ItemType = {
//     LEAD: 'lead',
// };

// interface Stage {
//     stages: string;
//     ranks: string;
//     lost_reason?: string;
// }

// interface PicDetails {
//     pic_department: string;
//     pic_name: string;
//     pic_designation: string;
//     pic_email: string;
//     pic_phnone: string;
//     pic_phntwo: string;
// }




// interface Lead {
//     id: string;
//     account_holder: string;
//     account_name: string;
//     assign_to: string;
//     business_type: string;
//     lead: string;
//     make: string;
//     sub_make: string;
//     sub_make_brand: string;
//     pic: string;
//     contact_person: string;
//     designation: string;
//     department: string;
//     mobile_number: string;
//     email_id : string;
//     description: string;
//     location: string;
//     state: string;
//     city: string;
//     address: string;
//     qty: string;
//     values: number | null;
//     exp_closure_date: string;
//     exp_po_date: string;
//     remarks?: string | null;
//     acct_created_date: string;
//     hardware_amount: number | null;
//     software_amount: number | null;
//     consumables_amount: number | null;
//     automation_amount: number | null;
//     solution_amount: number | null;
//     maintenance_amount: number | null;
//     others_amount: number | null;
//     total_amount: number | null;
//     status: string | null;
//     vertical: string | null;
//     lead_stages: Stage[];
//     lead_pic: PicDetails[];
//     user: string;
//     // last_update:string |null,
// }


// const LeadStatus: React.FC = () => {
//     const dispatch = useDispatch();
//     const { data } = useSelector((state: RootState) => state.fetchAdminLeadWorkspaceListData);
//     const { AdminOpportunityData, loading, error } = useSelector((state: RootState) => state.adminOpportunityData);

//     const [leadData, setLeadData] = useState<Lead[]>([]);
//     const [opportunityData, setOpportunityData] = useState<any[]>([]);
//     const [showForm, setShowForm] = useState(false);
//     const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
//     useEffect(() => {
//         dispatch(fetchAdminLeadWorkspaceList() as any);
//         // dispatch(adminOpportunityFormData() as any);
//     }, []);


//     console.log('opportunityData lead', AdminOpportunityData)
//     console.log('data lead', data)

//     useEffect(() => {
//         if (data) {
//             setLeadData(data);
//         }
//         if (AdminOpportunityData) {
//             setOpportunityData(AdminOpportunityData);
//         }
//     }, [data, AdminOpportunityData]);

//     const updateLeadDetails = async (formData: Lead) => {
//         console.log('end data', formData);
//         const id = formData.id;

//         if (formData.status === 'opportunity') {
//             const confirmConversion = window.confirm("Are you sure you want to convert this lead to an opportunity?");
//             if (confirmConversion) {
//                 await dispatch(postAdminLeadWorkspaceStatus({ id }) as any);
//                 alert("Lead successfully converted to Opportunity!");
//             } else {
//                 alert("Lead conversion to Opportunity cancelled.");
//                 return;
//             }
//         } else {
//             await dispatch(postAdminEditLeadWorkspaceForm({ id, formData }) as any);
//         }

//         dispatch(fetchAdminLeadWorkspaceList() as any);
//         setShowForm(false);
//     };



//     return (
//         <div className={styles.leadStatus}>

//             <DndProvider backend={HTML5Backend}>
//                 <div className={styles.leadContent}>
                    
//                     <LeadContainer
//                         title="New Leads"
//                         leads={leadData.filter((lead) => lead.status === 'new_lead').reverse()}
//                         onLeadClick={(lead) => { setSelectedLead(lead); setShowForm(true); }}
//                     />
//                     <LeadContainer
//                         title="Follow Up"
//                         leads={leadData.filter((lead) => lead.status === 'follow_up').reverse()}
//                         onLeadClick={(lead) => { setSelectedLead(lead); setShowForm(true); }}
//                     />
//                     <LeadContainer
//                         title="Mktg Review"
//                         leads={leadData.filter((lead) => lead.status === 'marketing_review').reverse()}
//                         onLeadClick={(lead) => { setSelectedLead(lead); setShowForm(true); }}
//                     />
//                     <LeadContainer
//                         title="Progress"
//                         leads={opportunityData.filter((lead) => lead.status === 'progress').reverse()}
//                         // onLeadClick={(lead) => { setSelectedLead(lead); setShowForm(true); }}
//                         onLeadClick={() => { }}
//                     />
//                     <LeadContainer
//                         title="Negotiation"
//                         leads={opportunityData.filter((lead) => lead.status === 'negotiation').reverse()}
//                         // onLeadClick={(lead) => { setSelectedLead(lead); setShowForm(true); }}
//                         onLeadClick={() => { }}
//                     />
//                 </div>
//             </DndProvider>

//             {showForm && selectedLead && (
//                 <PopupForm
//                     lead={selectedLead}
//                     onSave={updateLeadDetails}
//                     onClose={() => setShowForm(false)}
//                 />
//             )}

//         </div>
//     );
// };

// interface LeadContainerProps {
//     title: string;
//     leads: Lead[];
//     onLeadClick: (lead: Lead) => void;
// }

// const LeadContainer: React.FC<LeadContainerProps> = ({ title, leads, onLeadClick }) => {
//     const [, drop] = useDrop({
//         accept: ItemType.LEAD,
//         drop: () => { },
//     });

//     let containerClass = '';
//     switch (title) {
//         case 'New Leads':
//             containerClass = 'NewLeads';
//             break;
//         case 'Follow Up':
//             containerClass = 'FollowUp';
//             break;
//         case 'Mktg Review':
//             containerClass = 'MktgReview';
//             break;
//         case 'Progress':
//             containerClass = 'Progress';
//             break;
//         case 'Negotiation':
//             containerClass = 'Negotiation';
//             break;
//         default:
//             containerClass = '';
//             break;
//     }

//     return (
//         <div ref={drop as any} className={`${styles.leadContainer} ${styles[containerClass]}`}>
//             <div className={styles.title}>
//                 <div>{title}</div>
//                 <div className={styles.iconContainer}>
//                     <FiPlusCircle className={styles.icon} />
//                     <CgArrowsExpandRight className={styles.icon} />
//                 </div>
//             </div>
//             <div className={styles.container}>
//                 {leads.map((lead, index) => (
//                     <LeadCard key={index} lead={lead} onLeadClick={() => onLeadClick(lead)} />
//                 ))}
//             </div>
//         </div>
//     );
// };

// interface LeadCardProps {
//     lead: Lead;
//     onLeadClick?: () => void;
// }

// const LeadCard: React.FC<LeadCardProps> = ({ lead, onLeadClick }) => {
//     // const [, drag] = useDrag({
//     //     type: ItemType.LEAD,
//     //     item: { lead },
//     // });  
//     // ref={drag}
//     return (
//         <div  className={styles.leadCardDetails} style={{ cursor: 'pointer' }}>
//             <div className={styles.leadRow}>
//                 <p className={styles.leadHead}>{lead.account_name}</p>
//                 {lead.status === 'marketing_review' && <p className={styles.leadHead}><FaChevronCircleRight className={styles.leadicon}  onClick={onLeadClick} /></p>}
//             </div>
//             <div className={styles.leadGroup}>
//                 <div className={styles.leadRow}>
//                     <p className={styles.leadSubHead}>Lead:<span> {lead.lead}</span></p>
//                 </div>
//                 <div className={styles.leadRow}>
//                     <p className={styles.leadSubHead}>PIC: <span> {lead.pic}</span></p>

//                 </div>
//                 <div className={styles.leadRow}>
//                     <p className={styles.leadSubHead}>Ph.no :<span> {lead.mobile_number}</span></p>

//                 </div>
//                 <div className={styles.leadRow}>
//                     <p className={styles.leadSubHead}>Assign To: <span> {lead.assign_to}</span></p>
//                 </div>
//                 <div className={styles.leadRow}>
//                     <p className={styles.leadSubHead}>Date: {lead.acct_created_date}</p>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default LeadStatus;






import React, { useEffect, useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { FiPlusCircle } from "react-icons/fi";
import { CgArrowsExpandRight } from "react-icons/cg";
import { FaChevronCircleRight } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../../app/store';
import { fetchAdminLeadWorkspaceList } from '../../AdminLeadWorkspaceList/Slice/AdminLeadWorkspaceListSlice';
import PopupForm from '../PopupForm/PopupForm';
import { postEditLeadWorkspaceForm } from '../../EditLeadWorkspace/slice/EditLeadWorkspace';
import { adminOpportunityFormData } from '../../OpportunityAdminTable/slice/opportunityTableSlice';
import { postAdminLeadWorkspaceStatus } from './Slice/AdminLeadStatusSlice';
import { postAdminEditLeadWorkspaceForm } from '../../AdminEditLeadWorkspace/slice/AdminEditLeadWorkspaceSlice';

// ─── Constants ────────────────────────────────────────────────────────────────

const ItemType = { LEAD: 'lead' };

// ─── Column config ────────────────────────────────────────────────────────────

const COLUMN_CONFIG: Record<string, {
    gradient: string; border: string; cardBg: string; cardBorder: string; dot: string;
}> = {
    'New Leads':  { gradient: 'from-violet-700 to-purple-500', border: 'border-violet-200', cardBg: 'bg-violet-50',  cardBorder: 'border-violet-200', dot: 'bg-violet-500'  },
    'Follow Up':  { gradient: 'from-amber-500 to-yellow-400',  border: 'border-amber-200',  cardBg: 'bg-amber-50',   cardBorder: 'border-amber-200',  dot: 'bg-amber-500'   },
    'Mktg Review':{ gradient: 'from-lime-600 to-green-500',    border: 'border-lime-200',   cardBg: 'bg-lime-50',    cardBorder: 'border-lime-200',   dot: 'bg-lime-500'    },
    'Progress':   { gradient: 'from-pink-600 to-rose-500',     border: 'border-pink-200',   cardBg: 'bg-pink-50',    cardBorder: 'border-pink-200',   dot: 'bg-pink-500'    },
    'Negotiation':{ gradient: 'from-blue-700 to-indigo-500',   border: 'border-blue-200',   cardBg: 'bg-blue-50',    cardBorder: 'border-blue-200',   dot: 'bg-blue-500'    },
};

// ─── Types ────────────────────────────────────────────────────────────────────

interface Stage { stages: string; ranks: string; lost_reason?: string; }
interface PicDetails { pic_department: string; pic_name: string; pic_designation: string; pic_email: string; pic_phnone: string; pic_phntwo: string; }

interface Lead {
    id: string; account_holder: string; account_name: string; assign_to: string;
    business_type: string; lead: string; make: string; sub_make: string;
    sub_make_brand: string; pic: string; contact_person: string; designation: string;
    department: string; mobile_number: string; email_id: string; description: string;
    location: string; state: string; city: string; address: string; qty: string;
    values: number | null; exp_closure_date: string; exp_po_date: string;
    remarks?: string | null; acct_created_date: string;
    hardware_amount: number | null; software_amount: number | null;
    consumables_amount: number | null; automation_amount: number | null;
    solution_amount: number | null; maintenance_amount: number | null;
    others_amount: number | null; total_amount: number | null;
    status: string | null; vertical: string | null;
    lead_stages: Stage[]; lead_pic: PicDetails[]; user: string;
}

// ─── LeadCard ─────────────────────────────────────────────────────────────────

interface LeadCardProps { lead: Lead; onLeadClick?: () => void; colTitle?: string; }

const LeadCard: React.FC<LeadCardProps> = ({ lead, onLeadClick, colTitle = 'New Leads' }) => {
    const cfg = COLUMN_CONFIG[colTitle] ?? COLUMN_CONFIG['New Leads'];

    return (
        <div className={`${cfg.cardBg} border-2 ${cfg.cardBorder} rounded-xl p-3 mb-2.5 cursor-pointer hover:shadow-md transition-all duration-150`}>
            {/* Header row */}
            <div className="flex items-start justify-between gap-2 mb-2">
                <p className="text-xs font-bold text-slate-800 leading-tight m-0 flex-1">{lead.account_name}</p>
                {lead.status === 'marketing_review' && (
                    <button onClick={onLeadClick} className="text-slate-400 hover:text-indigo-600 transition-colors shrink-0 mt-0.5 bg-transparent border-none cursor-pointer">
                        <FaChevronCircleRight size={14} />
                    </button>
                )}
            </div>

            {/* Detail rows */}
            <div className="flex flex-col gap-1">
                {[
                    { label: 'Lead',      value: lead.lead },
                    { label: 'PIC',       value: lead.pic },
                    { label: 'Ph.no',     value: lead.mobile_number },
                    { label: 'Assign To', value: lead.assign_to },
                    { label: 'Date',      value: lead.acct_created_date },
                ].map(({ label, value }) => (
                    <p key={label} className="text-[10px] font-semibold text-slate-600 m-0">
                        {label}: <span className="font-medium text-slate-500">{value}</span>
                    </p>
                ))}
            </div>
        </div>
    );
};

// ─── LeadContainer ────────────────────────────────────────────────────────────

interface LeadContainerProps { title: string; leads: Lead[]; onLeadClick: (lead: Lead) => void; }

const LeadContainer: React.FC<LeadContainerProps> = ({ title, leads, onLeadClick }) => {
    const [{ isOver }, drop] = useDrop({
        accept: ItemType.LEAD,
        drop: () => {},
        collect: monitor => ({ isOver: monitor.isOver() }),
    });

    const cfg = COLUMN_CONFIG[title] ?? COLUMN_CONFIG['New Leads'];

    return (
        <div
            ref={drop as any}
            className={`flex flex-col rounded-2xl border-2 ${cfg.border} shadow-md overflow-hidden transition-all duration-200 ${isOver ? 'ring-2 ring-indigo-400 ring-offset-2 scale-[1.01]' : ''}`}
        >
            {/* Column Header */}
            <div className={`bg-gradient-to-r ${cfg.gradient} px-3 py-2.5 flex items-center justify-between shrink-0`}>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-white/60" />
                    <span className="text-xs font-bold text-white tracking-wide">{title}</span>
                    {leads.length > 0 && (
                        <span className="bg-white/20 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-white/30">
                            {leads.length}
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-1.5">
                    <FiPlusCircle size={13} className="text-white/70 hover:text-white cursor-pointer transition-colors" />
                    <CgArrowsExpandRight size={13} className="text-white/70 hover:text-white cursor-pointer transition-colors" />
                </div>
            </div>

            {/* Cards */}
            <div className="flex-1 px-3 py-2 overflow-y-auto min-h-[180px] max-h-[420px]
                [&::-webkit-scrollbar]:w-1.5
                [&::-webkit-scrollbar-thumb]:bg-white/40
                [&::-webkit-scrollbar-thumb]:rounded-full
                [&::-webkit-scrollbar-track]:bg-transparent">
                {leads.length === 0 ? (
                    <div className="flex items-center justify-center h-full py-8">
                        <p className="text-xs text-slate-300 font-semibold">No leads here</p>
                    </div>
                ) : (
                    leads.map((lead, index) => (
                        <LeadCard key={index} lead={lead} onLeadClick={() => onLeadClick(lead)} colTitle={title} />
                    ))
                )}
            </div>
        </div>
    );
};

// ─── LeadStatus (main) ────────────────────────────────────────────────────────

const LeadStatus: React.FC = () => {
    const dispatch = useDispatch();
    const { data } = useSelector((state: RootState) => state.fetchAdminLeadWorkspaceListData);
    const { AdminOpportunityData, loading, error } = useSelector((state: RootState) => state.adminOpportunityData);

    const [leadData, setLeadData] = useState<Lead[]>([]);
    const [opportunityData, setOpportunityData] = useState<any[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

    useEffect(() => {
        dispatch(fetchAdminLeadWorkspaceList() as any);
    }, []);

    console.log('opportunityData lead', AdminOpportunityData);
    console.log('data lead', data);

    useEffect(() => {
        if (data) setLeadData(data);
        if (AdminOpportunityData) setOpportunityData(AdminOpportunityData);
    }, [data, AdminOpportunityData]);

    const updateLeadDetails = async (formData: Lead) => {
        console.log('end data', formData);
        const id = formData.id;
        if (formData.status === 'opportunity') {
            const confirmConversion = window.confirm("Are you sure you want to convert this lead to an opportunity?");
            if (confirmConversion) {
                await dispatch(postAdminLeadWorkspaceStatus({ id }) as any);
                alert("Lead successfully converted to Opportunity!");
            } else {
                alert("Lead conversion to Opportunity cancelled.");
                return;
            }
        } else {
            await dispatch(postAdminEditLeadWorkspaceForm({ id, formData }) as any);
        }
        dispatch(fetchAdminLeadWorkspaceList() as any);
        setShowForm(false);
    };

    // Legend for header
    const legend = Object.entries(COLUMN_CONFIG).map(([title, cfg]) => ({ title, dot: cfg.dot }));

    return (
        <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-md overflow-hidden">

            {/* Section Header */}
            <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-5 py-3 flex items-center gap-3">
                <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center">
                    <FiPlusCircle size={14} color="white" />
                </div>
                <h2 className="text-sm font-bold text-white tracking-wide m-0">Lead Pipeline</h2>
                <div className="ml-auto flex items-center gap-3 flex-wrap">
                    {legend.map(({ title, dot }) => (
                        <div key={title} className="flex items-center gap-1">
                            <div className={`w-2 h-2 rounded-full ${dot}`} />
                            <span className="text-[10px] text-white/70 font-semibold">{title}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Kanban Board */}
            <div className="p-4">
                <DndProvider backend={HTML5Backend}>
                    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                        <LeadContainer
                            title="New Leads"
                            leads={leadData.filter(lead => lead.status === 'new_lead').reverse()}
                            onLeadClick={lead => { setSelectedLead(lead); setShowForm(true); }}
                        />
                        <LeadContainer
                            title="Follow Up"
                            leads={leadData.filter(lead => lead.status === 'follow_up').reverse()}
                            onLeadClick={lead => { setSelectedLead(lead); setShowForm(true); }}
                        />
                        <LeadContainer
                            title="Mktg Review"
                            leads={leadData.filter(lead => lead.status === 'marketing_review').reverse()}
                            onLeadClick={lead => { setSelectedLead(lead); setShowForm(true); }}
                        />
                        <LeadContainer
                            title="Progress"
                            leads={opportunityData.filter(lead => lead.status === 'progress').reverse()}
                            onLeadClick={() => {}}
                        />
                        <LeadContainer
                            title="Negotiation"
                            leads={opportunityData.filter(lead => lead.status === 'negotiation').reverse()}
                            onLeadClick={() => {}}
                        />
                    </div>
                </DndProvider>
            </div>

            {showForm && selectedLead && (
                <PopupForm lead={selectedLead} onSave={updateLeadDetails} onClose={() => setShowForm(false)} />
            )}
        </div>
    );
};

export default LeadStatus;
