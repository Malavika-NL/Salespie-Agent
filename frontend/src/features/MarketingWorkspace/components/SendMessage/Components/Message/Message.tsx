import React from 'react';
import styles from './Message.module.css';

const Message: React.FC = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Message Heading</h1>
      <div className={styles.row}>
        {/* Box 1 */}
        <div className={styles.box}>
          <label className={styles.label} htmlFor="select1"><span className={styles.red}>*</span> Template</label>
          <select id="select1" className={styles.select}>
            <option value="option1" disabled selected>Select template</option>
            <option value="option1">Option 1</option>
            <option value="option2">Option 2</option>
            <option value="option3">Option 3</option>
          </select>
        </div>

        {/* Box 2 */}
        <div className={styles.box}>
          <label className={styles.label} htmlFor="select2"><span className={styles.red}>*</span> Instances</label>
          <select id="select2" className={styles.select}>
            <option value="" disabled selected>Option A</option>
            <option value="option2">Option B</option>
            <option value="option3">Option C</option>
          </select>
        </div>

        {/* Box 3 */}
        <div className={styles.box}>
          <label className={styles.label} htmlFor="input">Message Type</label>
          <input id="input" type="text" className={styles.input} placeholder="Enter text" />
        </div>
      </div>
    </div>
  );
};

export default Message;
