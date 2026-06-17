// import React from "react";
// import styles from './Bar.module.css'; // Importing the CSS module
// import { SlCalender } from "react-icons/sl";
// import { LiaClipboardListSolid } from "react-icons/lia";
// import { LiaFileInvoiceDollarSolid } from "react-icons/lia";
// import { MdOutlineEmail } from "react-icons/md";
// import { CiCircleCheck } from "react-icons/ci";
// import { Link, useNavigate, useParams } from "react-router-dom";
// const Bar: React.FC = () => {


//     const { id } = useParams<{ id: string }>();

//       const navigate = useNavigate();
//       const handleQuoteClick = () => {
//         navigate(`/editopportunityspace/task/${id}`); // Example route for Quote
//     };
//     // console.log('bar id',id)
//     return (
//         <div className={styles.bar}>
//             <div className={styles.item}>
//             <Link to={`/editadminopportunityspace/event/${id}`} className={styles.link}><SlCalender className={styles.icon} />Event</Link>
//             </div>
//             {/* <div className={styles.item}>
//             <Link to={`/editopportunityspace/task/${id}`} className={styles.link}><LiaClipboardListSolid className={styles.icon} />Task</Link>
//             </div> */}
//             <div className={styles.item}>
//                 <LiaClipboardListSolid className={styles.icon} />Task
//             </div>
//             <div className={styles.item} onClick={handleQuoteClick}>
//                 <LiaFileInvoiceDollarSolid className={styles.icon} />Quote
//             </div>
//             <div className={styles.item}>
//                 <MdOutlineEmail className={styles.icon} />Email
//             </div>
//             <div className={styles.item}>
//                 <CiCircleCheck className={styles.icon} />Followup
//             </div>

//         </div>
//     );
// };

// export default Bar;

// // src/features/AdminEditopportunityworkspace/components/Bar/Bar.tsx
// import React from "react";
// import styles from './Bar.module.css';
// import { SlCalender } from "react-icons/sl";
// import { LiaClipboardListSolid } from "react-icons/lia";
// import { LiaFileInvoiceDollarSolid } from "react-icons/lia";
// import { MdOutlineEmail } from "react-icons/md";
// import { CiCircleCheck } from "react-icons/ci";
// import { BsChatSquareText } from "react-icons/bs";
// import { Link, useParams } from "react-router-dom";

// const Bar: React.FC = () => {
//   const { id } = useParams<{ id: string }>();
//   const base = `/editadminopportunityspace`;

//   return (
//     <div className={styles.bar}>
//       <div className={styles.item}>
//         <Link to={`${base}/event/${id}`} className={styles.link}>
//           <SlCalender className={styles.icon} />Event
//         </Link>
//       </div>

//       <div className={styles.item}>
//         {/* ✅ Task now navigates correctly */}
//         <Link to={`${base}/task/${id}`} className={styles.link}>
//           <LiaClipboardListSolid className={styles.icon} />Task
//         </Link>
//       </div>

//       <div className={styles.item}>
//         {/* ✅ Quote points to quote, not task */}
//         <Link to={`${base}/quote/${id}`} className={styles.link}>
//           <LiaFileInvoiceDollarSolid className={styles.icon} />Quote
//         </Link>
//       </div>

//       <div className={styles.item}>
//         <MdOutlineEmail className={styles.icon} />Email
//       </div>

//       <div className={styles.item}>
//         {/* ✅ Fix 1: Added Link for Followup */}
//         <Link to={`${base}/followup/${id}`} className={styles.link}>
//           <BsChatSquareText className={styles.icon} />Followup
//         </Link>
//       </div>

//       <div className={styles.item}>
//         <CiCircleCheck className={styles.icon} />Invoice
//       </div>
//     </div>
//   );
// };

// export default Bar;

// import React from "react";
// import styles from './Bar.module.css';
// import { SlCalender } from "react-icons/sl";
// import { LiaClipboardListSolid } from "react-icons/lia";
// import { LiaFileInvoiceDollarSolid } from "react-icons/lia";
// import { MdOutlineEmail } from "react-icons/md";
// import { CiCircleCheck } from "react-icons/ci";
// import { BsChatSquareText } from "react-icons/bs";
// import { Link, useParams, useLocation } from "react-router-dom";

// const Bar: React.FC = () => {
//   const params = useParams();
//   const location = useLocation();
  
//   // 1. Try to get 'id' from useParams
//   // 2. If undefined, try to get another param name just in case
//   // 3. Fallback: extract the very last part of the URL (e.g. "15" from ".../event/15")
//   const urlParts = location.pathname.split('/');
//   const id = params.id || params.oppId || urlParts[urlParts.length - 1]; 

//   const base = `/editadminopportunityspace`;

//   return (
//     <div className={styles.bar}>
//       <div className={styles.item}>
//         <Link to={`${base}/event/${id}`} className={styles.link}>
//           <SlCalender className={styles.icon} />Event
//         </Link>
//       </div>

//       <div className={styles.item}>
//         <Link to={`${base}/task/${id}`} className={styles.link}>
//           <LiaClipboardListSolid className={styles.icon} />Task
//         </Link>
//       </div>

//       <div className={styles.item}>
//         <Link to={`${base}/quote/${id}`} className={styles.link}>
//           <LiaFileInvoiceDollarSolid className={styles.icon} />Quote
//         </Link>
//       </div>

//       <div className={styles.item}>
//         <MdOutlineEmail className={styles.icon} />Email
//       </div>

//       <div className={styles.item}>
//         <Link to={`${base}/followup/${id}`} className={styles.link}>
//           <BsChatSquareText className={styles.icon} />Followup
//         </Link>
//       </div>

//       <div className={styles.item}>
//         <CiCircleCheck className={styles.icon} />Invoice
//       </div>
//     </div>
//   );
// };

// export default Bar;


import React from "react";
import { SlCalender } from "react-icons/sl";
import { LiaClipboardListSolid, LiaFileInvoiceDollarSolid } from "react-icons/lia";
import { MdOutlineEmail } from "react-icons/md";
import { CiCircleCheck } from "react-icons/ci";
import { BsChatSquareText } from "react-icons/bs";
import { Link, useParams, useLocation } from "react-router-dom";

// ─── Component ────────────────────────────────────────────────────────────────

const Bar: React.FC = () => {
  const params = useParams();
  const location = useLocation();

  // 1. Try to get 'id' from useParams
  // 2. If undefined, try to get another param name just in case
  // 3. Fallback: extract the very last part of the URL (e.g. "15" from ".../event/15")
  const urlParts = location.pathname.split('/');
  const id = params.id || params.oppId || urlParts[urlParts.length - 1];

  const base = `/editadminopportunityspace`;
  const currentPath = location.pathname;

  const isActive = (route: string) => route && currentPath.includes(route);

  const linkClass = (route: string) =>
    `flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
      isActive(route)
        ? "bg-gradient-to-r from-indigo-600 to-violet-500 text-white shadow-md"
        : "text-slate-600 hover:bg-indigo-50 hover:text-indigo-600"
    }`;

  const iconClass = (route: string) =>
    isActive(route) ? "text-white" : "text-indigo-500";

  const navItems = [
    { label: "Event",    Icon: SlCalender,                route: "event",    to: `${base}/event/${id}`,    isLink: true  },
    { label: "Task",     Icon: LiaClipboardListSolid,     route: "task",     to: `${base}/task/${id}`,     isLink: true  },
    { label: "Quote",    Icon: LiaFileInvoiceDollarSolid, route: "quote",    to: `${base}/quote/${id}`,    isLink: true  },
    { label: "Email",    Icon: MdOutlineEmail,            route: "",         to: "",                       isLink: false },
    { label: "Followup", Icon: BsChatSquareText,          route: "followup", to: `${base}/followup/${id}`, isLink: true  },
    { label: "Invoice",  Icon: CiCircleCheck,             route: "",         to: "",                       isLink: false },
  ];

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2 bg-white rounded-2xl border-2 border-indigo-100 shadow-md my-4">
      {navItems.map(({ label, Icon, route, to, isLink }) => {
        const active = isActive(route);
        const content = (
          <>
            <Icon size={18} className={iconClass(route)} />
            {label}
          </>
        );

        return (
          <div key={label} className="flex items-center">
            {isLink ? (
              <Link to={to} className={linkClass(route)}>
                {content}
              </Link>
            ) : (
              <span className={`${linkClass("")} cursor-default opacity-50`}>
                {content}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Bar;