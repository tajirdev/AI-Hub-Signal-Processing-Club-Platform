import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../api/auth';
import { Routes } from '../routes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEnvelope,
  faLock,
  faKey,
  faSpinner,
  faShieldAlt,
  faExclamationTriangle,
  faCheckCircle,
  faArrowLeft,
  faEye,
  faEyeSlash,
  faPaperPlane,
  faRedo,
} from '@fortawesome/free-solid-svg-icons';

export default function Login() {
  // Navigation & Auth
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || Routes.Overview.path;

  // View state: 'login' | 'forgot_email' | 'forgot_otp' | 'reset_password'
  const [view, setView] = useState('login');

  // Login form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Password reset flow state
  const [resetEmail, setResetEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Status & Feedback
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const resetAllFeedback = () => {
    setError('');
    setSuccessMsg('');
  };

  const handleSwitchView = (newView) => {
    resetAllFeedback();
    setView(newView);
  };

  // 1. Handle Admin Login
  const handleLogin = async (e) => {
    e.preventDefault();
    resetAllFeedback();
    setLoading(true);

    try {
      const userProfile = await login(email, password);
      const isSuperAdmin = userProfile?.roles?.includes('super_admin');
      if (!isSuperAdmin) {
        setError('Access denied: You must possess super_admin privileges.');
        return;
      }
      navigate(from, { replace: true });
    } catch (err) {
      console.error(err);
      const detail = err.response?.data?.detail;
      setError(typeof detail === 'string' ? detail : 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  // 2. Step 1: Request Password Reset OTP
  const handleRequestOTP = async (e) => {
    e.preventDefault();
    if (!resetEmail) {
      setError('Please enter your email address.');
      return;
    }
    resetAllFeedback();
    setLoading(true);

    try {
      const res = await authAPI.requestPasswordReset(resetEmail);
      setSuccessMsg(res?.message || 'OTP code sent! Please check your email inbox.');
      setView('forgot_otp');
    } catch (err) {
      console.error(err);
      const detail = err.response?.data?.detail;
      setError(typeof detail === 'string' ? detail : 'Failed to send OTP. Please verify your email.');
    } finally {
      setLoading(false);
    }
  };

  // 3. Step 2: Validate OTP Code input and move to password setup
  const handleProceedToNewPassword = (e) => {
    e.preventDefault();
    resetAllFeedback();

    const cleanOtp = otpCode.trim();
    if (!cleanOtp || cleanOtp.length < 4) {
      setError('Please enter a valid One-Time Password (OTP) code.');
      return;
    }

    setView('reset_password');
  };

  // 4. Step 3: Confirm Password Reset
  const handleConfirmReset = async (e) => {
    e.preventDefault();
    resetAllFeedback();

    if (!newPassword) {
      setError('Please enter a new password.');
      return;
    }
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match. Please re-type.');
      return;
    }

    setLoading(true);
    try {
      const res = await authAPI.confirmPasswordReset({
        email: resetEmail.trim(),
        otp_code: otpCode.trim(),
        new_password: newPassword,
      });

      // Successful password update
      setEmail(resetEmail);
      setPassword('');
      setOtpCode('');
      setNewPassword('');
      setConfirmPassword('');
      setView('login');
      setSuccessMsg(res?.message || 'Password successfully reset! Please sign in with your new password.');
    } catch (err) {
      console.error(err);
      const detail = err.response?.data?.detail;
      setError(typeof detail === 'string' ? detail : 'Invalid or expired OTP code.');
      // If OTP is invalid, guide user back to OTP step
      if (typeof detail === 'string' && detail.toLowerCase().includes('otp')) {
        setView('forgot_otp');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Decorative Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header & Platform Branding */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center">
          <img
            src="/logo.png"
            alt="AI Hub Logo"
            className="w-16 h-16 object-cover rounded-full shadow-xl shadow-blue-600/30 ring-2 ring-blue-500/40"
          />
        </div>
        <h2 className="mt-4 text-center text-2xl font-black tracking-tight text-white">
          AI Hub Admin Portal
        </h2>
        <p className="mt-1 text-center text-xs text-gray-400 font-medium">
          Signal Processing Club — Super Admin Control
        </p>
      </div>

      {/* Main Form Container Card */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        <div className="bg-gray-900 border border-gray-800 py-8 px-6 sm:px-10 shadow-2xl rounded-2xl">
          {/* Error Banner */}
          {error && (
            <div className="mb-6 p-3 bg-red-950/80 border border-red-800/80 rounded-xl flex items-start space-x-2.5 text-red-200 text-xs animate-in fade-in duration-200">
              <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-400 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Success Banner */}
          {successMsg && (
            <div className="mb-6 p-3 bg-emerald-950/80 border border-emerald-800/80 rounded-xl flex items-start space-x-2.5 text-emerald-200 text-xs animate-in fade-in duration-200">
              <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-400 mt-0.5 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* ======================================================== */}
          {/* VIEW 1: ADMIN LOGIN FORM                                  */}
          {/* ======================================================== */}
          {view === 'login' && (
            <form className="space-y-4" onSubmit={handleLogin}>
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Admin Email Address
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 text-xs">
                    <FontAwesomeIcon icon={faEnvelope} />
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@test.com"
                    className="block w-full pl-9 pr-3 py-2.5 bg-gray-800/80 border border-gray-700 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-gray-300">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setResetEmail(email || '');
                      handleSwitchView('forgot_email');
                    }}
                    className="text-[11px] font-semibold text-blue-400 hover:text-blue-300 transition-colors focus:outline-none"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 text-xs">
                    <FontAwesomeIcon icon={faLock} />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="block w-full pl-9 pr-9 py-2.5 bg-gray-800/80 border border-gray-700 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-300 text-xs focus:outline-none"
                  >
                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center items-center space-x-2 py-2.5 px-4 border border-transparent rounded-xl shadow-md text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
                >
                  {loading ? (
                    <>
                      <FontAwesomeIcon icon={faSpinner} className="animate-spin text-sm" />
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faShieldAlt} className="text-sm" />
                      <span>Sign In to Super Admin</span>
                    </>
                  )}
                </button>
              </div>

              {/* Password Reset Callout Banner */}
              <div className="mt-6 pt-5 border-t border-gray-800 text-center">
                <p className="text-[11px] text-gray-400 mb-2 leading-relaxed">
                  If you forgot your password, click below to receive a One-Time Password (OTP) via email to reset it securely.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setResetEmail(email || '');
                    handleSwitchView('forgot_email');
                  }}
                  className="inline-flex items-center space-x-1.5 text-xs font-bold text-blue-400 hover:text-blue-300 py-1 px-3 rounded-lg bg-blue-950/40 hover:bg-blue-900/40 border border-blue-800/50 transition-colors"
                >
                  <FontAwesomeIcon icon={faKey} className="text-[10px]" />
                  <span>Forgot Password? Reset with OTP</span>
                </button>
              </div>
            </form>
          )}

          {/* ======================================================== */}
          {/* VIEW 2: STEP 1 - REQUEST PASSWORD RESET (INSERT EMAIL)    */}
          {/* ======================================================== */}
          {view === 'forgot_email' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="text-center pb-2">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-950/80 text-blue-400 border border-blue-800/60 mb-2">
                  <FontAwesomeIcon icon={faKey} />
                </div>
                <h3 className="text-sm font-bold text-white">Forgot Password? Reset via OTP</h3>
                <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">
                  If you forgot your password, enter your registered admin email below to receive a One-Time Password (OTP) via email to reset it securely.
                </p>
              </div>

              <div className="flex items-center justify-center space-x-2 text-[10px] font-semibold text-blue-400 bg-blue-950/30 py-1 px-2.5 rounded-lg border border-blue-800/30">
                <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[9px]">1</span>
                <span>Step 1: Enter Registered Email</span>
              </div>

              <form onSubmit={handleRequestOTP} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Your Registered Admin Email
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 text-xs">
                      <FontAwesomeIcon icon={faEnvelope} />
                    </span>
                    <input
                      type="email"
                      required
                      autoFocus
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder="admin@test.com"
                      className="block w-full pl-9 pr-3 py-2.5 bg-gray-800/80 border border-gray-700 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center items-center space-x-2 py-2.5 px-4 border border-transparent rounded-xl shadow-md text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
                  >
                    {loading ? (
                      <>
                        <FontAwesomeIcon icon={faSpinner} className="animate-spin text-sm" />
                        <span>Sending OTP Code...</span>
                      </>
                    ) : (
                      <>
                        <FontAwesomeIcon icon={faPaperPlane} className="text-xs" />
                        <span>Send One-Time Password (OTP)</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => handleSwitchView('login')}
                    className="inline-flex items-center space-x-1.5 text-xs text-gray-400 hover:text-white transition-colors"
                  >
                    <FontAwesomeIcon icon={faArrowLeft} className="text-[10px]" />
                    <span>Back to Sign In</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ======================================================== */}
          {/* VIEW 3: STEP 2 - INSERT OTP VERIFICATION CODE             */}
          {/* ======================================================== */}
          {view === 'forgot_otp' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="text-center pb-2">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-950/80 text-blue-400 border border-blue-800/60 mb-2">
                  <FontAwesomeIcon icon={faShieldAlt} />
                </div>
                <h3 className="text-sm font-bold text-white">Enter OTP Verification Code</h3>
                <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">
                  We sent a 6-digit One-Time Password to <span className="text-blue-400 font-semibold">{resetEmail}</span>. Enter the code below.
                </p>
              </div>

              <div className="flex items-center justify-center space-x-2 text-[10px] font-semibold text-blue-400 bg-blue-950/30 py-1 px-2.5 rounded-lg border border-blue-800/30">
                <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[9px]">2</span>
                <span>Step 2: Verify Security OTP</span>
              </div>

              <form onSubmit={handleProceedToNewPassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5 text-center">
                    6-Digit Security OTP Code
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      autoFocus
                      maxLength={8}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder="e.g. 123456"
                      className="block w-full py-3 bg-gray-800/90 border border-gray-700 rounded-xl text-center text-base tracking-[0.25em] font-mono font-bold text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center items-center space-x-2 py-2.5 px-4 border border-transparent rounded-xl shadow-md text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
                  >
                    <FontAwesomeIcon icon={faKey} className="text-xs" />
                    <span>Proceed to Reset Password</span>
                  </button>
                </div>

                <div className="flex items-center justify-between text-xs pt-3 border-t border-gray-800">
                  <button
                    type="button"
                    onClick={handleRequestOTP}
                    disabled={loading}
                    className="inline-flex items-center space-x-1 text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    <FontAwesomeIcon icon={faRedo} className="text-[10px]" />
                    <span>Resend OTP Code</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSwitchView('forgot_email')}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Change Email
                  </button>
                </div>

                <div className="text-center pt-1">
                  <button
                    type="button"
                    onClick={() => handleSwitchView('login')}
                    className="inline-flex items-center space-x-1.5 text-xs text-gray-400 hover:text-white transition-colors"
                  >
                    <FontAwesomeIcon icon={faArrowLeft} className="text-[10px]" />
                    <span>Back to Sign In</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ======================================================== */}
          {/* VIEW 4: STEP 3 - CREATE NEW PASSWORD MODAL / FORM         */}
          {/* ======================================================== */}
          {view === 'reset_password' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="text-center pb-2">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 mb-2">
                  <FontAwesomeIcon icon={faLock} />
                </div>
                <h3 className="text-sm font-bold text-white">Create New Admin Password</h3>
                <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">
                  Enter your new password below for <span className="text-blue-400 font-semibold">{resetEmail}</span>.
                </p>
              </div>

              <div className="flex items-center justify-center space-x-2 text-[10px] font-semibold text-emerald-400 bg-emerald-950/30 py-1 px-2.5 rounded-lg border border-emerald-800/30">
                <span className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[9px]">3</span>
                <span>Step 3: Set New Password</span>
              </div>

              <form onSubmit={handleConfirmReset} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    New Password
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 text-xs">
                      <FontAwesomeIcon icon={faLock} />
                    </span>
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      required
                      autoFocus
                      minLength={8}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="At least 8 characters"
                      className="block w-full pl-9 pr-9 py-2.5 bg-gray-800/80 border border-gray-700 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-300 text-xs focus:outline-none"
                    >
                      <FontAwesomeIcon icon={showNewPassword ? faEyeSlash : faEye} />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 text-xs">
                      <FontAwesomeIcon icon={faLock} />
                    </span>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      minLength={8}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat new password"
                      className="block w-full pl-9 pr-9 py-2.5 bg-gray-800/80 border border-gray-700 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-300 text-xs focus:outline-none"
                    >
                      <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center items-center space-x-2 py-2.5 px-4 border border-transparent rounded-xl shadow-md text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 transition-colors"
                  >
                    {loading ? (
                      <>
                        <FontAwesomeIcon icon={faSpinner} className="animate-spin text-sm" />
                        <span>Updating Password...</span>
                      </>
                    ) : (
                      <>
                        <FontAwesomeIcon icon={faCheckCircle} className="text-sm" />
                        <span>Confirm & Reset Password</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => handleSwitchView('forgot_otp')}
                    className="inline-flex items-center space-x-1.5 text-xs text-gray-400 hover:text-white transition-colors"
                  >
                    <FontAwesomeIcon icon={faArrowLeft} className="text-[10px]" />
                    <span>Back to OTP Code</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
