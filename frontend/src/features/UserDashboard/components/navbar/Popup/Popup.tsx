import { useState } from 'react';
import { useSelector } from 'react-redux';
import style from './popup.module.css';
import { IoMdClose } from "react-icons/io";
import type { RootState } from '../../../../../app/store';
import { generateAbbreviation } from '../../../../common';
import { PiSignOutBold } from "react-icons/pi";
import LogoutButton from '../../../../Logout/logout';


interface ProfileProps {
    onClose: () => void;
}


const Popup: React.FC<ProfileProps> = ( {onClose} ) => {
    const { user } = useSelector((state: RootState) => state.userLoginAuth);
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const userName = user?.username || 'User';
    const abbreviation = generateAbbreviation(userName);

    return (
        <>


            <div className={style.popup}>
                <div className={style.iconcontainer}>
                    <IoMdClose className={style.closeicon} onClick={onClose} />
                </div>
                <div className={style.popupContent}>
                    <p className={style.mail}>{user.email}</p>
                    <div className={style.profileCircle}>
                        {abbreviation}
                    </div>
                    <div className={style.user}>
                        Hi,{user.username}!
                    </div>
                  
                </div>
                
                <div className={style.bottomcontent}>
                    <LogoutButton />
                    <div className={style.end}><span className={style.text}>Privacy policy</span><span className={style.text}>Terms of service</span></div>
                </div>
            </div>

        </>
    );
};

export default Popup;
