import React from 'react';
import style from './dashboard.module.css';
import { Link } from 'react-router-dom';

const DashboardPage: React.FC = () => {
    return (
        <div className={style.dashboardContainer}>
            <div className={style.dashboard}>
                <h3>Dashboard</h3>
                <h2>Manage</h2>
                <p>Manage and control work</p>
                <p>in your warehouse most effectively</p>

                <div className={style.infoBox}>
                    <h1>"</h1>
                    <p>Manage and control work</p>
                    <p>in your warehouse most effectively</p>
                </div>
                
                <Link to="/dashboard" className={style.link}>
                    <button className={style.come}>
                        Come, Let's go
                        <svg className={style.right} enable-background="new 0 0 15 26" height="30px" id="Layer_1" version="1.1" viewBox="0 0 15 26" width="15px">
                            <polygon fill="#ffffff" points="12.885,0.58 14.969,2.664 4.133,13.5 14.969,24.336 12.885,26.42 2.049,15.584 -0.035,13.5 " />
                        </svg>
                    </button>
                </Link>

            <div className={style.img}></div>
            </div>
        </div>
    );
};

export default DashboardPage;
