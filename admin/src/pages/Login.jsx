import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../api/auth';
import { Routes } from '../routes';
import KineticGrid from '../components/ui/kinetic-grid';
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
  faUserShield,
  faFingerprint,
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

  // OTP Resend cooldown timer
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

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
    if (e) e.preventDefault();
    if (!resetEmail) {
      setError('Please enter your email address.');
      return;
    }
    if (resendCooldown > 0) return;

    resetAllFeedback();
    setLoading(true);

    try {
      const res = await authAPI.requestPasswordReset(resetEmail);
      setSuccessMsg(res?.message || 'Security OTP code sent! Please check your email inbox.');
      setResendCooldown(60); // 60s cooldown
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
      setError('Please enter a valid 6-digit One-Time Password (OTP).');
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
      setSuccessMsg(res?.message || 'Password successfully updated! Please sign in with your new credentials.');
    } catch (err) {
      console.error(err);
      const detail = err.response?.data?.detail;
      setError(typeof detail === 'string' ? detail : 'Invalid or expired OTP code.');
      if (typeof detail === 'string' && detail.toLowerCase().includes('otp')) {
        setView('forgot_otp');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KineticGrid globalColor="default" className="min-h-screen flex flex-col justify-center py-10 sm:px-6 lg:px-8 relative overflow-hidden select-none">
      {/* Background Multi-Layer Ambient Glow Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[36rem] h-[36rem] bg-blue-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[28rem] h-[28rem] bg-indigo-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-10 left-10 w-80 h-80 bg-cyan-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Header & Platform Branding */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center px-4">
        <div className="inline-flex relative group mb-3">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full blur opacity-70 group-hover:opacity-100 transition duration-500 animate-pulse" />
          <img
            src="/logo.png"
            alt="AI Hub Logo"
            className="relative w-16 h-16 object-cover rounded-full shadow-2xl ring-2 ring-white/30 bg-gray-900"
          />
        </div>

        <div className="flex items-center justify-center space-x-2 mb-1">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-blue-500/10 text-blue-400 border border-blue-500/20 backdrop-blur-md">
            <FontAwesomeIcon icon={faShieldAlt} className="mr-1 text-[9px]" />
            Encrypted Admin Gateway
          </span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white drop-shadow-lg">
          SignAI Admin Portal
        </h2>
        <p className="mt-1 text-xs text-gray-400 font-medium">
          Signal Processing Club — Super Admin Control Panel
        </p>
      </div>

      {/* Main Glassmorphic Card Container */}
      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        <div className="bg-gray-900/60 backdrop-blur-2xl border border-white/10 py-7 px-6 sm:px-9 shadow-[0_8px_32px_0_rgba(0,0,0,0.45)] ring-1 ring-white/5 rounded-3xl relative overflow-hidden">
          {/* Subtle Top Edge Light Reflection */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-400/40 to-transparent pointer-events-none" />

          {/* Error Feedback Banner */}
          {error && (
            <div className="mb-5 p-3.5 bg-red-950/70 border border-red-500/40 backdrop-blur-md rounded-2xl flex items-start space-x-2.5 text-red-200 text-xs shadow-lg shadow-red-950/50 animate-in fade-in zoom-in-95 duration-200">
              <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-400 mt-0.5 flex-shrink-0 text-sm" />
              <span className="leading-relaxed font-medium">{error}</span>
            </div>
          )}

          {/* Success Feedback Banner */}
          {successMsg && (
            <div className="mb-5 p-3.5 bg-emerald-950/70 border border-emerald-500/40 backdrop-blur-md rounded-2xl flex items-start space-x-2.5 text-emerald-200 text-xs shadow-lg shadow-emerald-950/50 animate-in fade-in zoom-in-95 duration-200">
              <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-400 mt-0.5 flex-shrink-0 text-sm" />
              <span className="leading-relaxed font-medium">{successMsg}</span>
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
                <div className="relative group">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 group-focus-within:text-blue-400 text-xs transition-colors pointer-events-none">
                    <FontAwesomeIcon icon={faEnvelope} />
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@test.com"
                    className="block w-full pl-9 pr-3.5 py-2.5 bg-white/[0.05] border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/70 focus:bg-white/[0.08] focus:ring-4 focus:ring-blue-500/20 backdrop-blur-md transition-all"
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
                <div className="relative group">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 group-focus-within:text-blue-400 text-xs transition-colors pointer-events-none">
                    <FontAwesomeIcon icon={faLock} />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="block w-full pl-9 pr-10 py-2.5 bg-white/[0.05] border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/70 focus:bg-white/[0.08] focus:ring-4 focus:ring-blue-500/20 backdrop-blur-md transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-white text-xs focus:outline-none transition-colors"
                  >
                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center items-center space-x-2 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 hover:from-blue-500 hover:via-indigo-500 hover:to-blue-500 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 focus:outline-none focus:ring-4 focus:ring-blue-500/30 disabled:opacity-50 transition-all transform active:scale-[0.98] cursor-pointer"
                >
                  {loading ? (
                    <>
                      <FontAwesomeIcon icon={faSpinner} className="animate-spin text-sm" />
                      <span>Signing In Securely...</span>
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faUserShield} className="text-sm" />
                      <span>Sign In to Super Admin</span>
                    </>
                  )}
                </button>
              </div>

              {/* Password Reset Callout Banner */}
              <div className="mt-5 pt-4 border-t border-white/10 text-center">
                <p className="text-[11px] text-gray-400 mb-2 leading-relaxed">
                  If you forgot your password, click below to receive a One-Time Password (OTP) via email to reset it securely.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setResetEmail(email || '');
                    handleSwitchView('forgot_email');
                  }}
                  className="inline-flex items-center space-x-1.5 text-xs font-bold text-blue-300 hover:text-white py-1.5 px-3.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 backdrop-blur-md transition-all cursor-pointer shadow-sm"
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
              <div className="text-center pb-1">
                <div className="inline-flex items-center justify-center w-11 h-11 rounded-2xl bg-blue-500/15 text-blue-400 border border-blue-500/30 mb-2 shadow-inner">
                  <FontAwesomeIcon icon={faKey} className="text-base" />
                </div>
                <h3 className="text-sm font-bold text-white">Forgot Password? Reset via OTP</h3>
                <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">
                  Enter your registered admin email below to receive a secure One-Time Password.
                </p>
              </div>

              <div className="flex items-center justify-center space-x-2 text-[10px] font-semibold text-blue-300 bg-blue-500/10 py-1.5 px-3 rounded-xl border border-blue-500/20 backdrop-blur-md">
                <span className="w-4 h-4 rounded-full bg-blue-500 text-white flex items-center justify-center text-[9px] font-bold">1</span>
                <span>Step 1 of 3: Enter Registered Email</span>
              </div>

              <form onSubmit={handleRequestOTP} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Registered Super Admin Email
                  </label>
                  <div className="relative group">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 group-focus-within:text-blue-400 text-xs transition-colors pointer-events-none">
                      <FontAwesomeIcon icon={faEnvelope} />
                    </span>
                    <input
                      type="email"
                      required
                      autoFocus
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder="admin@test.com"
                      className="block w-full pl-9 pr-3.5 py-2.5 bg-white/[0.05] border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/70 focus:bg-white/[0.08] focus:ring-4 focus:ring-blue-500/20 backdrop-blur-md transition-all"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading || resendCooldown > 0}
                    className="w-full flex justify-center items-center space-x-2 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 hover:from-blue-500 hover:via-indigo-500 hover:to-blue-500 shadow-lg shadow-blue-500/30 focus:outline-none focus:ring-4 focus:ring-blue-500/30 disabled:opacity-50 transition-all transform active:scale-[0.98] cursor-pointer"
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
              <div className="text-center pb-1">
                <div className="inline-flex items-center justify-center w-11 h-11 rounded-2xl bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 mb-2 shadow-inner">
                  <FontAwesomeIcon icon={faFingerprint} className="text-base" />
                </div>
                <h3 className="text-sm font-bold text-white">Enter OTP Verification Code</h3>
                <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">
                  We sent a 6-digit verification code to <span className="text-blue-300 font-semibold">{resetEmail}</span>.
                </p>
              </div>

              <div className="flex items-center justify-center space-x-2 text-[10px] font-semibold text-indigo-300 bg-indigo-500/10 py-1.5 px-3 rounded-xl border border-indigo-500/20 backdrop-blur-md">
                <span className="w-4 h-4 rounded-full bg-indigo-500 text-white flex items-center justify-center text-[9px] font-bold">2</span>
                <span>Step 2 of 3: Verify Security OTP</span>
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
                      className="block w-full py-3 bg-white/[0.07] border border-white/15 rounded-xl text-center text-lg tracking-[0.3em] font-mono font-black text-blue-300 placeholder-gray-600 focus:outline-none focus:border-indigo-400 focus:bg-white/[0.1] focus:ring-4 focus:ring-indigo-500/20 backdrop-blur-md transition-all shadow-inner"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center items-center space-x-2 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-600 hover:from-indigo-500 hover:via-blue-500 hover:to-indigo-500 shadow-lg shadow-indigo-500/30 focus:outline-none focus:ring-4 focus:ring-indigo-500/30 disabled:opacity-50 transition-all transform active:scale-[0.98] cursor-pointer"
                  >
                    <FontAwesomeIcon icon={faKey} className="text-xs" />
                    <span>Proceed to Reset Password</span>
                  </button>
                </div>

                <div className="flex items-center justify-between text-xs pt-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={handleRequestOTP}
                    disabled={loading || resendCooldown > 0}
                    className="inline-flex items-center space-x-1 text-blue-400 hover:text-blue-300 disabled:text-gray-500 transition-colors"
                  >
                    <FontAwesomeIcon icon={faRedo} className="text-[10px]" />
                    <span>{resendCooldown > 0 ? `Resend OTP (${resendCooldown}s)` : 'Resend OTP Code'}</span>
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
          {/* VIEW 4: STEP 3 - CREATE NEW PASSWORD FORM                 */}
          {/* ======================================================== */}
          {view === 'reset_password' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="text-center pb-1">
                <div className="inline-flex items-center justify-center w-11 h-11 rounded-2xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 mb-2 shadow-inner">
                  <FontAwesomeIcon icon={faLock} className="text-base" />
                </div>
                <h3 className="text-sm font-bold text-white">Create New Super Admin Password</h3>
                <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">
                  Enter your new password below for <span className="text-blue-300 font-semibold">{resetEmail}</span>.
                </p>
              </div>

              <div className="flex items-center justify-center space-x-2 text-[10px] font-semibold text-emerald-300 bg-emerald-500/10 py-1.5 px-3 rounded-xl border border-emerald-500/20 backdrop-blur-md">
                <span className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[9px] font-bold">3</span>
                <span>Step 3 of 3: Set New Password</span>
              </div>

              <form onSubmit={handleConfirmReset} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    New Password
                  </label>
                  <div className="relative group">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 group-focus-within:text-emerald-400 text-xs transition-colors pointer-events-none">
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
                      className="block w-full pl-9 pr-10 py-2.5 bg-white/[0.05] border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/70 focus:bg-white/[0.08] focus:ring-4 focus:ring-emerald-500/20 backdrop-blur-md transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-white text-xs focus:outline-none transition-colors"
                    >
                      <FontAwesomeIcon icon={showNewPassword ? faEyeSlash : faEye} />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Confirm New Password
                  </label>
                  <div className="relative group">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 group-focus-within:text-emerald-400 text-xs transition-colors pointer-events-none">
                      <FontAwesomeIcon icon={faLock} />
                    </span>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      minLength={8}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat new password"
                      className="block w-full pl-9 pr-10 py-2.5 bg-white/[0.05] border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/70 focus:bg-white/[0.08] focus:ring-4 focus:ring-emerald-500/20 backdrop-blur-md transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-white text-xs focus:outline-none transition-colors"
                    >
                      <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center items-center space-x-2 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:from-emerald-500 hover:via-teal-500 hover:to-emerald-500 shadow-lg shadow-emerald-500/30 focus:outline-none focus:ring-4 focus:ring-emerald-500/30 disabled:opacity-50 transition-all transform active:scale-[0.98] cursor-pointer"
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
    </KineticGrid>
  );
}
