// takeButton.tsx
import React from 'react';
import styles from '../TakemethereButton/takeButton.module.css';

interface TakeButtonProps {
  className?: string; // Define className prop as optional
}

const TakeButton: React.FC<TakeButtonProps> = ({ className }) => {
  return (
    <div className={`${styles.takeButton} ${className}`}>
      Take me there
      <div className={styles.arrowbg}>
        <div className={styles.arrow}></div>
      </div>
    </div>
  );
};

export default TakeButton;
