import React, { useState } from "react";
import Navbar from "../UserDashboard/components/navbar/navbar";
import UserSidebar from "../UserHome/components/UserSidebar/userSidebar";
import styles from './BDDashboardNew.module.css';
import KeyAccounts from "./components/KeyAccounts/KeyAccounts";
import RevenueTarget from "./components/RevenueTarget/RevenueTarget";
import Top from "../BDdashboard/Topsection/top";
import MonthlyTarget from "../BDdashboard/MonthlyTarget/monthlyTarget";
import ClientMeeting from "../BDdashboard/ClientMeetings/clientMeetings";
import Progress from "../BDdashboard/ProgressSection/progress";

import TargetCustomerTable from "../BDdashboard/Table/Table";
import CustomerList from "./components/CustomerList/CustomerList";
import { CarouselCrossfadeExample } from "./components/Carousel/Carousel";
import WorldMap from "./components/WorldMap/WorldMap";
import WeeklyPlanning from "./components/WeeklyPlanning/WeeklyPlanning";



interface Region {
  name: string;
  coordinates: [number, number]; // Enforce tuple type
}

interface Props {
  regions: Region[];
}

const rawRegions = [
  { name: "New York, USA", coordinates: [-74.006, 40.7128] },
  { name: "London, UK", coordinates: [-0.1276, 51.5074] },
];

const toTuple = (coordinates: number[]): [number, number] | null =>
  coordinates.length === 2 ? [coordinates[0], coordinates[1]] : null;

const regions = rawRegions
  .map(({ name, coordinates }) => {
    const validCoordinates = toTuple(coordinates);
    if (!validCoordinates) {
      console.error(`Invalid coordinates for ${name}`);
      return null;
    }
    return { name, coordinates: validCoordinates };
  })
  .filter((region): region is Region => region !== null);

const BDDashboardNew: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);




  return (
    // <div className={styles.layoutContainer}>
    //   <div className={styles.navbar}>
    //     <Navbar />
    //   </div>
    //   <div className={styles.mainArea}>
    //     <div className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ""}`}>
    //       <UserSidebar
    //         isCollapsed={isCollapsed}
    //         toggleSidebar={() => setIsCollapsed((prev) => !prev)}
    //       />
    //     </div>
    //     <div className={`${styles.mainContent} ${isCollapsed ? styles.collapsed : styles.expanded}`}>
    //       <Top />

    //       <div className={styles.row}>
    //         <div className={styles.progress}>
    //           <Progress />
    //         </div>
    //         <div className={styles.carousel}>
    //           <CarouselCrossfadeExample />
    //         </div>
    //       </div>


    //       <KeyAccounts />
    //       <TargetCustomerTable />

    //       <div className={styles.row}>
    //         <div className={styles.revenue}>
    //           <MonthlyTarget />
    //         </div>
    //         <div className={styles.Customerlist}>
    //           <ClientMeeting />
    //         </div>
    //       </div>
    //       <div className={styles.row}>
    //         <div className={styles.revenue}>
    //           <WeeklyPlanning />
    //         </div>
    //         <div className={styles.mapcontianer}>
    //         <WorldMap regions={regions} />
    //         </div>
    //       </div>

    //       <div className={styles.row}>
    //         <div className={styles.revenue}>
    //           <RevenueTarget />
    //         </div>
    //         <div className={styles.Customerlist}>
    //           <CustomerList />
    //         </div>
    //       </div>


    //     </div>
    //   </div>
    // </div>
    <div className={styles.mainContent}>
      <Progress />
      {/* <div className={styles.row}>
        <div className={styles.progress}>
          <Progress />
        </div>
        <div className={styles.carousel}>
          <CarouselCrossfadeExample />
        </div>
      </div> */}
      <div className={styles.row}>
        <KeyAccounts />
        {/* <TargetCustomerTable /> */}
      </div>
      <div className={styles.row}>
        {/* <KeyAccounts /> */}
        <TargetCustomerTable />
      </div>
      <div className={styles.row}>
        <div className={styles.revenue}>
          <MonthlyTarget />
        </div>
        <div className={styles.Customerlist}>
          <ClientMeeting />
        </div>
      </div>
      <div className={styles.row}>
        <div className={styles.revenue}>
          <WeeklyPlanning />
        </div>
        <div className={styles.mapcontianer}>
          <WorldMap regions={regions} />
        </div>
        
      </div>
      

      <div className={styles.row}>
        <div className={styles.revenue}>
          <RevenueTarget />
        </div>
        <div className={styles.Customerlist}>
          <CustomerList />
        </div>
      </div>
    </div>
  );
};

export default BDDashboardNew;
