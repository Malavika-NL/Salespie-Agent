import React, { useState } from 'react';
import styles from './WeeklyPlanning.module.css';
import { AiOutlineExpand } from "react-icons/ai";

const verticals = [
    { key: 'Automobile', value: 'Automobile' },
    { key: 'Health Care', value: 'Health Care' },
    { key: 'E-Commerce', value: 'E-Commerce' },
    { key: 'E&E', value: 'E&E' },
    { key: 'FMCG', value: 'FMCG' },
    { key: 'Chemical Mfg', value: 'Chemical Mfg' },
    { key: 'Other Mfg', value: 'Other Mfg' },
    { key: 'F&B', value: 'F&B' },
    { key: 'Pharmaceutical', value: 'Pharmaceutical' },
    { key: 'Retails', value: 'Retails' },
    { key: 'Transport & Logistics', value: 'Transport & Logistics' },
    { key: 'Apparel', value: 'Apparel' },
    { key: 'Government', value: 'Government' },
    { key: 'Others', value: 'Others' }
];

const locations = [
    { key: 'Gurgaon', value: 'Gurgaon' },
    { key: 'Delhi', value: 'Delhi' },
    { key: 'Mumbai', value: 'Mumbai' },
    { key: 'Kochi', value: 'Kochi' },
    { key: 'Bangalore', value: 'Bangalore' },
    { key: 'Noida', value: 'Noida' },
];

const WeeklyPlanning: React.FC = () => {
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2 className={styles.title}>Weekly Planning</h2>
            </div>
            <div className={styles.table}>
                {rows.map((row, index) => (
                    <div key={index} className={styles.row}>
                        <div className={`${styles.cell1} ${styles[row.lightcolor]}`}>{row.title}</div>

                        {/* Second Cell - Select Dropdowns and Set */}
                        <div className={`${styles.cell} ${styles[row.lightcolor]}`}>
                            <select className={styles.select}>
                                <option value="">Vertical</option>
                                {verticals.map((vertical) => (
                                    <option key={vertical.key} value={vertical.value}>
                                        {vertical.value}
                                    </option>
                                ))}
                            </select>

                            <select className={styles.select}>
                                <option value="">Location</option>
                                {locations.map((location) => (
                                    <option key={location.key} value={location.value}>
                                        {location.value}
                                    </option>
                                ))}
                            </select>

                            <div className={`${styles.set} ${styles[row.color]}`}>Set</div>
                        </div>

                        <div className={`${styles.cell2} ${styles[row.lightcolor]}`}>
                            <div>0 Calls</div>
                        </div>

                        <div className={`${styles.cell4} ${styles[row.lightcolor]}`}>
                            <div className={styles.Edit}>Edit</div>
                            <AiOutlineExpand className={styles.expandlogo} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const rows = [
    { title: 'Week 1', color: 'color1', lightcolor: 'lightcolor1' },
    { title: 'Week 2', color: 'color2', lightcolor: 'lightcolor2' },
    { title: 'Week 3', color: 'color3', lightcolor: 'lightcolor3' },
    { title: 'Week 4', color: 'color4', lightcolor: 'lightcolor4' },
    { title: 'Week 5', color: 'color5', lightcolor: 'lightcolor5' }
];

export default WeeklyPlanning;
