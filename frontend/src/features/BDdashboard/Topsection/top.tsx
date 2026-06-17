import React from 'react';
import styles from './top.module.css';
import { FaSearch } from 'react-icons/fa';
import { IoReorderThree } from "react-icons/io5";
import { FaRegMoon } from "react-icons/fa";
import { FaRegBell } from "react-icons/fa";
import { FaExpand } from "react-icons/fa";
import { BiMessageRounded } from "react-icons/bi";
import Indianflagimage from '../../images/india-svgrepo-com 2.png'


const Top: React.FC = () => {
  return (
    <div className={styles.topContainer}>
      <div className={styles.searchContainer}>
        <IoReorderThree className={styles.menuIcon} />
        {/* <FaSearch className={styles.searchIcon} /> */}
        <input
          type="text"
          placeholder="Search..."
          className={styles.searchBar}
        />
      </div>
      <div className={styles.userProfile}>
      <FaRegMoon color='#4B93FF'  size={24}/>
      <FaRegBell color='#4B93FF'  size={24}/>
      
      <div style={{  background: '#DFF9F7'}}>
      <BiMessageRounded color='#4B93FF'  size={24}/>
      </div>

      <div style={{  background: '#DFF9F7'}}>
      <img
          src={Indianflagimage}// Replace with your image path
          alt="Indian flag"
          className={styles.profileImage}
        />
      </div>
    
      <FaExpand color='#4B93FF'  size={24}/>

   
        <img
          src="path/to/your/profile-image.jpg" // Replace with your image path
          alt="User Profile"
          className={styles.profileImage}
        />
      </div>
    </div>
  );
};

export default Top;
