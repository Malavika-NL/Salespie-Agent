import React from 'react';
import styles from '../BlueBox/blueBox.module.css';
import TakeButton from '../TakemethereButton/takeButton';

const BlueBox: React.FC = () => {
  return (
    <div className={`${styles.blueBox} container backgroundImageClass`}>
   
      <div className={styles.textBox}>
        Welcome, Pick were you left off in.
      </div>

      <div className={styles.takeButton}>
        <TakeButton />
      </div>

    </div>
  );
};

export default BlueBox;
