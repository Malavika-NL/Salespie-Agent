import React from 'react';
import styles from './statistics.module.css';

const Statistics: React.FC<{}> = () => {
  // Example data for random positioning
  const data = [
    { color: 'green', count: 1 },
    { color: 'yellow', count: 2 },
    { color: 'red', count: 3 },
    { color: 'green', count: 4 },
    { color: 'yellow', count: 5 },
    { color: 'red', count: 6 },
    { color: 'green', count: 7 },
    { color: 'yellow', count: 8 },
    { color: 'red', count: 9 },
    { color: 'green', count: 10 },
  ];

  // Adjust this to control spacing
  const boxSize = 50; // Size of color box
  const containerSize = 300; // Size of the container (width and height)

  const getRandomPosition = () => {
    // Ensures the boxes are placed within the container
    const maxPosition = containerSize - boxSize;
    const x = Math.random() * maxPosition;
    const y = Math.random() * maxPosition;
    return { top: `${y}px`, left: `${x}px` };
  };

  return (
    <div className={styles.statistics}>
      <div className={styles.header}>
        <div className={styles.h2}>Campaign Statistics</div>
        <div className={styles.dropdownContainer}>
          <select className={styles.dropdown}>
            <option>Vertical</option>
            <option>Horizontal</option>
          </select>
          <select className={styles.dropdown}>
            <option>Region 1</option>
            <option>Region 2</option>
            <option>Region 3</option>
          </select>
        </div>
      </div>
      <div className={styles.colorContainer}>
        {data.map((item, index) => {
          const position = getRandomPosition();
          return (
            <div
              key={index}
              className={styles.colorBox}
              style={{
                backgroundColor: item.color,
                top: position.top,
                left: position.left,
              }}
            >
              {item.count}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Statistics;
