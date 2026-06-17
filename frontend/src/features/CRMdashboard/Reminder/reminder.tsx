import React from 'react';
import styles from './reminder.module.css';
import Notes from './note';

const Reminder: React.FC<{}> = () => {
  return (
    <div className={styles.reminder}>
      <div className={styles.header}>Campaign Reminder</div>
      <Notes />
    </div>
  );
};

export default Reminder;
