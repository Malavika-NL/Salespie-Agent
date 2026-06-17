import React, { useState } from 'react';
import styles from './sidebar.module.css';
import '@fortawesome/fontawesome-free/css/all.min.css'; 

interface SidebarProps {
  onToggle: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onToggle }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
    onToggle(!isOpen);
  };

  return (
    <div className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
      <button onClick={toggleSidebar} className={`${styles.toggleButton} ${isOpen ? styles.closeButton : ''}`}>
        {isOpen ? '✖' : '➔'}
      </button>
      <div className={styles.menu}>
        <ul>
          <li>
            <i className="fas fa-home"></i>
            {isOpen && ' Home'}
          </li>
          <li>
            <i className="fas fa-info-circle"></i>
            {isOpen && ' About'}
          </li>
          <li>
            <i className="fas fa-concierge-bell"></i>
            {isOpen && ' Services'}
          </li>
          <li>
            <i className="fas fa-envelope"></i>
            {isOpen && ' Contact'}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
