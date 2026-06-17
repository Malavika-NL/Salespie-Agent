// import React from "react";
// import styles from './Bar.module.css'; // Importing the CSS module
// import { SlCalender } from "react-icons/sl";
// import { LiaClipboardListSolid } from "react-icons/lia";
// import { LiaFileInvoiceDollarSolid } from "react-icons/lia";
// import { MdOutlineEmail } from "react-icons/md";
// import { CiCircleCheck } from "react-icons/ci";
// import { Link, useLocation } from "react-router-dom";
// const Bar: React.FC = () => {

//     const location = useLocation();
//     const isUser = location.pathname.startsWith("/user");

//     return (
//         <div className={styles.bar}>
//             <div className={styles.item}>
//                 <Link
//                     to={isUser ? "/user/opportunityspace/event" : "/opportunityspace/event"}
//                     className={styles.link}
//                 >
//                     <SlCalender className={styles.icon} />Event
//                 </Link>
//             </div>
//             <div className={styles.item}>
//                 <Link
//                     to={isUser ? "/user/opportunityspace/task" : "/opportunityspace/task"}
//                     className={styles.link}
//                 >
//                     <LiaClipboardListSolid className={styles.icon} />Task
//                 </Link>
//             </div>
//             <div className={styles.item}>
//             <Link
//                     to={isUser ? "/user/opportunityspace/quote" : "/opportunityspace/quote"}
//                     className={styles.link}
//                 >
//                     <LiaFileInvoiceDollarSolid className={styles.icon} />Quote
//                 </Link>
              
//             </div>
//             <div className={styles.item}>
//                 <MdOutlineEmail className={styles.icon} />Email
//             </div>
//             <div className={styles.item}>
//                 <CiCircleCheck className={styles.icon} />Followup
//             </div>
//             <div className={styles.item}>
//                 <CiCircleCheck className={styles.icon} />Invoice
//             </div>
//         </div>
//     );
// };

// export default Bar;

// // src/features/OpportunityWorkspace/components/Bar/Bar.tsx
// import React from "react";
// import styles from './Bar.module.css';
// import { SlCalender } from "react-icons/sl";
// import { LiaClipboardListSolid } from "react-icons/lia";
// import { LiaFileInvoiceDollarSolid } from "react-icons/lia";
// import { MdOutlineEmail } from "react-icons/md";
// import { CiCircleCheck } from "react-icons/ci";
// import { BsChatSquareText } from "react-icons/bs";
// import { Link, useLocation } from "react-router-dom";

// const Bar: React.FC = () => {
//     const location = useLocation();
//     const isUser = location.pathname.startsWith("/user");

//     return (
//         <div className={styles.bar}>
//             <div className={styles.item}>
//                 <Link
//                     to={isUser ? "/user/opportunityspace/event" : "/opportunityspace/event"}
//                     className={styles.link}
//                 >
//                     <SlCalender className={styles.icon} />Event
//                 </Link>
//             </div>
//             <div className={styles.item}>
//                 <Link
//                     to={isUser ? "/user/opportunityspace/task" : "/opportunityspace/task"}
//                     className={styles.link}
//                 >
//                     <LiaClipboardListSolid className={styles.icon} />Task
//                 </Link>
//             </div>
//             <div className={styles.item}>
//                 <Link
//                     to={isUser ? "/user/opportunityspace/quote" : "/opportunityspace/quote"}
//                     className={styles.link}
//                 >
//                     <LiaFileInvoiceDollarSolid className={styles.icon} />Quote
//                 </Link>
//             </div>
//             <div className={styles.item}>
//                 <MdOutlineEmail className={styles.icon} />Email
//             </div>
//             <div className={styles.item}>
//                 <Link
//                     to={isUser ? "/user/opportunityspace/followup" : "/opportunityspace/followup"}
//                     className={styles.link}
//                 >
//                     <BsChatSquareText className={styles.icon} />Followup
//                 </Link>
//             </div>
//             <div className={styles.item}>
//                 <CiCircleCheck className={styles.icon} />Invoice
//             </div>
//         </div>
//     );
// };

// export default Bar;



import React from "react";
import { SlCalender } from "react-icons/sl";
import { LiaClipboardListSolid, LiaFileInvoiceDollarSolid } from "react-icons/lia";
import { MdOutlineEmail } from "react-icons/md";
import { CiCircleCheck } from "react-icons/ci";
import { BsChatSquareText } from "react-icons/bs";
import { Link, useLocation } from "react-router-dom";

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
  const location = useLocation();
  const isUser = location.pathname.startsWith("/user");
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
                to={isUser ? `/user/opportunityspace/${route}` : `/opportunityspace/${route}`}
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