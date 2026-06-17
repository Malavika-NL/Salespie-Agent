import React, { useEffect } from 'react';
import styles from './taskTable.module.css'; // Import CSS module
import { useDispatch, useSelector } from 'react-redux';
import { taskFormData } from './slice/taskTableSlice';
import type { RootState } from '../../app/store';
import { useNavigate } from 'react-router-dom';
import { clearTableData } from './slice/taskTableSlice';
// Define some example data
interface DataRow {

  task: string;
  description: string;
  startDate: string;
  endDate: string;
  status: string;
  outcome: string;
  lastUpdate: string;
  update: string;
}


const TaskTable: React.FC = () => {

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(clearTableData());
    const data = dispatch(taskFormData() as any);
    // console.log(data)
  }, []);


  // const{ role } = useSelector((state: RootState) => state.userLoginAuth.user);
  // console.log( 'role :',role)
  const { totaldata, loading, error } = useSelector((state: RootState) => state.taskData);
  // console.log('data :', totaldata)
  const { user } = useSelector((state: RootState) => state.userLoginAuth);
  // console.log(user.username)
  // console.log(user.role)
  const UserRole = user?.role as string;

  // console.log(UserRole)
  // console.log(typeof UserRole)
  const reversedData = [...totaldata].reverse();
  // console.log(' reversed data :', reversedData)
  const navigate = useNavigate();
  const handleEditClick = (id: string) => {
    navigate(`/editTaskForm/${id}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-indexed
    const year = date.getFullYear();
    const cal = `${day}/${month}/${year}`
    console.log(cal)
    return `${day}/${month}/${year}`;
  };

  return (
    <div className={styles.tableContainer}>
      <div className={styles.tableHeading}>Task Table</div>
      <div className={styles.scrollableTable}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.taskColumn}>Task</th>
              <th className={styles.descriptionColumn}>Description</th>
              <th className={styles.otherColumn}>Start Date</th>
              <th className={styles.otherColumn}>End Date</th>
              <th className={styles.otherColumn}>Status</th>
              <th className={styles.otherColumn}>Outcome</th>
              <th className={styles.otherColumn}>Last Update</th>

              {UserRole === 'admin' ? (
                <th className={styles.otherColumn}>Assigned To</th>
              ) : (
                <th className={styles.otherColumn}>Edit</th>
              )}
            </tr>
          </thead>
          <tbody>
            {UserRole === 'admin' ? (
              reversedData.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  <td>  <div className={styles.expandableCell}>
                    {row.task}
                  </div></td>
                  <td><div className={styles.expandableCell}>
                    {row.description}
                  </div></td>
                  <td>{row.start_date}</td>
                  <td>{row.end_date}</td>
                  <td>{row.status}</td>
                  <td>{row.outcome}</td>
                  <td>{row.last_update_date ? formatDate(row.last_update_date) : ''}</td>
                  {/* <td>
                    {row.last_update_date
                      ? new Date(row.last_update_date as string).toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' })
                      : 'N/A'}
                  </td> */}
                  {/* <td>{new Date(row.last_update_date as string).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}</td> */}
                  <td>{row.assigned_to}</td>
                </tr>
              ))
              // (() => {
              //   console.log('admin');
              //   return null; // Return a valid ReactNode like null if you don't want to render anything
              // })()
            ) : (
              reversedData.length > 0 ? (
                reversedData.filter(row => row.assigned_to === user.username).length > 0 ? (
                  reversedData.filter(row => row.assigned_to === user.username).map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      <td>  <div className={styles.expandableCell}>
                        {row.task}
                      </div></td>
                      <td><div className={styles.expandableCell}>
                        {row.description}
                      </div></td>
                      <td>{row.start_date}</td>
                      <td>{row.end_date}</td>
                      <td>{row.status}</td>
                      <td>{row.outcome}</td>
                      {/* <td>{row.last_update_date}</td> */}
                      <td>{row.last_update_date ? formatDate(row.last_update_date) : ''}</td>
                      <td><button onClick={() => handleEditClick(row.id)}>Edit</button></td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8}>No account data available.</td>
                  </tr>
                )
              ) : (
                <tr>
                  <td colSpan={8}>No account data available.</td>
                </tr>
              )
            )}
          </tbody>


        </table>
      </div>
    </div>
  );
};

export default TaskTable;
