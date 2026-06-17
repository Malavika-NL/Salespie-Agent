import style from './navbar.module.css'
import LogoutButton from '../../../Logout/logout';
const AdminNavbar: React.FC = () => {
  return (
    <>
      <div className={style['navbar--container']} >
        <div className={style['navbar--Leftcontainer']} >
          <div className={style.admin}>Admin Dashboard</div>
        </div>

        <div className={style['navbar--RightContainer']}>
           <LogoutButton />
        </div>
      </div>
    </>
  )
}
export default AdminNavbar
