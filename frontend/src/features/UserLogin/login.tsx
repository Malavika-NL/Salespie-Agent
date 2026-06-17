import React, { useState } from 'react';
import styles from '../login/login.module.css';
import { useNavigate } from 'react-router-dom';
import { loginData } from './slice/login';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../app/store';
import logo from '../images/vbs.jpg';

interface FormData {
  username: string;
  password: string;
}

const UserLogin: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [formData, setFormData] = useState<FormData>({ username: '', password: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const googleAuthUrl =
    (import.meta.env.VITE_GOOGLE_AUTH_URL as string | undefined) ||
    'https://accounts.google.com/signin';

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
    setErrorMessage('');
  };

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const resultAction = await dispatch(loginData(formData) as any).unwrap();
      if (resultAction?.role === 'admin') {
        navigate('/home');
        return;
      }
      if (resultAction?.role === 'user' || resultAction?.role === 'lead') {
        navigate('/user/Userhome');
        return;
      }
      if (resultAction?.tokens?.access) {
        navigate('/user/Userhome');
        return;
      }
      setErrorMessage('Unable to login with the provided credentials.');
    } catch (err) {
      console.error('Failed to login: ', err);
      setErrorMessage(typeof err === 'string' ? err : 'Unable to login with the provided credentials.');
    }
  };

  const handleGoogleSignIn = () => {
    window.location.href = googleAuthUrl;
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.leftPanel}></div>
      <div className={styles.rightPanel}>
        <div className={styles.loginPanel}>
          <img src={logo} alt="VBS logo" className={styles.topLogo} />
          <h2 className={styles.rightTitle}>Welcome back!</h2>
          <p className={styles.subtitle}>Sign in to continue to your account</p>
          <form className={styles.form} onSubmit={handleLogin}>
            <label className={styles.label}>Username</label>
            <input
              className={styles.inputField}
              name="username"
              type="text"
              placeholder="Enter your username"
              value={formData.username}
              onChange={handleChange}
            />

            <label className={styles.label}>Password</label>
            <div className={styles.passwordWrapper}>
              <input
                className={styles.inputField}
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
              />
              <button
                type="button"
                className={styles.eyeButton}
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>

            <div className={styles.row}>
              <label className={styles.remember}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                Remember me
              </label>
              <span
                className={styles.forgotPassword}
                onClick={() => navigate('/forgot-password')}
                style={{ cursor: 'pointer' }}
              >
                Forgot password?
              </span>
            </div>

            {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}
            <button className={styles.submitButton} type="submit">
              Login
            </button>

            <div className={styles.divider}><span>or</span></div>
            <button type="button" className={styles.googleButton} onClick={handleGoogleSignIn}>
              Sign in with Google
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
