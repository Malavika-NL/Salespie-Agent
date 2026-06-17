import React from 'react';
import styles from './topbar.module.css';

const TopBar: React.FC = () => {
  return (
    <div className={styles.topBar}>
      <div className={styles.searchContainer}>
        <svg className={styles.searchIcon} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 2C5.589 2 2 5.589 2 10C2 14.411 5.589 18 10 18C11.118 18 12.171 17.708 13.071 17.147L17.707 21.783L19.783 19.707L15.147 15.071C15.708 14.171 16 13.118 16 12C16 5.589 12.411 2 10 2ZM10 4C13.866 4 17 7.134 17 11C17 14.866 13.866 18 10 18C6.134 18 3 14.866 3 11C3 7.134 6.134 4 10 4Z" fill="white"/>
        </svg>
        <input type="text" className={styles.searchInput} placeholder="Type to Search..." />
      </div>
      <div className={styles.userContainer}>
        {/* Add profile image and username here if needed */}
      </div>
    </div>
  );
};

export default TopBar;
