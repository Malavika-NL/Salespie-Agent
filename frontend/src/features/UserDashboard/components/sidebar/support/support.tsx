
import  style  from "./support.module.css";
import { SlQuestion } from "react-icons/sl";

const Support = () =>{
    return(
        <div  className={style.support}>
           <div ><SlQuestion  size={20} style={{color:'#6E6E6E',marginRight:'10px'}} /><span className={style.help}>Help and Support</span>  </div>
        </div>
    )
}

export default Support
