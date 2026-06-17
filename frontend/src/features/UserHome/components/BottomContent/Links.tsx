// import React from 'react';
// import styles from './Links.module.css';
// import { Link } from 'react-router-dom';
// import { useSelector } from 'react-redux';
// import type { RootState } from '../../../../app/store';


// const FooterLinks: React.FC = () => {
//   const { loading, user } = useSelector((state: RootState) => state.userLoginAuth);
//   console.log('user' , user)
  
//   return (
//     <div className={styles.bottomContent}>
//       <Link to="/user/AccountWorkspaceTable" className={styles.item1}>
//         Account Data
//       </Link>
//       <Link to="/user/OpportunityWorkspaceTable" className={styles.item1}>
//         Opportunity Data
//       </Link>
//       <Link to="/user/TargetWorkspaceTable" className={styles.item1}>
//         Target Data
//       </Link>
//       {user?.role === 'user' ? (
//         <Link to="/user/LeadWorkspaceList" className={styles.item1}>
//           Lead Data
//         </Link>
//       ) : (
//         <Link to="/user/AdminLeadWorkspaceList" className={styles.item1}>
//         Lead Data
//       </Link>
//       )}
         
//       <Link to="/user/TaskWorkspaceList" className={styles.item1}>
//         Task Data
//       </Link>
//     </div>
//   );
// };

// export default FooterLinks;

import React from 'react';
import styles from './Links.module.css';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../../app/store';

const icons: Record<string, React.ReactNode> = {
  account: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  opportunity: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="18" y="3" width="4" height="18"/><rect x="10" y="8" width="4" height="13"/><rect x="2" y="13" width="4" height="8"/>
    </svg>
  ),
  target: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
    </svg>
  ),
  lead: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
    </svg>
  ),
  task: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
    </svg>
  ),
};

const FooterLinks: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.userLoginAuth);

  const linkClass = ({ isActive }: { isActive: boolean }, extra: string) =>
    [styles.item1, styles[extra], isActive ? styles.active : ''].filter(Boolean).join(' ');

  return (
    <div className={styles.bottomContent}>
      <NavLink to="/user/AccountWorkspaceTable" className={(s) => linkClass(s, 'accountLink')}>
        {icons.account} Account Data
      </NavLink>

      <NavLink to="/user/OpportunityWorkspaceTable" className={(s) => linkClass(s, 'opportunityLink')}>
        {icons.opportunity} Opportunity Data
      </NavLink>

      <NavLink to="/user/TargetWorkspaceTable" className={(s) => linkClass(s, 'targetLink')}>
        {icons.target} Target Data
      </NavLink>

      {user?.role === 'user' ? (
        <NavLink to="/user/LeadWorkspaceList" className={(s) => linkClass(s, 'leadLink')}>
          {icons.lead} Lead Data
        </NavLink>
      ) : (
        <NavLink to="/user/AdminLeadWorkspaceList" className={(s) => linkClass(s, 'leadLink')}>
          {icons.lead} Lead Data
        </NavLink>
      )}

      <NavLink to="/user/TaskWorkspaceList" className={(s) => linkClass(s, 'taskLink')}>
        {icons.task} Task Data
      </NavLink>
    </div>
  );
};

export default FooterLinks;