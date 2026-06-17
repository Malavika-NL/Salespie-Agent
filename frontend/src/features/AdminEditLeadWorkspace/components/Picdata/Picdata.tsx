// import React, { useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import type { RootState } from "../../../../app/store";
// import { IoAddCircleOutline } from "react-icons/io5";
// import styles from "./Picdata.module.css";

// import PicCard from "./PicCard/PicCard";
// import PicEditCard from "./PicEditCard/PicEditCard";
// import { addPicDetails } from "../../slice/AdminEditLeadWorkspaceSlice";

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
//   const { formData } = useSelector((state: RootState) => state.AdminEditLeadWorkspaceData);

//   const leadPic = formData?.lead_pic || []; // Ensure leadPic is always an array

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
//     const updatedPics = [...leadPic];
//     updatedPics[index] = updatedPic;
//     dispatch(addPicDetails(updatedPics)); // Update Redux state with edited PICs
//     setEditIndex(null);
//   };

//   return (
//     <div className={styles.picData}>
//       <h2 className={styles.heading}>PIC</h2>
//       <div className={styles.line}></div>
//       <div className={styles.cardContainer}>
//         {leadPic.map((pic: PicDetails, index: number) => (
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
//           data={leadPic[editIndex]}
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
import { addPicDetails } from "../../slice/AdminEditLeadWorkspaceSlice";

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
  const { formData } = useSelector((state: RootState) => state.AdminEditLeadWorkspaceData);

  const leadPic = formData?.lead_pic || []; // Ensure leadPic is always an array

  const [editIndex, setEditIndex] = useState<number | null>(null);

  const handleAddPic = () => {
    const newPic: PicDetails = {
      pic_department: "",
      pic_name: "",
      pic_designation: "",
      pic_email: "",
      pic_phnone: "",
      pic_phntwo: "",
    };
    dispatch(addPicDetails(newPic)); // Add a new empty PIC to Redux
  };

  const handleEditClick = (index: number) => {
    setEditIndex(index);
  };

  const handleSaveEdit = (updatedPic: PicDetails, index: number) => {
    const updatedPics = [...leadPic];
    updatedPics[index] = updatedPic;
    dispatch(addPicDetails(updatedPics)); // Update Redux state with edited PICs
    setEditIndex(null);
  };

  return (
    <div className="rounded-2xl border-2 border-violet-100 shadow-lg">

      {/* Gradient Header */}
      <div className="bg-gradient-to-r from-violet-600 to-indigo-500 px-5 py-3 flex items-center justify-between rounded-t-2xl">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center">
            <Users size={15} color="white" />
          </div>
          <h2 className="text-sm font-bold text-white tracking-wide">PIC</h2>
          {leadPic.length > 0 && (
            <span className="bg-white/20 text-white text-xs font-bold px-2 py-0.5 rounded-full border border-white/30">
              {leadPic.length}
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
      <div className="bg-white px-5 py-4 max-h-[320px] overflow-y-auto rounded-b-2xl">

        {/* Empty state */}
        {leadPic.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 gap-2">
            <div className="text-4xl opacity-30">👤</div>
            <p className="text-sm text-slate-400 font-semibold m-0">No PIC added yet</p>
            <p className="text-xs text-slate-300 m-0">Click "Add PIC" to get started</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {leadPic.map((pic: PicDetails, index: number) => (
              <PicCard key={index} data={pic} onEdit={() => handleEditClick(index)} />
            ))}
          </div>
        )}

      </div>

      {/* Edit Modal */}
      {editIndex !== null && (
        <PicEditCard
          data={leadPic[editIndex]}
          onSave={(updatedPic) => handleSaveEdit(updatedPic, editIndex)}
          onClose={() => setEditIndex(null)}
        />
      )}

    </div>
  );
};

export default PicData;
