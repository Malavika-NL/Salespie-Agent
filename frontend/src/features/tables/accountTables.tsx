// import React from 'react';
// import styles from './tables.module.css'; // Assuming you have a CSS module for styling

// // Define some example data
// interface DataRow {
//   col1: string;
//   col2: string;
//   col3: string;
//   col4: string;
//   col5: string;
//   col6: string;
//   col7: string;
//   col8: string;
//   col9: string;
//   col10: string;
//   col11: string;
//   col12: string;
  

// }

// const data: DataRow[] = [
//   { col1: 'Row 1 Col 1', col2: ' Row 1 Col 2Row 1 Col 2Row 1 Col 2Row 1 Col 2Row 1 Col 2Row 1 Col 2 ', col3: 'Row 1 Col 3',col4: 'Row 1 Col 1', col5: 'Row 1 Col 2', col6: 'Row 1 Col 3', col7: 'Row 1 Col 1', col8: 'Row 1 Col 2', col9: 'Row 1 Col 3',col10: 'Row 1 Col 1', col11: 'Row 1 Col 2', col12: 'Row 1 Col 3'}

//   // Add more rows as needed
// ];

// const TableComponent: React.FC = () => {
//   return (
//     <div className={styles.tableContainer}>
//       <div className={styles.tableHeading}>Account Table</div>
//       <table className={styles.table}>
//         <thead>
//           <tr>
//             <th>Account Holder</th>
//             <th>Account Name</th>
//             <th> Vertical</th>
//             <th>Region</th>
//             <th>PIC</th>
//             <th>Designation</th>
//             <th>Mobile Number</th>
//             <th>Email ID</th>
//             <th>Location</th>
//             <th>Business</th>
//             <th>Account Created Date</th>
//             <th>Action</th>

//           </tr>
//         </thead>
//         <tbody>
//           {data.map((row, rowIndex) => (
//             <tr key={rowIndex}>
//               <td>{row.col1}</td>
//               <td>{row.col2}</td>
//               <td>{row.col3}</td>
//               <td>{row.col4}</td>
//               <td>{row.col5}</td>
//               <td>{row.col6}</td>
//               <td>{row.col7}</td>
//               <td>{row.col8}</td>
//               <td>{row.col9}</td>
//               <td>{row.col10}</td>
//               <td>{row.col11}</td>
//               <td>{row.col12}</td>
          
       
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };


// // .tableHeading{
// //   margin-top:1% ;
// //   width: 200px;
// //   margin-bottom: 1%;
// //   margin-left: auto;
// //   margin-right: auto;
// //   font-weight: 700;
// //   font-size: 24px;
// // }
// export default TableComponent;


import React from 'react';
import styles from './accountTable.module.css'; // Assuming you have a CSS module for styling
import { accountFormData } from './slice/tablesSlice';
import { useDispatch  } from 'react-redux';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../app/store'; 
import { useNavigate } from 'react-router-dom';




const TableComponent: React.FC = () => {

  const dispatch = useDispatch();

  useEffect(() => { 
    const data = dispatch(accountFormData() as any);
    console.log(data)
  }, [dispatch]);

  const { data, loading, error } = useSelector((state: RootState) => state.accountData);
  const reversedData = [...data].reverse();
  console.log(reversedData)
  const navigate = useNavigate();
  const handleEditClick = (id: string) => {
    navigate(`/editaccountworkspace/${id}`);
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

export default TableComponent;
