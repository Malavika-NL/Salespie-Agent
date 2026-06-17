import React from 'react';
import styles from './CenterButton.module.css';

const CenterButtons: React.FC = () => {
  return (
    <div className={styles.buttonContainer}>
      <button className={styles.campaignbutton}>Campaign Name </button>
      <button className={styles.sendbutton}>Send Message</button>
    </div>
  );
};

export default CenterButtons;
