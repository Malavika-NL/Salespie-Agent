import React from 'react';
import styles from './table.module.css'; // Import the CSS module

interface Customer {
    companyName: string;
    location: string;
    contactPersonName: string;
    designation: string;
    contactNumber: string;
    emailId: string;
    referenceContactName: string;
    referenceContactNumber: string;
    referenceContactEmail: string;
}

const customers: Customer[] = [
    {
        companyName: 'Swiggy',
        location: 'Gurgaon',
        contactPersonName: 'Arun Shankar',
        designation: 'Asst. Manager',
        contactNumber: '9985485756',
        emailId: 'arun.shankar@swiggy.com',
        referenceContactName: 'Hari Krishnu',
        referenceContactNumber: '6954587854',
        referenceContactEmail: 'hari.krishnu@swiggy.com',
    },
    {
        companyName: 'Zomato',
        location: 'Mumbai',
        contactPersonName: 'Ram Prasad',
        designation: 'Manager',
        contactNumber: '9854875484',
        emailId: 'ram.prasad@zomato.com',
        referenceContactName: 'Krishnu Kumar',
        referenceContactNumber: '6365895478',
        referenceContactEmail: 'krishnu.kumar@zomato.com',
    },
    {
        companyName: 'Blinkit',
        location: 'Delhi',
        contactPersonName: 'Sangeeth Rao',
        designation: 'Senior Sales Officer',
        contactNumber: '8545878965',
        emailId: 'sangeeth.rao@blinkit.com',
        referenceContactName: 'Sreenivas Reddy',
        referenceContactNumber: '9568254125',
        referenceContactEmail: 'sreenivas.reddy@blinkit.com',
    },
    {
        companyName: 'Zepto',
        location: 'Haryana',
        contactPersonName: 'Pratheek Sharma',
        designation: 'General Manager',
        contactNumber: '9658475236',
        emailId: 'pratheek.sharma@zepto.com',
        referenceContactName: 'Prabhakar Rao',
        referenceContactNumber: '9584785236',
        referenceContactEmail: 'prabhakar.rao@zepto.com',
    },
    {
        companyName: 'Honda',
        location: 'Kerala',
        contactPersonName: 'Pradeep Menon',
        designation: 'Production Manager',
        contactNumber: '9632548798',
        emailId: 'pradeep.menon@honda.com',
        referenceContactName: 'Ramachandran Pillai',
        referenceContactNumber: '9745685968',
        referenceContactEmail: 'ramachandran.pillai@honda.com',
    },
    {
        companyName: 'Hero',
        location: 'Tamil Nadu',
        contactPersonName: 'Sharan Kumar',
        designation: 'Mfg Head',
        contactNumber: '9351245893',
        emailId: 'sharan.kumar@hero.com',
        referenceContactName: 'Karthik Iyer',
        referenceContactNumber: '9845789566',
        referenceContactEmail: 'karthik.iyer@hero.com',
    },
    {
        companyName: 'Myntra',
        location: 'Hyderabad',
        contactPersonName: 'Prakash Reddy',
        designation: 'Supply Chain Head',
        contactNumber: '9562324587',
        emailId: 'prakash.reddy@myntra.com',
        referenceContactName: 'Rajeev Nair',
        referenceContactNumber: '6589845789',
        referenceContactEmail: 'rajeev.nair@myntra.com',
    },
    {
        companyName: 'Flipkart',
        location: 'Mumbai',
        contactPersonName: 'Haripreet Singh',
        designation: 'Manager',
        contactNumber: '6325654789',
        emailId: 'haripreet.singh@flipkart.com',
        referenceContactName: 'Prakyath Jain',
        referenceContactNumber: '9425878985',
        referenceContactEmail: 'prakyath.jain@flipkart.com',
    },
    {
        companyName: 'Meesho',
        location: 'Uttar Pradesh',
        contactPersonName: 'Neerav Patel',
        designation: 'Asst. Manager',
        contactNumber: '9545878956',
        emailId: 'neerav.patel@meesho.com',
        referenceContactName: 'Akhil Saxena',
        referenceContactNumber: '9865234125',
        referenceContactEmail: 'akhil.saxena@meesho.com',
    },
];


const TargetCustomerTable: React.FC = () => {
    return (
        <div className={styles.tablecontainer}>
            <div className={styles.tableHeaderContainer}>
                <h4 className={styles.tableHeader}>Target Customer Table</h4>
                {/* <button className={styles.addCustomerButton}>Add Customer</button> */}
            </div>
            <table className={styles.customerTable}>
                <thead>
                    <tr>
                        <th>Company Name</th>
                        <th>Location</th>
                        <th>Person Name</th>
                        <th>Designation</th>
                        <th>Number</th>
                        <th>Email Id</th>
                        <th>Reference Name</th>
                        <th>Reference Number</th>
                        <th>Reference Email</th>
                    </tr>
                </thead>
                <tbody>
                    {customers.map((customer, index) => (
                        <tr key={index}>
                            <td>{customer.companyName}</td>
                            <td>{customer.location}</td>
                            <td>{customer.contactPersonName}</td>
                            <td>{customer.designation}</td>
                            <td>{customer.contactNumber}</td>
                            <td>{customer.emailId}</td>
                            <td>{customer.referenceContactName}</td>
                            <td>{customer.referenceContactNumber}</td>
                            <td>{customer.referenceContactEmail}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TargetCustomerTable;
