import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../UserLogin/slice/login";
import styles from "./logout.module.css";
import { PiSignOutBold } from "react-icons/pi";

const LogoutButton = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    const confirmation = window.confirm("Do you want to logout?");
    if (confirmation) {
      dispatch(logout() as any);
      navigate("/");
    }
  };

  return (
    // <button onClick={handleLogout} className={styles.logoutbutton}>
    //   <MdLogout /> Logout
    // </button>
    <button type="button" className={styles.logout} onClick={handleLogout}>
      <PiSignOutBold className={styles.signouticon} />
      <span className={styles.signout}>Sign Out</span>
    </button>
  );
};

export default LogoutButton;
