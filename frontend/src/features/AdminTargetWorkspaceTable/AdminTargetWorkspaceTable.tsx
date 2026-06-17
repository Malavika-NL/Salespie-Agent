// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import type { RootState, AppDispatch } from "../../app/store";
// import { IoIosArrowDropdown } from "react-icons/io";
// import { FaRegEdit } from "react-icons/fa";
// import styles from "./AdminTargetWorkspaceTable.module.css";
// import { useNavigate } from "react-router-dom";
// import { clearResponse, deleteAdminTargetWorkspaceTableData, fetchAdminTargetWorkspaceFormData } from "./Slice/AdminTargetWorkspaceTableSlice";
// import { MdOutlineSearch } from "react-icons/md";
// import { MdOutlineDelete } from "react-icons/md";


// const AdminTargetWorkspaceTable: React.FC = () => {
//     const dispatch = useDispatch<AppDispatch>();
//     const navigate = useNavigate();

//     // State variables
   
//     const [searchQuery, setSearchQuery] = useState("");
//     const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

//     const { data, loading, error } = useSelector((state: RootState) => state.fetchAdminTargetWorkspaceFormData);
//     const { response } = useSelector((state: RootState) => state.deleteAdminTargetWorkspaceData);
//     console.log('admin account data', data)
//     useEffect(() => {
//         const fetchData = async () => {
//             const response = await dispatch(fetchAdminTargetWorkspaceFormData() as any);
//             console.log(response);
//         };
//         fetchData();
//     }, [dispatch,response]);


//  useEffect(() => {
//         if (response?.message === "Deleted successfully") {
//             alert("Target Deleted successfully");
//             dispatch(clearResponse())

//         } else if (response?.message && response.message !== "Deleted successfully") {
//             alert("Submission failed");
//             dispatch(clearResponse())
//         }
//     }, [data, navigate, dispatch, response]);

//     const reversedData = [...data].reverse();
//     const filteredData = reversedData.filter((row) =>
//         row.account_name.toLowerCase().includes(searchQuery.toLowerCase() ) || row.user.toLowerCase().includes(searchQuery.toLowerCase() )
//     );
//     // Handlers
//     const handleEditClick = (id: string) => navigate(`/EditAdminTargetWorkspace/${id}`);
//     const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value);
//     const toggleRowDetails = (id: string) => {
//         setExpandedRows((prev) => {
//             const newExpandedRows = new Set(prev);
//             newExpandedRows.has(id) ? newExpandedRows.delete(id) : newExpandedRows.add(id);
//             return newExpandedRows;
//         });
//     };

//      const handleDeleteClick = (id: string) => {
//             const isConfirmed = window.confirm("Are you sure you want to delete this account?");
    
//             if (isConfirmed) {
//                 dispatch(deleteAdminTargetWorkspaceTableData(id));
//             }
//         };

//     return (
//         <div className={styles.mainContent}>
//               <div className={styles.heading}>Target Workspace Table</div>
//             <div className={styles.rightContainer}>
              
//             <div className={styles.searchBar}>
//                     <MdOutlineSearch className={styles.searchicon} />
//                     <input
//                         type="text"
//                         placeholder="Search..."
//                         value={searchQuery}
//                         onChange={handleSearchChange}
//                         className={styles.search}
//                     />
//                 </div>
                
//             </div>

//             {/* Table */}
//             <div className={styles.tableContainer}>
//             <div className={styles.tableHeader}>
//                     <div className={styles.tableColumn} style={{ width: "20px" }}></div>
//                     <div className={styles.tableColumn}>Account Name</div>
//                     <div className={styles.tableColumn}>PIC</div>
//                     <div className={styles.tableColumn}>Vertical</div>
//                     <div className={styles.tableColumn}>Mobile No</div>
//                     <div className={styles.tableColumn}>Account Created</div>
//                     <div className={styles.tableColumn}>Email</div>
//                     <div className={styles.tableColumn}>Account Holder</div>
//                     <div className={styles.tableColumn} style={{ width: "20px" }}></div>
//                     <div className={styles.tableColumn} style={{ width: "20px" }}></div>
//                 </div>
//                 <div className={styles.tableBody}>
//                     {filteredData.map((row: any) => (
//                         <div key={row.id}>
//                             <div className={styles.tableRow}>
//                                 <div className={styles.iconContainer}>
//                                     <IoIosArrowDropdown
//                                         color="black"
//                                         size={24}
//                                         style={{
//                                             cursor: "pointer",
//                                             transform: expandedRows.has(row.id) ? "rotate(180deg)" : "rotate(0deg)",
//                                         }}
//                                         onClick={() => toggleRowDetails(row.id)}
//                                     />
//                                 </div>
//                                 <div className={styles.tableData}>{row.account_name}</div>
//                                 <div className={styles.tableData}>{row.pic}</div>
//                                 <div className={styles.tableData}>{row.vertical}</div>
//                                 <div className={styles.tableData}>{row.mobile_number}</div>
//                                 <div className={styles.tableData}>{row.acct_created_date}</div>
//                                 <div className={styles.tableData}>{row.email_id}</div>
//                                 <div className={styles.tableData}>{row.user}</div>

//                                 <div className={styles.iconContainer} onClick={() => handleEditClick(row.id)}>
//                                     <FaRegEdit className={styles.editIcon} title="Edit" />
//                                 </div>
//                                 <div className={styles.iconContainer} onClick={() => handleDeleteClick(row.id)}>
//                                     <MdOutlineDelete className={styles.deleteIcon} title="Delete" />
//                                 </div>
//                             </div>
//                             {expandedRows.has(row.id) && (
//                                 <div className={styles.additionalDetails} style={{ paddingLeft: "6%" }}>
//                                     <p className={styles.subhead}>{row.account_name}</p>
//                                     <div className={styles.additionalContent}>
//                                         <div className={styles.detailBox}>
//                                             <div className={styles.texthead}>Designation</div>
//                                             <div className={styles.text}>{row.designation}</div>
//                                         </div>
//                                         <div className={styles.detailBox}>
//                                             <div className={styles.texthead}>Department</div>
//                                             <div className={styles.text}>{row.department}</div>
//                                         </div>
//                                         <div className={styles.detailBox}>
//                                             <div className={styles.texthead}>Vertical Sub</div>
//                                             <div className={styles.text}>{row.vertical_sub}</div>
//                                         </div>

//                                     </div>

//                                     <div className={styles.additionalContent}>
//                                         <div className={styles.detailBox}>
//                                             <div className={styles.texthead}>State</div>
//                                             <div className={styles.text}>{row.state}</div>
//                                         </div>
//                                         <div className={styles.detailBox}>
//                                             <div className={styles.texthead}>City</div>
//                                             <div className={styles.text}>{row.city}</div>
//                                         </div>
//                                         <div className={styles.detailBox}>
//                                             <div className={styles.texthead}>Business</div>
//                                             <div className={styles.text}>{row.business}</div>
//                                         </div>

//                                     </div>






//                                     <div className={styles.additionalContent}>

//                                         <div className={styles.detailBox}>
//                                             <div className={styles.texthead}>Region</div>
//                                             <div className={styles.text}>{row.region}</div>
//                                         </div>

//                                         <div className={styles.detailBox}>
//                                             <div className={styles.texthead}>Address</div>
//                                             <div className={styles.text}>{row.address}</div>
//                                         </div>

//                                         <div className={styles.detailBox}>
//                                             <div className={styles.texthead}>Activity</div>
//                                             <div className={styles.text}>{row.activity}</div>
//                                         </div>


//                                     </div>

//                                     <div className={styles.additionalContent}>

//                                         <div className={styles.detailBox}>
//                                             <div className={styles.texthead}>Activity Date</div>
//                                             <div className={styles.text}>{row.activity_date}</div>
//                                         </div>

//                                         <div className={styles.detailBox}>
//                                             <div className={styles.texthead}>Next Action</div>
//                                             <div className={styles.text}>{row.next_action}</div>
//                                         </div>

//                                         <div className={styles.detailBox}>
//                                             <div className={styles.texthead}>Next Action Date</div>
//                                             <div className={styles.text}>{row.next_action_date}</div>
//                                         </div>

//                                     </div>

//                                 </div>
//                             )}
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         </div>

//     );
// };

// export default AdminTargetWorkspaceTable;

// =============================================================================================================================
// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import type { RootState, AppDispatch } from "../../app/store";
// import { IoIosArrowDropdown } from "react-icons/io";
// import { FaRegEdit } from "react-icons/fa";
// import { MdOutlineSearch, MdOutlineDelete } from "react-icons/md";
// import { useNavigate } from "react-router-dom";
// import {
//   clearResponse,
//   deleteAdminTargetWorkspaceTableData,
//   fetchAdminTargetWorkspaceFormData,
// } from "./Slice/AdminTargetWorkspaceTableSlice";
// import styles from "./AdminTargetWorkspaceTable.module.css";

// const AdminTargetWorkspaceTable: React.FC = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const navigate = useNavigate();

//   const [searchQuery,  setSearchQuery]  = useState("");
//   const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
//   const [visibleCount, setVisibleCount] = useState(15);

//   const { data, loading, error } = useSelector(
//     (state: RootState) => state.fetchAdminTargetWorkspaceFormData
//   );
//   const { response } = useSelector(
//     (state: RootState) => state.deleteAdminTargetWorkspaceData
//   );

//   useEffect(() => {
//     dispatch(fetchAdminTargetWorkspaceFormData() as any);
//   }, [dispatch, response]);

//   useEffect(() => {
//     if (response?.message === "Deleted successfully") {
//       alert("Target deleted successfully");
//       dispatch(clearResponse());
//     } else if (response?.message && response.message !== "Deleted successfully") {
//       alert("Deletion failed");
//       dispatch(clearResponse());
//     }
//   }, [response, dispatch]);

//   const reversedData = [...(data || [])].reverse();
//   const filteredData = reversedData.filter(
//     (row: any) =>
//       row.account_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       row.user?.toLowerCase().includes(searchQuery.toLowerCase())
//   );
//   const visibleData = filteredData.slice(0, visibleCount);

//   // KPI Calculations
//   const totalTargets = data ? data.length : 0;
//   const thisMonth = new Date().getMonth();
//   const thisYear  = new Date().getFullYear();
//   const newThisMonth = data ? data.filter((r: any) => {
//     if (!r.acct_created_date) return false;
//     const d = new Date(r.acct_created_date);
//     return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
//   }).length : 0;
//   const uniqueHolders = data ? new Set(data.map((r: any) => r.user).filter(Boolean)).size : 0;
//   const uniqueVerticals = data ? new Set(data.map((r: any) => r.vertical).filter(Boolean)).size : 0;

//   const toggleRow = (id: string) =>
//     setExpandedRows((prev) => {
//       const next = new Set(prev);
//       next.has(id) ? next.delete(id) : next.add(id);
//       return next;
//     });

//   const handleEditClick   = (id: string) => navigate(`/EditAdminTargetWorkspace/${id}`);
//   const handleDeleteClick = (id: string) => {
//     if (window.confirm("Are you sure you want to delete this target?")) {
//       dispatch(deleteAdminTargetWorkspaceTableData(id));
//     }
//   };

//   return (
//     <div className={styles.page}>

//       {/* ── Page header ── */}
//       <div className={styles.pageHeader}>
//         <div>
//           <h1 className={styles.pageTitle}>Target Workspace</h1>
//           <p className={styles.pageSubtitle}>Manage and view all target records</p>
//         </div>
//         <div className={styles.headerRight}>
//           <div className={styles.searchBar}>
//             <MdOutlineSearch className={styles.searchIcon} />
//             <input
//               className={styles.searchInput}
//               placeholder="Search by account or holder…"
//               value={searchQuery}
//               onChange={(e) => { setSearchQuery(e.target.value); setVisibleCount(15); }}
//             />
//             {searchQuery && (
//               <button className={styles.clearBtn} onClick={() => setSearchQuery("")}>✕</button>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* ── KPI strip ── */}
//       <div className={styles.kpiRow}>
//         <div className={`${styles.kpiCard} ${styles.kpiIndigo}`}>
//           <div className={styles.kpiIconWrap}>
//             <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//               <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
//             </svg>
//           </div>
//           <div className={styles.kpiContent}>
//             <div className={styles.kpiValue}>{totalTargets}</div>
//             <div className={styles.kpiLabel}>Total Targets</div>
//           </div>
//           <div className={styles.kpiBgNumber}>{totalTargets}</div>
//         </div>

//         <div className={`${styles.kpiCard} ${styles.kpiEmerald}`}>
//           <div className={styles.kpiIconWrap}>
//             <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//               <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
//             </svg>
//           </div>
//           <div className={styles.kpiContent}>
//             <div className={styles.kpiValue}>{newThisMonth}</div>
//             <div className={styles.kpiLabel}>Added This Month</div>
//           </div>
//           <div className={styles.kpiBgNumber}>{newThisMonth}</div>
//         </div>

//         <div className={`${styles.kpiCard} ${styles.kpiAmber}`}>
//           <div className={styles.kpiIconWrap}>
//             <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//               <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
//             </svg>
//           </div>
//           <div className={styles.kpiContent}>
//             <div className={styles.kpiValue}>{uniqueHolders}</div>
//             <div className={styles.kpiLabel}>Unique Holders</div>
//           </div>
//           <div className={styles.kpiBgNumber}>{uniqueHolders}</div>
//         </div>

//         <div className={`${styles.kpiCard} ${styles.kpiPurple}`}>
//           <div className={styles.kpiIconWrap}>
//             <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//               <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
//             </svg>
//           </div>
//           <div className={styles.kpiContent}>
//             <div className={styles.kpiValue}>{uniqueVerticals}</div>
//             <div className={styles.kpiLabel}>Active Verticals</div>
//           </div>
//           <div className={styles.kpiBgNumber}>{uniqueVerticals}</div>
//         </div>

//         <div className={`${styles.kpiCard} ${styles.kpiCyan}`}>
//           <div className={styles.kpiIconWrap}>
//             <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//               <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
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

//         {/* Table title bar */}
//         <div className={styles.tableTopBar}>
//           <div className={styles.tableTopLeft}>
//             <div className={styles.tableDot} />
//             <span className={styles.tableTopTitle}>All Targets</span>
//             <span className={styles.tableTopCount}>{filteredData.length} records</span>
//           </div>
//         </div>

//         {/* Header */}
//         <div className={styles.tableHeader}>
//           <div className={styles.thCell} />
//           <div className={styles.thCell}>Account Name</div>
//           <div className={styles.thCell}>PIC</div>
//           <div className={styles.thCell}>Vertical</div>
//           <div className={styles.thCell}>Mobile</div>
//           <div className={styles.thCell}>Created</div>
//           <div className={styles.thCell}>Email</div>
//           <div className={styles.thCell}>Holder</div>
//           <div className={styles.thCell} />
//           <div className={styles.thCell} />
//         </div>

//         {/* Loading skeleton */}
//         {loading && (
//           <div className={styles.stateBox}>
//             {[1, 2, 3, 4, 5].map((i) => (
//               <div key={i} className={styles.skeletonRow}>
//                 {[1, 2, 3, 4, 5, 6, 7, 8].map((j) => (
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
//               <div className={styles.emptyIconWrap} style={{ background: '#FEE2E2' }}>
//                 <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2.5">
//                   <circle cx="12" cy="12" r="10" />
//                   <line x1="12" y1="8"  x2="12"   y2="12" />
//                   <line x1="12" y1="16" x2="12.01" y2="16" />
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
//                 <svg width="28" height="28" viewBox="0 0 48 48" fill="none">
//                   <rect x="8" y="12" width="32" height="28" rx="3" stroke="#94A3B8" strokeWidth="2.5"/>
//                   <path d="M16 12V10a2 2 0 012-2h12a2 2 0 012 2v2" stroke="#94A3B8" strokeWidth="2.5"/>
//                   <path d="M17 22h14M17 28h10" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round"/>
//                 </svg>
//               </div>
//               <p className={styles.emptyTitle}>No targets found</p>
//               <p className={styles.emptyText}>Try adjusting your search query.</p>
//             </div>
//           </div>
//         )}

//         {/* Rows */}
//         {!loading && !error && visibleData.map((row: any, idx: number) => (
//           <div
//             key={row.id}
//             className={styles.rowGroup}
//             style={{ animationDelay: `${Math.min(idx, 10) * 35}ms` }}
//           >
//             {/* Main row */}
//             <div className={`${styles.tableRow} ${expandedRows.has(row.id) ? styles.rowExpanded : ""}`}>
//               <button
//                 className={styles.chevronBtn}
//                 onClick={() => toggleRow(row.id)}
//                 aria-label="Expand row"
//               >
//                 <IoIosArrowDropdown
//                   size={20}
//                   className={`${styles.chevron} ${expandedRows.has(row.id) ? styles.chevronOpen : ""}`}
//                 />
//               </button>

//               <div className={styles.tdCell}>
//                 <span className={styles.accountName}>{row.account_name || "—"}</span>
//               </div>
//               <div className={styles.tdCell}>
//                 <span className={styles.picBadge}>{row.pic || "—"}</span>
//               </div>
//               <div className={styles.tdCell}>
//                 {row.vertical
//                   ? <span className={styles.verticalTag}>{row.vertical}</span>
//                   : <span className={styles.empty}>—</span>}
//               </div>
//               <div className={styles.tdCell}>{row.mobile_number || "—"}</div>
//               <div className={styles.tdCell}>
//                 <span className={styles.dateCell}>{row.acct_created_date || "—"}</span>
//               </div>
//               <div className={styles.tdCell}>
//                 <span className={styles.emailCell}>{row.email_id || "—"}</span>
//               </div>
//               <div className={styles.tdCell}>
//                 <span className={styles.holderBadge}>{row.user || "—"}</span>
//               </div>

//               <button
//                 className={styles.editBtn}
//                 onClick={() => handleEditClick(row.id)}
//                 aria-label="Edit target"
//               >
//                 <FaRegEdit size={14} />
//               </button>
//               <button
//                 className={styles.deleteBtn}
//                 onClick={() => handleDeleteClick(row.id)}
//                 aria-label="Delete target"
//               >
//                 <MdOutlineDelete size={16} />
//               </button>
//             </div>

//             {/* Expanded detail panel */}
//             {expandedRows.has(row.id) && (
//               <div className={styles.detailPanel}>
//                 <div className={styles.detailPanelInner}>
//                   <div className={styles.detailHeader}>
//                     <div className={styles.detailTitleWrap}>
//                       <div className={styles.detailAvatar}>
//                         {(row.account_name || 'T')[0].toUpperCase()}
//                       </div>
//                       <div>
//                         <div className={styles.detailTitle}>{row.account_name}</div>
//                         <div className={styles.detailTitleSub}>Target Details</div>
//                       </div>
//                     </div>
//                     {row.vertical && (
//                       <span className={styles.detailVerticalBadge}>{row.vertical}</span>
//                     )}
//                   </div>
//                   <div className={styles.detailGrid}>
//                     {[
//                       { label: "Designation",      value: row.designation,      icon: "👔" },
//                       { label: "Department",       value: row.department,       icon: "🏢" },
//                       { label: "Vertical Sub",     value: row.vertical_sub,     icon: "📂" },
//                       { label: "State",            value: row.state,            icon: "🗺️" },
//                       { label: "City",             value: row.city,             icon: "🏙️" },
//                       { label: "Business",         value: row.business,         icon: "💼" },
//                       { label: "Region",           value: row.region,           icon: "🌍" },
//                       { label: "Address",          value: row.address,          icon: "📍" },
//                       { label: "Activity",         value: row.activity,         icon: "📋" },
//                       { label: "Activity Date",    value: row.activity_date,    icon: "📅" },
//                       { label: "Next Action",      value: row.next_action,      icon: "⏭️" },
//                       { label: "Next Action Date", value: row.next_action_date, icon: "🗓️" },
//                     ].map(({ label, value, icon }) => (
//                       <div key={label} className={styles.detailItem}>
//                         <span className={styles.detailLabel}>
//                           <span className={styles.detailIcon}>{icon}</span>{label}
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

//         {/* Load more */}
//         {!loading && !error && visibleCount < filteredData.length && (
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

// export default AdminTargetWorkspaceTable;



// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import type { RootState, AppDispatch } from "../../app/store";
// import { IoIosArrowDropdown } from "react-icons/io";
// import { FaRegEdit } from "react-icons/fa";
// import { MdOutlineSearch, MdOutlineDelete } from "react-icons/md";
// import { useNavigate } from "react-router-dom";
// import {
//   clearResponse,
//   deleteAdminTargetWorkspaceTableData,
//   fetchAdminTargetWorkspaceFormData,
// } from "./Slice/AdminTargetWorkspaceTableSlice";
// import styles from "./AdminTargetWorkspaceTable.module.css";

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

//   const diffDays     = Math.floor(
//     (today.getTime() - checkDate.getTime()) / (1000 * 60 * 60 * 24)
//   );
//   const currentMonth = today.getMonth();
//   const currentYear  = today.getFullYear();
//   const fyYear       = currentMonth >= 3 ? currentYear : currentYear - 1;

//   switch (period) {
//     case "this_fy":
//       return (
//         checkDate >= new Date(fyYear, 3, 1) &&
//         checkDate <= new Date(fyYear + 1, 2, 31)
//       );
//     case "7days":
//       return diffDays >= 0 && diffDays <= 7;
//     case "15days":
//       return diffDays >= 0 && diffDays <= 15;
//     case "this_month":
//       return (
//         checkDate.getMonth()    === today.getMonth() &&
//         checkDate.getFullYear() === today.getFullYear()
//       );
//     case "3months": {
//       const threeMonthsAgo = new Date(today);
//       threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
//       return checkDate >= threeMonthsAgo && checkDate <= today;
//     }
//     case "q1":
//       return (
//         checkDate >= new Date(fyYear, 3, 1) &&
//         checkDate <= new Date(fyYear, 5, 30)
//       );
//     case "q2":
//       return (
//         checkDate >= new Date(fyYear, 6, 1) &&
//         checkDate <= new Date(fyYear, 8, 30)
//       );
//     case "q3":
//       return (
//         checkDate >= new Date(fyYear, 9, 1) &&
//         checkDate <= new Date(fyYear, 11, 31)
//       );
//     case "q4":
//       return (
//         checkDate >= new Date(fyYear + 1, 0, 1) &&
//         checkDate <= new Date(fyYear + 1, 2, 31)
//       );
//     default:
//       return true;
//   }
// };

// const AdminTargetWorkspaceTable: React.FC = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const navigate = useNavigate();

//   const [searchQuery,        setSearchQuery]        = useState("");
//   const [selectedTimePeriod, setSelectedTimePeriod] = useState("all");
//   const [expandedRows,       setExpandedRows]       = useState<Set<string>>(new Set());
//   const [visibleCount,       setVisibleCount]       = useState(15);

//   const { data, loading, error } = useSelector(
//     (state: RootState) => state.fetchAdminTargetWorkspaceFormData
//   );
//   const { response } = useSelector(
//     (state: RootState) => state.deleteAdminTargetWorkspaceData
//   );

//   useEffect(() => {
//     dispatch(fetchAdminTargetWorkspaceFormData() as any);
//   }, [dispatch, response]);

//   useEffect(() => {
//     if (response?.message === "Deleted successfully") {
//       alert("Target deleted successfully");
//       dispatch(clearResponse());
//     } else if (
//       response?.message &&
//       response.message !== "Deleted successfully"
//     ) {
//       alert("Deletion failed");
//       dispatch(clearResponse());
//     }
//   }, [response, dispatch]);

//   // ── Safe data ────────────────────────────────────────────
//   const safeData = Array.isArray(data) ? data : [];

//   // ── Filtered data ────────────────────────────────────────
//   const reversedData = [...safeData].reverse();

//   const filteredData = reversedData
//     .filter(
//       (row: any) =>
//         row.account_name
//           ?.toLowerCase()
//           .includes(searchQuery.toLowerCase()) ||
//         row.user?.toLowerCase().includes(searchQuery.toLowerCase())
//     )
//     // ── Time Period Filter ───────────────────────────────
//     .filter((row: any) =>
//       isInTimePeriod(row.acct_created_date, selectedTimePeriod)
//     );

//   const visibleData = filteredData.slice(0, visibleCount);

//   // ── KPI Calculations ─────────────────────────────────────
//   const totalTargets    = safeData.length;
//   const thisMonth       = new Date().getMonth();
//   const thisYear        = new Date().getFullYear();
//   const newThisMonth    = safeData.filter((r: any) => {
//     if (!r.acct_created_date) return false;
//     const d = new Date(r.acct_created_date);
//     return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
//   }).length;
//   const uniqueHolders   = new Set(
//     safeData.map((r: any) => r.user).filter(Boolean)
//   ).size;
//   const uniqueVerticals = new Set(
//     safeData.map((r: any) => r.vertical).filter(Boolean)
//   ).size;

//   const toggleRow = (id: string) =>
//     setExpandedRows((prev) => {
//       const next = new Set(prev);
//       next.has(id) ? next.delete(id) : next.add(id);
//       return next;
//     });

//   const handleEditClick   = (id: string) =>
//     navigate(`/EditAdminTargetWorkspace/${id}`);

//   const handleDeleteClick = (id: string) => {
//     if (window.confirm("Are you sure you want to delete this target?")) {
//       dispatch(deleteAdminTargetWorkspaceTableData(id));
//     }
//   };

//   return (
//     <div className={styles.page}>

//       {/* ── Page header ── */}
//       <div className={styles.pageHeader}>
//         <div>
//           <h1 className={styles.pageTitle}>Target Workspace</h1>
//           <p className={styles.pageSubtitle}>
//             Manage and view all target records
//           </p>
//         </div>

//         <div className={styles.headerRight}>

//           {/* ── Time Period Filter ── */}
//           <select
//             className={styles.filterSelect}
//             value={selectedTimePeriod}
//             onChange={(e) => {
//               setSelectedTimePeriod(e.target.value);
//               setVisibleCount(15);
//             }}
//           >
//             {TIME_PERIODS.map((t) => (
//               <option key={t.value} value={t.value}>
//                 {t.label}
//               </option>
//             ))}
//           </select>

//           {/* Search bar */}
//           <div className={styles.searchBar}>
//             <MdOutlineSearch className={styles.searchIcon} />
//             <input
//               className={styles.searchInput}
//               placeholder="Search by account or holder…"
//               value={searchQuery}
//               onChange={(e) => {
//                 setSearchQuery(e.target.value);
//                 setVisibleCount(15);
//               }}
//             />
//             {searchQuery && (
//               <button
//                 className={styles.clearBtn}
//                 onClick={() => {
//                   setSearchQuery("");
//                   setVisibleCount(15);
//                 }}
//               >
//                 ✕
//               </button>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* ── KPI strip ── */}
//       <div className={styles.kpiRow}>
//         <div className={`${styles.kpiCard} ${styles.kpiIndigo}`}>
//           <div className={styles.kpiIconWrap}>
//             <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//               <circle cx="12" cy="12" r="10"/>
//               <circle cx="12" cy="12" r="6"/>
//               <circle cx="12" cy="12" r="2"/>
//             </svg>
//           </div>
//           <div className={styles.kpiContent}>
//             <div className={styles.kpiValue}>{totalTargets}</div>
//             <div className={styles.kpiLabel}>Total Targets</div>
//           </div>
//           <div className={styles.kpiBgNumber}>{totalTargets}</div>
//         </div>

//         <div className={`${styles.kpiCard} ${styles.kpiEmerald}`}>
//           <div className={styles.kpiIconWrap}>
//             <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//               <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
//               <polyline points="17 6 23 6 23 12"/>
//             </svg>
//           </div>
//           <div className={styles.kpiContent}>
//             <div className={styles.kpiValue}>{newThisMonth}</div>
//             <div className={styles.kpiLabel}>Added This Month</div>
//           </div>
//           <div className={styles.kpiBgNumber}>{newThisMonth}</div>
//         </div>

//         <div className={`${styles.kpiCard} ${styles.kpiAmber}`}>
//           <div className={styles.kpiIconWrap}>
//             <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//               <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
//               <circle cx="9" cy="7" r="4"/>
//               <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
//               <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
//             </svg>
//           </div>
//           <div className={styles.kpiContent}>
//             <div className={styles.kpiValue}>{uniqueHolders}</div>
//             <div className={styles.kpiLabel}>Unique Holders</div>
//           </div>
//           <div className={styles.kpiBgNumber}>{uniqueHolders}</div>
//         </div>

//         <div className={`${styles.kpiCard} ${styles.kpiPurple}`}>
//           <div className={styles.kpiIconWrap}>
//             <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//               <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
//             </svg>
//           </div>
//           <div className={styles.kpiContent}>
//             <div className={styles.kpiValue}>{uniqueVerticals}</div>
//             <div className={styles.kpiLabel}>Active Verticals</div>
//           </div>
//           <div className={styles.kpiBgNumber}>{uniqueVerticals}</div>
//         </div>

//         {/* <div className={`${styles.kpiCard} ${styles.kpiCyan}`}>
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
//         </div> */}
//       </div>

//       {/* ── Table card ── */}
//       <div className={styles.tableCard}>

//         {/* Table title bar */}
//         <div className={styles.tableTopBar}>
//           <div className={styles.tableTopLeft}>
//             <div className={styles.tableDot} />
//             <span className={styles.tableTopTitle}>All Targets</span>
//             <span className={styles.tableTopCount}>
//               {filteredData.length} records
//             </span>
//           </div>
//         </div>

//         {/* Header */}
//         <div className={styles.tableHeader}>
//           <div className={styles.thCell} />
//           <div className={styles.thCell}>Account Name</div>
//           <div className={styles.thCell}>PIC</div>
//           <div className={styles.thCell}>Vertical</div>
//           <div className={styles.thCell}>Mobile</div>
//           <div className={styles.thCell}>Created</div>
//           <div className={styles.thCell}>Email</div>
//           <div className={styles.thCell}>Holder</div>
//           <div className={styles.thCell} />
//           <div className={styles.thCell} />
//         </div>

//         {/* Loading skeleton */}
//         {loading && (
//           <div className={styles.stateBox}>
//             {[1, 2, 3, 4, 5].map((i) => (
//               <div key={i} className={styles.skeletonRow}>
//                 {[1, 2, 3, 4, 5, 6, 7, 8].map((j) => (
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
//               <div
//                 className={styles.emptyIconWrap}
//                 style={{ background: "#FEE2E2" }}
//               >
//                 <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2.5">
//                   <circle cx="12" cy="12" r="10" />
//                   <line x1="12" y1="8"  x2="12"    y2="12" />
//                   <line x1="12" y1="16" x2="12.01" y2="16" />
//                 </svg>
//               </div>
//               <p className={styles.emptyTitle}>Failed to load data</p>
//               <p className={styles.emptyText}>
//                 Please check your connection and refresh.
//               </p>
//             </div>
//           </div>
//         )}

//         {/* Empty */}
//         {!loading && !error && filteredData.length === 0 && (
//           <div className={styles.stateBox}>
//             <div className={styles.emptyState}>
//               <div
//                 className={styles.emptyIconWrap}
//                 style={{ background: "#F1F5F9" }}
//               >
//                 <svg width="28" height="28" viewBox="0 0 48 48" fill="none">
//                   <rect x="8" y="12" width="32" height="28" rx="3" stroke="#94A3B8" strokeWidth="2.5"/>
//                   <path d="M16 12V10a2 2 0 012-2h12a2 2 0 012 2v2" stroke="#94A3B8" strokeWidth="2.5"/>
//                   <path d="M17 22h14M17 28h10" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round"/>
//                 </svg>
//               </div>
//               <p className={styles.emptyTitle}>No targets found</p>
//               <p className={styles.emptyText}>
//                 Try adjusting your search or time filter.
//               </p>
//             </div>
//           </div>
//         )}

//         {/* Rows */}
//         {!loading &&
//           !error &&
//           visibleData.map((row: any, idx: number) => (
//             <div
//               key={row.id}
//               className={styles.rowGroup}
//               style={{ animationDelay: `${Math.min(idx, 10) * 35}ms` }}
//             >
//               {/* Main row */}
//               <div
//                 className={`${styles.tableRow} ${
//                   expandedRows.has(row.id) ? styles.rowExpanded : ""
//                 }`}
//               >
//                 <button
//                   className={styles.chevronBtn}
//                   onClick={() => toggleRow(row.id)}
//                   aria-label="Expand row"
//                 >
//                   <IoIosArrowDropdown
//                     size={20}
//                     className={`${styles.chevron} ${
//                       expandedRows.has(row.id) ? styles.chevronOpen : ""
//                     }`}
//                   />
//                 </button>

//                 <div className={styles.tdCell}>
//                   <span className={styles.accountName}>
//                     {row.account_name || "—"}
//                   </span>
//                 </div>
//                 <div className={styles.tdCell}>
//                   <span className={styles.picBadge}>{row.pic || "—"}</span>
//                 </div>
//                 <div className={styles.tdCell}>
//                   {row.vertical ? (
//                     <span className={styles.verticalTag}>{row.vertical}</span>
//                   ) : (
//                     <span className={styles.empty}>—</span>
//                   )}
//                 </div>
//                 <div className={styles.tdCell}>
//                   {row.mobile_number || "—"}
//                 </div>
//                 <div className={styles.tdCell}>
//                   <span className={styles.dateCell}>
//                     {row.acct_created_date || "—"}
//                   </span>
//                 </div>
//                 <div className={styles.tdCell}>
//                   <span className={styles.emailCell}>
//                     {row.email_id || "—"}
//                   </span>
//                 </div>
//                 <div className={styles.tdCell}>
//                   <span className={styles.holderBadge}>
//                     {row.user || "—"}
//                   </span>
//                 </div>

//                 <button
//                   className={styles.editBtn}
//                   onClick={() => handleEditClick(row.id)}
//                   aria-label="Edit target"
//                 >
//                   <FaRegEdit size={14} />
//                 </button>
//                 <button
//                   className={styles.deleteBtn}
//                   onClick={() => handleDeleteClick(row.id)}
//                   aria-label="Delete target"
//                 >
//                   <MdOutlineDelete size={16} />
//                 </button>
//               </div>

//               {/* Expanded detail panel */}
//               {expandedRows.has(row.id) && (
//                 <div className={styles.detailPanel}>
//                   <div className={styles.detailPanelInner}>
//                     <div className={styles.detailHeader}>
//                       <div className={styles.detailTitleWrap}>
//                         <div className={styles.detailAvatar}>
//                           {(row.account_name || "T")[0].toUpperCase()}
//                         </div>
//                         <div>
//                           <div className={styles.detailTitle}>
//                             {row.account_name}
//                           </div>
//                           <div className={styles.detailTitleSub}>
//                             Target Details
//                           </div>
//                         </div>
//                       </div>
//                       {row.vertical && (
//                         <span className={styles.detailVerticalBadge}>
//                           {row.vertical}
//                         </span>
//                       )}
//                     </div>

//                     <div className={styles.detailGrid}>
//                       {[
//                         { label: "Designation",      value: row.designation,      icon: "👔" },
//                         { label: "Department",       value: row.department,       icon: "🏢" },
//                         { label: "Vertical Sub",     value: row.vertical_sub,     icon: "📂" },
//                         { label: "State",            value: row.state,            icon: "🗺️" },
//                         { label: "City",             value: row.city,             icon: "🏙️" },
//                         { label: "Business",         value: row.business,         icon: "💼" },
//                         { label: "Region",           value: row.region,           icon: "🌍" },
//                         { label: "Address",          value: row.address,          icon: "📍" },
//                         { label: "Activity",         value: row.activity,         icon: "📋" },
//                         { label: "Activity Date",    value: row.activity_date,    icon: "📅" },
//                         { label: "Next Action",      value: row.next_action,      icon: "⏭️" },
//                         { label: "Next Action Date", value: row.next_action_date, icon: "🗓️" },
//                       ].map(({ label, value, icon }) => (
//                         <div key={label} className={styles.detailItem}>
//                           <span className={styles.detailLabel}>
//                             <span className={styles.detailIcon}>{icon}</span>
//                             {label}
//                           </span>
//                           <span className={styles.detailValue}>
//                             {value || "—"}
//                           </span>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           ))}

//         {/* Load more */}
//         {!loading && !error && visibleCount < filteredData.length && (
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

// export default AdminTargetWorkspaceTable;




import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../app/store";
import { IoIosArrowDropdown } from "react-icons/io";
import { FaRegEdit } from "react-icons/fa";
import { MdOutlineSearch, MdOutlineDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import {
  clearResponse,
  deleteAdminTargetWorkspaceTableData,
  fetchAdminTargetWorkspaceFormData,
} from "./Slice/AdminTargetWorkspaceTableSlice";

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

  const diffDays     = Math.floor(
    (today.getTime() - checkDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  const currentMonth = today.getMonth();
  const currentYear  = today.getFullYear();
  const fyYear       = currentMonth >= 3 ? currentYear : currentYear - 1;

  switch (period) {
    case "this_fy":
      return (
        checkDate >= new Date(fyYear, 3, 1) &&
        checkDate <= new Date(fyYear + 1, 2, 31)
      );
    case "7days":
      return diffDays >= 0 && diffDays <= 7;
    case "15days":
      return diffDays >= 0 && diffDays <= 15;
    case "this_month":
      return (
        checkDate.getMonth()    === today.getMonth() &&
        checkDate.getFullYear() === today.getFullYear()
      );
    case "3months": {
      const threeMonthsAgo = new Date(today);
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
      return checkDate >= threeMonthsAgo && checkDate <= today;
    }
    case "q1":
      return (
        checkDate >= new Date(fyYear, 3, 1) &&
        checkDate <= new Date(fyYear, 5, 30)
      );
    case "q2":
      return (
        checkDate >= new Date(fyYear, 6, 1) &&
        checkDate <= new Date(fyYear, 8, 30)
      );
    case "q3":
      return (
        checkDate >= new Date(fyYear, 9, 1) &&
        checkDate <= new Date(fyYear, 11, 31)
      );
    case "q4":
      return (
        checkDate >= new Date(fyYear + 1, 0, 1) &&
        checkDate <= new Date(fyYear + 1, 2, 31)
      );
    default:
      return true;
  }
};

// ── Style helpers ────────────────────────────────────────────
const filterSelectClass =
  "h-10 px-3 pr-8 bg-white border-2 border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 transition-all cursor-pointer shadow-sm appearance-none min-w-[140px]";

// Grid columns
const GRID_COLS = "40px 1.6fr 0.8fr 1fr 1fr 1fr 1.3fr 1.1fr 44px 44px";
const GRID_COLS_SKELETON = "40px 1.6fr 0.8fr 1fr 1fr 1fr 1.3fr 1.1fr";

const AdminTargetWorkspaceTable: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [searchQuery,        setSearchQuery]        = useState("");
  const [selectedTimePeriod, setSelectedTimePeriod] = useState("all");
  const [expandedRows,       setExpandedRows]       = useState<Set<string>>(new Set());
  const [visibleCount,       setVisibleCount]       = useState(15);

  const { data, loading, error } = useSelector(
    (state: RootState) => state.fetchAdminTargetWorkspaceFormData
  );
  const { response } = useSelector(
    (state: RootState) => state.deleteAdminTargetWorkspaceData
  );

  useEffect(() => {
    dispatch(fetchAdminTargetWorkspaceFormData() as any);
  }, [dispatch, response]);

  useEffect(() => {
    if (response?.message === "Deleted successfully") {
      alert("Target deleted successfully");
      dispatch(clearResponse());
    } else if (
      response?.message &&
      response.message !== "Deleted successfully"
    ) {
      alert("Deletion failed");
      dispatch(clearResponse());
    }
  }, [response, dispatch]);

  // ── Safe data ────────────────────────────────────────────
  const safeData = Array.isArray(data) ? data : [];

  // ── Filtered data ────────────────────────────────────────
  const reversedData = [...safeData].reverse();

  const filteredData = reversedData
    .filter(
      (row: any) =>
        row.account_name
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        row.user?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    // ── Time Period Filter ───────────────────────────────
    .filter((row: any) =>
      isInTimePeriod(row.acct_created_date, selectedTimePeriod)
    );

  const visibleData = filteredData.slice(0, visibleCount);

  // ── KPI Calculations ─────────────────────────────────────
  const totalTargets    = safeData.length;
  const thisMonth       = new Date().getMonth();
  const thisYear        = new Date().getFullYear();
  const newThisMonth    = safeData.filter((r: any) => {
    if (!r.acct_created_date) return false;
    const d = new Date(r.acct_created_date);
    return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
  }).length;
  const uniqueHolders   = new Set(
    safeData.map((r: any) => r.user).filter(Boolean)
  ).size;
  const uniqueVerticals = new Set(
    safeData.map((r: any) => r.vertical).filter(Boolean)
  ).size;

  const toggleRow = (id: string) =>
    setExpandedRows((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const handleEditClick   = (id: string) =>
    navigate(`/EditAdminTargetWorkspace/${id}`);

  const handleDeleteClick = (id: string) => {
    if (window.confirm("Are you sure you want to delete this target?")) {
      dispatch(deleteAdminTargetWorkspaceTableData(id));
    }
  };

  const kpiCards = [
    {
      label: "Total Targets",    value: totalTargets,    gradient: "from-indigo-600 to-indigo-500",
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
    },
    {
      label: "Added This Month", value: newThisMonth,   gradient: "from-emerald-600 to-emerald-400",
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
    },
    {
      label: "Unique Holders",   value: uniqueHolders,  gradient: "from-amber-500 to-yellow-400",
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    },
    {
      label: "Active Verticals", value: uniqueVerticals, gradient: "from-purple-700 to-purple-500",
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
    },
    // Commented out in original — preserved
    // {
    //   label: "Filtered Results", value: filteredData.length, gradient: "from-cyan-600 to-cyan-400",
    //   icon: <svg .../>
    // },
  ];

  return (
    <div className="w-full min-h-full bg-slate-100 p-7 pb-28 flex flex-col gap-6 overflow-y-auto overflow-x-hidden">

      {/* ── Page Header ── */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        {/* Title — violet text, no banner */}
        <div>
          <h1 className="text-[22px] font-bold text-violet-700 m-0 tracking-tight leading-tight">
            Target Workspace
          </h1>
          <p className="text-[13px] text-violet-400 mt-1 m-0 font-normal">
            Manage and view all target records
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">

          {/* ── Time Period Filter ── */}
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

          {/* Search bar */}
          <div className="flex items-center gap-2 bg-white border-2 border-slate-200 rounded-xl px-4 h-10 w-72 shadow-sm focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-400/20 transition-all">
            <MdOutlineSearch className="text-slate-400 text-lg shrink-0" />
            <input
              className="border-none outline-none bg-transparent text-sm text-slate-800 w-full placeholder:text-slate-300"
              placeholder="Search by account or holder…"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setVisibleCount(15);
              }}
            />
            {searchQuery && (
              <button
                className="text-slate-400 hover:text-indigo-500 text-xs transition-colors"
                onClick={() => {
                  setSearchQuery("");
                  setVisibleCount(15);
                }}
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
            <span className="text-sm font-bold text-slate-800">All Targets</span>
            <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
              {filteredData.length} records
            </span>
          </div>
        </div>

        {/* Table Header — indigo/blue gradient matching Task Workspace */}
        <div
          className="grid gap-3 px-4 py-3 mx-3 mb-1 rounded-xl bg-gradient-to-r from-indigo-700 to-blue-600 text-[10.5px] font-bold uppercase tracking-widest text-white/90"
          style={{ gridTemplateColumns: GRID_COLS }}
        >
          <span></span>
          <span>Account Name</span>
          <span>PIC</span>
          <span>Vertical</span>
          <span>Mobile</span>
          <span>Created</span>
          <span>Email</span>
          <span>Holder</span>
          <span></span>
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
              <p className="text-xs text-slate-400 m-0">Please check your connection and refresh.</p>
            </div>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && filteredData.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-14 text-center">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center">
              <svg width="28" height="28" viewBox="0 0 48 48" fill="none">
                <rect x="8" y="12" width="32" height="28" rx="3" stroke="#94A3B8" strokeWidth="2.5"/>
                <path d="M16 12V10a2 2 0 012-2h12a2 2 0 012 2v2" stroke="#94A3B8" strokeWidth="2.5"/>
                <path d="M17 22h14M17 28h10" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
            </div>
            <p className="text-sm font-bold text-slate-600 m-0">No targets found</p>
            <p className="text-xs text-slate-400 m-0">Try adjusting your search or time filter.</p>
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

              <div className="text-sm font-bold text-slate-900 truncate">{row.account_name || "—"}</div>

              <div>
                <span className="inline-flex items-center px-2.5 py-0.5 bg-gradient-to-r from-indigo-50 to-violet-50 text-indigo-600 rounded-full text-[11px] font-bold border border-indigo-200 whitespace-nowrap max-w-full overflow-hidden text-ellipsis">
                  {row.pic || "—"}
                </span>
              </div>

              <div>
                {row.vertical ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 rounded-full text-[11px] font-bold border border-emerald-200 whitespace-nowrap">
                    {row.vertical}
                  </span>
                ) : (
                  <span className="text-slate-300">—</span>
                )}
              </div>

              <div className="text-sm text-slate-500 truncate">{row.mobile_number || "—"}</div>

              <div>
                <span className="font-mono text-[11.5px] text-slate-500 bg-slate-50 px-2 py-0.5 rounded">
                  {row.acct_created_date || "—"}
                </span>
              </div>

              <div className="text-xs text-slate-500 truncate">{row.email_id || "—"}</div>

              <div>
                <span className="inline-flex items-center px-2.5 py-0.5 bg-gradient-to-r from-orange-50 to-amber-50 text-orange-600 rounded-full text-[11px] font-bold border border-orange-200 whitespace-nowrap">
                  {row.user || "—"}
                </span>
              </div>

              <button
                className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:bg-amber-50 hover:text-amber-600 hover:scale-110 transition-all"
                onClick={() => handleEditClick(row.id)}
                aria-label="Edit target"
              >
                <FaRegEdit size={14} />
              </button>

              <button
                className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 hover:scale-110 transition-all"
                onClick={() => handleDeleteClick(row.id)}
                aria-label="Delete target"
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
                        {(row.account_name || "T")[0].toUpperCase()}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900">{row.account_name}</div>
                        <div className="text-xs text-slate-400 mt-0.5">Target Details</div>
                      </div>
                    </div>
                    {row.vertical && (
                      <span className="text-[11px] font-bold px-2.5 py-0.5 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200">
                        {row.vertical}
                      </span>
                    )}
                  </div>

                  {/* Detail Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {[
                      { label: "Designation",      value: row.designation,      icon: "👔" },
                      { label: "Department",       value: row.department,       icon: "🏢" },
                      { label: "Vertical Sub",     value: row.vertical_sub,     icon: "📂" },
                      { label: "State",            value: row.state,            icon: "🗺️" },
                      { label: "City",             value: row.city,             icon: "🏙️" },
                      { label: "Business",         value: row.business,         icon: "💼" },
                      { label: "Region",           value: row.region,           icon: "🌍" },
                      { label: "Address",          value: row.address,          icon: "📍" },
                      { label: "Activity",         value: row.activity,         icon: "📋" },
                      { label: "Activity Date",    value: row.activity_date,    icon: "📅" },
                      { label: "Next Action",      value: row.next_action,      icon: "⏭️" },
                      { label: "Next Action Date", value: row.next_action_date, icon: "🗓️" },
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

        {/* Load More */}
        {!loading && !error && visibleCount < filteredData.length && (
          <div className="flex justify-center p-5 border-t border-slate-100">
            <button
              onClick={() => setVisibleCount((c) => c + 15)}
              className="px-7 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white border-none rounded-xl text-sm font-semibold cursor-pointer shadow-lg shadow-indigo-200 hover:-translate-y-0.5 hover:shadow-xl transition-all"
            >
              Load more · {filteredData.length - visibleCount} remaining
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminTargetWorkspaceTable;