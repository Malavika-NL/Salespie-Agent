import React from 'react';
import styles from './opportunityTable.module.css'; // Assuming you have a CSS module for styling

import {adminOpportunityFormData} from './slice/opportunityTableSlice'
import { useDispatch  } from 'react-redux';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState } from '../../app/store'; 

// Define some example data
interface DataRow {
  account_holder: string;
    account_name: string;
    opportunity: string;
    make: string;
    sub_make: string;
    sub_make_brand: string;
    pic: string;
    contact_person: string;
    designation: string;
    department: string;
    mobile_number: string;
    email_id: string;
    location: string;
    state: string;
    city: string;
    address: string;
    opportunity_description: string;
    qty: number;
    values: number;
    exp_closure_date: string;
    exp_po_date: string;
    remarks?: string | null;
    stage: string;
    lost_reason?: string | null;
    hardware_amount: number;
    software_amount: number;
    consumables_amount: number;
    automation_amount: number;
    solution_amount: number;
    maintenance_amount: number;
    others_amount: number;
    total_amount: number;
    status:string | null;
    vertical:string | null;
}

const toDisplayText = (value: unknown): string => {
  if (value == null) return '';
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (Array.isArray(value)) return value.map(toDisplayText).filter(Boolean).join(', ');
  if (typeof value === 'object') {
    const obj = value as Record<string, unknown>;
    return toDisplayText(obj.name ?? obj.title ?? obj.label ?? obj.ranks ?? obj.stages ?? obj.id ?? '');
  }
  return '';
};



const AdminOpportunityTable: React.FC = () => {

  const dispatch = useDispatch();

  useEffect(() => {
    const data = dispatch(adminOpportunityFormData() as any);
    console.log(data)
  }, [dispatch]);

  const { data, loading, error } = useSelector((state: RootState) => state.opportunityData);
  const reversedData = [...data].reverse();
  
  const navigate = useNavigate();
  const handleEditClick = (id: string) => {
    navigate(`/editOpportunityForm/${id}`);
  };

  return (
    <div className={styles.tableContainer}>
      <div className={styles.tableHeading}>Opportuntiy Table</div>
      <div className={styles.scrollableTable}>
      <table className={styles.table}>
          <thead>
            <tr>
              <th>Account Holder</th>
              <th>Account Name</th>
              <th>Opportunity</th>
              <th>Make</th>
              <th>Sub Make</th>
              <th>Sub Make Brand</th>
              <th>PIC</th>
              <th>Contact Person</th>
              <th>Designation</th>
              <th>Department</th>
              <th>Mobile Number</th>
              <th>Email ID</th>
              <th>Location</th>
              <th>State</th>
              <th>City</th>
              <th>Address</th>
              <th>Description</th>
              <th>Quantity</th>
              <th>Values</th>
              <th>Expected Closure Date</th>
              <th>Expected PO Date</th>
              <th>Remarks</th>
              <th>Stage</th>
              <th>Lost Reason</th>
              <th>Hardware Amount</th>
              <th>Software Amount</th>
              <th>Consumables Amount</th>
              <th>Automation Amount</th>
              <th>Solution Amount</th>
              <th>Maintenance Amount</th>
              <th>Others Amount</th>
              <th>Total Amount</th>
              <th>Vertical</th>
              <th>Edit</th>
            </tr>
          </thead>
          <tbody>
          {reversedData && reversedData.length > 0 ? (
            reversedData.map((row, rowIndex) => (
              <tr key={rowIndex}>
                 <td>{row.account_holder}</td>
                <td>{row.account_name}</td>
                <td>{row.opportunity}</td>
                <td>{row.make}</td>
                <td>{row.sub_make}</td>
                <td>{row.sub_make_brand}</td>
                <td>{toDisplayText(row.pic)}</td>
                <td>{row.contact_person}</td>
                <td>{row.designation}</td>
                <td>{row.department}</td>
                <td>{row.mobile_number}</td>
                <td>{row.email_id}</td>
                <td>{row.location}</td>
                <td>{row.state}</td>
                <td>{row.city}</td>
                <td>{row.address}</td>
                <td>{row.opportunity_description}</td>
                <td>{row.qty}</td>
                <td>{row.values}</td>
                <td>{row.exp_closure_date}</td>
                <td>{row.exp_po_date}</td>
                <td>{row.remarks}</td>
                <td>{toDisplayText(row.stage)}</td>
                <td>{toDisplayText(row.lost_reason)}</td>
                <td>{row.hardware_amount}</td>
                <td>{row.software_amount}</td>
                <td>{row.consumables_amount}</td>
                <td>{row.automation_amount}</td>
                <td>{row.solution_amount}</td>
                <td>{row.maintenance_amount}</td>
                <td>{row.others_amount}</td>
                <td>{row.total_amount}</td>
                <td>{row.vertical}</td>
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

export default AdminOpportunityTable;
