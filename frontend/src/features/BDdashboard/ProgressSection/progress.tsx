// Progress.tsx
import React from 'react';
import styles from './progress.module.css'; // Import CSS module for styling
import peropleimg from '../../images/people.png'
import { TrendingUp, BarChart, Target } from "lucide-react";
const Progress: React.FC = () => {
    return (
        // <div className={styles.container}>
        //     <div className={styles.topcontent}>
        //        <p className={styles.text1} >Track your progress and uncover new opportunities for business expansion</p> 
        //        <p className={styles.text2}>Empower growth with real-time analytics</p>
        //        <div className={styles.circleContainer}>
        //             <div className={styles.circle}></div>
        //             <div className={styles.circle}></div>
        //         </div>
        //     </div>
        //     <div className={styles.bottomcontent}>
        //         <img src={peropleimg} alt='people ' />
        //     </div>
            
        // </div>
        <div className={styles.container}>
      
        <h1 className={styles.title}>
          Track Your Progress & Uncover New Opportunities
        </h1>
        <p className={styles.subtitle}>
          Empower growth with real-time analytics and actionable insights to drive business expansion.
        </p>
  
       
        <div className={styles.kpiContainer}>
          <div className={styles.kpiBox}>
            <TrendingUp size={24} />
            <span>Revenue Growth: 18%</span>
          </div>
          <div className={styles.kpiBox}>
            <BarChart size={24} />
            <span>New Leads: 230</span>
          </div>
          <div className={styles.kpiBox}>
            <Target size={24} />
            <span>Sales Goal: 75%</span>
          </div>
        </div>
  
      
        <button className={styles.ctaButton}>View Insights</button>
      </div>
    );
};

export default Progress;
