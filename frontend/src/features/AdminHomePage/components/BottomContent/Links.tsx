// import React from 'react';
// import styles from './Links.module.css';
// import { Link } from 'react-router-dom';

// const FooterLinks: React.FC = () => {
//   return (
//     <div className={styles.bottomContent}>
//       <Link to='/AdminAccountWorkspaceTable' className={styles.item1} >Account Data</Link>
//       <Link to='/AdminOpportunityWorkspaceTable' className={styles.item1} >Opportunity Data</Link>
//       <Link to='/AdminTargetWorkspaceTable' className={styles.item1} >Target Data</Link>
//       <Link to='/AdminLeadWorkspaceList' className={styles.item1} >Lead Data</Link>
//       <Link to='/AdminTaskWorkspaceList' className={styles.item1} >Task Data</Link>
//     </div>
//   );
// };

// export default FooterLinks;

import React from 'react';
import styles from './Links.module.css';
import { NavLink } from 'react-router-dom';

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

const links = [
  { to: '/AdminAccountWorkspaceTable',     icon: 'account',     label: 'Account Data',     extra: 'accountLink'     },
  { to: '/AdminOpportunityWorkspaceTable', icon: 'opportunity', label: 'Opportunity Data', extra: 'opportunityLink' },
  { to: '/AdminTargetWorkspaceTable',      icon: 'target',      label: 'Target Data',      extra: 'targetLink'      },
  { to: '/AdminLeadWorkspaceList',         icon: 'lead',        label: 'Lead Data',        extra: 'leadLink'        },
  { to: '/AdminTaskWorkspaceList',         icon: 'task',        label: 'Task Data',        extra: 'taskLink'        },
];

const FooterLinks: React.FC = () => {
  const linkClass = ({ isActive }: { isActive: boolean }, extra: string) =>
    [styles.item1, styles[extra], isActive ? styles.active : ''].filter(Boolean).join(' ');

  return (
    <div className={styles.bottomContent}>
      {links.map(({ to, icon, label, extra }) => (
        <NavLink
          key={to}
          to={to}
          className={(s) => linkClass(s, extra)}
        >
          {icons[icon]} {label}
        </NavLink>
      ))}
    </div>
  );
};

export default FooterLinks;