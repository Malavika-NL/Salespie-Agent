import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { AppDispatch, RootState } from '../../app/store';
import {
  sendForgotPasswordOTP,
  verifyOTP,
  resetPassword,
  setForgotEmail,
  resetForgotPasswordState,
} from './slice/forgotpasswordslice';
import logo from '../images/vbs.jpg';
import styles from './login.module.css';

const RESEND_COUNTDOWN = 30;
const OTP_LENGTH = 6;

const ForgotPassword: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { loading, error, step, email: storedEmail } = useSelector(
    (state: RootState) => state.forgotPassword
  );

  // ── Step 1: Email ────────────────────────────────────────
  const [email, setEmail] = useState('');

  // ── Step 2: OTP ──────────────────────────────────────────
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [countdown, setCountdown] = useState(RESEND_COUNTDOWN);
  const [canResend, setCanResend] = useState(false);

  // ── Step 3: Reset Password ───────────────────────────────
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // ── Success ──────────────────────────────────────────────
  const [successMessage, setSuccessMessage] = useState('');

  // Countdown timer for OTP resend
  useEffect(() => {
    if (step !== 'otp') return;
    setCountdown(RESEND_COUNTDOWN);
    setCanResend(false);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [step]);

  // ── Handlers ─────────────────────────────────────────────

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await dispatch(sendForgotPasswordOTP({ email }));
    if (sendForgotPasswordOTP.fulfilled.match(result)) {
      dispatch(setForgotEmail(email));
    }
  };

  const handleResendOTP = async () => {
    if (!canResend) return;
    setOtp(Array(OTP_LENGTH).fill(''));
    const result = await dispatch(sendForgotPasswordOTP({ email: storedEmail }));
    if (sendForgotPasswordOTP.fulfilled.match(result)) {
      setCountdown(RESEND_COUNTDOWN);
      setCanResend(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return; // only digits
    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);
    if (value && index < OTP_LENGTH - 1) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = otp.join('');
    if (otpString.length < OTP_LENGTH) return;
    dispatch(verifyOTP({ email: storedEmail, otp: otpString }));
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = otp.join('');
    const result = await dispatch(
      resetPassword({
        email: storedEmail,
        otp: otpString,
        new_password: newPassword,
        confirm_password: confirmPassword,
      })
    );
    if (resetPassword.fulfilled.match(result)) {
      setSuccessMessage('Password reset successfully! Redirecting to login...');
      setTimeout(() => {
        dispatch(resetForgotPasswordState());
        navigate('/');
      }, 2500);
    }
  };

  // ── Render ────────────────────────────────────────────────

  return (
    <div className={styles.pageContainer}>
      <div className={styles.leftPanel}></div>

      <div className={styles.rightPanel}>
        <div className={styles.loginPanel}>
          <img src={logo} alt="VBS logo" className={styles.topLogo} />

          {/* ── STEP 1: Enter Email ── */}
          {step === 'email' && (
            <>
              <h2 className={styles.rightTitle}>Forgot Password</h2>
              <p className={styles.subtitle}>Enter your registered email to receive an OTP</p>
              <form className={styles.form} onSubmit={handleSendOTP}>
                <label className={styles.label}>Email address</label>
                <input
                  className={styles.inputField}
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                {error && <div className={styles.errorMessage}>{error}</div>}
                <button className={styles.submitButton} type="submit" disabled={loading}>
                  {loading ? 'Sending...' : 'Send OTP'}
                </button>
                <p
                  className={styles.forgotPassword}
                  onClick={() => navigate('/')}
                  style={{ cursor: 'pointer' }}
                >
                  Back to Login
                </p>
              </form>
            </>
          )}

          {/* ── STEP 2: Enter OTP ── */}
          {step === 'otp' && (
            <>
              <h2 className={styles.rightTitle}>Enter OTP</h2>
              <p className={styles.subtitle}>
                A 6-digit OTP was sent to <strong>{storedEmail}</strong>
              </p>
              <form className={styles.form} onSubmit={handleVerifyOTP}>
                <div className={styles.otpContainer}>
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => { otpRefs.current[index] = el; }}
                      className={styles.otpInput}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      autoFocus={index === 0}
                    />
                  ))}
                </div>
                {error && <div className={styles.errorMessage}>{error}</div>}
                <button
                  className={styles.submitButton}
                  type="submit"
                  disabled={loading || otp.join('').length < OTP_LENGTH}
                >
                  {loading ? 'Verifying...' : 'Verify OTP'}
                </button>
                <p className={styles.resendText}>
                  {canResend ? (
                    <span
                      className={styles.resendLink}
                      onClick={handleResendOTP}
                    >
                      Resend OTP
                    </span>
                  ) : (
                    <>Resend OTP in <strong>{countdown}s</strong></>
                  )}
                </p>
                <p
                  className={styles.forgotPassword}
                  onClick={() => dispatch(resetForgotPasswordState())}
                  style={{ cursor: 'pointer' }}
                >
                  Change Email
                </p>
              </form>
            </>
          )}

          {/* ── STEP 3: Reset Password ── */}
          {step === 'reset' && (
            <>
              <h2 className={styles.rightTitle}>Reset Password</h2>
              <p className={styles.subtitle}>Enter your new password</p>
              <form className={styles.form} onSubmit={handleResetPassword}>
                {/* New Password */}
                <label className={styles.label}>New password</label>
                <div className={styles.passwordWrapper}>
                  <input
                    className={styles.inputField}
                    type={showNewPassword ? 'text' : 'password'}
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    className={styles.eyeButton}
                    onClick={() => setShowNewPassword((p) => !p)}
                    aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                  >
                    {showNewPassword ? (
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

                {/* Confirm Password */}
                <label className={styles.label}>Confirm password</label>
                <div className={styles.passwordWrapper}>
                  <input
                    className={styles.inputField}
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    className={styles.eyeButton}
                    onClick={() => setShowConfirmPassword((p) => !p)}
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? (
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

                {error && <div className={styles.errorMessage}>{error}</div>}
                {successMessage && <div className={styles.successMessage}>{successMessage}</div>}
                <button className={styles.submitButton} type="submit" disabled={loading}>
                  {loading ? 'Resetting...' : 'Reset Password'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
