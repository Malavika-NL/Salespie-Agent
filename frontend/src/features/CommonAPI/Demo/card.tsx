// import React, { useState } from 'react';
// import styles from './card.module.css';

// interface CardProps {
//   title: string;
//   content: string;
//   index: number;
//   onClick: () => void;
// }

// const Card: React.FC<CardProps> = ({ title, content, index, onClick }) => {
//   const [isClicked, setIsClicked] = useState(false);

//   const handleClick = () => {
//     setIsClicked(true);
//     onClick();
//   };

//   return (
//     <div
//       className={`${styles.card} ${styles[`card${index + 1}`]} ${isClicked ? styles.clicked : ''}`}
//       onClick={handleClick}
//       style={{ zIndex: 5 - index }} // Adjust z-index based on index
//     >
//       <div className={styles.cardcontent}>
//         <h2>{title}</h2>
//         <p>{content}</p>
//       </div>
//     </div>
//   );
// };

// export default Card;


// import React from 'react';
// import styles from './card.module.css';

// interface CardProps {
//   title: string;
//   content: string;
//   index: number;
//   color: string;
//   onClick: () => void;
//   text?: string; // Optional text prop
// }

// const Card: React.FC<CardProps> = ({ title, content, index, color, onClick, text }) => {
//   const handleClick = () => {
//     onClick();
//   };

//   return (
//     <div
//       className={`${styles.card}`}
//       style={{ backgroundColor: color, zIndex: 5 - index }} // Adjust z-index based on index
//       onClick={handleClick}
//     >
//       <div className={styles.cardcontent}>
//         <h2>{title}</h2>
//         <p>{content}</p>
//         {/* {text && <p>{text}</p>}  */}
//       </div>
//     </div>
//   );
// };

// export default Card;



import React, { useEffect, useState } from 'react';
import styles from './card.module.css';

import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import BDDashboardNew from '../../BDDashboardNew/BDDashboardNew';

interface CardProps {
  title: string;
  content: string;
  index: number;
  color: string;
  onClick: () => void;
  text?: string;
  isTransitioning: boolean;
}

const Card: React.FC<CardProps> = ({ title, content, index, color, onClick, text, isTransitioning }) => {
  const [isExiting, setIsExiting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isTransitioning && index === 0) {
      setIsExiting(true);
      setTimeout(() => setIsExiting(false), 500);
    }
  }, [isTransitioning, index]);

  const handleCardButtonClick = () => {
    if (title === 'Card 2') {
      navigate('/empdashboard'); // Redirect for Card 5
    } else if (title === 'Card 3' ) {
      navigate('/newdashboard'); // Redirect to expanded image
    }  else if (title === 'Card 4' ) {
        navigate('/expanded-img');
    } else if (title === 'Card 1' ){
      navigate('/dashboard'); // Default redirect for other cards
    }
  };

  return (
    <div
      className={`${styles.card} ${isExiting ? styles.cardExiting : ''} ${
        isTransitioning && index === 1 ? styles.cardEntering : ''
      }`}
      style={{ backgroundColor: color, zIndex: 5 - index }}
      onClick={onClick}
    >
      <div className={styles.cardContent}>
        {title === 'Card 1' ? (
          <div className={styles.dashboardWrapper}>
            <BDDashboardNew />
          </div>
        ) : title === 'Card 2' ? (
          <div className={styles.dashboardWrapper2}>
            {/* <EMPDashboard /> */}
          </div>  
        ) : title === 'Card 3' ? (
          <div className={styles.dashboardWrapper3}>
            <div className={styles.imageContainer} onClick={handleCardButtonClick}>
              {/* <NewDashboard /> */}
            </div>
          </div>
        )  : (
          <p>{content}</p>
        )}
      </div>
      <button className={styles.topRightButton} onClick={(e) => {
        e.stopPropagation(); // Prevent card click event
        handleCardButtonClick(); // Navigate on button click
      }}>
        <FontAwesomeIcon icon={faArrowRight} />
      </button>
    </div>
  );
};

export default Card;
