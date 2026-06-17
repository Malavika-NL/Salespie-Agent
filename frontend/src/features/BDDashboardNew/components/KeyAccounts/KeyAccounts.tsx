// import React, { useState, useEffect, useRef } from "react";
// import { FaCheckCircle } from "react-icons/fa";
// import { FaClock } from "react-icons/fa6";
// import styles from "./KeyAccounts.module.css";

// const KeyAccounts: React.FC = () => {
  
//   const [data, setData] = useState([
//     {
//       company: "Honda",
//       companybg: "#FCC700",
//       companycolor: "#FFF5D2",
//       content: [
//         { head: "Mapping", status: "Completed" },
//         { head: "Target Campaign", status: "Completed" },
//         { head: "F to F Meeting", status: "Completed" },
//         { head: "Opps- Identification", status: "Completed" },
//         { head: "Quotation", status: "Pending" },
//         { head: "P.O", status: "" },
//         { head: "Repeat P.O", status: "" },
//         { head: "Third P.O", status: "" },
//       ],
//     },
//     {
//       company: "Maruthi",
//       companybg: "#F3426E",
//       companycolor: "#FFEAF1",
//       content: [
//         { head: "Mapping", status: "Completed" },
//         { head: "Target Campaign", status: "Completed" },
//         { head: "F to F Meeting", status: "Completed" },
//         { head: "Opps- Identification", status: "Pending" },
//         { head: "Quotation", status: "" },
//         { head: "P.O", status: "" },
//         { head: "Repeat P.O", status: "" },
//         { head: "Third P.O", status: "" },
//       ],
//     },
//     {
//       company: "RE",
//       companybg: "#58BAAB",
//       companycolor: "#CEF9F3",
//       content: [
//         { head: "Mapping", status: "Completed" },
//         { head: "Target Campaign", status: "Completed" },
//         { head: "F to F Meeting", status: "Completed" },
//         { head: "Opps- Identification", status: "Completed" },
//         { head: "Quotation", status: "Completed" },
//         { head: "P.O", status: "Completed" },
//         { head: "Repeat P.O", status: "Pending" },
//         { head: "Third P.O", status: "" },
//       ],
//     },
//     {
//       company: "Hero",
//       companybg: "#019FF8",
//       companycolor: "#D3F1FF",
//       content: [
//         { head: "Mapping", status: "Completed" },
//         { head: "Target Campaign", status: "Completed" },
//         { head: "F to F Meeting", status: "Pending" },
//         { head: "Opps- Identification", status: "" },
//         { head: "Quotation", status: "" },
//         { head: "P.O", status: "" },
//         { head: "Repeat P.O", status: "" },
//         { head: "Third P.O", status: "" },
//       ],
//     },
//     {
//       company: "TVS",
//       companybg: "#C036BB",
//       companycolor: "#FFD5FE",
//       content: [
//         { head: "Mapping", status: "Completed" },
//         { head: "Target Campaign", status: "Completed" },
//         { head: "F to F Meeting", status: "Completed" },
//         { head: "Opps- Identification", status: "Pending" },
//         { head: "Quotation", status: "" },
//         { head: "P.O", status: "" },
//         { head: "Repeat P.O", status: "" },
//         { head: "Third P.O", status: "" },
//       ],
//     },
//   ]);

//   const [popupIndex, setPopupIndex] = useState<{
//     companyIndex: number;
//     contentIndex: number;
//   } | null>(null);

//   const popupRef = useRef<HTMLDivElement | null>(null);

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (
//         popupRef.current &&
//         !popupRef.current.contains(event.target as Node)
//       ) {
//         setPopupIndex(null); // Close popup
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   const handleStatusChange = (
//     companyIndex: number,
//     contentIndex: number,
//     newStatus: string
//   ) => {
//     const updatedData = [...data];
//     updatedData[companyIndex].content[contentIndex].status = newStatus;
//     setData(updatedData);
//     setPopupIndex(null); // Close the popup
//   };

//   return (
//     <div className={styles.container}>
//       <div className={styles.head}>Key Accounts</div>
//       {data.map((company, companyIndex) => (
//         <div key={companyIndex} className={styles.row}>
//           <div className={styles.boxPrimary}>
//             <div
//               className={styles.innerBoxsquare}
//               style={{ backgroundColor: company.companybg }}
//             ></div>
//             <div className={styles.innerBoxname}>{company.company}</div>
//           </div>
//           {company.content.map((item, contentIndex) => (
//             <div className={styles.box} key={contentIndex}>
//               <div
//                 className={styles.innerBoxhead}
//                 style={{ backgroundColor: company.companycolor }}
//                 onClick={() => setPopupIndex({ companyIndex, contentIndex })}
//               >
//                 {item.head}
//               </div>
//               <div
//                 className={`${styles.innerBoxstatus} ${
//                   item.status === "Pending"
//                     ? styles.statusPending
//                     : item.status === "Completed"
//                     ? styles.statusCompleted
//                     : ""
//                 }`}
//               >
//                 {item.status === "Pending" ? (
//                   <>
//                     <FaClock style={{ marginRight: "5px" }} />
//                     {item.status}
//                   </>
//                 ) : item.status === "Completed" ? (
//                   <>
//                     <FaCheckCircle style={{ marginRight: "5px" }} />
//                     {item.status}
//                   </>
//                 ) : (
//                   item.status
//                 )}
//               </div>

//               {popupIndex &&
//                 popupIndex.companyIndex === companyIndex &&
//                 popupIndex.contentIndex === contentIndex && (
//                   <div
//                     className={styles.popup}
//                     ref={popupRef}
//                   >
//                     <div
//                       className={styles.pending}
//                       onClick={() =>
//                         handleStatusChange(companyIndex, contentIndex, "Pending")
//                       }
//                     >
//                       Pending
//                     </div>
//                     <div
//                       className={styles.completed}
//                       onClick={() =>
//                         handleStatusChange(
//                           companyIndex,
//                           contentIndex,
//                           "Completed"
//                         )
//                       }
//                     >
//                       Completed
//                     </div>
//                   </div>
//                 )}
//             </div>
//           ))}
//         </div>
//       ))}
//     </div>
//   );
// };

// export default KeyAccounts;
import React, { useState, useEffect } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { FaClock } from "react-icons/fa6";
import styles from "./KeyAccounts.module.css";
import accountData from "../../../../data/accountData.json";

type ContentItem = {
  head: string;
  status: string;
};

type Company = {
  company: string;
  companybg: string;
  companycolor: string;
  content: ContentItem[];
};

const LOCAL_STORAGE_KEY = "accountData";

const KeyAccounts: React.FC = () => {
  // Load data from localStorage or fallback to accountData.json
  const [data, setData] = useState<Company[]>(() => {
    const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    return savedData ? JSON.parse(savedData) : accountData.companies;
  });

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const [popupIndex, setPopupIndex] = useState<{ companyIndex: number; contentIndex: number } | null>(null);

  const handleStatusChange = (companyIndex: number, contentIndex: number, newStatus: string) => {
    setData((prevData) => {
      const updatedData = prevData.map((company, cIndex) =>
        cIndex === companyIndex
          ? {
              ...company,
              content: company.content.map((item, iIndex) =>
                iIndex === contentIndex ? { ...item, status: newStatus } : item
              ),
            }
          : company
      );

      // Save updated data to localStorage
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedData));
      return updatedData;
    });

    setPopupIndex(null);
  };

  return (
    <div className={styles.container}>
      <div className={styles.head}>Key Accounts</div>
      {data.map((company, companyIndex) => (
        <div key={companyIndex} className={styles.row}>
          <div className={styles.boxPrimary}>
            <div className={styles.innerBoxsquare} style={{ backgroundColor: company.companybg }}></div>
            <div className={styles.innerBoxname}>{company.company}</div>
          </div>
          {company.content.map((item, contentIndex) => (
            <div className={styles.box} key={contentIndex}>
              <div
                className={styles.innerBoxhead}
                style={{ backgroundColor: company.companycolor }}
                onClick={() => setPopupIndex({ companyIndex, contentIndex })}
              >
                {item.head}
              </div>
              <div
                className={`${styles.innerBoxstatus} ${
                  item.status === "Pending"
                    ? styles.statusPending
                    : item.status === "Completed"
                    ? styles.statusCompleted
                    : ""
                }`}
              >
                {item.status === "Pending" ? (
                  <>
                    <FaClock style={{ marginRight: "5px" }} />
                    {item.status}
                  </>
                ) : item.status === "Completed" ? (
                  <>
                    <FaCheckCircle style={{ marginRight: "5px" }} />
                    {item.status}
                  </>
                ) : (
                  item.status
                )}
              </div>

              {popupIndex &&
                popupIndex.companyIndex === companyIndex &&
                popupIndex.contentIndex === contentIndex && (
                  <div className={styles.popup}>
                    <div className={styles.pending} onClick={() => handleStatusChange(companyIndex, contentIndex, "Pending")}>
                      Pending
                    </div>
                    <div className={styles.completed} onClick={() => handleStatusChange(companyIndex, contentIndex, "Completed")}>
                      Completed
                    </div>
                  </div>
                )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default KeyAccounts;
