import React from 'react';
import styles from './mainContent.module.css'; // Assuming you have a CSS module named Sidebar.module.css
import { FaHome, FaUser, FaCog, FaSignOutAlt } from 'react-icons/fa';

const MainContent = () => {
  return (
    <div className={styles.sidebar}>
      {/* Logo */}
      <div className={styles.logo}>Logo</div>

      {/* Navigation Links */}
      <nav className={styles.navLinks}>
        <div className={styles.navItem}>
          <FaHome className={styles.icon} />
          <span>Home</span>
        </div>
        <div className={styles.navItem}>
          <FaUser className={styles.icon} />
          <span>Profile</span>
        </div>
        <div className={styles.navItem}>
          <FaCog className={styles.icon} />
          <span>Settings</span>
        </div>
      </nav>

      {/* Bottom Section */}
      <div className={styles.bottomSection}>
        <div className={styles.navItem}>
          <FaSignOutAlt className={styles.icon} />
          <span>Logout</span>
        </div>
      </div>
    </div>
  );
};

export default MainContent;
