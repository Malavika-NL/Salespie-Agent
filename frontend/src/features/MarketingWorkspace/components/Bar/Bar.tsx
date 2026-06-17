import React from "react";
import styles from './Bar.module.css'; // Importing the CSS module
import { MdOutgoingMail } from "react-icons/md";
import { RiComputerLine } from "react-icons/ri";
import { CgDanger } from "react-icons/cg";
import { IoShareSocial } from "react-icons/io5";
import { MdHistory } from "react-icons/md";
import { Link } from "react-router-dom";
const Bar: React.FC = () => {
    return (
        <div className={styles.bar}>
             < Link to="/marketingspace/SendMessage" className={`${styles.links} `}>
            <div className={styles.item}>
                <MdOutgoingMail className={styles.icon} />Send Message
            </div>
            </Link>

            < Link to="/marketingspace/CreateCampaign" className={`${styles.links} `}>
            <div className={styles.item}>
                <RiComputerLine className={styles.icon} />Create Campaign
            </div>
            </Link>

            < Link to="/marketingspace/ResponseAnalyst" className={`${styles.links} `}>
            <div className={styles.item}>
                <CgDanger className={styles.icon} />Response Analyst
            </div>
            </Link>

            < Link to="/marketingspace/CampaignTemplates" className={`${styles.links} `}>
            <div className={styles.item}>
                <IoShareSocial className={styles.icon} />Campaign Templates
            </div>
            </Link>

            < Link to="/marketingspace/ScheduledHistory" className={`${styles.links} `}>
            <div className={styles.item}>
                <MdHistory className={styles.icon} />Scheduled History
            </div>
            </Link>

        </div>
    );
};

export default Bar;
