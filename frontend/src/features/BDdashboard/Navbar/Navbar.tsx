// Navbar.tsx
import React, { useState } from 'react';
import styles from './navbar.module.css'; // Assuming you're using CSS modules

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>MyLogo</div>
      <div className={styles.menuToggle} onClick={toggleMenu}>
        {isOpen ? 'Close' : 'Menu'}
      </div>
      <ul className={`${styles.navItems} ${isOpen ? styles.active : ''}`}>
        <li className={styles.navItem}>Home</li>
        <li className={styles.navItem}>About</li>
        <li className={styles.navItem}>Services</li>
        <li className={styles.navItem}>Contact</li>
      </ul>
    </nav>
  );
};

export default Navbar;
