// import React from "react";
// import styles from "./PicCard.module.css";

// interface PicCardProps {
//     data: {
//         pic_department: string;
//         pic_name: string;
//         pic_designation: string;
//         pic_email: string;
//         pic_phnone: string;
//         pic_phntwo: string;
//     };
//     onEdit: () => void;
// }

// const PicCard: React.FC<PicCardProps> = ({ data, onEdit }) => {
//     return (
//         <div className={styles.card}>
//             <div className={styles.cardDetails}>
//                 {/* First line: 4 label-value pairs */}
//                 <div className={styles.firstLine}>
//                     <div className={styles.lineItem}>
//                         <p className={styles.label}>Name:</p>
//                         <p className={`${styles.value} ${data?.pic_name === '' ? styles.defaultselect : ''}`}>{data.pic_name || "Enter Name"}</p>
//                     </div>
//                     <div className={styles.lineItem}>
//                         <p className={styles.label}>Designation:</p>
//                         <p className={`${styles.value} ${data?.pic_designation === '' ? styles.defaultselect : ''}`}>{data.pic_designation || "Enter Name"}</p>
//                     </div>
//                     <div className={styles.lineItem}>
//                         <p className={styles.label}>Department:</p>
//                         <p className={`${styles.value} ${data?.pic_department === '' ? styles.defaultselect : ''}`}>{data.pic_department || "Enter Department"}</p>
//                     </div>
//                     <div className={styles.lineItem}>
//                         <p className={styles.label}>Email:</p>
//                         <p className={`${styles.value} ${data?.pic_email === '' ? styles.defaultselect : ''}`}>{data.pic_email || "Enter Email"}</p>
//                     </div>
//                 </div>

                
//                 <div className={styles.secondLine}>
                  
//                         <div className={styles.lineItem}>
//                             <p className={styles.label}>Phone No</p>
//                             <p className={`${styles.value} ${data?.pic_phnone === '' ? styles.defaultselect : ''}`}>{data.pic_phnone || "Enter Phone No"}</p>
//                         </div>
//                         <div className={styles.lineItem}>
//                             <p className={styles.label}>Alternate Phone No</p>
//                             <p  className={`${styles.value} ${data?.pic_phntwo === '' ? styles.defaultselect : ''}`}>{data.pic_phntwo || "Enter Phone No"}</p>
//                         </div>
                        
//                         <button className={styles.editButton} onClick={onEdit}>
//                             Edit
//                         </button>
//                     </div>

//                     {/* Edit Button */}

//             </div>
//         </div>
//     );
// };

// export default PicCard;




import React from "react";
import { FaRegEdit } from "react-icons/fa";
import { User } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface PicCardProps {
  data: {
    pic_department: string;
    pic_name: string;
    pic_designation: string;
    pic_email: string;
    pic_phnone: string;
    pic_phntwo: string;
  };
  onEdit: () => void;
}

// ─── Helper ───────────────────────────────────────────────────────────────────

const Field: React.FC<{ label: string; value: string; placeholder: string }> = ({ label, value, placeholder }) => (
  <div className="flex flex-col gap-0.5 min-w-0">
    <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-wide m-0">{label}</p>
    <p className={`text-sm font-semibold m-0 truncate ${!value ? "text-slate-400 font-normal" : "text-slate-800"}`}>
      {value || placeholder}
    </p>
  </div>
);

// ─── Component ────────────────────────────────────────────────────────────────

const PicCard: React.FC<PicCardProps> = ({ data, onEdit }) => {
  return (
    <div className="rounded-2xl border-2 border-indigo-100 shadow-lg overflow-hidden">

      {/* Gradient Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-violet-500 px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center">
            <User size={15} color="white" />
          </div>
          <h2 className="text-sm font-bold text-white tracking-wide">
            {data.pic_name || "PIC Details"}
          </h2>
        </div>
        <button
          onClick={onEdit}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition-colors"
        >
          <FaRegEdit size={12} /> Edit
        </button>
      </div>

      {/* Card Body */}
      <div className="bg-white px-5 py-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-6 gap-y-4">
          <Field label="Name"        value={data.pic_name}        placeholder="Enter Name"        />
          <Field label="Designation" value={data.pic_designation}  placeholder="Enter Designation" />
          <Field label="Department"  value={data.pic_department}   placeholder="Enter Department"  />
          <Field label="Email"       value={data.pic_email}        placeholder="Enter Email"       />
          <Field label="Phone No"    value={data.pic_phnone}       placeholder="Enter Phone No"    />
          <Field label="Alt. Phone"  value={data.pic_phntwo}       placeholder="Enter Phone No"    />
        </div>
      </div>

    </div>
  );
};

export default PicCard;
