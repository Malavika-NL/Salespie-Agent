// import React, { useEffect, useState } from "react";
// import Navbar from "../UserDashboard/components/navbar/navbar";
// import UserSidebar from "../UserHome/components/UserSidebar/userSidebar";
// import styles from "./LeadWorkspaceList.module.css";
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
// import { fetchLeadWorkspaceList } from "./Slice/LeadWorkspaceList";
// import { useNavigate } from "react-router-dom";


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
//     // email_id: string;
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
// const LeadWorkspaceList: React.FC = () => {
//     const dispatch = useDispatch();

//     useEffect(() => {
//         dispatch(fetchLeadWorkspaceList() as any);
//     }, [dispatch]);

//     const { data, loading, error } = useSelector((state: RootState) => state.fetchLeadWorkspaceListData);
//     const [activeItem, setActiveItem] = useState<string>('All');  // Set 'All' as the default
//     const [showForm, setShowForm] = useState(false);
//     const token = useSelector((state: RootState) => state.userLoginAuth?.user?.tokens.access) || localStorage.getItem('token');

//     console.log('daataa', data)
//     const handleItemClick = (item: string) => {
//         setActiveItem(item === activeItem ? 'All' : item); // Toggle active item
//     };
//     const handleButtonClick = () => {
//         setShowForm(true);
//         console.log('opened')
//     };

//     const handleCloseForm = () => {
//         setShowForm(false);
//     };

//     // const updateTaskDetails = (updatedTask: Task) => {
//     //     // Extract only necessary fields
//     //     const patchData = {
//     //         status: updatedTask.status,
//     //         outcome: updatedTask.outcome,
//     //     };

//     //     fetch(`http://localhost:8000/tasks/${updatedTask.id}/`, {
//     //         method: 'PATCH',
//     //         headers: {
//     //             'Content-Type': 'application/json',
//     //             'Authorization': `Bearer ${token}`,
//     //         },
//     //         body: JSON.stringify(patchData), 
//     //     })
//     //         .then((response) => {
//     //             if (!response.ok) {
//     //                 throw new Error('Failed to update the task');
//     //             }
//     //             return response.json();
//     //         })
//     //         .then(() => {

//     //             setShowEditForm(false);


//     //             dispatch(fetchTaskDetails() as any);
//     //         })
//     //         .catch((error) => {
//     //             console.error('Error updating task:', error);
//     //         });
//     // };
//     const navigate = useNavigate();
//     const handlelistButtonClick = () => {
//         navigate('/user/UserLeadDashboard');
//     };
//     const handleEditClick = (id: string) => navigate(`/user/EditUserLeadWorkspace/${id}`);

//     const [searchQuery, setSearchQuery] = useState<string>("");

//     const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         setSearchQuery(e.target.value);
//     };


//     // Filter tasks based on the selected status
//     const filteredData = (activeItem === 'All'
//         ? [...data] // Create a shallow copy of taskdata
//         : data?.filter((lead: any) => lead.status === activeItem)
//     )?.reverse();

//     const searchedData = filteredData?.filter((lead: Lead) =>
//         [lead.lead, lead.assign_to, lead.account_name]
//             .some(field => field?.toLowerCase().includes(searchQuery.toLowerCase()))
//     );

//     const getPriorityStyle = (priority: string) => {
//         switch (priority.toLowerCase()) {
//             case "high":
//                 return { color: "#C32C2C" };
//             case "medium":
//                 return { color: "#FF9C07" };
//             case "low":
//                 return { color: "#418F11" };
//             default:
//                 return { backgroundColor: "#ccc", color: "#000" };
//         }
//     };

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

//     return (

//         <div className={styles.mainContent}>
//             <div className={styles.header}>
//                 <div className={styles.title} >Lead List</div>
//                 <button className={styles.createButton} onClick={handlelistButtonClick} >
//                     <span>Lead Dashboard</span>
                    
//                 </button>
//             </div>
//             <div className={styles.filterContainer}>
//                 <div className={styles.leftContainer}>
//                     <div
//                         className={`${styles.divItem} ${activeItem === 'All' ? styles.active : ''}`}
//                         onClick={() => handleItemClick('All')}
//                     >
//                         All
//                     </div>
//                     <div
//                         className={`${styles.divItem} ${activeItem === 'Won Lead' ? styles.active : ''}`}
//                         onClick={() => handleItemClick('Won Lead')}
//                     >
//                         Won Lead
//                     </div>
//                     <div
//                         className={`${styles.divItem} ${activeItem === 'Lost Lead' ? styles.active : ''}`}
//                         onClick={() => handleItemClick('Lost Lead')}
//                     >
//                         Lost Lead
//                     </div>

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
//             <div className={styles.gridContainer}>
//                 <div className={styles.div1}><IoIosSquare className={styles.icon} /></div>
//                 <div className={styles.div2}> Account Name</div>
//                 <div className={styles.div3}>Lead</div>
//                 <div className={styles.div4}>PIC</div>
//                 <div className={styles.div5}>Assign By</div>
//                 <div className={styles.div6}> Date</div>
//                 <div className={styles.div7}>Status</div>
//                 <div className={styles.div8}></div>
//             </div>

//             {/* Map over filtered task data */}
//             {searchedData && searchedData.map((lead: any, index: number) => (
//                 <div key={index} className={styles.gridRow}>
//                     <div className={styles.div1}><IoMdSquareOutline className={styles.icon} /></div>
//                     <div className={styles.div2}>{lead.account_name || "N/A"}</div>
//                     <div className={styles.div3}>{lead.lead || "N/A"}</div>
//                     <div className={styles.div3}>{lead.pic || "N/A"}</div>
//                     <div className={styles.div5}>{lead.user || "N/A"}</div>
//                     <div className={styles.div6}>{lead.acct_created_date || "N/A"}</div>
//                     <div className={styles.div7}>
//                         <div className={getStatusClass(lead.status || "")}>
//                             {lead.status || "N/A"}
//                         </div>
//                     </div>
//                     <div className={styles.div8}
//                     ><FaRegEdit className={styles.editIcon}
//                         onClick={() => handleEditClick(lead.id)}
//                         title="Edit" /></div>
//                 </div>
//             ))}

//         </div>

//     );
// };

// export default LeadWorkspaceList;
// =============================================================================================================================
// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import type { RootState } from "../../app/store";
// import { IoIosArrowDropdown } from "react-icons/io";
// import { FaRegEdit } from "react-icons/fa";
// import { MdOutlineSearch } from "react-icons/md";
// import { useNavigate } from "react-router-dom";
// import { fetchLeadWorkspaceList } from "./Slice/LeadWorkspaceList";
// import styles from "./LeadWorkspaceList.module.css";

// const STATUS_FILTERS = ["All", "Won Lead", "Lost Lead"];

// const LeadWorkspaceList: React.FC = () => {
//   const dispatch = useDispatch<any>();
//   const navigate = useNavigate();

//   const [searchQuery,  setSearchQuery]  = useState("");
//   const [activeFilter, setActiveFilter] = useState("All");
//   const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
//   const [visibleCount, setVisibleCount] = useState(15);

//   const { data, loading, error } = useSelector(
//     (state: RootState) => state.fetchLeadWorkspaceListData
//   );

//   useEffect(() => {
//     dispatch(fetchLeadWorkspaceList() as any);
//   }, [dispatch]);

//   /* ── filtering ── */
//   const statusFiltered =
//     activeFilter === "All"
//       ? [...data].reverse()
//       : [...data].reverse().filter((l: any) => l.status === activeFilter);

//   const filteredData = statusFiltered.filter((lead: any) =>
//     [lead.lead, lead.assign_to, lead.account_name]
//       .some((f) => f?.toLowerCase().includes(searchQuery.toLowerCase()))
//   );

//   const visibleData = filteredData.slice(0, visibleCount);

//   const toggleRow  = (id: string) =>
//     setExpandedRows((prev) => {
//       const next = new Set(prev);
//       next.has(id) ? next.delete(id) : next.add(id);
//       return next;
//     });

//   const handleEdit = (id: string) => navigate(`/user/EditUserLeadWorkspace/${id}`);

//   /* ── status badge color ── */
//   const statusColor: Record<string, string> = {
//     follow_up:        "#B7A112",
//     marketing_review: "#6D940B",
//     new_lead:         "#462A8C",
//     oppurtunity:      "#2bc24c",
//     Progress:         "#9A0D76",
//     Negotiation:      "#0933A6",
//     won:              "#61f107",
//     "Won Lead":       "#61f107",
//     lost:             "#ca1717",
//     "Lost Lead":      "#ca1717",
//     cold_call:        "#0f7ce9",
//   };

//   return (
//     <div className={styles.page}>

//       {/* ── Page header ── */}
//       <div className={styles.pageHeader}>
//         <div>
//           <h1 className={styles.pageTitle}>Lead Workspace</h1>
//           <p className={styles.pageSubtitle}>Manage and view all lead records</p>
//         </div>

//         <div className={styles.headerRight}>
//           {/* Filter pills */}
//           <div className={styles.filterPills}>
//             {STATUS_FILTERS.map((f) => (
//               <button
//                 key={f}
//                 className={`${styles.pill} ${activeFilter === f ? styles.pillActive : ""}`}
//                 onClick={() => { setActiveFilter(f); setVisibleCount(15); }}
//               >
//                 {f}
//               </button>
//             ))}
//           </div>

//           {/* Search */}
//           <div className={styles.searchBar}>
//             <MdOutlineSearch className={styles.searchIcon} />
//             <input
//               className={styles.searchInput}
//               placeholder="Search by lead, account…"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//             />
//             {searchQuery && (
//               <button className={styles.clearBtn} onClick={() => setSearchQuery("")}>✕</button>
//             )}
//           </div>

//           {/* Dashboard button */}
//           <button
//             className={styles.dashBtn}
//             onClick={() => navigate("/user/UserLeadDashboard")}
//           >
//             Lead Dashboard
//           </button>
//         </div>
//       </div>

//       {/* ── Table card ── */}
//       <div className={styles.tableCard}>

//         {/* Header */}
//         <div className={styles.tableHeader}>
//           <div className={styles.thCell} />
//           <div className={styles.thCell}>Account Name</div>
//           <div className={styles.thCell}>Lead</div>
//           <div className={styles.thCell}>PIC</div>
//           <div className={styles.thCell}>Assign By</div>
//           <div className={styles.thCell}>Date</div>
//           <div className={styles.thCell}>Status</div>
//           <div className={styles.thCell} />
//         </div>

//         {/* Loading skeleton */}
//         {loading && (
//           <div className={styles.stateBox}>
//             {[1,2,3,4,5].map((i) => (
//               <div key={i} className={styles.skeletonRow}>
//                 {[1,2,3,4,5,6,7].map((j) => (
//                   <div key={j} className={styles.skeletonCell} />
//                 ))}
//               </div>
//             ))}
//           </div>
//         )}

//         {/* Error */}
//         {error && !loading && (
//           <div className={styles.stateBox}>
//             <div className={styles.emptyState}>
//               <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#F87171" strokeWidth="1.5">
//                 <circle cx="12" cy="12" r="10"/>
//                 <line x1="12" y1="8"  x2="12"   y2="12"/>
//                 <line x1="12" y1="16" x2="12.01" y2="16"/>
//               </svg>
//               <p className={styles.emptyText}>Failed to load data. Please refresh.</p>
//             </div>
//           </div>
//         )}

//         {/* Empty */}
//         {!loading && !error && filteredData.length === 0 && (
//           <div className={styles.stateBox}>
//             <div className={styles.emptyState}>
//               <svg width="40" height="40" viewBox="0 0 48 48" fill="none">
//                 <rect x="8" y="12" width="32" height="28" rx="3" stroke="#94A3B8" strokeWidth="2"/>
//                 <path d="M16 12V10a2 2 0 012-2h12a2 2 0 012 2v2" stroke="#94A3B8" strokeWidth="2"/>
//                 <path d="M17 22h14M17 28h10" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round"/>
//               </svg>
//               <p className={styles.emptyText}>No leads match your search</p>
//             </div>
//           </div>
//         )}

//         {/* Rows */}
//         {!loading && !error && visibleData.map((lead: any, idx: number) => (
//           <div
//             key={lead.id}
//             className={styles.rowGroup}
//             style={{ animationDelay: `${idx * 30}ms` }}
//           >
//             {/* Main row */}
//             <div className={`${styles.tableRow} ${expandedRows.has(lead.id) ? styles.rowExpanded : ""}`}>
//               <button
//                 className={styles.chevronBtn}
//                 onClick={() => toggleRow(lead.id)}
//                 aria-label="Expand row"
//               >
//                 <IoIosArrowDropdown
//                   size={20}
//                   className={`${styles.chevron} ${expandedRows.has(lead.id) ? styles.chevronOpen : ""}`}
//                 />
//               </button>

//               <div className={styles.tdCell}>
//                 <span className={styles.accountName}>{lead.account_name || "—"}</span>
//               </div>
//               <div className={styles.tdCell}>
//                 <span className={styles.leadName}>{lead.lead || "—"}</span>
//               </div>
//               <div className={styles.tdCell}>
//                 <span className={styles.picBadge}>{lead.pic || "—"}</span>
//               </div>
//               <div className={styles.tdCell}>
//                 <span className={styles.holderBadge}>{lead.user || "—"}</span>
//               </div>
//               <div className={styles.tdCell}>
//                 <span className={styles.dateCell}>{lead.acct_created_date || "—"}</span>
//               </div>
//               <div className={styles.tdCell}>
//                 {lead.status ? (
//                   <span
//                     className={styles.statusBadge}
//                     style={{ background: statusColor[lead.status] ?? "#94A3B8" }}
//                   >
//                     {lead.status.replace(/_/g, " ")}
//                   </span>
//                 ) : (
//                   <span className={styles.empty}>—</span>
//                 )}
//               </div>

//               <button
//                 className={styles.editBtn}
//                 onClick={() => handleEdit(lead.id)}
//                 aria-label="Edit lead"
//               >
//                 <FaRegEdit size={14} />
//               </button>
//             </div>

//             {/* Expanded detail panel */}
//             {expandedRows.has(lead.id) && (
//               <div className={styles.detailPanel}>
//                 <div className={styles.detailPanelInner}>
//                   <div className={styles.detailHeader}>
//                     <span className={styles.detailTitle}>{lead.account_name}</span>
//                     <span className={styles.detailSubtitle}>Lead Details</span>
//                   </div>
//                   <div className={styles.detailGrid}>
//                     {[
//                       { label: "Business Type",    value: lead.business_type    },
//                       { label: "Make",             value: lead.make             },
//                       { label: "Sub Make",         value: lead.sub_make         },
//                       { label: "Sub Make Brand",   value: lead.sub_make_brand   },
//                       { label: "Designation",      value: lead.designation      },
//                       { label: "Department",       value: lead.department       },
//                       { label: "Mobile",           value: lead.mobile_number    },
//                       { label: "Location",         value: lead.location         },
//                       { label: "State",            value: lead.state            },
//                       { label: "City",             value: lead.city             },
//                       { label: "Qty",              value: lead.qty              },
//                       { label: "Value",            value: lead.values != null ? `₹${lead.values.toLocaleString()}` : null },
//                       { label: "Expected Closure", value: lead.exp_closure_date },
//                       { label: "Expected PO Date", value: lead.exp_po_date      },
//                       { label: "Region",           value: lead.region           },
//                       { label: "Vertical",         value: lead.vertical         },
//                       { label: "Remarks",          value: lead.remarks          },
//                       { label: "Total Amount",     value: lead.total_amount != null ? `₹${lead.total_amount.toLocaleString()}` : null },
//                     ].map(({ label, value }) => (
//                       <div key={label} className={styles.detailItem}>
//                         <span className={styles.detailLabel}>{label}</span>
//                         <span className={styles.detailValue}>{value || "—"}</span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         ))}

//         {/* Load more */}
//         {!loading && visibleCount < filteredData.length && (
//           <div className={styles.loadMoreWrap}>
//             <button
//               className={styles.loadMoreBtn}
//               onClick={() => setVisibleCount((c) => c + 15)}
//             >
//               Load more ({filteredData.length - visibleCount} remaining)
//             </button>
//           </div>
//         )}

//       </div>
//     </div>
//   );
// };

// export default LeadWorkspaceList;

// =========================================================================================================================

// import React, { useEffect, useState, useRef, useCallback } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import type { RootState } from "../../app/store";
// import { IoIosArrowDropdown } from "react-icons/io";
// import { FaRegEdit } from "react-icons/fa";
// import { MdOutlineSearch } from "react-icons/md";
// import { useNavigate } from "react-router-dom";
// import { fetchLeadWorkspaceList } from "./Slice/LeadWorkspaceList";
// import styles from "./LeadWorkspaceList.module.css";

// const STATUS_FILTERS = ["All", "Won Lead", "Lost Lead"];

// /* ── Status badge colors ── */
// const statusColor: Record<string, string> = {
//   follow_up:        "#B7A112",
//   marketing_review: "#6D940B",
//   new_lead:         "#462A8C",
//   oppurtunity:      "#2bc24c",
//   Progress:         "#9A0D76",
//   Negotiation:      "#0933A6",
//   won:              "#61f107",
//   "Won Lead":       "#61f107",
//   lost:             "#ca1717",
//   "Lost Lead":      "#ca1717",
//   cold_call:        "#0f7ce9",
// };

// const LeadWorkspaceList: React.FC = () => {
//   const dispatch = useDispatch<any>();
//   const navigate = useNavigate();

//   const [searchQuery,  setSearchQuery]  = useState("");
//   const [activeFilter, setActiveFilter] = useState("All");
//   const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
//   const [visibleCount, setVisibleCount] = useState(15);

//   const { data, loading, error } = useSelector(
//     (state: RootState) => state.fetchLeadWorkspaceListData
//   );

//   useEffect(() => {
//     dispatch(fetchLeadWorkspaceList() as any);
//   }, [dispatch]);

//   /* ── Filtering ── */
//   const statusFiltered =
//     activeFilter === "All"
//       ? [...data].reverse()
//       : [...data].reverse().filter((l: any) => l.status === activeFilter);

//   const filteredData = statusFiltered.filter((lead: any) =>
//     [lead.lead, lead.assign_to, lead.account_name].some((f) =>
//       f?.toLowerCase().includes(searchQuery.toLowerCase())
//     )
//   );

//   /* ── Infinite scroll ── */
//   const sentinelRef    = useRef<HTMLDivElement>(null);
//   const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
//     if (entries[0].isIntersecting && visibleCount < filteredData.length) {
//       setVisibleCount(c => c + 15);
//     }
//   }, [visibleCount, filteredData.length]);

//   useEffect(() => {
//     const observer = new IntersectionObserver(handleObserver, { threshold: 0.1 });
//     if (sentinelRef.current) observer.observe(sentinelRef.current);
//     return () => observer.disconnect();
//   }, [handleObserver]);

//   const visibleData = filteredData.slice(0, visibleCount);

//   const toggleRow = (id: string) =>
//     setExpandedRows((prev) => {
//       const next = new Set(prev);
//       next.has(id) ? next.delete(id) : next.add(id);
//       return next;
//     });

//   const handleEdit = (id: string) => navigate(`/user/EditUserLeadWorkspace/${id}`);

//   /* ── KPI calculations ── */
//   const totalLeads  = data.length;
//   const wonLeads    = data.filter((l: any) => l.status === "Won Lead" || l.status === "won").length;
//   const lostLeads   = data.filter((l: any) => l.status === "Lost Lead" || l.status === "lost").length;
//   const activeLeads = data.filter(
//     (l: any) => l.status !== "Won Lead" && l.status !== "won" &&
//                 l.status !== "Lost Lead" && l.status !== "lost"
//   ).length;

//   return (
//     <div className={styles.page}>

//       {/* ── Page header ── */}
//       <div className={styles.pageHeader}>
//         <div>
//           <h1 className={styles.pageTitle}>Lead Workspace</h1>
//           <p className={styles.pageSubtitle}>Manage and track all lead records</p>
//         </div>

//         <div className={styles.headerRight}>
          
//           {/* Dropdown Filters (Matching the picture) */}
//           <div className={styles.filtersWrapper}>
//             <div className={styles.dropdownFilter}>
//               <select
//                 className={styles.selectInput}
//                 value={activeFilter}
//                 onChange={(e) => { setActiveFilter(e.target.value); setVisibleCount(15); }}
//               >
//                 {STATUS_FILTERS.map((f) => (
//                   <option key={f} value={f}>
//                     {f === "All" ? "All Status" : f}
//                   </option>
//                 ))}
//               </select>
//               <span className={styles.dropdownIcon}>
//                 <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
//               </span>
//             </div>

//             {/* Dummy drop-downs for exact visual match */}
//             <div className={styles.dropdownFilter}>
//               <select className={styles.selectInput} defaultValue="All Ranks">
//                 <option value="All Ranks">All Ranks</option>
//               </select>
//               <span className={styles.dropdownIcon}>
//                 <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
//               </span>
//             </div>

//             <div className={styles.dropdownFilter}>
//               <select className={styles.selectInput} defaultValue="All Time">
//                 <option value="All Time">All Time</option>
//               </select>
//               <span className={styles.dropdownIcon}>
//                 <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
//               </span>
//             </div>
//           </div>

//           {/* Search (Pill shaped) */}
//           <div className={styles.searchBar}>
//             <MdOutlineSearch className={styles.searchIcon} />
//             <input
//               className={styles.searchInput}
//               placeholder="Search by account or holder..."
//               value={searchQuery}
//               onChange={(e) => { setSearchQuery(e.target.value); setVisibleCount(15); }}
//             />
//             {searchQuery && (
//               <button className={styles.clearBtn} onClick={() => setSearchQuery("")}>✕</button>
//             )}
//           </div>

//           {/* Primary Action Button (Purple Pill) */}
//           <button
//             className={styles.primaryActionBtn}
//             onClick={() => navigate("/user/UserLeadDashboard")}
//           >
            
//             Lead Dashboard
//           </button>
//         </div>
//       </div>

//       {/* ── KPI strip — gradient cards ── */}
//       <div className={styles.kpiRow}>

//         <div className={`${styles.kpiCard} ${styles.kpiIndigo}`}>
//           <div className={styles.kpiIconWrap}>
//             <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//               <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
//               <circle cx="9" cy="7" r="4"/>
//               <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
//               <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
//             </svg>
//           </div>
//           <div className={styles.kpiContent}>
//             <div className={styles.kpiValue}>{totalLeads}</div>
//             <div className={styles.kpiLabel}>Total Leads</div>
//           </div>
//           <div className={styles.kpiBgNumber}>{totalLeads}</div>
//         </div>

//         <div className={`${styles.kpiCard} ${styles.kpiEmerald}`}>
//           <div className={styles.kpiIconWrap}>
//             <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//               <polyline points="20 6 9 17 4 12"/>
//             </svg>
//           </div>
//           <div className={styles.kpiContent}>
//             <div className={styles.kpiValue}>{wonLeads}</div>
//             <div className={styles.kpiLabel}>Won Leads</div>
//           </div>
//           <div className={styles.kpiBgNumber}>{wonLeads}</div>
//         </div>

//         <div className={`${styles.kpiCard} ${styles.kpiRose}`}>
//           <div className={styles.kpiIconWrap}>
//             <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//               <circle cx="12" cy="12" r="10"/>
//               <line x1="15" y1="9" x2="9" y2="15"/>
//               <line x1="9" y1="9" x2="15" y2="15"/>
//             </svg>
//           </div>
//           <div className={styles.kpiContent}>
//             <div className={styles.kpiValue}>{lostLeads}</div>
//             <div className={styles.kpiLabel}>Lost Leads</div>
//           </div>
//           <div className={styles.kpiBgNumber}>{lostLeads}</div>
//         </div>

//         <div className={`${styles.kpiCard} ${styles.kpiAmber}`}>
//           <div className={styles.kpiIconWrap}>
//             <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//               <circle cx="11" cy="11" r="8"/>
//               <line x1="21" y1="21" x2="16.65" y2="16.65"/>
//             </svg>
//           </div>
//           <div className={styles.kpiContent}>
//             <div className={styles.kpiValue}>{filteredData.length}</div>
//             <div className={styles.kpiLabel}>Filtered Results</div>
//           </div>
//           <div className={styles.kpiBgNumber}>{filteredData.length}</div>
//         </div>

//       </div>

//       {/* ── Table card ── */}
//       <div className={styles.tableCard}>

//         {/* Table top bar */}
//         <div className={styles.tableTopBar}>
//           <div className={styles.tableTopLeft}>
//             <div className={styles.tableDot} />
//             <span className={styles.tableTopTitle}>All Leads</span>
//             <span className={styles.tableTopCount}>{filteredData.length} records</span>
//           </div>
//         </div>

//         {/* Dark gradient header */}
//         <div className={styles.tableHeader}>
//           <div className={styles.thCell} />
//           <div className={styles.thCell}>Account Name</div>
//           <div className={styles.thCell}>Lead</div>
//           <div className={styles.thCell}>PIC</div>
//           <div className={styles.thCell}>Assign By</div>
//           <div className={styles.thCell}>Date</div>
//           <div className={styles.thCell}>Status</div>
//           <div className={styles.thCell} />
//         </div>

//         {/* Loading skeleton */}
//         {loading && (
//           <div className={styles.stateBox}>
//             {[1,2,3,4,5].map((i) => (
//               <div key={i} className={styles.skeletonRow}>
//                 {[1,2,3,4,5,6,7].map((j) => (
//                   <div key={j} className={styles.skeletonCell}
//                     style={{ animationDelay: `${j * 80}ms` }} />
//                 ))}
//               </div>
//             ))}
//           </div>
//         )}

//         {/* Error */}
//         {error && !loading && (
//           <div className={styles.stateBox}>
//             <div className={styles.emptyState}>
//               <div className={styles.emptyIconWrap} style={{ background: '#FEE2E2' }}>
//                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2">
//                   <circle cx="12" cy="12" r="10"/>
//                   <line x1="12" y1="8"  x2="12"   y2="12"/>
//                   <line x1="12" y1="16" x2="12.01" y2="16"/>
//                 </svg>
//               </div>
//               <p className={styles.emptyTitle}>Failed to load data</p>
//               <p className={styles.emptyText}>Please check your connection and refresh.</p>
//             </div>
//           </div>
//         )}

//         {/* Empty */}
//         {!loading && !error && filteredData.length === 0 && (
//           <div className={styles.stateBox}>
//             <div className={styles.emptyState}>
//               <div className={styles.emptyIconWrap} style={{ background: '#F1F5F9' }}>
//                 <svg width="24" height="24" viewBox="0 0 48 48" fill="none">
//                   <rect x="8" y="12" width="32" height="28" rx="3" stroke="#94A3B8" strokeWidth="2.5"/>
//                   <path d="M16 12V10a2 2 0 012-2h12a2 2 0 012 2v2" stroke="#94A3B8" strokeWidth="2.5"/>
//                   <path d="M17 22h14M17 28h10" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round"/>
//                 </svg>
//               </div>
//               <p className={styles.emptyTitle}>No leads found</p>
//               <p className={styles.emptyText}>Try adjusting your search or filter.</p>
//             </div>
//           </div>
//         )}

//         {/* Rows */}
//         {!loading && !error && visibleData.map((lead: any, idx: number) => (
//           <div
//             key={lead.id}
//             className={styles.rowGroup}
//             style={{ animationDelay: `${Math.min(idx, 10) * 35}ms` }}
//           >
//             <div className={`${styles.tableRow} ${expandedRows.has(lead.id) ? styles.rowExpanded : ""}`}>
//               <button
//                 className={styles.chevronBtn}
//                 onClick={() => toggleRow(lead.id)}
//                 aria-label="Expand row"
//               >
//                 <IoIosArrowDropdown
//                   size={20}
//                   className={`${styles.chevron} ${expandedRows.has(lead.id) ? styles.chevronOpen : ""}`}
//                 />
//               </button>

//               <div className={styles.tdCell}>
//                 <span className={styles.accountName}>{lead.account_name || "—"}</span>
//               </div>
//               <div className={styles.tdCell}>
//                 <span className={styles.leadName}>{lead.lead || "—"}</span>
//               </div>
//               <div className={styles.tdCell}>
//                 <span className={styles.picBadge}>{lead.pic || "—"}</span>
//               </div>
//               <div className={styles.tdCell}>
//                 <span className={styles.holderBadge}>{lead.user || "—"}</span>
//               </div>
//               <div className={styles.tdCell}>
//                 <span className={styles.dateCell}>{lead.acct_created_date || "—"}</span>
//               </div>
//               <div className={styles.tdCell}>
//                 {lead.status ? (
//                   <span
//                     className={styles.statusBadge}
//                     style={{ background: statusColor[lead.status] ?? "#94A3B8" }}
//                   >
//                     {lead.status.replace(/_/g, " ")}
//                   </span>
//                 ) : (
//                   <span className={styles.empty}>—</span>
//                 )}
//               </div>

//               <button
//                 className={styles.editBtn}
//                 onClick={() => handleEdit(lead.id)}
//                 aria-label="Edit lead"
//               >
//                 <FaRegEdit size={14} />
//               </button>
//             </div>

//             {/* Expanded detail panel */}
//             {expandedRows.has(lead.id) && (
//               <div className={styles.detailPanel}>
//                 <div className={styles.detailPanelInner}>
//                   <div className={styles.detailHeader}>
//                     <div className={styles.detailTitleWrap}>
//                       <div className={styles.detailAvatar}>
//                         {(lead.account_name || "L")[0].toUpperCase()}
//                       </div>
//                       <div>
//                         <div className={styles.detailTitle}>{lead.account_name}</div>
//                         <div className={styles.detailTitleSub}>Lead Details</div>
//                       </div>
//                     </div>
//                     {lead.status && (
//                       <span
//                         className={styles.detailStatusBadge}
//                         style={{ background: statusColor[lead.status] ?? "#94A3B8" }}
//                       >
//                         {lead.status.replace(/_/g, " ")}
//                       </span>
//                     )}
//                   </div>
//                   <div className={styles.detailGrid}>
//                     {[
//                       { label: "Business Type",    value: lead.business_type,    icon: "💼" },
//                       { label: "Make",             value: lead.make,             icon: "🏭" },
//                       { label: "Sub Make",         value: lead.sub_make,         icon: "🔩" },
//                       { label: "Sub Make Brand",   value: lead.sub_make_brand,   icon: "🏷️" },
//                       { label: "Designation",      value: lead.designation,      icon: "👤" },
//                       { label: "Department",       value: lead.department,       icon: "🏢" },
//                       { label: "Mobile",           value: lead.mobile_number,    icon: "📱" },
//                       { label: "Location",         value: lead.location,         icon: "📍" },
//                       { label: "State",            value: lead.state,            icon: "🗺️" },
//                       { label: "City",             value: lead.city,             icon: "🏙️" },
//                       { label: "Qty",              value: lead.qty,              icon: "📦" },
//                       { label: "Value",            value: lead.values != null ? `₹${lead.values.toLocaleString()}` : null, icon: "💰" },
//                       { label: "Expected Closure", value: lead.exp_closure_date, icon: "📅" },
//                       { label: "Expected PO Date", value: lead.exp_po_date,      icon: "🗓️" },
//                       { label: "Region",           value: lead.region,           icon: "🌐" },
//                       { label: "Vertical",         value: lead.vertical,         icon: "📂" },
//                       { label: "Remarks",          value: lead.remarks,          icon: "📝" },
//                       { label: "Total Amount",     value: lead.total_amount != null ? `₹${lead.total_amount.toLocaleString()}` : null, icon: "💵" },
//                     ].map(({ label, value, icon }) => (
//                       <div key={label} className={styles.detailItem}>
//                         <span className={styles.detailLabel}>
//                           <span className={styles.detailIcon}>{icon}</span>
//                           {label}
//                         </span>
//                         <span className={styles.detailValue}>{value || "—"}</span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         ))}

//         {/* Infinite scroll sentinel */}
//         <div ref={sentinelRef} className={styles.sentinel} />

//         {/* Load more fallback */}
//         {!loading && visibleCount < filteredData.length && (
//           <div className={styles.loadMoreWrap}>
//             <button
//               className={styles.loadMoreBtn}
//               onClick={() => setVisibleCount((c) => c + 15)}
//             >
//               Load more · {filteredData.length - visibleCount} remaining
//             </button>
//           </div>
//         )}

//       </div>
//     </div>
//   );
// };

// export default LeadWorkspaceList;

// import React, { useEffect, useState, useRef, useCallback } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import type { RootState } from "../../app/store";
// import { IoIosArrowDropdown } from "react-icons/io";
// import { FaRegEdit } from "react-icons/fa";
// import { MdOutlineSearch } from "react-icons/md";
// import { useNavigate } from "react-router-dom";
// import { fetchLeadWorkspaceList } from "./Slice/LeadWorkspaceList";
// import styles from "./LeadWorkspaceList.module.css";

// const STATUS_FILTERS = ["All", "Won Lead", "Lost Lead", "new_lead", "follow_up", "cold_call"];
// const RANK_FILTERS   = ["All", "Rank A", "Rank B", "Rank C", "Rank D", "Rank E"];

// // ── Time Period Options ──────────────────────────────────────
// const TIME_PERIODS = [
//   { label: "All Time",      value: "all" },
//   { label: "Last 7 Days",   value: "7days" },
//   { label: "Last 15 Days",  value: "15days" },
//   { label: "This Month",    value: "this_month" },
//   { label: "Last 3 Months", value: "3months" },
//   { label: "Q1 (Apr–Jun)",  value: "q1" },
//   { label: "Q2 (Jul–Sep)",  value: "q2" },
//   { label: "Q3 (Oct–Dec)",  value: "q3" },
//   { label: "Q4 (Jan–Mar)",  value: "q4" },
//   { label: "This FY",       value: "this_fy" },
// ];

// // ── Date Filter Helper (Indian FY: April to March) ───────────
// const isInTimePeriod = (dateString: string, period: string): boolean => {
//   if (!dateString || period === "all") return true;

//   const today     = new Date();
//   const checkDate = new Date(dateString);
//   today.setHours(0, 0, 0, 0);
//   checkDate.setHours(0, 0, 0, 0);

//   const diffDays     = Math.floor((today.getTime() - checkDate.getTime()) / (1000 * 60 * 60 * 24));
//   const currentMonth = today.getMonth();
//   const currentYear  = today.getFullYear();
//   const fyYear       = currentMonth >= 3 ? currentYear : currentYear - 1;

//   switch (period) {
//     case "this_fy":    return checkDate >= new Date(fyYear, 3, 1) && checkDate <= new Date(fyYear + 1, 2, 31);
//     case "7days":      return diffDays >= 0 && diffDays <= 7;
//     case "15days":     return diffDays >= 0 && diffDays <= 15;
//     case "this_month": return checkDate.getMonth() === today.getMonth() && checkDate.getFullYear() === today.getFullYear();
//     case "3months": {
//       const threeMonthsAgo = new Date(today);
//       threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
//       return checkDate >= threeMonthsAgo && checkDate <= today;
//     }
//     case "q1": return checkDate >= new Date(fyYear, 3, 1)     && checkDate <= new Date(fyYear, 5, 30);
//     case "q2": return checkDate >= new Date(fyYear, 6, 1)     && checkDate <= new Date(fyYear, 8, 30);
//     case "q3": return checkDate >= new Date(fyYear, 9, 1)     && checkDate <= new Date(fyYear, 11, 31);
//     case "q4": return checkDate >= new Date(fyYear + 1, 0, 1) && checkDate <= new Date(fyYear + 1, 2, 31);
//     default:   return true;
//   }
// };

// /* ── Status badge colors ── */
// const statusColor: Record<string, string> = {
//   follow_up:        "#B7A112",
//   marketing_review: "#6D940B",
//   new_lead:         "#462A8C",
//   oppurtunity:      "#2bc24c",
//   Progress:         "#9A0D76",
//   Negotiation:      "#0933A6",
//   won:              "#61f107",
//   "Won Lead":       "#61f107",
//   lost:             "#ca1717",
//   "Lost Lead":      "#ca1717",
//   cold_call:        "#0f7ce9",
// };

// const LeadWorkspaceList: React.FC = () => {
//   const dispatch = useDispatch<any>();
//   const navigate = useNavigate();

//   const [searchQuery,         setSearchQuery]         = useState("");
//   const [activeFilter,        setActiveFilter]        = useState("All");
//   const [activeRank,          setActiveRank]          = useState("All");
//   const [selectedTimePeriod,  setSelectedTimePeriod]  = useState("all");
//   const [expandedRows,        setExpandedRows]        = useState<Set<string>>(new Set());
//   const [visibleCount,        setVisibleCount]        = useState(15);

//   const { data, loading, error } = useSelector(
//     (state: RootState) => state.fetchLeadWorkspaceListData
//   );

//   useEffect(() => {
//     dispatch(fetchLeadWorkspaceList() as any);
//   }, [dispatch]);

//   // ── Safe data check ──
//   const safeData = Array.isArray(data) ? data : [];

//   /* ── Filtering Logic ── */
//   const filteredData = [...safeData]
//     .reverse()
//     .filter((lead: any) => {
//       const matchesStatus = activeFilter === "All" || lead.status === activeFilter;
//       const matchesRank = activeRank === "All" || 
//         (lead.lead_stages && lead.lead_stages.some((s: any) => s.ranks === activeRank));
//       const matchesSearch = [lead.lead, lead.assign_to, lead.account_name].some((f) =>
//         f?.toLowerCase().includes(searchQuery.toLowerCase())
//       );
//       const matchesTime = isInTimePeriod(lead.acct_created_date, selectedTimePeriod);
//       return matchesStatus && matchesRank && matchesSearch && matchesTime;
//     });

//   /* ── Infinite scroll ── */
//   const sentinelRef    = useRef<HTMLDivElement>(null);
//   const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
//     if (entries[0].isIntersecting && visibleCount < filteredData.length) {
//       setVisibleCount(c => c + 15);
//     }
//   }, [visibleCount, filteredData.length]);

//   useEffect(() => {
//     const observer = new IntersectionObserver(handleObserver, { threshold: 0.1 });
//     if (sentinelRef.current) observer.observe(sentinelRef.current);
//     return () => observer.disconnect();
//   }, [handleObserver]);

//   const visibleData = filteredData.slice(0, visibleCount);

//   const toggleRow = (id: string) =>
//     setExpandedRows((prev) => {
//       const next = new Set(prev);
//       next.has(id) ? next.delete(id) : next.add(id);
//       return next;
//     });

//   const handleEdit = (id: string) => navigate(`/user/EditUserLeadWorkspace/${id}`);

//   /* ── KPI calculations ── */
//   const totalLeads  = safeData.length;
//   const wonLeads    = safeData.filter((l: any) => l.status === "Won Lead" || l.status === "won").length;
//   const lostLeads   = safeData.filter((l: any) => l.status === "Lost Lead" || l.status === "lost").length;

//   return (
//     <div className={styles.page}>

//       {/* ── Page header ── */}
//       <div className={styles.pageHeader}>
//         <div>
//           <h1 className={styles.pageTitle}>Lead Workspace</h1>
//           <p className={styles.pageSubtitle}>Manage and track all lead records</p>
//         </div>

//         <div className={styles.headerRight}>
//           <div className={styles.filtersWrapper}>
//             {/* Status Filter */}
//             <div className={styles.dropdownFilter}>
//               <select
//                 className={styles.selectInput}
//                 value={activeFilter}
//                 onChange={(e) => { setActiveFilter(e.target.value); setVisibleCount(15); }}
//               >
//                 {STATUS_FILTERS.map((f) => (
//                   <option key={f} value={f}>{f === "All" ? "All Status" : f.replace(/_/g, ' ')}</option>
//                 ))}
//               </select>
//               <span className={styles.dropdownIcon}>
//                 <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
//               </span>
//             </div>

//             {/* Ranks Filter */}
//             <div className={styles.dropdownFilter}>
//               <select className={styles.selectInput} value={activeRank} onChange={(e) => { setActiveRank(e.target.value); setVisibleCount(15); }}>
//                 {RANK_FILTERS.map(r => (
//                   <option key={r} value={r}>{r === "All" ? "All Ranks" : r}</option>
//                 ))}
//               </select>
//               <span className={styles.dropdownIcon}>
//                 <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
//               </span>
//             </div>

//             {/* Time Period Filter */}
//             <div className={styles.dropdownFilter}>
//               <select className={styles.selectInput} value={selectedTimePeriod} onChange={(e) => { setSelectedTimePeriod(e.target.value); setVisibleCount(15); }}>
//                 {TIME_PERIODS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
//               </select>
//               <span className={styles.dropdownIcon}>
//                 <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
//               </span>
//             </div>
//           </div>

//           <div className={styles.searchBar}>
//             <MdOutlineSearch className={styles.searchIcon} />
//             <input className={styles.searchInput} placeholder="Search by account or holder..." value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setVisibleCount(15); }} />
//             {searchQuery && <button className={styles.clearBtn} onClick={() => { setSearchQuery(""); setVisibleCount(15); }}>✕</button>}
//           </div>

//           <button className={styles.primaryActionBtn} onClick={() => navigate("/user/UserLeadDashboard")}>Lead Dashboard</button>
//         </div>
//       </div>

//       {/* ── KPI strip ── */}
//       <div className={styles.kpiRow}>
//         <div className={`${styles.kpiCard} ${styles.kpiIndigo}`}><div className={styles.kpiContent}><div className={styles.kpiValue}>{totalLeads}</div><div className={styles.kpiLabel}>Total Leads</div></div><div className={styles.kpiBgNumber}>{totalLeads}</div></div>
//         <div className={`${styles.kpiCard} ${styles.kpiEmerald}`}><div className={styles.kpiContent}><div className={styles.kpiValue}>{wonLeads}</div><div className={styles.kpiLabel}>Won Leads</div></div><div className={styles.kpiBgNumber}>{wonLeads}</div></div>
//         <div className={`${styles.kpiCard} ${styles.kpiRose}`}><div className={styles.kpiContent}><div className={styles.kpiValue}>{lostLeads}</div><div className={styles.kpiLabel}>Lost Leads</div></div><div className={styles.kpiBgNumber}>{lostLeads}</div></div>
//         <div className={`${styles.kpiCard} ${styles.kpiAmber}`}><div className={styles.kpiContent}><div className={styles.kpiValue}>{filteredData.length}</div><div className={styles.kpiLabel}>Filtered Results</div></div><div className={styles.kpiBgNumber}>{filteredData.length}</div></div>
//       </div>

//       {/* ── Table ── */}
//       <div className={styles.tableCard}>
//         <div className={styles.tableTopBar}>
//           <div className={styles.tableTopLeft}><div className={styles.tableDot} /><span className={styles.tableTopTitle}>All Leads</span><span className={styles.tableTopCount}>{filteredData.length} records</span></div>
//         </div>

//         <div className={styles.tableHeader}>
//           <div className={styles.thCell} /><div className={styles.thCell}>Account Name</div><div className={styles.thCell}>Lead</div><div className={styles.thCell}>PIC</div><div className={styles.thCell}>Assign By</div><div className={styles.thCell}>Date</div><div className={styles.thCell}>Status</div><div className={styles.thCell} />
//         </div>

//         {visibleData.map((lead: any, idx: number) => (
//           <div key={lead.id} className={styles.rowGroup}>
//             <div className={`${styles.tableRow} ${expandedRows.has(lead.id) ? styles.rowExpanded : ""}`}>
//               <button className={styles.chevronBtn} onClick={() => toggleRow(lead.id)}>
//                 <IoIosArrowDropdown size={20} className={`${styles.chevron} ${expandedRows.has(lead.id) ? styles.chevronOpen : ""}`} />
//               </button>
//               <div className={styles.tdCell}><span className={styles.accountName}>{lead.account_name || "—"}</span></div>
//               <div className={styles.tdCell}><span className={styles.leadName}>{lead.lead || "—"}</span></div>
//               <div className={styles.tdCell}><span className={styles.picBadge}>{lead.pic || "—"}</span></div>
//               <div className={styles.tdCell}><span className={styles.holderBadge}>{lead.user || "—"}</span></div>
//               <div className={styles.tdCell}><span className={styles.dateCell}>{lead.acct_created_date || "—"}</span></div>
//               <div className={styles.tdCell}>
//                 {lead.status ? (
//                   <span className={styles.statusBadge} style={{ background: statusColor[lead.status] ?? "#94A3B8" }}>{lead.status.replace(/_/g, " ")}</span>
//                 ) : <span className={styles.empty}>—</span>}
//               </div>
//               <button className={styles.editBtn} onClick={() => handleEdit(lead.id)}><FaRegEdit size={14} /></button>
//             </div>

//             {expandedRows.has(lead.id) && (
//               <div className={styles.detailPanel}>
//                 <div className={styles.detailPanelInner}>
//                   <div className={styles.detailHeader}>
//                     <div className={styles.detailTitleWrap}>
//                       <div className={styles.detailAvatar}>{(lead.account_name || "L")[0].toUpperCase()}</div>
//                       <div><div className={styles.detailTitle}>{lead.account_name}</div><div className={styles.detailTitleSub}>Lead Details</div></div>
//                     </div>
//                   </div>
//                   <div className={styles.detailGrid}>
//                     {[
//                       { label: "Business Type",    value: lead.business_type,    icon: "💼" },
//                       { label: "Make",             value: lead.make,             icon: "🏭" },
//                       { label: "Sub Make",         value: lead.sub_make,         icon: "🔩" },
//                       { label: "Sub Make Brand",   value: lead.sub_make_brand,   icon: "🏷️" },
//                       { label: "Designation",      value: lead.designation,      icon: "👤" },
//                       { label: "Department",       value: lead.department,       icon: "🏢" },
//                       { label: "Mobile",           value: lead.mobile_number,    icon: "📱" },
//                       { label: "Location",         value: lead.location,         icon: "📍" },
//                       { label: "State",            value: lead.state,            icon: "🗺️" },
//                       { label: "City",             value: lead.city,             icon: "🏙️" },
//                       { label: "Qty",              value: lead.qty,              icon: "📦" },
//                       { label: "Value",            value: lead.values != null ? `₹${lead.values.toLocaleString()}` : null, icon: "💰" },
//                       { label: "Expected Closure", value: lead.exp_closure_date, icon: "📅" },
//                       { label: "Expected PO Date", value: lead.exp_po_date,      icon: "🗓️" },
//                       { label: "Region",           value: lead.region,           icon: "🌐" },
//                       { label: "Vertical",         value: lead.vertical,         icon: "📂" },
//                       { label: "Remarks",          value: lead.remarks,          icon: "📝" },
//                       { label: "Total Amount",     value: lead.total_amount != null ? `₹${lead.total_amount.toLocaleString()}` : null, icon: "💵" },
//                     ].map(({ label, value, icon }) => (
//                       <div key={label} className={styles.detailItem}>
//                         <span className={styles.detailLabel}><span className={styles.detailIcon}>{icon}</span>{label}</span>
//                         <span className={styles.detailValue}>{value || "—"}</span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         ))}
//         <div ref={sentinelRef} className={styles.sentinel} />
//       </div>
//     </div>
//   );
// };

// export default LeadWorkspaceList;



import React, { useEffect, useState, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import { IoIosArrowDropdown } from "react-icons/io";
import { FaRegEdit } from "react-icons/fa";
import { MdOutlineSearch } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { fetchLeadWorkspaceList } from "./Slice/LeadWorkspaceList";

const STATUS_FILTERS = ["All", "Won Lead", "Lost Lead", "new_lead", "follow_up", "cold_call"];
const RANK_FILTERS   = ["All", "Rank A", "Rank B", "Rank C", "Rank D", "Rank E"];

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
    case "this_fy":    return checkDate >= new Date(fyYear, 3, 1) && checkDate <= new Date(fyYear + 1, 2, 31);
    case "7days":      return diffDays >= 0 && diffDays <= 7;
    case "15days":     return diffDays >= 0 && diffDays <= 15;
    case "this_month": return checkDate.getMonth() === today.getMonth() && checkDate.getFullYear() === today.getFullYear();
    case "3months": {
      const threeMonthsAgo = new Date(today);
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
      return checkDate >= threeMonthsAgo && checkDate <= today;
    }
    case "q1": return checkDate >= new Date(fyYear, 3, 1)     && checkDate <= new Date(fyYear, 5, 30);
    case "q2": return checkDate >= new Date(fyYear, 6, 1)     && checkDate <= new Date(fyYear, 8, 30);
    case "q3": return checkDate >= new Date(fyYear, 9, 1)     && checkDate <= new Date(fyYear, 11, 31);
    case "q4": return checkDate >= new Date(fyYear + 1, 0, 1) && checkDate <= new Date(fyYear + 1, 2, 31);
    default:   return true;
  }
};

/* ── Status badge colors ── */
const statusColor: Record<string, string> = {
  follow_up:        "#B7A112",
  marketing_review: "#6D940B",
  new_lead:         "#462A8C",
  oppurtunity:      "#2bc24c",
  Progress:         "#9A0D76",
  Negotiation:      "#0933A6",
  won:              "#16a34a",
  "Won Lead":       "#16a34a",
  lost:             "#ca1717",
  "Lost Lead":      "#ca1717",
  cold_call:        "#0f7ce9",
};

/* ── Shared select class ── */
const filterSelectClass =
  "h-10 px-4 pr-9 bg-white border-2 border-slate-200 rounded-xl text-sm font-semibold text-slate-600 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 transition-all cursor-pointer shadow-sm appearance-none";

const GRID_COLS          = "40px 1.8fr 1.2fr 0.9fr 1fr 1fr 1.1fr 48px";
const GRID_COLS_SKELETON = "40px 1.8fr 1.2fr 0.9fr 1fr 1fr 1.1fr 48px";

const LeadWorkspaceList: React.FC = () => {
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();

  const [searchQuery,        setSearchQuery]        = useState("");
  const [activeFilter,       setActiveFilter]       = useState("All");
  const [activeRank,         setActiveRank]         = useState("All");
  const [selectedTimePeriod, setSelectedTimePeriod] = useState("all");
  const [expandedRows,       setExpandedRows]       = useState<Set<string>>(new Set());
  const [visibleCount,       setVisibleCount]       = useState(15);

  const { data, loading, error } = useSelector(
    (state: RootState) => state.fetchLeadWorkspaceListData
  );

  useEffect(() => {
    dispatch(fetchLeadWorkspaceList() as any);
  }, [dispatch]);

  const safeData = Array.isArray(data) ? data : [];

  /* ── Filtering Logic ── */
  const filteredData = [...safeData]
    .reverse()
    .filter((lead: any) => {
      const matchesStatus = activeFilter === "All" || lead.status === activeFilter;
      const matchesRank   = activeRank === "All" ||
        (lead.lead_stages && lead.lead_stages.some((s: any) => s.ranks === activeRank));
      const matchesSearch = [lead.lead, lead.assign_to, lead.account_name].some((f) =>
        f?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      const matchesTime = isInTimePeriod(lead.acct_created_date, selectedTimePeriod);
      return matchesStatus && matchesRank && matchesSearch && matchesTime;
    });

  /* ── Infinite scroll ── */
  const sentinelRef    = useRef<HTMLDivElement>(null);
  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    if (entries[0].isIntersecting && visibleCount < filteredData.length)
      setVisibleCount(c => c + 15);
  }, [visibleCount, filteredData.length]);

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, { threshold: 0.1 });
    if (sentinelRef.current) observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [handleObserver]);

  const visibleData = filteredData.slice(0, visibleCount);

  const toggleRow = (id: string) =>
    setExpandedRows((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const handleEdit = (id: string) => navigate(`/user/EditUserLeadWorkspace/${id}`);

  /* ── KPI calculations ── */
  const totalLeads = safeData.length;
  const wonLeads   = safeData.filter((l: any) => l.status === "Won Lead" || l.status === "won").length;
  const lostLeads  = safeData.filter((l: any) => l.status === "Lost Lead" || l.status === "lost").length;

  const kpiCards = [
    { label: "Total Leads",      value: totalLeads,           gradient: "from-indigo-600 to-indigo-500" },
    { label: "Won Leads",        value: wonLeads,             gradient: "from-emerald-600 to-emerald-400" },
    { label: "Lost Leads",       value: lostLeads,            gradient: "from-rose-600 to-rose-400" },
    { label: "Filtered Results", value: filteredData.length,  gradient: "from-amber-500 to-yellow-400" },
  ];

  return (
    <div className="w-full min-h-full bg-slate-100 p-7 pb-28 flex flex-col gap-6 overflow-y-auto overflow-x-hidden">

      {/* ── Page Header ── */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-[22px] font-bold text-violet-700 m-0 tracking-tight leading-tight">
            Lead Workspace
          </h1>
          <p className="text-[13px] text-violet-400 mt-1 m-0 font-normal">
            Manage and track all lead records
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Status Filter */}
          <select
            className={filterSelectClass}
            value={activeFilter}
            onChange={(e) => { setActiveFilter(e.target.value); setVisibleCount(15); }}
          >
            {STATUS_FILTERS.map((f) => (
              <option key={f} value={f}>{f === "All" ? "All Status" : f.replace(/_/g, " ")}</option>
            ))}
          </select>

          {/* Rank Filter */}
          <select
            className={filterSelectClass}
            value={activeRank}
            onChange={(e) => { setActiveRank(e.target.value); setVisibleCount(15); }}
          >
            {RANK_FILTERS.map(r => (
              <option key={r} value={r}>{r === "All" ? "All Ranks" : r}</option>
            ))}
          </select>

          {/* Time Period Filter */}
          <select
            className={filterSelectClass}
            value={selectedTimePeriod}
            onChange={(e) => { setSelectedTimePeriod(e.target.value); setVisibleCount(15); }}
          >
            {TIME_PERIODS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>

          {/* Search */}
          <div className="flex items-center gap-2 bg-white border-2 border-slate-200 rounded-xl px-4 h-10 w-64 shadow-sm focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-400/20 transition-all">
            <MdOutlineSearch className="text-slate-400 text-lg shrink-0" />
            <input
              className="border-none outline-none bg-transparent text-sm text-slate-800 w-full placeholder:text-slate-300"
              placeholder="Search account or holder..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setVisibleCount(15); }}
            />
            {searchQuery && (
              <button
                className="text-slate-400 hover:text-indigo-500 text-xs shrink-0 transition-colors"
                onClick={() => { setSearchQuery(""); setVisibleCount(15); }}
              >✕</button>
            )}
          </div>

          {/* Lead Dashboard Button */}
          <button
            className="h-10 px-5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-md hover:-translate-y-0.5 hover:shadow-lg transition-all whitespace-nowrap"
            onClick={() => navigate("/user/UserLeadDashboard")}
          >
            Lead Dashboard
          </button>
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map(({ label, value, gradient }) => (
          <div
            key={label}
            className={`bg-gradient-to-br ${gradient} rounded-2xl p-5 flex items-center gap-4 shadow-lg hover:-translate-y-1 hover:shadow-xl transition-all duration-200 cursor-default overflow-hidden relative`}
          >
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
        <div className="flex items-center gap-2 px-5 pt-4 pb-2">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-[0_0_0_3px_rgba(99,102,241,0.2)] animate-pulse" />
          <span className="text-sm font-bold text-slate-800">All Leads</span>
          <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
            {filteredData.length} records
          </span>
        </div>

        {/* Table Header */}
        <div
          className="grid gap-3 px-4 py-3 mx-3 mb-1 rounded-xl bg-gradient-to-r from-indigo-700 to-blue-600 text-[10.5px] font-bold uppercase tracking-widest text-white/90"
          style={{ gridTemplateColumns: GRID_COLS }}
        >
          <span></span>
          <span>Account Name</span>
          <span>Lead</span>
          <span>PIC</span>
          <span>Assign By</span>
          <span>Date</span>
          <span>Status</span>
          <span></span>
        </div>

        {/* Loading skeleton */}
        {loading && (
          <div className="p-5">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="grid gap-3 px-4 py-4 border-b border-slate-100 items-center animate-pulse"
                style={{ gridTemplateColumns: GRID_COLS_SKELETON }}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((j) => (
                  <div key={j} className="h-3.5 bg-slate-200 rounded-md" />
                ))}
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="flex flex-col items-center gap-3 py-14 text-center">
            <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8"  x2="12"    y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <p className="text-sm font-bold text-slate-600 m-0">Failed to load data</p>
            <p className="text-xs text-slate-400 m-0">{error}</p>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && filteredData.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-14 text-center">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center">
              <svg width="28" height="28" viewBox="0 0 48 48" fill="none">
                <rect x="8" y="12" width="32" height="28" rx="3" stroke="#94A3B8" strokeWidth="2.5"/>
                <path d="M16 12V10a2 2 0 012-2h12a2 2 0 012 2v2" stroke="#94A3B8" strokeWidth="2.5"/>
                <path d="M17 22h14M17 28h10" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
            </div>
            <p className="text-sm font-bold text-slate-600 m-0">No leads found</p>
            <p className="text-xs text-slate-400 m-0">Try adjusting your search or filters.</p>
          </div>
        )}

        {/* Data Rows */}
        {!loading && !error && visibleData.map((lead: any) => (
          <div
            key={lead.id}
            className="border-b border-slate-100 last:border-none"
            style={{ borderLeft: expandedRows.has(lead.id) ? '4px solid #6366f1' : '4px solid transparent' }}
          >
            {/* Main Row */}
            <div
              className={`grid gap-3 px-4 items-center h-14 transition-all duration-150 cursor-default ${expandedRows.has(lead.id) ? 'bg-indigo-50/60' : 'bg-white hover:bg-slate-50'}`}
              style={{ gridTemplateColumns: GRID_COLS }}
            >
              <button
                className="flex items-center justify-center w-7 h-7 rounded-lg hover:bg-indigo-100 transition-colors"
                onClick={() => toggleRow(lead.id)}
              >
                <IoIosArrowDropdown
                  size={20}
                  className={`transition-all duration-200 ${expandedRows.has(lead.id) ? 'rotate-180 text-indigo-500' : 'text-slate-400'}`}
                />
              </button>

              <div className="text-sm font-bold text-slate-900 truncate">{lead.account_name || "—"}</div>

              <div className="text-sm text-slate-600 font-medium truncate">{lead.lead || "—"}</div>

              <div>
                <span className="inline-flex items-center px-2.5 py-0.5 bg-gradient-to-r from-indigo-50 to-violet-50 text-indigo-600 rounded-full text-[11px] font-bold border border-indigo-200 whitespace-nowrap max-w-full overflow-hidden text-ellipsis">
                  {lead.pic || "—"}
                </span>
              </div>

              <div>
                <span className="inline-flex items-center px-2.5 py-0.5 bg-gradient-to-r from-orange-50 to-amber-50 text-orange-600 rounded-full text-[11px] font-bold border border-orange-200 whitespace-nowrap">
                  {lead.user || "—"}
                </span>
              </div>

              <div>
                <span className="font-mono text-[11.5px] text-slate-500 bg-slate-50 px-2 py-0.5 rounded">
                  {lead.acct_created_date || "—"}
                </span>
              </div>

              <div>
                {lead.status ? (
                  <span
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold text-white whitespace-nowrap capitalize shadow-sm"
                    style={{ background: statusColor[lead.status] ?? "#94A3B8" }}
                  >
                    {lead.status.replace(/_/g, " ")}
                  </span>
                ) : <span className="text-slate-300 text-sm">—</span>}
              </div>

              <button
                className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:bg-amber-50 hover:text-amber-600 hover:scale-110 transition-all"
                onClick={() => handleEdit(lead.id)}
              >
                <FaRegEdit size={14} />
              </button>
            </div>

            {/* Expanded Detail Panel */}
            {expandedRows.has(lead.id) && (
              <div className="bg-gradient-to-br from-slate-50 to-indigo-50/40 border-t border-slate-200 w-full">
                <div className="px-14 py-5 pb-8">
                  {/* Mini header */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 text-white text-base font-extrabold flex items-center justify-center shadow-md shrink-0">
                      {(lead.account_name || "L")[0].toUpperCase()}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-800 leading-tight">{lead.account_name}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">Lead Details</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {[
                      { label: "Business Type",    value: lead.business_type,    icon: "💼" },
                      { label: "Make",             value: lead.make,             icon: "🏭" },
                      { label: "Sub Make",         value: lead.sub_make,         icon: "🔩" },
                      { label: "Sub Make Brand",   value: lead.sub_make_brand,   icon: "🏷️" },
                      { label: "Designation",      value: lead.designation,      icon: "👤" },
                      { label: "Department",       value: lead.department,       icon: "🏢" },
                      { label: "Mobile",           value: lead.mobile_number,    icon: "📱" },
                      { label: "Location",         value: lead.location,         icon: "📍" },
                      { label: "State",            value: lead.state,            icon: "🗺️" },
                      { label: "City",             value: lead.city,             icon: "🏙️" },
                      { label: "Qty",              value: lead.qty,              icon: "📦" },
                      { label: "Value",            value: lead.values != null ? `₹${lead.values.toLocaleString()}` : null, icon: "💰" },
                      { label: "Expected Closure", value: lead.exp_closure_date, icon: "📅" },
                      { label: "Expected PO Date", value: lead.exp_po_date,      icon: "🗓️" },
                      { label: "Region",           value: lead.region,           icon: "🌐" },
                      { label: "Vertical",         value: lead.vertical,         icon: "📂" },
                      { label: "Remarks",          value: lead.remarks,          icon: "📝" },
                      { label: "Total Amount",     value: lead.total_amount != null ? `₹${lead.total_amount.toLocaleString()}` : null, icon: "💵" },
                    ].map(({ label, value, icon }) => (
                      <div
                        key={label}
                        className="flex flex-col gap-1 bg-white/70 border border-slate-200 rounded-xl px-3 py-2.5 hover:bg-white hover:shadow-sm transition-all"
                      >
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1">
                          <span className="text-[11px]">{icon}</span>
                          {label}
                        </span>
                        <span className="text-sm font-semibold text-slate-700 truncate">{value || "—"}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Sentinel — infinite scroll trigger */}
        <div ref={sentinelRef} className="h-px w-full" />
      </div>
    </div>
  );
};

export default LeadWorkspaceList;