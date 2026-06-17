import sidebarStyle from './sidebar.module.css'
import Line from './line/line';
import Links from './sidebarLinks/links';
import Element from './element/element';
import Vcount from './vcount/vcount';
import Support from './support/support';

const Sidebar = () => {
 return(
    <div className={`w-full ${sidebarStyle['container']}`}>
        <div className={sidebarStyle.topcontainer}>
            <Line />
            <Links />
        </div>
        
        <div className={sidebarStyle.bottomcontainer}>
           <Vcount />
           <Line />
           <Support />
        </div>
    </div>
 )
}

export default Sidebar
