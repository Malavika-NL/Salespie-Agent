import React, { useState } from "react";
import styles from "./adminHome.module.css";
import Navbar from "../AdminDashboard/components/navbar/navbar";
import HomeSidebar from "./components/HomeSidebar/HomeSidebar";
// import Carousel from "./components/Carousel/Carousel";
import FirstCarousel from "./components/Carousel/Carousel";
import { MantineProvider } from "@mantine/core";
import { Carousel } from '@mantine/carousel';
import VerticalCarousel from "./components/VerticalCarousel/VerticalCarousel";
import Footer from "./Footer/Footer";
const AdminHome: React.FC = () => {
  const [isShrunk, setIsShrunk] = useState(false);

  const toggleSidebar = () => {
    setIsShrunk(!isShrunk);
  };



const [currentPage, setCurrentPage] = useState(1);
const totalPages = 5; // Example total pages

const handlePageChange = (page: number) => {
  if (page >= 1 && page <= totalPages) {
    setCurrentPage(page);
  }
};

const [currentPageVertical, setCurrentPageVertical] = useState(1);
const totalVerticalPages = 5; // Example total pages

const handleVerticalPageChange = (page: number) => {
  if (page >= 1 && page <= totalVerticalPages) {
    setCurrentPageVertical(page);
  }
};
  return (
    <div className={styles.container}>
      <Navbar />
      <HomeSidebar />
      <div className={styles.dashboard}>
        {/* Top container */}
        <div className={styles.topContainer}>
          <div className={styles.leftSection}>
            {/* Add content for the left section */}
            
            <FirstCarousel
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
          <div className={styles.rightSection}>
            {/* Add content for the right section */}
            <VerticalCarousel
              currentPage={currentPageVertical}
              totalPages={totalVerticalPages}
              onPageChange={handleVerticalPageChange}
            />
          </div>
        </div>

        {/* Bottom container */}
        <div className={styles.bottomContainer}>
          <Footer />
          
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
