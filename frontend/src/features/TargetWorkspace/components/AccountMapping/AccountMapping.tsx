// import React, { useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import type { RootState } from '../../../../app/store';

// import styles from './AccountMapping.module.css';
// import Cards from './Cards';
// import AddContactForm from './AddContactForm/AddContactForm';
// import { IoAddCircleOutline } from 'react-icons/io5';
// import { addContact, updateContact } from '../../Slice/TargetWorkspaceSlice';

// interface Contact {
//   category: string;
//   name: string;
//   designation: string;
//   mobile_no: string;
//   email_id: string;
// }


// const AccountMapping: React.FC = () => {
//   const dispatch = useDispatch();

//   // Access contacts from formData in the Redux state
//   const contacts = useSelector(
//     (state: RootState) => state.TargetWorkspaceData.formData?.targetcontacts || []
//   );

//   const [showForm, setShowForm] = useState(false);

//   const handleAddContactClick = () => {
//     setShowForm(!showForm);
//   };

//   const handleAddContact = (newContact: Contact) => {
//     dispatch(addContact(newContact)); // Dispatch addContact action
//     setShowForm(false); // Close the form
//   };

//   const handleSaveContact = (updatedDetails: Contact, index: number) => {
//     dispatch(updateContact({ updatedContact: updatedDetails, index })); // Dispatch updateContact action
//   };

//   const chunkData = (data: typeof contacts, size: number) => {
//     const chunks = [];
//     for (let i = 0; i < data.length; i += size) {
//       chunks.push(data.slice(i, i + size));
//     }
//     return chunks;
//   };

//   const addPlaceholders = (rows: typeof contacts[]) => {
//     return rows.map((row) => {
//       const placeholdersNeeded = 5 - row.length;
//       return [...row, ...Array(placeholdersNeeded).fill(null)];
//     });
//   };

//   const rows = addPlaceholders(chunkData(contacts, 5));

//   return (
//     <div className={styles.container}>
//       <div className={styles.header}>
//         <p className={styles.heading}>Account Mapping</p>
//       </div>
//       <div className={styles.dashedLine}></div>
//       <div className={styles.gridContainer}>
//         <div className={styles.fixedWidthDiv}>
//           <div className={styles.hq}>HQ</div>
//           <div className={styles.arrow}>
//             <div className={styles.arrowTail}></div>
//             <div className={styles.arrowHead}></div>
//           </div>
//         </div>
//         <div className={styles.flexibleWidthDiv}>
//           {rows.map((row, rowIndex) => (
//             <div key={rowIndex} className={styles.row}>
//               {row.map((contact, index) =>
//                 contact ? (
//                   <div key={index} className={styles.box}>
//                     <Cards
//                       category={contact.category}
//                       name={contact.name}
//                       designation={contact.designation}
//                       mobile_no={contact.mobile_no}
//                       email_id={contact.email_id}
//                       index={index}
//                       onSave={handleSaveContact} // Handle save
//                     />
//                   </div>
//                 ) : (
//                   <div key={index} className={styles.hiddenCard}></div>
//                 )
//               )}
//             </div>
//           ))}
//         </div>
//       </div>
//       <div className={styles.buttonContainer}>
//         {!showForm && (
//           <button onClick={handleAddContactClick} className={styles.addButton}>
//             <IoAddCircleOutline /> Add Contact
//           </button>
//         )}
//       </div>
//       {showForm && (
//         <AddContactForm
//           onAddContact={handleAddContact}
//           onCancel={handleAddContactClick}
//         />
//       )}
//     </div>
//   );
// };

// export default AccountMapping;




import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../../../app/store';
import Cards from './Cards';
import AddContactForm from './AddContactForm/AddContactForm';
import { IoAddCircleOutline } from 'react-icons/io5';
import { addContact, updateContact } from '../../Slice/TargetWorkspaceSlice';
import { GitBranch } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Contact {
  category: string;
  name: string;
  designation: string;
  mobile_no: string;
  email_id: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

const AccountMapping: React.FC = () => {
  const dispatch = useDispatch();

  const contacts = useSelector(
    (state: RootState) => state.TargetWorkspaceData.formData?.targetcontacts || []
  );

  const [showForm, setShowForm] = useState(false);

  const handleAddContactClick = () => setShowForm(!showForm);

  const handleAddContact = (newContact: Contact) => {
    dispatch(addContact(newContact));
    setShowForm(false);
  };

  const handleSaveContact = (updatedDetails: Contact, index: number) => {
    dispatch(updateContact({ updatedContact: updatedDetails, index }));
  };

  const chunkData = (data: typeof contacts, size: number) => {
    const chunks = [];
    for (let i = 0; i < data.length; i += size) chunks.push(data.slice(i, i + size));
    return chunks;
  };

  const addPlaceholders = (rows: typeof contacts[]) =>
    rows.map(row => [...row, ...Array(5 - row.length).fill(null)]);

  const rows = addPlaceholders(chunkData(contacts, 5));

  return (
    <div className="rounded-2xl border-2 border-blue-100 shadow-lg my-5">

      {/* Gradient Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-500 px-5 py-3 flex items-center justify-between rounded-t-2xl">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center">
            <GitBranch size={15} color="white" />
          </div>
          <h2 className="text-sm font-bold text-white tracking-wide">Account Mapping</h2>
        </div>
        {!showForm && (
          <button
            onClick={handleAddContactClick}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition-colors"
          >
            <IoAddCircleOutline size={14} /> Add Contact
          </button>
        )}
      </div>

      {/* Body */}
      <div className="bg-white px-5 py-4 rounded-b-2xl">
        <div className="flex gap-4 w-full">

          {/* HQ node */}
          <div className="flex flex-col items-center justify-start pt-1 shrink-0">
            <div className="bg-gradient-to-b from-blue-600 to-indigo-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow">
              HQ
            </div>
            {contacts.length > 0 && <div className="w-0.5 flex-1 bg-blue-200 mt-2" />}
          </div>

          {/* Contacts grid */}
          <div className="flex flex-col gap-3 w-full">
            {contacts.length === 0 ? (
              <div className="flex items-center justify-center h-20 rounded-xl border-2 border-dashed border-blue-200 bg-blue-50/30 text-sm text-blue-400 font-medium">
                No contacts yet — click "Add Contact" to begin
              </div>
            ) : (
              rows.map((row, rowIndex) => (
                <div key={rowIndex} className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {row.map((contact, index) =>
                    contact ? (
                      <Cards
                        key={index}
                        category={contact.category}
                        name={contact.name}
                        designation={contact.designation}
                        mobile_no={contact.mobile_no}
                        email_id={contact.email_id}
                        index={index}
                        onSave={handleSaveContact}
                      />
                    ) : (
                      <div key={index} className="invisible" />
                    )
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Add Contact Modal */}
      {showForm && (
        <AddContactForm
          onAddContact={handleAddContact}
          onCancel={handleAddContactClick}
        />
      )}
    </div>
  );
};

export default AccountMapping;
