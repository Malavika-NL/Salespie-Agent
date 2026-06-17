
import  style  from "./element.module.css";
import { FiHome } from "react-icons/fi";
const Element = () =>{
    return(
        <>
             <FiHome size={34} style={{marginLeft:'auto',marginRight:'auto',marginTop:'30px',color:'#001740'}}/>
            <p className={style.element}>Element</p>
        </>
    )
}

export default Element
