import React from 'react';
import styles from './VerticalCarouselContent.module.css';

const VerticalCarouselContent: React.FC = () => {
  return (
    <div className={styles.carouselContent}>
      <div className={styles.contentDiv}>
        <p className={styles.text}>Hello</p>
      </div>
    </div>
  );
};

export default VerticalCarouselContent;
