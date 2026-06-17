import React from 'react';
import styles from './ResponseMessages.module.css';

const ResponseMessages: React.FC = () => {
  // Define the data for the table
  const messages = [
    { phone: '+91-7545898545', message: 'Interested' },
    { phone: '+91-7545898545', message: 'Demo' },
    { phone: '+91-7545898545', message: 'Interested' },
    { phone: '+91-7545898545', message: 'Demo' },
  ];

  return (
    <div className={styles.container}>
      {/* Heading and Search Bar */}
      <div className={styles.header}>
        <h1 className={styles.heading}>Response Messages</h1>
        <input
          type="text"
          placeholder="Search..."
          className={styles.searchBar}
        />
      </div>

      {/* Table */}
      <div className={styles.tablecontainer} >
      <table className={styles.table}>
        <thead className={styles.thCell}>
          <tr >
            <th className={styles.thcontent}>Phone Number</th>
            <th className={styles.thcontent}>Message</th>
          </tr>
        </thead>
        <tbody>
          {messages.map((item, index) => (
            <tr key={index}>
              <td className={styles.tdCell}>{item.phone}</td>
              <td className={styles.tdCell}>{item.message}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
};

export default ResponseMessages;
