import React from 'react';
import styles from './CreateCampain.module.css'
import CampaignForm from './components/CampaignForm/CampaignForm';
import CenterButtons from './components/CenterButton/CenterButton';

const CreateCampaign: React.FC = () => {
  return (
    <div>
      <CampaignForm />
      <CenterButtons />
    </div>
  );
};

export default CreateCampaign;
