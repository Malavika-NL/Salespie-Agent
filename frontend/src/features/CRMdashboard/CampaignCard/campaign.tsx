import React from 'react';
import styles from './campaign.module.css';
import { AiOutlineMessage } from "react-icons/ai";

const Campaign: React.FC<{}> = ({ }) => {

  return (
    <div className={styles.campaign}>
    <AiOutlineMessage   className={styles.icon} />

     
        <div className={styles.h2}>Total Campaign Completed</div>
        <p className={styles.total}>1399/320000</p>
   
    </div>
  );
};

export default Campaign;
