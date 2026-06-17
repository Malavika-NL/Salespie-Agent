

import React from 'react';
import styles from './accountTable.module.css'; // Assuming you have a CSS module for styling

import { adminAccountFormData } from './slice/tablesSlice';
import { useDispatch  } from 'react-redux';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../app/store'; 
import { useNavigate } from 'react-router-dom';

interface DataRow {
  account_holder: string;
  account_name:string;
department:string;
vertical: string;
vertical_sub:string|null;
pic: string;
designation:string;
business:string;
region:string
mobile_number:string;
email_id:string;
location:string;
state:string;
city:string;
address:string;
acct_created_date:string;
last_update_date:string;
}



const AdminAccountTableComponent: React.FC = () => {

  const dispatch = useDispatch();

  useEffect(() => {
    const data = dispatch(adminAccountFormData() as any);
    console.log(data)
  }, [dispatch]);

  const { data, loading, error } = useSelector((state: RootState) => state.accountData);
  const reversedData = [...data].reverse();
  const navigate = useNavigate();
  const handleEditClick = (id: string) => {
    navigate(`/editAccountForm/${id}`);
  };

  return (
    <div className={styles.tableContainer}>
      <div className={styles.tableHeading}>Account Table</div>
      <div className={styles.scrollableTable}>
        <table className={styles.table}>
          <thead>
            <tr>
            <th>Account Holder</th>
              <th>Account Name</th>
              <th>Department</th>
              <th>Vertical</th>
              <th>Vertical Sub</th>
              <th>PIC</th>
              <th>Region</th>
              <th>Mobile Number</th>
              <th>Email ID</th>
              <th>Location</th>
              <th>State</th>
              <th>City</th>
              <th>Address</th>
              <th>Designation</th>
              <th>Business</th>
              <th>Account Created Date</th>
              <th>Last Update Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
          {reversedData && reversedData.length > 0 ? (
            reversedData.map((row, rowIndex) => (
              <tr key={rowIndex}>
                <td>{row.account_holder}</td>
                <td>{row.account_name}</td>
                <td>{row.department}</td>
                <td>{row.vertical}</td>
                <td>{row.vertical_sub}</td>
                <td>{row.pic}</td>
                <td>{row.region}</td>
                <td>{row.mobile_number}</td>
                <td>{row.email_id}</td>
                <td>{row.location}</td>
                <td>{row.state}</td>
                <td>{row.city}</td>
                <td>{row.address}</td>
                <td>{row.designation}</td>
                <td>{row.business}</td>
                <td>{row.acct_created_date}</td>
                <td>{row.last_update_date}</td>
                <td><button onClick={() => handleEditClick(row.id)}>Edit</button></td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={20}>No account data available.</td>
             
            </tr>
          )}
        </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminAccountTableComponent;
