import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Label, Input, PasswordInput } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { confirmPasswordReset } from '../../services/endpoints';
import { CheckCircle2, Check, X } from 'lucide-react';
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
      <div className="pt-32 pb-24 px-6 md:px-8 max-w-[1280px] mx-auto min-h-[80vh] flex flex-col justify-center items-center">
        <div className="w-full max-w-md bg-white dark:bg-surface-dark border border-gray-100 dark:border-gray-800 rounded-3xl p-10 shadow-2xl text-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-heading font-black text-navy dark:text-white mb-4">
            Password Reset Complete
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8">
            Your password has been successfully updated. Redirecting to login...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 px-6 md:px-8 max-w-[1280px] mx-auto min-h-[80vh] flex flex-col justify-center items-center">
      <div className="w-full max-w-md bg-white dark:bg-surface-dark border border-gray-100 dark:border-gray-800 rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden">
        
        <div className="relative z-10 mb-8">
          <h1 className="text-2xl font-heading font-black text-navy dark:text-white mb-3">
            Create New Password
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Enter the OTP sent to your email and your new password below.
          </p>
        </div>

        {error && (
          <div className="relative z-10 mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="relative z-10 flex flex-col gap-5">
          {!initialEmail && (
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input 
                id="email" name="email" type="email"
                value={formData.email} onChange={handleChange} 
                disabled={isLoading} required 
              />
            </div>
          )}
          
          <div>
            <Label htmlFor="otp_code">OTP Code</Label>
            <Input 
              id="otp_code" name="otp_code" type="text"
              placeholder="e.g. 123456"
              value={formData.otp_code} onChange={handleChange} 
              disabled={isLoading} required 
            />
          </div>

          <div>
            <Label htmlFor="new_password">New Password</Label>
            <PasswordInput 
              id="new_password" name="new_password" 
              value={formData.new_password} onChange={handleChange} 
              disabled={isLoading} required 
            />
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
            <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Password must contain:</p>
            <ul className="flex flex-col gap-1.5">
              {rules.map((rule, idx) => (
                <li key={idx} className="flex items-center gap-2 text-xs">
                  {rule.valid ? (
                    <Check className="w-3.5 h-3.5 text-green-500" />
                  ) : (
                    <X className="w-3.5 h-3.5 text-gray-400 dark:text-gray-600" />
                  )}
                  <span className={cn(rule.valid ? "text-gray-700 dark:text-gray-300" : "text-gray-400 dark:text-gray-500")}>
                    {rule.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <Label htmlFor="confirm_password">Confirm New Password</Label>
            <PasswordInput 
              id="confirm_password" name="confirm_password" 
              value={formData.confirm_password} onChange={handleChange} 
              disabled={isLoading} required 
            />
            {formData.confirm_password && (
              <p className={cn("text-xs mt-1.5 font-medium", passwordsMatch ? "text-green-500" : "text-red-500")}>
                {passwordsMatch ? "Passwords match" : "Passwords do not match"}
              </p>
            )}
          </div>

          <Button type="submit" size="lg" className="w-full mt-2" disabled={isLoading || !isPasswordValid || !passwordsMatch}>
            {isLoading ? 'Resetting Password...' : 'Reset Password'}
          </Button>
        </form>
      </div>
    </div>
  );
}
