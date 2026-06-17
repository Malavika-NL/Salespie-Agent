import React from "react";
import type { IoPersonAdd } from "react-icons/io5";
import { IoMdExpand } from "react-icons/io";
import styles from "./CustomerList.module.css";
import { IoAddCircle } from "react-icons/io5";
const CustomerList: React.FC = () => {
  // Sample data to display in the table
  const data = [
    { customer: "Hero Motocorp", target: "Call after 2 months", status: "New Contact", actions: "Pending" },
    { customer: "Honda", target: "Demo", status: "Existing Customer", actions: "On going" },
    { customer: "TVS", target: "Introduction Meeting", status: "New Customer", actions: "Pending" },
    { customer: "Royal Enfield", target: "Implementation", status: "Existing Customer", actions: "On Time" },
    { customer: "Maruti", target: "$Demo", status: "New Customer", actions: "On going" },
  
  ];

  return (
    <div className={styles.container}>
      <div className={styles.headerContainer}>
        <div className={styles.lefthead}>Customer Prompt List</div>
        <div className={styles.righthead}>
         
          <div className={styles.targetDiv}>
            <IoAddCircle className={styles.personicon} />
            Add Prompt List
          </div>
          <IoMdExpand className={styles.icon} />
        </div>
      </div>
      <div className={styles.mainContainer}>
        {/* Render headers */}
       
        <div className={styles.headerrow}>
          <div className={styles.cellHeader}>Company Name</div>
          <div className={styles.cellHeader}>Next Action</div>
          <div className={styles.cellHeader}>Customer Status</div>
          <div className={styles.cellHeader}>Comment</div>
        </div>

        {/* Map over data to render rows */}
      
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
  );
};

export default CustomerList;
