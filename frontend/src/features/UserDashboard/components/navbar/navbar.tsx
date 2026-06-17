import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../../app/store';
import { generateAbbreviation } from '../../../common';
import style from './navbar.module.css';
import Popup from './Popup/Popup';

const Navbar: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.userLoginAuth);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const popupRef = useRef<HTMLDivElement | null>(null);

  const userName = user?.username || 'User';
  const abbreviation = generateAbbreviation(userName);

  const handleCloseProfile = () => {
    setIsPopupOpen(false);
  };

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setIsPopupOpen(false);
      }
    };

    if (isPopupOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isPopupOpen]);

  return (
    <>
      <div className={style.navbarcontainer}>
        <div className={style.navbarLeftcontainer}>
          <span className={style.brandGlow}>VAIJNANIK</span>
          <span className={style.brandDivider}>Business Solutions</span>
        </div>

        <div className={style.navbarRightContainer} ref={popupRef}>
          {/* Profile Circle */}
          <div
            className={style.profileCircle}
            onClick={() => setIsPopupOpen(!isPopupOpen)}
          >
            {abbreviation}
          </div>

          {/* Popup (Only visible when isPopupOpen is true) */}
          {isPopupOpen && <Popup onClose={handleCloseProfile} />}
        </div>
      </div>
    </>
  );
};

export default Navbar;
