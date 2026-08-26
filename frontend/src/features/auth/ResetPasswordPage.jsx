import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Label, Input, PasswordInput } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { confirmPasswordReset } from '../../services/endpoints';
import { CheckCircle2, Check, X, BrainCircuit, Cpu, Sparkles, BookOpen, Code2, Rocket } from 'lucide-react';
import { cn } from '../../utils/cn';

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const initialEmail = searchParams.get('email') || '';
  const initialOtp = searchParams.get('otp') || '';

  const [formData, setFormData] = useState({
    email: initialEmail,
    otp_code: initialOtp,
    new_password: '',
    confirm_password: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const rules = [
    { label: "At least 8 characters", valid: formData.new_password.length >= 8 },
    { label: "Contains uppercase letter", valid: /[A-Z]/.test(formData.new_password) },
    { label: "Contains lowercase letter", valid: /[a-z]/.test(formData.new_password) },
    { label: "Contains number", valid: /[0-9]/.test(formData.new_password) },
    { label: "Contains special character", valid: /[^A-Za-z0-9]/.test(formData.new_password) },
  ];

  const isPasswordValid = rules.every(rule => rule.valid);
  const passwordsMatch = formData.new_password && formData.new_password === formData.confirm_password;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.otp_code || !formData.new_password) {
      setError("Please fill in all fields.");
      return;
    }

    if (!isPasswordValid) {
      setError("Please meet all password requirements.");
      return;
    }

    if (!passwordsMatch) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await confirmPasswordReset(formData.email, formData.otp_code, formData.new_password);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      console.error(err);
      let errMsg = "Failed to reset password. OTP may be invalid or expired.";
      if (err.response?.data?.detail) {
        if (!Array.isArray(err.response.data.detail)) {
          errMsg = err.response.data.detail;
        }
      }
      setError(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="relative min-h-screen pt-24 pb-12 flex items-center justify-center bg-[#F8F9FA] dark:bg-[#071225]">
        <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[10%] left-[15%] w-64 h-64 bg-purple-200/40 dark:bg-purple-900/20 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-lighten animate-blob"></div>
          <div className="absolute top-[40%] right-[15%] w-72 h-72 bg-amber/20 dark:bg-amber/10 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-lighten animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-[30%] w-80 h-80 bg-blue-200/40 dark:bg-blue-900/20 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-lighten animate-blob animation-delay-4000"></div>
        </div>

        <div className="w-full max-w-md relative z-10 px-6">
          <div className="bg-white/90 dark:bg-surface-dark/95 backdrop-blur-xl border border-white/40 dark:border-white/10 rounded-[2.5rem] p-10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-[28px] font-heading font-black text-gray-900 dark:text-white tracking-tight mb-4">
              Reset Complete
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium leading-relaxed mb-8">
              Your password has been successfully updated. Redirecting to login...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen pt-24 pb-12 flex items-center justify-center bg-[#F8F9FA] dark:bg-[#071225]">
      
      {/* Playful Floating Background Elements (Fixed) */}
      <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[15%] w-64 h-64 bg-purple-200/40 dark:bg-purple-900/20 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-lighten animate-blob"></div>
        <div className="absolute top-[40%] right-[15%] w-72 h-72 bg-amber/20 dark:bg-amber/10 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-lighten animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-[30%] w-80 h-80 bg-blue-200/40 dark:bg-blue-900/20 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-lighten animate-blob animation-delay-4000"></div>
        
        <div className="absolute top-[20%] left-[20%] animate-bounce" style={{ animationDuration: '4s' }}>
          <BrainCircuit className="w-10 h-10 text-gray-400/50 dark:text-gray-500/50 rotate-12" />
        </div>
        <div className="absolute top-[30%] right-[20%] animate-bounce" style={{ animationDuration: '5s' }}>
          <Rocket className="w-12 h-12 text-amber/40 dark:text-amber/20 -rotate-12" />
        </div>
        <div className="absolute bottom-[20%] left-[25%] animate-bounce" style={{ animationDuration: '6s' }}>
          <Code2 className="w-8 h-8 text-blue-400/50 dark:text-blue-500/30 -rotate-6" />
        </div>
        <div className="absolute bottom-[15%] right-[25%] animate-bounce" style={{ animationDuration: '4.5s' }}>
          <BookOpen className="w-10 h-10 text-purple-400/40 dark:text-purple-500/30 rotate-12" />
        </div>
        <div className="absolute top-[50%] left-[10%] animate-pulse">
          <Sparkles className="w-6 h-6 text-amber/50" />
        </div>
        <div className="absolute top-[60%] right-[10%] animate-pulse">
          <Cpu className="w-8 h-8 text-gray-400/40" />
        </div>
      </div>

      <div className="w-full max-w-md relative z-10 px-6">
        <div className="bg-white/90 dark:bg-surface-dark/95 backdrop-blur-xl border border-white/40 dark:border-white/10 rounded-[2.5rem] p-8 sm:p-10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)]">
          
          <div className="text-center mb-8">
            <h1 className="text-[28px] font-heading font-black text-gray-900 dark:text-white tracking-tight mb-2">
              New Password
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium leading-relaxed max-w-[260px] mx-auto">
              Enter the OTP sent to your email and your new password.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm font-medium text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {!initialEmail && (
              <div>
                <Input 
                  id="email" name="email" type="email" placeholder="Email Address"
                  value={formData.email} onChange={handleChange} 
                  disabled={isLoading} required 
                  className="!bg-[#F5F6F8] dark:!bg-white/5 border-transparent focus:!border-amber shadow-inner rounded-2xl py-3.5 placeholder:text-gray-400"
                />
              </div>
            )}
            
            <div>
              <Input 
                id="otp_code" name="otp_code" type="text"
                placeholder="OTP Code (e.g. 123456)"
                value={formData.otp_code} onChange={handleChange} 
                disabled={isLoading} required 
                className="!bg-[#F5F6F8] dark:!bg-white/5 border-transparent focus:!border-amber shadow-inner rounded-2xl py-3.5 placeholder:text-gray-400 tracking-widest text-center"
              />
            </div>

            <div>
              <PasswordInput 
                id="new_password" name="new_password" placeholder="New Password"
                value={formData.new_password} onChange={handleChange} 
                disabled={isLoading} required 
                className="!bg-[#F5F6F8] dark:!bg-white/5 border-transparent focus:!border-amber shadow-inner rounded-2xl py-3.5 placeholder:text-gray-400"
              />
            </div>
            
            <div className="bg-[#F5F6F8] dark:bg-white/5 p-4 rounded-2xl shadow-inner">
              <p className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">Password must contain:</p>
              <ul className="flex flex-col gap-1.5">
                {rules.map((rule, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-xs">
                    {rule.valid ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <X className="w-4 h-4 text-gray-400 dark:text-gray-600" />
                    )}
                    <span className={cn("font-medium", rule.valid ? "text-gray-700 dark:text-gray-300" : "text-gray-400 dark:text-gray-500")}>
                      {rule.label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <PasswordInput 
                id="confirm_password" name="confirm_password" placeholder="Confirm New Password"
                value={formData.confirm_password} onChange={handleChange} 
                disabled={isLoading} required 
                className="!bg-[#F5F6F8] dark:!bg-white/5 border-transparent focus:!border-amber shadow-inner rounded-2xl py-3.5 placeholder:text-gray-400"
              />
              {formData.confirm_password && (
                <p className={cn("text-xs mt-2 font-bold px-2", passwordsMatch ? "text-green-500" : "text-red-500")}>
                  {passwordsMatch ? "✓ Passwords match" : "✗ Passwords do not match"}
                </p>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full mt-4 bg-[#FFB347] hover:bg-[#FFA012] text-white shadow-[0_8px_20px_rgba(255,179,71,0.4)] hover:-translate-y-0.5 transition-all rounded-2xl py-4 font-body font-bold text-base normal-case tracking-normal" 
              disabled={isLoading || !isPasswordValid || !passwordsMatch}
            >
              {isLoading ? 'Resetting Password...' : 'Reset Password'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
