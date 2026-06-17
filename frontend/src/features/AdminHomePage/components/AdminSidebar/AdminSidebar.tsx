import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  AppWindow,
  BarChart3,
  BriefcaseBusiness,
  CheckSquare2,
  ChartLine,
  ChartPie,
  CircleDollarSign,
  ClipboardList,
  DatabaseZap,
  FileText,
  Home,
  Info,
  Layers,
  LayoutDashboard,
  PanelLeftClose,
  SearchCheck,
  Settings,
  Target,
  UserRound,
  UserPlus,
  Users,
} from 'lucide-react';
import styles from './AdminSidebar.module.css';
import whatsapp_img from '../../../images/whatsapp.png';
import instagram_img from '../../../images/instagram.png';
import Facebook_img from '../../../images/Facebook.png';
import YouTube_img from '../../../images/YouTube.png';
import linkedin_img from '../../../images/linkedin.png';
import Pinterest_img from '../../../images/Pinterest.png';
import Salespienewlogo from '../../../images/salespie-logo-v2.png';

interface UserSidebarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

const IconAccount = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const IconOpportunity = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="18" y="3" width="4" height="18" />
    <rect x="10" y="8" width="4" height="13" />
    <rect x="2" y="13" width="4" height="8" />
  </svg>
);

const IconTarget = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

const IconLead = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2 2 7l10 5 10-5-10-5z" />
    <path d="m2 17 10 5 10-5" />
    <path d="m2 12 10 5 10-5" />
  </svg>
);

const IconTask = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 11 12 14 22 4" />
    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
  </svg>
);

const SalesPieLogo: React.FC = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '0' }}>
    <img
      src={Salespienewlogo}
      alt="SalesPie logo"
      style={{ width: 108, height: 78, objectFit: 'contain', display: 'block' }}
    />
    <span
      style={{
        fontFamily: '"Segoe UI", "Helvetica Neue", Arial, sans-serif',
        fontWeight: 800,
        fontSize: '24px',
        lineHeight: 1.05,
        letterSpacing: '0.1px',
      }}
    >
      <span style={{ color: '#1E40AF' }}>Sales</span>
      <span style={{ color: '#60A5FA' }}>Pie</span>
    </span>
  </div>
);

const SalesPieCollapsed: React.FC = () => (
  <img
    src={Salespienewlogo}
    alt="SalesPie"
    style={{ width: 52, height: 52, objectFit: 'contain' }}
  />
);

const AdminSidebar: React.FC<UserSidebarProps> = ({ isCollapsed, toggleSidebar }) => {
  const location = useLocation();
  const [isAppDropdownOpen, setIsAppDropdownOpen] = useState(false);
  const [isFormDropdownOpen, setIsFormDropdownOpen] = useState(false);
  const [isDashboardDropdownOpen, setIsDashboardDropdownOpen] = useState(false);
  const [isDataDropdownOpen, setIsDataDropdownOpen] = useState(false);

  const closeAll = () => {
    setIsAppDropdownOpen(false);
    setIsFormDropdownOpen(false);
    setIsDashboardDropdownOpen(false);
    setIsDataDropdownOpen(false);
  };

  const toggleAppDropdown = () => {
    const wasOpen = isAppDropdownOpen;
    closeAll();
    setIsAppDropdownOpen(!wasOpen);
  };

  const toggleFormDropdown = () => {
    const wasOpen = isFormDropdownOpen;
    closeAll();
    setIsFormDropdownOpen(!wasOpen);
  };

  const toggleDashboardDropdown = () => {
    const wasOpen = isDashboardDropdownOpen;
    closeAll();
    setIsDashboardDropdownOpen(!wasOpen);
  };

  const toggleDataDropdown = () => {
    const wasOpen = isDataDropdownOpen;
    closeAll();
    setIsDataDropdownOpen(!wasOpen);
  };

  const isActive = (path: string) => location.pathname.includes(path);
  const isGroupActive = (paths: string[]) => paths.some(path => location.pathname.includes(path));

  const formPaths = ['/accountworkspace', '/opportunityspace', '/TargetWorkspace', '/LeadWorkspace', '/AdminTaskWorkspaceList'];
  const dashboardPaths = ['/bddashboardnew', '/SalesAdminDashboard', '/crmdashboard', '/taskworkspace', '/AdminLeadDashboard', '/budget'];
  const dataPaths = [
    '/AdminAccountWorkspaceTable',
    '/AdminOpportunityWorkspaceTable',
    '/AdminTargetWorkspaceTable',
    '/AdminLeadWorkspaceList',
    '/AdminTaskWorkspaceList',
  ];

  return (
    <div className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ''}`}>
      <div className={`${styles.logoSection} ${isCollapsed ? styles.collapsedLogoSection : ''}`}>
        {isCollapsed ? <SalesPieCollapsed /> : <SalesPieLogo />}
        <PanelLeftClose
          size={22}
          className={`${styles.chevronIcon} ${isCollapsed ? styles.rotated : ''}`}
          onClick={toggleSidebar}
        />
      </div>

      <div className={styles.sidebarContent}>
        <Link
          to="/home"
          className={`${styles.navLinks} ${styles.navItem1} ${
            isActive('/home') && !isGroupActive([...formPaths, ...dashboardPaths, ...dataPaths, '/registerForm'])
              ? styles.navActive
              : ''
          }`}
        >
          <div className={styles.links}>
            <Home size={18} className={`${styles.navicons} ${styles.sidebarIcon} ${styles.iconHome}`} />
            {!isCollapsed && <span>Home</span>}
          </div>
        </Link>

        <div className={`${styles.navLinks} ${styles.dropdown} ${styles.navItem2}`} onClick={toggleAppDropdown}>
          <div className={styles.links}>
            <AppWindow size={18} className={`${styles.navicons} ${styles.sidebarIcon} ${styles.iconApps}`} />
            {!isCollapsed && <span>Apps</span>}
            {!isCollapsed && <span className={`${styles.dropChevron} ${isAppDropdownOpen ? styles.dropChevronOpen : ''}`}>{'>'}</span>}
          </div>
          <div className={`${styles.dropdownMenu} ${isAppDropdownOpen ? styles.show : ''}`}>
            {[
              { src: whatsapp_img, label: 'WhatsApp' },
              { src: instagram_img, label: 'Instagram' },
              { src: Facebook_img, label: 'Facebook' },
              { src: YouTube_img, label: 'YouTube' },
              { src: linkedin_img, label: 'LinkedIn' },
              { src: Pinterest_img, label: 'Pinterest' },
            ].map(({ src, label }, index) => (
              <Link to="#" className={styles.dropdownLinks} key={label} style={{ animationDelay: `${index * 40}ms` }}>
                <div className={styles.dropdownItems}>
                  <img src={src} alt={label} className={`${styles.dropdownImg} ${styles.submenuIcon}`} />
                  {!isCollapsed && <span className={styles.sublinks}>{label}</span>}
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div
          className={`${styles.navLinks} ${styles.dropdown} ${styles.navItem3} ${isGroupActive(formPaths) ? styles.navGroupActive : ''}`}
          onClick={toggleFormDropdown}
        >
          <div className={styles.links}>
            <FileText size={18} className={`${styles.navicons} ${styles.sidebarIcon} ${styles.iconForm}`} />
            {!isCollapsed && <span>Form</span>}
            {!isCollapsed && <span className={`${styles.dropChevron} ${isFormDropdownOpen ? styles.dropChevronOpen : ''}`}>{'>'}</span>}
          </div>
          <div className={`${styles.dropdownMenu} ${isFormDropdownOpen ? styles.show : ''}`}>
            {[
              { to: '/accountworkspace', Icon: UserRound, iconClass: styles.formIconAccount, label: 'Account' },
              { to: '/opportunityspace/event', Icon: BriefcaseBusiness, iconClass: styles.formIconOpportunity, label: 'Opportunity' },
              { to: '/TargetWorkspace', Icon: Target, iconClass: styles.formIconTarget, label: 'Target' },
              { to: '/LeadWorkspace', Icon: Users, iconClass: styles.formIconLead, label: 'Lead' },
              { to: '/AdminTaskWorkspaceList', Icon: CheckSquare2, iconClass: styles.formIconTask, label: 'Task' },
            ].map(({ to, Icon, iconClass, label }, index) => (
              <Link
                to={to}
                className={`${styles.dropdownLinks} ${isActive(to) ? styles.dropdownLinkActive : ''}`}
                key={label}
                style={{ animationDelay: `${index * 40}ms` }}
              >
                <div className={styles.dropdownItems}>
                  <span className={`${styles.formMiniIcon} ${styles.submenuIcon} ${iconClass}`}>
                    <Icon size={14} />
                  </span>
                  {!isCollapsed && <span className={styles.sublinks}>{label}</span>}
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div
          className={`${styles.navLinks} ${styles.dropdown} ${styles.navItem4} ${isGroupActive(dataPaths) ? styles.navGroupActive : ''}`}
          onClick={toggleDataDropdown}
        >
          <div className={styles.links}>
            <DatabaseZap size={18} className={`${styles.navicons} ${styles.sidebarIcon} ${styles.iconData}`} />
            {!isCollapsed && <span>Data</span>}
            {!isCollapsed && <span className={`${styles.dropChevron} ${isDataDropdownOpen ? styles.dropChevronOpen : ''}`}>{'>'}</span>}
          </div>
          <div className={`${styles.dropdownMenu} ${isDataDropdownOpen ? styles.show : ''}`}>
            {[
              { to: '/AdminAccountWorkspaceTable', Icon: IconAccount, iconClass: styles.dataIconAccount, label: 'Account Data' },
              { to: '/AdminOpportunityWorkspaceTable', Icon: IconOpportunity, iconClass: styles.dataIconOpportunity, label: 'Opportunity Data' },
              { to: '/AdminTargetWorkspaceTable', Icon: IconTarget, iconClass: styles.dataIconTarget, label: 'Target Data' },
              { to: '/AdminLeadWorkspaceList', Icon: IconLead, iconClass: styles.dataIconLead, label: 'Lead Data' },
              { to: '/AdminTaskWorkspaceList', Icon: IconTask, iconClass: styles.dataIconTask, label: 'Task Data' },
            ].map(({ to, Icon, iconClass, label }, index) => (
              <Link
                to={to}
                className={`${styles.dropdownLinks} ${isActive(to) ? styles.dropdownLinkActive : ''}`}
                key={label}
                style={{ animationDelay: `${index * 40}ms` }}
              >
                <div className={`${styles.dropdownItems} ${styles.dataItem}`}>
                  <span className={`${styles.dataIcon} ${styles.submenuIcon} ${iconClass}`}>
                    <Icon />
                  </span>
                  {!isCollapsed && <span className={styles.sublinks}>{label}</span>}
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div
          className={`${styles.navLinks} ${styles.dropdown} ${styles.navItem5} ${isGroupActive(dashboardPaths) ? styles.navGroupActive : ''}`}
          onClick={toggleDashboardDropdown}
        >
          <div className={styles.links}>
            <LayoutDashboard size={18} className={`${styles.navicons} ${styles.sidebarIcon} ${styles.iconDashboard}`} />
            {!isCollapsed && <span>Dashboard</span>}
            {!isCollapsed && <span className={`${styles.dropChevron} ${isDashboardDropdownOpen ? styles.dropChevronOpen : ''}`}>{'>'}</span>}
          </div>
          <div className={`${styles.dropdownMenu} ${isDashboardDropdownOpen ? styles.show : ''}`}>
            {[
              { to: '/bddashboardnew', Icon: BarChart3, label: 'BD Dashboard' },
              { to: '/SalesAdminDashboard', Icon: ChartLine, label: 'Sales Dashboard' },
              { to: '/crmdashboard', Icon: ChartPie, label: 'CRM Dashboard' },
              { to: '/budget/overview', Icon: CircleDollarSign, label: 'Budget Dashboard' },
              { to: '/taskworkspace', Icon: ClipboardList, label: 'Task Dashboard' },
              { to: '/AdminLeadDashboard', Icon: Layers, label: 'Lead Dashboard' },
            ].map(({ to, Icon, label }, index) => (
              <Link
                to={to}
                className={`${styles.dropdownLinks} ${isActive(to === '/budget/overview' ? '/budget' : to) ? styles.dropdownLinkActive : ''}`}
                key={label}
                style={{ animationDelay: `${index * 40}ms` }}
              >
                <div className={styles.dropdownItems}>
                  <span className={`${styles.dashboardMiniIcon} ${styles.submenuIcon}`}>
                    <Icon size={14} />
                  </span>
                  {!isCollapsed && <span className={styles.sublinks}>{label}</span>}
                </div>
              </Link>
            ))}
          </div>
        </div>

        <Link
          to="/home/registerForm"
          className={`${styles.navLinks} ${styles.navItem6} ${isActive('/registerForm') ? styles.navActive : ''}`}
        >
          <div className={styles.links}>
            <UserPlus size={18} className={`${styles.navicons} ${styles.sidebarIcon} ${styles.iconUser}`} />
            {!isCollapsed && <span>New User</span>}
          </div>
        </Link>

        <Link to="/resumescan" className={`${styles.navLinks} ${styles.navItem7}`}>
          <div className={styles.links}>
            <SearchCheck size={18} className={`${styles.navicons} ${styles.sidebarIcon} ${styles.iconScan}`} />
            {!isCollapsed && <span>Resume Scan</span>}
          </div>
        </Link>

        <Link to="/settings" className={`${styles.navLinks} ${styles.navItem7}`}>
          <div className={styles.links}>
            <Settings size={18} className={`${styles.navicons} ${styles.sidebarIcon} ${styles.iconSettings}`} />
            {!isCollapsed && <span>Settings</span>}
          </div>
        </Link>
      </div>

      <div className={styles.bottomSection}>
        <Link to="#" className={styles.aboutcontainer}>
          <div className={styles.about}>
            <Info size={18} className={`${styles.navicons} ${styles.sidebarIcon} ${styles.iconInfo}`} />
            {!isCollapsed && <span>About</span>}
          </div>
          {!isCollapsed && <div className={styles.version}>Beta 5.0</div>}
        </Link>
      </div>
    </div>
  );
};

export default AdminSidebar;
