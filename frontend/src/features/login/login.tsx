// import React, { useState } from 'react';
// import { useDispatch } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import type { AppDispatch } from '../../app/store';
// import { clearTableData } from '../TaskTable/slice/taskTableSlice';
// import logo from '../images/vbs.jpg';
// import styles from './login.module.css';
// import { loginData } from './slice/login';

// interface FormData {
//   email: string;
//   password: string;
// }

// const Login: React.FC = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState<FormData>({ email: '', password: '' });
//   const [errorMessage, setErrorMessage] = useState('');

//   const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = event.target;

//     setFormData((prevFormData) => ({
//       ...prevFormData,
//       [name]: value,
//     }));
//     setErrorMessage('');
//   };

//   const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault();

//     try {
//       const resultAction = await dispatch(loginData(formData)).unwrap();

//       if (resultAction.role === 'admin') {
//         dispatch(clearTableData());
//         navigate('/home');
//         return;
//       }

//       if (resultAction.role === 'user' || resultAction.role === 'lead') {
//         dispatch(clearTableData());
//         navigate('/user/Userhome');
//         return;
//       }

//       if (resultAction.role === null) {
//         setErrorMessage('User does not exist.');
//         return;
//       }

//       setErrorMessage('Your account does not have an assigned role.');
//     } catch (err) {
//       console.error('Failed to login:', err);
//       setErrorMessage(typeof err === 'string' ? err : 'Unable to login with the provided credentials.');
//     }
//   };

//   return (
//     <div className={styles.pageContainer}>
//       <div className={styles.container}>
//         <div className={styles.leftContainer}>
//           <h1 className={styles.leftTitle}>VAIJNANIK BUSINESS SOLUTIONS PVT.LTD</h1>
//           <p className={styles.leftText}>"Accelerate Your Sales Journey"</p>
//         </div>
//         <div className={styles.rightContainer}>
//           <img src={logo} alt="logo" className={styles.logo} />
//           <h2 className={styles.rightTitle}>Welcome</h2>
//           <form className={styles.form} onSubmit={handleLogin}>
//             <input
//               className={styles.inputField}
//               name="email"
//               type="email"
//               placeholder="Enter Email"
//               value={formData.email}
//               onChange={handleChange}
//             />
//             <input
//               className={styles.inputField}
//               type="password"
//               name="password"
//               placeholder="Password"
//               value={formData.password}
//               onChange={handleChange}
//             />
//             {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}
//             <button className={styles.submitButton} type="submit">
//               Login
//             </button>
//             <p className={styles.forgotPassword}>Forgot Password</p>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;


import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { AppDispatch } from '../../app/store';
import { clearTableData } from '../TaskTable/slice/taskTableSlice';
import logo from '../images/vbs.jpg';
import styles from './login.module.css';
import { loginData } from './slice/login';

interface FormData {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({ email: '', password: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
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
      const resultAction = await dispatch(loginData(formData)).unwrap();

      if (resultAction.role === 'admin') {
        dispatch(clearTableData());
        navigate('/home');
        return;
      }

      if (resultAction.role === 'user' || resultAction.role === 'lead') {
        dispatch(clearTableData());
        navigate('/user/Userhome');
        return;
      }

      if (resultAction.role === null) {
        setErrorMessage('User does not exist.');
        return;
      }

      setErrorMessage('Your account does not have an assigned role.');
    } catch (err) {
      console.error('Failed to login:', err);
      setErrorMessage(typeof err === 'string' ? err : 'Unable to login with the provided credentials.');
    }
  };

  const handleGoogleSignIn = () => {
    window.location.href = googleAuthUrl;
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.leftPanel}>
      </div>

      <div className={styles.rightPanel}>
        <div className={styles.loginPanel}>
          <img src={logo} alt="VBS logo" className={styles.topLogo} />
          <h2 className={styles.rightTitle}>Welcome back!</h2>
          <p className={styles.subtitle}>Sign in to continue to your account</p>
          <form className={styles.form} onSubmit={handleLogin}>
            <label className={styles.label}>Email address</label>
            <input
              className={styles.inputField}
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
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
                  // Eye-off SVG (hide password)
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  // Eye SVG (show password)
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

export default Login;
