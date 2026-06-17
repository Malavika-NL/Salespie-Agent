import style from "./vcount.module.css";
import logo from '../../images/logo.png'

const Vcount = () => {
    return (
        <div className="logoContainer">
             <img className={style.logo} src={logo} alt='logo' />
        </div>
    )
}

export default Vcount;
