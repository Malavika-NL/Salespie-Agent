import React, { useEffect } from "react";
import styles from "./OpportunityList.module.css";
import { useDispatch } from "react-redux";
import { fetchOpportunityList } from "./slice/OpportunityList";

// Sample data for opportunities
const opportunities = [
    { opportunity: "Printer", stage: "Rank A", pic: "Albin", expClosureDate: "15/05/2024", expPODate: "25/05/2025" },
    { opportunity: "Scanner", stage: "Rank A", pic: "Joel", expClosureDate: "18/05/2025", expPODate: "26/06/2025" },
    { opportunity: "Automation", stage: "Rank A", pic: "Edwin", expClosureDate: "19/05/2025", expPODate: "27/06/2025" },
    { opportunity: "Software", stage: "Rank A", pic: "Abhijith", expClosureDate: "20/05/2025", expPODate: "28/06/2025" },
    { opportunity: "Scanner", stage: "Rank A", pic: "Edwin", expClosureDate: "20/05/2025", expPODate: "28/06/2025" },
    { opportunity: "Automation", stage: "Rank A", pic: "Joel", expClosureDate: "20/05/2025", expPODate: "28/06/2025" },
  ];
const ListOfOpportunities = () => {
  const dispatch = useDispatch();
  // useEffect(() => {
  //   const data = dispatch(fetchOpportunityList() as any);
  //   console.log(data)
  // }, [dispatch]);

  
  return (
    <div className={styles.opportunityListContainer}>
      {/* Header Section */}
      <div className={styles.header}>
        <div className={styles.title}>List of Opportunities</div>
        <input
          type="text"
          placeholder="Search"
          className={styles.searchBar}
        />
      </div>

      {/* Separator Line */}
      <hr className={styles.separator} />

      {/* Table Section */}
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead  style={{borderRadius:'10px'}}>
            <tr style={{borderRadius:'10px'}}>
              <th>Opportunity</th>
              <th>Stage</th>
              <th>PIC</th>
              <th>Exp. Closure Date</th>
              <th>Exp. PO Date</th>
            </tr>
          </thead>
          <tbody>
          {opportunities.map((item, index) => (
            <tr key={index}>
              <td>{item.opportunity}</td>
              <td>{item.stage}</td>
              <td>{item.pic}</td>
              <td>{item.expClosureDate}</td>
              <td>{item.expPODate}</td>
            </tr>
          ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListOfOpportunities;
