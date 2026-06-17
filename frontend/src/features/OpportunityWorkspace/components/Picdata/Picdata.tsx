// import React, { useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { addPicDetails } from "../../slice/opportunitySlice";
//  // Import the PicEditCard
// import styles from "./Picdata.module.css";
// import type { RootState } from "../../../../app/store";
// import PicEditCard from "./PicEditCard/PicEditCard";


// interface PicDataProps {
//   onDataChange: (field: string, value: any) => void;
// }

// const PicData: React.FC<PicDataProps> = ({ onDataChange }) => {
//   const dispatch = useDispatch();
//   const { formData } = useSelector((state: RootState) => state.postOpportunityWorkspaceData);
//   const [showEditCard, setShowEditCard] = useState(false);

//   const [localFormData, setLocalFormData] = useState({
//     pic_department: "",
//     pic_name: "",
//     pic_designation: "",
//     pic_email: "",
//     pic_phnone: "",
//     pic_phntwo: "",
//   });

  
//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setLocalFormData((prevState) => ({
//       ...prevState,
//       [name]: value,
//     }));
//   };

//   const handleAddPicDetails = () => {
//     const userConfirmed = window.confirm("Do you want to save the PIC details?");
    
//     if (userConfirmed) {
//       dispatch(addPicDetails(localFormData));
//       alert("PIC details saved successfully!");
//     } else {
//       alert("Save operation canceled.");
//     }
//   };

//   const handleEditClick = () => {
//     setShowEditCard(true);
//   };

//   const handleCloseEditCard = () => {
//     setShowEditCard(false);  // Close the edit card
//   };

//   return (
//     <div className={styles.picData}>
//       <h2 className={styles.heading}>PIC</h2>
//       <hr className={styles.line} />
      
//       <div className={styles.additionalContent}>
//         <div className={styles.detailBox}>
//           <div>
//             <label className={styles.texthead}>Department</label>
//             <input
//               className={styles.text}
//               type="text"
//               name="pic_department"
//               value={localFormData.pic_department}
//               placeholder="Enter Department"
//               onChange={handleInputChange}
//             />
//           </div>
//           <div>
//             <label className={styles.texthead}>Phone No. 1</label>
//             <input
//               className={styles.text}
//               type="text"
//               name="pic_phnone"
//               value={localFormData.pic_phnone}
//               placeholder="Enter Phone No. 1"
//               onChange={handleInputChange}
//             />
//           </div>
//         </div>

//         <div className={styles.detailBox}>
//           <div>
//             <label className={styles.texthead}>Name</label>
//             <input
//               className={styles.text}
//               type="text"
//               name="pic_name"
//               value={localFormData.pic_name}
//               placeholder="Enter Name"
//               onChange={handleInputChange}
//             />
//           </div>
//           <div>
//             <label className={styles.texthead}>Phone No. 2</label>
//             <input
//               className={styles.text}
//               type="text"
//               name="pic_phntwo"
//               value={localFormData.pic_phntwo}
//               placeholder="Enter Phone No. 2"
//               onChange={handleInputChange}
//             />
//           </div>
//         </div>

//         <div className={styles.detailBox}>
//           <div>
//             <label className={styles.texthead}>Designation</label>
//             <input
//               className={styles.text}
//               type="text"
//               name="pic_designation"
//               value={localFormData.pic_designation}
//               placeholder="Enter Designation"
//               onChange={handleInputChange}
//             />
//           </div>
//           <div>
//             <label className={styles.texthead}>Email</label>
//             <input
//               className={styles.text}
//               type="email"
//               name="pic_email"
//               value={localFormData.pic_email}
//               placeholder="Enter Email"
//               onChange={handleInputChange}
//             />
//           </div>
//         </div>
//       </div>

//       <div className={styles.buttonContainer}>
//         {/* <button className={styles.editButton} onClick={handleEditClick}>
//           Edit
//         </button> */}
//         <button className={styles.addButton} onClick={handleAddPicDetails}>
//           Save PIC Details
//         </button>
//       </div>

//       {/* {showEditCard && (
//         <PicEditCard onClose={handleCloseEditCard} />
//       )} */}
//     </div>
//   );
// };

// export default PicData;


// import React, { useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import type { RootState } from "../../../../app/store";
// import { IoAddCircleOutline } from "react-icons/io5";
// import styles from "./Picdata.module.css";

// import PicCard from "./PicCard/PicCard";
// import PicEditCard from "./PicEditCard/PicEditCard";
// import { addPicDetails } from "../../slice/opportunitySlice";

// interface PicDetails {
//   pic_department: string;
//   pic_name: string;
//   pic_designation: string;
//   pic_email: string;
//   pic_phnone: string;
//   pic_phntwo: string;
// }

// const PicData: React.FC = () => {
//   const dispatch = useDispatch();
//   const { formData } = useSelector((state: RootState) => state.postOpportunityWorkspaceData);

//   const opportunityPic = formData?.opportunity_pic || []; // Ensure opportunityPic is always an array

//   const [editIndex, setEditIndex] = useState<number | null>(null);

//   const handleAddPic = () => {
//     const newPic: PicDetails = {
//       pic_department: "",
//       pic_name: "",
//       pic_designation: "",
//       pic_email: "",
//       pic_phnone: "",
//       pic_phntwo: "",
//     };
//     dispatch(addPicDetails(newPic)); // Add a new empty PIC to Redux
//   };

//   const handleEditClick = (index: number) => {
//     setEditIndex(index);
//   };

//   const handleSaveEdit = (updatedPic: PicDetails, index: number) => {
//     const updatedPics = [...opportunityPic];
//     updatedPics[index] = updatedPic;
//     dispatch(addPicDetails(updatedPics)); // Update Redux state with edited PICs
//     setEditIndex(null);
//   };

//   return (
//     <div className={styles.picData}>
//       <h2 className={styles.heading}>PIC</h2>
//       <div className={styles.line}></div>
//       <div className={styles.cardContainer}>
//         {opportunityPic.map((pic: PicDetails, index: number) => (
//           <PicCard key={index} data={pic} onEdit={() => handleEditClick(index)} />
//         ))}

//       </div>
//       <div className={styles.buttonContainer}>
//         <button className={styles.addButton} onClick={handleAddPic}>
//           <IoAddCircleOutline /> Add PIC
//         </button>
//       </div>
//       {editIndex !== null && (
//         <PicEditCard
//           data={opportunityPic[editIndex]}
//           onSave={(updatedPic) => handleSaveEdit(updatedPic, editIndex)}
//           onClose={() => setEditIndex(null)}
//         />
//       )}
//     </div>
//   );
// };

// export default PicData;



import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../../../app/store";
import { IoAddCircleOutline } from "react-icons/io5";
import { Users } from "lucide-react";
import PicCard from "./PicCard/PicCard";
import PicEditCard from "./PicEditCard/PicEditCard";
import { addPicDetails } from "../../slice/opportunitySlice";

// ─── Types ────────────────────────────────────────────────────────────────────

interface PicDetails {
  pic_department: string;
  pic_name: string;
  pic_designation: string;
  pic_email: string;
  pic_phnone: string;
  pic_phntwo: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

const PicData: React.FC = () => {
  const dispatch = useDispatch();
  const { formData } = useSelector((state: RootState) => state.postOpportunityWorkspaceData);

  const opportunityPic = Array.isArray(formData?.opportunity_pic)
    ? formData.opportunity_pic
    : [];
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const handleAddPic = () => {
    const newPic: PicDetails = {
      pic_department: "", pic_name: "", pic_designation: "",
      pic_email: "", pic_phnone: "", pic_phntwo: "",
    };
    dispatch(addPicDetails(newPic));
  };

  const handleEditClick = (index: number) => setEditIndex(index);

  const handleSaveEdit = (updatedPic: PicDetails, index: number) => {
    const updatedPics = [...opportunityPic];
    updatedPics[index] = updatedPic;
    dispatch(addPicDetails(updatedPics));
    setEditIndex(null);
  };

  return (
    <div className="rounded-2xl border-2 border-indigo-100 shadow-lg overflow-hidden">

      {/* Gradient Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-violet-500 px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center">
            <Users size={15} color="white" />
          </div>
          <h2 className="text-sm font-bold text-white tracking-wide">PIC</h2>
          {opportunityPic.length > 0 && (
            <span className="bg-white/20 text-white text-xs font-bold px-2 py-0.5 rounded-full border border-white/30">
              {opportunityPic.length}
            </span>
          )}
        </div>
        <button
          onClick={handleAddPic}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition-colors"
        >
          <IoAddCircleOutline size={14} /> Add PIC
        </button>
      </div>

      {/* Body */}
      <div className="bg-white px-5 py-4 max-h-[320px] overflow-y-auto">

        {/* Empty state */}
        {opportunityPic.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 gap-2">
            <div className="text-4xl opacity-30">👤</div>
            <p className="text-sm text-slate-400 font-semibold m-0">No PIC added yet</p>
            <p className="text-xs text-slate-300 m-0">Click "Add PIC" to get started</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {opportunityPic.map((pic: PicDetails, index: number) => (
              <PicCard key={index} data={pic} onEdit={() => handleEditClick(index)} />
            ))}
          </div>
        )}

      </div>

      {/* Edit Modal */}
      {editIndex !== null && (
        <PicEditCard
          data={opportunityPic[editIndex]}
          onSave={(updatedPic) => handleSaveEdit(updatedPic, editIndex)}
          onClose={() => setEditIndex(null)}
        />
      )}

    </div>
  );
};

export default PicData;
