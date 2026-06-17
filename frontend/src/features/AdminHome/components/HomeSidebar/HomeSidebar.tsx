import React, { useState } from "react";
import styles from "./HomeSidebar.module.css";
import { FaHome, FaAppStore, FaClipboardList, FaChartBar, FaCog, FaInfoCircle } from "react-icons/fa";
import { FaWhatsapp, FaInstagram, FaFacebook, FaYoutube, FaLinkedin, FaPinterest } from "react-icons/fa";

const Sidebar: React.FC = () => {
  const [isAppsOpen, setIsAppsOpen] = useState(false);

  const toggleApps = () => {
    setIsAppsOpen((prev) => !prev);
  };

  return (
    <div className={styles.sidebar}>
      {/* Search Section */}
      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search"
          className={styles.searchInput}
        />
      </div>

      {/* Navigation Links */}
      <nav className={styles.nav}>
        <div className={styles.navItem}>
          <FaHome className={styles.icon} />
          <span>Home</span>
        </div>

        <div
          className={`${styles.navItem} ${isAppsOpen ? styles.active : ""}`}
          onClick={toggleApps}
        >
          <FaAppStore className={styles.icon} />
          <span>Apps</span>
        </div>

        {isAppsOpen && (
          <div className={styles.appsList}>
            <div className={styles.appItem}>
              <FaWhatsapp className={styles.appIcon} />
              <span>Whatsapp</span>
            </div>
            <div className={styles.appItem}>
              <FaInstagram className={styles.appIcon} />
              <span>Instagram</span>
            </div>
            <div className={styles.appItem}>
              <FaFacebook className={styles.appIcon} />
              <span>Facebook</span>
            </div>
            <div className={styles.appItem}>
              <FaYoutube className={styles.appIcon} />
              <span>Youtube</span>
            </div>
            <div className={styles.appItem}>
              <FaLinkedin className={styles.appIcon} />
              <span>LinkedIn</span>
            </div>
            <div className={styles.appItem}>
              <FaPinterest className={styles.appIcon} />
              <span>Pinterest</span>
            </div>
          </div>
        )}

        <div className={styles.navItem}>
          <FaClipboardList className={styles.icon} />
          <span>Forms</span>
        </div>
        <div className={styles.navItem}>
          <FaChartBar className={styles.icon} />
          <span>Dashboard</span>
        </div>
        <div className={styles.navItem}>
          <FaCog className={styles.icon} />
          <span>Settings</span>
        </div>
        <div className={styles.navItem}>
          <FaInfoCircle className={styles.icon} />
          <span>About</span>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
