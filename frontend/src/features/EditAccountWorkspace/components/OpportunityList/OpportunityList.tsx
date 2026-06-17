// import React, { useEffect, useState } from "react";
// import styles from "./OpportunityList.module.css";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchOpportunityList } from "./slice/OpportunityList";
// import type { RootState } from "../../../../app/store";

// interface Props {
//   account_name: string; // Define the prop for account_name
// }

// const ListOfOpportunities: React.FC<Props> = ({ account_name }) => {
//   const dispatch = useDispatch();
//   const [searchQuery, setSearchQuery] = useState(""); // State to hold the search input
//   const listdata = useSelector((state: RootState) => state.fetchOpportunityListData.data);

//   useEffect(() => {
//     if (account_name) {
//       // Dispatch the action with account_name
//       dispatch(fetchOpportunityList(account_name) as any);
//     }
//   }, [account_name, dispatch]);

//   // Filtered data based on the search query
//   const filteredData = listdata.filter((item) =>
//     item.pic.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   return (
//     <div className={styles.opportunityListContainer}>
//       {/* Header Section */}
//       <div className={styles.header}>
//         <div className={styles.title}>List of Opportunities</div>
//         <input
//           type="text"
//           placeholder="Search by PIC"
//           className={styles.searchBar}
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)} // Update search query
//         />
//       </div>

//       {/* Separator Line */}
//       <hr className={styles.separator} />

//       {/* Table Section */}
//       <div className={styles.tableContainer}>
//         <table className={styles.table}>
//           <thead style={{ borderRadius: "10px" }}>
//             <tr style={{ borderRadius: "10px" }}>
//               <th>Opportunity</th>
//               <th>Stage</th>
//               <th>PIC</th>
//               <th>Exp. Closure Date</th>
//               <th>Exp. PO Date</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredData.length > 0 ? (
//               filteredData.map((item, index) => (
//                 <tr key={index}>
//                   <td>{item.opportunity}</td>
//                   <td>{item.stage}</td>
//                   <td>{item.pic}</td>
//                   <td>{item.exp_closure_date}</td>
//                   <td>{item.exp_po_date}</td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan={5} style={{ textAlign: "center" }}>
//                   No matching results found.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default ListOfOpportunities;







import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOpportunityList } from "./slice/OpportunityList";
import type { RootState } from "../../../../app/store";
import { ListChecks } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Props {
  account_name: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

const ListOfOpportunities: React.FC<Props> = ({ account_name }) => {
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("");

  const listdata = useSelector(
    (state: RootState) => state.fetchOpportunityListData.data
  );

  useEffect(() => {
    if (account_name) {
      dispatch(fetchOpportunityList(account_name) as any);
    }
  }, [account_name, dispatch]);

  // Filtered data based on the search query
  const filteredData = listdata.filter((item) =>
    item.pic.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="rounded-2xl border-2 border-indigo-100 shadow-lg overflow-hidden h-full flex flex-col">

      {/* Gradient Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-500 px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center">
            <ListChecks size={15} color="white" />
          </div>
          <h2 className="text-sm font-bold text-white tracking-wide">List of Opportunities</h2>
        </div>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search by PIC"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-3 py-1.5 text-xs rounded-lg border-0 bg-white/20 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all duration-200 w-44"
        />
      </div>

      {/* Table — grows to fill remaining height, scrolls if rows overflow */}
      <div className="bg-white px-5 py-4 flex-1 overflow-y-auto min-h-0">
        <table className="w-full text-sm border-collapse min-w-[500px]">
          <thead>
            <tr className="border-b-2 border-indigo-100">
              <th className="text-left px-3 py-2.5 text-xs font-bold text-indigo-400 uppercase tracking-wide">Opportunity</th>
              <th className="text-left px-3 py-2.5 text-xs font-bold text-indigo-400 uppercase tracking-wide">Stage</th>
              <th className="text-left px-3 py-2.5 text-xs font-bold text-indigo-400 uppercase tracking-wide">PIC</th>
              <th className="text-left px-3 py-2.5 text-xs font-bold text-indigo-400 uppercase tracking-wide">Exp. Closure Date</th>
              <th className="text-left px-3 py-2.5 text-xs font-bold text-indigo-400 uppercase tracking-wide">Exp. PO Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                <tr
                  key={index}
                  className="border-b border-slate-100 hover:bg-indigo-50/40 transition-colors duration-150"
                >
                  <td className="px-3 py-2.5 text-sm font-medium text-slate-700">{item.opportunity}</td>
                  <td className="px-3 py-2.5 text-sm font-medium text-slate-700">{item.stage}</td>
                  <td className="px-3 py-2.5 text-sm font-medium text-slate-700">{item.pic}</td>
                  <td className="px-3 py-2.5 text-sm font-medium text-slate-700">{item.exp_closure_date}</td>
                  <td className="px-3 py-2.5 text-sm font-medium text-slate-700">{item.exp_po_date}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-3 py-8 text-center text-sm text-slate-400 font-medium">
                  No matching results found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default ListOfOpportunities;
