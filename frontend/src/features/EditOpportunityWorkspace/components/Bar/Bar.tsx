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
//             <Link to={`/editopportunityspace/event/${id}`} className={styles.link}><SlCalender className={styles.icon} />Event</Link>
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


// import React from "react";
// import styles from './Bar.module.css';
// import { SlCalender } from "react-icons/sl";
// import { LiaClipboardListSolid } from "react-icons/lia";
// import { LiaFileInvoiceDollarSolid } from "react-icons/lia";
// import { MdOutlineEmail } from "react-icons/md";
// import { CiCircleCheck } from "react-icons/ci";
// import { BsChatSquareText } from "react-icons/bs";
// import { Link, useLocation, useParams } from "react-router-dom";

// const Bar: React.FC = () => {
//   const { id } = useParams<{ id: string }>();
//   const location = useLocation();

//   // Detect role from current URL prefix
//   const isUser = location.pathname.startsWith("/user");
//   const base = isUser
//     ? `/user/editopportunityspace`
//     : `/editopportunityspace`;

//   return (
//     <div className={styles.bar}>
//       <div className={styles.item}>
//         <Link to={`${base}/event/${id}`} className={styles.link}>
//           <SlCalender className={styles.icon} />Event
//         </Link>
//       </div>

//       <div className={styles.item}>
//         {/* ✅ Fix 1: Task now has a Link, same pattern as Event */}
//         <Link to={`${base}/task/${id}`} className={styles.link}>
//           <LiaClipboardListSolid className={styles.icon} />Task
//         </Link>
//       </div>

//       <div className={styles.item}>
//         {/* ✅ Fix 2: Quote uses same base, no more hardcoded /editopportunityspace */}
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

// import React from "react";
// import styles from './Bar.module.css';
// import { SlCalender } from "react-icons/sl";
// import { LiaClipboardListSolid } from "react-icons/lia";
// import { LiaFileInvoiceDollarSolid } from "react-icons/lia";
// import { MdOutlineEmail } from "react-icons/md";
// import { CiCircleCheck } from "react-icons/ci";
// import { BsChatSquareText } from "react-icons/bs";
// import { Link, useLocation, useParams } from "react-router-dom";

// const Bar: React.FC = () => {
//   const params = useParams();
//   const location = useLocation();

//   // Safely extract ID: Try useParams first, if it fails (undefined), grab the last part of the URL.
//   // Using .filter(Boolean) ensures we don't accidentally grab an empty string if there's a trailing slash.
//   const urlParts = location.pathname.split('/').filter(Boolean);
//   const id = params.id || urlParts[urlParts.length - 1];

//   // Detect role from current URL prefix
//   const isUser = location.pathname.startsWith("/user");
//   const base = isUser
//     ? `/user/editopportunityspace`
//     : `/editopportunityspace`;

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
import { Link, useLocation, useParams } from "react-router-dom";

// ─── Nav items config ─────────────────────────────────────────────────────────

const navItems = [
  { label: "Event",    Icon: SlCalender,                route: "event",    isLink: true  },
  { label: "Task",     Icon: LiaClipboardListSolid,     route: "task",     isLink: true  },
  { label: "Quote",    Icon: LiaFileInvoiceDollarSolid, route: "quote",    isLink: true  },
  { label: "Email",    Icon: MdOutlineEmail,            route: "",         isLink: false },
  { label: "Followup", Icon: BsChatSquareText,          route: "followup", isLink: true  },
  { label: "Invoice",  Icon: CiCircleCheck,             route: "",         isLink: false },
];

// ─── Component ────────────────────────────────────────────────────────────────

const Bar: React.FC = () => {
  const params = useParams();
  const location = useLocation();

  // Safely extract ID: Try useParams first, if it fails (undefined), grab the last part of the URL.
  const urlParts = location.pathname.split("/").filter(Boolean);
  const id = params.id || urlParts[urlParts.length - 1];

  // Detect role from current URL prefix
  const isUser = location.pathname.startsWith("/user");
  const base = isUser
    ? `/user/editopportunityspace`
    : `/editopportunityspace`;

  const currentPath = location.pathname;

  const isActive = (route: string) =>
    route && currentPath.includes(route);

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2 bg-white rounded-2xl border-2 border-indigo-100 shadow-md my-4">
      {navItems.map(({ label, Icon, route, isLink }) => {
        const active = isActive(route);
        const baseClass = `flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
          active
            ? "bg-gradient-to-r from-indigo-600 to-violet-500 text-white shadow-md"
            : "text-slate-600 hover:bg-indigo-50 hover:text-indigo-600"
        }`;

        const content = (
          <>
            <Icon size={18} className={active ? "text-white" : "text-indigo-500"} />
            {label}
          </>
        );

        return (
          <div key={label} className="flex items-center">
            {isLink ? (
              <Link
                to={`${base}/${route}/${id}`}
                className={baseClass}
              >
                {content}
              </Link>
            ) : (
              <span className={`${baseClass} cursor-default opacity-50`}>
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