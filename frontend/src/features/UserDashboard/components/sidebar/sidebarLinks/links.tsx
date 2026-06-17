import style from "./links.module.css";
import { MdPeopleAlt } from "react-icons/md";
import { FaBoxArchive } from "react-icons/fa6";
import { GiMineTruck } from "react-icons/gi";
import { Link } from "react-router-dom";
import { GoTasklist } from "react-icons/go";
import { useSelector } from "react-redux";
import type { RootState } from "../../../../../app/store";

const Links = () => {
    const data = useSelector((state: RootState) => state.userLoginAuth.user.role);

    return (
        <div className="w-full">
            <Link to='/accountForm' className={style.navLinks}><div className={style.links}><MdPeopleAlt size={20} style={{ color: 'white', marginLeft: '30px' }} /><span className={style.man}>Account</span></div></Link>
            <Link to='/opportuntiy' className={style.navLinks}><div className={style.links}><FaBoxArchive size={20} style={{ color: 'white', marginLeft: '30px' }} /><span className={style.material}>Opportunity</span></div></Link>
            <Link to='/targetform' className={style.navLinks}><div className={style.links}><GiMineTruck size={20} style={{ color: 'white', marginLeft: '30px' }} /><span className={style.machine}>Target</span></div></Link>
            {data === 'lead' && (
                <Link to='/lead' className={style.navLinks}><div className={style.links}><GiMineTruck size={20} style={{ color: 'white', marginLeft: '30px' }} /><span className={style.machine}>Lead</span></div></Link>
            )}
            <Link to='/taskForm' className={style.navLinks}><div className={style.links}><GoTasklist size={20} style={{ color: 'white', marginLeft: '30px' }} /><span className={style.machine}>Add Task</span></div></Link>
        </div>
    )
}

export default Links
