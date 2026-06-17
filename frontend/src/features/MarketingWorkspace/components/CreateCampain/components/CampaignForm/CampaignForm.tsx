import React from 'react';
import styles from './CampaignForm.module.css';

const CampaignForm: React.FC = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Create a Campaign</h1>
      <hr className={styles.line} />
      <form className={styles.form}>
        <div className={styles.formcontent}>
          <label className={styles.label} htmlFor="campaignName">
          Campaign Name
          </label>
          <input className={styles.input} type="text" id="campaignName" name="campaignName" placeholder='Enter campaign name' />
        </div>
        <div className={styles.formcontent}>
          <label className={styles.label} htmlFor="campaignDescription">
          Campaign Message
          </label>
          <input className={styles.input1} type="text" id="campaignDescription" name="campaignDescription" placeholder='Enter campaign contents' />
        </div>
      </form>
    </div>
  );
};

export default CampaignForm;
