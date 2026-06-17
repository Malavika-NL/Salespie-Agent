import React, { useState } from "react";
import style from "./Footer.module.css"
import { BiSolidCoinStack } from "react-icons/bi";
import { BsGraphUpArrow } from "react-icons/bs";
import { LuTarget } from "react-icons/lu";
import { TiContacts } from "react-icons/ti";
import { FaTasks } from "react-icons/fa";
import { Link } from "react-router-dom";
const MyFooter: React.FC = () => {

  return (
    <div className={style.footerContainer}>
      <Link to='/admintable' className={style.navLinks} ><div className={style.links}><BiSolidCoinStack size={20} style={{ color: 'white', marginRight: '10px' }} /><span className={style.link}>Account Data</span></div></Link>
      <Link to='/adminopportunitytable' className={style.navLinks} > <div className={style.links}><BsGraphUpArrow size={20} style={{ color: 'white', marginRight: '10px' }} /><span className={style.link}>Opportunity Data</span></div></Link>
      <Link to='/admintargettable' className={style.navLinks} ><div className={style.links}><LuTarget size={20} style={{ color: 'white', marginRight: '10px' }} /><span className={style.link}>Target Data</span></div> </Link>
      <Link to='/adminleadtable' className={style.navLinks} > <div className={style.links}><TiContacts size={20} style={{ color: 'white', marginRight: '10px' }} /><span className={style.link}>Lead Data</span></div></Link>
      <Link to='/task' className={style.navLinks}><div className={style.links}><FaTasks size={20} style={{ color: 'white', marginRight: '10px' }} /><span className={style.link}>Task</span></div></Link>
    </div>
  );
};

export default MyFooter;
