import React from 'react';
import styles from './contact.module.css';
import { RiContactsFill } from "react-icons/ri";
const Contact: React.FC<{}> = ({ }) => {

  return (
    <div className={styles.contact}>
        <RiContactsFill  className={styles.icon} />
        <div className={styles.h2}>Total Contact</div>
        <p className={styles.total}>320000</p>
        <div className={styles.increase}>
          <span className={styles.arrow}>↑</span>
          <span>6% increase from last month</span>
        </div>
      </div>
   
  );
};

export default Contact;
