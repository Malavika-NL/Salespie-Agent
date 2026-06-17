import React from "react";
import { Link } from "react-router-dom";
import styles from "./Footer.module.css";

const Footer: React.FC = () => {
  return (
    <div className={styles.footer}>
      <div className={styles.linkRow}>
        <Link to="/link1" className={styles.links}>Link 1</Link>
        <Link to="/link2" className={styles.links}>Link 2</Link>
        <Link to="/link3" className={styles.links}>Link 3</Link>
        <Link to="/link4" className={styles.links}>Link 4</Link>
        <Link to="/link5" className={styles.links}>Link 5</Link>
        <Link to="/link6" className={styles.links}>Link 6</Link>
      </div>
      <div className={styles.linkRow}>
        <Link to="/link7" className={styles.links}>Link 7</Link>
        <Link to="/link8" className={styles.links}>Link 8</Link>
        <Link to="/link9" className={styles.links}>Link 9</Link>
        <Link to="/link10" className={styles.links}>Link 10</Link>
        <Link to="/link11" className={styles.links}>Link 11</Link>
        <Link to="/link12" className={styles.links}>Link 12</Link>
      </div>
    </div>
  );
};

export default Footer;
