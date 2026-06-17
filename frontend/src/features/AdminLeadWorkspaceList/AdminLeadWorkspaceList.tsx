// import React, { useEffect, useState } from "react";
// import Navbar from "../UserDashboard/components/navbar/navbar";
// import UserSidebar from "../UserHome/components/UserSidebar/userSidebar";
// import styles from "./AdminLeadWorkspaceList.module.css";
// import { IoIosSquare } from "react-icons/io";
// import { IoMdSquareOutline } from "react-icons/io";
// import { FaRegEdit } from "react-icons/fa";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchTaskDetails } from "../TaskWorkspace/components/NewTaskDetails/TaskDetails/TaskDetails";
// import type { RootState } from "../../app/store";
// import { AiOutlinePlusCircle } from "react-icons/ai";
// import { IoMdSearch } from "react-icons/io";
// import CreateTask from "../TaskWorkspace/components/CreateTask/CreateTask";
// import PopupForm from "../TaskWorkspace/components/PopupForm/PopupForm";
// import { clearResponse, deleteAdminLeadWorkspaceTableData, fetchAdminLeadWorkspaceList } from "./Slice/AdminLeadWorkspaceListSlice";
// import { useLocation, useNavigate } from "react-router-dom";
// import { MdOutlineDelete } from "react-icons/md";





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
//     acct_created_date: string;
//     location: string;
//     state: string;
//     city: string;
//     address: string;
//     qty: string;
//     values: number | null;
//     exp_closure_date: string;
//     exp_po_date: string;
//     remarks?: string | null;
//     region: string;
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
// }

// const AdminLeadWorkspaceList: React.FC = () => {
//     const dispatch = useDispatch();
//     const location = useLocation();
//     const navigate = useNavigate();
//     const { data, loading, error } = useSelector((state: RootState) => state.fetchAdminLeadWorkspaceListData);
//     const { response } = useSelector((state: RootState) => state.deleteAdminLeadWorkspaceList);

//     const [activeItem, setActiveItem] = useState<string>('All');  // Set 'All' as the default
//     const [selectedRank, setSelectedRank] = useState<string>('All');
//     const [dateFilter, setDateFilter] = useState<string>("All");
//     console.log('console data', data)


//     useEffect(() => {
//         dispatch(fetchAdminLeadWorkspaceList() as any);
//     }, [dispatch, response]);


//     useEffect(() => {
//         if (response?.message === "Deleted successfully") {
//             alert("Lead Deleted successfully");
//             dispatch(clearResponse())

//         } else if (response?.message && response.message !== "Deleted successfully") {
//             alert("Submission failed");
//             dispatch(clearResponse())
//         }
//     }, [data, navigate, dispatch, response]);

//     const handleItemClick = (item: string) => {
//         setActiveItem(item);
//     };



//     const isUser = location.pathname.startsWith("/user");
//     const handlelistButtonClick = () => {
//         if (isUser) {
//             navigate("/user/LeadWorkspace");
//         }
//         else {
//             navigate('/LeadWorkspace');
//         }
//     };



//     const [searchQuery, setSearchQuery] = useState<string>("");

//     const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         setSearchQuery(e.target.value);
//     };

//     const handleEditClick = (id: string) => navigate(`/EditLeadWorkspace/${id}`);
//     const filterByDate = (dateString: string) => {
//         if (!dateString) return false;
//         console.log('dateString', dateString)
//         const today = new Date();
//         const expDate = new Date(dateString);

//         const diffMonths = (today.getFullYear() - expDate.getFullYear()) * 12 + (today.getMonth() - expDate.getMonth());

//         switch (dateFilter) {
//             case "Monthly":
//                 return diffMonths === 0;
//             case "Quarterly":
//                 return diffMonths >= 0 && diffMonths < 3;
//             case "Half-Yearly":
//                 return diffMonths >= 0 && diffMonths < 6;
//             case "Yearly":
//                 return diffMonths >= 0 && diffMonths < 12;
//             default:
//                 return true; // "All" case
//         }
//     };


//     // Filter tasks based on the selected status
//     const filteredData = (activeItem === 'All'
//         ? [...data] // Create a shallow copy of taskdata
//         : data?.filter((lead: any) => lead.status === activeItem)
//     )?.reverse();
//     // )?.filter(lead => filterByTime(lead.end_date))?.reverse();   
//     const searchedData = filteredData?.filter((lead: Lead) =>
//         [lead.lead, lead.assign_to, lead.account_name]
//             .some(field => field?.toLowerCase().includes(searchQuery.toLowerCase()))
//     ).filter((lead: Lead) =>
//         selectedRank === "All" || lead.lead_stages.some(stage => stage.ranks === selectedRank)
//     )?.filter((lead: Lead) =>
//         dateFilter === "All" || filterByDate(lead.acct_created_date));



//     const getStatusClass = (status: string) => {
//         switch (status.toLowerCase()) {
//             case "follow_up":
//                 return styles.followup;
//             case "marketing_review":
//                 return styles.marketingreview;
//             case "new_lead":
//                 return styles.newlead;
//             case "oppurtunity":
//                 return styles.oppurtunity;
//             case "Progress":
//                 return styles.Progress;
//             case "Negotiation":
//                 return styles.Negotiation;
//             case "won":
//                 return styles.won;
//             case "lost":
//                 return styles.lost;
//             case "cold_call":
//                 return styles.coldcall;
//             default:
//                 return styles.defaultStatus;
//         }
//     };

//     if (loading) {
//         return <div>Loading...</div>;
//     }

//     if (error) {
//         return <div>Error: {error}</div>;
//     }


//     const handleDeleteClick = (id: string) => {
//         const isConfirmed = window.confirm("Are you sure you want to delete this account?");

//         if (isConfirmed) {
//             dispatch(deleteAdminLeadWorkspaceTableData(id) as any);
//         }
//     };

//     return (
//         <div className={styles.mainContent}>
//             <div className={styles.header}>
//                 <div className={styles.title} >Lead List</div>
//                 <button className={styles.createButton} onClick={handlelistButtonClick} >
//                     <span>Create New Lead</span>
//                     <AiOutlinePlusCircle size={20} className={styles.icon} />
//                 </button>
//             </div>
//             <div className={styles.filterContainer}>
//                 <div className={styles.leftContainer}>
//                     <select
//                         value={activeItem}
//                         onChange={(e) => handleItemClick(e.target.value)}
//                         className={styles.select}
//                     >
//                         <option value="All">All Lead</option>
//                         <option value="Won Lead">Won Lead</option>
//                         <option value="Lost Lead">Lost Lead</option>
//                         <option value="cold_call">Cold Call</option>
//                     </select>
//                     <select className={styles.select} value={selectedRank} onChange={(e) => setSelectedRank(e.target.value)}>
//                         <option value="All">All Rank</option>
//                         <option value="Rank A">Rank A</option>
//                         <option value="Rank B">Rank B</option>
//                         <option value="Rank C">Rank C</option>
//                         <option value="Rank D">Rank D</option>
//                         <option value="Rank E">Rank E</option>
//                     </select>
//                     <select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className={styles.select}>
//                         <option value="All">All Frequency</option>
//                         <option value="Yearly">Yearly</option>
//                         <option value="Half-Yearly">Half-Yearly</option>
//                         <option value="Monthly">Monthly</option>
//                     </select>

//                 </div>
//                 <div className={styles.rightContainer}>
//                     <div className={styles.searchBar}>
//                         <IoMdSearch size={20} className={styles.searchIcon} />
//                         <input
//                             type="text"
//                             placeholder="Search"
//                             className={styles.searchInput}
//                             onChange={handleSearchChange}
//                         />
//                     </div>
//                 </div>
//             </div>

//             <div className={styles.tableContainer}>
//                 <div className={styles.tableHeader}>
//                     <div className={styles.iconContainer}>
//                         <IoIosSquare className={styles.icon} style={{ width: "20px" }} />
//                     </div>
//                     <div className={styles.tableColumn}>Account Name</div>
//                     <div className={styles.tableColumn}>Lead</div>
//                     <div className={styles.tableColumn}>PIC</div>
//                     <div className={styles.tableColumn}>Assign To</div>
//                     <div className={styles.tableColumn}> Date</div>
//                     <div className={styles.tableColumn}>Status</div>
//                     <div className={styles.tableColumn} style={{ width: "20px" }}></div>
//                     <div className={styles.tableColumn} style={{ width: "20px" }}></div>
//                 </div>

//                 <div className={styles.tableBody}>
//                     {searchedData && searchedData.map((row: any, index: number) => (
//                         <div key={row.id}>
//                             <div className={styles.tableRow}>
//                                 <div className={styles.iconContainer}>
//                                     <IoMdSquareOutline className={styles.icon} style={{ width: "20px" }} />
//                                 </div>
//                                 <div className={styles.tableData}>{row.account_name}</div>
//                                 <div className={styles.tableData}>{row.lead}</div>
//                                 <div className={styles.tableData}>{row.pic}</div>
//                                 <div className={styles.tableData}>{row.assign_to}</div>
//                                 <div className={styles.tableData}>{row.acct_created_date}</div>

//                                 <div className={styles.tableData}><div className={getStatusClass(row.status || "")}>
//                                     {row.status || "N/A"}
//                                 </div></div>

//                                 <div className={styles.iconContainer} onClick={() => handleEditClick(row.id)}>
//                                     <FaRegEdit className={styles.editIcon} style={{ width: "20px" }} title="Edit" />
//                                 </div>
//                                 <div className={styles.iconContainer} onClick={() => handleDeleteClick(row.id)}>
//                                     <MdOutlineDelete className={styles.deleteIcon} style={{ width: "20px" }} title="Delete" />
//                                 </div>
//                             </div>


//                         </div>
//                     ))}
//                 </div>
//             </div>











//         </div>

//     );
// };

// export default AdminLeadWorkspaceList;
// ================================================================================================================================

// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import type { RootState, AppDispatch } from "../../app/store";
// import { IoIosArrowDropdown } from "react-icons/io";
// import { FaRegEdit } from "react-icons/fa";
// import { MdOutlineSearch, MdOutlineDelete } from "react-icons/md";
// import { AiOutlinePlusCircle } from "react-icons/ai";
// import { useNavigate, useLocation } from "react-router-dom";
// import {
//     clearResponse,
//     deleteAdminLeadWorkspaceTableData,
//     fetchAdminLeadWorkspaceList,
// } from "./Slice/AdminLeadWorkspaceListSlice";
// import styles from "./AdminLeadWorkspaceList.module.css";

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
//     id?: string;
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
//     acct_created_date: string;
//     location: string;
//     state: string;
//     city: string;
//     address: string;
//     qty: string;
//     values: number | null;
//     exp_closure_date: string;
//     exp_po_date: string;
//     remarks?: string | null;
//     region: string;
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
// }

// const AdminLeadWorkspaceList: React.FC = () => {
//     const dispatch = useDispatch<AppDispatch>();
//     const location = useLocation();
//     const navigate = useNavigate();

//     const { data, loading, error } = useSelector(
//         (state: RootState) => state.fetchAdminLeadWorkspaceListData
//     );
//     const { response } = useSelector(
//         (state: RootState) => state.deleteAdminLeadWorkspaceList
//     );

//     const [activeItem, setActiveItem] = useState<string>("All");
//     const [selectedRank, setSelectedRank] = useState<string>("All");
//     const [dateFilter, setDateFilter] = useState<string>("All");
//     const [searchQuery, setSearchQuery] = useState<string>("");
//     const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
//     const [visibleCount, setVisibleCount] = useState(15);

//     useEffect(() => {
//         dispatch(fetchAdminLeadWorkspaceList() as any);
//     }, [dispatch, response]);

//     useEffect(() => {
//         if (response?.message === "Deleted successfully") {
//             alert("Lead Deleted successfully");
//             dispatch(clearResponse());
//         } else if (response?.message && response.message !== "Deleted successfully") {
//             alert("Submission failed");
//             dispatch(clearResponse());
//         }
//     }, [data, navigate, dispatch, response]);

//     const isUser = location.pathname.startsWith("/user");

//     const handlelistButtonClick = () => {
//         if (isUser) {
//             navigate("/user/LeadWorkspace");
//         } else {
//             navigate("/LeadWorkspace");
//         }
//     };

//     const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         setSearchQuery(e.target.value);
//         setVisibleCount(15);
//     };

//     const handleEditClick = (id: string) => navigate(`/EditLeadWorkspace/${id}`);

//     const handleDeleteClick = (id: string) => {
//         const isConfirmed = window.confirm("Are you sure you want to delete this account?");
//         if (isConfirmed) {
//             dispatch(deleteAdminLeadWorkspaceTableData(id) as any);
//         }
//     };

//     const toggleRow = (id: string) => {
//         setExpandedRows((prev) => {
//             const next = new Set(prev);
//             if (next.has(id)) {
//                 next.delete(id);
//             } else {
//                 next.add(id);
//             }
//             return next;
//         });
//     };

//     const filterByDate = (dateString: string) => {
//         if (!dateString) return false;
//         const today = new Date();
//         const expDate = new Date(dateString);
//         const diffMonths =
//             (today.getFullYear() - expDate.getFullYear()) * 12 +
//             (today.getMonth() - expDate.getMonth());
//         switch (dateFilter) {
//             case "Monthly": return diffMonths === 0;
//             case "Quarterly": return diffMonths >= 0 && diffMonths < 3;
//             case "Half-Yearly": return diffMonths >= 0 && diffMonths < 6;
//             case "Yearly": return diffMonths >= 0 && diffMonths < 12;
//             default: return true;
//         }
//     };

//    const safeData = Array.isArray(data) ? data : [];
//     const filteredData = (
//         activeItem === "All" ? [...safeData] : safeData.filter((lead: any) => lead.status === activeItem)
//     ).reverse();

//     const searchedData = filteredData
//         .filter((lead: Lead) =>
//             [lead.lead, lead.assign_to, lead.account_name].some((field) =>
//                 field?.toLowerCase().includes(searchQuery.toLowerCase())
//             )
//         )
//         .filter(
//             (lead: Lead) =>
//                 selectedRank === "All" ||
//                 lead.lead_stages?.some((stage) => stage.ranks === selectedRank)
//         )
//         .filter((lead: Lead) => dateFilter === "All" || filterByDate(lead.acct_created_date));

//     const visibleData = searchedData.slice(0, visibleCount);

//     // KPI Stats
//     const totalLeads = safeData.length;
//     const thisMonth = safeData.filter((lead: Lead) => {
//         if (!lead.acct_created_date) return false;
//         const today = new Date();
//         const expDate = new Date(lead.acct_created_date);
//         return today.getMonth() === expDate.getMonth() && today.getFullYear() === expDate.getFullYear();
//     }).length;
//     const totalValue = safeData.reduce((acc: number, lead: Lead) => acc + (lead.total_amount ?? 0), 0);
//     const rankALeads = safeData.filter((lead: Lead) =>
//         lead.lead_stages?.some((s) => s.ranks === "Rank A")
//     ).length;
//     const filteredCount = searchedData.length;

//     const formatValue = (val: number) => {
//         if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)}Cr`;
//         if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
//         if (val >= 1000) return `₹${(val / 1000).toFixed(1)}K`;
//         return `₹${val}`;
//     };

//     const getStatusClass = (status: string) => {
//         if (!status) return styles.defaultStatus;
//         switch (status.toLowerCase()) {
//             case "follow_up": return styles.followup;
//             case "marketing_review": return styles.marketingreview;
//             case "new_lead": return styles.newlead;
//             case "oppurtunity": return styles.oppurtunity;
//             case "progress": return styles.progress;
//             case "negotiation": return styles.negotiation;
//             case "won": return styles.won;
//             case "lost": return styles.lost;
//             case "cold_call": return styles.coldcall;
//             default: return styles.defaultStatus;
//         }
//     };

//     const getRankClass = (rank: string) => {
//         switch (rank) {
//             case "Rank A": return styles.rankA;
//             case "Rank B": return styles.rankB;
//             case "Rank C": return styles.rankC;
//             case "Rank D": return styles.rankD;
//             case "Rank E": return styles.rankE;
//             default: return styles.rankDefault;
//         }
//     };

//     return (
//         <div className={styles.page}>
//             {/* ── Page header ── */}
//             <div className={styles.pageHeader}>
//                 <div>
//                     <h1 className={styles.pageTitle}>Lead Workspace</h1>
//                     <p className={styles.pageSubtitle}>Manage and track all lead records</p>
//                 </div>
//                 <div className={styles.headerRight}>
//                     <select
//                         value={activeItem}
//                         onChange={(e) => { setActiveItem(e.target.value); setVisibleCount(15); }}
//                         className={styles.filterSelect}
//                     >
//                         <option value="All">All Status</option>
//                         <option value="Won Lead">Won Lead</option>
//                         <option value="Lost Lead">Lost Lead</option>
//                         <option value="cold_call">Cold Call</option>
//                     </select>
//                     <select
//                         className={styles.filterSelect}
//                         value={selectedRank}
//                         onChange={(e) => { setSelectedRank(e.target.value); setVisibleCount(15); }}
//                     >
//                         <option value="All">All Ranks</option>
//                         <option value="Rank A">Rank A</option>
//                         <option value="Rank B">Rank B</option>
//                         <option value="Rank C">Rank C</option>
//                         <option value="Rank D">Rank D</option>
//                         <option value="Rank E">Rank E</option>
//                     </select>
//                     <select
//                         value={dateFilter}
//                         onChange={(e) => { setDateFilter(e.target.value); setVisibleCount(15); }}
//                         className={styles.filterSelect}
//                     >
//                         <option value="All">All Time</option>
//                         <option value="Yearly">Yearly</option>
//                         <option value="Half-Yearly">Half-Yearly</option>
//                         <option value="Monthly">Monthly</option>
//                         <option value="Quarterly">Quarterly</option>
//                     </select>
//                     <div className={styles.searchBar}>
//                         <MdOutlineSearch className={styles.searchIcon} />
//                         <input
//                             type="text"
//                             placeholder="Search by account or holder…"
//                             className={styles.searchInput}
//                             onChange={handleSearchChange}
//                             value={searchQuery}
//                         />
//                         {searchQuery && (
//                             <button className={styles.clearBtn} onClick={() => { setSearchQuery(""); setVisibleCount(15); }}>✕</button>
//                         )}
//                     </div>
//                     <button className={styles.createBtn} onClick={handlelistButtonClick}>
//                         <AiOutlinePlusCircle size={18} />
//                         <span>Create Lead</span>
//                     </button>
//                 </div>
//             </div>

//             {/* ── KPI strip ── */}
//             <div className={styles.kpiRow}>
//                 <div className={`${styles.kpiCard} ${styles.kpiIndigo}`}>
//                     <div className={styles.kpiIconWrap}>
//                         <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                             <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
//                         </svg>
//                     </div>
//                     <div className={styles.kpiContent}>
//                         <div className={styles.kpiValue}>{totalLeads}</div>
//                         <div className={styles.kpiLabel}>Total Leads</div>
//                     </div>
//                     <div className={styles.kpiBgNumber}>{totalLeads}</div>
//                 </div>

//                 <div className={`${styles.kpiCard} ${styles.kpiEmerald}`}>
//                     <div className={styles.kpiIconWrap}>
//                         <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                             <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
//                         </svg>
//                     </div>
//                     <div className={styles.kpiContent}>
//                         <div className={styles.kpiValue}>{thisMonth}</div>
//                         <div className={styles.kpiLabel}>Added This Month</div>
//                     </div>
//                     <div className={styles.kpiBgNumber}>{thisMonth}</div>
//                 </div>

//                 <div className={`${styles.kpiCard} ${styles.kpiAmber}`}>
//                     <div className={styles.kpiIconWrap}>
//                         <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                             <line x1="12" y1="1" x2="12" y2="23"/>
//                             <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
//                         </svg>
//                     </div>
//                     <div className={styles.kpiContent}>
//                         <div className={styles.kpiValue}>{formatValue(totalValue)}</div>
//                         <div className={styles.kpiLabel}>Total Value</div>
//                     </div>
//                     <div className={styles.kpiBgNumber}>{formatValue(totalValue)}</div>
//                 </div>

//                 <div className={`${styles.kpiCard} ${styles.kpiPurple}`}>
//                     <div className={styles.kpiIconWrap}>
//                         <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                             <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
//                         </svg>
//                     </div>
//                     <div className={styles.kpiContent}>
//                         <div className={styles.kpiValue}>{rankALeads}</div>
//                         <div className={styles.kpiLabel}>Rank A Leads</div>
//                     </div>
//                     <div className={styles.kpiBgNumber}>{rankALeads}</div>
//                 </div>

//                 <div className={`${styles.kpiCard} ${styles.kpiCyan}`}>
//                     <div className={styles.kpiIconWrap}>
//                         <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                             <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
//                         </svg>
//                     </div>
//                     <div className={styles.kpiContent}>
//                         <div className={styles.kpiValue}>{filteredCount}</div>
//                         <div className={styles.kpiLabel}>Filtered Results</div>
//                     </div>
//                     <div className={styles.kpiBgNumber}>{filteredCount}</div>
//                 </div>
//             </div>

//             {/* ── Table card ── */}
//             <div className={styles.tableCard}>
//                 {/* Table title bar */}
//                 <div className={styles.tableTopBar}>
//                     <div className={styles.tableTopLeft}>
//                         <div className={styles.tableDot} />
//                         <span className={styles.tableTopTitle}>All Leads</span>
//                         <span className={styles.tableTopCount}>{searchedData.length} records</span>
//                     </div>
//                 </div>

//                 {/* Header */}
//                 <div className={styles.tableHeader}>
//                     <div className={styles.thCell} />
//                     <div className={styles.thCell}>Account Name</div>
//                     <div className={styles.thCell}>Lead</div>
//                     <div className={styles.thCell}>PIC</div>
//                     <div className={styles.thCell}>Assign To</div>
//                     <div className={styles.thCell}>Date</div>
//                     <div className={styles.thCell}>Status</div>
//                     <div className={styles.thCell} />
//                     <div className={styles.thCell} />
//                 </div>

//                 {/* Loading skeleton */}
//                 {loading && (
//                     <div className={styles.stateBox}>
//                         {[1, 2, 3, 4, 5].map((i) => (
//                             <div key={i} className={styles.skeletonRow}>
//                                 {[1, 2, 3, 4, 5, 6, 7].map((j) => (
//                                     <div key={j} className={styles.skeletonCell} />
//                                 ))}
//                             </div>
//                         ))}
//                     </div>
//                 )}

//                 {/* Error */}
//                 {error && !loading && (
//                     <div className={styles.stateBox}>
//                         <div className={styles.emptyState}>
//                             <div className={styles.emptyIconWrap} style={{ background: '#FEE2E2' }}>
//                                 <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2.5">
//                                     <circle cx="12" cy="12" r="10" />
//                                     <line x1="12" y1="8"  x2="12"   y2="12" />
//                                     <line x1="12" y1="16" x2="12.01" y2="16" />
//                                 </svg>
//                             </div>
//                             <p className={styles.emptyTitle}>Failed to load data</p>
//                             <p className={styles.emptyText}>{error}</p>
//                         </div>
//                     </div>
//                 )}

//                 {/* Empty */}
//                 {!loading && !error && searchedData.length === 0 && (
//                     <div className={styles.stateBox}>
//                         <div className={styles.emptyState}>
//                             <div className={styles.emptyIconWrap} style={{ background: '#F1F5F9' }}>
//                                 <svg width="28" height="28" viewBox="0 0 48 48" fill="none">
//                                     <rect x="8" y="12" width="32" height="28" rx="3" stroke="#94A3B8" strokeWidth="2.5"/>
//                                     <path d="M16 12V10a2 2 0 012-2h12a2 2 0 012 2v2" stroke="#94A3B8" strokeWidth="2.5"/>
//                                     <path d="M17 22h14M17 28h10" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round"/>
//                                 </svg>
//                             </div>
//                             <p className={styles.emptyTitle}>No leads found</p>
//                             <p className={styles.emptyText}>Try adjusting your filters or search query.</p>
//                         </div>
//                     </div>
//                 )}

//                 {/* Rows */}
//                 {!loading && !error && visibleData.map((row: any, idx: number) => (
//                     <div
//                         key={row.id}
//                         className={styles.rowGroup}
//                         style={{ animationDelay: `${Math.min(idx, 10) * 35}ms` }}
//                     >
//                         {/* Main row */}
//                         <div className={`${styles.tableRow} ${expandedRows.has(row.id) ? styles.rowExpanded : ""}`}>
//                             <button
//                                 className={styles.chevronBtn}
//                                 onClick={() => toggleRow(row.id)}
//                                 aria-label="Expand row"
//                             >
//                                 <IoIosArrowDropdown
//                                     size={20}
//                                     className={`${styles.chevron} ${expandedRows.has(row.id) ? styles.chevronOpen : ""}`}
//                                 />
//                             </button>

//                             <div className={styles.tdCell}>
//                                 <span className={styles.accountName}>{row.account_name || "—"}</span>
//                             </div>
//                             <div className={styles.tdCell}>{row.lead || "—"}</div>
//                             <div className={styles.tdCell}>
//                                 {row.pic ? <span className={styles.picBadge}>{row.pic}</span> : "—"}
//                             </div>
//                             <div className={styles.tdCell}>
//                                 {row.assign_to ? <span className={styles.assignBadge}>{row.assign_to}</span> : "—"}
//                             </div>
//                             <div className={styles.tdCell}>
//                                 <span className={styles.dateCell}>{row.acct_created_date || "—"}</span>
//                             </div>
//                             <div className={styles.tdCell}>
//                                 <span className={`${styles.statusBadge} ${getStatusClass(row.status || "")}`}>
//                                     {row.status || "N/A"}
//                                 </span>
//                             </div>

//                             <button
//                                 className={styles.editBtn}
//                                 onClick={(e) => { e.stopPropagation(); handleEditClick(row.id); }}
//                                 aria-label="Edit"
//                             >
//                                 <FaRegEdit size={14} />
//                             </button>
//                             <button
//                                 className={styles.deleteBtn}
//                                 onClick={(e) => { e.stopPropagation(); handleDeleteClick(row.id); }}
//                                 aria-label="Delete"
//                             >
//                                 <MdOutlineDelete size={16} />
//                             </button>
//                         </div>

//                         {/* Expanded detail panel */}
//                         {expandedRows.has(row.id) && (
//                             <div className={styles.detailPanel}>
//                                 <div className={styles.detailPanelInner}>
//                                     <div className={styles.detailHeader}>
//                                         <div className={styles.detailTitleWrap}>
//                                             <div className={styles.detailAvatar}>
//                                                 {(row.account_name || 'L')[0].toUpperCase()}
//                                             </div>
//                                             <div>
//                                                 <div className={styles.detailTitle}>{row.account_name}</div>
//                                                 <div className={styles.detailTitleSub}>Lead Details</div>
//                                             </div>
//                                         </div>
//                                         <div className={styles.stagesWrap}>
//                                             {row.vertical && (
//                                                 <span className={styles.detailVerticalBadge}>{row.vertical}</span>
//                                             )}
//                                             {row.lead_stages?.map((stage: Stage, i: number) => (
//                                                 <span key={i} className={`${styles.rankBadge} ${getRankClass(stage.ranks)}`}>
//                                                     {stage.ranks}
//                                                 </span>
//                                             ))}
//                                         </div>
//                                     </div>
//                                     <div className={styles.detailGrid}>
//                                         {[
//                                             { label: "Business Type",  value: row.business_type,                      icon: "🏢" },
//                                             { label: "Make",           value: row.make,                               icon: "🏭" },
//                                             { label: "Sub Make",       value: row.sub_make,                           icon: "🔧" },
//                                             { label: "Quantity",       value: row.qty,                                icon: "📦" },
//                                             { label: "Location",       value: row.location,                           icon: "📍" },
//                                             { label: "City",           value: row.city,                               icon: "🏙️" },
//                                             { label: "State",          value: row.state,                              icon: "🗺️" },
//                                             { label: "Region",         value: row.region,                             icon: "🌍" },
//                                             { label: "Mobile",         value: row.mobile_number,                      icon: "📱" },
//                                             { label: "Hardware",       value: row.hardware_amount != null ? `₹${row.hardware_amount}` : null, icon: "💻" },
//                                             { label: "Software",       value: row.software_amount != null ? `₹${row.software_amount}` : null, icon: "🖥️" },
//                                             { label: "Automation",     value: row.automation_amount != null ? `₹${row.automation_amount}` : null, icon: "⚙️" },
//                                             { label: "Others",         value: row.others_amount != null ? `₹${row.others_amount}` : null,   icon: "🧩" },
//                                             { label: "Total Amount",   value: row.total_amount != null ? formatValue(row.total_amount) : null, icon: "💰" },
//                                             { label: "Exp Closure",    value: row.exp_closure_date,                   icon: "📅" },
//                                             { label: "Exp PO Date",    value: row.exp_po_date,                        icon: "📋" },
//                                             { label: "Remarks",        value: row.remarks,                            icon: "📝" },
//                                         ].map(({ label, value, icon }) => (
//                                             <div key={label} className={styles.detailItem}>
//                                                 <span className={styles.detailLabel}>
//                                                     <span className={styles.detailIcon}>{icon}</span>{label}
//                                                 </span>
//                                                 <span className={styles.detailValue}>{value || "—"}</span>
//                                             </div>
//                                         ))}
//                                     </div>
//                                 </div>
//                             </div>
//                         )}
//                     </div>
//                 ))}

//                 {/* Load more */}
//                 {!loading && !error && visibleCount < searchedData.length && (
//                     <div className={styles.loadMoreWrap}>
//                         <button
//                             className={styles.loadMoreBtn}
//                             onClick={() => setVisibleCount((c) => c + 15)}
//                         >
//                             Load more · {searchedData.length - visibleCount} remaining
//                         </button>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default AdminLeadWorkspaceList;


// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import type { RootState, AppDispatch } from "../../app/store";
// import { IoIosArrowDropdown } from "react-icons/io";
// import { FaRegEdit } from "react-icons/fa";
// import { MdOutlineSearch, MdOutlineDelete } from "react-icons/md";
// import { AiOutlinePlusCircle } from "react-icons/ai";
// import { useNavigate, useLocation } from "react-router-dom";
// import {
//     clearResponse,
//     deleteAdminLeadWorkspaceTableData,
//     fetchAdminLeadWorkspaceList,
// } from "./Slice/AdminLeadWorkspaceListSlice";
// import styles from "./AdminLeadWorkspaceList.module.css";

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
//     id?: string;
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
//     acct_created_date: string;
//     location: string;
//     state: string;
//     city: string;
//     address: string;
//     qty: string;
//     values: number | null;
//     exp_closure_date: string;
//     exp_po_date: string;
//     remarks?: string | null;
//     region: string;
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
// }

// // ── Time Period Options ──────────────────────────────────────
// const TIME_PERIODS = [
//     { label: "All Time",      value: "all" },
//     { label: "Last 7 Days",   value: "7days" },
//     { label: "Last 15 Days",  value: "15days" },
//     { label: "This Month",    value: "this_month" },
//     { label: "Last 3 Months", value: "3months" },
//     { label: "Q1 (Apr–Jun)",  value: "q1" },
//     { label: "Q2 (Jul–Sep)",  value: "q2" },
//     { label: "Q3 (Oct–Dec)",  value: "q3" },
//     { label: "Q4 (Jan–Mar)",  value: "q4" },
//     { label: "This FY",       value: "this_fy" },
// ];

// // ── Date Filter Helper (Indian FY: April to March) ───────────
// const isInTimePeriod = (dateString: string, period: string): boolean => {
//     if (!dateString || period === "all") return true;

//     const today     = new Date();
//     const checkDate = new Date(dateString);
//     today.setHours(0, 0, 0, 0);
//     checkDate.setHours(0, 0, 0, 0);

//     const diffDays     = Math.floor((today.getTime() - checkDate.getTime()) / (1000 * 60 * 60 * 24));
//     const currentMonth = today.getMonth();
//     const currentYear  = today.getFullYear();
//     const fyYear       = currentMonth >= 3 ? currentYear : currentYear - 1;

//     switch (period) {
//         case "this_fy":
//             return checkDate >= new Date(fyYear, 3, 1) &&
//                    checkDate <= new Date(fyYear + 1, 2, 31);
//         case "7days":
//             return diffDays >= 0 && diffDays <= 7;
//         case "15days":
//             return diffDays >= 0 && diffDays <= 15;
//         case "this_month":
//             return checkDate.getMonth()    === today.getMonth() &&
//                    checkDate.getFullYear() === today.getFullYear();
//         case "3months": {
//             const threeMonthsAgo = new Date(today);
//             threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
//             return checkDate >= threeMonthsAgo && checkDate <= today;
//         }
//         case "q1":
//             return checkDate >= new Date(fyYear, 3, 1)     &&
//                    checkDate <= new Date(fyYear, 5, 30);
//         case "q2":
//             return checkDate >= new Date(fyYear, 6, 1)     &&
//                    checkDate <= new Date(fyYear, 8, 30);
//         case "q3":
//             return checkDate >= new Date(fyYear, 9, 1)     &&
//                    checkDate <= new Date(fyYear, 11, 31);
//         case "q4":
//             return checkDate >= new Date(fyYear + 1, 0, 1) &&
//                    checkDate <= new Date(fyYear + 1, 2, 31);
//         default:
//             return true;
//     }
// };

// const AdminLeadWorkspaceList: React.FC = () => {
//     const dispatch = useDispatch<AppDispatch>();
//     const location = useLocation();
//     const navigate = useNavigate();

//     const { data, loading, error } = useSelector(
//         (state: RootState) => state.fetchAdminLeadWorkspaceListData
//     );
//     const { response } = useSelector(
//         (state: RootState) => state.deleteAdminLeadWorkspaceList
//     );

//     const [activeItem,          setActiveItem]          = useState<string>("All");
//     const [selectedRank,        setSelectedRank]        = useState<string>("All");
//     const [dateFilter,          setDateFilter]          = useState<string>("All");
//     const [selectedTimePeriod,  setSelectedTimePeriod]  = useState<string>("all");
//     const [searchQuery,         setSearchQuery]         = useState<string>("");
//     const [expandedRows,        setExpandedRows]        = useState<Set<string>>(new Set());
//     const [visibleCount,        setVisibleCount]        = useState(15);

//     useEffect(() => {
//         dispatch(fetchAdminLeadWorkspaceList() as any);
//     }, [dispatch, response]);

//     useEffect(() => {
//         if (response?.message === "Deleted successfully") {
//             alert("Lead Deleted successfully");
//             dispatch(clearResponse());
//         } else if (response?.message && response.message !== "Deleted successfully") {
//             alert("Submission failed");
//             dispatch(clearResponse());
//         }
//     }, [data, navigate, dispatch, response]);

//     const isUser = location.pathname.startsWith("/user");

//     const handlelistButtonClick = () => {
//         if (isUser) {
//             navigate("/user/LeadWorkspace");
//         } else {
//             navigate("/LeadWorkspace");
//         }
//     };

//     const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         setSearchQuery(e.target.value);
//         setVisibleCount(15);
//     };

//     const handleEditClick   = (id: string) => navigate(`/EditLeadWorkspace/${id}`);

//     const handleDeleteClick = (id: string) => {
//         const isConfirmed = window.confirm(
//             "Are you sure you want to delete this account?"
//         );
//         if (isConfirmed) {
//             dispatch(deleteAdminLeadWorkspaceTableData(id) as any);
//         }
//     };

//     const toggleRow = (id: string) => {
//         setExpandedRows((prev) => {
//             const next = new Set(prev);
//             if (next.has(id)) next.delete(id);
//             else next.add(id);
//             return next;
//         });
//     };

//     // ── Old date filter (kept for the existing dateFilter dropdown) ──
//     const filterByDate = (dateString: string) => {
//         if (!dateString) return false;
//         const today   = new Date();
//         const expDate = new Date(dateString);
//         const diffMonths =
//             (today.getFullYear() - expDate.getFullYear()) * 12 +
//             (today.getMonth()    - expDate.getMonth());
//         switch (dateFilter) {
//             case "Monthly":     return diffMonths === 0;
//             case "Quarterly":   return diffMonths >= 0 && diffMonths < 3;
//             case "Half-Yearly": return diffMonths >= 0 && diffMonths < 6;
//             case "Yearly":      return diffMonths >= 0 && diffMonths < 12;
//             default:            return true;
//         }
//     };

//     // ── Safe data ────────────────────────────────────────────
//     const safeData = Array.isArray(data) ? data : [];

//     // ── Filtered data ────────────────────────────────────────
//     const filteredData = (
//         activeItem === "All"
//             ? [...safeData]
//             : safeData.filter((lead: any) => lead.status === activeItem)
//     ).reverse();

//     const searchedData = filteredData
//         .filter((lead: Lead) =>
//             [lead.lead, lead.assign_to, lead.account_name].some((field) =>
//                 field?.toLowerCase().includes(searchQuery.toLowerCase())
//             )
//         )
//         .filter(
//             (lead: Lead) =>
//                 selectedRank === "All" ||
//                 lead.lead_stages?.some((stage) => stage.ranks === selectedRank)
//         )
//         .filter(
//             (lead: Lead) =>
//                 dateFilter === "All" || filterByDate(lead.acct_created_date)
//         )
//         // ── NEW: Time Period Filter ──────────────────────────
//         .filter((lead: Lead) =>
//             isInTimePeriod(lead.acct_created_date, selectedTimePeriod)
//         );

//     const visibleData = searchedData.slice(0, visibleCount);

//     // ── KPI Stats ────────────────────────────────────────────
//     const totalLeads    = safeData.length;
//     const thisMonth     = safeData.filter((lead: Lead) => {
//         if (!lead.acct_created_date) return false;
//         const today   = new Date();
//         const expDate = new Date(lead.acct_created_date);
//         return today.getMonth()    === expDate.getMonth() &&
//                today.getFullYear() === expDate.getFullYear();
//     }).length;
//     const totalValue    = safeData.reduce(
//         (acc: number, lead: Lead) => acc + (lead.total_amount ?? 0), 0
//     );
//     const rankALeads    = safeData.filter((lead: Lead) =>
//         lead.lead_stages?.some((s) => s.ranks === "Rank A")
//     ).length;
//     const filteredCount = searchedData.length;

//     const formatValue = (val: number) => {
//         if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)}Cr`;
//         if (val >= 100000)   return `₹${(val / 100000).toFixed(1)}L`;
//         if (val >= 1000)     return `₹${(val / 1000).toFixed(1)}K`;
//         return `₹${val}`;
//     };

//     const getStatusClass = (status: string) => {
//         if (!status) return styles.defaultStatus;
//         switch (status.toLowerCase()) {
//             case "follow_up":        return styles.followup;
//             case "marketing_review": return styles.marketingreview;
//             case "new_lead":         return styles.newlead;
//             case "oppurtunity":      return styles.oppurtunity;
//             case "progress":         return styles.progress;
//             case "negotiation":      return styles.negotiation;
//             case "won":              return styles.won;
//             case "lost":             return styles.lost;
//             case "cold_call":        return styles.coldcall;
//             default:                 return styles.defaultStatus;
//         }
//     };

//     const getRankClass = (rank: string) => {
//         switch (rank) {
//             case "Rank A": return styles.rankA;
//             case "Rank B": return styles.rankB;
//             case "Rank C": return styles.rankC;
//             case "Rank D": return styles.rankD;
//             case "Rank E": return styles.rankE;
//             default:       return styles.rankDefault;
//         }
//     };

//     return (
//         <div className={styles.page}>

//             {/* ── Page header ── */}
//             <div className={styles.pageHeader}>
//                 <div>
//                     <h1 className={styles.pageTitle}>Lead Workspace</h1>
//                     <p className={styles.pageSubtitle}>
//                         Manage and track all lead records
//                     </p>
//                 </div>

//                 <div className={styles.headerRight}>

//                     {/* ── NEW: Time Period Filter ── */}
//                     <select
//                         className={styles.filterSelect}
//                         value={selectedTimePeriod}
//                         onChange={(e) => {
//                             setSelectedTimePeriod(e.target.value);
//                             setVisibleCount(15);
//                         }}
//                     >
//                         {TIME_PERIODS.map((t) => (
//                             <option key={t.value} value={t.value}>
//                                 {t.label}
//                             </option>
//                         ))}
//                     </select>

//                     {/* Status filter */}
//                     {/* <select
//                         value={activeItem}
//                         onChange={(e) => {
//                             setActiveItem(e.target.value);
//                             setVisibleCount(15);
//                         }}
//                         className={styles.filterSelect}
//                     >
//                         <option value="All">All Status</option>
//                         <option value="Won Lead">Won Lead</option>
//                         <option value="Lost Lead">Lost Lead</option>
//                         <option value="cold_call">Cold Call</option>
//                     </select> */}

//                     {/* Rank filter */}
//                     <select
//                         className={styles.filterSelect}
//                         value={selectedRank}
//                         onChange={(e) => {
//                             setSelectedRank(e.target.value);
//                             setVisibleCount(15);
//                         }}
//                     >
//                         <option value="All">All Ranks</option>
//                         <option value="Rank A">Rank A</option>
//                         <option value="Rank B">Rank B</option>
//                         <option value="Rank C">Rank C</option>
//                         <option value="Rank D">Rank D</option>
//                         <option value="Rank E">Rank E</option>
//                     </select>

//                     {/* Old date range filter */}
//                     {/* <select
//                         value={dateFilter}
//                         onChange={(e) => {
//                             setDateFilter(e.target.value);
//                             setVisibleCount(15);
//                         }}
//                         className={styles.filterSelect}
//                     >
//                         <option value="All">All Time</option>
//                         <option value="Yearly">Yearly</option>
//                         <option value="Half-Yearly">Half-Yearly</option>
//                         <option value="Monthly">Monthly</option>
//                         <option value="Quarterly">Quarterly</option>
//                     </select> */}

//                     {/* Search */}
//                     <div className={styles.searchBar}>
//                         <MdOutlineSearch className={styles.searchIcon} />
//                         <input
//                             type="text"
//                             placeholder="Search by account or holder…"
//                             className={styles.searchInput}
//                             onChange={handleSearchChange}
//                             value={searchQuery}
//                         />
//                         {searchQuery && (
//                             <button
//                                 className={styles.clearBtn}
//                                 onClick={() => {
//                                     setSearchQuery("");
//                                     setVisibleCount(15);
//                                 }}
//                             >
//                                 ✕
//                             </button>
//                         )}
//                     </div>

//                     {/* Create button */}
//                     <button
//                         className={styles.createBtn}
//                         onClick={handlelistButtonClick}
//                     >
//                         <AiOutlinePlusCircle size={18} />
//                         <span>Create Lead</span>
//                     </button>
//                 </div>
//             </div>

//             {/* ── KPI strip ── */}
//             <div className={styles.kpiRow}>
//                 <div className={`${styles.kpiCard} ${styles.kpiIndigo}`}>
//                     <div className={styles.kpiIconWrap}>
//                         <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                             <circle cx="12" cy="12" r="10"/>
//                             <circle cx="12" cy="12" r="6"/>
//                             <circle cx="12" cy="12" r="2"/>
//                         </svg>
//                     </div>
//                     <div className={styles.kpiContent}>
//                         <div className={styles.kpiValue}>{totalLeads}</div>
//                         <div className={styles.kpiLabel}>Total Leads</div>
//                     </div>
//                     <div className={styles.kpiBgNumber}>{totalLeads}</div>
//                 </div>

//                 <div className={`${styles.kpiCard} ${styles.kpiEmerald}`}>
//                     <div className={styles.kpiIconWrap}>
//                         <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                             <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
//                             <polyline points="17 6 23 6 23 12"/>
//                         </svg>
//                     </div>
//                     <div className={styles.kpiContent}>
//                         <div className={styles.kpiValue}>{thisMonth}</div>
//                         <div className={styles.kpiLabel}>Added This Month</div>
//                     </div>
//                     <div className={styles.kpiBgNumber}>{thisMonth}</div>
//                 </div>

//                 <div className={`${styles.kpiCard} ${styles.kpiAmber}`}>
//                     <div className={styles.kpiIconWrap}>
//                         <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                             <line x1="12" y1="1" x2="12" y2="23"/>
//                             <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
//                         </svg>
//                     </div>
//                     <div className={styles.kpiContent}>
//                         <div className={styles.kpiValue}>{formatValue(totalValue)}</div>
//                         <div className={styles.kpiLabel}>Total Value</div>
//                     </div>
//                     <div className={styles.kpiBgNumber}>{formatValue(totalValue)}</div>
//                 </div>

//                 <div className={`${styles.kpiCard} ${styles.kpiPurple}`}>
//                     <div className={styles.kpiIconWrap}>
//                         <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                             <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
//                         </svg>
//                     </div>
//                     <div className={styles.kpiContent}>
//                         <div className={styles.kpiValue}>{rankALeads}</div>
//                         <div className={styles.kpiLabel}>Rank A Leads</div>
//                     </div>
//                     <div className={styles.kpiBgNumber}>{rankALeads}</div>
//                 </div>

//                 <div className={`${styles.kpiCard} ${styles.kpiCyan}`}>
//                     <div className={styles.kpiIconWrap}>
//                         <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                             <circle cx="11" cy="11" r="8"/>
//                             <line x1="21" y1="21" x2="16.65" y2="16.65"/>
//                         </svg>
//                     </div>
//                     <div className={styles.kpiContent}>
//                         <div className={styles.kpiValue}>{filteredCount}</div>
//                         <div className={styles.kpiLabel}>Filtered Results</div>
//                     </div>
//                     <div className={styles.kpiBgNumber}>{filteredCount}</div>
//                 </div>
//             </div>

//             {/* ── Table card ── */}
//             <div className={styles.tableCard}>

//                 {/* Table title bar */}
//                 <div className={styles.tableTopBar}>
//                     <div className={styles.tableTopLeft}>
//                         <div className={styles.tableDot} />
//                         <span className={styles.tableTopTitle}>All Leads</span>
//                         <span className={styles.tableTopCount}>
//                             {searchedData.length} records
//                         </span>
//                     </div>
//                 </div>

//                 {/* Header */}
//                 <div className={styles.tableHeader}>
//                     <div className={styles.thCell} />
//                     <div className={styles.thCell}>Account Name</div>
//                     <div className={styles.thCell}>Lead</div>
//                     <div className={styles.thCell}>PIC</div>
//                     <div className={styles.thCell}>Assign To</div>
//                     <div className={styles.thCell}>Date</div>
//                     <div className={styles.thCell}>Status</div>
//                     <div className={styles.thCell} />
//                     <div className={styles.thCell} />
//                 </div>

//                 {/* Loading skeleton */}
//                 {loading && (
//                     <div className={styles.stateBox}>
//                         {[1, 2, 3, 4, 5].map((i) => (
//                             <div key={i} className={styles.skeletonRow}>
//                                 {[1, 2, 3, 4, 5, 6, 7].map((j) => (
//                                     <div key={j} className={styles.skeletonCell} />
//                                 ))}
//                             </div>
//                         ))}
//                     </div>
//                 )}

//                 {/* Error */}
//                 {error && !loading && (
//                     <div className={styles.stateBox}>
//                         <div className={styles.emptyState}>
//                             <div
//                                 className={styles.emptyIconWrap}
//                                 style={{ background: "#FEE2E2" }}
//                             >
//                                 <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2.5">
//                                     <circle cx="12" cy="12" r="10" />
//                                     <line x1="12" y1="8"  x2="12"    y2="12" />
//                                     <line x1="12" y1="16" x2="12.01" y2="16" />
//                                 </svg>
//                             </div>
//                             <p className={styles.emptyTitle}>Failed to load data</p>
//                             <p className={styles.emptyText}>{error}</p>
//                         </div>
//                     </div>
//                 )}

//                 {/* Empty */}
//                 {!loading && !error && searchedData.length === 0 && (
//                     <div className={styles.stateBox}>
//                         <div className={styles.emptyState}>
//                             <div
//                                 className={styles.emptyIconWrap}
//                                 style={{ background: "#F1F5F9" }}
//                             >
//                                 <svg width="28" height="28" viewBox="0 0 48 48" fill="none">
//                                     <rect x="8" y="12" width="32" height="28" rx="3" stroke="#94A3B8" strokeWidth="2.5"/>
//                                     <path d="M16 12V10a2 2 0 012-2h12a2 2 0 012 2v2" stroke="#94A3B8" strokeWidth="2.5"/>
//                                     <path d="M17 22h14M17 28h10" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round"/>
//                                 </svg>
//                             </div>
//                             <p className={styles.emptyTitle}>No leads found</p>
//                             <p className={styles.emptyText}>
//                                 Try adjusting your filters or search query.
//                             </p>
//                         </div>
//                     </div>
//                 )}

//                 {/* Rows */}
//                 {!loading &&
//                     !error &&
//                     visibleData.map((row: any, idx: number) => (
//                         <div
//                             key={row.id}
//                             className={styles.rowGroup}
//                             style={{ animationDelay: `${Math.min(idx, 10) * 35}ms` }}
//                         >
//                             {/* Main row */}
//                             <div
//                                 className={`${styles.tableRow} ${
//                                     expandedRows.has(row.id) ? styles.rowExpanded : ""
//                                 }`}
//                             >
//                                 <button
//                                     className={styles.chevronBtn}
//                                     onClick={() => toggleRow(row.id)}
//                                     aria-label="Expand row"
//                                 >
//                                     <IoIosArrowDropdown
//                                         size={20}
//                                         className={`${styles.chevron} ${
//                                             expandedRows.has(row.id)
//                                                 ? styles.chevronOpen
//                                                 : ""
//                                         }`}
//                                     />
//                                 </button>

//                                 <div className={styles.tdCell}>
//                                     <span className={styles.accountName}>
//                                         {row.account_name || "—"}
//                                     </span>
//                                 </div>
//                                 <div className={styles.tdCell}>
//                                     {row.lead || "—"}
//                                 </div>
//                                 <div className={styles.tdCell}>
//                                     {row.pic ? (
//                                         <span className={styles.picBadge}>{row.pic}</span>
//                                     ) : (
//                                         "—"
//                                     )}
//                                 </div>
//                                 <div className={styles.tdCell}>
//                                     {row.assign_to ? (
//                                         <span className={styles.assignBadge}>
//                                             {row.assign_to}
//                                         </span>
//                                     ) : (
//                                         "—"
//                                     )}
//                                 </div>
//                                 <div className={styles.tdCell}>
//                                     <span className={styles.dateCell}>
//                                         {row.acct_created_date || "—"}
//                                     </span>
//                                 </div>
//                                 <div className={styles.tdCell}>
//                                     <span
//                                         className={`${styles.statusBadge} ${getStatusClass(
//                                             row.status || ""
//                                         )}`}
//                                     >
//                                         {row.status || "N/A"}
//                                     </span>
//                                 </div>

//                                 <button
//                                     className={styles.editBtn}
//                                     onClick={(e) => {
//                                         e.stopPropagation();
//                                         handleEditClick(row.id);
//                                     }}
//                                     aria-label="Edit"
//                                 >
//                                     <FaRegEdit size={14} />
//                                 </button>
//                                 <button
//                                     className={styles.deleteBtn}
//                                     onClick={(e) => {
//                                         e.stopPropagation();
//                                         handleDeleteClick(row.id);
//                                     }}
//                                     aria-label="Delete"
//                                 >
//                                     <MdOutlineDelete size={16} />
//                                 </button>
//                             </div>

//                             {/* Expanded detail panel */}
//                             {expandedRows.has(row.id) && (
//                                 <div className={styles.detailPanel}>
//                                     <div className={styles.detailPanelInner}>
//                                         <div className={styles.detailHeader}>
//                                             <div className={styles.detailTitleWrap}>
//                                                 <div className={styles.detailAvatar}>
//                                                     {(row.account_name || "L")[0].toUpperCase()}
//                                                 </div>
//                                                 <div>
//                                                     <div className={styles.detailTitle}>
//                                                         {row.account_name}
//                                                     </div>
//                                                     <div className={styles.detailTitleSub}>
//                                                         Lead Details
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                             <div className={styles.stagesWrap}>
//                                                 {row.vertical && (
//                                                     <span className={styles.detailVerticalBadge}>
//                                                         {row.vertical}
//                                                     </span>
//                                                 )}
//                                                 {row.lead_stages?.map(
//                                                     (stage: Stage, i: number) => (
//                                                         <span
//                                                             key={i}
//                                                             className={`${styles.rankBadge} ${getRankClass(stage.ranks)}`}
//                                                         >
//                                                             {stage.ranks}
//                                                         </span>
//                                                     )
//                                                 )}
//                                             </div>
//                                         </div>

//                                         <div className={styles.detailGrid}>
//                                             {[
//                                                 { label: "Business Type", value: row.business_type,                                                          icon: "🏢" },
//                                                 { label: "Make",          value: row.make,                                                                   icon: "🏭" },
//                                                 { label: "Sub Make",      value: row.sub_make,                                                               icon: "🔧" },
//                                                 { label: "Quantity",      value: row.qty,                                                                    icon: "📦" },
//                                                 { label: "Location",      value: row.location,                                                               icon: "📍" },
//                                                 { label: "City",          value: row.city,                                                                   icon: "🏙️" },
//                                                 { label: "State",         value: row.state,                                                                  icon: "🗺️" },
//                                                 { label: "Region",        value: row.region,                                                                 icon: "🌍" },
//                                                 { label: "Mobile",        value: row.mobile_number,                                                          icon: "📱" },
//                                                 { label: "Hardware",      value: row.hardware_amount    != null ? `₹${row.hardware_amount}`    : null,        icon: "💻" },
//                                                 { label: "Software",      value: row.software_amount    != null ? `₹${row.software_amount}`    : null,        icon: "🖥️" },
//                                                 { label: "Automation",    value: row.automation_amount  != null ? `₹${row.automation_amount}`  : null,        icon: "⚙️" },
//                                                 { label: "Others",        value: row.others_amount      != null ? `₹${row.others_amount}`      : null,        icon: "🧩" },
//                                                 { label: "Total Amount",  value: row.total_amount       != null ? formatValue(row.total_amount) : null,        icon: "💰" },
//                                                 { label: "Exp Closure",   value: row.exp_closure_date,                                                       icon: "📅" },
//                                                 { label: "Exp PO Date",   value: row.exp_po_date,                                                            icon: "📋" },
//                                                 { label: "Remarks",       value: row.remarks,                                                                icon: "📝" },
//                                             ].map(({ label, value, icon }) => (
//                                                 <div key={label} className={styles.detailItem}>
//                                                     <span className={styles.detailLabel}>
//                                                         <span className={styles.detailIcon}>
//                                                             {icon}
//                                                         </span>
//                                                         {label}
//                                                     </span>
//                                                     <span className={styles.detailValue}>
//                                                         {value || "—"}
//                                                     </span>
//                                                 </div>
//                                             ))}
//                                         </div>
//                                     </div>
//                                 </div>
//                             )}
//                         </div>
//                     ))}

//                 {/* Load more */}
//                 {!loading && !error && visibleCount < searchedData.length && (
//                     <div className={styles.loadMoreWrap}>
//                         <button
//                             className={styles.loadMoreBtn}
//                             onClick={() => setVisibleCount((c) => c + 15)}
//                         >
//                             Load more · {searchedData.length - visibleCount} remaining
//                         </button>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default AdminLeadWorkspaceList;


import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../app/store";
import { IoIosArrowDropdown } from "react-icons/io";
import { FaRegEdit } from "react-icons/fa";
import { MdOutlineSearch, MdOutlineDelete } from "react-icons/md";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { useNavigate, useLocation } from "react-router-dom";
import {
    clearResponse,
    deleteAdminLeadWorkspaceTableData,
    fetchAdminLeadWorkspaceList,
} from "./Slice/AdminLeadWorkspaceListSlice";

interface Stage {
    stages: string;
    ranks: string;
    lost_reason?: string;
}

interface PicDetails {
    pic_department: string;
    pic_name: string;
    pic_designation: string;
    pic_email: string;
    pic_phnone: string;
    pic_phntwo: string;
}

interface Lead {
    id?: string;
    account_holder: string;
    account_name: string;
    assign_to: string;
    business_type: string;
    lead: string;
    make: string;
    sub_make: string;
    sub_make_brand: string;
    pic: string;
    contact_person: string;
    designation: string;
    department: string;
    mobile_number: string;
    acct_created_date: string;
    location: string;
    state: string;
    city: string;
    address: string;
    qty: string;
    values: number | null;
    exp_closure_date: string;
    exp_po_date: string;
    remarks?: string | null;
    region: string;
    hardware_amount: number | null;
    software_amount: number | null;
    consumables_amount: number | null;
    automation_amount: number | null;
    solution_amount: number | null;
    maintenance_amount: number | null;
    others_amount: number | null;
    total_amount: number | null;
    status: string | null;
    vertical: string | null;
    lead_stages: Stage[];
    lead_pic: PicDetails[];
}

// ── Time Period Options ──────────────────────────────────────
const TIME_PERIODS = [
    { label: "All Time",      value: "all" },
    { label: "Last 7 Days",   value: "7days" },
    { label: "Last 15 Days",  value: "15days" },
    { label: "This Month",    value: "this_month" },
    { label: "Last 3 Months", value: "3months" },
    { label: "Q1 (Apr–Jun)",  value: "q1" },
    { label: "Q2 (Jul–Sep)",  value: "q2" },
    { label: "Q3 (Oct–Dec)",  value: "q3" },
    { label: "Q4 (Jan–Mar)",  value: "q4" },
    { label: "This FY",       value: "this_fy" },
];

// ── Date Filter Helper (Indian FY: April to March) ───────────
const isInTimePeriod = (dateString: string, period: string): boolean => {
    if (!dateString || period === "all") return true;

    const today     = new Date();
    const checkDate = new Date(dateString);
    today.setHours(0, 0, 0, 0);
    checkDate.setHours(0, 0, 0, 0);

    const diffDays     = Math.floor((today.getTime() - checkDate.getTime()) / (1000 * 60 * 60 * 24));
    const currentMonth = today.getMonth();
    const currentYear  = today.getFullYear();
    const fyYear       = currentMonth >= 3 ? currentYear : currentYear - 1;

    switch (period) {
        case "this_fy":
            return checkDate >= new Date(fyYear, 3, 1) &&
                   checkDate <= new Date(fyYear + 1, 2, 31);
        case "7days":
            return diffDays >= 0 && diffDays <= 7;
        case "15days":
            return diffDays >= 0 && diffDays <= 15;
        case "this_month":
            return checkDate.getMonth()    === today.getMonth() &&
                   checkDate.getFullYear() === today.getFullYear();
        case "3months": {
            const threeMonthsAgo = new Date(today);
            threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
            return checkDate >= threeMonthsAgo && checkDate <= today;
        }
        case "q1":
            return checkDate >= new Date(fyYear, 3, 1)     &&
                   checkDate <= new Date(fyYear, 5, 30);
        case "q2":
            return checkDate >= new Date(fyYear, 6, 1)     &&
                   checkDate <= new Date(fyYear, 8, 30);
        case "q3":
            return checkDate >= new Date(fyYear, 9, 1)     &&
                   checkDate <= new Date(fyYear, 11, 31);
        case "q4":
            return checkDate >= new Date(fyYear + 1, 0, 1) &&
                   checkDate <= new Date(fyYear + 1, 2, 31);
        default:
            return true;
    }
};

// ── Style helpers ────────────────────────────────────────────
const filterSelectClass = "h-10 px-3 pr-8 bg-white border-2 border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 transition-all cursor-pointer shadow-sm appearance-none";

const getStatusClass = (status: string): string => {
    if (!status) return "bg-slate-100 text-slate-600 border border-slate-200";
    switch (status.toLowerCase()) {
        case "follow_up":        return "bg-yellow-100 text-yellow-700 border border-yellow-200";
        case "marketing_review": return "bg-lime-100 text-lime-700 border border-lime-200";
        case "new_lead":         return "bg-purple-100 text-purple-700 border border-purple-200";
        case "oppurtunity":      return "bg-emerald-100 text-emerald-700 border border-emerald-200";
        case "progress":         return "bg-pink-100 text-pink-700 border border-pink-200";
        case "negotiation":      return "bg-indigo-100 text-indigo-700 border border-indigo-200";
        case "won":              return "bg-green-100 text-green-700 border border-green-200";
        case "lost":             return "bg-red-100 text-red-700 border border-red-200";
        case "cold_call":        return "bg-sky-100 text-sky-700 border border-sky-200";
        default:                 return "bg-slate-100 text-slate-600 border border-slate-200";
    }
};

const getRankClass = (rank: string): string => {
    switch (rank) {
        case "Rank A": return "bg-red-100 text-red-600 border border-red-200";
        case "Rank B": return "bg-orange-100 text-orange-600 border border-orange-200";
        case "Rank C": return "bg-yellow-100 text-yellow-700 border border-yellow-200";
        case "Rank D": return "bg-blue-100 text-blue-700 border border-blue-200";
        case "Rank E": return "bg-slate-100 text-slate-600 border border-slate-200";
        default:       return "bg-slate-100 text-slate-600 border border-slate-200";
    }
};

const toDisplayText = (value: unknown): string => {
    if (value == null) return "";
    if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
        return String(value);
    }
    if (Array.isArray(value)) {
        return value.map((item) => toDisplayText(item)).filter(Boolean).join(", ");
    }
    if (typeof value === "object") {
        const obj = value as Record<string, unknown>;
        const preferred =
            obj.name ??
            obj.title ??
            obj.label ??
            obj.username ??
            obj.user ??
            obj.email ??
            obj.ranks ??
            obj.stages ??
            obj.id;
        if (preferred != null) return toDisplayText(preferred);
        return "";
    }
    return "";
};

// Grid columns — matching Task Workspace density
const GRID_COLS = "40px 1.5fr 1.2fr 0.8fr 1fr 1fr 1.2fr 44px 44px";

const AdminLeadWorkspaceList: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const location = useLocation();
    const navigate = useNavigate();

    const { data, loading, error } = useSelector(
        (state: RootState) => state.fetchAdminLeadWorkspaceListData
    );
    const { response } = useSelector(
        (state: RootState) => state.deleteAdminLeadWorkspaceList
    );

    const [activeItem,          setActiveItem]          = useState<string>("All");
    const [selectedRank,        setSelectedRank]        = useState<string>("All");
    const [dateFilter,          setDateFilter]          = useState<string>("All");
    const [selectedTimePeriod,  setSelectedTimePeriod]  = useState<string>("all");
    const [searchQuery,         setSearchQuery]         = useState<string>("");
    const [expandedRows,        setExpandedRows]        = useState<Set<string>>(new Set());
    const [visibleCount,        setVisibleCount]        = useState(15);

    useEffect(() => {
        dispatch(fetchAdminLeadWorkspaceList() as any);
    }, [dispatch, response]);

    useEffect(() => {
        if (response?.message === "Deleted successfully") {
            alert("Lead Deleted successfully");
            dispatch(clearResponse());
        } else if (response?.message && response.message !== "Deleted successfully") {
            alert("Submission failed");
            dispatch(clearResponse());
        }
    }, [data, navigate, dispatch, response]);

    const isUser = location.pathname.startsWith("/user");

    const handlelistButtonClick = () => {
        if (isUser) {
            navigate("/user/LeadWorkspace");
        } else {
            navigate("/LeadWorkspace");
        }
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setVisibleCount(15);
    };

    const handleEditClick   = (id: string) => navigate(`/EditLeadWorkspace/${id}`);

    const handleDeleteClick = (id: string) => {
        const isConfirmed = window.confirm(
            "Are you sure you want to delete this account?"
        );
        if (isConfirmed) {
            dispatch(deleteAdminLeadWorkspaceTableData(id) as any);
        }
    };

    const toggleRow = (id: string) => {
        setExpandedRows((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    // ── Old date filter (kept for the existing dateFilter dropdown) ──
    const filterByDate = (dateString: string) => {
        if (!dateString) return false;
        const today   = new Date();
        const expDate = new Date(dateString);
        const diffMonths =
            (today.getFullYear() - expDate.getFullYear()) * 12 +
            (today.getMonth()    - expDate.getMonth());
        switch (dateFilter) {
            case "Monthly":     return diffMonths === 0;
            case "Quarterly":   return diffMonths >= 0 && diffMonths < 3;
            case "Half-Yearly": return diffMonths >= 0 && diffMonths < 6;
            case "Yearly":      return diffMonths >= 0 && diffMonths < 12;
            default:            return true;
        }
    };

    // ── Safe data ────────────────────────────────────────────
    const safeData = Array.isArray(data) ? data : [];

    // ── Filtered data ────────────────────────────────────────
    const filteredData = (
        activeItem === "All"
            ? [...safeData]
            : safeData.filter((lead: any) => lead.status === activeItem)
    ).reverse();

    const searchedData = filteredData
        .filter((lead: Lead) =>
            [lead.lead, lead.assign_to, lead.account_name].some((field) =>
                toDisplayText(field).toLowerCase().includes(searchQuery.toLowerCase())
            )
        )
        .filter(
            (lead: Lead) =>
                selectedRank === "All" ||
                lead.lead_stages?.some((stage) => stage.ranks === selectedRank)
        )
        .filter(
            (lead: Lead) =>
                dateFilter === "All" || filterByDate(lead.acct_created_date)
        )
        // ── NEW: Time Period Filter ──────────────────────────
        .filter((lead: Lead) =>
            isInTimePeriod(lead.acct_created_date, selectedTimePeriod)
        );

    const visibleData = searchedData.slice(0, visibleCount);

    // ── KPI Stats ────────────────────────────────────────────
    const totalLeads    = safeData.length;
    const thisMonth     = safeData.filter((lead: Lead) => {
        if (!lead.acct_created_date) return false;
        const today   = new Date();
        const expDate = new Date(lead.acct_created_date);
        return today.getMonth()    === expDate.getMonth() &&
               today.getFullYear() === expDate.getFullYear();
    }).length;
    const totalValue    = safeData.reduce(
        (acc: number, lead: Lead) => acc + (lead.total_amount ?? 0), 0
    );
    const rankALeads    = safeData.filter((lead: Lead) =>
        lead.lead_stages?.some((s) => s.ranks === "Rank A")
    ).length;
    const filteredCount = searchedData.length;

    const formatValue = (val: number) => {
        if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)}Cr`;
        if (val >= 100000)   return `₹${(val / 100000).toFixed(1)}L`;
        if (val >= 1000)     return `₹${(val / 1000).toFixed(1)}K`;
        return `₹${val}`;
    };

    const kpiCards = [
        { label: "Total Leads",      value: totalLeads,              gradient: "from-indigo-600 to-indigo-500",   icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg> },
        { label: "Added This Month", value: thisMonth,               gradient: "from-emerald-600 to-emerald-400", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg> },
        { label: "Total Value",      value: formatValue(totalValue), gradient: "from-amber-500 to-yellow-400",    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> },
        { label: "Rank A Leads",     value: rankALeads,              gradient: "from-purple-700 to-purple-500",   icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> },
        { label: "Filtered Results", value: filteredCount,           gradient: "from-cyan-600 to-cyan-400",       icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg> },
    ];

    return (
        <div className="w-full min-h-full bg-slate-100 p-7 pb-28 flex flex-col gap-6 overflow-y-auto overflow-x-hidden">

            {/* ── Page Header ── */}
            <div className="flex items-center justify-between flex-wrap gap-4">
                {/* Title — violet text, no banner, exactly as current */}
                <div>
                    <h1 className="text-[22px] font-bold text-violet-700 m-0 tracking-tight leading-tight">Lead Workspace</h1>
                    <p className="text-[13px] text-violet-400 mt-1 m-0 font-normal">Manage and track all lead records</p>
                </div>

                {/* Controls row */}
                <div className="flex items-center gap-3 flex-wrap">

                    {/* ── NEW: Time Period Filter ── */}
                    <select
                        className={filterSelectClass}
                        value={selectedTimePeriod}
                        onChange={(e) => {
                            setSelectedTimePeriod(e.target.value);
                            setVisibleCount(15);
                        }}
                    >
                        {TIME_PERIODS.map((t) => (
                            <option key={t.value} value={t.value}>{t.label}</option>
                        ))}
                    </select>

                    {/* Status filter — commented out in original, preserved */}
                    {/* <select value={activeItem} onChange={(e) => { setActiveItem(e.target.value); setVisibleCount(15); }} className={filterSelectClass}>
                        <option value="All">All Status</option>
                        <option value="Won Lead">Won Lead</option>
                        <option value="Lost Lead">Lost Lead</option>
                        <option value="cold_call">Cold Call</option>
                    </select> */}

                    {/* Rank filter */}
                    <select
                        className={filterSelectClass}
                        value={selectedRank}
                        onChange={(e) => {
                            setSelectedRank(e.target.value);
                            setVisibleCount(15);
                        }}
                    >
                        <option value="All">All Ranks</option>
                        <option value="Rank A">Rank A</option>
                        <option value="Rank B">Rank B</option>
                        <option value="Rank C">Rank C</option>
                        <option value="Rank D">Rank D</option>
                        <option value="Rank E">Rank E</option>
                    </select>

                    {/* Old date range filter — commented out in original, preserved */}
                    {/* <select value={dateFilter} onChange={(e) => { setDateFilter(e.target.value); setVisibleCount(15); }} className={filterSelectClass}>
                        <option value="All">All Time</option>
                        <option value="Yearly">Yearly</option>
                        <option value="Half-Yearly">Half-Yearly</option>
                        <option value="Monthly">Monthly</option>
                        <option value="Quarterly">Quarterly</option>
                    </select> */}

                    {/* Search */}
                    <div className="flex items-center gap-2 bg-white border-2 border-slate-200 rounded-xl px-4 h-10 w-64 shadow-sm focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-400/20 transition-all">
                        <MdOutlineSearch className="text-slate-400 text-lg shrink-0" />
                        <input
                            type="text"
                            placeholder="Search by account or holder…"
                            className="border-none outline-none bg-transparent text-sm text-slate-800 w-full placeholder:text-slate-300"
                            onChange={handleSearchChange}
                            value={searchQuery}
                        />
                        {searchQuery && (
                            <button
                                className="text-slate-400 hover:text-indigo-500 text-xs transition-colors"
                                onClick={() => { setSearchQuery(""); setVisibleCount(15); }}
                            >
                                ✕
                            </button>
                        )}
                    </div>

                    {/* Create button */}
                    <button
                        className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white border-none rounded-xl px-4 h-10 text-sm font-semibold cursor-pointer shadow-lg shadow-indigo-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-300 transition-all duration-200"
                        onClick={handlelistButtonClick}
                    >
                        <AiOutlinePlusCircle size={18} />
                        <span>Create Lead</span>
                    </button>
                </div>
            </div>

            {/* ── KPI Cards ── */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {kpiCards.map(({ label, value, gradient, icon }) => (
                    <div
                        key={label}
                        className={`bg-gradient-to-br ${gradient} rounded-2xl p-5 flex items-center gap-4 shadow-lg hover:-translate-y-1 hover:shadow-xl transition-all duration-200 cursor-default overflow-hidden relative`}
                    >
                        <div className="w-11 h-11 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0 text-white">
                            {icon}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-[26px] font-extrabold text-white tracking-tight leading-none">{value}</div>
                            <div className="text-[12px] font-medium text-white/75 mt-1 whitespace-nowrap">{label}</div>
                        </div>
                        <span className="absolute right-3 bottom-[-8px] text-[52px] font-extrabold text-white/10 pointer-events-none select-none leading-none">{value}</span>
                    </div>
                ))}
            </div>

            {/* ── Table Card ── */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-md">

                {/* Table top bar */}
                <div className="flex items-center justify-between px-5 pt-4 pb-2">
                    <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-[0_0_0_3px_rgba(99,102,241,0.2)] animate-pulse" />
                        <span className="text-sm font-bold text-slate-800">All Leads</span>
                        <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{searchedData.length} records</span>
                    </div>
                </div>

                {/* Table Header — indigo/blue gradient matching Task Workspace */}
                <div
                    className="grid gap-3 px-4 py-3 mx-3 mb-1 rounded-xl bg-gradient-to-r from-indigo-700 to-blue-600 text-[10.5px] font-bold uppercase tracking-widest text-white/90"
                    style={{ gridTemplateColumns: GRID_COLS }}
                >
                    <span></span>
                    <span>Account Name</span>
                    <span>Lead</span>
                    <span>PIC</span>
                    <span>Assign To</span>
                    <span>Date</span>
                    <span>Status</span>
                    <span></span>
                    <span></span>
                </div>

                {/* Loading skeleton */}
                {loading && (
                    <div className="p-5">
                        {[...Array(5)].map((_, i) => (
                            <div
                                key={i}
                                className="grid gap-3 px-4 py-4 border-b border-slate-100 items-center animate-pulse"
                                style={{ gridTemplateColumns: GRID_COLS }}
                            >
                                {[...Array(7)].map((_, j) => (
                                    <div key={j} className="h-3.5 bg-slate-200 rounded-md" />
                                ))}
                            </div>
                        ))}
                    </div>
                )}

                {/* Error */}
                {error && !loading && (
                    <div className="p-5">
                        <div className="flex flex-col items-center gap-3 py-14 text-center">
                            <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center">
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2.5">
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="12" y1="8" x2="12" y2="12" />
                                    <line x1="12" y1="16" x2="12.01" y2="16" />
                                </svg>
                            </div>
                            <p className="text-sm font-bold text-slate-600 m-0">Failed to load data</p>
                            <p className="text-xs text-slate-400 m-0">{error}</p>
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {!loading && !error && searchedData.length === 0 && (
                    <div className="flex flex-col items-center gap-3 py-14 text-center">
                        <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center">
                            <svg width="28" height="28" viewBox="0 0 48 48" fill="none">
                                <rect x="8" y="12" width="32" height="28" rx="3" stroke="#94A3B8" strokeWidth="2.5"/>
                                <path d="M16 12V10a2 2 0 012-2h12a2 2 0 012 2v2" stroke="#94A3B8" strokeWidth="2.5"/>
                                <path d="M17 22h14M17 28h10" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round"/>
                            </svg>
                        </div>
                        <p className="text-sm font-bold text-slate-600 m-0">No leads found</p>
                        <p className="text-xs text-slate-400 m-0">Try adjusting your filters or search query</p>
                    </div>
                )}

                {/* Data Rows */}
                {!loading && !error && visibleData.map((row: any, idx: number) => (
                    <div
                        key={row.id}
                        className="border-b border-slate-100 last:border-none"
                        style={{ borderLeft: expandedRows.has(row.id) ? '4px solid #6366f1' : '4px solid transparent' }}
                    >
                        {/* Main Row */}
                        <div
                            className={`grid gap-3 px-4 items-center h-14 transition-all duration-150 cursor-default ${expandedRows.has(row.id) ? 'bg-indigo-50/60' : 'bg-white hover:bg-slate-50'}`}
                            style={{ gridTemplateColumns: GRID_COLS }}
                        >
                            <button
                                className="flex items-center justify-center w-7 h-7 rounded-lg hover:bg-indigo-100 transition-colors"
                                onClick={() => toggleRow(row.id)}
                                aria-label="Expand row"
                            >
                                <IoIosArrowDropdown
                                    size={20}
                                    className={`transition-all duration-200 ${expandedRows.has(row.id) ? 'rotate-180 text-indigo-500' : 'text-slate-400'}`}
                                />
                            </button>

                            <div className="text-sm font-bold text-slate-900 truncate">{toDisplayText(row.account_name) || "—"}</div>

                            <div className="text-sm text-slate-500 truncate">{toDisplayText(row.lead) || "—"}</div>

                            <div>
                                {row.pic ? (
                                    <span className="inline-flex items-center px-2.5 py-0.5 bg-gradient-to-r from-indigo-50 to-violet-50 text-indigo-600 rounded-full text-[11px] font-bold border border-indigo-200 whitespace-nowrap max-w-full overflow-hidden text-ellipsis">
                                        {toDisplayText(row.pic)}
                                    </span>
                                ) : "—"}
                            </div>

                            <div>
                                {row.assign_to ? (
                                    <span className="inline-flex items-center px-2.5 py-0.5 bg-gradient-to-r from-orange-50 to-amber-50 text-orange-600 rounded-full text-[11px] font-bold border border-orange-200 whitespace-nowrap">
                                        {toDisplayText(row.assign_to)}
                                    </span>
                                ) : "—"}
                            </div>

                            <div>
                                <span className="font-mono text-[11.5px] text-slate-500 bg-slate-50 px-2 py-0.5 rounded">
                                    {row.acct_created_date || "—"}
                                </span>
                            </div>

                            <div>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${getStatusClass(row.status || "")}`}>
                                    {row.status || "N/A"}
                                </span>
                            </div>

                            <button
                                className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:bg-amber-50 hover:text-amber-600 hover:scale-110 transition-all"
                                onClick={(e) => { e.stopPropagation(); handleEditClick(row.id); }}
                                aria-label="Edit"
                            >
                                <FaRegEdit size={14} />
                            </button>

                            <button
                                className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 hover:scale-110 transition-all"
                                onClick={(e) => { e.stopPropagation(); handleDeleteClick(row.id); }}
                                aria-label="Delete"
                            >
                                <MdOutlineDelete size={16} />
                            </button>
                        </div>

                        {/* Expanded Detail Panel */}
                        {expandedRows.has(row.id) && (
                            <div className="bg-gradient-to-br from-slate-50 to-indigo-50/40 border-t border-slate-200 w-full">
                                <div className="px-14 py-5 pb-8">
                                    {/* Detail Header */}
                                    <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white font-extrabold text-base shadow-md shadow-indigo-200">
                                                {(toDisplayText(row.account_name) || "L")[0].toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-slate-900">{toDisplayText(row.account_name) || "—"}</div>
                                                <div className="text-xs text-slate-400 mt-0.5">Lead Details</div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 flex-wrap">
                                            {row.vertical && (
                                                <span className="text-[11px] font-bold px-2.5 py-0.5 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200">
                                                    {toDisplayText(row.vertical)}
                                                </span>
                                            )}
                                            {row.lead_stages?.map((stage: Stage, i: number) => (
                                                <span
                                                    key={i}
                                                    className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${getRankClass(stage.ranks)}`}
                                                >
                                                    {stage.ranks}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Detail Grid */}
                                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                                        {[
                                            { label: "Business Type", value: row.business_type,                                                          icon: "🏢" },
                                            { label: "Make",          value: row.make,                                                                   icon: "🏭" },
                                            { label: "Sub Make",      value: row.sub_make,                                                               icon: "🔧" },
                                            { label: "Quantity",      value: row.qty,                                                                    icon: "📦" },
                                            { label: "Location",      value: row.location,                                                               icon: "📍" },
                                            { label: "City",          value: row.city,                                                                   icon: "🏙️" },
                                            { label: "State",         value: row.state,                                                                  icon: "🗺️" },
                                            { label: "Region",        value: row.region,                                                                 icon: "🌍" },
                                            { label: "Mobile",        value: row.mobile_number,                                                          icon: "📱" },
                                            { label: "Hardware",      value: row.hardware_amount    != null ? `₹${row.hardware_amount}`    : null,        icon: "💻" },
                                            { label: "Software",      value: row.software_amount    != null ? `₹${row.software_amount}`    : null,        icon: "🖥️" },
                                            { label: "Automation",    value: row.automation_amount  != null ? `₹${row.automation_amount}`  : null,        icon: "⚙️" },
                                            { label: "Others",        value: row.others_amount      != null ? `₹${row.others_amount}`      : null,        icon: "🧩" },
                                            { label: "Total Amount",  value: row.total_amount       != null ? formatValue(row.total_amount) : null,        icon: "💰" },
                                            { label: "Exp Closure",   value: row.exp_closure_date,                                                       icon: "📅" },
                                            { label: "Exp PO Date",   value: row.exp_po_date,                                                            icon: "📋" },
                                            { label: "Remarks",       value: row.remarks,                                                                icon: "📝" },
                                        ].map(({ label, value, icon }) => (
                                            <div
                                                key={label}
                                                className="flex flex-col gap-1 bg-white/70 border border-slate-200 rounded-xl px-3 py-2.5 hover:bg-white hover:shadow-sm transition-all"
                                            >
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1">
                                                    <span className="text-[11px]">{icon}</span>
                                                    {label}
                                                </span>
                                                <span className="text-sm font-semibold text-slate-700 truncate">{toDisplayText(value) || "—"}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}

                {/* Load More */}
                {!loading && !error && visibleCount < searchedData.length && (
                    <div className="flex justify-center p-5 border-t border-slate-100">
                        <button
                            onClick={() => setVisibleCount((c) => c + 15)}
                            className="px-7 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white border-none rounded-xl text-sm font-semibold cursor-pointer shadow-lg shadow-indigo-200 hover:-translate-y-0.5 hover:shadow-xl transition-all"
                        >
                            Load more · {searchedData.length - visibleCount} remaining
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminLeadWorkspaceList;
