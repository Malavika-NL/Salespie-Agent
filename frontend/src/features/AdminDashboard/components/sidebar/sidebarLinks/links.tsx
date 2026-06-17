import style from "./links.module.css";
import { MdPeopleAlt } from "react-icons/md";
import { FaBoxArchive } from "react-icons/fa6";
import { GiMineTruck } from "react-icons/gi";
import { PiLineSegmentsLight } from "react-icons/pi";
import { FaFile } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { GoTasklist } from "react-icons/go";
import { Link } from "react-router-dom";

const Links = () => {
    return (
        <div className="w-full">
            <Link to='/accountForm' className={style.navLinks}><div className={style.links}><MdPeopleAlt size={20} style={{color:'white',marginLeft:'30px'}} /><span className={style.man}>Account</span></div></Link>
            <Link to='/opportuntiy' className={style.navLinks}><div className={style.links}><FaBoxArchive size={20} style={{color:'white',marginLeft:'30px'}}/><span className={style.material}>Opportunity</span></div></Link>
            <Link to='/targetform' className={style.navLinks}><div className={style.links}><GiMineTruck size={20} style={{color:'white',marginLeft:'30px'}} /><span className={style.machine}>Target</span></div></Link>
            <Link to='/lead' className={style.navLinks}><div className={style.links}><FaFile size={20} style={{color:'white',marginLeft:'30px'}} /><span className={style.machine}>Lead</span></div></Link>
            <Link to='/taskForm' className={style.navLinks}><div className={style.links}><GoTasklist size={20} style={{color:'white',marginLeft:'30px'}} /><span className={style.machine}>Add Task</span></div></Link>
            <Link to='/registerForm' className={style.navLinks}><div className={style.links}><FaUser size={20} style={{color:'white',marginLeft:'30px'}} /><span className={style.machine}>Add User</span></div></Link>
        </div>
    )
}

export default Links
