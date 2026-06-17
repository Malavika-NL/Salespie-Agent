import React from 'react';
import { MdErrorOutline } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import styles from './CarouselContent.module.css';

// Define the type for the input data
interface ContentData {
  title: string;
  text: string;
  backgroundColor: string;
  buttonColor: string;
}

interface ContentProps {
  data: ContentData[];
}

const Content: React.FC<ContentProps> = ({ data }) => {
  return (
    <div className={styles.container}>
      {data.map((item, index) => (
        <div 
          key={index} 
          className={styles.firstChild} 
          style={{ backgroundColor: item.backgroundColor }}
        >
          {/* First child div containing head and mainContent */}
          <div className={styles.head}>
            <MdErrorOutline className={styles.icon} />
            <p className={styles.text}>{item.title}</p>
          </div>
          <div className={styles.mainContent}>
            <p className={styles.text}>{item.text}</p>
          </div>

          {/* Second child div */}
          <div className={styles.secondChild}>
            <button 
              className={styles.button} 
              style={{ backgroundColor: item.buttonColor }}
            >
              Click Me
            </button>
            <IoMdClose className={styles.icon} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default Content;
