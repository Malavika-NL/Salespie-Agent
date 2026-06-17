import React from 'react';
import styles from './customer.module.css';
import { IoMdWifi } from "react-icons/io";
const Customer: React.FC<{}> = ({ }) => {

  return (
    <div className={styles.customer}>
     
     <IoMdWifi className={styles.icon} />
      
        <div className={styles.h2}>Customer Response</div>
        <p className={styles.total}>100/1300</p>
        <div className={styles.increase}>
          <span className={styles.arrow}>↑</span>
          <span>5% increase from last month</span>
        </div>
      </div>
   
  );
};

export default Customer;
