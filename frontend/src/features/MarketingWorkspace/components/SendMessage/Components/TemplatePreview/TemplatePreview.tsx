
import React from 'react';
import styles from './TemplatePreview.module.css';

const TemplatePreview: React.FC = () => {
  return (
    <div className={styles.container}>
      <h4 className={styles.heading}>Template Preview</h4>
      <div className={styles.line}></div>
      <textarea 
        className={styles.textArea} 
        placeholder="Type your template here..."
      ></textarea>
      
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

export default TemplatePreview;
