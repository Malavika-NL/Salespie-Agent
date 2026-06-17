// import React, { useState, useEffect } from "react";
// import { FaRegEdit } from "react-icons/fa";

// import styles from './Cards.module.css';
// import EditCard from "./EditCard/EditCard";

// interface CardProps {
//   category: string;
//   name: string;
//   designation: string;
//   mobile_no: string;
//   email_id: string;
//   index: number; // Add index to track the card's position
//   onSave: (updatedDetails: any, index: number) => void; // Pass both updated details and index
// }

// const Cards: React.FC<CardProps> = ({ name, designation, mobile_no, email_id, category, index, onSave }) => {
//   const [isEditing, setIsEditing] = useState(false);
//   const [cardDetails, setCardDetails] = useState({
//     category,
//     name,
//     designation,
//     mobile_no,
//     email_id,
//   });

//   useEffect(() => {
//     setCardDetails({ category, name, designation, mobile_no, email_id });
//   }, [category, name, designation, mobile_no, email_id]);

//   const handleEditClick = () => {
//     setIsEditing(true); // Open modal
//   };

//   const handleSave = (updatedDetails: typeof cardDetails) => {
//     setCardDetails(updatedDetails); // Update card details
//     setIsEditing(false); // Close modal
//     console.log('updatedDetails',updatedDetails)
//     onSave(updatedDetails, index); // Pass updated details and index to the parent
//   };

//   const handleClose = () => {
//     setIsEditing(false); // Close modal
//   };

//   return (
//     <>
//       <div className={styles.card}>
//         <div className={styles.cardHeading}>
//           <div className={styles.head}>{cardDetails.category}</div>
//           <div className={styles.iconContainer}>
//             {/* <LuPlusCircle className={styles.icon} /> */}
//             <FaRegEdit className={styles.icon} onClick={handleEditClick} /> {/* Open modal */}
//           </div>
//         </div>

//         {/* Card Content */}
//         <div className={styles.cardContent}>
//           <div className={styles.row}>
//             <div className={styles.cardItem}>
//               <div className={styles.Box1}>
//                 <p className={styles.texthead}>Name</p>
//                 <p className={styles.text}>{cardDetails.name}</p>
//               </div>
//             </div>
//             <div className={styles.cardItem}>
//               <div className={styles.Box2}>
//                 <p className={styles.texthead}>Designation</p>
//                 <p className={styles.text}>{cardDetails.designation}</p>
//               </div>
//             </div>
//           </div>
//           <div className={styles.row}>
//             <div className={styles.cardItem}>
//               <div className={styles.Box1}>
//                 <p className={styles.texthead}>Mobile No.</p>
//                 <p className={styles.text}>{cardDetails.mobile_no}</p>
//               </div>
//             </div>
//             <div className={styles.cardItem2}>
//               <div className={styles.Box2}>
//                 <p className={styles.texthead}>EmailID</p>
//                 <p className={styles.text}>{cardDetails.email_id}</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* EditCard Modal */}
//       {isEditing && (
//         <EditCard
//           category={cardDetails.category}
//           name={cardDetails.name}
//           designation={cardDetails.designation}
//           mobile_no={cardDetails.mobile_no}
//           email_id={cardDetails.email_id}
//           onSave={handleSave} // Save changes
//           onClose={handleClose} // Close modal
//         />
//       )}
//     </>
//   );
// };

// export default Cards;



import React, { useState, useEffect } from "react";
import { FaRegEdit } from "react-icons/fa";
import EditCard from "./EditCard/EditCard";

// ─── Types ────────────────────────────────────────────────────────────────────

interface CardProps {
  category: string;
  name: string;
  designation: string;
  mobile_no: string;
  email_id: string;
  index: number;
  onSave: (updatedDetails: any, index: number) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

const Cards: React.FC<CardProps> = ({ name, designation, mobile_no, email_id, category, index, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [cardDetails, setCardDetails] = useState({ category, name, designation, mobile_no, email_id });

  useEffect(() => {
    setCardDetails({ category, name, designation, mobile_no, email_id });
  }, [category, name, designation, mobile_no, email_id]);

  const handleEditClick = () => setIsEditing(true);

  const handleSave = (updatedDetails: typeof cardDetails) => {
    setCardDetails(updatedDetails);
    setIsEditing(false);
    console.log('updatedDetails', updatedDetails);
    onSave(updatedDetails, index);
  };

  const handleClose = () => setIsEditing(false);

  return (
    <>
      <div className="rounded-xl border-2 border-blue-100 shadow-md overflow-hidden hover:shadow-lg hover:border-blue-300 transition-all duration-200 w-full">

        {/* Card Header */}
        <div className="flex items-center justify-between px-3 py-2 bg-gradient-to-r from-blue-600 to-indigo-500">
          <span className="text-xs font-bold text-white capitalize truncate">
            {cardDetails.category.replace(/_/g, ' ')}
          </span>
          <button
            onClick={handleEditClick}
            className="p-1 rounded-md bg-white/20 hover:bg-white/40 text-white transition-colors shrink-0"
            title="Edit contact"
          >
            <FaRegEdit size={11} />
          </button>
        </div>

        {/* Card Body */}
        <div className="p-3 grid grid-cols-2 gap-x-2 gap-y-2 bg-white">
          <div className="flex flex-col gap-0.5 min-w-0">
            <p className="text-[10px] font-semibold text-blue-400 uppercase tracking-wide">Name</p>
            <p className="text-xs font-bold text-slate-700 truncate" title={cardDetails.name}>{cardDetails.name || '—'}</p>
          </div>
          <div className="flex flex-col gap-0.5 min-w-0">
            <p className="text-[10px] font-semibold text-blue-400 uppercase tracking-wide">Designation</p>
            <p className="text-xs font-bold text-slate-700 truncate" title={cardDetails.designation}>{cardDetails.designation || '—'}</p>
          </div>
          <div className="flex flex-col gap-0.5 min-w-0">
            <p className="text-[10px] font-semibold text-blue-400 uppercase tracking-wide">Mobile</p>
            <p className="text-xs font-bold text-slate-700 truncate" title={cardDetails.mobile_no}>{cardDetails.mobile_no || '—'}</p>
          </div>
          <div className="flex flex-col gap-0.5 min-w-0">
            <p className="text-[10px] font-semibold text-blue-400 uppercase tracking-wide">Email</p>
            <p className="text-xs font-bold text-slate-700 truncate" title={cardDetails.email_id}>{cardDetails.email_id || '—'}</p>
          </div>
        </div>
      </div>

      {isEditing && (
        <EditCard
          category={cardDetails.category}
          name={cardDetails.name}
          designation={cardDetails.designation}
          mobile_no={cardDetails.mobile_no}
          email_id={cardDetails.email_id}
          onSave={handleSave}
          onClose={handleClose}
        />
      )}
    </>
  );
};

export default Cards;