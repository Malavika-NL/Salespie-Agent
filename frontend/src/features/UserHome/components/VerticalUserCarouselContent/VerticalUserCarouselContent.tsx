// import React from 'react';
// import styles from './VerticalUserCarouselContent.module.css';
// import { IoIosHome } from "react-icons/io";
// import { FaExpandAlt } from "react-icons/fa";

// // Define the structure of the props
// interface VerticalCarouselContentProps {
//   title: string;
//   startDate: string;
//   endDate: string;
//   region: string;
//   contentStatus: string;
//   background?: string; // Accepts solid colors or gradients
// }

// const VerticalCarouselContent: React.FC<VerticalCarouselContentProps> = ({
//   title,
//   startDate,
//   endDate,
//   region,
//   contentStatus,
//   background,
// }) => {
//   // Log background to confirm it is a linear gradient
//   console.log(`Background color received: ${background}`);

//   return (
//     <div
//       className={styles.verticalCarouselContent}
//       style={{ background: background }} // Apply as `background` for gradients
//     >
//       <div className={styles.contentItem}>
//         <IoIosHome className={styles.icon} />
//         <span className={styles.text}>{title}</span>
//       </div>
//       <hr className={styles.line} />
//       <div className={styles.center}>

//       <div className={styles.row}>
//         <div className={styles.date}>
//           <p>Start Date</p>
//           <p>{startDate}</p>
//         </div>
//         <div className={styles.date}>
//           <p>End Date</p>
//           <p>{endDate}</p>
//         </div>
//       </div>
//       <div className={styles.row}>
//         <div className={styles.date}>
//           <p>Region</p>
//           <p>{region}</p>
//         </div>
//         <div className={styles.date}>
//           <p>Content</p>
//           <p>{contentStatus}</p>
//         </div>
//       </div>
      

//       </div>
//       <div className={styles.buttonContainer}>
//         <span>See More</span>
//         <FaExpandAlt  style={{ marginLeft: '5px' }} />
//       </div>
//     </div>
//   );
// };

// export default VerticalCarouselContent;

import React from 'react';
import styles from './VerticalUserCarouselContent.module.css';
import { FaExpandAlt } from 'react-icons/fa';

interface VerticalCarouselContentProps {
  title: string;
  startDate: string;
  endDate: string;
  region: string;
  contentStatus: string;
  background?: string;
}

/* Status dot color */
const statusColor: Record<string, string> = {
  'Ready':       '#34d399',
  'In Progress': '#fbbf24',
  'Completed':   '#60a5fa',
  'Pending':     '#f87171',
};

/* Calendar icon */
const IconCalendar = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.7 }}>
    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

/* Map pin icon */
const IconPin = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.7 }}>
    <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1 1 18 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);

/* Briefcase icon */
const IconBriefcase = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
  </svg>
);

const VerticalCarouselContent: React.FC<VerticalCarouselContentProps> = ({
  title, startDate, endDate, region, contentStatus, background,
}) => {
  const dotColor = statusColor[contentStatus] ?? '#94a3b8';

  return (
    <div className={styles.verticalCarouselContent} style={{ background }}>

      {/* Header */}
      <div className={styles.contentItem}>
        <IconBriefcase />
        <span className={styles.text}>{title}</span>
      </div>

      <hr className={styles.line} />

      {/* Data grid */}
      <div className={styles.center}>
        <div className={styles.row}>
          <div className={styles.date}>
            <p><IconCalendar /> Start Date</p>
            <p>{startDate}</p>
          </div>
          <div className={styles.date}>
            <p><IconCalendar /> End Date</p>
            <p>{endDate}</p>
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.date}>
            <p><IconPin /> Region</p>
            <p>{region}</p>
          </div>
          <div className={styles.date}>
            <p>Status</p>
            <p style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{
                width: 7, height: 7, borderRadius: '50%',
                background: dotColor, display: 'inline-block', flexShrink: 0,
              }} />
              {contentStatus}
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className={styles.buttonContainer}>
        <span>See More</span>
        <FaExpandAlt size={10} />
      </div>

    </div>
  );
};

export default VerticalCarouselContent;