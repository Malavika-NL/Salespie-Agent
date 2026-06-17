import React from 'react';
import styles from './CampaignManagement.module.css';
import { FiEdit } from "react-icons/fi";
import { MdDeleteOutline } from "react-icons/md";
const CampaignManagement: React.FC = () => {

  const campaigns = [
    { name: 'WMS Campaign', message: 'Hi! How are you? Best Regards, Albin John https://nlsalesplus.pythonanywhere.com/user Dashboard', createdAt: '29/05/25' },
    { name: 'WIP Campaign', message: 'Hi! How are you? Best Regards, Albin John https://nlsalesplus.pythonanywhere.com/user Dashboard', createdAt: '29/05/25' },
    { name: 'Marketing CRM Campaign', message: 'Hi! How are you? Best Regards, Albin John https://nlsalesplus.pythonanywhere.com/user Dashboard', createdAt: '29/05/25' },
    { name: 'Sales Funnel Campaign', message: 'Hi! How are you? Best Regards, Albin John https://nlsalesplus.pythonanywhere.com/user Dashboard', createdAt: '29/05/25' }
  ];


  return (
    <div className={styles.container}>
      {/* Heading and Button */}
      <div className={styles.header}>
        <h1 className={styles.heading}>Campaign Management</h1>
        <button className={styles.button}>Create Campaign</button>
      </div>


      <div className={styles.headContainer}>
        <div className={styles.headItem1}>Name </div>
        <div className={styles.headItem}>Message </div>
        <div className={styles.headItem}>Created at</div>
        <div className={styles.headItem2}>Action</div>
      </div>
      {/* 4 Divs with space between */}


 {campaigns.map((campaign, index) => (
        <div key={index} className={styles.divContainer}>
          <div className={styles.divItem1}>{campaign.name}</div>
          <div className={styles.divItem}>{campaign.message}</div>
          <div className={styles.divItem}>{campaign.createdAt}</div>
          <div className={styles.buttoncontainer}>
          <button className={styles.savebutton}><FiEdit />save</button>
          <button className={styles.deletebutton}><MdDeleteOutline size={14} />Delete</button>
        </div>
      </div>
       ))}
    </div>
  );
};

export default CampaignManagement;
