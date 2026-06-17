import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './targetTable.module.css'; // Assuming you have a CSS module for styling
import {adminTargetFormData} from './slice/targetFormData'
import type { RootState } from '../../app/store'; 
import { useNavigate } from 'react-router-dom';

// Define the DataRow interface to match your data structure
interface DataRow {
  id:string;
  account_holder: string;
  account_name: string;
  department: string;
  vertical: string;
  vertical_sub: string;
  pic: string;
  designation: string;
  business: string;
  activity: string;
  activity_date: string;
  next_action: string;
  remarks: string;
  next_action_date: string;
  region: string;
  mobile_number: string;
  email_id: string;
  location: string;
  state: string;
  city: string;
  address: string;
  acct_created_date: string;
}

const AdminTargetTable: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(adminTargetFormData() as any);
  }, [dispatch]);

  const { data, loading, error } = useSelector((state: RootState) => state.targetData);
  const reversedData = [...data].reverse();

  const navigate = useNavigate();
  const handleEditClick = (id: string) => {
    navigate(`/editTargetForm/${id}`);
  };
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

 
 

  return (
    <div className={styles.tableContainer}>
      <div className={styles.tableHeading}>Target Table</div>
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
              <th>Designation</th>
              <th>Business</th>
              <th>Activity</th>
              <th>Activity Date</th>
              <th>Next Action</th>
              <th>Remarks</th>
              <th>Next Action Date</th>
              <th>Region</th>
              <th>Mobile Number</th>
              <th>Email</th>
              <th>Location</th>
              <th>State</th>
              <th>City</th>
              <th>Address</th>
              <th>Account Created Date</th>
              <th>Edit</th>
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
                  <td>{row.designation}</td>
                  <td>{row.business}</td>
                  <td>{row.activity}</td>
                  <td>{row.activity_date}</td>
                  <td>{row.next_action}</td>
                  <td>{row.remarks}</td>
                  <td>{row.next_action_date}</td>
                  <td>{row.region}</td>
                  <td>{row.mobile_number}</td>
                  <td>{row.email_id}</td>
                  <td>{row.location}</td>
                  <td>{row.state}</td>
                  <td>{row.city}</td>
                  <td>{row.address}</td>
                  <td>{row.acct_created_date}</td>
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

export default AdminTargetTable;
