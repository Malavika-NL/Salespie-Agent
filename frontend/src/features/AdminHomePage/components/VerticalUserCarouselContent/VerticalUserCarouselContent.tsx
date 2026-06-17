import React from 'react';
import styles from './VerticalUserCarouselContent.module.css';
import { IoIosHome } from "react-icons/io";
import { FaExpandAlt } from "react-icons/fa";

// Define the structure of the props
interface VerticalCarouselContentProps {
  title: string;
  startDate: string;
  endDate: string;
  region: string;
  contentStatus: string;
  background?: string; // Accepts solid colors or gradients
}

const VerticalCarouselContent: React.FC<VerticalCarouselContentProps> = ({
  title,
  startDate,
  endDate,
  region,
  contentStatus,
  background,
}) => {
  // Log background to confirm it is a linear gradient
  console.log(`Background color received: ${background}`);

  return (
    <div
      className={styles.verticalCarouselContent}
      style={{ background: background }} // Apply as `background` for gradients
    >
      <div className={styles.contentItem}>
        <IoIosHome className={styles.icon} />
        <span className={styles.text}>{title}</span>
      </div>
      <hr className={styles.line} />
      <div className={styles.center}>

      <div className={styles.row}>
        <div className={styles.date}>
          <p>Start Date</p>
          <p>{startDate}</p>
        </div>
        <div className={styles.date}>
          <p>End Date</p>
          <p>{endDate}</p>
        </div>
      </div>
      <div className={styles.row}>
        <div className={styles.date}>
          <p>Region</p>
          <p>{region}</p>
        </div>
        <div className={styles.date}>
          <p>Content</p>
          <p>{contentStatus}</p>
        </div>
      </div>
      
      <div className={styles.buttonContainer}>
        <span>See More</span>
        <FaExpandAlt  style={{ marginLeft: '5px' }} />
      </div>
      </div>
     
    </div>
  );
};

export default VerticalCarouselContent;
