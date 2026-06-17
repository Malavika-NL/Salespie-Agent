// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import type { RootState, AppDispatch } from "../../app/store";
// import { IoIosArrowDropdown } from "react-icons/io";
// import { FaRegEdit } from "react-icons/fa";
// import styles from "./AdminOpportunityWorkspaceTable.module.css";
// import { adminOpportunityFormData } from "../OpportunityAdminTable/slice/opportunityTableSlice";
// import { useNavigate } from "react-router-dom";
// import { MdOutlineSearch } from "react-icons/md";
// import { clearResponse, deleteAdminOpportunityWorkspaceTableData, fetchAdminOpportunityWorkspaceTableData } from "./AdminOpportunityWorkspaceTableSlice/AdminOpportunityWorkspaceTableSlice";
// import { MdOutlineDelete } from "react-icons/md";


// const AdminOpportunityWorkspaceTable: React.FC = () => {
//     const dispatch = useDispatch<AppDispatch>();
//     const navigate = useNavigate();

//     const [searchQuery, setSearchQuery] = useState("");
//     const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
//     const [selectedRank, setSelectedRank] = useState("All");
//     const [selectedFrequency, setSelectedFrequency] = useState("All");

//     const { data } = useSelector((state: RootState) => state.fetchAdminOpportunityWorkspaceData);
//   const { response } = useSelector((state: RootState) => state.deleteAdminOpportunityWorkspaceTableData);

//     useEffect(() => {
//         dispatch(fetchAdminOpportunityWorkspaceTableData() as any);
//     }, [dispatch,response]);

//      useEffect(() => {
    
//             if (response?.message === "Deleted successfully") {
//                 alert("Opportunity Deleted successfully");
//                 dispatch(clearResponse())
    
//             } else if (response?.message && response.message !== "Deleted successfully") {
//                 alert("Submission failed");
//                 dispatch(clearResponse())
//             }
//         }, [data, navigate, dispatch]);

//     console.log('fetchAdminOpportunityWorkspaceData', data)
    
//     const reversedData = [...data].reverse();

//     const filterByDate = (dateString: string) => {
//         if (!dateString) return false;

//         const today = new Date();
//         const expDate = new Date(dateString);

//         const diffMonths = (today.getFullYear() - expDate.getFullYear()) * 12 + (today.getMonth() - expDate.getMonth());

//         switch (selectedFrequency) {
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

//     const filteredData = reversedData.filter((row) => {
//         const matchesSearch =
//             row.account_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//             row.user.toLowerCase().includes(searchQuery.toLowerCase());

//         const matchesRank = selectedRank === "All" || row.opportunity_stages[0]?.ranks === selectedRank;
//         const matchesDate = selectedFrequency === "All" || filterByDate(row.exp_closure_date);

//         return matchesSearch && matchesRank && matchesDate;
//     });

//      const handleDeleteClick  = (id: string) => {
//         const isConfirmed = window.confirm("Are you sure you want to delete this account?");
        
//         if (isConfirmed) {
//             dispatch(deleteAdminOpportunityWorkspaceTableData(id));
//         }
//     };

//     return (
//         <div className={styles.mainContent}>
//             <div className={styles.heading}>Opportunity Workspace Table</div>
//             <div className={styles.rightContainer}>
//                 <select className={styles.select} value={selectedRank} onChange={(e) => setSelectedRank(e.target.value)}>
//                     <option value="All">All Rank</option>
//                     <option value="Rank A">Rank A</option>
//                     <option value="Rank B">Rank B</option>
//                     <option value="Rank C">Rank C</option>
//                     <option value="Rank D">Rank D</option>
//                     <option value="Rank E">Rank E</option>
//                 </select>

//                 <select className={styles.select} value={selectedFrequency} onChange={(e) => setSelectedFrequency(e.target.value)}>
//                     <option value="All">All Frequency</option>
//                     <option value="Yearly">Yearly</option>
//                     <option value="Half-Yearly">Half-Yearly</option>
//                     <option value="Quarterly">Quarterly</option>
//                     <option value="Monthly">Monthly</option>
//                 </select>

//                 <div className={styles.searchBar}>
//                     <MdOutlineSearch className={styles.searchicon} />
//                     <input
//                         type="text"
//                         placeholder="Search..."
//                         value={searchQuery}
//                         onChange={(e) => setSearchQuery(e.target.value)}
//                         className={styles.search}
//                     />
//                 </div>
//             </div>

//             <div className={styles.tableContainer}>
//                 <div className={styles.tableHeader}>
//                     <div className={styles.tableColumn}></div>
//                     <div className={styles.tableColumn}>Account Name</div>
//                     <div className={styles.tableColumn}>customer PIC</div>
//                     <div className={styles.tableColumn}>Vertical</div>
//                     <div className={styles.tableColumn}>Funnel</div>
//                     <div className={styles.tableColumn}>Exp CL Date</div>
//                     <div className={styles.tableColumn}>Last Update Date</div>
//                     <div className={styles.tableColumn}>Account Holder</div>
//                     <div className={styles.tableColumn}></div>
//                     <div className={styles.tableColumn}></div>
//                 </div>

//                 <div className={styles.tableBody}>
//                     {filteredData.map((row: any) => (
//                         <div key={row.id}>
//                             <div className={styles.tableRow}>
//                                 <div className={styles.iconContainer}>
//                                     <IoIosArrowDropdown
//                                         color="black"
//                                         size={24}
//                                         style={{ cursor: "pointer", transform: expandedRows.has(row.id) ? "rotate(180deg)" : "rotate(0deg)" }}
//                                         onClick={() => setExpandedRows((prev) => {
//                                             const newExpandedRows = new Set(prev);
//                                             newExpandedRows.has(row.id) ? newExpandedRows.delete(row.id) : newExpandedRows.add(row.id);
//                                             return newExpandedRows;
//                                         })}
//                                     />
//                                 </div>
//                                 <div className={styles.tableData}>{row.account_name}</div>
//                                 <div className={styles.tableData}>{row.pic}</div>
//                                 <div className={styles.tableData}>{row.vertical}</div>
//                                 <div className={styles.tableData}>{row.opportunity_stages[0]?.ranks}</div>
//                                 <div className={styles.tableData}>{row.exp_closure_date}</div>
//                                 <div className={styles.tableData}>{row.last_update}</div>
//                                 <div className={styles.tableData}>{row.user}</div>

//                                 <div className={styles.iconContainer} onClick={() => navigate(`/editadminopportunityspace/event/${row.id}`)}>
//                                     <FaRegEdit className={styles.editIcon} title="Edit" />
//                                 </div>
//                                 <div className={styles.iconContainer} onClick={() => handleDeleteClick(row.id)}>
//                                     <MdOutlineDelete className={styles.deleteIcon} title="Edit" />
//                                 </div>
//                             </div>

//                             {expandedRows.has(row.id) && (
//                                 <div className={styles.additionalDetails} style={{ paddingLeft: "6%" }}>
//                                     <p className={styles.subhead}>{row.account_name}</p>

//                                     <div className={styles.additionalContent}>
//                                         <div className={styles.detailBox}>
//                                             <div className={styles.texthead}>Opportunity</div>
//                                             <div className={styles.text}>{row.opportunity}</div>
//                                         </div>
//                                         <div className={styles.detailBox}>
//                                             <div className={styles.texthead}>Make</div>
//                                             <div className={styles.text}>{row.make}</div>
//                                         </div>
//                                         <div className={styles.detailBox}>
//                                             <div className={styles.texthead}>Sub Make</div>
//                                             <div className={styles.text}>{row.sub_make}</div>
//                                         </div>
//                                     </div>
//                                     <div className={styles.additionalContent}>

//                                         <div className={styles.detailBox}>
//                                             <div className={styles.texthead}>Sub Make Brand</div>
//                                             <div className={styles.text}>{row.sub_make_brand}</div>
//                                         </div>


//                                         <div className={styles.detailBox}>
//                                             <div className={styles.texthead}>Exp PO Date</div>
//                                             <div className={styles.text}>{row.exp_op_date}</div>
//                                         </div>

//                                         <div className={styles.detailBox}>
//                                             <div className={styles.texthead}>Account Created Date</div>
//                                             <div className={styles.text}>{row.acct_created_date}</div>
//                                         </div>

//                                     </div>

//                                     <div className={styles.additionalContent}>


//                                         <div className={styles.detailBox}>
//                                             <div className={styles.texthead}>Quantity</div>
//                                             <div className={styles.text}>{row.qty}</div>
//                                         </div>
//                                         <div className={styles.detailBox}>
//                                             <div className={styles.texthead}>Value</div>
//                                             <div className={styles.text}>{row.values}</div>
//                                         </div>

//                                         <div className={styles.detailBox}>
//                                             <div className={styles.texthead}>Address</div>
//                                             <div className={styles.text}>{row.address}</div>
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

// export default AdminOpportunityWorkspaceTable;

// import React, { useEffect, useState, useRef, useCallback } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import type { RootState, AppDispatch } from "../../app/store";
// import { IoIosArrowDropdown } from "react-icons/io";
// import { FaRegEdit } from "react-icons/fa";
// import { MdOutlineSearch, MdOutlineDelete } from "react-icons/md";
// import { useNavigate } from "react-router-dom";
// import {
//   clearResponse,
//   deleteAdminOpportunityWorkspaceTableData,
//   fetchAdminOpportunityWorkspaceTableData,
// } from "./AdminOpportunityWorkspaceTableSlice/AdminOpportunityWorkspaceTableSlice";
// import styles from "./AdminOpportunityWorkspaceTable.module.css";

// const RANKS     = ["All", "Rank A", "Rank B", "Rank C", "Rank D", "Rank E"];
// const FREQUENCY = ["All", "Monthly", "Quarterly", "Half-Yearly", "Yearly"];

// const AdminOpportunityWorkspaceTable: React.FC = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const navigate = useNavigate();

//   const [searchQuery,       setSearchQuery]      = useState("");
//   const [expandedRows,      setExpandedRows]      = useState<Set<string>>(new Set());
//   const [selectedRank,      setSelectedRank]      = useState("All");
//   const [selectedFrequency, setSelectedFrequency] = useState("All");
//   const [visibleCount,      setVisibleCount]      = useState(15);

//   const { data }     = useSelector((state: RootState) => state.fetchAdminOpportunityWorkspaceData);
//   const { response } = useSelector((state: RootState) => state.deleteAdminOpportunityWorkspaceTableData);

//   useEffect(() => {
//     dispatch(fetchAdminOpportunityWorkspaceTableData() as any);
//   }, [dispatch, response]);

//   useEffect(() => {
//     if (response?.message === "Deleted successfully") {
//       alert("Opportunity deleted successfully");
//       dispatch(clearResponse());
//     } else if (response?.message && response.message !== "Deleted successfully") {
//       alert("Deletion failed");
//       dispatch(clearResponse());
//     }
//   }, [response, dispatch]);

//   const filterByDate = (dateString: string) => {
//     if (!dateString) return false;
//     const today     = new Date();
//     const expDate   = new Date(dateString);
//     const diffMonths =
//       (today.getFullYear() - expDate.getFullYear()) * 12 +
//       (today.getMonth() - expDate.getMonth());
//     switch (selectedFrequency) {
//       case "Monthly":     return diffMonths === 0;
//       case "Quarterly":   return diffMonths >= 0 && diffMonths < 3;
//       case "Half-Yearly": return diffMonths >= 0 && diffMonths < 6;
//       case "Yearly":      return diffMonths >= 0 && diffMonths < 12;
//       default:            return true;
//     }
//   };

//   const reversedData = [...data].reverse();
//   const filteredData = reversedData.filter((row: any) => {
//     const matchesSearch =
//       row.account_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       row.user?.toLowerCase().includes(searchQuery.toLowerCase());
//     const matchesRank =
//       selectedRank === "All" || row.opportunity_stages?.[0]?.ranks === selectedRank;
//     const matchesDate =
//       selectedFrequency === "All" || filterByDate(row.exp_closure_date);
//     return matchesSearch && matchesRank && matchesDate;
//   });

//   const sentinelRef = useRef<HTMLDivElement>(null);
//   const handleObserver = useCallback(
//     (entries: IntersectionObserverEntry[]) => {
//       if (entries[0].isIntersecting && visibleCount < filteredData.length)
//         setVisibleCount(c => c + 15);
//     },
//     [visibleCount, filteredData.length]
//   );
//   useEffect(() => {
//     const observer = new IntersectionObserver(handleObserver, { threshold: 0.1 });
//     if (sentinelRef.current) observer.observe(sentinelRef.current);
//     return () => observer.disconnect();
//   }, [handleObserver]);

//   const visibleData = filteredData.slice(0, visibleCount);

//   const totalOpportunities = data.length;
//   const thisMonth = new Date().getMonth();
//   const thisYear  = new Date().getFullYear();
//   const newThisMonth = data.filter((r: any) => {
//     const d = new Date(r.acct_created_date);
//     return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
//   }).length;
//   const totalValue = data.reduce((sum: number, r: any) => sum + (Number(r.values) || 0), 0);
//   const rankACnt   = data.filter((r: any) => r.opportunity_stages?.[0]?.ranks === "Rank A").length;
//   const fmtValue   = (v: number) =>
//     v >= 100000 ? `Rs.${(v/100000).toFixed(1)}L` : v >= 1000 ? `Rs.${(v/1000).toFixed(1)}K` : `Rs.${v}`;

//   const toggleRow = (id: string) =>
//     setExpandedRows(prev => {
//       const next = new Set(prev);
//       next.has(id) ? next.delete(id) : next.add(id);
//       return next;
//     });

//   const handleDeleteClick = (id: string) => {
//     if (window.confirm("Are you sure you want to delete this opportunity?"))
//       dispatch(deleteAdminOpportunityWorkspaceTableData(id));
//   };

//   return (
//     <div className={styles.page}>

//       {/* Page header */}
//       <div className={styles.pageHeader}>
//         <div>
//           <h1 className={styles.pageTitle}>Opportunity Workspace</h1>
//           <p className={styles.pageSubtitle}>Manage and track all opportunity records</p>
//         </div>
//         <div className={styles.headerRight}>
//           <select className={styles.filterSelect} value={selectedRank}
//             onChange={e => { setSelectedRank(e.target.value); setVisibleCount(15); }}>
//             {RANKS.map(r => <option key={r} value={r}>{r}</option>)}
//           </select>
//           <select className={styles.filterSelect} value={selectedFrequency}
//             onChange={e => { setSelectedFrequency(e.target.value); setVisibleCount(15); }}>
//             {FREQUENCY.map(f => <option key={f} value={f}>{f}</option>)}
//           </select>
//           <div className={styles.searchBar}>
//             <MdOutlineSearch className={styles.searchIcon} />
//             <input className={styles.searchInput} placeholder="Search by account or holder…"
//               value={searchQuery}
//               onChange={e => { setSearchQuery(e.target.value); setVisibleCount(15); }} />
//             {searchQuery && <button className={styles.clearBtn} onClick={() => setSearchQuery("")}>✕</button>}
//           </div>
//         </div>
//       </div>

//       {/* KPI strip */}
//       <div className={styles.kpiRow}>
//         <div className={`${styles.kpiCard} ${styles.kpiIndigo}`}>
//           <div className={styles.kpiIconWrap}>
//             <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//               <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
//             </svg>
//           </div>
//           <div className={styles.kpiContent}>
//             <div className={styles.kpiValue}>{totalOpportunities}</div>
//             <div className={styles.kpiLabel}>Total Opportunities</div>
//           </div>
//           <div className={styles.kpiBgNumber}>{totalOpportunities}</div>
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
//               <line x1="12" y1="1" x2="12" y2="23"/>
//               <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
//             </svg>
//           </div>
//           <div className={styles.kpiContent}>
//             <div className={styles.kpiValue}>{fmtValue(totalValue)}</div>
//             <div className={styles.kpiLabel}>Total Value</div>
//           </div>
//           <div className={styles.kpiBgNumber}>{fmtValue(totalValue)}</div>
//         </div>

//         <div className={`${styles.kpiCard} ${styles.kpiPurple}`}>
//           <div className={styles.kpiIconWrap}>
//             <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//               <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
//             </svg>
//           </div>
//           <div className={styles.kpiContent}>
//             <div className={styles.kpiValue}>{rankACnt}</div>
//             <div className={styles.kpiLabel}>Rank A Leads</div>
//           </div>
//           <div className={styles.kpiBgNumber}>{rankACnt}</div>
//         </div>

//         {/* <div className={`${styles.kpiCard} ${styles.kpiCyan}`}>
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
//         </div> */}
//       </div>

//       {/* Table card */}
//       <div className={styles.tableCard}>

//         {/* Table title bar */}
//         <div className={styles.tableTopBar}>
//           <div className={styles.tableTopLeft}>
//             <div className={styles.tableDot} />
//             <span className={styles.tableTopTitle}>All Opportunities</span>
//             <span className={styles.tableTopCount}>{filteredData.length} records</span>
//           </div>
//         </div>

//         {/* Header */}
//         <div className={styles.tableHeader}>
//           <div className={styles.thCell} />
//           <div className={styles.thCell}>Account Name</div>
//           <div className={styles.thCell}>Customer PIC</div>
//           <div className={styles.thCell}>Vertical</div>
//           <div className={styles.thCell}>Funnel</div>
//           <div className={styles.thCell}>Exp CL Date</div>
//           <div className={styles.thCell}>Last Update</div>
//           <div className={styles.thCell}>Account Holder</div>
//           <div className={styles.thCell} />
//           <div className={styles.thCell} />
//         </div>

//         {/* Empty state */}
//         {filteredData.length === 0 && (
//           <div className={styles.stateBox}>
//             <div className={styles.emptyState}>
//               <div className={styles.emptyIconWrap} style={{ background: '#F1F5F9' }}>
//                 <svg width="28" height="28" viewBox="0 0 48 48" fill="none">
//                   <rect x="8" y="12" width="32" height="28" rx="3" stroke="#94A3B8" strokeWidth="2.5"/>
//                   <path d="M16 12V10a2 2 0 012-2h12a2 2 0 012 2v2" stroke="#94A3B8" strokeWidth="2.5"/>
//                   <path d="M17 22h14M17 28h10" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round"/>
//                 </svg>
//               </div>
//               <p className={styles.emptyTitle}>No opportunities found</p>
//               <p className={styles.emptyText}>Try adjusting your filters or search query.</p>
//             </div>
//           </div>
//         )}

//         {/* Rows */}
//         {visibleData.map((row: any, idx: number) => (
//           <div key={row.id} className={styles.rowGroup}
//             style={{ animationDelay: `${Math.min(idx, 10) * 35}ms` }}>

//             <div className={`${styles.tableRow} ${expandedRows.has(row.id) ? styles.rowExpanded : ""}`}>
//               <button className={styles.chevronBtn} onClick={() => toggleRow(row.id)} aria-label="Expand">
//                 <IoIosArrowDropdown size={20}
//                   className={`${styles.chevron} ${expandedRows.has(row.id) ? styles.chevronOpen : ""}`} />
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
//               <div className={styles.tdCell}>
//                 {row.opportunity_stages?.[0]?.ranks
//                   ? <span className={styles.rankBadge}>{row.opportunity_stages[0].ranks}</span>
//                   : <span className={styles.empty}>—</span>}
//               </div>
//               <div className={styles.tdCell}>
//                 <span className={styles.dateCell}>{row.exp_closure_date || "—"}</span>
//               </div>
//               <div className={styles.tdCell}>
//                 <span className={styles.dateCell}>{row.last_update || "—"}</span>
//               </div>
//               <div className={styles.tdCell}>
//                 <span className={styles.holderBadge}>{row.user || "—"}</span>
//               </div>
//               <button className={styles.editBtn}
//                 onClick={() => navigate(`/editadminopportunityspace/event/${row.id}`)} aria-label="Edit">
//                 <FaRegEdit size={14} />
//               </button>
//               <button className={styles.deleteBtn}
//                 onClick={() => handleDeleteClick(row.id)} aria-label="Delete">
//                 <MdOutlineDelete size={16} />
//               </button>
//             </div>

//             {expandedRows.has(row.id) && (
//               <div className={styles.detailPanel}>
//                 <div className={styles.detailPanelInner}>
//                   <div className={styles.detailHeader}>
//                     <div className={styles.detailTitleWrap}>
//                       <div className={styles.detailAvatar}>
//                         {(row.account_name || 'O')[0].toUpperCase()}
//                       </div>
//                       <div>
//                         <div className={styles.detailTitle}>{row.account_name}</div>
//                         <div className={styles.detailTitleSub}>Opportunity Details</div>
//                       </div>
//                     </div>
//                     {row.vertical && (
//                       <span className={styles.detailVerticalBadge}>{row.vertical}</span>
//                     )}
//                   </div>
//                   <div className={styles.detailGrid}>
//                     {[
//                       { label: "Opportunity",    value: row.opportunity,       icon: "🎯" },
//                       { label: "Make",           value: row.make,              icon: "🏭" },
//                       { label: "Sub Make",       value: row.sub_make,          icon: "🔧" },
//                       { label: "Sub Make Brand", value: row.sub_make_brand,    icon: "🏷️" },
//                       { label: "Exp PO Date",    value: row.exp_po_date,       icon: "📋" },
//                       { label: "Created Date",   value: row.acct_created_date, icon: "📅" },
//                       { label: "Quantity",       value: row.qty,               icon: "📦" },
//                       { label: "Value",          value: row.values != null ? `Rs.${Number(row.values).toLocaleString()}` : null, icon: "💰" },
//                       { label: "Address",        value: row.address,           icon: "📍" },
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

//         {/* Infinite scroll sentinel */}
//         <div ref={sentinelRef} className={styles.sentinel} />

//         {/* Load more fallback */}
//         {visibleCount < filteredData.length && (
//           <div className={styles.loadMoreWrap}>
//             <button className={styles.loadMoreBtn} onClick={() => setVisibleCount(c => c + 15)}>
//               Load more · {filteredData.length - visibleCount} remaining
//             </button>
//           </div>
//         )}

//       </div>
//     </div>
//   );
// };

// export default AdminOpportunityWorkspaceTable;

// import React, { useEffect, useState, useRef, useCallback } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import type { RootState, AppDispatch } from "../../app/store";
// import { IoIosArrowDropdown } from "react-icons/io";
// import { FaRegEdit } from "react-icons/fa";
// import { MdOutlineSearch, MdOutlineDelete } from "react-icons/md";
// import { useNavigate } from "react-router-dom";
// import {
//   clearResponse,
//   deleteAdminOpportunityWorkspaceTableData,
//   fetchAdminOpportunityWorkspaceTableData,
// } from "./AdminOpportunityWorkspaceTableSlice/AdminOpportunityWorkspaceTableSlice";
// import styles from "./AdminOpportunityWorkspaceTable.module.css";

// /* ── Constants ── */
// const RANKS = ["All Ranks", "Rank A", "Rank B", "Rank C", "Rank D", "Rank E"];
// const FREQUENCIES = ["All Frequency", "Monthly", "Quarterly", "Half-Yearly", "Yearly"];
// const TIME_PERIODS = [
//   { label: "All Time", value: "all" },
//   { label: "Last 7 Days", value: "7days" },
//   { label: "Last 15 Days", value: "15days" },
//   { label: "This Month", value: "this_month" },
//   { label: "Last 3 Months", value: "3months" },
//   { label: "Q1 (Apr–Jun)", value: "q1" },
//   { label: "Q2 (Jul–Sep)", value: "q2" },
//   { label: "Q3 (Oct–Dec)", value: "q3" },
//   { label: "Q4 (Jan–Mar)", value: "q4" },
//    { label: "This FY", value: "this_fy" },
// ];

// /* ── Date Filter Helper ── */
// const isInTimePeriod = (dateString: string, period: string): boolean => {
//   if (!dateString || period === "all") return true;
//   const today = new Date();
//   const date = new Date(dateString);
//   today.setHours(0, 0, 0, 0);
//   date.setHours(0, 0, 0, 0);

//   const diffDays = Math.floor((today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
//   const currentMonth = today.getMonth();
//   const currentYear = today.getFullYear();
//   const fyYear = currentMonth >= 3 ? currentYear : currentYear - 1;

//   switch (period) {
//     case "this_fy": return date >= new Date(fyYear, 3, 1) && date <= new Date(fyYear + 1, 2, 31);
//     case "7days": return diffDays >= 0 && diffDays <= 7;
//     case "15days": return diffDays >= 0 && diffDays <= 15;
//     case "this_month": return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
//     case "3months": {
//       const threeMonthsAgo = new Date(today);
//       threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
//       return date >= threeMonthsAgo && date <= today;
//     }
//     case "q1": return date >= new Date(fyYear, 3, 1) && date <= new Date(fyYear, 5, 30);
//     case "q2": return date >= new Date(fyYear, 6, 1) && date <= new Date(fyYear, 8, 30);
//     case "q3": return date >= new Date(fyYear, 9, 1) && date <= new Date(fyYear, 11, 31);
//     case "q4": return date >= new Date(fyYear + 1, 0, 1) && date <= new Date(fyYear + 1, 2, 31);
//     default: return true;
//   }
// };

// const fmtAmount = (v: number) => {
//   if (v >= 10000000) return `₹${(v / 10000000).toFixed(2)}Cr`;
//   if (v >= 100000) return `₹${(v / 100000).toFixed(2)}L`;
//   return `₹${v.toLocaleString("en-IN")}`;
// };

// const AdminOpportunityWorkspaceTable: React.FC = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const navigate = useNavigate();

//   const [searchQuery, setSearchQuery] = useState("");
//   const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
//   const [selectedRank, setSelectedRank] = useState("All Ranks");
//   const [selectedFreq, setSelectedFreq] = useState("All Frequency");
//   const [selectedTimePeriod, setSelectedTimePeriod] = useState("all");
//   const [visibleCount, setVisibleCount] = useState(15);

//   const { data } = useSelector((state: RootState) => state.fetchAdminOpportunityWorkspaceData);
//   const { response } = useSelector((state: RootState) => state.deleteAdminOpportunityWorkspaceTableData);

//   useEffect(() => {
//     dispatch(fetchAdminOpportunityWorkspaceTableData() as any);
//   }, [dispatch, response]);

//   useEffect(() => {
//     if (response?.message === "Deleted successfully") {
//       alert("Opportunity deleted successfully");
//       dispatch(clearResponse());
//     }
//   }, [response, dispatch]);

//   const reversedData = [...data].reverse();
//   const filteredData = reversedData.filter((row: any) => {
//     const matchesSearch = row.account_name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
//                          row.user?.toLowerCase().includes(searchQuery.toLowerCase());
//     const latestRank = row.opportunity_stages?.[row.opportunity_stages.length - 1]?.ranks;
//     const matchesRank = selectedRank === "All Ranks" || latestRank === selectedRank;
//     const matchesTime = isInTimePeriod(row.last_update || row.acct_created_date, selectedTimePeriod);
    
//     let matchesFreq = true;
//     if (selectedFreq !== "All Frequency" && row.exp_closure_date) {
//         const today = new Date();
//         const expDate = new Date(row.exp_closure_date);
//         const diffMonths = (today.getFullYear() - expDate.getFullYear()) * 12 + (today.getMonth() - expDate.getMonth());
//         if (selectedFreq === "Monthly") matchesFreq = diffMonths === 0;
//         else if (selectedFreq === "Quarterly") matchesFreq = diffMonths >= 0 && diffMonths < 3;
//         else if (selectedFreq === "Half-Yearly") matchesFreq = diffMonths >= 0 && diffMonths < 6;
//         else if (selectedFreq === "Yearly") matchesFreq = diffMonths >= 0 && diffMonths < 12;
//     }
//     return matchesSearch && matchesRank && matchesTime && matchesFreq;
//   });

//   const totalOpportunities = filteredData.length;
//   const achievements = filteredData.filter(r => r.opportunity_stages?.[r.opportunity_stages.length - 1]?.ranks === "Rank A").length;
//   const rankBCount = filteredData.filter(r => r.opportunity_stages?.[r.opportunity_stages.length - 1]?.ranks === "Rank B").length;
//   const totalPipeline = filteredData.reduce((sum, r) => sum + (Number(r.total_amount) || 0), 0);

//   const toggleRow = (id: string) => {
//     setExpandedRows(prev => {
//       const next = new Set(prev);
//       if (next.has(id)) next.delete(id); else next.add(id);
//       return next;
//     });
//   };

//   const visibleData = filteredData.slice(0, visibleCount);

//   return (
//     <div className={styles.page}>
//       <div className={styles.pageHeader}>
//         <div>
//           <h1 className={styles.pageTitle}>Opportunity Workspace</h1>
//           <p className={styles.pageSubtitle}>Track and manage all opportunity records</p>
//         </div>
//         <div className={styles.headerRight}>
//           <select className={styles.headerSelect} value={selectedTimePeriod} onChange={e => setSelectedTimePeriod(e.target.value)}>
//             {TIME_PERIODS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
//           </select>
//           <div className={styles.searchBar}>
//             <MdOutlineSearch className={styles.searchIcon} />
//             <input className={styles.searchInput} placeholder="Search by account or holder..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
//           </div>
//         </div>
//       </div>

//       <div className={styles.kpiRow}>
//         <div className={`${styles.kpiCard} ${styles.kpiIndigo}`}>
//           <div className={styles.kpiIconWrap}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg></div>
//           <div className={styles.kpiContent}><div className={styles.kpiValue}>{totalOpportunities}</div><div className={styles.kpiLabel}>Total Opportunities</div></div>
//           <div className={styles.kpiBgNumber}>{totalOpportunities}</div>
//         </div>
//         <div className={`${styles.kpiCard} ${styles.kpiEmerald}`}>
//           <div className={styles.kpiIconWrap}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></div>
//           <div className={styles.kpiContent}><div className={styles.kpiValue}>{achievements}</div><div className={styles.kpiLabel}>Achievements</div></div>
//           <div className={styles.kpiBgNumber}>{achievements}</div>
//         </div>
//         <div className={`${styles.kpiCard} ${styles.kpiCyan}`}>
//           <div className={styles.kpiIconWrap}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="9" y1="3" x2="9" y2="21"/></svg></div>
//           <div className={styles.kpiContent}><div className={styles.kpiValue}>{rankBCount}</div><div className={styles.kpiLabel}>Rank B</div></div>
//           <div className={styles.kpiBgNumber}>{rankBCount}</div>
//         </div>
//         <div className={`${styles.kpiCard} ${styles.kpiAmber}`}>
//           <div className={styles.kpiIconWrap}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg></div>
//           <div className={styles.kpiContent}><div className={styles.kpiValue}>{fmtAmount(totalPipeline)}</div><div className={styles.kpiLabel}>Total Pipeline</div></div>
//           <div className={styles.kpiBgNumber}>{fmtAmount(totalPipeline)}</div>
//         </div>
//       </div>

//       <div className={styles.filterStrip}>
//         <div className={styles.filterGroup}>
//           <select className={styles.inlineSelect} value={selectedRank} onChange={e => setSelectedRank(e.target.value)}>
//             {RANKS.map(r => <option key={r} value={r}>{r}</option>)}
//           </select>
//           <select className={styles.inlineSelect} value={selectedFreq} onChange={e => setSelectedFreq(e.target.value)}>
//             {FREQUENCIES.map(f => <option key={f} value={f}>{f}</option>)}
//           </select>
//         </div>
//         <div className={styles.resultCount}>{filteredData.length} results</div>
//       </div>

//       <div className={styles.tableCard}>
//         <div className={styles.tableTopBar}>
//           <div className={styles.tableTopLeft}><div className={styles.tableDot} /><span className={styles.tableTopTitle}>All Opportunities</span></div>
//         </div>
//         <div className={styles.tableHeader}>
//           <div className={styles.thCell} />
//           <div className={styles.thCell}>ACCOUNT NAME</div>
//           <div className={styles.thCell}>CUSTOMER PIC</div>
//           <div className={styles.thCell}>VERTICAL</div>
//           <div className={styles.thCell}>RANK</div>
//           <div className={styles.thCell}>EXP CL DATE</div>
//           <div className={styles.thCell}>LAST UPDATE</div>
//           <div className={styles.thCell}>HOLDER</div>
//           <div className={styles.thCell} />
//           <div className={styles.thCell} />
//         </div>
//         {visibleData.map((row: any) => (
//           <div key={row.id} className={styles.rowGroup}>
//             <div className={`${styles.tableRow} ${expandedRows.has(row.id) ? styles.rowExpanded : ""}`}>
//               <button className={styles.chevronBtn} onClick={() => toggleRow(row.id)}>
//                 <IoIosArrowDropdown size={20} className={`${styles.chevron} ${expandedRows.has(row.id) ? styles.chevronOpen : ""}`} />
//               </button>
//               <div className={styles.tdCell}><span className={styles.accountName}>{row.account_name}</span></div>
//               <div className={styles.tdCell}><span className={styles.picBadge}>{row.pic}</span></div>
//               <div className={styles.tdCell}><span className={styles.detailVerticalBadge}>{row.vertical || "—"}</span></div>
//               <div className={styles.tdCell}>
//                 {row.opportunity_stages?.[row.opportunity_stages.length - 1]?.ranks ? (
//                   <span className={`${styles.rankBadge} ${styles[row.opportunity_stages[row.opportunity_stages.length - 1].ranks.replace(" ", "")]}`}>
//                     {row.opportunity_stages[row.opportunity_stages.length - 1].ranks}
//                   </span>
//                 ) : "—"}
//               </div>
//               <div className={styles.tdCell}><span className={styles.dateCell}>{row.exp_closure_date || "—"}</span></div>
//               <div className={styles.tdCell}><span className={styles.dateCell}>{row.last_update || "—"}</span></div>
//               <div className={styles.tdCell}><span className={styles.holderBadge}>{row.user}</span></div>
//               <button className={styles.editBtn} onClick={() => navigate(`/editadminopportunityspace/event/${row.id}`)}><FaRegEdit size={14} /></button>
//               <button className={styles.deleteBtn} onClick={() => dispatch(deleteAdminOpportunityWorkspaceTableData(row.id))}><MdOutlineDelete size={16} /></button>
//             </div>
//             {expandedRows.has(row.id) && (
//               <div className={styles.detailPanel}>
//                 <div className={styles.detailGrid}>
//                   <div className={styles.detailItem}><span className={styles.detailLabel}>Opportunity</span><span className={styles.detailValue}>{row.opportunity}</span></div>
//                   <div className={styles.detailItem}><span className={styles.detailLabel}>Value</span><span className={styles.detailValue}>₹{Number(row.values).toLocaleString()}</span></div>
//                   <div className={styles.detailItem}><span className={styles.detailLabel}>Created Date</span><span className={styles.detailValue}>{row.acct_created_date}</span></div>
//                   <div className={styles.detailItem}><span className={styles.detailLabel}>Address</span><span className={styles.detailValue}>{row.address || "—"}</span></div>
//                 </div>
//               </div>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default AdminOpportunityWorkspaceTable;





import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../app/store";
import { IoIosArrowDropdown } from "react-icons/io";
import { FaRegEdit } from "react-icons/fa";
import { MdOutlineSearch, MdOutlineDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import {
  clearResponse,
  deleteAdminOpportunityWorkspaceTableData,
  fetchAdminOpportunityWorkspaceTableData,
} from "./AdminOpportunityWorkspaceTableSlice/AdminOpportunityWorkspaceTableSlice";

/* ── Constants ── */
const RANKS = ["All Ranks", "Rank A", "Rank B", "Rank C", "Rank D", "Rank E"];
const FREQUENCIES = ["All Frequency", "Monthly", "Quarterly", "Half-Yearly", "Yearly"];
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

/* ── Date Filter Helper ── */
const isInTimePeriod = (dateString: string, period: string): boolean => {
  if (!dateString || period === "all") return true;
  const today = new Date();
  const date  = new Date(dateString);
  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);

  const diffDays     = Math.floor((today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  const currentMonth = today.getMonth();
  const currentYear  = today.getFullYear();
  const fyYear       = currentMonth >= 3 ? currentYear : currentYear - 1;

  switch (period) {
    case "this_fy":    return date >= new Date(fyYear, 3, 1)     && date <= new Date(fyYear + 1, 2, 31);
    case "7days":      return diffDays >= 0 && diffDays <= 7;
    case "15days":     return diffDays >= 0 && diffDays <= 15;
    case "this_month": return date.getMonth() === currentMonth   && date.getFullYear() === currentYear;
    case "3months": {
      const threeMonthsAgo = new Date(today);
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
      return date >= threeMonthsAgo && date <= today;
    }
    case "q1": return date >= new Date(fyYear, 3, 1)     && date <= new Date(fyYear, 5, 30);
    case "q2": return date >= new Date(fyYear, 6, 1)     && date <= new Date(fyYear, 8, 30);
    case "q3": return date >= new Date(fyYear, 9, 1)     && date <= new Date(fyYear, 11, 31);
    case "q4": return date >= new Date(fyYear + 1, 0, 1) && date <= new Date(fyYear + 1, 2, 31);
    default:   return true;
  }
};

const fmtAmount = (v: number) => {
  if (v >= 10000000) return `₹${(v / 10000000).toFixed(2)}Cr`;
  if (v >= 100000)   return `₹${(v / 100000).toFixed(2)}L`;
  return `₹${v.toLocaleString("en-IN")}`;
};

/* ── Style helpers ── */
const filterSelectClass =
  "h-10 px-4 pr-9 bg-white border-2 border-slate-200 rounded-xl text-sm font-semibold text-slate-600 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 transition-all cursor-pointer shadow-sm appearance-none";

const getRankClass = (rank: string): string => {
  const map: Record<string, string> = {
    "Rank A": "bg-emerald-100 text-emerald-700 border border-emerald-200",
    "Rank B": "bg-yellow-100 text-yellow-800 border border-yellow-200",
    "Rank C": "bg-orange-100 text-orange-700 border border-orange-200",
    "Rank D": "bg-blue-100 text-blue-700 border border-blue-200",
    "Rank E": "bg-slate-100 text-slate-600 border border-slate-200",
  };
  return map[rank] ?? "bg-slate-100 text-slate-600 border border-slate-200";
};

// Grid columns
const GRID_COLS = "40px 1.8fr 1fr 1.2fr 1fr 1.1fr 1.2fr 1.1fr 44px 44px";

const AdminOpportunityWorkspaceTable: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [searchQuery,        setSearchQuery]        = useState("");
  const [expandedRows,       setExpandedRows]       = useState<Set<string>>(new Set());
  const [selectedRank,       setSelectedRank]       = useState("All Ranks");
  const [selectedFreq,       setSelectedFreq]       = useState("All Frequency");
  const [selectedTimePeriod, setSelectedTimePeriod] = useState("all");
  const [visibleCount,       setVisibleCount]       = useState(15);

  const { data }     = useSelector((state: RootState) => state.fetchAdminOpportunityWorkspaceData);
  const { response } = useSelector((state: RootState) => state.deleteAdminOpportunityWorkspaceTableData);

  useEffect(() => {
    dispatch(fetchAdminOpportunityWorkspaceTableData() as any);
  }, [dispatch, response]);

  useEffect(() => {
    if (response?.message === "Deleted successfully") {
      alert("Opportunity deleted successfully");
      dispatch(clearResponse());
    }
  }, [response, dispatch]);

  const reversedData  = [...data].reverse();
  const filteredData  = reversedData.filter((row: any) => {
    const matchesSearch = row.account_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          row.user?.toLowerCase().includes(searchQuery.toLowerCase());
    const latestRank    = row.opportunity_stages?.[row.opportunity_stages.length - 1]?.ranks;
    const matchesRank   = selectedRank === "All Ranks" || latestRank === selectedRank;
    const matchesTime   = isInTimePeriod(row.last_update || row.acct_created_date, selectedTimePeriod);

    let matchesFreq = true;
    if (selectedFreq !== "All Frequency" && row.exp_closure_date) {
      const today      = new Date();
      const expDate    = new Date(row.exp_closure_date);
      const diffMonths = (today.getFullYear() - expDate.getFullYear()) * 12 + (today.getMonth() - expDate.getMonth());
      if      (selectedFreq === "Monthly")     matchesFreq = diffMonths === 0;
      else if (selectedFreq === "Quarterly")   matchesFreq = diffMonths >= 0 && diffMonths < 3;
      else if (selectedFreq === "Half-Yearly") matchesFreq = diffMonths >= 0 && diffMonths < 6;
      else if (selectedFreq === "Yearly")      matchesFreq = diffMonths >= 0 && diffMonths < 12;
    }
    return matchesSearch && matchesRank && matchesTime && matchesFreq;
  });

  const totalOpportunities = filteredData.length;
  const achievements       = filteredData.filter(r => r.opportunity_stages?.[r.opportunity_stages.length - 1]?.ranks === "Rank A").length;
  const rankBCount         = filteredData.filter(r => r.opportunity_stages?.[r.opportunity_stages.length - 1]?.ranks === "Rank B").length;
  const totalPipeline      = filteredData.reduce((sum, r) => sum + (Number(r.total_amount) || 0), 0);

  const toggleRow = (id: string) => {
    setExpandedRows(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const visibleData = filteredData.slice(0, visibleCount);

  const kpiCards = [
    {
      label: "Total Opportunities", value: totalOpportunities,      gradient: "from-indigo-600 to-indigo-500",
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
    },
    {
      label: "Achievements",        value: achievements,            gradient: "from-emerald-600 to-emerald-400",
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
    },
    {
      label: "Rank B",              value: rankBCount,              gradient: "from-cyan-600 to-cyan-400",
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="9" y1="3" x2="9" y2="21"/></svg>,
    },
    {
      label: "Total Pipeline",      value: fmtAmount(totalPipeline), gradient: "from-amber-500 to-yellow-400",
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
    },
  ];

  return (
    <div className="w-full min-h-full bg-slate-100 p-7 pb-28 flex flex-col gap-6 overflow-y-auto overflow-x-hidden">

      {/* ── Page Header ── */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        {/* Title — violet text, no banner */}
        <div>
          <h1 className="text-[22px] font-bold text-violet-700 m-0 tracking-tight leading-tight">
            Opportunity Workspace
          </h1>
          <p className="text-[13px] text-violet-400 mt-1 m-0 font-normal">
            Track and manage all opportunity records
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <select
            className={filterSelectClass}
            value={selectedTimePeriod}
            onChange={e => setSelectedTimePeriod(e.target.value)}
          >
            {TIME_PERIODS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>

          <div className="flex items-center gap-2 bg-white border-2 border-slate-200 rounded-xl px-4 h-10 w-72 shadow-sm focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-400/20 transition-all">
            <MdOutlineSearch className="text-slate-400 text-lg shrink-0" />
            <input
              className="border-none outline-none bg-transparent text-sm text-slate-800 w-full placeholder:text-slate-300"
              placeholder="Search by account or holder..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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

      {/* ── Filter Strip ── */}
      <div className="bg-white border border-slate-200 rounded-2xl px-5 py-3 flex items-center justify-between shadow-sm">
        <div className="flex gap-3">
          <select
            className={filterSelectClass}
            value={selectedRank}
            onChange={e => setSelectedRank(e.target.value)}
          >
            {RANKS.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
          <select
            className={filterSelectClass}
            value={selectedFreq}
            onChange={e => setSelectedFreq(e.target.value)}
          >
            {FREQUENCIES.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>
        <span className="text-[11.5px] font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
          {filteredData.length} results
        </span>
      </div>

      {/* ── Table Card ── */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-md">

        {/* Table top bar */}
        <div className="flex items-center px-5 pt-4 pb-2 gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-[0_0_0_3px_rgba(99,102,241,0.2)] animate-pulse" />
          <span className="text-sm font-bold text-slate-800">All Opportunities</span>
        </div>

        {/* Table Header — indigo/blue gradient matching Task Workspace */}
        <div
          className="grid gap-3 px-4 py-3 mx-3 mb-1 rounded-xl bg-gradient-to-r from-indigo-700 to-blue-600 text-[10.5px] font-bold uppercase tracking-widest text-white/90"
          style={{ gridTemplateColumns: GRID_COLS }}
        >
          <span></span>
          <span>Account Name</span>
          <span>Customer PIC</span>
          <span>Vertical</span>
          <span>Rank</span>
          <span>Exp Cl Date</span>
          <span>Last Update</span>
          <span>Holder</span>
          <span></span>
          <span></span>
        </div>

        {/* Data Rows */}
        {visibleData.map((row: any) => (
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
              >
                <IoIosArrowDropdown
                  size={20}
                  className={`transition-all duration-200 ${expandedRows.has(row.id) ? 'rotate-180 text-indigo-500' : 'text-slate-400'}`}
                />
              </button>

              <div className="text-sm font-bold text-slate-900 truncate">{row.account_name}</div>

              <div>
                <span className="inline-flex items-center px-2.5 py-0.5 bg-gradient-to-r from-indigo-50 to-violet-50 text-indigo-600 rounded-full text-[11px] font-bold border border-indigo-200 whitespace-nowrap">
                  {row.pic}
                </span>
              </div>

              <div>
                <span className="inline-flex items-center px-2.5 py-0.5 bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 rounded-full text-[11px] font-bold border border-emerald-200 whitespace-nowrap">
                  {row.vertical || "—"}
                </span>
              </div>

              <div>
                {row.opportunity_stages?.[row.opportunity_stages.length - 1]?.ranks ? (
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-[11px] font-bold ${getRankClass(row.opportunity_stages[row.opportunity_stages.length - 1].ranks)}`}>
                    {row.opportunity_stages[row.opportunity_stages.length - 1].ranks}
                  </span>
                ) : "—"}
              </div>

              <div>
                <span className="font-mono text-[11.5px] text-slate-500 bg-slate-50 px-2 py-0.5 rounded">
                  {row.exp_closure_date || "—"}
                </span>
              </div>

              <div>
                <span className="font-mono text-[11.5px] text-slate-500 bg-slate-50 px-2 py-0.5 rounded">
                  {row.last_update || "—"}
                </span>
              </div>

              <div>
                <span className="inline-flex items-center px-2.5 py-0.5 bg-gradient-to-r from-orange-50 to-amber-50 text-orange-600 rounded-full text-[11px] font-bold border border-orange-200 whitespace-nowrap">
                  {row.user}
                </span>
              </div>

              <button
                className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:bg-amber-50 hover:text-amber-600 hover:scale-110 transition-all"
                onClick={() => navigate(`/editadminopportunityspace/event/${row.id}`)}
              >
                <FaRegEdit size={14} />
              </button>

              <button
                className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 hover:scale-110 transition-all"
                onClick={() => dispatch(deleteAdminOpportunityWorkspaceTableData(row.id))}
              >
                <MdOutlineDelete size={16} />
              </button>
            </div>

            {/* Expanded Detail Panel */}
            {expandedRows.has(row.id) && (
              <div className="bg-gradient-to-br from-slate-50 to-indigo-50/40 border-t border-slate-200 w-full">
                <div className="px-14 py-5 pb-8">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                      { label: "Opportunity",   value: row.opportunity },
                      { label: "Value",         value: `₹${Number(row.values).toLocaleString()}` },
                      { label: "Created Date",  value: row.acct_created_date },
                      { label: "Address",       value: row.address || "—" },
                    ].map(({ label, value }) => (
                      <div
                        key={label}
                        className="flex flex-col gap-1 bg-white/70 border border-slate-200 rounded-xl px-3 py-2.5 hover:bg-white hover:shadow-sm transition-all"
                      >
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{label}</span>
                        <span className="text-sm font-semibold text-slate-700 truncate">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Load More */}
        {visibleCount < filteredData.length && (
          <div className="flex justify-center p-5 border-t border-slate-100">
            <button
              onClick={() => setVisibleCount(v => v + 15)}
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

export default AdminOpportunityWorkspaceTable;