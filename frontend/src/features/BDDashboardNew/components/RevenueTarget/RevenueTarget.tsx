import React from "react";
import { IoPersonAdd } from "react-icons/io5";
import { IoMdExpand } from "react-icons/io";
import styles from "./RevenueTarget.module.css";

const RevenueTarget: React.FC = () => {
  // Sample data to display in the table
  const data = [
    { customer: "Hero Motorcorp", target: "500cr", status: "10", actions: "5000" },
    { customer: "Honda", target: "1000cr", status: "15", actions: "7500" },
    { customer: "TVS", target: "550cr", status: "12", actions: "7000" },
    { customer: "Royal Enfield", target: "1500cr", status: "18", actions: "10000" }, 
    { customer: "Maruti", target: "2500cr", status: "20", actions: "20000" },
   
  ];

  return (
    <div className={styles.container}>
      <div className={styles.headerContainer}>
        <div className={styles.lefthead}>Revenue Wise Targeting</div>
        <div className={styles.righthead}>
          <select className={styles.select}>
            <option value="range">Range</option>
          </select>
          <div className={styles.targetDiv}>
            <IoPersonAdd className={styles.personicon} />
            Add Customer
          </div>
          <IoMdExpand className={styles.icon} />
        </div>
      </div>
      <div className={styles.mainContainer}>
        {/* Render headers */}
       
        <div className={styles.headerrow}>
          <div className={styles.cellHeader}>Company Name</div>
          <div className={styles.cellHeader}>Turn Over</div>
          <div className={styles.cellHeader}>No. of Factories</div>
          <div className={styles.cellHeader}>No. of Empolyees</div>
        </div>

        {/* Map over data to render rows */}
        <div className={styles.rowContainer}>
        {data.map((item, index) => (
          <div key={index} className={styles.row}>
            <div className={styles.cell}>{item.customer}</div>
            <div className={styles.cell}>{item.target}</div>
            <div className={styles.cell}>{item.status}</div>
            <div className={styles.cell}>{item.actions}</div>
          </div>
        ))}
        </div>
      </div>
    </div>
  );
};

export default RevenueTarget;
