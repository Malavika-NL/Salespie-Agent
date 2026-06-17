import React from 'react';
import styles from './ContactSettings.module.css';

const ContactDateSetting: React.FC = () => {
  return (
    <div className={styles.container}>
      {/* Heading */}
      <h2 className={styles.heading}>Contact & Date Setting</h2>
      <hr className={styles.line} />

      {/* No. of Contacts Section */}
      <div className={styles.row}>
        <p className={styles.rowHeading}>No. of contacts</p>
        <div className={styles.inputGroup}>
          <input
            type="number"
            id="from"
            placeholder="From"
            className={styles.input}
          />
          <input
            type="number"
            id="to"
            placeholder="To"
            className={styles.input}
          />
        </div>
      </div>

      {/* Region Section */}
      <div className={styles.row}>
        <p className={styles.rowHeading}>Region</p>
        <select className={styles.select}>
          <option value="" disabled selected>
            Select Region
          </option>
          <option value="Region1">Region 1</option>
          <option value="Region2">Region 2</option>
        </select>
      </div>

      {/* Scheduled Date and Time Section */}
      <div className={styles.row}>
        <p className={styles.rowHeading}>Scheduled Date</p>
        <div className={styles.inputGroup}>
          <input type="date" className={styles.input} />
          <input type="time" className={styles.input} />
        </div>
      </div>
      <div className={styles.buttonContainer}>
          <button type="button" className={styles.editButton}>
            Edit
          </button>
          <button type="submit" className={styles.saveButton}>
            Save
          </button>
        </div>
    </div>
  );
};

export default ContactDateSetting;
