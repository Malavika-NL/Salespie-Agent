// BdDashboard.tsx
import React from 'react';
import Sidebar from './Sidebar/Sidebar'; // Adjust the import path according to your project structure
import styles from './BDdashboard.module.css'; // Import the CSS module
import Navbar from './Navbar/Navbar';
import Top from './Topsection/top';
import Progress from './ProgressSection/progress';
import Calender from './Calender/calender';
import TargetCustomerTable from './Table/Table';
import MonthlyTarget from './MonthlyTarget/monthlyTarget';
import ClientMeeting from './ClientMeetings/clientMeetings';
import Carousel from './Carousel/Carousel';

const BdDashboard: React.FC = () => {
    return (
        <div className={styles.dashboardContainer}>
            <div className={styles.sidebarContainer}>
                <Sidebar />
            </div>
            <div className={styles.dashboardContent}>
                <Top />
                <div className={styles.row}>
                    <Progress />
                    <Calender />
                </div>

                <div className={styles.row}>

                    <div className={styles.column}>
                        <div className={styles.container}>
                            <div className={styles.smallBox1}></div>
                            <div className={styles.largeBox1}></div>
                        </div>
                        <div className={styles.container}>
                            <div className={styles.smallBox2}></div>
                            <div className={styles.largeBox2}></div>
                        </div>
                        <div className={styles.container}>
                            <div className={styles.smallBox3}></div>
                            <div className={styles.largeBox3}></div>
                        </div>
                        <div className={styles.container}>
                            <div className={styles.smallBox4}></div>
                            <div className={styles.largeBox4}></div>
                        </div>
                    </div>

                    <div className={styles.column}>
                        <div className={styles.slide}>
                            <Carousel />
                        </div>
                        <div className={styles.row}>
                            <div className={styles.green}></div>
                            <div className={styles.red}></div>
                        </div>
                    </div>


                    <div className={styles.column}>
                        <div className={styles.container}>
                            <div className={styles.circle}></div>
                        </div>
                        <div className={styles.container}>
                            <div className={styles.circle}></div>
                        </div>
                        <div className={styles.container}>
                            <div className={styles.circle}></div>
                        </div>
                        <div className={styles.container}>
                            <div className={styles.circle}></div>
                        </div>

                    </div>
                </div>

                <TargetCustomerTable />
                <div className={styles.bottomContainer}>
                    <div className={styles.leftContent}>
                        <MonthlyTarget />
                    </div>
                    <div className={styles.rightContent}>
                        <ClientMeeting />
                    </div>
                </div>

            </div>
        </div>
    );
};

export default BdDashboard;
