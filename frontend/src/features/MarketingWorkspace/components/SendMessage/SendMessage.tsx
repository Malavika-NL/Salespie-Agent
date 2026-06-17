import React from 'react';
import styles from './SendMessage.module.css'
import Message from './Components/Message/Message';
import TemplatePreview from './Components/TemplatePreview/TemplatePreview';
import ContactDateSetting from './Components/ContactSettings/ContactSettings';
import CenterButtons from './Components/CenterButton/CenterButton';



const SendMessage: React.FC = () => {
  return (
    <div>


          <Message />
          <div className={styles.row}>
            <div className={styles.templatepreview}>
              <TemplatePreview />
            </div>
            <div className={styles.form}>
              <ContactDateSetting />
            </div>
          </div>
          <CenterButtons />
    </div>
  );
};

export default SendMessage;
