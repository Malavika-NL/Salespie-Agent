import React from 'react';
import styles from './CenterButton.module.css';
import { MdDeleteOutline } from "react-icons/md";
import { FaRegBookmark } from "react-icons/fa";

const CenterButtons: React.FC = () => {
  return (
    <div className={styles.buttonContainer}>
      <button className={styles.Clearbutton}> <MdDeleteOutline size={20} /> Clear </button>
      <button className={styles.savebutton}> <FaRegBookmark size={18} />Save </button>
    </div>
  );
};

export default CenterButtons;
