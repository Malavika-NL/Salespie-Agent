// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import type { RootState, AppDispatch } from "../../app/store";
// import { IoIosArrowDropdown } from "react-icons/io";
// import { FaRegEdit } from "react-icons/fa";
// import styles from "./OpportunityWorkspaceTable.module.css";
// import { useNavigate } from "react-router-dom";
// import { MdOutlineSearch } from "react-icons/md";
// import { fetchOpportunityWorkspaceTableData } from "./Slice/OpportunityWorkspaceTableSlice";



// const OpportunityWorkspaceTable: React.FC = () => {
//     const dispatch = useDispatch<AppDispatch>();
//     const navigate = useNavigate();

//     // State variables
//     const [searchQuery, setSearchQuery] = useState("");
//     const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
//     const [selectedRank, setSelectedRank] = useState("All");
//     const [selectedFrequency, setSelectedFrequency] = useState("All");

//     const { OpportunityData, loading, error } = useSelector((state: RootState) => state.OpportunityWorkspaceTableData);
//     console.log('data', OpportunityData)
//     useEffect(() => {
//         const fetchData = async () => {
//             const response = await dispatch(fetchOpportunityWorkspaceTableData() as any);
//             console.log(response);
//         };
//         fetchData();
//     }, [dispatch]);

//     const reversedData = [...OpportunityData].reverse();

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
//         const matchesSearch = row.account_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//             row.user.toLowerCase().includes(searchQuery.toLowerCase());

//         const matchesRank = selectedRank === "All" || row.opportunity_stages[0]?.ranks === selectedRank;
//         const matchesDate = selectedFrequency === "All" || filterByDate(row.exp_closure_date);

//         return matchesSearch && matchesRank && matchesDate;
//     });
//     // Handlers
//     const handleEditClick = (id: string) => navigate(`/user/editopportunityspace/event/${id}`);
//     const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value);
//     const handleRankChange = (e: React.ChangeEvent<HTMLSelectElement>) => setSelectedRank(e.target.value);


//     const toggleRowDetails = (id: string) => {
//         setExpandedRows((prev) => {
//             const newExpandedRows = new Set(prev);
//             newExpandedRows.has(id) ? newExpandedRows.delete(id) : newExpandedRows.add(id);
//             return newExpandedRows;
//         });
//     };

//     return (
//         <div className={styles.mainContent}>
//             <div className={styles.heading}>Opportunity Workspace Table</div>
//             <div className={styles.rightContainer}>
//                 {/* Rank Filter Dropdown */}
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
//                 {/* Search Input */}
//                 <div className={styles.searchBar}>
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
//                 <div className={styles.tableHeader}>
//                     <div className={styles.tableColumn} style={{ width: "20px" }}></div>
//                     <div className={styles.tableColumn}>Account Name</div>
//                     <div className={styles.tableColumn}>customer PIC</div>
//                     <div className={styles.tableColumn}>Vertical</div>
//                     <div className={styles.tableColumn}>Funnel</div>
//                     <div className={styles.tableColumn}>Exp CL Date</div>
//                     <div className={styles.tableColumn}>Last Update Date</div>
//                     <div className={styles.tableColumn}>Account Holder</div>
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
//                                 <div className={styles.tableData}>{row.opportunity_stages[0]?.ranks}</div>
//                                 <div className={styles.tableData}>{row.exp_closure_date}</div>
//                                 <div className={styles.tableData}>{row.last_update}</div>
//                                 <div className={styles.tableData}>{row.user}</div>

//                                 <div className={styles.iconContainer} onClick={() => handleEditClick(row.id)}>
//                                     <FaRegEdit className={styles.editIcon} title="Edit" />
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

// export default OpportunityWorkspaceTable;

// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import type { RootState, AppDispatch } from "../../app/store";
// import { IoIosArrowDropdown } from "react-icons/io";
// import { FaRegEdit } from "react-icons/fa";
// import { MdOutlineSearch } from "react-icons/md";
// import { useNavigate } from "react-router-dom";
// import { fetchOpportunityWorkspaceTableData } from "./Slice/OpportunityWorkspaceTableSlice";
// import styles from "./OpportunityWorkspaceTable.module.css";

// /* ── Rank badge colors ── */
// const rankStyle: Record<string, { bg: string; color: string; border: string }> = {
//   'Rank A': { bg: '#D1FAE5', color: '#065F46', border: '#6EE7B7' },
//   'Rank B': { bg: '#CFFAFE', color: '#155E75', border: '#67E8F9' },
//   'Rank C': { bg: '#FEF3C7', color: '#92400E', border: '#FCD34D' },
//   'Rank D': { bg: '#FEE2E2', color: '#991B1B', border: '#FCA5A5' },
//   'Rank E': { bg: '#F3E8FF', color: '#6B21A8', border: '#D8B4FE' },
// };

// const fmtAmount = (v: number): string => {
//   if (!v || v === 0) return '—';
//   if (v >= 10_000_000) return `₹${(v / 10_000_000).toFixed(2)}Cr`;
//   if (v >= 100_000)    return `₹${(v / 100_000).toFixed(2)}L`;
//   return `₹${v.toLocaleString('en-IN')}`;
// };

// const OpportunityWorkspaceTable: React.FC = () => {
//   const dispatch  = useDispatch<AppDispatch>();
//   const navigate  = useNavigate();

//   const [searchQuery,       setSearchQuery]       = useState("");
//   const [expandedRows,      setExpandedRows]      = useState<Set<string>>(new Set());
//   const [selectedRank,      setSelectedRank]      = useState("All");
//   const [selectedFrequency, setSelectedFrequency] = useState("All");
//   const [visibleCount,      setVisibleCount]      = useState(15);

//   const { OpportunityData, loading, error } = useSelector(
//     (state: RootState) => state.OpportunityWorkspaceTableData
//   );

//   useEffect(() => {
//     dispatch(fetchOpportunityWorkspaceTableData() as any);
//   }, [dispatch]);
//   console.log('first row sample:', OpportunityData[0]);
//   /* ── Date filter ── */
//   const filterByDate = (dateString: string) => {
//     if (!dateString) return false;
//     const today    = new Date();
//     const expDate  = new Date(dateString);
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

//   const reversedData  = [...OpportunityData].reverse();
//   const filteredData  = reversedData.filter((row) => {
//     const matchesSearch =
//       row.account_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       row.user?.toLowerCase().includes(searchQuery.toLowerCase());
//     const matchesRank = selectedRank === "All" || row.opportunity_stages[0]?.ranks === selectedRank;
//     const matchesDate = selectedFrequency === "All" || filterByDate(row.exp_closure_date);
//     return matchesSearch && matchesRank && matchesDate;
//   });
//   const visibleData = filteredData.slice(0, visibleCount);

//   const toggleRow  = (id: string) =>
//     setExpandedRows((prev) => {
//       const next = new Set(prev);
//       next.has(id) ? next.delete(id) : next.add(id);
//       return next;
//     });

//   const handleEdit = (id: string) =>
//     navigate(`/user/editopportunityspace/event/${id}`);

//   /* ── KPI calculations ── */
//   const totalOpps     = OpportunityData.length;
//   const rankACount    = OpportunityData.filter(
//     (r: any) => r.opportunity_stages?.[0]?.ranks === 'Rank A'
//   ).length;
//   const wonCount      = OpportunityData.filter(
//     (r: any) => r.status?.toLowerCase() === 'won'
//   ).length;
//   const totalPipeline = OpportunityData.reduce(
//     (sum: number, r: any) => sum + (r.total_amount || 0), 0
//   );

//   return (
//     <div className={styles.page}>

//       {/* ── Page header ── */}
//       <div className={styles.pageHeader}>
//         <div>
//           <h1 className={styles.pageTitle}>Opportunity Workspace</h1>
//           <p className={styles.pageSubtitle}>Track and manage all opportunity records</p>
//         </div>
//         <div className={styles.searchBar}>
//           <MdOutlineSearch className={styles.searchIcon} />
//           <input
//             className={styles.searchInput}
//             placeholder="Search by account or holder…"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//           />
//           {searchQuery && (
//             <button className={styles.clearBtn} onClick={() => setSearchQuery('')}>✕</button>
//           )}
//         </div>
//       </div>

//       {/* ── KPI strip ── */}
//       <div className={styles.kpiRow}>
//         <div className={styles.kpiCard}>
//           <div className={styles.kpiIcon} style={{ background: '#EEF2FF', color: '#4F46E5' }}>
//             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//               <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
//             </svg>
//           </div>
//           <div>
//             <div className={styles.kpiValue}>{totalOpps}</div>
//             <div className={styles.kpiLabel}>Total Opportunities</div>
//           </div>
//         </div>
//         <div className={styles.kpiCard}>
//           <div className={styles.kpiIcon} style={{ background: '#D1FAE5', color: '#065F46' }}>
//             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//               <polyline points="20 6 9 17 4 12"/>
//             </svg>
//           </div>
//           <div>
//             <div className={styles.kpiValue}>{rankACount}</div>
//             <div className={styles.kpiLabel}>Rank A</div>
//           </div>
//         </div>
//         <div className={styles.kpiCard}>
//           <div className={styles.kpiIcon} style={{ background: '#ECFDF5', color: '#10B981' }}>
//             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//               <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
//             </svg>
//           </div>
//           <div>
//             <div className={styles.kpiValue}>{wonCount}</div>
//             <div className={styles.kpiLabel}>Won</div>
//           </div>
//         </div>
//         <div className={styles.kpiCard}>
//           <div className={styles.kpiIcon} style={{ background: '#FFFBEB', color: '#F59E0B' }}>
//             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//               <line x1="12" y1="1" x2="12" y2="23"/>
//               <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
//             </svg>
//           </div>
//           <div>
//             <div className={styles.kpiValue}>{fmtAmount(totalPipeline)}</div>
//             <div className={styles.kpiLabel}>Total Pipeline</div>
//           </div>
//         </div>
//       </div>

//       {/* ── Filter toolbar ── */}
//       <div className={styles.toolbar}>
//         <div className={styles.filters}>
//           <select
//             className={styles.select}
//             value={selectedRank}
//             onChange={(e) => setSelectedRank(e.target.value)}
//           >
//             <option value="All">All Ranks</option>
//             <option value="Rank A">Rank A</option>
//             <option value="Rank B">Rank B</option>
//             <option value="Rank C">Rank C</option>
//             <option value="Rank D">Rank D</option>
//             <option value="Rank E">Rank E</option>
//           </select>
//           <select
//             className={styles.select}
//             value={selectedFrequency}
//             onChange={(e) => setSelectedFrequency(e.target.value)}
//           >
//             <option value="All">All Frequency</option>
//             <option value="Yearly">Yearly</option>
//             <option value="Half-Yearly">Half-Yearly</option>
//             <option value="Quarterly">Quarterly</option>
//             <option value="Monthly">Monthly</option>
//           </select>
//         </div>
//         <span className={styles.resultCount}>
//           {filteredData.length} result{filteredData.length !== 1 ? 's' : ''}
//         </span>
//       </div>

//       {/* ── Table card ── */}
//       <div className={styles.tableCard}>

//         {/* Header */}
//         <div className={styles.tableHeader}>
//           <div className={styles.thCell} />
//           <div className={styles.thCell}>Account Name</div>
//           <div className={styles.thCell}>Customer PIC</div>
//           <div className={styles.thCell}>Vertical</div>
//           <div className={styles.thCell}>Rank</div>
//           <div className={styles.thCell}>Exp CL Date</div>
//           <div className={styles.thCell}>Last Update</div>
//           <div className={styles.thCell}>Holder</div>
//           <div className={styles.thCell} />
//         </div>

//         {/* Loading skeleton */}
//         {loading && (
//           <div className={styles.stateBox}>
//             {[1,2,3,4,5].map(i => (
//               <div key={i} className={styles.skeletonRow}>
//                 {[1,2,3,4,5,6,7].map(j => (
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
//                 <line x1="12" y1="8" x2="12" y2="12"/>
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
//               <p className={styles.emptyText}>No opportunities match the current filters</p>
//             </div>
//           </div>
//         )}

//         {/* Rows */}
//         {!loading && !error && visibleData.map((row: any, idx: number) => {
//           const rank   = row.opportunity_stages?.[0]?.ranks;
//           const rStyle = rankStyle[rank] ?? { bg: '#F1F5F9', color: '#475569', border: '#E2E8F0' };

//           return (
//             <div
//               key={row.id}
//               className={styles.rowGroup}
//               style={{ animationDelay: `${idx * 30}ms` }}
//             >
//               {/* Main row */}
//               <div className={`${styles.tableRow} ${expandedRows.has(row.id) ? styles.rowExpanded : ''}`}>
//                 <button
//                   className={styles.chevronBtn}
//                   onClick={() => toggleRow(row.id)}
//                   aria-label="Expand row"
//                 >
//                   <IoIosArrowDropdown
//                     size={20}
//                     className={`${styles.chevron} ${expandedRows.has(row.id) ? styles.chevronOpen : ''}`}
//                   />
//                 </button>

//                 <div className={styles.tdCell}>
//                   <span className={styles.accountName}>{row.account_name || '—'}</span>
//                 </div>
//                 <div className={styles.tdCell}>
//                   <span className={styles.picBadge}>{row.pic || '—'}</span>
//                 </div>
//                 <div className={styles.tdCell}>
//                   {row.vertical
//                     ? <span className={styles.verticalTag}>{row.vertical}</span>
//                     : <span className={styles.empty}>—</span>}
//                 </div>
//                 <div className={styles.tdCell}>
//                   {rank ? (
//                     <span
//                       className={styles.rankBadge}
//                       style={{ background: rStyle.bg, color: rStyle.color, borderColor: rStyle.border }}
//                     >
//                       {rank}
//                     </span>
//                   ) : <span className={styles.empty}>—</span>}
//                 </div>
//                 <div className={styles.tdCell}>
//                   <span className={styles.dateCell}>{row.exp_closure_date || '—'}</span>
//                 </div>
//                 <div className={styles.tdCell}>
//                   <span className={styles.dateCell}>{row.last_update || '—'}</span>
//                 </div>
//                 <div className={styles.tdCell}>
//                   <span className={styles.holderBadge}>{row.user || '—'}</span>
//                 </div>

//                 <button
//                   className={styles.editBtn}
//                   onClick={() => handleEdit(row.id)}
//                   aria-label="Edit opportunity"
//                 >
//                   <FaRegEdit size={14} />
//                 </button>
//               </div>

//               {/* Expanded detail panel */}
//               {expandedRows.has(row.id) && (
//                 <div className={styles.detailPanel}>
//                   <div className={styles.detailPanelInner}>
//                     <div className={styles.detailHeader}>
//                       <span className={styles.detailTitle}>{row.account_name}</span>
//                       <span className={styles.detailSubtitle}>Opportunity Details</span>
//                       {row.status && (
//                         <span className={
//                           row.status.toLowerCase() === 'won'  ? styles.statusWon  :
//                           row.status.toLowerCase() === 'lost' ? styles.statusLost :
//                           styles.statusPending
//                         }>
//                           {row.status}
//                         </span>
//                       )}
//                     </div>
//                     <div className={styles.detailGrid}>
//                       {[
//                         { label: 'Opportunity',        value: row.opportunity       },
//                         { label: 'Make',               value: row.make              },
//                         { label: 'Sub Make',           value: row.sub_make          },
//                         { label: 'Sub Make Brand',     value: row.sub_make_brand    },
//                         { label: 'Exp PO Date',        value: row.exp_po_date       },
//                         { label: 'Account Created',    value: row.acct_created_date },
//                         { label: 'Quantity',           value: row.qty               },
//                         { label: 'Value',              value: fmtAmount(row.values) },
//                         { label: 'Total Amount',       value: fmtAmount(row.total_amount) },
//                         { label: 'Address',            value: row.address           },
//                       ].map(({ label, value }) => (
//                         <div key={label} className={styles.detailItem}>
//                           <span className={styles.detailLabel}>{label}</span>
//                           <span className={styles.detailValue}>{value || '—'}</span>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           );
//         })}

//         {/* Load more */}
//         {!loading && visibleCount < filteredData.length && (
//           <div className={styles.loadMoreWrap}>
//             <button
//               className={styles.loadMoreBtn}
//               onClick={() => setVisibleCount(c => c + 15)}
//             >
//               Load more ({filteredData.length - visibleCount} remaining)
//             </button>
//           </div>
//         )}

//       </div>
//     </div>
//   );
// };

// export default OpportunityWorkspaceTable;
// ==============================================================================================================================
// import React, { useEffect, useState, useRef, useCallback } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import type { RootState, AppDispatch } from "../../app/store";
// import { IoIosArrowDropdown } from "react-icons/io";
// import { FaRegEdit } from "react-icons/fa";
// import { MdOutlineSearch } from "react-icons/md";
// import { useNavigate } from "react-router-dom";
// import { fetchOpportunityWorkspaceTableData } from "./Slice/OpportunityWorkspaceTableSlice";
// import styles from "./OpportunityWorkspaceTable.module.css";

// /* ── Rank badge colors ── */
// const rankStyle: Record<string, { bg: string; color: string; border: string }> = {
//   'Rank A': { bg: '#D1FAE5', color: '#065F46', border: '#6EE7B7' },
//   'Rank B': { bg: '#CFFAFE', color: '#155E75', border: '#67E8F9' },
//   'Rank C': { bg: '#FEF3C7', color: '#92400E', border: '#FCD34D' },
//   'Rank D': { bg: '#FEE2E2', color: '#991B1B', border: '#FCA5A5' },
//   'Rank E': { bg: '#F3E8FF', color: '#6B21A8', border: '#D8B4FE' },
// };

// const fmtAmount = (v: number): string => {
//   if (!v || v === 0) return '—';
//   if (v >= 10_000_000) return `₹${(v / 10_000_000).toFixed(2)}Cr`;
//   if (v >= 100_000)    return `₹${(v / 100_000).toFixed(2)}L`;
//   return `₹${v.toLocaleString('en-IN')}`;
// };

// /* ── Fix account_name: if it's a number string, it was saved as ID ── */
// const resolveAccountName = (
//   accountName: any,
//   accountMap: Record<string, string>
// ): string => {
//   if (!accountName) return '—';
//   const str = String(accountName).trim();
//   if (/^\d+$/.test(str)) {
//     // It's a numeric ID — look up the real name
//     return accountMap[str] || `Account #${str}`;
//   }
//   return str;
// };

// const OpportunityWorkspaceTable: React.FC = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const navigate = useNavigate();

//   const [searchQuery,       setSearchQuery]       = useState("");
//   const [expandedRows,      setExpandedRows]      = useState<Set<string>>(new Set());
//   const [selectedRank,      setSelectedRank]      = useState("All");
//   const [selectedFrequency, setSelectedFrequency] = useState("All");
//   const [visibleCount,      setVisibleCount]      = useState(15);

//   /* ── Account name lookup map (built from opportunity data itself) ── */
//   const [accountMap, setAccountMap] = useState<Record<string, string>>({});

//   const { OpportunityData, loading, error } = useSelector(
//     (state: RootState) => state.OpportunityWorkspaceTableData
//   );

//   useEffect(() => {
//     dispatch(fetchOpportunityWorkspaceTableData() as any);
//   }, [dispatch]);

//   /* ── Build account map from any row that has a real name ── */
//   useEffect(() => {
//     if (!OpportunityData?.length) return;
//     const map: Record<string, string> = {};
//     OpportunityData.forEach((row: any) => {
//       // If account_name is NOT numeric, it's a real name — cache by id
//       if (row.id && row.account_name && !/^\d+$/.test(String(row.account_name))) {
//         map[String(row.id)] = row.account_name;
//       }
//     });
//     setAccountMap(map);
//   }, [OpportunityData]);

//   /* ── Date filter ── */
//   const filterByDate = (dateString: string) => {
//     if (!dateString) return false;
//     const today   = new Date();
//     const expDate = new Date(dateString);
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

//   const reversedData = [...(OpportunityData || [])].reverse();
//   const filteredData = reversedData.filter((row: any) => {
//     const displayName = resolveAccountName(row.account_name, accountMap);
//     const matchesSearch =
//       displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       row.user?.toLowerCase().includes(searchQuery.toLowerCase());
//     const matchesRank = selectedRank === "All" ||
//       row.opportunity_stages?.[0]?.ranks === selectedRank;
//     const matchesDate = selectedFrequency === "All" ||
//       filterByDate(row.exp_closure_date);
//     return matchesSearch && matchesRank && matchesDate;
//   });

//   /* ── Infinite scroll ── */
//   const sentinelRef = useRef<HTMLDivElement>(null);
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

//   const toggleRow  = (id: string) =>
//     setExpandedRows((prev) => {
//       const next = new Set(prev);
//       next.has(id) ? next.delete(id) : next.add(id);
//       return next;
//     });

//   const handleEdit = (id: string) =>
//     navigate(`/user/editopportunityspace/event/${id}`);

//   /* ── KPIs ── */
//   const totalOpps     = (OpportunityData || []).length;
//   const rankACount    = (OpportunityData || []).filter(
//     (r: any) => r.opportunity_stages?.[0]?.ranks === 'Rank A'
//   ).length;
//   const wonCount      = (OpportunityData || []).filter(
//     (r: any) => r.status?.toLowerCase() === 'won'
//   ).length;
//   const totalPipeline = (OpportunityData || []).reduce(
//     (sum: number, r: any) => sum + (r.total_amount || 0), 0
//   );

//   return (
//     <div className={styles.page}>

//       {/* ── Page header ── */}
//       <div className={styles.pageHeader}>
//         <div>
//           <h1 className={styles.pageTitle}>Opportunity Workspace</h1>
//           <p className={styles.pageSubtitle}>
//             Track and manage all opportunity records
//           </p>
//         </div>
//         <div className={styles.searchBar}>
//           <MdOutlineSearch className={styles.searchIcon} />
//           <input
//             className={styles.searchInput}
//             placeholder="Search by account or holder…"
//             value={searchQuery}
//             onChange={(e) => { setSearchQuery(e.target.value); setVisibleCount(15); }}
//           />
//           {searchQuery && (
//             <button className={styles.clearBtn} onClick={() => setSearchQuery('')}>✕</button>
//           )}
//         </div>
//       </div>

//       {/* ── KPI strip ── */}
//       <div className={styles.kpiRow}>
//         <div className={styles.kpiCard}>
//           <div className={styles.kpiIcon} style={{ background: '#EEF2FF', color: '#4F46E5' }}>
//             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//               <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
//             </svg>
//           </div>
//           <div>
//             <div className={styles.kpiValue}>{totalOpps}</div>
//             <div className={styles.kpiLabel}>Total Opportunities</div>
//           </div>
//         </div>
//         <div className={styles.kpiCard}>
//           <div className={styles.kpiIcon} style={{ background: '#D1FAE5', color: '#065F46' }}>
//             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//               <polyline points="20 6 9 17 4 12"/>
//             </svg>
//           </div>
//           <div>
//             <div className={styles.kpiValue}>{rankACount}</div>
//             <div className={styles.kpiLabel}>Rank A</div>
//           </div>
//         </div>
//         <div className={styles.kpiCard}>
//           <div className={styles.kpiIcon} style={{ background: '#ECFDF5', color: '#10B981' }}>
//             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//               <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
//             </svg>
//           </div>
//           <div>
//             <div className={styles.kpiValue}>{wonCount}</div>
//             <div className={styles.kpiLabel}>Won</div>
//           </div>
//         </div>
//         <div className={styles.kpiCard}>
//           <div className={styles.kpiIcon} style={{ background: '#FFFBEB', color: '#F59E0B' }}>
//             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//               <line x1="12" y1="1" x2="12" y2="23"/>
//               <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
//             </svg>
//           </div>
//           <div>
//             <div className={styles.kpiValue}>{fmtAmount(totalPipeline)}</div>
//             <div className={styles.kpiLabel}>Total Pipeline</div>
//           </div>
//         </div>
//       </div>

//       {/* ── Filter toolbar ── */}
//       <div className={styles.toolbar}>
//         <div className={styles.filters}>
//           <select
//             className={styles.select}
//             value={selectedRank}
//             onChange={(e) => { setSelectedRank(e.target.value); setVisibleCount(15); }}
//           >
//             <option value="All">All Ranks</option>
//             <option value="Rank A">Rank A</option>
//             <option value="Rank B">Rank B</option>
//             <option value="Rank C">Rank C</option>
//             <option value="Rank D">Rank D</option>
//             <option value="Rank E">Rank E</option>
//           </select>
//           <select
//             className={styles.select}
//             value={selectedFrequency}
//             onChange={(e) => { setSelectedFrequency(e.target.value); setVisibleCount(15); }}
//           >
//             <option value="All">All Frequency</option>
//             <option value="Yearly">Yearly</option>
//             <option value="Half-Yearly">Half-Yearly</option>
//             <option value="Quarterly">Quarterly</option>
//             <option value="Monthly">Monthly</option>
//           </select>
//         </div>
//         <span className={styles.resultCount}>
//           {filteredData.length} result{filteredData.length !== 1 ? 's' : ''}
//         </span>
//       </div>

//       {/* ── Table card ── */}
//       <div className={styles.tableCard}>

//         {/* Header */}
//         <div className={styles.tableHeader}>
//           <div className={styles.thCell} />
//           <div className={styles.thCell}>Account Name</div>
//           <div className={styles.thCell}>Customer PIC</div>
//           <div className={styles.thCell}>Vertical</div>
//           <div className={styles.thCell}>Rank</div>
//           <div className={styles.thCell}>Exp CL Date</div>
//           <div className={styles.thCell}>Last Update</div>
//           <div className={styles.thCell}>Holder</div>
//           <div className={styles.thCell} />
//         </div>

//         {/* Loading skeleton */}
//         {loading && (
//           <div className={styles.stateBox}>
//             {[1,2,3,4,5].map(i => (
//               <div key={i} className={styles.skeletonRow}>
//                 {[1,2,3,4,5,6,7].map(j => (
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
//               <p className={styles.emptyText}>No opportunities match the current filters</p>
//             </div>
//           </div>
//         )}

//         {/* Rows */}
//         {!loading && !error && visibleData.map((row: any, idx: number) => {
//           const rank        = row.opportunity_stages?.[0]?.ranks;
//           const rStyle      = rankStyle[rank] ?? { bg: '#F1F5F9', color: '#475569', border: '#E2E8F0' };
//           const displayName = resolveAccountName(row.account_name, accountMap);
//           const isExpanded  = expandedRows.has(row.id);

//           return (
//             <div
//               key={row.id}
//               className={styles.rowGroup}
//               style={{ animationDelay: `${Math.min(idx, 10) * 30}ms` }}
//             >
//               {/* Main row */}
//               <div className={`${styles.tableRow} ${isExpanded ? styles.rowExpanded : ''}`}>
//                 <button
//                   className={styles.chevronBtn}
//                   onClick={() => toggleRow(row.id)}
//                   aria-label="Expand row"
//                 >
//                   <IoIosArrowDropdown
//                     size={20}
//                     className={`${styles.chevron} ${isExpanded ? styles.chevronOpen : ''}`}
//                   />
//                 </button>

//                 {/* ── Account Name — fixed ── */}
//                 <div className={styles.tdCell}>
//                   <span className={styles.accountName}>{displayName}</span>
//                 </div>

//                 <div className={styles.tdCell}>
//                   <span className={styles.picBadge}>{row.pic || '—'}</span>
//                 </div>
//                 <div className={styles.tdCell}>
//                   {row.vertical
//                     ? <span className={styles.verticalTag}>{row.vertical}</span>
//                     : <span className={styles.empty}>—</span>}
//                 </div>
//                 <div className={styles.tdCell}>
//                   {rank ? (
//                     <span
//                       className={styles.rankBadge}
//                       style={{ background: rStyle.bg, color: rStyle.color, borderColor: rStyle.border }}
//                     >
//                       {rank}
//                     </span>
//                   ) : <span className={styles.empty}>—</span>}
//                 </div>
//                 <div className={styles.tdCell}>
//                   <span className={styles.dateCell}>{row.exp_closure_date || '—'}</span>
//                 </div>
//                 <div className={styles.tdCell}>
//                   <span className={styles.dateCell}>{row.last_update || '—'}</span>
//                 </div>
//                 <div className={styles.tdCell}>
//                   <span className={styles.holderBadge}>{row.user || '—'}</span>
//                 </div>

//                 <button
//                   className={styles.editBtn}
//                   onClick={() => handleEdit(row.id)}
//                   aria-label="Edit opportunity"
//                 >
//                   <FaRegEdit size={14} />
//                 </button>
//               </div>

//               {/* Expanded detail panel */}
//               {isExpanded && (
//                 <div className={styles.detailPanel}>
//                   <div className={styles.detailPanelInner}>
//                     <div className={styles.detailHeader}>
//                       <span className={styles.detailTitle}>{displayName}</span>
//                       <span className={styles.detailSubtitle}>Opportunity Details</span>
//                       {row.status && (
//                         <span className={
//                           row.status.toLowerCase() === 'won'  ? styles.statusWon  :
//                           row.status.toLowerCase() === 'lost' ? styles.statusLost :
//                           styles.statusPending
//                         }>
//                           {row.status}
//                         </span>
//                       )}
//                     </div>
//                     <div className={styles.detailGrid}>
//                       {[
//                         { label: 'Opportunity',     value: row.opportunity          },
//                         { label: 'Make',            value: row.make                 },
//                         { label: 'Sub Make',        value: row.sub_make             },
//                         { label: 'Sub Make Brand',  value: row.sub_make_brand       },
//                         { label: 'Exp PO Date',     value: row.exp_po_date          },
//                         { label: 'Acct Created',    value: row.acct_created_date    },
//                         { label: 'Quantity',        value: row.qty                  },
//                         { label: 'Value',           value: fmtAmount(row.values)    },
//                         { label: 'Total Amount',    value: fmtAmount(row.total_amount) },
//                         { label: 'Remarks',         value: row.remarks              },
//                         { label: 'State',           value: row.state                },
//                         { label: 'City',            value: row.city                 },
//                         { label: 'Address',         value: row.address              },
//                         { label: 'Contact Person',  value: row.contact_person       },
//                         { label: 'Mobile',          value: row.mobile_number        },
//                       ].map(({ label, value }) => (
//                         <div key={label} className={styles.detailItem}>
//                           <span className={styles.detailLabel}>{label}</span>
//                           <span className={styles.detailValue}>{value || '—'}</span>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           );
//         })}

//         {/* Infinite scroll sentinel */}
//         <div ref={sentinelRef} className={styles.sentinel} />

//         {/* Load more fallback button */}
//         {!loading && visibleCount < filteredData.length && (
//           <div className={styles.loadMoreWrap}>
//             <button
//               className={styles.loadMoreBtn}
//               onClick={() => setVisibleCount(c => c + 15)}
//             >
//               Load more ({filteredData.length - visibleCount} remaining)
//             </button>
//           </div>
//         )}

//       </div>
//     </div>
//   );
// };

// export default OpportunityWorkspaceTable;

// import React, { useEffect, useState, useRef, useCallback } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import type { RootState, AppDispatch } from "../../app/store";
// import { IoIosArrowDropdown } from "react-icons/io";
// import { FaRegEdit } from "react-icons/fa";
// import { MdOutlineSearch } from "react-icons/md";
// import { useNavigate } from "react-router-dom";
// import { fetchOpportunityWorkspaceTableData } from "./Slice/OpportunityWorkspaceTableSlice";
// import styles from "./OpportunityWorkspaceTable.module.css";

// /* ── Rank badge colors ── */
// const rankStyle: Record<string, { bg: string; color: string; border: string }> = {
//   "Rank A": { bg: "#D1FAE5", color: "#065F46", border: "#6EE7B7" },
//   "Rank B": { bg: "#CFFAFE", color: "#155E75", border: "#67E8F9" },
//   "Rank C": { bg: "#FEF3C7", color: "#92400E", border: "#FCD34D" },
//   "Rank D": { bg: "#FEE2E2", color: "#991B1B", border: "#FCA5A5" },
//   "Rank E": { bg: "#F3E8FF", color: "#6B21A8", border: "#D8B4FE" },
// };

// const fmtAmount = (v: number): string => {
//   if (!v || v === 0) return "—";
//   if (v >= 10_000_000) return `₹${(v / 10_000_000).toFixed(2)}Cr`;
//   if (v >= 100_000) return `₹${(v / 100_000).toFixed(2)}L`;
//   return `₹${v.toLocaleString("en-IN")}`;
// };

// const resolveAccountName = (
//   accountName: any,
//   accountMap: Record<string, string>
// ): string => {
//   if (!accountName) return "—";
//   const str = String(accountName).trim();
//   if (/^\d+$/.test(str)) {
//     return accountMap[str] || `Account #${str}`;
//   }
//   return str;
// };

// const OpportunityWorkspaceTable: React.FC = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const navigate = useNavigate();

//   const [searchQuery, setSearchQuery] = useState("");
//   const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
//   const [selectedRank, setSelectedRank] = useState("All");
//   const [selectedFrequency, setSelectedFrequency] = useState("All");
//   const [visibleCount, setVisibleCount] = useState(15);
//   const [accountMap, setAccountMap] = useState<Record<string, string>>({});

//   const { OpportunityData, loading, error } = useSelector(
//     (state: RootState) => state.OpportunityWorkspaceTableData
//   );

//   useEffect(() => {
//     dispatch(fetchOpportunityWorkspaceTableData() as any);
//   }, [dispatch]);

//   useEffect(() => {
//     if (!OpportunityData?.length) return;
//     const map: Record<string, string> = {};
//     OpportunityData.forEach((row: any) => {
//       if (row.id && row.account_name && !/^\d+$/.test(String(row.account_name))) {
//         map[String(row.id)] = row.account_name;
//       }
//     });
//     setAccountMap(map);
//   }, [OpportunityData]);

//   const filterByDate = (dateString: string) => {
//     if (!dateString) return false;
//     const today = new Date();
//     const expDate = new Date(dateString);
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

//   const reversedData = [...(OpportunityData || [])].reverse();
//   const filteredData = reversedData.filter((row: any) => {
//     const displayName = resolveAccountName(row.account_name, accountMap);
//     const matchesSearch =
//       displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       row.user?.toLowerCase().includes(searchQuery.toLowerCase());
//     const matchesRank =
//       selectedRank === "All" || row.opportunity_stages?.[0]?.ranks === selectedRank;
//     const matchesDate =
//       selectedFrequency === "All" || filterByDate(row.exp_closure_date);
//     return matchesSearch && matchesRank && matchesDate;
//   });

//   /* ── Infinite scroll ── */
//   const sentinelRef = useRef<HTMLDivElement>(null);
//   const handleObserver = useCallback(
//     (entries: IntersectionObserverEntry[]) => {
//       if (entries[0].isIntersecting && visibleCount < filteredData.length) {
//         setVisibleCount((c) => c + 15);
//       }
//     },
//     [visibleCount, filteredData.length]
//   );

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

//   const handleEdit = (id: string) =>
//     navigate(`/user/editopportunityspace/event/${id}`);

//   /* ── KPIs ── */
//   const totalOpps = (OpportunityData || []).length;
//   const rankACount = (OpportunityData || []).filter(
//     (r: any) => r.opportunity_stages?.[0]?.ranks === "Rank A"
//   ).length;
//   const wonCount = (OpportunityData || []).filter(
//     (r: any) => r.status?.toLowerCase() === "won"
//   ).length;
//   const totalPipeline = (OpportunityData || []).reduce(
//     (sum: number, r: any) => sum + (r.total_amount || 0),
//     0
//   );

//   return (
//     <div className={styles.page}>

//       {/* ── Page header ── */}
//       <div className={styles.pageHeader}>
//         <div>
//           <h1 className={styles.pageTitle}>Opportunity Workspace</h1>
//           <p className={styles.pageSubtitle}>Track and manage all opportunity records</p>
//         </div>
//         <div className={styles.searchBar}>
//           <MdOutlineSearch className={styles.searchIcon} />
//           <input
//             className={styles.searchInput}
//             placeholder="Search by account or holder…"
//             value={searchQuery}
//             onChange={(e) => {
//               setSearchQuery(e.target.value);
//               setVisibleCount(15);
//             }}
//           />
//           {searchQuery && (
//             <button className={styles.clearBtn} onClick={() => setSearchQuery("")}>
//               ✕
//             </button>
//           )}
//         </div>
//       </div>

//       {/* ── KPI strip — gradient cards matching AccountWorkspaceTable ── */}
//       <div className={styles.kpiRow}>

//         <div className={`${styles.kpiCard} ${styles.kpiIndigo}`}>
//           <div className={styles.kpiIconWrap}>
//             <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//               <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
//             </svg>
//           </div>
//           <div className={styles.kpiContent}>
//             <div className={styles.kpiValue}>{totalOpps}</div>
//             <div className={styles.kpiLabel}>Total Opportunities</div>
//           </div>
//           <div className={styles.kpiBgNumber}>{totalOpps}</div>
//         </div>

//         <div className={`${styles.kpiCard} ${styles.kpiEmerald}`}>
//           <div className={styles.kpiIconWrap}>
//             <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//               <polyline points="20 6 9 17 4 12" />
//             </svg>
//           </div>
//           <div className={styles.kpiContent}>
//             <div className={styles.kpiValue}>{rankACount}</div>
//             <div className={styles.kpiLabel}>Rank A</div>
//           </div>
//           <div className={styles.kpiBgNumber}>{rankACount}</div>
//         </div>

//         <div className={`${styles.kpiCard} ${styles.kpiCyan}`}>
//           <div className={styles.kpiIconWrap}>
//             <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//               <circle cx="12" cy="12" r="10" />
//               <polyline points="12 6 12 12 16 14" />
//             </svg>
//           </div>
//           <div className={styles.kpiContent}>
//             <div className={styles.kpiValue}>{wonCount}</div>
//             <div className={styles.kpiLabel}>Won</div>
//           </div>
//           <div className={styles.kpiBgNumber}>{wonCount}</div>
//         </div>

//         <div className={`${styles.kpiCard} ${styles.kpiAmber}`}>
//           <div className={styles.kpiIconWrap}>
//             <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//               <line x1="12" y1="1" x2="12" y2="23" />
//               <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
//             </svg>
//           </div>
//           <div className={styles.kpiContent}>
//             <div className={styles.kpiValue}>{fmtAmount(totalPipeline)}</div>
//             <div className={styles.kpiLabel}>Total Pipeline</div>
//           </div>
//           <div className={styles.kpiBgNumber}>{wonCount}</div>
//         </div>

//       </div>

//       {/* ── Filter toolbar ── */}
//       <div className={styles.toolbar}>
//         <div className={styles.filters}>
//           <select
//             className={styles.select}
//             value={selectedRank}
//             onChange={(e) => { setSelectedRank(e.target.value); setVisibleCount(15); }}
//           >
//             <option value="All">All Ranks</option>
//             <option value="Rank A">Rank A</option>
//             <option value="Rank B">Rank B</option>
//             <option value="Rank C">Rank C</option>
//             <option value="Rank D">Rank D</option>
//             <option value="Rank E">Rank E</option>
//           </select>
//           <select
//             className={styles.select}
//             value={selectedFrequency}
//             onChange={(e) => { setSelectedFrequency(e.target.value); setVisibleCount(15); }}
//           >
//             <option value="All">All Frequency</option>
//             <option value="Yearly">Yearly</option>
//             <option value="Half-Yearly">Half-Yearly</option>
//             <option value="Quarterly">Quarterly</option>
//             <option value="Monthly">Monthly</option>
//           </select>
//         </div>
//         <span className={styles.resultCount}>
//           {filteredData.length} result{filteredData.length !== 1 ? "s" : ""}
//         </span>
//       </div>

//       {/* ── Table card ── */}
//       <div className={styles.tableCard}>

//         {/* Table top bar */}
//         <div className={styles.tableTopBar}>
//           <div className={styles.tableTopLeft}>
//             <div className={styles.tableDot} />
//             <span className={styles.tableTopTitle}>All Opportunities</span>
//             <span className={styles.tableTopCount}>{filteredData.length} records</span>
//           </div>
//         </div>

//         {/* Dark gradient header */}
//         <div className={styles.tableHeader}>
//           <div className={styles.thCell} />
//           <div className={styles.thCell}>Account Name</div>
//           <div className={styles.thCell}>Customer PIC</div>
//           <div className={styles.thCell}>Vertical</div>
//           <div className={styles.thCell}>Rank</div>
//           <div className={styles.thCell}>Exp CL Date</div>
//           <div className={styles.thCell}>Last Update</div>
//           <div className={styles.thCell}>Holder</div>
//           <div className={styles.thCell} />
//         </div>

//         {/* Loading skeleton */}
//         {loading && (
//           <div className={styles.stateBox}>
//             {[1, 2, 3, 4, 5].map((i) => (
//               <div key={i} className={styles.skeletonRow}>
//                 {[1, 2, 3, 4, 5, 6, 7].map((j) => (
//                   <div
//                     key={j}
//                     className={styles.skeletonCell}
//                     style={{ animationDelay: `${j * 80}ms` }}
//                   />
//                 ))}
//               </div>
//             ))}
//           </div>
//         )}

//         {/* Error */}
//         {error && !loading && (
//           <div className={styles.stateBox}>
//             <div className={styles.emptyState}>
//               <div className={styles.emptyIconWrap} style={{ background: "#FEE2E2" }}>
//                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2">
//                   <circle cx="12" cy="12" r="10" />
//                   <line x1="12" y1="8" x2="12" y2="12" />
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
//               <div className={styles.emptyIconWrap} style={{ background: "#F1F5F9" }}>
//                 <svg width="24" height="24" viewBox="0 0 48 48" fill="none">
//                   <rect x="8" y="12" width="32" height="28" rx="3" stroke="#94A3B8" strokeWidth="2.5" />
//                   <path d="M16 12V10a2 2 0 012-2h12a2 2 0 012 2v2" stroke="#94A3B8" strokeWidth="2.5" />
//                   <path d="M17 22h14M17 28h10" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" />
//                 </svg>
//               </div>
//               <p className={styles.emptyTitle}>No opportunities found</p>
//               <p className={styles.emptyText}>Try adjusting your filters or search query.</p>
//             </div>
//           </div>
//         )}

//         {/* Rows */}
//         {!loading &&
//           !error &&
//           visibleData.map((row: any, idx: number) => {
//             const rank = row.opportunity_stages?.[0]?.ranks;
//             const rStyle = rankStyle[rank] ?? {
//               bg: "#F1F5F9",
//               color: "#475569",
//               border: "#E2E8F0",
//             };
//             const displayName = resolveAccountName(row.account_name, accountMap);
//             const isExpanded = expandedRows.has(row.id);

//             return (
//               <div
//                 key={row.id}
//                 className={styles.rowGroup}
//                 style={{ animationDelay: `${Math.min(idx, 10) * 35}ms` }}
//               >
//                 {/* Main row */}
//                 <div
//                   className={`${styles.tableRow} ${isExpanded ? styles.rowExpanded : ""}`}
//                 >
//                   <button
//                     className={styles.chevronBtn}
//                     onClick={() => toggleRow(row.id)}
//                     aria-label="Expand row"
//                   >
//                     <IoIosArrowDropdown
//                       size={20}
//                       className={`${styles.chevron} ${isExpanded ? styles.chevronOpen : ""}`}
//                     />
//                   </button>

//                   <div className={styles.tdCell}>
//                     <span className={styles.accountName}>{displayName}</span>
//                   </div>

//                   <div className={styles.tdCell}>
//                     <span className={styles.picBadge}>{row.pic || "—"}</span>
//                   </div>

//                   <div className={styles.tdCell}>
//                     {row.vertical ? (
//                       <span className={styles.verticalTag}>{row.vertical}</span>
//                     ) : (
//                       <span className={styles.empty}>—</span>
//                     )}
//                   </div>

//                   <div className={styles.tdCell}>
//                     {rank ? (
//                       <span
//                         className={styles.rankBadge}
//                         style={{
//                           background: rStyle.bg,
//                           color: rStyle.color,
//                           borderColor: rStyle.border,
//                         }}
//                       >
//                         {rank}
//                       </span>
//                     ) : (
//                       <span className={styles.empty}>—</span>
//                     )}
//                   </div>

//                   <div className={styles.tdCell}>
//                     <span className={styles.dateCell}>{row.exp_closure_date || "—"}</span>
//                   </div>

//                   <div className={styles.tdCell}>
//                     <span className={styles.dateCell}>{row.last_update || "—"}</span>
//                   </div>

//                   <div className={styles.tdCell}>
//                     <span className={styles.holderBadge}>{row.user || "—"}</span>
//                   </div>

//                   <button
//                     className={styles.editBtn}
//                     onClick={() => handleEdit(row.id)}
//                     aria-label="Edit opportunity"
//                   >
//                     <FaRegEdit size={14} />
//                   </button>
//                 </div>

//                 {/* Expanded detail panel */}
//                 {isExpanded && (
//                   <div className={styles.detailPanel}>
//                     <div className={styles.detailPanelInner}>
//                       <div className={styles.detailHeader}>
//                         <div className={styles.detailTitleWrap}>
//                           <div className={styles.detailAvatar}>
//                             {(displayName || "O")[0].toUpperCase()}
//                           </div>
//                           <div>
//                             <div className={styles.detailTitle}>{displayName}</div>
//                             <div className={styles.detailTitleSub}>Opportunity Details</div>
//                           </div>
//                         </div>
//                         <div className={styles.detailHeaderRight}>
//                           {rank && (
//                             <span
//                               className={styles.detailRankBadge}
//                               style={{
//                                 background: rStyle.bg,
//                                 color: rStyle.color,
//                                 borderColor: rStyle.border,
//                               }}
//                             >
//                               {rank}
//                             </span>
//                           )}
//                           {row.status && (
//                             <span
//                               className={
//                                 row.status.toLowerCase() === "won"
//                                   ? styles.statusWon
//                                   : row.status.toLowerCase() === "lost"
//                                   ? styles.statusLost
//                                   : styles.statusPending
//                               }
//                             >
//                               {row.status}
//                             </span>
//                           )}
//                         </div>
//                       </div>

//                       <div className={styles.detailGrid}>
//                         {[
//                           { label: "Opportunity",    value: row.opportunity,               icon: "🎯" },
//                           { label: "Make",           value: row.make,                      icon: "🏭" },
//                           { label: "Sub Make",       value: row.sub_make,                  icon: "🔩" },
//                           { label: "Sub Make Brand", value: row.sub_make_brand,            icon: "🏷️" },
//                           { label: "Exp PO Date",    value: row.exp_po_date,               icon: "📅" },
//                           { label: "Acct Created",   value: row.acct_created_date,         icon: "🗓️" },
//                           { label: "Quantity",       value: row.qty,                       icon: "📦" },
//                           { label: "Value",          value: fmtAmount(row.values),         icon: "💰" },
//                           { label: "Total Amount",   value: fmtAmount(row.total_amount),   icon: "💵" },
//                           { label: "Remarks",        value: row.remarks,                   icon: "📝" },
//                           { label: "State",          value: row.state,                     icon: "📍" },
//                           { label: "City",           value: row.city,                      icon: "🏙️" },
//                           { label: "Address",        value: row.address,                   icon: "📮" },
//                           { label: "Contact Person", value: row.contact_person,            icon: "👤" },
//                           { label: "Mobile",         value: row.mobile_number,             icon: "📱" },
//                         ].map(({ label, value, icon }) => (
//                           <div key={label} className={styles.detailItem}>
//                             <span className={styles.detailLabel}>
//                               <span className={styles.detailIcon}>{icon}</span>
//                               {label}
//                             </span>
//                             <span className={styles.detailValue}>{value || "—"}</span>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             );
//           })}

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

// export default OpportunityWorkspaceTable;


// import React, { useEffect, useState, useRef, useCallback } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import type { RootState, AppDispatch } from "../../app/store";
// import { IoIosArrowDropdown } from "react-icons/io";
// import { FaRegEdit } from "react-icons/fa";
// import { MdOutlineSearch } from "react-icons/md";
// import { useNavigate } from "react-router-dom";
// import { fetchOpportunityWorkspaceTableData } from "./Slice/OpportunityWorkspaceTableSlice";
// import styles from "./OpportunityWorkspaceTable.module.css";

// /* ── Rank badge colors ── */
// const rankStyle: Record<string, { bg: string; color: string; border: string }> = {
//   "Rank A": { bg: "#D1FAE5", color: "#065F46", border: "#6EE7B7" },
//   "Rank B": { bg: "#CFFAFE", color: "#155E75", border: "#67E8F9" },
//   "Rank C": { bg: "#FEF3C7", color: "#92400E", border: "#FCD34D" },
//   "Rank D": { bg: "#FEE2E2", color: "#991B1B", border: "#FCA5A5" },
//   "Rank E": { bg: "#F3E8FF", color: "#6B21A8", border: "#D8B4FE" },
// };

// const fmtAmount = (v: number): string => {
//   if (!v || v === 0) return "—";
//   if (v >= 10_000_000) return `₹${(v / 10_000_000).toFixed(2)}Cr`;
//   if (v >= 100_000)    return `₹${(v / 100_000).toFixed(2)}L`;
//   return `₹${v.toLocaleString("en-IN")}`;
// };

// const resolveAccountName = (
//   accountName: any,
//   accountMap: Record<string, string>
// ): string => {
//   if (!accountName) return "—";
//   const str = String(accountName).trim();
//   if (/^\d+$/.test(str)) {
//     return accountMap[str] || `Account #${str}`;
//   }
//   return str;
// };

// const OpportunityWorkspaceTable: React.FC = () => {
//   const dispatch  = useDispatch<AppDispatch>();
//   const navigate  = useNavigate();

//   const [searchQuery,       setSearchQuery]       = useState("");
//   const [expandedRows,      setExpandedRows]      = useState<Set<string>>(new Set());
//   const [selectedRank,      setSelectedRank]      = useState("All");
//   const [selectedFrequency, setSelectedFrequency] = useState("All");
//   const [visibleCount,      setVisibleCount]      = useState(15);
//   const [accountMap,        setAccountMap]        = useState<Record<string, string>>({});

//   const { OpportunityData, loading, error } = useSelector(
//     (state: RootState) => state.OpportunityWorkspaceTableData
//   );

//   useEffect(() => {
//     dispatch(fetchOpportunityWorkspaceTableData() as any);
//   }, [dispatch]);

//   useEffect(() => {
//     if (!OpportunityData?.length) return;
//     const map: Record<string, string> = {};
//     OpportunityData.forEach((row: any) => {
//       if (row.id && row.account_name && !/^\d+$/.test(String(row.account_name))) {
//         map[String(row.id)] = row.account_name;
//       }
//     });
//     setAccountMap(map);
//   }, [OpportunityData]);

//   const filterByDate = (dateString: string) => {
//     if (!dateString) return false;
//     const today   = new Date();
//     const expDate = new Date(dateString);
//     const diffMonths =
//       (today.getFullYear() - expDate.getFullYear()) * 12 +
//       (today.getMonth()   - expDate.getMonth());
//     switch (selectedFrequency) {
//       case "Monthly":     return diffMonths === 0;
//       case "Quarterly":   return diffMonths >= 0 && diffMonths < 3;
//       case "Half-Yearly": return diffMonths >= 0 && diffMonths < 6;
//       case "Yearly":      return diffMonths >= 0 && diffMonths < 12;
//       default:            return true;
//     }
//   };

//   const reversedData  = [...(OpportunityData || [])].reverse();
//   const filteredData  = reversedData.filter((row: any) => {
//     const displayName  = resolveAccountName(row.account_name, accountMap);
//     const matchesSearch =
//       displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       row.user?.toLowerCase().includes(searchQuery.toLowerCase());
//     const matchesRank =
//       selectedRank === "All" || row.opportunity_stages?.[0]?.ranks === selectedRank;
//     const matchesDate =
//       selectedFrequency === "All" || filterByDate(row.exp_closure_date);
//     return matchesSearch && matchesRank && matchesDate;
//   });

//   /* ── Infinite scroll ── */
//   const sentinelRef   = useRef<HTMLDivElement>(null);
//   const handleObserver = useCallback(
//     (entries: IntersectionObserverEntry[]) => {
//       if (entries[0].isIntersecting && visibleCount < filteredData.length) {
//         setVisibleCount((c) => c + 15);
//       }
//     },
//     [visibleCount, filteredData.length]
//   );

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

//   const handleEdit = (id: string) =>
//     navigate(`/user/editopportunityspace/event/${id}`);

//   /* ══════════════════════════════════════
//      KPI CALCULATIONS
//      ══════════════════════════════════════ */
//   const totalOpps = (OpportunityData || []).length;

//   // Rank B count for the second KPI card
//   const rankBCount = (OpportunityData || []).filter(
//     (r: any) => r.opportunity_stages?.[0]?.ranks === "Rank B"
//   ).length;

//   // Achievements = Rank A count (relabeled)
//   const achievementCount = (OpportunityData || []).filter(
//     (r: any) => r.opportunity_stages?.[0]?.ranks === "Rank A"
//   ).length;

//   // Total pipeline amount
//   const totalPipeline = (OpportunityData || []).reduce(
//     (sum: number, r: any) => sum + (r.total_amount || 0),
//     0
//   );

//   return (
//     <div className={styles.page}>

//       {/* ── Page header ── */}
//       <div className={styles.pageHeader}>
//         <div>
//           <h1 className={styles.pageTitle}>Opportunity Workspace</h1>
//           <p className={styles.pageSubtitle}>Track and manage all opportunity records</p>
//         </div>
//         <div className={styles.searchBar}>
//           <MdOutlineSearch className={styles.searchIcon} />
//           <input
//             className={styles.searchInput}
//             placeholder="Search by account or holder…"
//             value={searchQuery}
//             onChange={(e) => {
//               setSearchQuery(e.target.value);
//               setVisibleCount(15);
//             }}
//           />
//           {searchQuery && (
//             <button className={styles.clearBtn} onClick={() => setSearchQuery("")}>
//               ✕
//             </button>
//           )}
//         </div>
//       </div>

//       {/* ════════════════════════════════════
//           KPI STRIP — 4 cards
//           ════════════════════════════════════ */}
//       <div className={styles.kpiRow}>

//         {/* 1 ── Total Opportunities */}
//         <div className={`${styles.kpiCard} ${styles.kpiIndigo}`}>
//           <div className={styles.kpiIconWrap}>
//             <svg width="18" height="18" viewBox="0 0 24 24"
//                  fill="none" stroke="currentColor" strokeWidth="2">
//               <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
//             </svg>
//           </div>
//           <div className={styles.kpiContent}>
//             <div className={styles.kpiValue}>{totalOpps}</div>
//             <div className={styles.kpiLabel}>Total Opportunities</div>
//           </div>
//           <div className={styles.kpiBgNumber}>{totalOpps}</div>
//         </div>

//         {/* 2 ── Rank B */}
        
//         {/* 3 ── Achievements (Rank A data) */}
//         <div className={`${styles.kpiCard} ${styles.kpiEmerald}`}>
//           <div className={styles.kpiIconWrap}>
//             {/* Trophy / medal icon */}
//             <svg width="18" height="18" viewBox="0 0 24 24"
//                  fill="none" stroke="currentColor" strokeWidth="2">
//               <circle cx="12" cy="8" r="6" />
//               <path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12" />
//             </svg>
//           </div>
//           <div className={styles.kpiContent}>
//             <div className={styles.kpiValue}>{achievementCount}</div>
//             <div className={styles.kpiLabel}>Achievements</div>
//           </div>
//           <div className={styles.kpiBgNumber}>{achievementCount}</div>
//         </div>
        
//         <div className={`${styles.kpiCard} ${styles.kpiCyan}`}>
//           <div className={styles.kpiIconWrap}>
//             {/* "B" badge icon */}
//             <svg width="18" height="18" viewBox="0 0 24 24"
//                  fill="none" stroke="currentColor" strokeWidth="2">
//               <rect x="3" y="3" width="18" height="18" rx="3" />
//               <path d="M8 12h4a2 2 0 0 0 0-4H8v8h4.5a2.5 2.5 0 0 0 0-5H8" />
//             </svg>
//           </div>
//           <div className={styles.kpiContent}>
//             <div className={styles.kpiValue}>{rankBCount}</div>
//             <div className={styles.kpiLabel}>Rank B</div>
//           </div>
//           <div className={styles.kpiBgNumber}>{rankBCount}</div>
//         </div>

//         {/* 4 ── Total Pipeline */}
//         <div className={`${styles.kpiCard} ${styles.kpiAmber}`}>
//           <div className={styles.kpiIconWrap}>
//             <svg width="18" height="18" viewBox="0 0 24 24"
//                  fill="none" stroke="currentColor" strokeWidth="2">
//               <line x1="12" y1="1" x2="12" y2="23" />
//               <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
//             </svg>
//           </div>
//           <div className={styles.kpiContent}>
//             <div className={styles.kpiValue}>{fmtAmount(totalPipeline)}</div>
//             <div className={styles.kpiLabel}>Total Pipeline</div>
//           </div>
//           {/* bg number shows formatted amount */}
//           <div className={styles.kpiBgNumber}>{fmtAmount(totalPipeline)}</div>
//         </div>

//       </div>

//       {/* ── Filter toolbar ── */}
//       <div className={styles.toolbar}>
//         <div className={styles.filters}>
//           <select
//             className={styles.select}
//             value={selectedRank}
//             onChange={(e) => { setSelectedRank(e.target.value); setVisibleCount(15); }}
//           >
//             <option value="All">All Ranks</option>
//             <option value="Rank A">Rank A</option>
//             <option value="Rank B">Rank B</option>
//             <option value="Rank C">Rank C</option>
//             <option value="Rank D">Rank D</option>
//             <option value="Rank E">Rank E</option>
//           </select>
//           <select
//             className={styles.select}
//             value={selectedFrequency}
//             onChange={(e) => { setSelectedFrequency(e.target.value); setVisibleCount(15); }}
//           >
//             <option value="All">All Frequency</option>
//             <option value="Yearly">Yearly</option>
//             <option value="Half-Yearly">Half-Yearly</option>
//             <option value="Quarterly">Quarterly</option>
//             <option value="Monthly">Monthly</option>
//           </select>
//         </div>
//         <span className={styles.resultCount}>
//           {filteredData.length} result{filteredData.length !== 1 ? "s" : ""}
//         </span>
//       </div>

//       {/* ── Table card ── */}
//       <div className={styles.tableCard}>

//         {/* Table top bar */}
//         <div className={styles.tableTopBar}>
//           <div className={styles.tableTopLeft}>
//             <div className={styles.tableDot} />
//             <span className={styles.tableTopTitle}>All Opportunities</span>
//             <span className={styles.tableTopCount}>{filteredData.length} records</span>
//           </div>
//         </div>

//         {/* Dark gradient header */}
//         <div className={styles.tableHeader}>
//           <div className={styles.thCell} />
//           <div className={styles.thCell}>Account Name</div>
//           <div className={styles.thCell}>Customer PIC</div>
//           <div className={styles.thCell}>Vertical</div>
//           <div className={styles.thCell}>Rank</div>
//           <div className={styles.thCell}>Exp CL Date</div>
//           <div className={styles.thCell}>Last Update</div>
//           <div className={styles.thCell}>Holder</div>
//           <div className={styles.thCell} />
//         </div>

//         {/* Loading skeleton */}
//         {loading && (
//           <div className={styles.stateBox}>
//             {[1, 2, 3, 4, 5].map((i) => (
//               <div key={i} className={styles.skeletonRow}>
//                 {[1, 2, 3, 4, 5, 6, 7].map((j) => (
//                   <div
//                     key={j}
//                     className={styles.skeletonCell}
//                     style={{ animationDelay: `${j * 80}ms` }}
//                   />
//                 ))}
//               </div>
//             ))}
//           </div>
//         )}

//         {/* Error */}
//         {error && !loading && (
//           <div className={styles.stateBox}>
//             <div className={styles.emptyState}>
//               <div className={styles.emptyIconWrap} style={{ background: "#FEE2E2" }}>
//                 <svg width="24" height="24" viewBox="0 0 24 24"
//                      fill="none" stroke="#DC2626" strokeWidth="2">
//                   <circle cx="12" cy="12" r="10" />
//                   <line x1="12" y1="8"    x2="12"    y2="12" />
//                   <line x1="12" y1="16"   x2="12.01" y2="16" />
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
//               <div className={styles.emptyIconWrap} style={{ background: "#F1F5F9" }}>
//                 <svg width="24" height="24" viewBox="0 0 48 48" fill="none">
//                   <rect x="8" y="12" width="32" height="28" rx="3"
//                         stroke="#94A3B8" strokeWidth="2.5" />
//                   <path d="M16 12V10a2 2 0 012-2h12a2 2 0 012 2v2"
//                         stroke="#94A3B8" strokeWidth="2.5" />
//                   <path d="M17 22h14M17 28h10"
//                         stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" />
//                 </svg>
//               </div>
//               <p className={styles.emptyTitle}>No opportunities found</p>
//               <p className={styles.emptyText}>Try adjusting your filters or search query.</p>
//             </div>
//           </div>
//         )}

//         {/* ── Rows ── */}
//         {!loading &&
//           !error &&
//           visibleData.map((row: any, idx: number) => {
//             const rank   = row.opportunity_stages?.[0]?.ranks;
//             const rStyle = rankStyle[rank] ?? {
//               bg: "#F1F5F9", color: "#475569", border: "#E2E8F0",
//             };
//             const displayName = resolveAccountName(row.account_name, accountMap);
//             const isExpanded  = expandedRows.has(row.id);

//             return (
//               <div
//                 key={row.id}
//                 className={styles.rowGroup}
//                 style={{ animationDelay: `${Math.min(idx, 10) * 35}ms` }}
//               >
//                 {/* Main row */}
//                 <div
//                   className={`${styles.tableRow} ${isExpanded ? styles.rowExpanded : ""}`}
//                 >
//                   <button
//                     className={styles.chevronBtn}
//                     onClick={() => toggleRow(row.id)}
//                     aria-label="Expand row"
//                   >
//                     <IoIosArrowDropdown
//                       size={20}
//                       className={`${styles.chevron} ${isExpanded ? styles.chevronOpen : ""}`}
//                     />
//                   </button>

//                   <div className={styles.tdCell}>
//                     <span className={styles.accountName}>{displayName}</span>
//                   </div>

//                   <div className={styles.tdCell}>
//                     <span className={styles.picBadge}>{row.pic || "—"}</span>
//                   </div>

//                   <div className={styles.tdCell}>
//                     {row.vertical ? (
//                       <span className={styles.verticalTag}>{row.vertical}</span>
//                     ) : (
//                       <span className={styles.empty}>—</span>
//                     )}
//                   </div>

//                   <div className={styles.tdCell}>
//                     {rank ? (
//                       <span
//                         className={styles.rankBadge}
//                         style={{
//                           background:  rStyle.bg,
//                           color:       rStyle.color,
//                           borderColor: rStyle.border,
//                         }}
//                       >
//                         {rank}
//                       </span>
//                     ) : (
//                       <span className={styles.empty}>—</span>
//                     )}
//                   </div>

//                   <div className={styles.tdCell}>
//                     <span className={styles.dateCell}>{row.exp_closure_date || "—"}</span>
//                   </div>

//                   <div className={styles.tdCell}>
//                     <span className={styles.dateCell}>{row.last_update || "—"}</span>
//                   </div>

//                   <div className={styles.tdCell}>
//                     <span className={styles.holderBadge}>{row.user || "—"}</span>
//                   </div>

//                   <button
//                     className={styles.editBtn}
//                     onClick={() => handleEdit(row.id)}
//                     aria-label="Edit opportunity"
//                   >
//                     <FaRegEdit size={14} />
//                   </button>
//                 </div>

//                 {/* Expanded detail panel */}
//                 {isExpanded && (
//                   <div className={styles.detailPanel}>
//                     <div className={styles.detailPanelInner}>
//                       <div className={styles.detailHeader}>
//                         <div className={styles.detailTitleWrap}>
//                           <div className={styles.detailAvatar}>
//                             {(displayName || "O")[0].toUpperCase()}
//                           </div>
//                           <div>
//                             <div className={styles.detailTitle}>{displayName}</div>
//                             <div className={styles.detailTitleSub}>Opportunity Details</div>
//                           </div>
//                         </div>
//                         <div className={styles.detailHeaderRight}>
//                           {rank && (
//                             <span
//                               className={styles.detailRankBadge}
//                               style={{
//                                 background:  rStyle.bg,
//                                 color:       rStyle.color,
//                                 borderColor: rStyle.border,
//                               }}
//                             >
//                               {rank}
//                             </span>
//                           )}
//                           {row.status && (
//                             <span
//                               className={
//                                 row.status.toLowerCase() === "won"
//                                   ? styles.statusWon
//                                   : row.status.toLowerCase() === "lost"
//                                   ? styles.statusLost
//                                   : styles.statusPending
//                               }
//                             >
//                               {row.status}
//                             </span>
//                           )}
//                         </div>
//                       </div>

//                       <div className={styles.detailGrid}>
//                         {[
//                           { label: "Opportunity",    value: row.opportunity,             icon: "🎯" },
//                           { label: "Make",           value: row.make,                    icon: "🏭" },
//                           { label: "Sub Make",       value: row.sub_make,                icon: "🔩" },
//                           { label: "Sub Make Brand", value: row.sub_make_brand,          icon: "🏷️" },
//                           { label: "Exp PO Date",    value: row.exp_po_date,             icon: "📅" },
//                           { label: "Acct Created",   value: row.acct_created_date,       icon: "🗓️" },
//                           { label: "Quantity",       value: row.qty,                     icon: "📦" },
//                           { label: "Value",          value: fmtAmount(row.values),       icon: "💰" },
//                           { label: "Total Amount",   value: fmtAmount(row.total_amount), icon: "💵" },
//                           { label: "Remarks",        value: row.remarks,                 icon: "📝" },
//                           { label: "State",          value: row.state,                   icon: "📍" },
//                           { label: "City",           value: row.city,                    icon: "🏙️" },
//                           { label: "Address",        value: row.address,                 icon: "📮" },
//                           { label: "Contact Person", value: row.contact_person,          icon: "👤" },
//                           { label: "Mobile",         value: row.mobile_number,           icon: "📱" },
//                         ].map(({ label, value, icon }) => (
//                           <div key={label} className={styles.detailItem}>
//                             <span className={styles.detailLabel}>
//                               <span className={styles.detailIcon}>{icon}</span>
//                               {label}
//                             </span>
//                             <span className={styles.detailValue}>{value || "—"}</span>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             );
//           })}

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

// export default OpportunityWorkspaceTable;

// import React, { useEffect, useState, useRef, useCallback } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import type { RootState, AppDispatch } from "../../app/store";
// import { IoIosArrowDropdown } from "react-icons/io";
// import { FaRegEdit } from "react-icons/fa";
// import { MdOutlineSearch, MdOutlineDelete } from "react-icons/md";
// import { useNavigate } from "react-router-dom";
// import { fetchOpportunityWorkspaceTableData } from "./Slice/OpportunityWorkspaceTableSlice";
// import styles from "./OpportunityWorkspaceTable.module.css";

// /* ── Filter Options ── */
// const RANKS = ["All Ranks", "Rank A", "Rank B", "Rank C", "Rank D", "Rank E"];
// const FREQUENCIES = ["All Frequency", "Monthly", "Quarterly", "Half-Yearly", "Yearly"];
// const TIME_PERIODS = [
//   { label: "All Time", value: "all" },
//   { label: "This FY", value: "this_fy" },
//   { label: "Last 7 Days", value: "7days" },
//   { label: "Last 15 Days", value: "15days" },
//   { label: "This Month", value: "this_month" },
//   { label: "Last 3 Months", value: "3months" },
//   { label: "Q1 (Apr–Jun)", value: "q1" },
//   { label: "Q2 (Jul–Sep)", value: "q2" },
//   { label: "Q3 (Oct–Dec)", value: "q3" },
//   { label: "Q4 (Jan–Mar)", value: "q4" },
// ];

// /* ── Date Filter Helper (Indian FY: April to March) ── */
// const isInTimePeriod = (dateString: string, period: string): boolean => {
//   if (!dateString || period === "all") return true;
//   const today = new Date();
//   const checkDate = new Date(dateString);
//   today.setHours(0, 0, 0, 0);
//   checkDate.setHours(0, 0, 0, 0);

//   const diffDays = Math.floor((today.getTime() - checkDate.getTime()) / (1000 * 60 * 60 * 24));
//   const currentMonth = today.getMonth();
//   const currentYear = today.getFullYear();
//   const fyYear = currentMonth >= 3 ? currentYear : currentYear - 1;

//   switch (period) {
//     case "this_fy": return checkDate >= new Date(fyYear, 3, 1) && checkDate <= new Date(fyYear + 1, 2, 31);
//     case "7days": return diffDays >= 0 && diffDays <= 7;
//     case "15days": return diffDays >= 0 && diffDays <= 15;
//     case "this_month": return checkDate.getMonth() === currentMonth && checkDate.getFullYear() === currentYear;
//     case "3months": {
//       const threeMonthsAgo = new Date(today);
//       threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
//       return checkDate >= threeMonthsAgo && checkDate <= today;
//     }
//     case "q1": return checkDate >= new Date(fyYear, 3, 1) && checkDate <= new Date(fyYear, 5, 30);
//     case "q2": return checkDate >= new Date(fyYear, 6, 1) && checkDate <= new Date(fyYear, 8, 30);
//     case "q3": return checkDate >= new Date(fyYear, 9, 1) && checkDate <= new Date(fyYear, 11, 31);
//     case "q4": return checkDate >= new Date(fyYear + 1, 0, 1) && checkDate <= new Date(fyYear + 1, 2, 31);
//     default: return true;
//   }
// };

// const fmtAmount = (v: number): string => {
//   if (!v || v === 0) return "₹0";
//   if (v >= 10000000) return `₹${(v / 10000000).toFixed(2)}Cr`;
//   if (v >= 100000) return `₹${(v / 100000).toFixed(2)}L`;
//   return `₹${v.toLocaleString("en-IN")}`;
// };

// const OpportunityWorkspaceTable: React.FC = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const navigate = useNavigate();

//   /* ── State ── */
//   const [searchQuery, setSearchQuery] = useState("");
//   const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
//   const [selectedRank, setSelectedRank] = useState("All Ranks");
//   const [selectedFreq, setSelectedFreq] = useState("All Frequency");
//   const [selectedTimePeriod, setSelectedTimePeriod] = useState("all");
//   const [visibleCount, setVisibleCount] = useState(15);

//   const { OpportunityData, loading, error } = useSelector(
//     (state: RootState) => state.OpportunityWorkspaceTableData
//   );

//   useEffect(() => {
//     dispatch(fetchOpportunityWorkspaceTableData() as any);
//   }, [dispatch]);

//   /* ── Filtering Logic ── */
//   const reversedData = [...(OpportunityData || [])].reverse();
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

//   /* ── KPI Values ── */
//   const totalOpps = filteredData.length;
//   const achievements = filteredData.filter(r => r.opportunity_stages?.[r.opportunity_stages.length - 1]?.ranks === "Rank A").length;
//   const rankBCount = filteredData.filter(r => r.opportunity_stages?.[r.opportunity_stages.length - 1]?.ranks === "Rank B").length;
//   const totalPipelineValue = filteredData.reduce((sum, r) => sum + (Number(r.total_amount) || 0), 0);

//   const toggleRow = (id: string) => {
//     setExpandedRows(prev => {
//       const next = new Set(prev);
//       if (next.has(id)) next.delete(id); else next.add(id);
//       return next;
//     });
//   };

//   /* ── Infinite Scroll ── */
//   const sentinelRef = useRef<HTMLDivElement>(null);
//   const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
//     if (entries[0].isIntersecting && visibleCount < filteredData.length)
//       setVisibleCount(c => c + 15);
//   }, [visibleCount, filteredData.length]);

//   useEffect(() => {
//     const observer = new IntersectionObserver(handleObserver, { threshold: 0.1 });
//     if (sentinelRef.current) observer.observe(sentinelRef.current);
//     return () => observer.disconnect();
//   }, [handleObserver]);

//   const visibleData = filteredData.slice(0, visibleCount);

//   return (
//     <div className={styles.page}>
//       {/* ── Page Header ── */}
//       <div className={styles.pageHeader}>
//         <div>
//           <h1 className={styles.pageTitle}>Opportunity Workspace</h1>
//           <p className={styles.pageSubtitle}>Track and manage your opportunity records</p>
//         </div>
//         <div className={styles.headerRight}>
//           <select 
//             className={styles.headerSelect} 
//             value={selectedTimePeriod} 
//             onChange={(e) => { setSelectedTimePeriod(e.target.value); setVisibleCount(15); }}
//           >
//             {TIME_PERIODS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
//           </select>
//           <div className={styles.searchBar}>
//             <MdOutlineSearch className={styles.searchIcon} />
//             <input 
//               className={styles.searchInput} 
//               placeholder="Search accounts..." 
//               value={searchQuery} 
//               onChange={e => { setSearchQuery(e.target.value); setVisibleCount(15); }} 
//             />
//           </div>
//         </div>
//       </div>

//       {/* ── KPI Row ── */}
//       <div className={styles.kpiRow}>
//         <div className={`${styles.kpiCard} ${styles.kpiIndigo}`}>
//           <div className={styles.kpiContent}><div className={styles.kpiValue}>{totalOpps}</div><div className={styles.kpiLabel}>Total Opportunities</div></div>
//           <div className={styles.kpiBgNumber}>{totalOpps}</div>
//         </div>
//         <div className={`${styles.kpiCard} ${styles.kpiEmerald}`}>
//           <div className={styles.kpiContent}><div className={styles.kpiValue}>{achievements}</div><div className={styles.kpiLabel}>Achievements</div></div>
//           <div className={styles.kpiBgNumber}>{achievements}</div>
//         </div>
//         <div className={`${styles.kpiCard} ${styles.kpiCyan}`}>
//           <div className={styles.kpiContent}><div className={styles.kpiValue}>{rankBCount}</div><div className={styles.kpiLabel}>Rank B</div></div>
//           <div className={styles.kpiBgNumber}>{rankBCount}</div>
//         </div>
//         <div className={`${styles.kpiCard} ${styles.kpiAmber}`}>
//           <div className={styles.kpiContent}><div className={styles.kpiValue}>{fmtAmount(totalPipelineValue)}</div><div className={styles.kpiLabel}>Total Pipeline</div></div>
//           <div className={styles.kpiBgNumber}>{fmtAmount(totalPipelineValue)}</div>
//         </div>
//       </div>

//       {/* ── Filter Strip ── */}
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

//       {/* ── Table Card ── */}
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
//         </div>

//         {visibleData.map((row: any) => (
//           <div key={row.id} className={styles.rowGroup}>
//             <div className={`${styles.tableRow} ${expandedRows.has(row.id) ? styles.rowExpanded : ""}`}>
//               <button className={styles.chevronBtn} onClick={() => toggleRow(row.id)}>
//                 <IoIosArrowDropdown size={20} className={`${styles.chevron} ${expandedRows.has(row.id) ? styles.chevronOpen : ""}`} />
//               </button>
//               <div className={styles.tdCell}><span className={styles.accountName}>{row.account_name}</span></div>
//               <div className={styles.tdCell}><span className={styles.picBadge}>{row.pic}</span></div>
//               <div className={styles.tdCell}>{row.vertical || "—"}</div>
//               <div className={styles.tdCell}>
//                  {row.opportunity_stages?.[row.opportunity_stages.length - 1]?.ranks ? (
//                   <span className={`${styles.rankBadge} ${styles[row.opportunity_stages[row.opportunity_stages.length - 1].ranks.replace(" ", "")]}`}>
//                     {row.opportunity_stages[row.opportunity_stages.length - 1].ranks}
//                   </span>
//                 ) : "—"}
//               </div>
//               <div className={styles.tdCell}><span className={styles.dateCell}>{row.exp_closure_date || "—"}</span></div>
//               <div className={styles.tdCell}><span className={styles.dateCell}>{row.last_update || "—"}</span></div>
//               <div className={styles.tdCell}><span className={styles.holderBadge}>{row.user}</span></div>
//               <button className={styles.editBtn} onClick={() => navigate(`/user/editopportunityspace/event/${row.id}`)}><FaRegEdit size={14} /></button>
//             </div>

//             {expandedRows.has(row.id) && (
//               <div className={styles.detailPanel}>
//                 <div className={styles.detailPanelInner}>
//                   <div className={styles.detailGrid}>
//                     {[
//                       { label: "Opportunity", value: row.opportunity, icon: "🎯" },
//                       { label: "Value", value: fmtAmount(row.values), icon: "💰" },
//                       { label: "Exp PO Date", value: row.exp_po_date, icon: "📋" },
//                       { label: "Quantity", value: row.qty, icon: "📦" },
//                       { label: "Address", value: row.address, icon: "📍" },
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

// export default OpportunityWorkspaceTable;




import React, { useEffect, useState, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../app/store";
import { IoIosArrowDropdown } from "react-icons/io";
import { FaRegEdit } from "react-icons/fa";
import { MdOutlineSearch } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { fetchOpportunityWorkspaceTableData } from "./Slice/OpportunityWorkspaceTableSlice";

/* ── Filter Options ── */
const RANKS = ["All Ranks", "Rank A", "Rank B", "Rank C", "Rank D", "Rank E"];
const FREQUENCIES = ["All Frequency", "Monthly", "Quarterly", "Half-Yearly", "Yearly"];
const TIME_PERIODS = [
  { label: "All Time", value: "all" },
  { label: "This FY", value: "this_fy" },
  { label: "Last 7 Days", value: "7days" },
  { label: "Last 15 Days", value: "15days" },
  { label: "This Month", value: "this_month" },
  { label: "Last 3 Months", value: "3months" },
  { label: "Q1 (Apr–Jun)", value: "q1" },
  { label: "Q2 (Jul–Sep)", value: "q2" },
  { label: "Q3 (Oct–Dec)", value: "q3" },
  { label: "Q4 (Jan–Mar)", value: "q4" },
];

/* ── Date Filter Helper (Indian FY: April to March) ── */
const isInTimePeriod = (dateString: string, period: string): boolean => {
  if (!dateString || period === "all") return true;
  const today = new Date();
  const checkDate = new Date(dateString);
  today.setHours(0, 0, 0, 0);
  checkDate.setHours(0, 0, 0, 0);

  const diffDays = Math.floor((today.getTime() - checkDate.getTime()) / (1000 * 60 * 60 * 24));
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const fyYear = currentMonth >= 3 ? currentYear : currentYear - 1;

  switch (period) {
    case "this_fy": return checkDate >= new Date(fyYear, 3, 1) && checkDate <= new Date(fyYear + 1, 2, 31);
    case "7days": return diffDays >= 0 && diffDays <= 7;
    case "15days": return diffDays >= 0 && diffDays <= 15;
    case "this_month": return checkDate.getMonth() === currentMonth && checkDate.getFullYear() === currentYear;
    case "3months": {
      const threeMonthsAgo = new Date(today);
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
      return checkDate >= threeMonthsAgo && checkDate <= today;
    }
    case "q1": return checkDate >= new Date(fyYear, 3, 1) && checkDate <= new Date(fyYear, 5, 30);
    case "q2": return checkDate >= new Date(fyYear, 6, 1) && checkDate <= new Date(fyYear, 8, 30);
    case "q3": return checkDate >= new Date(fyYear, 9, 1) && checkDate <= new Date(fyYear, 11, 31);
    case "q4": return checkDate >= new Date(fyYear + 1, 0, 1) && checkDate <= new Date(fyYear + 1, 2, 31);
    default: return true;
  }
};

const fmtAmount = (v: number): string => {
  if (!v || v === 0) return "₹0";
  if (v >= 10000000) return `₹${(v / 10000000).toFixed(2)}Cr`;
  if (v >= 100000) return `₹${(v / 100000).toFixed(2)}L`;
  return `₹${v.toLocaleString("en-IN")}`;
};

/* ── Style helpers ── */
const filterSelectClass =
  "h-10 px-4 pr-9 bg-white border-2 border-slate-200 rounded-xl text-sm font-semibold text-slate-600 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 transition-all cursor-pointer shadow-sm appearance-none";

const GRID_COLS = "40px 1.8fr 1fr 1.2fr 1fr 1.1fr 1.2fr 1.1fr 48px";
const GRID_COLS_SKELETON = "40px 1.8fr 1fr 1.2fr 1fr 1.1fr 1.2fr 1.1fr";

/* ── Rank badge styles ── */
const rankBadgeStyle = (rank: string): string => {
  switch (rank) {
    case "Rank A": return "bg-emerald-50 text-emerald-700 border border-emerald-200";
    case "Rank B": return "bg-cyan-50 text-cyan-700 border border-cyan-200";
    case "Rank C": return "bg-violet-50 text-violet-700 border border-violet-200";
    case "Rank D": return "bg-rose-50 text-rose-700 border border-rose-200";
    case "Rank E": return "bg-orange-50 text-orange-700 border border-orange-200";
    default: return "bg-slate-100 text-slate-500 border border-slate-200";
  }
};

const OpportunityWorkspaceTable: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  /* ── State ── */
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [selectedRank, setSelectedRank] = useState("All Ranks");
  const [selectedFreq, setSelectedFreq] = useState("All Frequency");
  const [selectedTimePeriod, setSelectedTimePeriod] = useState("all");
  const [visibleCount, setVisibleCount] = useState(15);

  const { OpportunityData, loading, error } = useSelector(
    (state: RootState) => state.OpportunityWorkspaceTableData
  );

  useEffect(() => {
    dispatch(fetchOpportunityWorkspaceTableData() as any);
  }, [dispatch]);

  /* ── Filtering Logic ── */
  const reversedData = [...(OpportunityData || [])].reverse();
  const filteredData = reversedData.filter((row: any) => {
    const matchesSearch = row.account_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         row.user?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const latestRank = row.opportunity_stages?.[row.opportunity_stages.length - 1]?.ranks;
    const matchesRank = selectedRank === "All Ranks" || latestRank === selectedRank;
    
    const matchesTime = isInTimePeriod(row.last_update || row.acct_created_date, selectedTimePeriod);
    
    let matchesFreq = true;
    if (selectedFreq !== "All Frequency" && row.exp_closure_date) {
        const today = new Date();
        const expDate = new Date(row.exp_closure_date);
        const diffMonths = (today.getFullYear() - expDate.getFullYear()) * 12 + (today.getMonth() - expDate.getMonth());
        if (selectedFreq === "Monthly") matchesFreq = diffMonths === 0;
        else if (selectedFreq === "Quarterly") matchesFreq = diffMonths >= 0 && diffMonths < 3;
        else if (selectedFreq === "Half-Yearly") matchesFreq = diffMonths >= 0 && diffMonths < 6;
        else if (selectedFreq === "Yearly") matchesFreq = diffMonths >= 0 && diffMonths < 12;
    }

    return matchesSearch && matchesRank && matchesTime && matchesFreq;
  });

  /* ── KPI Values ── */
  const totalOpps = filteredData.length;
  const achievements = filteredData.filter(r => r.opportunity_stages?.[r.opportunity_stages.length - 1]?.ranks === "Rank A").length;
  const rankBCount = filteredData.filter(r => r.opportunity_stages?.[r.opportunity_stages.length - 1]?.ranks === "Rank B").length;
  const totalPipelineValue = filteredData.reduce((sum, r) => sum + (Number(r.total_amount) || 0), 0);

  const toggleRow = (id: string) => {
    setExpandedRows(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  /* ── Infinite Scroll ── */
  const sentinelRef = useRef<HTMLDivElement>(null);
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

  const kpiCards = [
    { label: "Total Opportunities", value: totalOpps,                   gradient: "from-indigo-600 to-indigo-500" },
    { label: "Achievements",        value: achievements,                 gradient: "from-emerald-600 to-emerald-400" },
    { label: "Rank B",              value: rankBCount,                   gradient: "from-cyan-600 to-cyan-400" },
    { label: "Total Pipeline",      value: fmtAmount(totalPipelineValue), gradient: "from-amber-500 to-yellow-400" },
  ];

  return (
    <div className="w-full min-h-full bg-slate-100 p-7 pb-28 flex flex-col gap-6 overflow-y-auto overflow-x-hidden">

      {/* ── Page Header ── */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-[22px] font-bold text-violet-700 m-0 tracking-tight leading-tight">
            Opportunity Workspace
          </h1>
          <p className="text-[13px] text-violet-400 mt-1 m-0 font-normal">
            Track and manage your opportunity records
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <select
            className={filterSelectClass}
            value={selectedTimePeriod}
            onChange={(e) => { setSelectedTimePeriod(e.target.value); setVisibleCount(15); }}
          >
            {TIME_PERIODS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>

          <div className="flex items-center gap-2 bg-white border-2 border-slate-200 rounded-xl px-4 h-10 w-72 shadow-sm focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-400/20 transition-all">
            <MdOutlineSearch className="text-slate-400 text-lg shrink-0" />
            <input
              className="border-none outline-none bg-transparent text-sm text-slate-800 w-full placeholder:text-slate-300"
              placeholder="Search accounts..."
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setVisibleCount(15); }}
            />
          </div>
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

      {/* ── Filter Strip ── */}
      <div className="bg-white border border-slate-200 rounded-2xl px-5 py-3 flex items-center justify-between shadow-sm">
        <div className="flex gap-3">
          <select className={filterSelectClass} value={selectedRank} onChange={e => setSelectedRank(e.target.value)}>
            {RANKS.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
          <select className={filterSelectClass} value={selectedFreq} onChange={e => setSelectedFreq(e.target.value)}>
            {FREQUENCIES.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>
        <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
          {filteredData.length} results
        </span>
      </div>

      {/* ── Table Card ── */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-md">

        {/* Table top bar */}
        <div className="flex items-center gap-2 px-5 pt-4 pb-2">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-[0_0_0_3px_rgba(99,102,241,0.2)] animate-pulse" />
          <span className="text-sm font-bold text-slate-800">All Opportunities</span>
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
          <span>Customer PIC</span>
          <span>Vertical</span>
          <span>Rank</span>
          <span>Exp Cl Date</span>
          <span>Last Update</span>
          <span>Holder</span>
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
              <p className="text-xs text-slate-400 m-0">{error}</p>
            </div>
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
            <p className="text-sm font-bold text-slate-600 m-0">No opportunities found</p>
            <p className="text-xs text-slate-400 m-0">Try adjusting your search or filters.</p>
          </div>
        )}

        {/* Data Rows */}
        {!loading && !error && visibleData.map((row: any) => {
          const latestRank = row.opportunity_stages?.[row.opportunity_stages.length - 1]?.ranks;
          return (
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
                  <span className="inline-flex items-center px-2.5 py-0.5 bg-gradient-to-r from-indigo-50 to-violet-50 text-indigo-600 rounded-full text-[11px] font-bold border border-indigo-200 whitespace-nowrap max-w-full overflow-hidden text-ellipsis">
                    {row.pic}
                  </span>
                </div>

                <div className="text-sm text-slate-500 truncate">{row.vertical || "—"}</div>

                <div>
                  {latestRank ? (
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-bold ${rankBadgeStyle(latestRank)}`}>
                      {latestRank}
                    </span>
                  ) : (
                    <span className="text-sm text-slate-400">—</span>
                  )}
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
                  onClick={() => navigate(`/user/editopportunityspace/event/${row.id}`)}
                >
                  <FaRegEdit size={14} />
                </button>
              </div>

              {/* Expanded Detail Panel */}
              {expandedRows.has(row.id) && (
                <div className="bg-gradient-to-br from-slate-50 to-indigo-50/40 border-t border-slate-200 w-full">
                  <div className="px-14 py-5 pb-8">
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                      {[
                        { label: "Opportunity", value: row.opportunity, icon: "🎯" },
                        { label: "Value",        value: fmtAmount(row.values), icon: "💰" },
                        { label: "Exp PO Date",  value: row.exp_po_date,      icon: "📋" },
                        { label: "Quantity",     value: row.qty,              icon: "📦" },
                        { label: "Address",      value: row.address,          icon: "📍" },
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
          );
        })}

        {/* Sentinel — infinite scroll trigger */}
        <div ref={sentinelRef} className="h-px w-full" />
      </div>
    </div>
  );
};

export default OpportunityWorkspaceTable;