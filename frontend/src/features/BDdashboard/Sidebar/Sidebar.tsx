import React from 'react';
import styles from './sidebar.module.css'; // Assuming you're using CSS modules
import img1 from '../../images/img1.png'
import img2 from '../../images/img2.png'
import img3 from '../../images/img3.png'
import img4 from '../../images/img4.png'
const Sidebar: React.FC = () => {
  return (
    <div className={styles.sidebar}>
      <div className={styles.logo}>
          NL Technologies
        </div>
      <div className={styles.sidebarContent}>
        
        {/* Add your sidebar content like menu items here */}
        <div><img src={img1} alt='img1'  className={styles.img} /></div>
        <div><img src={img2} alt='img2'  className={styles.img}/></div>
        <div><img src={img3} alt='img3'  className={styles.img}/></div>
        <div><img src={img4} alt='img4'  className={styles.img}/></div>
      </div>
    </div>
  );
};

export default Sidebar;

