import React, { useState } from 'react';
import Loginstyle from './admin.module.css';
import { useNavigate } from 'react-router-dom';
import { adminLoginData } from './slice/adminLogin';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../app/store';

interface FormData {
  username: string;
  password: string;
}

const AdminLogin: React.FC = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState<FormData>({ username: '', password: '' });
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const navigate = useNavigate();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const resultAction = await dispatch(adminLoginData(formData) as any).unwrap();
      if (resultAction.tokens.access) {
        navigate('/adminDashboard');
      } else {
        console.log("error");
      }
    } catch (err) {
      console.error('Failed to login: ', err);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen w-full">
      <div className="w-full max-w-md">
        <div className={Loginstyle.formcontainer}>
          <div className="flex flex-col items-center mb-4">
            <h4>Admin Login</h4>
          </div>
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label htmlFor="userId" className="block mb-1">Username</label>
              <input
                id="userId"
                type="text"
                name="username"
                placeholder="Enter username"
                className={`${Loginstyle.customformcontrol} ${usernameError ? Loginstyle.errorBorder : ''}`}
                value={formData.username}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="block mb-1">Password</label>
              <input
                id="password"
                type="password"
                name="password"
                placeholder="Enter Password"
                className={`${Loginstyle.customformcontrol} ${passwordError ? Loginstyle.errorBorder : ''}`}
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <div className={Loginstyle.btncontainer}>
              <button type="submit" className={Loginstyle.btnlogin}>
                Login
              </button>
            </div>
            <div className={Loginstyle.btncontainer}>
              <a href="/resetpassword" className={Loginstyle.forgotPassword}>
                Forgot Password?
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
