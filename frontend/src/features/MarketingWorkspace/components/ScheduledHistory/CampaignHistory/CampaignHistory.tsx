import React from 'react';
import styles from './CampaignHistory.module.css';
import { IoIosArrowRoundForward } from "react-icons/io";
const CampaignHistory: React.FC = () => {
  return (
    <div className={styles.container}>
      
     

      {/* Main Content Div */}
      <div className={styles.historyDiv}>
        {/* Inner Div */}
        <div className={styles.innerDiv}>
          <p className={styles.innerText}>WMS Campaign</p>
        </div>

        {/* Div with Text and Button */}
        <div className={styles.actionDiv}>
          <span className={styles.actionText}>Contact Range : 10 - 200</span>
          <button className={styles.actionButton}>See Analytics<IoIosArrowRoundForward size={20} /></button>
        </div>
        <div className={styles.actionDiv}>
          <span className={styles.actionText}>Region : North</span>
         
        </div>
        <div className={styles.actionDiv}>
          <span className={styles.actionText}>Scheduled Date & Time : Dec, 28, 2024, 4:35 p.m </span>
          <span>Status : <button className={styles.statusButton}>Done</button></span>
        </div>
      </div><div className={styles.historyDiv}>
        {/* Inner Div */}
        <div className={styles.innerDiv}>
          <p className={styles.innerText}>WMS Campaign</p>
        </div>

        {/* Div with Text and Button */}
        <div className={styles.actionDiv}>
          <span className={styles.actionText}>Contact Range : 10 - 200</span>
          <button className={styles.actionButton}>See Analytics<IoIosArrowRoundForward size={20} /></button>
        </div>
        <div className={styles.actionDiv}>
          <span className={styles.actionText}>Region : North</span>
         
        </div>
        <div className={styles.actionDiv}>
          <span className={styles.actionText}>Scheduled Date & Time : Dec, 28, 2024, 4:35 p.m </span>
          <span>Status : <button className={styles.statusButton}>Done</button></span>
        </div>
      </div><div className={styles.historyDiv}>
        {/* Inner Div */}
        <div className={styles.innerDiv}>
          <p className={styles.innerText}>WMS Campaign</p>
        </div>

        {/* Div with Text and Button */}
        <div className={styles.actionDiv}>
          <span className={styles.actionText}>Contact Range : 10 - 200</span>
          <button className={styles.actionButton}>See Analytics<IoIosArrowRoundForward size={20} /></button>
        </div>
        <div className={styles.actionDiv}>
          <span className={styles.actionText}>Region : North</span>
         
        </div>
        <div className={styles.actionDiv}>
          <span className={styles.actionText}>Scheduled Date & Time : Dec, 28, 2024, 4:35 p.m </span>
          <span>Status : <button className={styles.statusButton}>Done</button></span>
        </div>
      </div>
    </div>
  );
};

export default CampaignHistory;
