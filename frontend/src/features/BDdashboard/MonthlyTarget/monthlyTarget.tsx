import React, { useState, useEffect } from 'react';
import styles from './monthlyTarget.module.css';
import monthlyData from '../../../data/monthlyData.json';

const LOCAL_STORAGE_KEY = "monthlyTargetData";

// Get the current month name
const getCurrentMonth = () => {
    const monthNames = Object.keys(monthlyData["2025"]); // Extract month names from data
    const currentMonthIndex = new Date().getMonth(); // 0 for January, 1 for February, etc.
    return monthNames[currentMonthIndex] || "January"; // Fallback to January if not found
};

const MonthlyTarget: React.FC = () => {
    // Load from local storage or initialize with imported data
    const [data, setData] = useState(() => {
        const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
        return storedData ? JSON.parse(storedData) : monthlyData;
    });

    // Set the default month to the current month
    const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth);

    // Save data to local storage whenever it changes
    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
    }, [data]);

    const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedMonth(event.target.value);
    };

    const handleClick = () => {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        setData(monthlyData);
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2 className={styles.title}>Monthly Target</h2>
                <select className={styles.select} value={selectedMonth} onChange={handleMonthChange}>
                    {Object.keys(data["2025"]).map((month) => (
                        <option key={month} value={month}>{month}</option>
                    ))}
                </select>
            </div>
            <div className={styles.table}>
                {/* Header Row */}
                <div className={`${styles.row} ${styles.headerRow}`}>
                    <div className={styles.cell2}>Contents</div>
                    <div className={styles.cell3}>Week 1</div>
                    <div className={styles.cell3}>Week 2</div>
                    <div className={styles.cell3}>Week 3</div>
                    <div className={styles.cell3}>Week 4</div>
                    <div className={styles.cell3}>Week 5</div>
                </div>
                
                {/* Data Rows */}
                {rows.map((row, index) => (
                    <div key={index} className={styles.row}>
                        <div className={`${styles.cell1} ${styles[row.color]}`}>{row.title}</div>
                        {Array.from({ length: 5 }).map((_, weekIndex) => {
                            const weekKey = `Week ${weekIndex + 1}`;
                            return (
                                <div key={weekKey} className={`${styles.cell} ${styles[row.lightcolor]}`}>
                                    {data["2025"][selectedMonth]?.[weekKey]?.[row.title] ?? "-"}
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
            {/* <button onClick={handleClick}>Clear</button> */}
        </div>
    );
};

const rows = [
    { title: 'No of Customers Approached', color: 'color1', lightcolor: 'lightcolor1' },
    { title: 'No of Requirement Gathered', color: 'color2', lightcolor: 'lightcolor2' },
    { title: 'No of Demo Done', color: 'color3', lightcolor: 'lightcolor3' },
    { title: 'No of Proposal Shared', color: 'color4', lightcolor: 'lightcolor4' },
];

export default MonthlyTarget;
