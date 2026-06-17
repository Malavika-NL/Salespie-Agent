import React, { useState } from 'react';
import styles from './MarketingWorkspace.module.css';
import Navbar from '../UserDashboard/components/navbar/navbar';
import UserSidebar from '../UserHome/components/UserSidebar/userSidebar';
import Bar from './components/Bar/Bar';
import CreateCampaign from './components/CreateCampain/CreateCampain';
import ResponseAnalyst from './components/ResponseAnalyst/ResponseAnalyst';
import CampaignTemplates from './components/CampaignTemplates/CampaignTemplates';
import ScheduledHistory from './components/ScheduledHistory/ScheduledHistory';
import { Route, Routes } from 'react-router-dom';
import SendMessage from './components/SendMessage/SendMessage';

const MarketingWorkspace: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={styles.layoutContainer}>
      <div className={styles.navbar}>
        <Navbar />
      </div>
      <div className={styles.mainArea}>
        <div className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ''}`}>
          <UserSidebar
            isCollapsed={isCollapsed}
            toggleSidebar={() => setIsCollapsed((prev) => !prev)}
          />
        </div>
        <div className={`${styles.mainContent} ${isCollapsed ? styles.collapsed : styles.expanded}`}>
          <div className={styles.head}>
            <h4>Welcome, Abhijith</h4>
          
          </div>
          
          <Bar />
          {/* <Message />
          <div className={styles.row}>
            <div className={styles.templatepreview}>
              <TemplatePreview />
            </div>
            <div className={styles.form}>
              <ContactDateSetting />
            </div>
          </div>
          <CenterButtons /> */}
          {/* <ResponseAnalyst /> */}
          {/* <CampaignTemplates /> */}
          {/* <ScheduledHistory /> */}
          <div className={styles.bottomContainer}>  
            <Routes>

            <Route path="SendMessage" element={<SendMessage />} />
            <Route path="CreateCampaign" element={<CreateCampaign />} />
            <Route path="ResponseAnalyst" element={<ResponseAnalyst />} />
            <Route path="CampaignTemplates" element={<CampaignTemplates />} />
            <Route path="ScheduledHistory" element={<ScheduledHistory />} />
            </Routes>
        </div>
        </div>
      </div>
    </div>
  );
};

export default MarketingWorkspace;
